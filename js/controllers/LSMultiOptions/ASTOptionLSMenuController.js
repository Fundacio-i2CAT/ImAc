function ASTOptionLSMenuController() {

	var data;
	var view;
	var viewStructure;
	

	this.Init = function(){

		data = GetData();
		UpdateData(data);
		viewStructure = scene.getObjectByName(data.name);
		viewStructure.visible = true;

		view = new OptionLSMenuView();
		view.UpdateView(data); 

		AddInteractivityToMenuElements();
	}

	this.Exit = function()
    {
    	if(viewStructure)
    	{
	    	viewStructure.visible = false;
	    	viewStructure.children.forEach(function(intrElement){
	    		interController.removeInteractiveObject(intrElement.name);
	    	});
	    	viewStructure.getObjectByName('firstcolumndropdown').children = [];
    	}
    }

    this.getLSMenuName = function()
    {
    	return data.name;
    }

    function GetData()
	{
	    if (data == null)
	    {
	        data = new OptionLSMenuModel();
	    }
	    return data;
	}


	function UpdateData(data)
    {
		data.isLSOptEnabled = true;

		data.lsOptEnabledLabelName = 'showAudioSubtitlesMenuButton';
		data.lsOptEnabledLabelValue = './img/menu_ai_icons/AST.png';

		data.lsOptDisbledLabelName = 'disabledAudioSubtitlesMenuButton';
		data.lsOptDisbledLabelValue = './img/menu_ai_icons/AST_strike.png';

		var firstColumnDropdownElements = [ {name: 'audioSubtitlesLanguages', value: 'Languages'}, {name: 'audioSubtitlesEasy', value: 'Easy read'},
											{name: 'audioSubtitlesVolume', value: 'Volume (icons)'}]

		data.firstColumnDropdown = AddDropdownElements(firstColumnDropdownElements);

		data.backMenuButtonfunc = function(){ menumanager.NavigateBackMenu()};
		data.onLSOptButtonfunc = function(){};
		data.offLSOptButtonfunc = function(){};
    }


    function AddInteractivityToMenuElements()
    {
    	viewStructure.children.forEach(function(intrElement){
    		if(intrElement.visible)
    		{
    			interController.addInteractiveObject(intrElement);
    		}
    	})
    }

    function AddDropdownElements(elements)
    {
    	var dropdownInteractiveElements =  [];
    	var h = 125*9/16;
    	elements.forEach(function(element, index){
    		var factor = (index*2)+1;

    		var dropdownIE = new InteractiveElementModel();
	        dropdownIE.width = 125/3;
	        dropdownIE.height = 125/elements.length;
	        dropdownIE.name = element.name;
	        dropdownIE.type =  'text';
	        dropdownIE.value = element.value; //AudioManager.getVolume();
	        dropdownIE.color = 0xffffff;
	        dropdownIE.textSize =  5;
	        dropdownIE.visible = true;
            dropdownIE.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(dropdownIE.width, dropdownIE.height), new THREE.MeshBasicMaterial({visible:  false}));
        	dropdownIE.onexecute =  function(){ return console.log("This is the "+element.name+" button"); };
	        dropdownIE.position = new THREE.Vector3(0, ( h/2-factor*h/(elements.length*2) ), 0.01);

	        dropdownInteractiveElements.push(dropdownIE.create())
    	});


    	return dropdownInteractiveElements
    }
}
