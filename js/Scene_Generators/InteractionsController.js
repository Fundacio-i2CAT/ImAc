/**
 * @author isaac.fraile@i2cat.net
 */

THREE.InteractionsController = function () {

	var raycaster = new THREE.Raycaster();
	var interactiveListObjects = [];
	var interactionState = true;
	var nameMenuActive = "";


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
		if ( name == 'openMenu' )
		{
			if(!scene.getObjectByName("backgroudMenu"))
			{
		        MenuManager.openMenu();
			}
			else{
				console.log("Menu already open");
			}
		}
		else if ( name == 'playButton')
		{
			MenuManager.playButtonInteraction();
		}
		else if ( name == 'pauseButton') 
		{
			MenuManager.pauseButtonInteraction();
		}
		else if (name == 'backSeekButton')
		{
			//TODO
		}
		else if (name == 'forwardSeekButton')
		{
			//TODO
		}
		else if(name == 'backMenuButton')
		{
			MenuManager.changeMenuLeftOrRight(false);
		}
		else if ( name == 'closeMenuButton' )
		{
			MenuManager.closeMenu();
		}
		else if (name == 'cardboardButton')
		{
			//TODO
		}
		else if (name == 'settingsButton')
		{
			//TODO
		}
		else if (name == 'minusVolumeButton')
		{
			//TODO
		}
		else if (name == 'plusVolumeButton')
		{
			//TODO
		}
		else
		{
			console.log("You have clicked a button with no interactivity in the list!!!");
		}
	}

	function getInteractiveObjectList()
	{
		console.log(interactiveListObjects)
	};

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
	        	if (intersects[inter].object.type == 'Mesh' || intersects[inter].object.type == 'Group') {
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

	this.removeInteractiveObject = function(name)
	{
		interactiveListObjects = interactiveListObjects.filter(e => e.name != name);
	}
}

THREE.InteractionsController.prototype.constructor = THREE.InteractionsController;
