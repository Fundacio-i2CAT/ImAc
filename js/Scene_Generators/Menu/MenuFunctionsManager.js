/**
 * @author isaac.fraile@i2cat.net
 */

 // used libs: subController, MenuManager, interController, MenuController, AplicationManager
 // used globals: subtitlesLanguage....., camera, autopositioning, menuList

MenuFunctionsManager = function() {

//************************************************************************************
// Subtitle Functions
//************************************************************************************

    function getSubLanguageFunc(xml, name)
    {    
        return function() {
            subController.setSubtitle( xml );
            MenuManager.selectFinalDropdownOption( name );
            subtitlesLanguage = name;
        }
    }

    function getSubEasyOnOffFunc(enable, name)
    {       
        return function() {
            subController.setSubEasy( enable );
            MenuManager.selectFinalDropdownOption( name );
            subtitlesEasy = name;
        }
    }

    function getSubPositionFunc(position, name)
    {       
        return function() {
            subController.setSubPosition( 0, position );
            MenuManager.selectFinalDropdownOption( name );
            subtitlesPosition = name;
        }
    }

    function getSubBackgroundFunc(index, name)
    {       
        return function() {
            subController.setSubBackground( index );
            MenuManager.selectFinalDropdownOption( name );
            subtitlesBackground = name;
        }
    }

    function getSubSizeFunc(size, name)
    {       
        return function() {
            subController.setSubSize( size );
            MenuManager.selectFinalDropdownOption( name );
            subtitlesSize = name;
        }
    }

    function getSubIndicatorFunc(indicator, name)
    {       
        return function() {
            subController.setSubIndicator( indicator );
            MenuManager.selectFinalDropdownOption( name );
            subtitlesIndicator = name;
        }
    }

    function getSubAutoPositioningFunc(name)
    {       
        return function() {
            if ( !_isHMD ) AplicationManager.disableVR();
            camera.rotation.set( 0,0,0 );
            CameraParentObject.quaternion.set(0,0,0,0);

            if ( interController.getSubtitlesActive() ) subController.enableSubtitles();

            setTimeout(function() {
                MenuManager.closeMenu(); 
                scene.getObjectByName( "openMenu" ).visible = true;
                //scene.getObjectByName( "openMenuTrad" ).visible = true; //EXPERIMENTAL
            }, clickInteractionTimeout);

            subController.setSubIndicator( 'none' );
            subController.enableAutoPositioning();
            MenuManager.selectFinalDropdownOption( name );
            //subtitlesIndicator = name;
            autopositioning = true;
        }
    }

    function getSubAreaFunc(area, name)
    {       
        return function() {
            subController.setSubArea( area );
            MenuManager.selectFinalDropdownOption( name );
            subtitlesArea = name;
        }
    }

    function getSubOnOffFunc(isEnabled)
    {       
        return function() {
            interController.setSubtitlesActive( isEnabled );
            menuList[6].isEnabled = isEnabled;
            MenuController.showMultiOptionsButtons( multiOptionsMainSubMenuIndexes.slice(0,1) );
            MenuController.showOnOffToggleButton( 6, 0, 1, 0, 4 );
        }
    }

    function getSignerOnOffFunc(isEnabled)
    {       
        return function() {
            //interController.setSignerActive( isEnabled );
            menuList[7].isEnabled = isEnabled;
            MenuController.showMultiOptionsButtons( multiOptionsMainSubMenuIndexes.slice(1,2) );
            MenuController.showOnOffToggleButton( 7, 0, 1, 1, 5 );
        }
    }

    function getAudioDescOnOffFunc(isEnabled)
    {       
        return function() {
            //TODO AD functionality
            menuList[8].isEnabled = isEnabled;
            MenuController.showMultiOptionsButtons( multiOptionsMainSubMenuIndexes.slice(2,3) );
            MenuController.showOnOffToggleButton( 8, 0, 1, 2, 6 );
        }
    }

    function getAudioSubOnOffFunc(isEnabled)
    {       
        return function() {
            //TODO AST functionality
            menuList[9].isEnabled = isEnabled;
            MenuController.showMultiOptionsButtons( multiOptionsMainSubMenuIndexes.slice(3,4) );
            MenuController.showOnOffToggleButton( 9, 0, 1, 3, 7 );
        }
    }

//************************************************************************************
// Settings Functions
//************************************************************************************

    function getMainLanguageFunc(name, language)
    {       
        return function() {
            MenuManager.selectFinalDropdownOption( name );
            settingsLanguage = name;
            MenuDictionary.initGlobalArraysByLanguage( language );
            setTimeout(function() {
                MenuManager.closeMenu(); 
                MenuManager.openMenu();
                //scene.getObjectByName( "openMenu" ).visible = true;
                //scene.getObjectByName( "openMenuTrad" ).visible = true; //EXPERIMENTAL
            }, clickInteractionTimeout);
        }
    }


//************************************************************************************
// Public Functions
//************************************************************************************

    this.getOpenMenuFunc = function()
    {       
        return function() {
            interController.setSubtitlesActive( subController.getSubtitleEnabled() );
            if ( interController.getSubtitlesActive() ) subController.disableSubtiles();
            MenuDictionary.initGlobalArraysByLanguage();
            MenuManager.openMenu();
            scene.getObjectByName( "openMenu" ).visible = false;
            scene.getObjectByName( "openmenutext" ).visible = false;
        }
    };

    this.getSTMenuFunc = function(name)
    {       
        return function() {
            MenuManager.pressButtonFeedback( name );
            setTimeout(function(){ 
                MenuManager.openSecondLevelMenu(6);
                MenuController.showOnOffToggleButton(6, 0, 1, 0, 4);// Indexes from MenuState menuList
            }, clickInteractionTimeout);
        }
    };

    this.getSLMenuFunc = function(name)
    {       
        return function() {
            MenuManager.pressButtonFeedback( name );
            setTimeout(function(){ 
                MenuManager.openSecondLevelMenu(7);
                MenuController.showOnOffToggleButton(7, 0, 1, 1, 5);// Indexes from MenuState menuList
            }, clickInteractionTimeout);
        }
    };

    this.getADMenuFunc = function(name)
    {       
        return function() {
            MenuManager.pressButtonFeedback( name );
            setTimeout(function(){ 
                MenuManager.openSecondLevelMenu(8);
                MenuController.showOnOffToggleButton(8, 0, 1, 2, 6);// Indexes from MenuState menuList
            }, clickInteractionTimeout);
        }
    };

    this.getASTMenuFunc = function(name)
    {       
        return function() {
            MenuManager.pressButtonFeedback( name );
            setTimeout(function(){ 
                MenuManager.openSecondLevelMenu(9);
                MenuController.showOnOffToggleButton(9, 0, 1, 3, 7);// Indexes from MenuState menuList
            }, clickInteractionTimeout);
        }
    };

    this.getSubShowDropdownFunc = function(index, name)
    {       
        return function() {
            MenuManager.openSubMenuDropdown( index, name );
        }
    };

    this.getSubUpDownFunc = function(position)
    {
        return function() {
            var indexActiveMenu = menuList.map(function(e) { return e.name; }).indexOf(interController.getActiveMenuName());
            var h = scene.getObjectByName(menuList[0].name).geometry.parameters.height;

            menuList[indexActiveMenu].buttons.forEach( function( elem )
            {
                if ( elem == 'subtitlesShowLanguagesDropdown' 
                    || elem == 'subtitlesShowEasyReadDropdown' 
                    || elem == 'subtitlesShowPositionsDropdown' 
                    || elem == 'subtitlesShowBackgroundDropdown' 
                    || elem == 'subtitlesShowSizesDropdown'
                    || elem == 'subtitlesShowIndicatorDropdown'
                    || elem == 'subtitlesShowAreasDropdown' )
                {
                    var menuElem = scene.getObjectByName( elem );
                    menuElem.position.y = position ? menuElem.position.y + h/4 : menuElem.position.y - h/4;

                    if ( menuElem.visible && menuElem.position.y > h/4 ) menuElem.visible = false;
                    else if ( menuElem.visible && menuElem.position.y < -h/4 ) menuElem.visible = false;
                    else if ( menuElem.visible == false && menuElem.position.y <= h/4 && menuElem.position.y >= -h/4 ) menuElem.visible = true;

                    // Posible position.y -->        -2, -1, 0, 1, 2         (5 elements)
                    // Posible position.y -->    -3, -2, -1, 0, 1, 2         (6 elements)
                    // Posible position.y -->    -3, -2, -1, 0, 1, 2, 3      (7 elements)

                    if ( menuElem.position.y < -3*h/4 ) menuElem.position.y = 3*h/4;
                    else if ( menuElem.position.y > 3*h/4 ) menuElem.position.y = -3*h/4;
                }
            });
        }
    };

    this.getPlayPauseFunc = function(name)
    {
        return function() {
            MenuManager.pressButtonFeedback( name );
            ppMMgr.isPausedById(0) ? ppMMgr.playAll() : ppMMgr.pauseAll();
            setTimeout(function() { 
                ppMMgr.playoutTimeDisplayLogic( ppMMgr.isPausedById(0) ); 
            }, clickInteractionTimeout);
        }
    };

    this.getSeekFunc = function(plus, name)
    {
        var sign = plus ? 1 : -1;
        return function() {
            MenuManager.pressButtonFeedback( name );
            ppMMgr.seekAll( sign*seekTime );
            ppMMgr.playoutTimeDisplayLogic( true );
        }
    };

    this.getChangeVolumeFunc = function(plus, name)
    {
        var sign = plus ? 1 : -1;
        return function() {
            MenuManager.pressButtonFeedback( name );
            AudioManager.changeVolume( sign*volumeChangeStep );
            MenuController.volumeLevelDisplayLogic();
        }
    };

    this.getMuteVolumeFunc = function(name)
    {
        return function() {
            MenuManager.pressButtonFeedback( name );
            AudioManager.setmute();
            setTimeout(function() { 
                MenuController.showMuteUnmuteButton(); 
            }, clickInteractionTimeout); 
        }
    };

    this.getUnMuteVolumeFunc = function(name)
    {
        return function() {
            MenuManager.pressButtonFeedback( name );
            AudioManager.setunmute();
            setTimeout(function() { 
                MenuController.showMuteUnmuteButton(); 
            }, clickInteractionTimeout); 
        }
    };

    this.getSettingsMenuFunc = function(name)
    {
        return function() {
            MenuManager.pressButtonFeedback( name );
            setTimeout(function() { 
                MenuManager.openSecondLevelMenu(5); 
            }, clickInteractionTimeout);
        }
    };

    this.getCardboardFunc = function()
    {
        return function() {
            //interController.closeMenu();
            if ( interController.getSubtitlesActive() ) subController.enableSubtitles();
            setTimeout(function() {
                MenuManager.closeMenu(); 
                AplicationManager.switchDevice();
                scene.getObjectByName( "openMenu" ).visible = true;
             }, clickInteractionTimeout);
        }
    };

    this.getOnOffFunc = function(name)
    {
        switch ( name )
        {
            case "subtitlesOnButton":
                return getSubOnOffFunc( false );

            case "subtitlesOffButton":
                return getSubOnOffFunc( true );

            case "signLanguageOnButton":
                return getSignerOnOffFunc( false );

            case "signLanguageOffButton":
                return getSignerOnOffFunc( true );

            case "audioDescriptionOnButton":
                return getAudioDescOnOffFunc( false );

            case "audioDescriptionOffButton":
                return getAudioDescOnOffFunc( true );

            case "audioSubtitlesOnButton":
                return getAudioSubOnOffFunc( false );

            case "audioSubtitlesOffButton":
                return getAudioSubOnOffFunc( true );

            default: 
                return undefined;
        }
    };  

    this.getButtonFunctionByName = function(name)
    {
        switch ( name )
        {
        // Subtitles
            case "subtitlesEngButton":
                return getSubLanguageFunc( list_contents[demoId].subtitles[0]['en'], name );

            case "subtitlesEspButton":
                return getSubLanguageFunc( list_contents[demoId].subtitles[0]['es'], name );

            case "subtitlesGerButton":
                return getSubLanguageFunc( list_contents[demoId].subtitles[0]['de'], name );

            case "subtitlesCatButton":
                return getSubLanguageFunc( list_contents[demoId].subtitles[0]['ca'], name );

            case "subtitlesEasyOn":
                return getSubEasyOnOffFunc( true, name );

            case "subtitlesEasyOff":
                return getSubEasyOnOffFunc( false, name );

            case "subtitlesTopButton":
                return getSubPositionFunc( 1, name );

            case "subtitlesBottomButton":
                return getSubPositionFunc( -1, name );

            case "subtitlesSemitrans":
                return getSubBackgroundFunc( 0.8, name );

            case "subtitlesOutline":
                return getSubBackgroundFunc( 0, name );

            case "subtitlesSmallSizeButton":
                return getSubSizeFunc( 0.6, name );

            case "subtitlesMediumSizeButton":
                return getSubSizeFunc( 0.8, name );

            case "subtitlesLargeSizeButton":
                return getSubSizeFunc( 1, name );

            case "subtitlesIndicatorNoneButton":
                return getSubIndicatorFunc( "none", name );

            case "subtitlesIndicatorArrowButton":
                return getSubIndicatorFunc( "arrow", name );

            case "subtitlesIndicatorRadarButton":
                return getSubIndicatorFunc( "compass", name );

            case "subtitlesIndicatorAutoButton":
                return getSubAutoPositioningFunc( name );

            case "subtitlesSmallAreaButton":
                return getSubAreaFunc( 50, name );

            case "subtitlesMediumAreaButton":
                return getSubAreaFunc( 60, name );

            case "subtitlesLargeAreaButton":
                return getSubAreaFunc( 70, name );

        // Signer
            case "signerTopButton":
                return;

            case "signerBottomButton":
                return;

            case "signerIndicatorNoneButton":
                return;

            case "signerIndicatorArrowButton":
                return;

            case "signerIndicatorRadarButton":
                return;

            case "signerSmallAreaButton":
                return;

            case "signerMediumlAreaButton":
                return;

            case "signerLargeAreaButton":
                return;

        // Audio Description
            case "adEngButton":
                return;

            case "adEspButton":
                return;

            case "adGerButton":
                return;

            case "adCatButton":
                return;

            case "adPrespectiveButton":
                return;

            case "adAnchoredButton":
                return;

            case "adClassicButton":
                return;

            case "adPanoramaButton":
                return;

        // Audio Description
            case "astEngButton":
                return;

            case "astEspButton":
                return;

            case "astGerButton":
                return;

            case "astCatButton":
                return;

            case "astEasyOn":
                return;

            case "astEasyOff":
                return;

        // Settings
            case "settingsLanguageEngButton":
                return getMainLanguageFunc( name, 'en' );

            case "settingsLanguageEspButton":
                return getMainLanguageFunc( name, 'es' );

            case "settingsLanguageGerButton":
                return getMainLanguageFunc( name, 'de' );

            case "settingsLanguageCatButton":
                return getMainLanguageFunc( name, 'ca' );

            case "vc1":
                return;

            case "up1":
                return;

            case "up2":
                return;

        // Default
            default: 
                return undefined;
        }
    };	
}