/**
 * @author isaac.fraile@i2cat.net
 */

THREE.InteractionsController = function () {

	var raycaster = new THREE.Raycaster();
	var interactiveListObjects = [];
	var interactionState = true;


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
		// TODO
		if ( name == 'button1' )
		{
			moData.isPausedById(0) ? moData.playAll() : moData.pauseAll();
		}
		else if ( name == 'button2' )
		{

		}
		else if ( name == 'button3' )
		{
			
		}
	}


//************************************************************************************
// Public Getters
//************************************************************************************

	this.getInteractionState = function()
	{
		return interactionState;
	};


//************************************************************************************
// Public Functions
//************************************************************************************

	this.checkInteraction = function(mouse3D, camera) 
	{
		//interactionState = false;

		//raycaster = new THREE.Raycaster();
    	raycaster.setFromCamera( mouse3D, camera );
    	var intersects = raycaster.intersectObjects( interactiveListObjects, true); // false

    	if (intersects[0])
    	{
    		var intersectedShapeId;
			for(var inter = 0; inter < intersects.length; inter++)
	        {
	        	if (intersects[inter].object.type == 'Mesh') {
					intersectedShapeId = intersects[inter].object.name;
					checkInteractionByName( intersectedShapeId );
					console.error(intersectedShapeId);
					break;
				}
			}
    	}
    	else
    	{
    		// TODO
    	}
	};

	this.addInteractiveObject = function(object)
	{
		interactiveListObjects.push(object);
	};

	this.removeInteractiveObject = function()
	{
		// TODO
	};


}

THREE.InteractionsController.prototype.constructor = THREE.InteractionsController;