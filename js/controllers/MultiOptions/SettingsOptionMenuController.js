function SettingsOptionMenuController() {

	var data;
	var view;
	var viewStructure;

	var settingsLanguagesArray =  [
									{name: 'settingsLanguageEngButton', value: 'English', default: true}, 
									{name: 'settingsLanguageEspButton', value: 'Spanish', default: false}, 
									{name: 'settingsLanguageGerButton', value: 'German', default: false}, 
									{name: 'settingsLanguageCatButton', value: 'Catalan', default: false}];

	var voiceControlArray = [
									{name: 'vc1', value: 'Option 1', default: true}];

	var settingsUserProfileArray = [
									{name: 'up1', value: 'Option 1', default: true}, 
									{name: 'up2', value: 'Option 2', default: false}];

    var parentColumnDropdownElements = [ 
                                    {name: 'settingsLanguages', value: 'Languages', options: settingsLanguagesArray},
                                    {name: 'settingsVoiceControl', value: 'Voice Control', options: voiceControlArray},
                                    {name: 'settingsUserProfile', value: 'User Profile', options: settingsUserProfileArray}]
	
	this.Init = function(menuType){

		data = GetData();  
		UpdateData();

        switch(menuType)
        {
            // LOW SIGHTED
            case 1: 
            default:
                data.name = 'settingsoptmenu';
                view = new OptionLSMenuView();
                break;

            // TRADITIONAL
            case 2:
                data.name = 'tradoptionmenu';
                view = new OptionTradMenuView();
                break;
        }

		viewStructure = scene.getObjectByName(data.name);
		viewStructure.visible = true;

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

	    	viewStructure.getObjectByName('parentcolumndropdown').children = [];
	    	viewStructure.getObjectByName('parentcolumndropdown').children = [];
	    	viewStructure.getObjectByName('childcolumndropdown').children = [];
	    	viewStructure.getObjectByName('parentcolumnhoritzontallines').children = [];
	    	viewStructure.getObjectByName('childcolumnhoritzontallines').children = [];
    	}
    }

    this.getMenuName = function()
    {
    	return data.name;
    }

    function GetData()
	{
	    if (data == null)
	    {
	        data = new OptionMenuModel();
	    }
	    return data;
	}


	function UpdateData()
    {

		data.lsOptEnabledLabelName = 'settingsButton';
		data.lsOptEnabledLabelValue = './img/menu/settings_icon.png';

		data.isUpDownArrowsVisible = parentColumnDropdownElements.length > 4 ? true : false;
		
		data.parentColumnHoritzontalLineDivisions = getHoritzontalLineDivisions(125, 125*9/16, 0xffffff, 3, 1);	
												
		if(!data.parentColumnDropdown) data.parentColumnDropdown = AddDropdownElementsLS(parentColumnDropdownElements);

        data.backMenuButtonFunc = function(){ AddVisualFeedbackOnClick('backMenuButton', function(){ menumanager.NavigateBackMenu()} )};
        data.closeMenuButtonFunc = function(){ AddVisualFeedbackOnClick('closeMenuButton', function(){ menumanager.ResetViews()} )};
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

    function AddVisualFeedbackOnClick(buttonName, callback)
    {
        data.clickedButtonName = buttonName;
        view.pressButtonFeedback(data);
        setTimeout(callback, 300);
    }

    function AddDropdownElementsLS(elements)
    {
    	var dropdownInteractiveElements =  [];
    	var h;
    	elements.forEach(function(element, index){
    		var factor = (index*2)+1;

    		var dropdownIE = new InteractiveElementModel();

            if(element.options)
            {
                h = 125*9/16;
                dropdownIE.onexecute =  function()
                {
                    data.parentColumnActiveOpt = element.name;
                    data.childColumnDropdown = AddDropdownElementsLS(element.options); 
                    data.childColumnHoritzontalLineDivisions = getHoritzontalLineDivisions(125, 4*(125*9/16)/6, 0xffffff, element.options.length, 2); 
                    UpdateData();
                    setTimeout(function(){view.UpdateView(data)}, 100);    
                };
            } 
            else 
            {
                h = 4*(125*9/16)/6;
                dropdownIE.onexecute =  function(){
                    UpdateDefaultLSMenuOption(elements,index);
                    data.childColumnActiveOpt = element.name;
                    console.log("Click on "+element.value+ " final option");
                    setTimeout(function(){view.UpdateView(data)}, 100);
                };
            } 

	        dropdownIE.width = 125/3;
	        dropdownIE.height =  elements.length>4 ? h/4 : h/elements.length;
	        dropdownIE.name = element.name;
	        dropdownIE.type =  'text';
	        dropdownIE.value = element.value; //AudioManager.getVolume();
            dropdownIE.color = element.default ? 0xffff00: 0xffffff;
	        dropdownIE.textSize =  5;
	        dropdownIE.visible = true;
            dropdownIE.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(dropdownIE.width, dropdownIE.height), new THREE.MeshBasicMaterial({visible:  false}));
        	
	        dropdownIE.position = new THREE.Vector3(0, ( h/2-factor*h/(elements.length>4 ? 4*2 : elements.length*2) ), 0.01);

	        dropdownInteractiveElements.push(dropdownIE.create())
    	});

    	return dropdownInteractiveElements
    }

    function AddDropdownElementsTrad(elements)
    {
        var dropdownInteractiveElements =  [];
        var h = 5*elements.length;

        elements.forEach(function(element, index){
            var factor = (index+1);

            var dropdownIE = new InteractiveElementModel();
            dropdownIE.width = 30;
            dropdownIE.height =  4;
            dropdownIE.name = element.name;
            dropdownIE.type =  'text';
            dropdownIE.value = element.value; //AudioManager.getVolume();
            dropdownIE.color = element.default ? 0xffff00 : 0xffffff;
            dropdownIE.textSize =  1.5;
            dropdownIE.visible = true;
            
            dropdownIE.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(dropdownIE.width, dropdownIE.height), new THREE.MeshBasicMaterial({visible:  false}));
            
            /*if(element.options)
            {
                dropdownIE.visible = element.visible;
                dropdownIE.onexecute =  function()
                {
                    data.childColumnActiveOpt = undefined;
                    data.parentColumnActiveOpt = element.name;
                    data.childColumnDropdown = AddDropdownElementsLS(element.options);
                    data.childColumnHoritzontalLineDivisions = getHoritzontalLineDivisions(125, 4*(125*9/16)/6, 0xffffff, element.options.length, 2); 
                    UpdateData();
                    setTimeout(function(){view.UpdateView(data)}, 100);  
                };
            } 
            else dropdownIE.onexecute =  function()
            {
                UpdateDefaultLSMenuOption(elements,index);
                data.childColumnActiveOpt = element.name;
                console.log("Click on "+element.value+ " final option"); // ADD HERE THE FUNCTION 
                setTimeout(function(){view.UpdateView(data)}, 100);
            };*/
            
            dropdownIE.position = new THREE.Vector3(0, h - factor*5, 0.01);

            dropdownInteractiveElements.push(dropdownIE.create())
        });


        return dropdownInteractiveElements
    }

    function UpdateDefaultLSMenuOption(options, newActiveOptionIndex)
    {
        options.forEach(function(element, index){
            if(newActiveOptionIndex == index) element.default = true;
            else element.default = false;
        });
    }

    function getHoritzontalLineDivisions(w, h, color, numberofdivisions, row)
    {
        var linesHoritzontalGroup =  [];
        var material = new THREE.LineBasicMaterial({color: color, linewidth: 1});
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3( -w/6, 0, 0 ),new THREE.Vector3( w/6, 0, 0 ));
        
        var line = new THREE.Line( geometry, material );

        switch( numberofdivisions )
        {

            case 2:
                if( row > 1 ) line.position.x +=  w/3;
                linesHoritzontalGroup.push( line );
                return linesHoritzontalGroup;

            case 3:
                var line1 = line.clone();
                var line2 = line.clone();
                line1.position.y += h/6;
                line2.position.y -= h/6;
                if( row > 1 )
                    {
                      line1.position.x +=  w/3;  
                      line2.position.x +=  w/3;  
                    } 
                linesHoritzontalGroup.push(line1);
                linesHoritzontalGroup.push(line2);
                return linesHoritzontalGroup;

            case 4:
                var line2 = line.clone();
                var line3 = line.clone();
                line2.position.y += h/4
                line3.position.y -= h/4
                if( row > 1 )
                {
                  line.position.x += w/3;
                  line2.position.x += w/3; 
                  line3.position.x += w/3;  
                }
                else if ( row == 0 )
                {
                    var line4 = line.clone();
                    line4.position.x -= w/3;
                    line4.position.y += h/4;
                    linesHoritzontalGroup.push(line4);
                } 
                linesHoritzontalGroup.push(line);
                linesHoritzontalGroup.push(line2);
                linesHoritzontalGroup.push(line3);
                return linesHoritzontalGroup;

            default:
                return linesHoritzontalGroup;
        }
    }
}