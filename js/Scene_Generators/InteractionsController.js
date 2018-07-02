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
		switch ( name )
        {

        //****************************
        //       Main controls
        //****************************

        	case "openMenu":
        		scene.getObjectByName( "backgroudMenu" ) ? console.log("Menu already open") : MenuManager.openMenu();
				break;

        	case "backMenuButton":
        		MenuManager.changeMenuLeftOrRight( false );
        		break;

        	case "forwardMenuButton":
        		MenuManager.changeMenuLeftOrRight( true );
        		break;

        	case "closeMenuButton":
        		MenuManager.closeMenu();
        		break;

        //****************************
        //      Player controls
        //****************************

        	case "playButton":
        		MenuManager.playButtonInteraction();
        		break;

        	case "pauseButton":
        		MenuManager.pauseButtonInteraction();
        		break;

        	case "backSeekButton":
        		moData.seekAll( -5 );
        		break;

        	case "forwardSeekButton":
        		moData.seekAll( 5 );
        		break;

        //****************************
        //      Volume controls
        //****************************

        	case "minusVolumeButton":
        		AudioManager.changeVolume( -0.2 );
        		break;

        	case "plusVolumeButton":
        		AudioManager.changeVolume( 0.2 );
        		break;

        	case "muteVolumeButton":
        		AudioManager.setmute();
        		break;

        	case "unmuteVolumeButton":
        		AudioManager.setunmute();
        		break;

        //****************************
        //     Settings controls
        //****************************

        	case "cardboardButton":
        		AplicationManager.switchDevice();
        		break;

        	case "settingsButton":
        		// TODO
        		break;

        //****************************
        //     Subtitle controls
        //****************************

        	case "subtitleTopButton":
        		subController.setSubPosition( 0, 1 );
        		break;

        	case "subtitleBottomButton":
        		subController.setSubPosition( 0, -1 );
        		break;

        	case "subtitleOnButton":
        		subController.enableSubtitles();
        		break;

        	case "subtitleOffButton":
        		subController.disableSubtiles();
        		break;

        	case "subtitleEngButton":
        		subController.setSubtitle( "./resources/LICEU_ENG.xml" ); 
        		break;

        	case "subtitleEspButton":
        		subController.setSubtitle( "./resources/LICEU_CAST.xml" ); 
        		break;

        	case "subtitleNoneButton":
        		subController.setSubIndicator( "none" );
        		break;

        	case "subtitleArrowButton":
        		subController.setSubIndicator( "arrow" );
        		break;

        	case "subtitleRadarButton":
        		subController.setSubIndicator( "compass" );
        		break;

        	case "subtitleSmallAreaButton":
        		subController.setSize( 50 );
        		break;

        	case "subtitleMediumlAreaButton":
        		subController.setSize( 60 );
        		break;

        	case "subtitleLargeAreaButton":
        		subController.setSize( 70 );
        		break;

        	case "showSubtitleMenu":
        		// TODO
        		// mostrar menu de configuracion de subtitulos
        		break;

        	case "subtitleShowLanguages":
        		// TODO
        		// mostar el menu con la lista de idiomas seleccionables
        		break;

        	case "subtitleShowPositions":
        		// TODO
        		// mostrar la lista de las posiciones de los subtitulos (top/bottom)
        		break;

        	case "subtitleShowSpeakers":
        		// TODO
        		// mostrar lista de los indicadores (none/arrow/radar)
        		break;

        	case "subtitleShowAreas":
        		// TODO
        		// mostrar lista de areas de visualizacion (small/medium/large)
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

		//raycaster = new THREE.Raycaster();
    	raycaster.setFromCamera( mouse3D, camera );
    	var intersects = raycaster.intersectObjects( interactiveListObjects, true ); // false

    	if ( intersects[0] )
    	{
    		var intersectedShapeId;
			for(var inter = 0; inter < intersects.length; inter++)
	        {
	        	if ( intersects[inter].object.type == 'Mesh' || intersects[inter].object.type == 'Group' ) 
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
		interactiveListObjects.push(object);
	};

	this.removeInteractiveObject = function(name)
	{
		interactiveListObjects = interactiveListObjects.filter(e => e.name != name);
	}
}

THREE.InteractionsController.prototype.constructor = THREE.InteractionsController;