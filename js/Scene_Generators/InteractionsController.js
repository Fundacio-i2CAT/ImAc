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
        console.warn('[InteractionsController] Deprecated function')
		switch ( name )
        {

////***********************************************************************************************************
//
//                  M A I N     M E N U     C O N T R O L S 
//                  
//***********************************************************************************************************

        	case "backMenuButton":
                MenuManager.pressButtonFeedback(name);
        		MenuManager.changeMenuLeftOrRight( false );
        		break;

        	case "forwardMenuButton":
                MenuManager.pressButtonFeedback(name);
        		MenuManager.changeMenuLeftOrRight( true );
        		break;

        	case "closeMenuButton":
                if ( subtitlesActive ) subController.enableSubtitles();
                MenuManager.pressButtonFeedback(name);
                setTimeout(function(){
                    MenuManager.closeMenu(); 
                    scene.getObjectByName( "openMenu" ).visible = true;
                 //scene.getObjectByName( "openMenuTrad" ).visible = true; //EXPERIMENTAL
                }, clickInteractionTimeout);
                
        		break;

//***********************************************************************************************************
//
//                  P L A Y / P A U S E     C O N T R O L S 
//                  
//***********************************************************************************************************

        	case "playButton":
                MenuManager.pressButtonFeedback(name);
                MenuController.playButtonInteraction();
                setTimeout(function(){ MenuController.playoutTimeDisplayLogic(true); }, clickInteractionTimeout);
        		break;

        	case "pauseButton":
                MenuManager.pressButtonFeedback(name);
                MenuController.pauseButtonInteraction();
                setTimeout(function(){ MenuController.playoutTimeDisplayLogic(false); }, clickInteractionTimeout);     
        		break;

        	case "backSeekButton":
                MenuManager.pressButtonFeedback(name);
        		VideoController.seekAll( -seekTime );
                MenuController.playoutTimeDisplayLogic(true);
        		break;

        	case "forwardSeekButton":
                MenuManager.pressButtonFeedback(name);
        		VideoController.seekAll( seekTime );
                MenuController.playoutTimeDisplayLogic(true);
        		break;

//***********************************************************************************************************
//
//                  V O L U M E     C O N T R O L S 
//                  
//***********************************************************************************************************

        	case "minusVolumeButton":
                MenuManager.pressButtonFeedback(name);
        		AudioManager.changeVolume( -volumeChangeStep );      
                volMMgr.volumeLevelDisplayLogic();              
        		break;

        	case "plusVolumeButton":
                MenuManager.pressButtonFeedback(name);
        		AudioManager.changeVolume( volumeChangeStep );
                volMMgr.volumeLevelDisplayLogic();
                break;

        	case "muteVolumeButton":
                MenuManager.pressButtonFeedback(name);
        		AudioManager.setmute();
                setTimeout(function(){ volMMgr.showMuteUnmuteButton(); }, clickInteractionTimeout);                
        		break;

        	case "unmuteVolumeButton":
                MenuManager.pressButtonFeedback(name);
        		AudioManager.setunmute();
                setTimeout(function(){ volMMgr.showMuteUnmuteButton(); }, clickInteractionTimeout);
        		break;

//***********************************************************************************************************
//
//                  S E T T I N G S / C A R D B O A R D     C O N T R O L S 
//                  
//***********************************************************************************************************

        	case "cardboardButton":
                MenuManager.closeMenu();
                setTimeout(function(){
                 
                 //MenuManager.pressButtonFeedback(name); 
                    AplicationManager.switchDevice();
                scene.getObjectByName( "openMenu" ).visible = true;
             }, clickInteractionTimeout);
        		break;

//***********************************************************************************************************
//
//                  S E T T I N G S     C O N T R O L S 
//                  
//***********************************************************************************************************
              
            case "settingsLanguageButton":
                MenuManager.openSubMenuDropdown(0, name);
                break;

            case "settingsVoiceControlButton":
                MenuManager.openSubMenuDropdown(1, name);
                break;

            case "settingsUserProfileButton":
                MenuManager.openSubMenuDropdown(2, name);
                break;

            case "settingsLanguageEngButton":
                console.log("Settings language changed to ENGLISH");
                MenuManager.selectFinalDropdownOption(name);
                settingsLanguage = name;
                break;

            case "settingsLanguageEspButton":
                console.log("Settings language changed to SPANISH");
                MenuManager.selectFinalDropdownOption(name);
                settingsLanguage = name;
                break;

            case "settingsLanguageGerButton":
                console.log("Settings language changed to GERMAN");
                MenuManager.selectFinalDropdownOption(name);
                settingsLanguage = name;
                break;

            case "settingsLanguageCatButton":
                console.log("Settings language changed to CATALAN");
                MenuManager.selectFinalDropdownOption(name);
                settingsLanguage = name;
                break;

//***********************************************************************************************************
//
//                  M U L T I - O P T I O N S     M E N U     C O N T R O L S 
//                  
//***********************************************************************************************************

//***********************************************************************************************************
//
//                  S U B T I T L E S     M E N U     C O N T R O L S 
//                  
//***********************************************************************************************************

//***********************************************************************************************************
//
//                  S I G N     L A N G U A G E     M E N U     C O N T R O L S 
//                  
//***********************************************************************************************************

            case "signLanguageOnButton":
            //TODO
                //subController.enableSubtitles();
                menuList[7].isEnabled = false;
                secMMgr.showMultiOptionsButtons(multiOptionsMainSubMenuIndexes.slice(1,2));
                                
                /* function (subMenuIndex, onButtonIndex, offButtonIndex, enabledTitleIndex, disabledTitleIndex) */
                if(_isTradMenuOpen) MenuManager.showOnOffToggleButtonTradMenu(7, 0, 1, 1, 5); // Indexes from MenuState menuList
                else MenuManager.showOnOffToggleButton(7, 0, 1, 1, 5);// Indexes from MenuState menuList

                break;

            case "signLanguageOffButton":
            //TODO
                menuList[7].isEnabled = true;
                secMMgr.showMultiOptionsButtons(multiOptionsMainSubMenuIndexes.slice(1,2));
                
                /* function (subMenuIndex, onButtonIndex, offButtonIndex, enabledTitleIndex, disabledTitleIndex) */
                if(_isTradMenuOpen) MenuManager.showOnOffToggleButtonTradMenu(7, 0, 1, 1, 5); // Indexes from MenuState menuList
                else MenuManager.showOnOffToggleButton(7, 0, 1, 1, 5);// Indexes from MenuState menuList
                break;

            case "signShowPositionsDropdown":
                // TODO
                MenuManager.openSubMenuDropdown(0, name);
                break;

            case "signShowAreasDropdown":
                // mostrar lista de areas de visualizacion (small/medium/large)
                MenuManager.openSubMenuDropdown(2, name);
                break;

            case "signShowIndicatorDropdown":
                // mostrar lista de indicadores de visualizacion (none/arrow/radar)
                MenuManager.openSubMenuDropdown(1, name);
                break;



//***********************************************************************************************************
//
//                  A U D I O     D E S C R I P T I O N     M E N U     C O N T R O L S 
//                  
//***********************************************************************************************************

            case "audioDescriptionOnButton":
            //TODO
            console.log(name)
                menuList[8].isEnabled = false;
                secMMgr.showMultiOptionsButtons(multiOptionsMainSubMenuIndexes.slice(2,3));

                /* function (subMenuIndex, onButtonIndex, offButtonIndex, enabledTitleIndex, disabledTitleIndex) */
                if(_isTradMenuOpen) MenuManager.showOnOffToggleButtonTradMenu(8, 0, 1, 2, 6); // Indexes from MenuState menuList
                else MenuManager.showOnOffToggleButton(8, 0, 1, 2, 6);// Indexes from MenuState menuList
                break;

            case "audioDescriptionOffButton":
            //TODO
                menuList[8].isEnabled = true;
                secMMgr.showMultiOptionsButtons(multiOptionsMainSubMenuIndexes.slice(2,3));

                /* function (subMenuIndex, onButtonIndex, offButtonIndex, enabledTitleIndex, disabledTitleIndex) */
                if(_isTradMenuOpen) MenuManager.showOnOffToggleButtonTradMenu(8, 0, 1, 2, 6); // Indexes from MenuState menuList
                else MenuManager.showOnOffToggleButton(8, 0, 1, 2, 6);// Indexes from MenuState menuList
                break;

//***********************************************************************************************************
//
//                  A U D I O     S U B T I T L E S     M E N U     C O N T R O L S 
//                  
//***********************************************************************************************************

            case "audioSubtitlesOnButton":
            //TODO
                menuList[9].isEnabled = false;
                secMMgr.showMultiOptionsButtons(multiOptionsMainSubMenuIndexes.slice(3,4));

                /* function (subMenuIndex, onButtonIndex, offButtonIndex, enabledTitleIndex, disabledTitleIndex) */
                if(_isTradMenuOpen) MenuManager.showOnOffToggleButtonTradMenu(9, 0, 1, 3, 7); // Indexes from MenuState menuList
                else MenuManager.showOnOffToggleButton(9, 0, 1, 3, 7);// Indexes from MenuState menuList
                break;

            case "audioSubtitlesOffButton":
            //TODO
                menuList[9].isEnabled = true;
                secMMgr.showMultiOptionsButtons(multiOptionsMainSubMenuIndexes.slice(3,4));

                /* function (subMenuIndex, onButtonIndex, offButtonIndex, enabledTitleIndex, disabledTitleIndex) */
                if(_isTradMenuOpen) MenuManager.showOnOffToggleButtonTradMenu(9, 0, 1, 3, 7); // Indexes from MenuState menuList
                else MenuManager.showOnOffToggleButton(9, 0, 1, 3, 7);// Indexes from MenuState menuList
                break;

        	default:
        		console.log("You have clicked a button with no interactivity in the list!!!");
        		break;
        }
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

                else if ( intersects[inter].object.type == 'Mesh' && intersects[inter].object.name) 
	        	{
					intersectedShapeId = intersects[inter].object.name;
					checkInteractionByName( intersectedShapeId );
					console.error(intersectedShapeId);
					break;
				}
                else console.error("Error in checkInteraction")
			}
            freeInteractionState(300);
    	}
        else if ( _isHMD && intersects[0] && interactionState && pointerState )
        {
            //console.error('intersect')
            if ( scene.getObjectByName( "pointer" ) ) scene.getObjectByName( "pointer" ).visible = true;
            //pointerState = false;
            //freePointerState(600);
        }
    	else if ( _isHMD && pointerState )
    	{
    		// TODO
            if ( scene.getObjectByName( "pointer" ) ) scene.getObjectByName( "pointer" ).visible = false;
    	}
        else
        {
            var activeSecondaryMenuTrad = secMMgr.getActiveSecondaryMenuTrad();
            if(activeSecondaryMenuTrad)
            {
                activeSecondaryMenuTrad.buttons.forEach(function(elem){
                    interController.removeInteractiveObject(elem);
                }); 
              camera.remove(camera.getObjectByName(activeSecondaryMenuTrad.name));
              //subController.switchSigner( interController.getSignerActive() );
                
            } 
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

	this.removeInteractiveObject = function(name)
	{
		interactiveListObjects = interactiveListObjects.filter(e => e.name != name);
        controls.removeInteractiveObject(name);
	}

    this.clearInteractiveObjectList = function(name)
    {
        interactiveListObjects = [];
    }
}

THREE.InteractionsController.prototype.constructor = THREE.InteractionsController;
