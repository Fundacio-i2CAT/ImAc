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
        //****************************
        //       Main controls
        //****************************

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

        //****************************
        //      Player controls
        //****************************

        	case "playButton":
                MenuManager.pressButtonFeedback(name);
                PlayPauseMenuManager.playButtonInteraction();
                setTimeout(function(){ PlayPauseMenuManager.playoutTimeDisplayLogic(true); }, clickInteractionTimeout);
        		break;

        	case "pauseButton":
                MenuManager.pressButtonFeedback(name);
                PlayPauseMenuManager.pauseButtonInteraction();
                setTimeout(function(){ PlayPauseMenuManager.playoutTimeDisplayLogic(false); }, clickInteractionTimeout);     
        		break;

        	case "backSeekButton":
                MenuManager.pressButtonFeedback(name);
        		PlayPauseMenuManager.seekAll( -seekTime );
                PlayPauseMenuManager.playoutTimeDisplayLogic(true);
        		break;

        	case "forwardSeekButton":
                MenuManager.pressButtonFeedback(name);
        		PlayPauseMenuManager.seekAll( seekTime );
                PlayPauseMenuManager.playoutTimeDisplayLogic(true);
        		break;

        //****************************
        //      Volume controls
        //****************************

        	case "minusVolumeButton":
                MenuManager.pressButtonFeedback(name);
        		AudioManager.changeVolume( -volumeChangeStep );      
                VolumeMenuManager.volumeLevelDisplayLogic();              
        		break;

        	case "plusVolumeButton":
                MenuManager.pressButtonFeedback(name);
        		AudioManager.changeVolume( volumeChangeStep );
                VolumeMenuManager.volumeLevelDisplayLogic();
                break;

        	case "muteVolumeButton":
                MenuManager.pressButtonFeedback(name);
        		AudioManager.setmute();
                setTimeout(function(){ VolumeMenuManager.showMuteUnmuteButton(); }, clickInteractionTimeout);                
        		break;

        	case "unmuteVolumeButton":
                MenuManager.pressButtonFeedback(name);
        		AudioManager.setunmute();
                setTimeout(function(){ VolumeMenuManager.showMuteUnmuteButton(); }, clickInteractionTimeout);
        		break;

        //****************************
        //     Settings Cardboard controls
        //****************************

        	case "cardboardButton":
                MenuManager.pressButtonFeedback(name);
        		AplicationManager.switchDevice();
        		break;

        	case "settingsButton":
                MenuManager.pressButtonFeedback(name);
                setTimeout(function(){ MenuManager.openSecondLevelMenu(5); }, clickInteractionTimeout);
        		break;


        //****************************
        //     Settings  controls
        //****************************  
              
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
                MenuManager.selectOptionFinalDropdown(name);
                settingsLanguage = name;
                break;

            case "settingsLanguageEspButton":
                console.log("Settings language changed to SPANISH");
                MenuManager.selectOptionFinalDropdown(name);
                settingsLanguage = name;
                break;

            case "settingsLanguageGerButton":
                console.log("Settings language changed to GERMAN");
                MenuManager.selectOptionFinalDropdown(name);
                settingsLanguage = name;
                break;

            case "settingsLanguageCatButton":
                console.log("Settings language changed to CATALAN");
                MenuManager.selectOptionFinalDropdown(name);
                settingsLanguage = name;
                break;

        //****************************
        //     Multi options menu
        //****************************

            case "showSubtitleMenuButton":
            case "disabledSubtitleMenuButton":
                // show the subtitle configuration menu
                MenuManager.pressButtonFeedback(name);
                setTimeout(function(){ 
                    MenuManager.openSecondLevelMenu(6);
                    SubtitleMenuManager.showOnOffToggleButton();
                 }, clickInteractionTimeout);
                break;

            case "showSignLanguageMenuButton":
            case "disabledSignLanguageMenuButton":
                // TODO
                // show the sign language configuration menu
                MenuManager.pressButtonFeedback(name);
                break;

            case "showAudioDescriptionMenuButton":
            case "disabledAudioDescriptionMenuButton":
                // TODO
                // show the audio description configuration menu
                MenuManager.pressButtonFeedback(name);
                //MenuManager.openSecondLevelMenu(7);
                break;

            case "showAudioSubtitleMenuButton":
            case "disabledAudioSubtitleMenuButton":
                // TODO
                // show the audio subtitle configuration menu
                MenuManager.pressButtonFeedback(name);
                break;

        //****************************
        //     Audio Description controls
        //****************************
            case "audioDescriptionOnButton":
            //TODO
                break;

            case "audioDescriptionOffButton":
            //TODO
                break;
        //****************************
        //     Subtitle controls
        //****************************

        	case "subtitleTopButton":
        		subController.setSubPosition( 0, 1 );
                MenuManager.selectOptionFinalDropdown(name);
                subtitlesPosition = name;
        		break;

        	case "subtitleBottomButton":
        		subController.setSubPosition( 0, -1 );
                MenuManager.selectOptionFinalDropdown(name);
                subtitlesPosition = name;
        		break;

        	case "subtitleOnButton":
        		subController.enableSubtitles();
                menuList[6].isEnabled = false;
                MultiOptionsMenuManager.showMultiOptionsButtons(multiOptionsMainSubMenuIndexes.slice(0,1));
                SubtitleMenuManager.showOnOffToggleButton();
        		break;

        	case "subtitleOffButton":
        		subController.disableSubtiles();
                menuList[6].isEnabled = true;
                MultiOptionsMenuManager.showMultiOptionsButtons(multiOptionsMainSubMenuIndexes.slice(0,1));
                SubtitleMenuManager.showOnOffToggleButton();
        		break;

        	case "subtitleEngButton":
        		subController.setSubtitle( "./resources/LICEU_ENG.xml" ); 
                MenuManager.selectOptionFinalDropdown(name);
                subtitlesLanguage = name;
        		break;

        	case "subtitleEspButton":
        		subController.setSubtitle( "./resources/LICEU_CAST.xml" ); 
                MenuManager.selectOptionFinalDropdown(name);
                subtitlesLanguage = name;
        		break;

            case "subtitleGerButton":
                console.log("Subtitles changed to GERMAN");
                MenuManager.selectOptionFinalDropdown(name);
                subtitlesLanguage = name;
                break;

            case "subtitleCatButton":
                console.log("Subtitles changed to CATALAN");
                MenuManager.selectOptionFinalDropdown(name);
                subtitlesLanguage = name;
                break;

        	case "subtitleIndicatorNoneButton":
        		subController.setSubIndicator( "none" );
                MenuManager.selectOptionFinalDropdown(name);
        		break;

        	case "subtitleIndicatorArrowButton":
        		subController.setSubIndicator( "arrow" );
                MenuManager.selectOptionFinalDropdown(name);
        		break;

        	case "subtitleIndicatorRadarButton":
        		subController.setSubIndicator( "compass" );
                MenuManager.selectOptionFinalDropdown(name);
        		break;

        	case "subtitleSmallAreaButton":
        		subController.setSize( 50 );
                MenuManager.selectOptionFinalDropdown(name);
                subtitlesSize = name;
        		break;

        	case "subtitleMediumlAreaButton":
        		subController.setSize( 60 );
                MenuManager.selectOptionFinalDropdown(name);
                subtitlesSize = name;
        		break;

        	case "subtitleLargeAreaButton":
        		subController.setSize( 70 );
                MenuManager.selectOptionFinalDropdown(name);
                subtitlesSize = name;
        		break;

        	case "subtitleShowLanguagesDropdown":
                MenuManager.openSubMenuDropdown(0, name);
        		// TODO
        		// mostar el menu con la lista de idiomas seleccionables
        		break;

        	case "subtitleShowPositionsDropdown":
        		// TODO
        		MenuManager.openSubMenuDropdown(1, name);
        		break;
            case "subtitleShowAreasDropdown":
                // mostrar lista de areas de visualizacion (small/medium/large)
                MenuManager.openSubMenuDropdown(2, name);
                break;

            case "subtitleShowIndicatorDropdown":
                // mostrar lista de indicadores de visualizacion (none/arrow/radar)
                MenuManager.openSubMenuDropdown(3, name);
                break;

        	case "subtitleShowSpeakers":
        		// TODO
        		// mostrar lista de los indicadores (none/arrow/radar)
        		break;

        	case "subtitleShowAreas":
        		// TODO
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
                if ( intersects[inter].object.type == 'Mesh' && intersects[inter].object.name) 
	        	{
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