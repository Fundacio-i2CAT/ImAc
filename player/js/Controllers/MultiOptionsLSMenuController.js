/*
 The MultiOptionsLSMenuController takes care for the 

 This controller has some core functionalities:

    - Init (public) 
    - Exit (public)
    - getMenuName (public)
    - GetData (private)
    - UpdateData (private)
    - AddInteractivityToMenuElements (private)
    - AddVisualFeedbackOnClick (private)

    ... and some unique functionalities of this particular controller:
    
    - UpdateMultiOptionsIconStatus (public)

 This controller is part of the MVC:
    - (M) /player/js/Models/MultiOptionsLSMenuModel.js
    - (V) /player/js/Views/MultiOptionsLSMenuView.js
    - (C) /player/js/Controllers/MultiOptionsLSMenuController.js
 */
function MultiOptionsLSMenuController(menuType) {

	var data;
	var view;
	var viewStructure;

    var STOptionCtrl = new STOptionMenuController(menuType);
    var SLOptionCtrl = new SLOptionMenuController(menuType);
    var ADOptionCtrl = new ADOptionMenuController(menuType);
    var ASTOptionCtrl = new ASTOptionMenuController(menuType);

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

		view = new MultiOptionsLSMenuView();
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
 * Gets the data.
 *
 * @class      GetData (name)
 * @return     {MultiOptionsLSMenuModel}  The data.
 */
    function GetData()
	{
	    if (data == null)
	    {
	        data = new MultiOptionsLSMenuModel();
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
		data.isSTenabled = subController.getSubtitleEnabled(); //NEED FUNCTIONS THAT RETURNS IF THE OPTION IS ENABLED OR DISABLED
		data.isSLenabled = subController.getSignerEnabled();
		data.isADenabled = _AudioManager.getADEnabled();
		data.isASTenabled = _AudioManager.getASTEnabled();

		data.closeMenuButtonFunc = function(){ AddVisualFeedbackOnClick('closeMenuButton', function(){ menuMgr.ResetViews()} )};

		data.backMenuButtonFunc = function(){ AddVisualFeedbackOnClick('backMenuButton', function(){ menuMgr.NavigateBackMenu()} )};
		data.forwardMenuButtonFunc = function(){ AddVisualFeedbackOnClick('forwardMenuButton', function(){menuMgr.NavigateForwardMenu()} )};

		data.openSTMenuButtonFunc = function(){ AddVisualFeedbackOnClick( data.isSTenabled ? 'showSubtitlesMenuButton' : 'disabledSubtitlesMenuButton', function(){ menuMgr.Load(STOptionCtrl) })};
		data.openSLMenuButtonFunc = function(){ AddVisualFeedbackOnClick( data.isSLenabled ? 'showSignLanguageMenuButton' : 'disabledSignLanguageMenuButton', function(){ menuMgr.Load(SLOptionCtrl) })};
		data.openADMenuButtonFunc = function(){ AddVisualFeedbackOnClick( data.isADenabled ? 'showAudioDescriptionMenuButton' : 'disabledAudioDescriptionMenuButton', function(){ menuMgr.Load(ADOptionCtrl) })};	
		data.openASTMenuButtonFunc = function(){ AddVisualFeedbackOnClick( data.isASTenabled ? 'showAudioSubtitlesMenuButton' : 'disabledAudioSubtitlesMenuButton', function(){ menuMgr.Load(ASTOptionCtrl) })};
        data.previewButtonFunc = function(){ AddVisualFeedbackOnClick('previewMenuButton', function(){menuMgr.OpenPreview()} )};
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

    this.UpdateMultiOptionsIconStatus = function()
    {
		UpdateData();
    	view.UpdateMultiOptionsIconStatusView(data);
    	AddInteractivityToMenuElements();
    }
}
