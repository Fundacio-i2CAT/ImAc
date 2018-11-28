/**
 * @author isaac.fraile@i2cat.net
 */

 // used libs: subController, MenuManager, interController, MenuController, AplicationManager
 // used globals: subtitlesLanguage....., camera, autopositioning, menuList

MenuFunctionsManager = function() {

//************************************************************************************
// Subtitle Functions
//************************************************************************************

    function getSubLanguageFunc(xml, lang)
    {    
        return function() {
            subController.setSubtitle( xml, lang );
        }
    }

    function getSubEasyOnOffFunc(enable, xml)
    {       
        return function() {
            subController.setSubEasy( enable, xml );
        }
    }

    function getSubPositionFunc(position)
    {       
        return function() {
            subController.setSubPosition( 0, position );
        }
    }

    function getSubBackgroundFunc(index)
    {       
        return function() {
            subController.setSubBackground( index );
        }
    }

    function getSubSizeFunc(size)
    {       
        return function() {
            subController.setSubSize( size );
        }
    }

    function getSubIndicatorFunc(indicator)
    {       
        return function() {
            subController.setSubIndicator( indicator );
        }
    }

    function getSubAutoPositioningFunc()
    {       
        return function() {
            if ( !_isHMD ) AplicationManager.disableVR();
            camera.rotation.set( 0,0,0 );
            CameraParentObject.quaternion.set(0,0,0,0);

            menuMgr.ResetViews();

            subController.setSubIndicator( 'none' );
            subController.enableAutoPositioning();

            autopositioning = true;
        }
    }

    function getSubAreaFunc(area)
    {       
        return function() {
            subController.setSubArea( area );
        }
    }

    function getSubOnOffFunc(isEnabled)
    {       
        return function() {
            subController.switchSubtitles(isEnabled);
        }
    }

    function getSignerOnOffFunc(isEnabled)
    {       
        return function() {
            subController.switchSigner( isEnabled );
        }
    }

    function getAudioDescOnOffFunc(isEnabled)
    {       
        return function() {
            //TODO AD functionality
            console.warn('TODO AD functionality')
        }
    }

    function getAudioSubOnOffFunc(isEnabled)
    {       
        return function() {
            //TODO AST functionality
            console.warn('TODO AST functionality')
        }
    }

//************************************************************************************
// Settings Functions
//************************************************************************************

    function getMainLanguageFunc(language)
    {      
        return function() {

            MenuDictionary.setMainLanguage( language );

            menuMgr.removeMenuFromParent();

            localStorage.ImAc_menuType == "LS_area" ? menuMgr.Init(1) : menuMgr.Init(2);

            menuMgr.initFirstMenuState(); 
        }
    }

    function getSignerPositionFunc(position)
    {       
        return function() {
            subController.setSignerPosition( 1, position );
        }
    }

    function getSignerAreaFunc(area)
    {       
        return function() {
            subController.setSignerArea( area );
        }
    }

    function getSignerIndicatorFunc(indicator)
    {       
        return function() {
            subController.setSignerIndicator( indicator );
        }
    }

    function getSignerLanguageFunc(url, lang)
    {    
        return function() {
            subController.setSignerContent( url, lang );
        }
    }

    function getE2RURL() {

        var url;
        
        if ( list_contents[demoId].subtitles[1] )
        {
            var lang = subController.getSubLanguage();
            var e2r = list_contents[demoId].subtitles[1][lang] ? lang : Object.keys(list_contents[demoId].subtitles[1])[0];
            url = list_contents[demoId].subtitles[1][e2r];
        }

        return url;
    }


//************************************************************************************
// Public Functions
//************************************************************************************

/*
    this.getPlayPauseFunc = function(play, name)
    {
        return function() {
            if (name) MenuManager.pressButtonFeedback( name );
            play ? VideoController.playAll() : VideoController.pauseAll();
            setTimeout(function() { 
                MenuController.playoutTimeDisplayLogic( VideoController.isPausedById(0) ); 
            }, clickInteractionTimeout);
        }
    };

    this.getSeekFunc = function(plus, name)
    {
        var sign = plus ? 1 : -1;
        return function() {
            if (name) MenuManager.pressButtonFeedback( name );
            VideoController.seekAll( sign*seekTime );
            MenuController.playoutTimeDisplayLogic( true );
        }
    };

    this.getChangeVolumeFunc = function(plus, name)
    {
        var sign = plus ? 1 : -1;
        return function() {
            if (name) MenuManager.pressButtonFeedback( name );
            _AudioManager.changeVolume( sign*volumeChangeStep );
            MenuController.volumeLevelDisplayLogic();
        }
    };

    this.getMuteVolumeFunc = function(name)
    {
        return function() {
            MenuManager.pressButtonFeedback( name );
            _AudioManager.setmute();
            setTimeout(function() { 
                MenuController.showMuteUnmuteButton(); 
            }, clickInteractionTimeout); 
        }
    };

    this.getUnMuteVolumeFunc = function(name)
    {
        return function() {
            MenuManager.pressButtonFeedback( name );
            _AudioManager.setunmute();
            setTimeout(function() { 
                MenuController.showMuteUnmuteButton(); 
            }, clickInteractionTimeout); 
        }
    };
*/

    this.getCardboardFunc = function()
    {
        return function() {
            console.error('Deprecated function! getCardboardFunc')
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
                var e2r = subController.getSubEasy() ? 1 : 0;
                return getSubLanguageFunc( list_contents[demoId].subtitles[e2r]['en'], 'en' );

            case "subtitlesEspButton":
                var e2r = subController.getSubEasy() ? 1 : 0;
                return getSubLanguageFunc( list_contents[demoId].subtitles[e2r]['es'], 'es' );

            case "subtitlesGerButton":
                var e2r = subController.getSubEasy() ? 1 : 0;
                return getSubLanguageFunc( list_contents[demoId].subtitles[e2r]['de'], 'de' );

            case "subtitlesCatButton":
                var e2r = subController.getSubEasy() ? 1 : 0;
                return getSubLanguageFunc( list_contents[demoId].subtitles[e2r]['ca'], 'ca' );

            case "subtitlesEasyOn":
                var url = getE2RURL();
                return getSubEasyOnOffFunc( true, url );

            case "subtitlesEasyOff":
                return getSubEasyOnOffFunc( false, list_contents[demoId].subtitles[0][subController.getSubLanguage()] );

            case "subtitlesTopButton":
                return getSubPositionFunc( 1 );

            case "subtitlesBottomButton":
                return getSubPositionFunc( -1 );

            case "subtitlesSemitrans":
                return getSubBackgroundFunc( 0.5 );

            case "subtitlesOutline":
                return getSubBackgroundFunc( 0 );

            case "subtitlesSmallSizeButton":
                return getSubSizeFunc( 0.6 );

            case "subtitlesMediumSizeButton":
                return getSubSizeFunc( 0.8 );

            case "subtitlesLargeSizeButton":
                return getSubSizeFunc( 1 );

            case "subtitlesIndicatorNoneButton":
                return getSubIndicatorFunc( "none" );

            case "subtitlesIndicatorArrowButton":
                return getSubIndicatorFunc( "arrow" );

            case "subtitlesIndicatorRadarButton":
                return getSubIndicatorFunc( "radar" );

            case "subtitlesIndicatorAutoButton":
                return getSubAutoPositioningFunc();

            case "subtitlesSmallAreaButton":
                return getSubAreaFunc( 50 );

            case "subtitlesMediumAreaButton":
                return getSubAreaFunc( 60 );

            case "subtitlesLargeAreaButton":
                return getSubAreaFunc( 70 );

        // Signer
            case "signerEngButton":
                return getSignerLanguageFunc( list_contents[demoId].signer[0]['en'], 'en' );

            case "signerEspButton":
                return getSignerLanguageFunc( list_contents[demoId].signer[0]['es'], 'es' );

            case "signerGerButton":
                return getSignerLanguageFunc( list_contents[demoId].signer[0]['de'], 'de' );

            case "signerCatButton":
                return getSignerLanguageFunc( list_contents[demoId].signer[0]['ca'], 'ca' );

            case "signerTopButton":
                return getSignerPositionFunc( 1 );

            case "signerBottomButton":
                return getSignerPositionFunc( -1 );

            case "signerIndicatorNoneButton":
                return getSignerIndicatorFunc( "none" );

            case "signerIndicatorArrowButton":
                return getSignerIndicatorFunc( "arrow" );

            case "signerIndicatorRadarButton":
                return getSubAutoPositioningFunc();

            case "signerSmallAreaButton":
                return getSignerAreaFunc( 50 );

            case "signerMediumlAreaButton":
                return getSignerAreaFunc( 60 );

            case "signerLargeAreaButton":
                return getSignerAreaFunc( 70 );

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
                return getMainLanguageFunc( 'en' );

            case "settingsLanguageEspButton":
                return getMainLanguageFunc( 'es' );

            case "settingsLanguageGerButton":
                return getMainLanguageFunc( 'de' );

            case "settingsLanguageCatButton":
                return getMainLanguageFunc( 'ca' );

            case "vc1":
                return;

            case "up1":
                return;

            case "up2":
                return;

            case "settingsMenuTraditionalButton":
                return settingsMgr.getChangeMenuTypeFunction(2);

            case "settingsMenuLowSightedButton":
                return settingsMgr.getChangeMenuTypeFunction(1);

        // Default
            default: 
                return undefined;
        }
    };	
}
