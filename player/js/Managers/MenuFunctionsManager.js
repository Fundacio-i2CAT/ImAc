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
            _AudioManager.switchAD( isEnabled );
        }
    }

    function getAudioSubOnOffFunc(isEnabled)
    {       
        return function() {
            _AudioManager.switchAST( isEnabled );
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
            subController.setSignerPosition( position, -1 );
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
// Audio Description Functions
//************************************************************************************

    function getADLanguageFunc(url, lang)
    {    
        return function() {
            _AudioManager.setADContent( url, lang );
        }
    }

    function getADVolumeFunc(level)
    {    
        return function() {
            _AudioManager.setVolume( 'AD', level );
        }
    }

    function getADPresentationFunc(value)
    {    
        return function() {
            _AudioManager.setADPresentation( value );
        }
    }

//************************************************************************************
// Audio Subtitle Functions
//************************************************************************************

    function getASTLanguageFunc(url, lang)
    {    
        return function() {
            _AudioManager.setASTContent( url, lang );
        }
    }

    function getASTVolumeFunc(level)
    {    
        return function() {
            _AudioManager.setVolume( 'AST', level );
        }
    }

    function getASTe2rURL() {

        var url;
        
        if ( list_contents[demoId].ast[1] )
        {
            var lang = subController.getSubLanguage();
            var e2r = list_contents[demoId].ast[1][lang] ? lang : Object.keys(list_contents[demoId].ast[1])[0];
            url = list_contents[demoId].ast[1][e2r];
        }

        return url;
    }

    function getASTEasyOnOffFunc(enable, xml)
    {       
        return function() {
            _AudioManager.setSubEasy( enable, xml );
        }
    }


//************************************************************************************
// Public Functions
//************************************************************************************


    this.getPlayPauseFunc = function(play)
    {
        return function() {
            play ? VideoController.playAll() : VideoController.pauseAll();
        }
    };

    this.getSeekFunc = function(plus)
    {
        var sign = plus ? 1 : -1;
        return function() {
            VideoController.seekAll( sign*seekTime );
        }
    };

    this.getChangeVolumeFunc = function(plus)
    {
        var sign = plus ? 1 : -1;
        return function() {
            _AudioManager.changeVolume( sign * volumeChangeStep );
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
                return getADLanguageFunc( list_contents[demoId].ad[0]['en'], 'en' );

            case "adEspButton":
                return getADLanguageFunc( list_contents[demoId].ad[0]['es'], 'es' );

            case "adGerButton":
                return getADLanguageFunc( list_contents[demoId].ad[0]['de'], 'de' );

            case "adCatButton":
                return getADLanguageFunc( list_contents[demoId].ad[0]['ca'], 'ca' );

            case "adVOGButton":
                return getADPresentationFunc( 'VoiceOfGod' );

            case "adFriendButton":
                return getADPresentationFunc( 'Friend' );

            case "adDynamicButton":
                return getADPresentationFunc( 'Dynamic' );

            case 'adVolumeLowButton':
                return getADVolumeFunc( 10 );

            case 'adVolumeMidButton':
                return getADVolumeFunc( 50 );

            case 'adVolumeMaxButton':
                return getADVolumeFunc( 100 );

        // Audio Subtitles
            case "astEngButton":
                var e2r = _AudioManager.getSubEasy() ? 1 : 0;
                return getASTLanguageFunc( list_contents[demoId].ast[e2r]['en'], 'en' );

            case "astEspButton":
                var e2r = _AudioManager.getSubEasy() ? 1 : 0;
                return getASTLanguageFunc( list_contents[demoId].ast[e2r]['es'], 'es' );

            case "astGerButton":
                var e2r = _AudioManager.getSubEasy() ? 1 : 0;
                return getASTLanguageFunc( list_contents[demoId].ast[e2r]['de'], 'de' );

            case "astCatButton":
                var e2r = _AudioManager.getSubEasy() ? 1 : 0;
                return getASTLanguageFunc( list_contents[demoId].ast[e2r]['ca'], 'ca' );

            case "astEasyOn":
                var url = getASTe2rURL();
                return getASTEasyOnOffFunc( true, url );

            case "astEasyOff":
                return getASTEasyOnOffFunc( false, list_contents[demoId].ast[0][_AudioManager.getASTLanguage()] );

            case 'astVolumeLowButton':
                return getASTVolumeFunc( 10 );

            case 'astVolumeMidButton':
                return getASTVolumeFunc( 50 );

            case 'astVolumeMaxButton':
                return getASTVolumeFunc( 100 );

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
