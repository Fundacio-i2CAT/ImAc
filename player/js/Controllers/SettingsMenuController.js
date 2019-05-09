/*
 The SettingsLSMenuController takes care for the

 This controller has some core functionalities:

    - Init (public)
    - Exit (public)
    - getMenuName (public)
    - GetData (private)
    - UpdateData (private)
    - AddInteractivityToMenuElements (private)
    - AddVisualFeedbackOnClick (private)

 This controller is part of the MVC:
    - (M) /player/js/Models/SettingsLSMenuModel.js
    - (V) /player/js/Views/SettingsLSMenuView.js
    - (C) /player/js/Controllers/SettingsLSMenuController.js
 */
function SettingsMenuController(menuType) {

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
		view = new SettingsMenuView();
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
	this.Exit = function(){
      	menuMgr.setOptActiveIndex(0);
        // Works if the viewStructure is loaded.
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
 * @return     {SettingsLSMenuModel}  The data.
 */
    function GetData(){
        if (data == null){
            data = new SettingsMenuModel();
        }
        return data;
    }

/**
 * { function_description }
 *
 * @class      UpdateData (name)
 */
	function UpdateData(){
        data.openSettingsMenuButtonFunc = function(){ 
            AddVisualFeedbackOnClick('settings-button', function(){
                if( menuMgr.getMenuType() == 1) {
                    menuMgr.ResetViews();
                    if( scene.getObjectByName( "pointer2" ) && _isHMD ){
                        scene.getObjectByName( "pointer2" ).visible = true;
                    }else if( scene.getObjectByName( "pointer" ) && _isHMD ) {
                        scene.getObjectByName( "pointer" ).visible = true;
                        scene.getObjectByName('pointer').scale.set(1*_pointerSize,1*_pointerSize,1*_pointerSize)
                    }
                }
                menuMgr.Load(SettingsOptionCtrl)
            });
        };
        data.previewButtonFunc = function(){ AddVisualFeedbackOnClick('preview-button', function(){menuMgr.OpenPreview()} )};
        data.menuTypeButtonFunc = function(){ AddVisualFeedbackOnClick(menuMgr.getMenuType() == 2 ? 'enhanced-menu-button' :'traditional-menu-button', function(){ settingsMgr.getChangeMenuTypeFunction()} )};
        data.isPreviewVisible = false;
  }

/**
 * Adds interactivity to menu elements.
 *
 * @class      AddInteractivityToMenuElements (name)
 */
    function AddInteractivityToMenuElements(){
        viewStructure.children.forEach(function(intrElement){
  		    if(intrElement.visible){
  		        interController.addInteractiveObject(intrElement);
            }
        });
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
}
