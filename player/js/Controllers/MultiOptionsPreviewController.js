
function MultiOptionsPreviewController() {

	var data;
	var view;
	var viewStructure;
	
	this.Init = function(){

		data = GetData();
		UpdateData();
		viewStructure = scene.getObjectByName(data.name);
		viewStructure.visible = true;

		view = new MultiOptionsPreviewView();
		view.UpdateView(data); 
	}

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

	this.getMenuName = function()
    {
    	return data.name;
    }

	this.getMenuIndex = function()
    {
        return -1;
    }
    
    function GetData()
	{
	    if (data == null)
	    {
	        data = new MultiOptionsPreviewModel();
	    }
	    return data;
	}

	function UpdateData()
    {
    	data.subtitlesPreview = setSubtitlePreview();
    	data.areaPreview = setAreaPreview();
        data.signerPreview = setSignerPreview();
    }


// The text has to go through the dictionary library
    function setSubtitlePreview()
    {
    	let subConfig = subController.getSubtitleConfig(); console.log(subConfig);
    	let subPreviewText = "";
    	console.log(subController.getSubSize());

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

    function setAreaPreview()
    {
        subtitlesAreaMesh = _moData.getPlaneImageMesh(1.48*subController.getSubArea(), 0.82*subController.getSubArea(), './img/rect5044.png', 'areamesh', 5);
        subtitlesAreaMesh.position.z = -70;
        subtitlesAreaMesh.name = 'areapreview';
        return subtitlesAreaMesh;
    }


    function setSignerPreview()
    {
        let signerConfig =  subController.getSignerConfig();
        let size = (signerConfig) ? signerConfig.size : 30 * 70/100;
        let position = (signerConfig) ? {'x':signerConfig.x, 'y':signerConfig.y} : subController.getSignerPosition();

        var material = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 1 }); 
        var geometry = new THREE.PlaneGeometry( size, size );
        var signerMesh =  new THREE.Mesh( geometry, material);

        signerMesh.position.set(position.x , position.y, -69);
         
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