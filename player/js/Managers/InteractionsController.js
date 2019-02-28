/**
 * @author isaac.fraile@i2cat.net
 */

THREE.InteractionsController = function () {

	var raycaster = new THREE.Raycaster();
	var interactiveListObjects = [];
	var interactionState = true;
	var nameMenuActive;

    var subtitlesActive = false;
    var signerActive = false;
    var pointerState = true;

    var radarInteraction;


//************************************************************************************
// Private Functions
//************************************************************************************

	function enableInteractions()
	{
		interactionState = true;
	}

	function disableInteractions()
	{
		interactionState = false;
	}

    this.getInteractiveObjectList = function ()
    {
        console.log(interactiveListObjects)
    }

	function getInteractiveObjectList()
	{
		console.log(interactiveListObjects)
        return interactiveListObjects;
	}

    function freeInteractionState(time)
    {
        var myVar = setTimeout(function()
        {
            interactionState = true;
            clearTimeout(myVar);
        },time); 
    }

    function freePointerState(time)
    {
        var myVar = setTimeout(function()
        {
            pointerState = true;
            clearTimeout(myVar);
        },time); 
    }

//************************************************************************************
// Public Setters
//************************************************************************************

	this.setActiveMenuName = function(name)
	{
		nameMenuActive = name;
	}

//************************************************************************************
// Public Getters
//************************************************************************************

	this.getInteractionState = function()
	{
		return interactionState;
	};

	this.getActiveMenuName = function()
	{
		return nameMenuActive;
	};

//************************************************************************************
// Public Functions
//************************************************************************************

	this.checkInteraction = function(mouse3D, camera, type) 
	{
    	raycaster.setFromCamera( mouse3D, camera );
    	var intersects = raycaster.intersectObjects( interactiveListObjects, true ); // false

        //Closes the open multi option menu of the traditional menu when clicked outside any element.
        if(!intersects.length && menuMgr.getActualCtrl() && menuMgr.getMenuType() == 2 && type != 'onDocumentMouseMove')
        { 
            menuMgr.getActualCtrl().Exit();
            menuMgr.setActualCtrl('');
        }

    	if ( intersects[0] && interactionState && type != 'onDocumentMouseMove')
    	{
            interactionState = false;
    		var intersectedShapeId;
			for(var inter = 0; inter < intersects.length; inter++)
	        {
                if ( intersects[inter].object.type == 'Mesh' && intersects[inter].object.onexecute ) 
                {
                    intersects[inter].object.onexecute();
                    break;
                }
                
                else if ( intersects[inter].object.type == 'Mesh' && intersects[inter].object.parent && intersects[inter].object.parent.name === 'video-progress-bar') 
                {
                    vpbCtrl.onClickSeek(mouse3D)
                    break;
                }

                else if ( intersects[inter].object.type == 'Mesh' && intersects[inter].object.name && intersects[inter].object.parent ) 
	        	{
					intersectedShapeId = intersects[inter].object.name;
					console.error(intersectedShapeId);
					break;
				}
                else console.error("Error in checkInteraction")
			}
            freeInteractionState(500);
    	}
	};

    this.checkVRInteraction = function(origin, direction) 
    {
        raycaster.set( origin, direction );

        var intersects = raycaster.intersectObjects( interactiveListObjects, true ); // false

        if ( intersects[0] && interactionState )
        {
            interactionState = false;
            var intersectedShapeId;
            for(var inter = 0; inter < intersects.length; inter++)
            {
                if ( intersects[inter].object.type == 'Mesh' && intersects[inter].object.onexecute ) 
                {
                    intersects[inter].object.onexecute();
                    break;
                }
                else if ( intersects[inter].object.type == 'Mesh' &&  intersects[inter].object.parent.name === 'video-progress-bar') 
                {
                    vpbCtrl.onClickSeek(intersects[inter].point.normalize())
                    break;
                }

            }
            freeInteractionState(300);
        }
    };

    this.getSubtitlesActive = function()
    {
        return subtitlesActive;
    };

    this.getSignerActive = function()
    {
        return signerActive;
    };

    this.setSubtitlesActive = function(activated)
    {
        subtitlesActive = activated;
    };

    this.setSignerActive = function(activated)
    {
        signerActive = activated;
    };

	this.addInteractiveObject = function(object)
	{
        var index = interactiveListObjects.map(function(e) { return e.name; }).indexOf(object);

        if (index < 0) {
            interactiveListObjects.push(object);
            controls.setInteractiveObject(object);
        }
        else console.error("Interactivity already exists in the list.")
	};

    this.addInteractiveRadar = function(object)
    {
        radarInteraction = object;
        var index = interactiveListObjects.map(function(e) { return e.name; }).indexOf(object);

        if (index < 0) {
            interactiveListObjects.push(object);
            controls.setInteractiveObject(object);
        }
        else console.error("Interactivity already exists in the list.")
    };

	this.removeInteractiveObject = function(name)
	{
		interactiveListObjects = interactiveListObjects.filter(e => e.name != name);
        controls.removeInteractiveObject(name);
	}

    this.removeInteractiveRadar = function(name)
    {
        radarInteraction = undefined;
        interactiveListObjects = interactiveListObjects.filter(e => e.name != name);
        controls.removeInteractiveObject(name);
    }

    this.clearInteractiveObjectList = function(name)
    {
        interactiveListObjects = [];
        if (radarInteraction) this.addInteractiveRadar(radarInteraction);
    }
}

THREE.InteractionsController.prototype.constructor = THREE.InteractionsController;
