/**
 * @author isaac.fraile@i2cat.net
 */

THREE.InteractionsController = function () {

	var raycaster = new THREE.Raycaster();
	var interactiveListObjects = [];
	var interactionState = true;
	var nameMenuActive;


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

        	case "openMenu":
        		scene.getObjectByName( "backgroudMenu" ) ? console.log("Menu already open") : MenuManager.openMenu();
                scene.getObjectByName( "openMenu" ).visible = false;
				break;

        	case "backMenuButton":
                MenuManager.pressButtonFeedback(name);
        		MenuManager.changeMenuLeftOrRight( false );
        		break;

        	case "forwardMenuButton":
                MenuManager.pressButtonFeedback(name);
        		MenuManager.changeMenuLeftOrRight( true );
        		break;

        	case "closeMenuButton":
                MenuManager.pressButtonFeedback(name);
                setTimeout(function(){
                 MenuManager.closeMenu(); 
                 scene.getObjectByName( "openMenu" ).visible = true;
             }, clickInteractionTimeout);
                
        		break;

//***********************************************************************************************************
//
//                  P L A Y / P A U S E     C O N T R O L S 
//                  
//***********************************************************************************************************

        	case "playButton":
                MenuManager.pressButtonFeedback(name);
                ppMMgr.playButtonInteraction();
                setTimeout(function(){ ppMMgr.playoutTimeDisplayLogic(true); }, clickInteractionTimeout);
        		break;

        	case "pauseButton":
                MenuManager.pressButtonFeedback(name);
                ppMMgr.pauseButtonInteraction();
                setTimeout(function(){ ppMMgr.playoutTimeDisplayLogic(false); }, clickInteractionTimeout);     
        		break;

        	case "backSeekButton":
                MenuManager.pressButtonFeedback(name);
        		ppMMgr.seekAll( -seekTime );
                ppMMgr.playoutTimeDisplayLogic(true);
        		break;

        	case "forwardSeekButton":
                MenuManager.pressButtonFeedback(name);
        		ppMMgr.seekAll( seekTime );
                ppMMgr.playoutTimeDisplayLogic(true);
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
                setTimeout(function(){
                 MenuManager.closeMenu(); 
                 scene.getObjectByName( "openMenu" ).visible = true;
             }, clickInteractionTimeout);
                MenuManager.pressButtonFeedback(name); 
        		AplicationManager.switchDevice();
        		break;

        	case "settingsButton":
                MenuManager.pressButtonFeedback(name);
                setTimeout(function(){ MenuManager.openSecondLevelMenu(5); }, clickInteractionTimeout);
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

            case "showSubtitlesMenuButton":
            case "disabledSubtitlesMenuButton":
                // show the subtitle configuration menu
                MenuManager.pressButtonFeedback(name);
                setTimeout(function(){ 
                    MenuManager.openSecondLevelMenu(6);
                    /* function (subMenuIndex, onButtonIndex, offButtonIndex, enabledTitleIndex, disabledTitleIndex) */
                    MenuManager.showOnOffToggleButton(6, 0, 1, 0, 4);// Indexes from MenuState menuList
                 }, clickInteractionTimeout);
                break;

            case "showSignLanguageMenuButton":
            case "disabledSignLanguageMenuButton":
                // TODO
                // show the sign language configuration menu
                MenuManager.pressButtonFeedback(name);
                setTimeout(function(){ 
                    MenuManager.openSecondLevelMenu(7);
                    /* function (subMenuIndex, onButtonIndex, offButtonIndex, enabledTitleIndex, disabledTitleIndex) */
                    MenuManager.showOnOffToggleButton(7, 0, 1, 1, 5);// Indexes from MenuState menuList
                 }, clickInteractionTimeout);
                break;

            case "showAudioDescriptionMenuButton":
            case "disabledAudioDescriptionMenuButton":
                // TODO
                // show the audio description configuration menu
                MenuManager.pressButtonFeedback(name);
                setTimeout(function(){ 
                    MenuManager.openSecondLevelMenu(8);
                    /* function (subMenuIndex, onButtonIndex, offButtonIndex, enabledTitleIndex, disabledTitleIndex) */
                    MenuManager.showOnOffToggleButton(8, 0, 1, 2, 6);// Indexes from MenuState menuList
                 }, clickInteractionTimeout);
                break;

            case "showAudioSubtitlesMenuButton":
            case "disabledAudioSubtitlesMenuButton":
                // TODO
                // show the audio subtitle configuration menu
                MenuManager.pressButtonFeedback(name);
                setTimeout(function(){ 
                    MenuManager.openSecondLevelMenu(9);
                    /* function (subMenuIndex, onButtonIndex, offButtonIndex, enabledTitleIndex, disabledTitleIndex) */
                    MenuManager.showOnOffToggleButton(9, 0, 1, 3, 7); // Indexes from MenuState menuList
                 }, clickInteractionTimeout);
                break;

//***********************************************************************************************************
//
//                  S U B T I T L E S     M E N U     C O N T R O L S 
//                  
//***********************************************************************************************************

        // On / Off 

        	case "subtitlesOnButton":
                subController.disableSubtiles();
                menuList[6].isEnabled = false;
                secMMgr.showMultiOptionsButtons(multiOptionsMainSubMenuIndexes.slice(0,1));

                /* function (subMenuIndex, onButtonIndex, offButtonIndex, enabledTitleIndex, disabledTitleIndex) */
                MenuManager.showOnOffToggleButton(6, 0, 1, 0, 4);// Indexes from MenuState menuList
        		break;

        	case "subtitlesOffButton":
                subController.enableSubtitles();
                menuList[6].isEnabled = true;
                secMMgr.showMultiOptionsButtons(multiOptionsMainSubMenuIndexes.slice(0,1));

                /* function (subMenuIndex, onButtonIndex, offButtonIndex, enabledTitleIndex, disabledTitleIndex) */
                MenuManager.showOnOffToggleButton(6, 0, 1, 0, 4); // Indexes from MenuState menuList
        		break;

        // Language

            case "subtitlesShowLanguagesDropdown":
                MenuManager.openSubMenuDropdown(0, name);
                // TODO
                // mostar el menu con la lista de idiomas seleccionables
                break;

            case "subtitlesEngButton":
                subController.setSubtitle( "./resources/LICEU_ENG.xml" ); 
                MenuManager.selectFinalDropdownOption(name);
                subtitlesLanguage = name;
                break;

            case "subtitlesEspButton":
                subController.setSubtitle( "./resources/LICEU_CAST.xml" ); 
                MenuManager.selectFinalDropdownOption(name);
                subtitlesLanguage = name;
                break;

            case "subtitlesGerButton":
                console.log("Subtitles changed to GERMAN");
                MenuManager.selectFinalDropdownOption(name);
                subtitlesLanguage = name;
                break;

            case "subtitlesCatButton":
                console.log("Subtitles changed to CATALAN");
                MenuManager.selectFinalDropdownOption(name);
                subtitlesLanguage = name;
                break;

        // Easy To Read

            case "subtitlesShowEasyReadDropdown":
                MenuManager.openSubMenuDropdown(1, name);
                // TODO
                break;

            case "subtitlesEasyOn":
                subController.setSubEasy( true );
                MenuManager.selectFinalDropdownOption(name);
                subtitlesEasy = name;
                break;

            case "subtitlesEasyOff":
                subController.setSubEasy( false );
                MenuManager.selectFinalDropdownOption(name);
                subtitlesEasy = name;
                break;

        // Position

            case "subtitlesShowPositionsDropdown":
                MenuManager.openSubMenuDropdown(2, name);
                break;

            case "subtitlesTopButton":
                subController.setSubPosition( 0, 1 );
                MenuManager.selectFinalDropdownOption( name );
                subtitlesPosition = name;
                break;

            case "subtitlesBottomButton":
                subController.setSubPosition( 0, -1 );
                MenuManager.selectFinalDropdownOption( name );
                subtitlesPosition = name;
                break;

        // Background

            case "subtitlesShowBackgroundDropdown":
                MenuManager.openSubMenuDropdown(3, name);
                // TODO
                break;

            case "subtitlesSemitrans":
                subController.setSubBackground( 0.8 );
                MenuManager.selectFinalDropdownOption(name);
                subtitlesBackground = name;
                break;

            case "subtitlesOutline":
                subController.setSubBackground( 0 );
                MenuManager.selectFinalDropdownOption(name);
                subtitlesBackground = name;
                break;

        // Size

            case "subtitlesShowSizesDropdown":
                MenuManager.openSubMenuDropdown(4, name);
                // TODO
                break;

            case "subtitlesSmallSizeButton":
                subController.setSubSize( 0.6 );
                MenuManager.selectFinalDropdownOption(name);
                subtitlesSize = name;
                break;

            case "subtitlesMediumSizeButton":
                subController.setSubSize( 0.8 );
                MenuManager.selectFinalDropdownOption(name);
                subtitlesSize = name;
                break;

            case "subtitlesLargeSizeButton":
                subController.setSubSize( 1 );
                MenuManager.selectFinalDropdownOption(name);
                subtitlesSize = name;
                break;

        // Indicator

            case "subtitlesShowIndicatorDropdown":
                // mostrar lista de indicadores de visualizacion (none/arrow/radar)
                MenuManager.openSubMenuDropdown(5, name);
                break;

            case "subtitlesIndicatorNoneButton":
                subController.setSubIndicator( "none" );
                MenuManager.selectFinalDropdownOption(name);
                subtitlesIndicator = name;
                break;

            case "subtitlesIndicatorArrowButton":
                subController.setSubIndicator( "arrow" );
                MenuManager.selectFinalDropdownOption(name);
                subtitlesIndicator = name;
                break;

            case "subtitlesIndicatorRadarButton":
                subController.setSubIndicator( "compass" );
                MenuManager.selectFinalDropdownOption(name);
                subtitlesIndicator = name;
                break;

        // Area

            case "subtitlesShowAreasDropdown":
                // mostrar lista de areas de visualizacion (small/medium/large)
                MenuManager.openSubMenuDropdown(6, name);
                break;

        	case "subtitlesSmallAreaButton":
        		subController.setSubArea( 50 );
                MenuManager.selectFinalDropdownOption(name);
                subtitlesArea = name;
        		break;

        	case "subtitlesMediumAreaButton":
        		subController.setSubArea( 60 );
                MenuManager.selectFinalDropdownOption(name);
                subtitlesArea = name;
        		break;

        	case "subtitlesLargeAreaButton":
        		subController.setSubArea( 70 );
                MenuManager.selectFinalDropdownOption(name);
                subtitlesArea = name;
        		break;

        // Up/Down

            case "subtitlesUpButton":
                // TODO
                MenuManager.changeMenuUpOrDown( false );
                break;

            case "subtitlesDownButton":
                // TODO
                MenuManager.changeMenuUpOrDown( true );
                break;

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
                MenuManager.showOnOffToggleButton(7, 0, 1, 1, 5); // Indexes from MenuState menuList
                break;

            case "signLanguageOffButton":
            //TODO
                menuList[7].isEnabled = true;
                secMMgr.showMultiOptionsButtons(multiOptionsMainSubMenuIndexes.slice(1,2));
                
                /* function (subMenuIndex, onButtonIndex, offButtonIndex, enabledTitleIndex, disabledTitleIndex) */
                MenuManager.showOnOffToggleButton(7, 0, 1, 1, 5); // Indexes from MenuState menuList
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
                menuList[8].isEnabled = false;
                secMMgr.showMultiOptionsButtons(multiOptionsMainSubMenuIndexes.slice(2,3));

                /* function (subMenuIndex, onButtonIndex, offButtonIndex, enabledTitleIndex, disabledTitleIndex) */
                MenuManager.showOnOffToggleButton(8, 0, 1, 2, 6); // Indexes from MenuState menuList
                break;

            case "audioDescriptionOffButton":
            //TODO
                menuList[8].isEnabled = true;
                secMMgr.showMultiOptionsButtons(multiOptionsMainSubMenuIndexes.slice(2,3));

                /* function (subMenuIndex, onButtonIndex, offButtonIndex, enabledTitleIndex, disabledTitleIndex) */
                MenuManager.showOnOffToggleButton(8, 0, 1, 2, 6); // Indexes from MenuState menuList
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
                MenuManager.showOnOffToggleButton(9, 0, 1, 3, 7); // Indexes from MenuState menuList
                break;

            case "audioSubtitlesOffButton":
            //TODO
                menuList[9].isEnabled = true;
                secMMgr.showMultiOptionsButtons(multiOptionsMainSubMenuIndexes.slice(3,4));

                /* function (subMenuIndex, onButtonIndex, offButtonIndex, enabledTitleIndex, disabledTitleIndex) */
                MenuManager.showOnOffToggleButton(9, 0, 1, 3, 7); // Indexes from MenuState menuList
                break;

        	default:
        		console.log("You have clicked a button with no interactivity in the list!!!");
        		break;
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

    	raycaster.setFromCamera( mouse3D, camera );
    	var intersects = raycaster.intersectObjects( interactiveListObjects, true ); // false

    	if ( intersects[0] )
    	{
    		var intersectedShapeId;
			for(var inter = 0; inter < intersects.length; inter++)
	        {
	        	//if ( intersects[inter].object.type == 'Mesh' || intersects[inter].object.type == 'Group' ) 
                if ( intersects[inter].object.type == 'Mesh' && intersects[inter].object.onexecute) 
                {
                    intersects[inter].object.onexecute();
                    break;
                }

                else if ( intersects[inter].object.type == 'Mesh' && intersects[inter].object.name) 
	        	{
                    console.warn(intersects[inter].object)
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
        var index = interactiveListObjects.map(function(e) { return e.name; }).indexOf(object);

        if(index < 0) interactiveListObjects.push(object);
        else console.error("Interactivity already exists in the list.")
		
	};

	this.removeInteractiveObject = function(name)
	{
		interactiveListObjects = interactiveListObjects.filter(e => e.name != name);
	}
}

THREE.InteractionsController.prototype.constructor = THREE.InteractionsController;