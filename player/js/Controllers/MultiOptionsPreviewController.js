/*
 The MultiOptionsPreviewController takes care for the pre-visualitzation of the enabled enhaced-accessibility options (ST, SL, AD, AST).

 This controller has some core functionalities:

    - Init (public) 
    - Exit (public)
    - getMenuName (public)
    - getMenuIndex (public)
    - GetData (private)
    - UpdateData (private)

    ... and some unique functionalities of this particular controller:

    - setSubtitlePreview (private)
    - setAreaSTPreview (private)
    - setAreaSLPreview (private)
    - setSignerPreview (private)


 This controller is part of the MVC:
    - (M) /player/js/Models/MultiOptionsPreviewModel.js
    - (V) /player/js/Views/MultiOptionsPreviewView.js
    - (C) /player/js/Controllers/MultiOptionsPreviewController.js

 */
function MultiOptionsPreviewController() {

	var data;
	var view;
	var viewStructure;
	
/**
 * This function initializes the data model with GetData() and updates the values with UpdateData() function.
 * It loads the viewStructure created in the MenuManager and turns its visibility to true. 
 * It loads the view and updates any element that has changed with the new data in UpdateView(data). 
 *
 * @function      Init (name)
 */
	this.Init = function(){

		data = GetData();
		UpdateData();
		viewStructure = scene.getObjectByName(data.name);
		viewStructure.visible = true;

		view = new MultiOptionsPreviewView();
		view.UpdateView(data); 
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
 * @return     {MultiOptionsPreviewModel}  The data.
 */
    function GetData()
	{
	    if (data == null)
	    {
	        data = new MultiOptionsPreviewModel();
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
    	data.subtitlesPreview = setSubtitlePreview();
    	data.areaSTPreview = setAreaSTPreview();
        data.signerPreview = setSignerPreview();
        data.areaSLPreview = setAreaSLPreview();
    }


    /**
     * Sets the subtitle preview.
     *
     * @return     {<type>}  { description_of_the_return_value }
     */
    function setSubtitlePreview()
    {
    	let subConfig = subController.getSubtitleConfig();
    	let subPreviewText = "";

    	if(subController.getSubSize() == 1)
    	{
    		subPreviewText += "Large ";
    	}
    	else if(subController.getSubSize() == 0.8)
    	{
    		subPreviewText += "Medium ";
    	}
    	else subPreviewText += "Small ";



    	subPreviewText += (subConfig.displayAlign > 0) ? "top" : "bottom";

        let previewSTtext = [{
            text: subPreviewText+" preview subtitle text",
            color: "rgb(255,255,255)",
            backgroundColor: "rgb(0,0,0)"
        }]

        subtitleMesh = _moData.getSubtitleMesh( previewSTtext, subConfig);
        subtitleMesh.name = "subtitlespreview";

        return subtitleMesh;
    }

/**
 * Sets the area st preview.
 *
 * @return     {<type>}  { description_of_the_return_value }
 */
    function setAreaSTPreview()
    {
        subtitlesAreaMesh = _moData.getPlaneImageMesh(1.48*subController.getSubArea(), 0.82*subController.getSubArea(), './img/rect5044.png', 'areamesh', 5);
        subtitlesAreaMesh.position.z = -70;
        subtitlesAreaMesh.name = 'areaSTpreview';
        return subtitlesAreaMesh;
    }

/**
 * Sets the area sl preview.
 *
 * @return     {<type>}  { description_of_the_return_value }
 */
    function setAreaSLPreview()
    {
        signerAreaMesh = _moData.getPlaneImageMesh(1.48*subController.getSignerArea(), 0.82*subController.getSignerArea(), './img/rect5044.png', 'areamesh', 5);
        signerAreaMesh.position.z = -70;
        signerAreaMesh.name = 'areaSLpreview';
        return signerAreaMesh;
    }

/**
 * Sets the signer preview.
 *
 * @return     {THREE}  { description_of_the_return_value }
 */
    function setSignerPreview()
    {
        var size = subController.getSignerSize();
        var material = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 1 }); 
        var geometry = new THREE.PlaneGeometry( size, size );
        var signerMesh =  new THREE.Mesh( geometry, material);

        let position = 
        {
            x: ( 1.48*subController.getSignerArea()/2-size/2 )*subController.getSignerPosition().x,
            y: (0.82*subController.getSignerArea()/2-size/2) * subController.getSignerPosition().y
        };

        signerMesh.position.set(position.x , position.y, -70);
         
        signerMesh.name = 'signerpreview';

        var signPreviewText = new InteractiveElementModel();
        signPreviewText.width = size;
        signPreviewText.height = size;
        signPreviewText.type =  'icon';
        signPreviewText.value = MenuDictionary.translate('SL');
        signPreviewText.color = 0xffffff;
        signPreviewText.position = new THREE.Vector3(0, 0, 0.01);

        signerMesh.add(signPreviewText.create());

        return signerMesh;
    }
}