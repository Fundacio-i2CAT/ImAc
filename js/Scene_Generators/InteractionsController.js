/**
 * @author isaac.fraile@i2cat.net
 */

THREE.InteractionsController = function () {

	var raycaster = new THREE.Raycaster();
	var interactiveListObjects = [];
	var interactionState = true;
	var nameMenuActive;

    var subtitlesActive = false;
    var pointerState = true;


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

	function checkInteractionByName(name)
	{
		switch ( name )
        {

////***********************************************************************************************************
//
//                  M A I N     M E N U     C O N T R O L S 
//                  
//***********************************************************************************************************

            case "openMenuTrad":
                MenuManager.openMenuTrad();
                scene.getObjectByName( "openMenu" ).visible = false;
                //scene.getObjectByName( "openMenuTrad" ).visible = false; //EXPERIMENTAL
                break;


        	default:
        		console.log("You have clicked a button with no interactivity in the list!!!");
        		break;
        }
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

    	if ( intersects[0] && interactionState && type != 'onDocumentMouseMove')
    	{
            interactionState = false;
    		var intersectedShapeId;
			for(var inter = 0; inter < intersects.length; inter++)
	        {
	        	//if ( intersects[inter].object.type == 'Mesh' || intersects[inter].object.type == 'Group' ) 
                if ( intersects[inter].object.type == 'Mesh' && intersects[inter].object.onexecute ) 
                {
                    intersects[inter].object.onexecute();
                    break;
                }

                else if ( intersects[inter].object.type == 'Mesh' && intersects[inter].object.name) 
	        	{
					intersectedShapeId = intersects[inter].object.name;
					checkInteractionByName( intersectedShapeId );
					console.error(intersectedShapeId);
					break;
				}
			}
            freeInteractionState(300);
    	}
        else if ( _isHMD && intersects[0] && interactionState && pointerState )
        {
            //console.error('intersect')
            if ( scene.getObjectByName( "pointer" ) ) scene.getObjectByName( "pointer" ).visible = true;
            pointerState = false;
            freePointerState(600);
        }
    	else if ( _isHMD && pointerState )
    	{
    		// TODO
            if ( scene.getObjectByName( "pointer" ) ) scene.getObjectByName( "pointer" ).visible = false;
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
                //if ( intersects[inter].object.type == 'Mesh' || intersects[inter].object.type == 'Group' ) 
                if ( intersects[inter].object.type == 'Mesh' && intersects[inter].object.onexecute ) 
                {
                    intersects[inter].object.onexecute();
                    break;
                }
            }
            freeInteractionState(300);
        }
    };

    this.closeMenu = function()
    {
        checkInteractionByName( "closeMenuButton" );
    };

    this.getSubtitlesActive = function()
    {
        return subtitlesActive;
    };

    this.setSubtitlesActive = function(activated)
    {
        subtitlesActive = activated;
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

	this.removeInteractiveObject = function(name)
	{
		interactiveListObjects = interactiveListObjects.filter(e => e.name != name);
        controls.removeInteractiveObject(name);
	}
}

THREE.InteractionsController.prototype.constructor = THREE.InteractionsController;