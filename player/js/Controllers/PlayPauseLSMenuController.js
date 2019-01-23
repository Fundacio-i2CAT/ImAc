/*
 The PlayPauseLSMenuController takes care for the play/pause/seek actions.

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
    
    - updatePlayOutTime (public)
    - pauseAllFunc (public)
    - playAllFunc (public)
    - PlayPauseFunc (private)
    - SeekFunc (private)
    - playoutTimeDisplayLogic (private)

 This controller is part of the MVC:
    - (M) /player/js/Models/PlayPauseLSMenuModel.js
    - (V) /player/js/Views/PlayPauseLSMenuView.js
    - (C) /player/js/Controllers/PlayPauseLSMenuController.js

 */
function PlayPauseLSMenuController() {

	var data;
	var view;
	var viewStructure;

    var PlayPauseMemory = false;

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

		view = new PlayPauseLSMenuView();
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
 * @return     {PlayPauseLSMenuModel}  The data.
 */
    function GetData()
	{
	    if (data == null)
	    {
	        data = new PlayPauseLSMenuModel();
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
		data.isPaused = VideoController.isPausedById(0);
        data.playOutTimeText = VideoController.getPlayoutTime(VideoController.getListOfVideoContents()[0].vid.currentTime);
        data.isPlayOutTimeVisible = (menuMgr.getMenuType() == 1) ? false : true;

		data.playpauseMenuButtonFunc = function(){ AddVisualFeedbackOnClick(VideoController.isPausedById(0) ? 'playButton' : 'pauseButton', function(){ PlayPauseFunc()} )};
		data.seekForwardMenuButtonFunc = function(){ AddVisualFeedbackOnClick('forwardSeekButton',  function(){ SeekFunc(true)} )};
		data.seekBackMenuButtonFunc = function(){ AddVisualFeedbackOnClick('backSeekButton',  function(){ SeekFunc(false)} )};
        data.backMenuButtonFunc = function(){ AddVisualFeedbackOnClick('backMenuButton', function(){ menuMgr.NavigateBackMenu()} )};
        data.forwardMenuButtonFunc = function(){ AddVisualFeedbackOnClick('forwardMenuButton', function(){menuMgr.NavigateForwardMenu()} )};
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
    		if(intrElement.visible && intrElement.children.length > 0 )
    		{
    			interController.addInteractiveObject(intrElement);
    		}
    	})
    }

/**
 * { function_description }
 */
    this.updatePlayOutTime = function()
    {
        UpdateData();
        view.UpdateView(data);
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
 */
    this.pauseAllFunc = function()
    {
        PlayPauseMemory = true;
        VideoController.pauseAll();
        UpdateData();
        view.UpdateView(data);
        AddInteractivityToMenuElements();
    }

/**
 * { function_description }
 * 
 * @function   playAllFunc (name)
 */
    this.playAllFunc = function()
    {
        if ( PlayPauseMemory )
        {
            PlayPauseMemory = false;
            VideoController.playAll();
            UpdateData();
            view.UpdateView(data);
            //AddInteractivityToMenuElements();
        }
    }
/**
 * { function_description }
 *
 * @function      PlayPauseFunc (name)
 */
	function PlayPauseFunc()
    {
        VideoController.isPausedById(0) ? VideoController.playAll() : VideoController.pauseAll();
		UpdateData();
		view.UpdateView(data);
    	AddInteractivityToMenuElements();

        playoutTimeDisplayLogic();
    }

/**
 * { function_description }
 *
 * @function      SeekFunc (name)
 * @param      {number}  plus    The plus
 */
    function SeekFunc(plus)
    {
        var sign = plus ? 1 : -1;
        VideoController.seekAll( 5*sign );
        UpdateData();
		view.UpdateView(data);

        playoutTimeDisplayLogic();
    }

/**
 * { function_description }
 * 
 * @function   playoutTimeDisplayLogic (name)
 */
    function playoutTimeDisplayLogic()
    {
        if(menuMgr.getMenuType() == 1)
        {
            data.isPlayOutTimeVisible = true;
            view.UpdateView(data);

            setTimeout(function(){ 
                data.isPlayOutTimeVisible = false;
                view.UpdateView(data);
            }, 500);    
        }
        
    };
}