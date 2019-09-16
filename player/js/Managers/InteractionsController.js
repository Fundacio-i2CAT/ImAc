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

	function enableInteractions(){
		interactionState = true;
	}

	function disableInteractions(){
		interactionState = false;
	}

	function getInteractiveObjectList(){
    return interactiveListObjects;
	}

  function freeInteractionState(time){
    var myVar = setTimeout(function(){
      interactionState = true;
      clearTimeout(myVar);
    },time);
  }

  function freePointerState(time){
    var myVar = setTimeout(function(){
      pointerState = true;
      clearTimeout(myVar);
    },time);
  }

//************************************************************************************
// Public Setters
//************************************************************************************

	this.setActiveMenuName = function(name){
		nameMenuActive = name;
	}

	this.getInteractiveObjectList = function (){
		return interactiveListObjects;
	}

//************************************************************************************
// Public Getters
//************************************************************************************

	this.getInteractionState = function(){
		return interactionState;
	};

	this.getActiveMenuName = function(){
		return nameMenuActive;
	};

//************************************************************************************
// Public Functions
//************************************************************************************


    this.checkInteraction = function(mouse3D, camera, type){
        raycaster.setFromCamera( mouse3D, camera );
        var intersects = raycaster.intersectObjects( interactiveListObjects, true ); // false

        //Closes the open multi option menu of the traditional menu when clicked outside any element.
        if(!intersects.length && menuMgr.getActualCtrl() && type != 'onDocumentMouseMove'){
            SettingsOptionCtrl.close();
        }

  	    if ( intersects[0] && interactionState && type != 'onDocumentMouseMove'){
            interactionState = false;
  		    var intersectedShapeId;
			for(var inter = 0; inter < intersects.length; inter++){

                gtag('event', 'UserInteraction', {
                    'event_category' : 'PlayerConfig',
                    'event_label' : intersects[inter].object.name
                });

                if ( intersects[inter].object.type == 'Mesh' && intersects[inter].object.onexecute ){
    	            intersects[inter].object.onexecute();
    	            break;
                }
                else if ( intersects[inter].object.type == 'Mesh' && intersects[inter].object.parent && intersects[inter].object.parent.name === 'video-progress-bar'){
                  mainMenuCtrl.onClickSeek(mouse3D)
                  break;
                }
                else if ( intersects[inter].object.type == 'Mesh' && intersects[inter].object.name && intersects[inter].object.parent ){
    				intersectedShapeId = intersects[inter].object.name;
    				console.error(intersectedShapeId);
    				break;
    			}
                else console.error("Error in checkInteraction")
    		}
            freeInteractionState(500);
	    }
	};

    this.checkVRInteraction = function(origin, direction){
        raycaster.set( origin, direction );
        var intersects = raycaster.intersectObjects( interactiveListObjects, true ); // false
        if ( intersects[0] && interactionState ){
            interactionState = false;
            var intersectedShapeId;
            for(var inter = 0; inter < intersects.length; inter++){

                gtag('event', 'VRInteraction', {
                    'event_category' : 'PlayerConfig',
                    'event_label' : intersects[inter].object.name
                });

                if ( intersects[inter].object.type == 'Mesh' && intersects[inter].object.onexecute ){
                    intersects[inter].object.onexecute();
                    break;
                }
                else if ( intersects[inter].object.type == 'Mesh' &&  intersects[inter].object.parent.name === 'video-progress-bar'){
                    mainMenuCtrl.onClickSeek(intersects[inter].point.normalize())
                    break;
                }
            }
            freeInteractionState(300);
        }
    };

    var tooltipVisible = false;

    this.checkVRHoverInteraction = function(origin, direction){
        raycaster.set( origin, direction );
        var intersects = raycaster.intersectObjects( interactiveListObjects, true ); // false

        //showAccessIconTooltip(intersects)
        if ( intersects[0] ){
            for(var inter = 0; inter < intersects.length; inter++){

                if ( intersects[inter].object.type == 'Mesh' && intersects[inter].object.onexecute ){
                    //intersects[inter].object.onexecute();
                    if ( intersects[inter].object.name == 'disable-st-button' ||
                        intersects[inter].object.name == 'disable-sl-button' ||
                        intersects[inter].object.name == 'disable-ad-button' ||
                        intersects[inter].object.name == 'disable-ast-button' ||
                        intersects[inter].object.name == 'show-st-button' ||
                        intersects[inter].object.name == 'show-sl-button' ||
                        intersects[inter].object.name == 'show-ad-button' ||
                        intersects[inter].object.name == 'show-ast-button' ||
                        intersects[inter].object.name == 'enhanced-menu-button-group'  ) onMouseOver( intersects[inter].object.name )
                    else if ( tooltipVisible ) clearMouseOver();

                    break;
                }
            }
        }
        else if ( tooltipVisible ) clearMouseOver();
    };


    function onMouseOver(name){
        clearMouseOver();
        tooltipVisible = true;
        switch(name){
            case "show-st-button":
            case "disable-st-button":
                scene.getObjectByName('tooltip-st-button').visible = true;
                break;
            case "show-sl-button":
            case "disable-sl-button":
                scene.getObjectByName('tooltip-sl-button').visible = true;
                break;
            case "show-ad-button":
            case "disable-ad-button":
                scene.getObjectByName('tooltip-ad-button').visible = true;
                break;
            case "show-ast-button":
            case "disable-ast-button":
                scene.getObjectByName('tooltip-ast-button').visible = true;
                break;
            case "enhanced-menu-button":
                scene.getObjectByName('enhanced-menu-button-group').visible = true;
                break;
        }
    }

    function clearMouseOver(){
        scene.getObjectByName('tooltip-st-button').visible = false;
        scene.getObjectByName('tooltip-sl-button').visible = false;
        scene.getObjectByName('tooltip-ad-button').visible = false;
        scene.getObjectByName('tooltip-ast-button').visible = false;
        scene.getObjectByName('enhanced-menu-button-group').visible = false;
        tooltipVisible = false;
    }


    this.getSubtitlesActive = function(){
    	return subtitlesActive;
    };

    this.getSignerActive = function(){
        return signerActive;
    };

    this.setSubtitlesActive = function(activated){
        subtitlesActive = activated;
    };

    this.setSignerActive = function(activated){
        signerActive = activated;
    };

/**
 * [description]
 * @param  {[type]} object [description]
 * @return {[type]}        [description]
 */
	this.addInteractiveObject = function(object){
        let index = interactiveListObjects.map(function(e) { return e.name; }).indexOf(object.name);
        if (index < 0){
    	    interactiveListObjects.push(object);
    	    controls.setInteractiveObject(object);
        }
	};

/**
 * [description]
 * @param  {[type]} object [description]
 * @return {[type]}        [description]
 */
    this.addInteractiveRadar = function(object){
        radarInteraction = object;
        let index = interactiveListObjects.map(function(e) { return e.name; }).indexOf(object.name);
        if (index < 0){
            interactiveListObjects.push(object);
            controls.setInteractiveObject(object);
        }
    };

	this.removeInteractiveObject = function(name){
		interactiveListObjects = interactiveListObjects.filter(e => e.name != name);
        controls.removeInteractiveObject(name);
	}

    this.removeInteractiveRadar = function(name){
        radarInteraction = undefined;
        interactiveListObjects = interactiveListObjects.filter(e => e.name != name);
        controls.removeInteractiveObject(name);
    }

    this.clearInteractiveObjectList = function(name){
        interactiveListObjects = [];
        if (radarInteraction) this.addInteractiveRadar(radarInteraction);
    }
}

THREE.InteractionsController.prototype.constructor = THREE.InteractionsController;
