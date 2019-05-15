/*
 The AccessibilityOptionsMenuController takes care for the

 This controller has some core functionalities:

    - Init (public)
    - Exit (public)
    - getMenuName (public)
    - GetData (private)
    - UpdateData (private)
    - AddVisualFeedbackOnClick (private)

    ... and some unique functionalities of this particular controller:

    - UpdateMultiOptionsIconStatus (public)

 This controller is part of the MVC:
    - (M) /player/js/Models/MultiOptionsLSMenuModel.js
    - (V) /player/js/Views/MultiOptionsLSMenuView.js
    - (C) /player/js/Controllers/MultiOptionsLSMenuController.js
 */
function AccessibilityOptionsMenuController(menuType) {

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

		view = new AccessibilityOptionsMenuView();
		view.UpdateView(data);
		menuMgr.AddInteractionIfVisible(viewStructure);
	}

/**
 * This function 'closes' the submenu page.
 * Removes all the interactive elements from the 'interactiveListObjects' array stated in Managers/InteractionsController.js
 * Hides the viewStructure.
 * This function is called when closing the menu or when navigating through the different menus in the Enhaced-Accessibility.
 *
 * @function      Exit (name)
 */
	this.Exit = function(){
    	if(viewStructure){
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
    this.getMenuName = function(){
    	return data.name;
    }

/**
 * Gets the data.
 *
 * @class      GetData (name)
 * @return     {AAccessibilityOptionsMenuModel}  The data.
 */
    function GetData(){
	    if (data == null){
	        data = new AccessibilityOptionsMenuModel();
	    }
	    return data;
	}

/**
 * { function_description }
 *
 * @class      UpdateData (name)
 */
	function UpdateData(){
		data.isSTenabled = subController.getSubtitleEnabled();
		data.isSLenabled = subController.getSignerEnabled();
		data.isADenabled = _AudioManager.getADEnabled();
		data.isASTenabled = _AudioManager.getASTEnabled();

		data.isSTavailable = subController.checkisSubAvailable();
		data.isSLavailable = subController.checkisSignAvailable();
		data.isADavailable = _AudioManager.checkisADAvailable();
		data.isASTavailable = _AudioManager.checkisASTAvailable();

//SUBTITLES
		data.subtitlesButtonFunc =  function() {
			AddVisualFeedbackOnClick(data.isSTenabled ? 'show-st-button' : 'disable-st-button', function(){
				data.isSTenabled = !data.isSTenabled;
				subController.switchSubtitles(data.isSTenabled);
				view.UpdateAccessibilityOptionsIconStatusView(data);
				// Add interactivity to visible elements and remove interactivity to none visible elements.
				menuMgr.AddInteractionIfVisible(viewStructure);
			});
		};

//SIGH LANGUAGE
		data.signlanguageButtonFunc = function() {
			AddVisualFeedbackOnClick(data.isSLenabled ? 'show-sl-button' : 'disable-sl-button',function(){
				data.isSLenabled = !data.isSLenabled;
				subController.switchSigner(data.isSLenabled);
				view.UpdateAccessibilityOptionsIconStatusView(data);
				// Add interactivity to visible elements and remove interactivity to none visible elements.
				menuMgr.AddInteractionIfVisible(viewStructure);
			});
		};

//AUDIO DESCRIPTION
		data.audioDescriptionButtonFunc = function() {
			AddVisualFeedbackOnClick(data.isADenabled ? 'show-ad-button' : 'disable-ad-button',function(){
				data.isADenabled = !data.isADenabled;
				_AudioManager.switchAD(data.isADenabled);
				view.UpdateAccessibilityOptionsIconStatusView(data);
				// Add interactivity to visible elements and remove interactivity to none visible elements.
				menuMgr.AddInteractionIfVisible(viewStructure);
			});
		};

//AUDIO SUBTITLES
		data.audioSubtitlesButtonFunc = function() {
			AddVisualFeedbackOnClick(data.isASTenabled ? 'show-ast-button' : 'disable-ast-button', function(){
				data.isASTenabled = !data.isASTenabled;
				_AudioManager.switchAST(data.isASTenabled);
				view.UpdateAccessibilityOptionsIconStatusView(data);
				// Add interactivity to visible elements and remove interactivity to none visible elements.
				menuMgr.AddInteractionIfVisible(viewStructure);
			});
		};

		/*data.closeMenuButtonFunc = function(){ AddVisualFeedbackOnClick('closeMenuButton', function(){ menuMgr.ResetViews()} )};
		data.backMenuButtonFunc = function(){ AddVisualFeedbackOnClick('backMenuButton', function(){ menuMgr.NavigateBackMenu()} )};
		data.forwardMenuButtonFunc = function(){ AddVisualFeedbackOnClick('forwardMenuButton', function(){menuMgr.NavigateForwardMenu()} )};
    	data.previewButtonFunc = function(){ AddVisualFeedbackOnClick('previewMenuButton', function(){menuMgr.OpenPreview()} )};*/
	}

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
  }

	this.updateView = function(){

		data.isSTenabled = subController.getSubtitleEnabled();
		data.isSLenabled = subController.getSignerEnabled();
		data.isADenabled = _AudioManager.getADEnabled();
		data.isASTenabled = _AudioManager.getASTEnabled();

		data.isSTavailable = subController.checkisSubAvailable();
		data.isSLavailable = subController.checkisSignAvailable();
		data.isADavailable = _AudioManager.checkisADAvailable();
		data.isASTavailable = _AudioManager.checkisASTAvailable();


		view.UpdateView(data);
	}
}
