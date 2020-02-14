/**
 * @author isaac.fraile@i2cat.net
 */

THREE.InteractionsController = function () {

	let raycaster = new THREE.Raycaster();
	let interactiveListObjects = [];
	let interactionState = true;
    let pointerState = true;
    let radarInteraction;
    let hoverSubMenuOpt = '';
    let hoverSubMenuOptColor;
    let hoverAccessIcon = '';
    let optionHoverAnimation;
    let hoverTimer;
    let tooltipVisible = false;


//************************************************************************************
// Private Functions
//************************************************************************************

	function getInteractiveObjectList(){
        return interactiveListObjects;
	}

  function freeInteractionState(time){
    var myVar = setTimeout(function(){
      interactionState = true;
      clearTimeout(myVar);
    },time);
  }

//************************************************************************************
// Public Setters
//************************************************************************************

	this.getInteractiveObjectList = function (){
		return interactiveListObjects;
	}

//************************************************************************************
// Public Getters
//************************************************************************************


//************************************************************************************
// Public Functions
//************************************************************************************

/**
 * { function_description }
 *
 * @param      {<type>}  origin     The origin
 * @param      {<type>}  direction  The direction
 */
    this.accessIconsHoverOver = function( origin, direction){
        if(_isHMD){
            raycaster.set( origin, direction );
        } else{
            raycaster.setFromCamera(  origin, direction );
        }

        let elementArray = [ scene.getObjectByName('enhanced-menu-button'),
                            scene.getObjectByName('show-st-button'), scene.getObjectByName('disable-st-button'),
                            scene.getObjectByName('show-sl-button'), scene.getObjectByName('disable-sl-button'),
                            scene.getObjectByName('show-ad-button'), scene.getObjectByName('disable-ad-button'), 
                            scene.getObjectByName('show-ast-button'),scene.getObjectByName('disable-ast-button')];

        let elementArrayAccess = (scene.getObjectByName("trad-main-menu")) ? elementArray : [];
        var intersects = raycaster.intersectObjects( elementArrayAccess , true );

        if (intersects[0]){
            if(intersects[0].object.type.localeCompare('Mesh') == 0 && intersects[0].object.onexecute){
                if( intersects[0].object.name.localeCompare(hoverAccessIcon) != 0 ){
                    hoverAccessIcon = intersects[0].object.name;
                    onMouseOver(intersects[0].object.name);
                }
            } 
        } else {
            if ( tooltipVisible ){ 
                hoverAccessIcon = '';
                onMouseOut();
            } 
        }
    }

/**
 * { function_description }
 *
 * @param      {<type>}  origin     The origin
 * @param      {<type>}  direction  The direction
 */
    this.vpbHoverOver = function( origin, direction){
        if(_isHMD){
            raycaster.set( origin, direction );
        } else{
            raycaster.setFromCamera(  origin, direction );
        }

        let elementArrayAccess = (scene.getObjectByName("trad-main-menu")) ? [scene.getObjectByName('background-progress')] : [];
        var intersects = raycaster.intersectObjects( elementArrayAccess , true );

        if (intersects[0]){
            scene.getObjectByName('slider-progress').visible = true;
            let hoverPoint = intersects[0].object.worldToLocal(intersects[0].point);

            if (Math.floor(hoverPoint.x) > Math.ceil(scene.getObjectByName('slider-progress').position.x)){
                scene.getObjectByName("seek-progress").visible = true;

                const totalTime = VideoController.getListOfVideoContents()[0].vid.duration;   
                let currentTime = VideoController.getListOfVideoContents()[0].vid.currentTime;

                let seekProgressPosition = (hoverPoint.x + (-4*menuWidth/10))/2;
                let timeDiff = hoverPoint.x - (-4*menuWidth/10);
                let newSeekTime = Math.floor(totalTime*timeDiff/(4*menuWidth/5));

                scene.getObjectByName("seek-progress").scale.set((newSeekTime/totalTime),1,1);
                scene.getObjectByName("seek-progress").position.x = seekProgressPosition + menuWidth/200;
            } else{
                scene.getObjectByName("seek-progress").visible = false;
            }
        } else{
            scene.getObjectByName("seek-progress").visible = false;
            if (!elementSelection){
                scene.getObjectByName('slider-progress').visible = false;
            } 
        }
    }


/**
 * This function changes color of the different sub menu options when user hovers over.
 *
 * @param      {<type>}  mouse3D  The mouse 3d
 * @param      {<type>}  camera   The camera
 */
    this.checkInteractionSubMenuHover = function(origin, direction){
        if(_isHMD){
            raycaster.set( origin, direction );
        } else{
            raycaster.setFromCamera(  origin, direction );
        }

        let elementArray = (scene.getObjectByName("trad-option-menu")) ? scene.getObjectByName("trad-option-menu").children  : [];
        var intersects = raycaster.intersectObjects( elementArray , true );

        if (intersects[0]){
            if(intersects[0].object.name.localeCompare('settings-opt-title') == 0){
                //DUPLICATED CODE 1
                if(hoverSubMenuOpt && scene.getObjectByName(hoverSubMenuOpt)){
                    scene.getObjectByName(hoverSubMenuOpt).children[0].material.color.set( 0xe6e6e6 );
                    if(scene.getObjectByName(hoverSubMenuOpt).children.length > 1){
                        scene.getObjectByName(hoverSubMenuOpt).children[1].material.color.set( 0xe6e6e6 );
                        scene.getObjectByName(hoverSubMenuOpt).children[0].rotation.z = 0;
                        clearTimeout(optionHoverAnimation);
                    }                    
                    hoverSubMenuOpt = '';
                }
            }
            if (intersects[0].object.type.localeCompare('Mesh') == 0 && intersects[0].object.onexecute){
                hoverSubMenuOptColor = scene.getObjectByName(intersects[0].object.name).children[0].material.color;

                if (intersects[0].object.name.localeCompare(hoverSubMenuOpt) != 0){

                    //Change color on selection;
                    scene.getObjectByName(intersects[0].object.name).children[0].material.color.set( 0xffff00 );
                    if (scene.getObjectByName(intersects[0].object.name).children.length > 2){
                        scene.getObjectByName(intersects[0].object.name).children[1].material.color.set( 0xffff00 ); 
                        scene.getObjectByName(intersects[0].object.name).children[0].rotation.z = -Math.PI/8; //Rotate icon for animation
                        // Some time this error appears
                         
                        // Uncaught TypeError: Cannot read property 'children' of undefined (below lines)
                        if(scene.getObjectByName(intersects[0].object.name)){
                            optionHoverAnimation = setTimeout( function(){
                                scene.getObjectByName(intersects[0].object.name).children[0].rotation.z = 0; //Back to initial rotation.                      
                            }, 150); 
                        }
                    }  
                    if (hoverSubMenuOpt && scene.getObjectByName(hoverSubMenuOpt)){
                        scene.getObjectByName(hoverSubMenuOpt).children[0].material.color.set( 0xe6e6e6 );
                        if (scene.getObjectByName(hoverSubMenuOpt).children.length > 1){
                            scene.getObjectByName(hoverSubMenuOpt).children[1].material.color.set( 0xe6e6e6 );
                        }
                    } 
                    hoverSubMenuOpt = intersects[0].object.name;
                    hoverSubMenuOptColor = scene.getObjectByName(intersects[0].object.name).children[0].material.color;
                }
            } 
        } else{
            //DUPLICATED CODE 2
            if (hoverSubMenuOpt && scene.getObjectByName(hoverSubMenuOpt)){
                scene.getObjectByName(hoverSubMenuOpt).children[0].material.color.set( 0xe6e6e6 );
                if (scene.getObjectByName(hoverSubMenuOpt).children.length > 1){
                    scene.getObjectByName(hoverSubMenuOpt).children[1].material.color.set( 0xe6e6e6 );
                    clearTimeout(optionHoverAnimation);
                    scene.getObjectByName(hoverSubMenuOpt).children[0].rotation.z = 0; 
                }               
                hoverSubMenuOpt = '';
            }
        }
    }


    this.checkInteractionGrid = function(raycaster, mouse2D){
        var intersects = raycaster.intersectObjects([canvas.getObjectByName('cnv-background')] , true );

        if (intersects[0]){
            let v = new  THREE.Vector2(0,0);
            v = intersects[0].object.worldToLocal(intersects[0].point);

            switch(elementSelection.name){
                case 'radar':
                     _rdr.move(v);
                    break;
                case 'signer':
                    _slMngr.move(v);
                    break;
                case 'subtitles':
                    _stMngr.move(v);
                    break;
            }
        }
    }

    this.checkInteractionCanvasElements = function(origin, direction){
        if(_isHMD){
            raycaster.set( origin, direction );
        } else{
            raycaster.setFromCamera(  origin, direction );
        }

        let radarArray = [];
        let signArray = [];
        let subtitlesArray = [];

        if (scene.getObjectByName('radar').visible) radarArray = scene.getObjectByName('radar').children;
        if (scene.getObjectByName('signer')) signArray = scene.getObjectByName('signer').children;
        if (scene.getObjectByName('subtitles')) subtitlesArray = scene.getObjectByName('subtitles').children;

        let intersects = raycaster.intersectObjects( radarArray.concat(signArray).concat(subtitlesArray) , true );

        if ( intersects[0]){
                if(VideoController.isPausedById(0)){
                    actionPausedVideo = false;
                } else{
                    actionPausedVideo = true;
                    mainMenuCtrl.pauseAllFunc();
                }
            if(intersects[0].object.parent.name.localeCompare('radar') == 0){
                camera.getObjectByName('rdr-colorFrame').visible = true;
                elementSelection = intersects[0].object.parent;
            } else if(intersects[0].object.parent.name.localeCompare('signer') == 0){
                camera.getObjectByName('sl-colorFrame').visible = true;
                elementSelection = intersects[0].object.parent;
                _slMngr.scaleColorBorder(camera.getObjectByName('sl-colorFrame'))
            } else if(intersects[0].object.parent.name.localeCompare('subtitles') == 0){
                camera.getObjectByName('st-colorFrame').visible = true;
                elementSelection = intersects[0].object.parent;
            } 
        }
    }
   

    this.checkInteractionVPB = function(origin, direction, hmdTouch=false){
        if(_isHMD && !hmdTouch){
            raycaster.set( origin, direction );
        } else{
            raycaster.setFromCamera(  origin, direction );
        }

        let elementArray = (scene.getObjectByName("trad-main-menu")) ? [scene.getObjectByName('background-progress'), scene.getObjectByName('slider-progress')] : [];
        var intersects = raycaster.intersectObjects( elementArray , true );

        if ( intersects[0]){
            if(intersects[0].object.name.localeCompare('slider-progress') == 0){
                elementSelection = scene.getObjectByName('slider-progress');
                mainMenuCtrl.setInitialSlidingPosition(elementSelection.position.x);
                if(elementSelection){
                    if(VideoController.isPausedById(demoId)){
                        actionPausedVideo = false;
                    } else{
                        actionPausedVideo = true;
                        mainMenuCtrl.pauseAllFunc();                    
                    }
                }
            } else {
                mainMenuCtrl.onClickSeek(intersects[0].object.worldToLocal(intersects[0].point));
            }   
        }
    }

    this.checkInteraction = function(origin, direction, _mouseMoved, hmdTouch=false){
        if(_isHMD && !hmdTouch){
            raycaster.set( origin, direction );
        } else{
            raycaster.setFromCamera(  origin, direction );
        }

        const intersects = raycaster.intersectObjects( interactiveListObjects, true ); // false
  	    if ( intersects[0]){
            if(interactionState){
                lastUpdate = Date.now();
                interactionState = false;
      		    let intersectedShapeId;
    			for(let inter = 0; inter < intersects.length; inter++){
                    if ( localStorage.ImAc_cookies ) gtag('event', (_isHMD) ? 'VRInteraction' : 'UserInteraction', {
                        'event_category' : 'PlayerConfig',
                        'event_label' : intersects[inter].object.name,
                        'anonymizeIp': true
                    });

                    if ( loggerActivated ) statObj.add( new StatElements( intersects[inter].object.name ) );


                    if ( intersects[inter].object.type == 'Mesh' && intersects[inter].object.onexecute ){
        	            intersects[inter].object.onexecute();
        	            break;
                    } else if ( intersects[inter].object.type == 'Mesh' && intersects[inter].object.name && intersects[inter].object.parent ){
        				intersectedShapeId = intersects[inter].object.name;
        				break;
                    } else console.error("Error in checkInteraction")
        		}
                freeInteractionState(300);
            }
	    } else{ 
            //Closes the open multi option menu of the traditional menu when clicked outside any element.
            if(!_mouseMoved && !elementSelection){
                if(scene.getObjectByName('trad-option-menu') && menuMgr.getActualCtrl()){
                    SettingsOptionCtrl.close();
                } else{
                    if(scene.getObjectByName('trad-main-menu').visible){
                        menuMgr.ResetViews();
                    } else {
                        menuMgr.initFirstMenuState();
                    }
                }
            }
        }
	};

    function onMouseOver(name){
        onMouseOut();
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
            case "close-button":
                scene.getObjectByName('close-button-group').visible = true;
                break;      
        }
    }

    function onMouseOut(){
        scene.getObjectByName('tooltip-st-button').visible = false;
        scene.getObjectByName('tooltip-sl-button').visible = false;
        scene.getObjectByName('tooltip-ad-button').visible = false;
        scene.getObjectByName('tooltip-ast-button').visible = false;
        scene.getObjectByName('enhanced-menu-button-group').visible = false;
        scene.getObjectByName('close-button-group').visible = false;
        tooltipVisible = false;
    }

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

    this.clearInteractiveObjectList = function(name){
        interactiveListObjects = [];
        if (radarInteraction) this.addInteractiveRadar(radarInteraction);
    }
}

THREE.InteractionsController.prototype.constructor = THREE.InteractionsController;
