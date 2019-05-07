/*
 The PlayPauseMenuController takes care for the play/pause/seek actions.

 This controller has some core functionalities:

    - Init (public)
    - Exit (public)
    - getMenuName (public)
    - getMenuIndex (public)
    - GetData (private)
    - UpdateData (private)
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
function PlayPauseMenuController() {

    let data;
	let view;
	let viewStructure;

    let PlayPauseMemory = false;

/**
 * This function initializes the data model with GetData() and updates the values with UpdateData() function.
 * It loads the viewStructure created in the MenuManager and turns its visibility to true.
 * It loads the view and updates any element that has changed with the new data in UpdateView(data).
 * Adds all the visible interactive elements to the 'interactiveListObjects' array stated in Managers/InteractionsController.js
 *
 * @return {[type]} [description]
 */
    this.Init = function(){
		data = GetData();
		UpdateData();
		viewStructure = scene.getObjectByName(data.name);
		viewStructure.visible = true;
		view = new PlayPauseMenuView();
		view.UpdateView(data);
        menuMgr.AddInteractionIfVisible(viewStructure);
	};

/**
 * This function 'closes' the submenu page.
 * Removes all the interactive elements from the 'interactiveListObjects' array stated in Managers/InteractionsController.js
 * Hides the viewStructure.
 * This function is called when closing the menu or when navigating through the different menus in the Enhaced-Accessibility.
 *
 * @function      Exit (name)
 */
    this.Exit = function(){
    // Works if the viewStructure is loaded.
        if(viewStructure){
            viewStructure.visible = false;
            viewStructure.children.forEach(function(intrElement){
                interController.removeInteractiveObject(intrElement.name);
            });
        }
    };

/**
 * Gets the menu name.
 *
 * @return     {<type>}  The menu name.
 */
    this.getMenuName = function(){
    	return data.name;
    };

/**
 * Gets the menu index.
 *
 * @return     {<type>}  The menu index.
 */
    this.getMenuIndex = function(){
        return -1;
    };

/**
 * Gets the data.
 *
 * @class      GetData (name)
 * @return     {PlayPauseMenuModel}  The data.
 */
    function GetData(){
        if (data == null){
            data = new PlayPauseMenuModel();
        }
        return data;
    };

/**
 * { function_description }
 *
 * @class      UpdateData (name)
 */
	function UpdateData(){
		data.isPaused = VideoController.isPausedById(0);
    
		data.playpauseMenuButtonFunc = function(){ AddVisualFeedbackOnClick(VideoController.isPausedById(0) ? 'play-button' : 'pause-button', function(){ PlayPauseFunc()} )};
		data.seekForwardMenuButtonFunc = function(){ AddVisualFeedbackOnClick('forward-seek-button',  function(){ SeekFunc(true)} )};
		data.seekBackMenuButtonFunc = function(){ AddVisualFeedbackOnClick('back-seek-button',  function(){ SeekFunc(false)} )};
        //data.backMenuButtonFunc = function(){ AddVisualFeedbackOnClick('backMenuButton', function(){ menuMgr.NavigateBackMenu()} )};
        //data.forwardMenuButtonFunc = function(){ AddVisualFeedbackOnClick('forwardMenuButton', function(){menuMgr.NavigateForwardMenu()} )};
        data.closeMenuButtonFunc = function(){ AddVisualFeedbackOnClick('close-button', function(){ menuMgr.ResetViews()} )};
        //data.previewButtonFunc = function(){ AddVisualFeedbackOnClick('previewMenuButton', function(){menuMgr.OpenPreview()} )};
        data.isPreviewVisible = false;
    };

/**
 * { function_description }
 */
    this.updatePlayOutTime = function(){
        UpdateData();
        view.UpdateView(data);
    };

/**
 * Adds a visual feedback on click.
 *
 * @class      AddVisualFeedbackOnClick (name)
 * @param      {<type>}    buttonName  The button name
 * @param      {Function}  callback    The callback
 */
    function AddVisualFeedbackOnClick(buttonName, callback){
        data.clickedButtonName = buttonName;
        view.pressButtonFeedback(data);
        setTimeout(callback, 300);
    };

/**
 * { function_description }
 */
    this.pauseAllFunc = function(){
        PlayPauseMemory = true;
        VideoController.pauseAll();
        UpdateData();
        view.UpdateView(data);
        menuMgr.AddInteractionIfVisible(viewStructure);
    };

/**
 * { function_description }
 *
 * @function   playAllFunc (name)
 */
  this.playAllFunc = function(){
    if ( PlayPauseMemory ){
        PlayPauseMemory = false;
        VideoController.playAll();
        UpdateData();
        view.UpdateView(data);
    }
  };
/**
 * { function_description }
 *
 * @function      PlayPauseFunc (name)
 */
	function PlayPauseFunc(){
        VideoController.isPausedById(0) ? VideoController.playAll() : VideoController.pauseAll();
		UpdateData();
		view.UpdateView(data);
        menuMgr.AddInteractionIfVisible(viewStructure);
    };

/**
 * { function_description }
 *
 * @function      SeekFunc (name)
 * @param      {number}  plus    The plus
 */
    function SeekFunc(plus){
        var sign = plus ? 1 : -1;
        VideoController.seekAll( 5*sign );
        UpdateData();
        view.UpdateView(data);
    };
};
