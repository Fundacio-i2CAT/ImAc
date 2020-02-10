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

    - AddDropdownOptions (private)
    - UpdateDefaultLSMenuOption (private)
    - getHoritzontalLineDivisions (private)
    - close (public)


 This controller is part of the MVC:
    - (M) /player/js/Models/SettingsOptionMenuModel.js
    - (V) /player/js/Views/SettingsOptionMenuView.js
    - (C) /player/js/Controllers/SettingsOptionMenuController.js

 */
function SettingsOptionMenuController() {

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

    this.setChildColumnActiveOpt = function(name){
        if( scene.getObjectByName(name) ){
            data.childColumnActiveOpt = name;
            data.default = scene.getObjectByName(name);
            view.UpdateView(data);
        }
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
        data.parentColumnDropdown = AddDropdownOptions((data.activeMenuOpts)? data.activeMenuOpts : settingsDropdownOpt);
        data.backMenuButtonFunc = function(){ AddVisualFeedbackOnClick('back-button', function(){ SettingsOptionCtrl.updateDropdownOptions(data.parentDropdownData)} )};
        data.closeOptMenuButtonFunc = function(){ AddVisualFeedbackOnClick('close-button-opt', function(){ SettingsOptionCtrl.close() } )};
        data.previewButtonFunc = function(){ AddVisualFeedbackOnClick('preview-button', function(){menuMgr.OpenPreview()} )};
    }

/**
 * Adds interactivity to menu elements.
 *
 * @class      AddInteractivityToMenuElements (name)
 */
    function AddInteractivityToMenuElements(){
    	viewStructure.children.forEach(function(intrElement){
    		if( intrElement.visible ){
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

/**
 * Adds a dropdown elements trad.
 *
 * @class      AddDropdownElementsTrad (name)
 * @param      {<type>}  elements  The elements
 */
    function AddDropdownOptions(menuOpts){
        //The menuOpts.options array is filter in order to know the available submenus depending on the available accessibility options.
        let options = menuOpts.options.filter(opt => !opt.available || opt.available());

        let dropdownInteractiveElements = [];
        const h = optHeight/2*options.length;

        data.hasParentDropdown = menuOpts.parent ? true : false;
        data.isFinalDrop = menuOpts.final;
        data.parentDropdownData = menuOpts.parent;
        data.title = MenuDictionary.translate( menuOpts.title );
        data.icon = menuOpts.icon;
        data.isPreviewVisible = menuOpts.preview ? true : false;
        data.default = null;
        
        options.forEach(function(opt, index){
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
            dropdownIE.onexecute = opt.function; 
            dropdownIE.position = new THREE.Vector3(0, h - (index+1)*optHeight, 0.01);

            if((opt.default) ? opt.default() : false){
                data.default = dropdownIE;
            } 


            dropdownInteractiveElements.push(dropdownIE.create());
        });

        return dropdownInteractiveElements
    }

/**
 * [description]
 * @param  {[type]} menuOpts [description]
 * @return {[type]}          [description]
 */
    this.updateDropdownOptions = function(menuOpts){
        data.activeMenuOpts = menuOpts;
        data.parentColumnDropdown = AddDropdownOptions(menuOpts);
        view.UpdateView(data);
    }

    this.UpdateView = function(){
        view.UpdateView(data);
    }

    this.close = function(){
        if( menuMgr.getMenuType() == 2 ){
            menuMgr.getActualCtrl().Exit();
            menuMgr.setActualCtrl('');
            data.activeMenuOpts = undefined;
        }else{
            menuMgr.ResetViews();
            menuMgr.removeMenuFromParent();
            menuMgr.Init(1);
            menuMgr.initFirstMenuState();
        }  
    }
}
