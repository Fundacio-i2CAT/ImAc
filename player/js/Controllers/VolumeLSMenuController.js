/*
 The VolumeLSMenuController takes care for the 

 This controller has some core functionalities:

    - Init (public) 
    - Exit (public)
    - getMenuName (public)
    - getMenuIndex (public)
    - GetData (private)
    - UpdateData (private)
    - AddInteractivityToMenuElements (private)
    - AddVisualFeedbackOnClick (private)

    ... and some unique functionalities of this particular controller:
    
    - ChangeVolumeFunc (private)
    - MuteUnmuteVolumeFunc (private)
    - volumeLevelDisplayLogic (private)

 This controller is part of the MVC:
    - (M) /player/js/Models/VolumeLSMenuModel.js
    - (V) /player/js/Views/VolumeLSMenuView.js
    - (C) /player/js/Controllers/VolumeLSMenuController.js
 */
function VolumeLSMenuController() {

	var data;
	var view;
	var viewStructure;

/**
 * This function initializes the data model with GetData() and updates the values with UpdateData() function.
 * It loads the viewStructure created in the MenuManager and turns its visibility to true. 
 * It loads the view and updates any element that has changed with the new data in UpdateView(data). 
 * Adds all the visible interactive elements to the 'interactiveListObjects' array stated in Managers/InteractionsController.js
 *
 * @function      Init (name)
 */
	this.Init = function(){

		data = GetData();
		UpdateData();
		viewStructure = scene.getObjectByName(data.name);
		viewStructure.visible = true;

		view = new VolumeLSMenuView();
		view.UpdateView(data); 

		AddInteractivityToMenuElements();
	}

/**
 * This function 'closes' the submenu page.
 * Removes all the interactive elements from the 'interactiveListObjects' array stated in Managers/InteractionsController.js
 * Hides the viewStructure. 
 * This function is called when closing the menu or when navigating through the different menus in the Enhaced-Accessibility.
 *
 * @function      Exit (name)
 */
	this.Exit = function()
    {
        // Works if the viewStructure is loaded.
    	if(viewStructure)
    	{
	    	viewStructure.visible = false;
	    	viewStructure.children.forEach(function(intrElement){
	    		interController.removeInteractiveObject(intrElement.name);
	    	})
    	}
    }

/**
 * Gets the menu name.
 *
 * @return     {<type>}  The menu name.
 */
	this.getMenuName = function()
    {
    	return data.name;
    }

/**
 * Gets the menu index.
 *
 * @return     {<type>}  The menu index.
 */
	this.getMenuIndex = function()
    {
        return -1;
    }

/**
 * Gets the data.
 *
 * @class      GetData (name)
 * @return     {VolumeLSMenuModel}  The data.
 */
    function GetData()
	{
	    if (data == null)
	    {
	        data = new VolumeLSMenuModel();
	    }
	    return data;
	}

/**
 * { function_description }
 *
 * @class      UpdateData (name)
 */
	function UpdateData()
    {
    	data.volumeLevel = _AudioManager.getVolume()*100+'%';
    	data.isVolumeLevelVisible = false;
		data.isMuted = _AudioManager.isAudioMuted();

		data.muteUnmuteMenuButtonFunc = function(){ AddVisualFeedbackOnClick(_AudioManager.isAudioMuted() ? 'unmuteVolumeButton' : 'muteVolumeButton', function(){ MuteUnmuteVolumeFunc()} )}; 
		data.plusVolumeMenuButtonFunc = function(){ AddVisualFeedbackOnClick('plusVolumeButton', function(){ ChangeVolumeFunc(true)} )};
		data.minusVolumeMenuButtonFunc = function(){ AddVisualFeedbackOnClick('minusVolumeButton', function(){ ChangeVolumeFunc(false)} )};
		data.backMenuButtonFunc = function(){ AddVisualFeedbackOnClick('backMenuButton', function(){ menuMgr.NavigateBackMenu()} )};
		data.forwardMenuButtonFunc = function(){ AddVisualFeedbackOnClick('forwardMenuButton', function(){ menuMgr.NavigateForwardMenu()} )};
		data.closeMenuButtonFunc = function(){ AddVisualFeedbackOnClick('closeMenuButton', function(){ menuMgr.ResetViews()} )};
        //data.previewButtonFunc = function(){ AddVisualFeedbackOnClick('previewMenuButton', function(){menuMgr.OpenPreview()} )};
        data.isPreviewVisible = false;
    }

/**
 * Adds interactivity to menu elements.
 *
 * @class      AddInteractivityToMenuElements (name)
 */
    function AddInteractivityToMenuElements()
    {
    	viewStructure.children.forEach(function(intrElement){
    		if(intrElement.visible)
    		{
    			interController.addInteractiveObject(intrElement);
    		}
    	})
    }

/**
 * Adds a visual feedback on click.
 *
 * @class      AddVisualFeedbackOnClick (name)
 * @param      {<type>}    buttonName  The button name
 * @param      {Function}  callback    The callback
 */
	function AddVisualFeedbackOnClick(buttonName, callback)
    {
    	data.clickedButtonName = buttonName;
		view.pressButtonFeedback(data);
		setTimeout(callback, 300);
    }

/**
 * { function_description }
 *
 * @class      ChangeVolumeFunc (name)
 * @param      {number}  plus    The plus
 */
	function ChangeVolumeFunc(plus)
    {
    	var sign = plus ? 1 : -1;
        _AudioManager.changeVolume( 0.1*sign );
        volumeLevelDisplayLogic();
    };

/**
 * { function_description }
 *
 * @class      MuteUnmuteVolumeFunc (name)
 */
    function MuteUnmuteVolumeFunc()
    {
		_AudioManager.isAudioMuted() ? _AudioManager.setunmute() : _AudioManager.setmute();
        
		UpdateData();
		view.UpdateView(data);
    	AddInteractivityToMenuElements();
    };

/**
 * { function_description }
 */
    function volumeLevelDisplayLogic()
    {
		data.volumeLevel = _AudioManager.getVolume();
        data.isVolumeLevelVisible =  true;
        view.UpdateView(data);

        setTimeout(function(){ 
        	(_AudioManager.getVolume()>0) ? _AudioManager.setunmute() : _AudioManager.setmute();
        	data.isMuted = _AudioManager.isAudioMuted();
			data.isVolumeLevelVisible =  false;
			view.UpdateView(data);
        }, 500);
    };
}