/**
 The SettingsOptionMenuController takes care for the

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

    - AddDropdownElementsLS (private)
    - AddDropdownElementsTrad (private)
    - UpdateDefaultLSMenuOption (private)
    - getHoritzontalLineDivisions (private)


 This controller is part of the MVC:
    - (M) /player/js/Models/MultiOptionsLSMenuModel.js
    - (V) /player/js/Views/MultiOptionsLSMenuView.js
    - (C) /player/js/Controllers/MultiOptions/SettingsOptionMenuController.js

 */
function SettingsOptionMenuController() {

    var set = this;
	var data;
	var view;
	var viewStructure;

/**
 * { function_description }
 *
 * @function      Init (name)
 */
	this.Init = function(){

		data = GetData();
		UpdateData();

        data.name = 'trad-option-menu';
        view = new SettingsOptionMenuView();

		viewStructure = scene.getObjectByName(data.name);
		viewStructure.visible = true;

		view.UpdateView(data);

		AddInteractivityToMenuElements();
	}

/**
 * { function_description }
 *
 * @class      Exit (name)
 */
	this.Exit = function(){
    	if(viewStructure){
	    	viewStructure.visible = false;
	    	viewStructure.children.forEach(function(intrElement){
	    		interController.removeInteractiveObject(intrElement.name);
	    	});

            data.childColumnActiveOpt = undefined;
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
 * Gets the menu index.
 *
 * @return     {number}  The menu index.
 */
    this.getMenuIndex = function(){
        return 5;
    }

/**
 * Gets the data.
 *
 * @class      GetData (name)
 * @return     {OptionMenuModel}  The data.
 */
    function GetData(){
	    if (data == null){
	        data = new SettingsOptionMenuModel();
	    }
	    return data;
	}

/**
 * { function_description }
 *
 * @class      UpdateData (name)
 */
    function UpdateData(){
        data.isOptEnabled = true;
        data.title = MenuDictionary.translate('Settings');
        data.parentColumnDropdown = AddDropdownOptions(settingsDropdownOpt);
        data.backMenuButtonFunc = function(){ AddVisualFeedbackOnClick('back-button', function(){ SettingsOptionCtrl.updateDropdownOptions(data.parentDropdownData)} )};
        data.closeOptMenuButtonFunc = function(){ AddVisualFeedbackOnClick('close-button-opt', function(){ test() } )};
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
    	})
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

/**
 * Adds a dropdown elements trad.
 *
 * @class      AddDropdownElementsTrad (name)
 * @param      {<type>}  elements  The elements
 */
  function AddDropdownOptions(menuOpts){

    let dropdownInteractiveElements = [];
    const h = optHeight*menuOpts.options.length;

    data.titleHeight = menuOpts.options.length * optHeight;
    data.hasParentDropdown = menuOpts.parent ? true : false;
    data.isFinalDrop = menuOpts.final;
    data.parentDropdownData = menuOpts.parent;
    data.title = MenuDictionary.translate( menuOpts.title );
    data.icon = menuOpts.icon;

    menuOpts.options.forEach(function(opt, index){
        let dropdownIE = new InteractiveElementModel();
        
        dropdownIE.width = optWidth;
        dropdownIE.height = optHeight;
        dropdownIE.name = opt.optId;
        dropdownIE.type =  'mix';
        dropdownIE.text = MenuDictionary.translate( opt.text );
        dropdownIE.path = opt.icon;
        dropdownIE.textSize = menuWidth/40;
        dropdownIE.color = 0xe6e6e6;
        dropdownIE.visible = true;
        dropdownIE.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(dropdownIE.width, dropdownIE.height), new THREE.MeshBasicMaterial({visible:  false}));
        dropdownIE.onexecute =  opt.function;
        dropdownIE.position = new THREE.Vector3(0, h - (index+1)*optHeight, 0.01);

        dropdownInteractiveElements.push(dropdownIE.create())
    });

    return dropdownInteractiveElements
  }

/**
 * [description]
 * @param  {[type]} menuOpts [description]
 * @return {[type]}          [description]
 */
  this.updateDropdownOptions = function(menuOpts){
    data.parentColumnDropdown = AddDropdownOptions(menuOpts);
    view.UpdateView(data);
  }

  function test(){
    menuMgr.ResetViews();
    menuMgr.removeMenuFromParent();
    menuMgr.Init(1);
    menuMgr.initFirstMenuState();
  }
}
