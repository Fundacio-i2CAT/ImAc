/**
 The STOptionMenuController takes care for the 

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
    - DropdownUpDownFunc (private)
    - changeOnOffOptionState (private)


 This controller is part of the MVC:
    - (M) /player/js/Models/MultiOptionsLSMenuModel.js
    - (V) /player/js/Views/MultiOptionsLSMenuView.js
    - (C) /player/js/Controllers/MultiOptions/STOptionMenuController.js

 * @param      {<type>}                             menuType  (Low sighted menuType = 1; Traditional menuType = 2)
 */
function STOptionMenuController(menuType) {

    var st = this;
	var data;
	var view;
	var viewStructure;

	var subtitlesPositionArray = [
									{name: 'subtitlesTopButton', value: 'Top', default: subController.checkSubPosition(1) },
									{name: 'subtitlesBottomButton', value: 'Bottom', default: subController.checkSubPosition(-1)}];
	var subtitlesSizeArray = [
									{name: 'subtitlesSmallSizeButton', value: 'Small', default: subController.checkSubSize(0.6)},
									{name: 'subtitlesMediumSizeButton', value: 'Medium', default: subController.checkSubSize(0.8)},
									{name: 'subtitlesLargeSizeButton', value: 'Large', default: subController.checkSubSize(1)}];
	var subtitlesAreasArray = [
									{name: 'subtitlesSmallAreaButton', value: 'Small', default: subController.checkSubArea(50)},
									{name: 'subtitlesMediumAreaButton', value: 'Medium', default: subController.checkSubArea(60)},
									{name: 'subtitlesLargeAreaButton', value: 'Large', default: subController.checkSubArea(70)}];
	var subtitlesIndicatorArray = [
									{name: 'subtitlesIndicatorNoneButton', value: 'None', default: subController.checkSubIndicator('none')},
									{name: 'subtitlesIndicatorArrowButton', value: 'Arrow', default: subController.checkSubIndicator('arrow')},
									{name: 'subtitlesIndicatorRadarButton', value: 'Radar', default: subController.checkSubIndicator('radar')},
									{name: 'subtitlesIndicatorAutoButton', value: 'Auto', default: subController.checkSubIndicator('auto')}];
	var subtitlesBackgroundArray = [
									{name: 'subtitlesSemitrans', value: 'semitrans', default: subController.checkSubBackground(0.5)},
									{name: 'subtitlesOutline', value: 'Outline', default: subController.checkSubBackground(0)}];
	var subtitlesEasyArray = [
									{name: 'subtitlesEasyOn', value: 'On', default: subController.checkSubEasy(true)},
									{name: 'subtitlesEasyOff', value: 'Off', default: subController.checkSubEasy(false)}];

    var parentColumnDropdownElements = [ 
                                    { name: 'subtitlesLanguages', value: 'Language', options: subController.getSubtitlesLanguagesArray(), visible: true},
                                    { name: 'subtitlesEasyRead', value: 'Easytoread', options: subtitlesEasyArray,visible: true}, 
                                    { name: 'subtitlesShowPositions', value: 'Position', options: subtitlesPositionArray, visible: true},
                                    { name: 'subtitlesBackground', value: 'Background', options: subtitlesBackgroundArray, visible: true}, 
                                    { name: 'subtitlesSizes', value: 'Size', options: subtitlesSizeArray, visible: false}, 
                                    { name: 'subtitlesIndicator', value: 'Indicator', options: subtitlesIndicatorArray, visible: false}, 
                                    { name: 'subtitlesAreas', value: 'Area', options: subtitlesAreasArray, visible: false}];

/**
 * { function_description }
 *
 * @function      Init (name)
 */
	this.Init = function()
    {
        data = GetData();
        UpdateData();
        switch(menuType)
        {
            // LOW SIGHTED
            case 1: 
            default:
                data.name = 'lowsightedoptmenu';
                view = new OptionLSMenuView();
                break;

            // TRADITIONAL
            case 2:
                //data.name = 'traditionalmenu';
                data.name = 'tradoptionmenu';
                view = new OptionTradMenuView();
                break;
        }

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
	this.Exit = function()
    {
        
    	if(viewStructure)
    	{
	    	viewStructure.visible = false;
	    	viewStructure.children.forEach(function(intrElement){
	    		interController.removeInteractiveObject(intrElement.name);
	    	});

	    	if(viewStructure.getObjectByName('parentcolumndropdown')) viewStructure.getObjectByName('parentcolumndropdown').children = [];
	    	if(viewStructure.getObjectByName('childcolumndropdown')) viewStructure.getObjectByName('childcolumndropdown').children = [];
	    	if(viewStructure.getObjectByName('parentcolumnhoritzontallines')) viewStructure.getObjectByName('parentcolumnhoritzontallines').children = [];
	    	if(viewStructure.getObjectByName('childcolumnhoritzontallines')) viewStructure.getObjectByName('childcolumnhoritzontallines').children = [];

            data.childColumnActiveOpt = undefined;            
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
 * @return     {number}  The menu index.
 */
    this.getMenuIndex = function()
    {
        return 1;
    }

/**
 * Gets the data.
 *
 * @class      GetData (name)
 * @return     {OptionMenuModel}  The data.
 */
    function GetData()
	{
	    if (data == null)
	    {
            data = new OptionMenuModel();
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
        data.isOptEnabled = subController.getSubtitleEnabled();
        data.isOnOffButtonVisible = true;

        data.lsOptEnabledLabelName = 'showSubtitlesMenuButton';
        data.lsOptEnabledLabelValue = 'ST';

        data.lsOptDisbledLabelName = 'disabledSubtitlesMenuButton';
        data.lsOptDisbledLabelValue = 'ST_strike';

        
        data.onOptButtonFunc = function() {
            MenuFunctionsManager.getOnOffFunc('subtitlesOnButton')()
            changeOnOffOptionState(data.isOptEnabled)
            multiOptionsCtrl.UpdateMultiOptionsIconStatus();
        };
        data.offOptButtonFunc = function(){
            MenuFunctionsManager.getOnOffFunc('subtitlesOffButton')()
            changeOnOffOptionState(data.isOptEnabled)
            multiOptionsCtrl.UpdateMultiOptionsIconStatus();
        };

        switch(menuType)
        {
            // LOW SIGHTED
            case 1: 
            default:
                data.isUpDownArrowsVisible = parentColumnDropdownElements.length > 4 ? true : false;

                data.parentColumnHoritzontalLineDivisions = getHoritzontalLineDivisions(125, 4*(125*9/16)/6, 0xffffff, 4, 1);

                if(!data.parentColumnDropdown) data.parentColumnDropdown = AddDropdownElementsLS(parentColumnDropdownElements);  

                data.upDropdownButtonFunc = function(){ DropdownUpDownFunc(false) };
                data.downDropdownButtonFunc = function(){ DropdownUpDownFunc(true) };

                data.backMenuButtonFunc = function(){ AddVisualFeedbackOnClick('backMenuButton', function(){ menuMgr.NavigateBackMenu()} )};
                data.closeMenuButtonFunc = function(){ AddVisualFeedbackOnClick('closeMenuButton', function(){ menuMgr.ResetViews()} )};
                data.previewButtonFunc = function(){ AddVisualFeedbackOnClick('previewMenuButton', function(){menuMgr.OpenPreview()} )};
                break;

            // TRADITIONAL
            case 2: 
                data.title = MenuDictionary.translate('Subtitles');
                data.parentColumnDropdown = AddDropdownElementsTrad(parentColumnDropdownElements);  
                data.backMenuButtonFunc = function(){ AddVisualFeedbackOnClick('backMenuButton', function(){ menuMgr.setOptActiveIndex(0); menuMgr.Load(st)} )};
                break;
        }	
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
 * Adds a dropdown elements ls.
 *
 * @class      AddDropdownElementsLS (name)
 * @param      {<type>}  elements  The elements
 */
    function AddDropdownElementsLS(elements)
    {
    	var dropdownInteractiveElements =  [];
    	var h = 4*(125*9/16)/6;

    	elements.forEach(function(element, index){
    		var factor = (index*2)+1;

    		var dropdownIE = new InteractiveElementModel();
	        dropdownIE.width = 125/3;
	        dropdownIE.height =  elements.length>4 ? h/4 : h/elements.length;
	        dropdownIE.name = element.name;
	        dropdownIE.type =  'text';
	        dropdownIE.value = MenuDictionary.translate(element.value);
	        dropdownIE.color = element.default ? 0xffff00 : 0xffffff;
	        dropdownIE.textSize =  5;
	        
            dropdownIE.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(dropdownIE.width, dropdownIE.height), new THREE.MeshBasicMaterial({visible:  false}));
        	
        	if(element.options)
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
                MenuFunctionsManager.getButtonFunctionByName( element.name )();
                setTimeout(function(){view.UpdateView(data)}, 100);
            };
        	
	        dropdownIE.position = new THREE.Vector3(0, ( h/2-factor*h/(elements.length>4 ? 4*2 : elements.length*2) ), 0.01);

	        dropdownInteractiveElements.push(dropdownIE.create())
    	});


    	return dropdownInteractiveElements
    }

/**
 * Adds a dropdown elements trad.
 *
 * @class      AddDropdownElementsTrad (name)
 * @param      {<type>}  elements  The elements
 */
    function AddDropdownElementsTrad(elements)
    {
        var dropdownInteractiveElements =  [];
        var h = 5*elements.length;
        data.titleHeight = elements.length * 5;

        elements.forEach(function(element, index){
            var factor = (index+1);

            var dropdownIE = new InteractiveElementModel();
            dropdownIE.width = 30;
            dropdownIE.height =  4;
            dropdownIE.name = element.name;
            dropdownIE.type =  'text';
            dropdownIE.value = MenuDictionary.translate(element.value); 
            dropdownIE.color = element.default ? 0xffff00 : 0xffffff;
            dropdownIE.textSize =  1.5;
            dropdownIE.visible = true;
            
            dropdownIE.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(dropdownIE.width, dropdownIE.height), new THREE.MeshBasicMaterial({visible:  false}));
            
            if(element.options)
            {
                //dropdownIE.visible = element.visible;
                data.isFinalDrop = false;
                data.childColumnActiveOpt = undefined;

                dropdownIE.onexecute =  function()
                {
                    data.title = element.value;
                    data.childColumnActiveOpt = undefined;
                    data.parentColumnActiveOpt = element.name;
                    data.parentColumnDropdown = AddDropdownElementsTrad(element.options);
                    data.isOnOffButtonVisible = false;
                    //UpdateData();
                    setTimeout(function(){view.UpdateView(data)}, 100);
                };
            } 
            else
            {
                data.isFinalDrop = true;
                dropdownIE.onexecute =  function()
                {
                    UpdateDefaultLSMenuOption(elements,index);
                    data.childColumnActiveOpt = element.name;
                    MenuFunctionsManager.getButtonFunctionByName( element.name )();
                    setTimeout(function(){view.UpdateView(data)}, 100);
                };
            } 
            
            dropdownIE.position = new THREE.Vector3(0, h - factor*5, 0.01);

            dropdownInteractiveElements.push(dropdownIE.create())
        });


        return dropdownInteractiveElements
    }

/**
 * { function_description }
 *
 * @class      UpdateDefaultLSMenuOption (name)
 * @param      {<type>}  options               The options
 * @param      {<type>}  newActiveOptionIndex  The new active option index
 */
    function UpdateDefaultLSMenuOption(options, newActiveOptionIndex)
    {
        options.forEach(function(element, index){
            if(newActiveOptionIndex == index) element.default = true;
            else element.default = false;
        });
    }

/**
 * Gets the horitzontal line divisions.
 *
 * @param      {number}  w                  { parameter_description }
 * @param      {number}  h                  { parameter_description }
 * @param      {<type>}  color              The color
 * @param      {<type>}  numberofdivisions  The numberofdivisions
 * @param      {number}  row                The row
 * @return     {Array}   The horitzontal line divisions.
 */
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

/**
 * { function_description }
 *
 * @class      DropdownUpDownFunc (name)
 * @param      {boolean}  isDown  Indicates if down
 */
    function DropdownUpDownFunc(isDown)
    {            
        var h = 125*9/16;
    
        data.parentColumnDropdown.forEach( function( elem )
        {
            elem.position.y = isDown ? elem.position.y + h/6 : elem.position.y - h/6;

            if ( elem.position.y < -3*h/4 ) elem.position.y = h/4;
            else if ( elem.position.y > 3*h/4 ) elem.position.y = -h/4;

            if ( elem.visible && elem.position.y > h/4 ) elem.visible = false;
            else if ( elem.visible && elem.position.y < -h/4 ) elem.visible = false;
            else if ( elem.visible == false && elem.position.y <= h/4 && elem.position.y >= -h/4 ) elem.visible = true;

        });
        setTimeout(function(){view.UpdateView(data)}, 100);
    };

/**
 * { function_description }
 *
 * @param      {<type>}  state   The state
 */
    function changeOnOffOptionState(state)
    {
        data.isOptEnabled = !state;
        view.UpdateView(data); 
        AddInteractivityToMenuElements();
    }
}