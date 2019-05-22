/**
 * @author isaac.fraile@i2cat.net
 */

 // used libs: subController, MenuManager, interController, MenuController, AplicationManager
 // used globals: subtitlesLanguage....., camera, autopositioning, menuList

MenuFunctionsManager = function() {

    function getUpdateAccesLanguage(lang)
    {
        return function() 
        {
            _iconf.accesslanguage = lang;
            var ste2r = subController.getSubEasy() ? 1 : 0;
            var aste2r = _AudioManager.getSubEasy() ? 1 : 0;

            if ( list_contents[ demoId ].subtitles && list_contents[ demoId ].subtitles[ ste2r ] && subController.checkisSubAvailable()) {
                var sublang = list_contents[ demoId ].subtitles[ ste2r ][ lang ] ? lang : Object.keys( list_contents[ demoId ].subtitles[ ste2r ] )[ 0 ];
                subController.setSubtitle( list_contents[ demoId ].subtitles[ ste2r ][ sublang ], sublang );
            } else {
                subController.disableSubtiles();
            }

            if ( list_contents[ demoId ].signer && list_contents[ demoId ].signer[ 0 ] && subController.checkisSignAvailable()) {
                var siglang = list_contents[ demoId ].signer[ 0 ][ lang ] ? lang : Object.keys( list_contents[ demoId ].signer[ 0 ] )[ 0 ];
                subController.setSignerContent( list_contents[ demoId ].signer[ 0 ][ siglang ], siglang );
            } else {
                subController.disableSigner();
            }

            if ( list_contents[ demoId ].ad && list_contents[ demoId ].ad[ 0 ] && _AudioManager.checkisADAvailable()) {
                var adlang = list_contents[ demoId ].ad[ 0 ][ lang ] ? lang : Object.keys( list_contents[ demoId ].ad[ 0 ] )[ 0 ];
                _AudioManager.setADContent( list_contents[ demoId ].ad[ 0 ][ adlang ], adlang );
            } else {
                //_AudioManager.disableAD(); // TODO
            }
            
            if ( list_contents[ demoId ].ast && list_contents[ demoId ].ast[ aste2r ] && _AudioManager.checkisASTAvailable()) {
                var astlang = list_contents[ demoId ].ast[ aste2r ][ lang ] ? lang : Object.keys( list_contents[ demoId ].ast[ aste2r ] )[ 0 ];
                _AudioManager.setASTContent( list_contents[ demoId ].ast[ aste2r ][ astlang ], astlang );
            } else {
                //_AudioManager.disableAST(); // TODO
            }
        }
    }

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
            if ( subController.getSubtitleEnabled() ) subController.setSignerPosition( subController.getSignerPosition().x, position );
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
            if ( !_isHMD )
            {
                AplicationManager.disableVR();
                camera.rotation.set( 0,0,0 );

                menuMgr.ResetViews();

                subController.setSubIndicator( 'none' );
                subController.enableAutoPositioning();

                autopositioning = true;
            }
        }
    }

    function getSubAreaFunc(area)
    {
        return function() {
            subController.setSubArea( area );
        }
    }

//************************************************************************************
// Signer Functions
//************************************************************************************

    function getSignerPositionFunc(position)
    {
        return function() {
            subController.setSignerPosition( position, subController.getSubPosition().y);
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

    function getASTPresentationFunc(value)
    {
        return function() {
            _AudioManager.setASTPresentation( value );
        }
    }

//************************************************************************************
// Settings Functions
//************************************************************************************

    function getSaveConfigFunc()
    {
        return function() {
            saveConfig();
        }
    }

    function getVoiceControlFunc(enable)
    {
        return;
    }

//************************************************************************************
// Public Functions
//************************************************************************************

    this.getopenMenu = function() 
    {
        return function() {
            if ( scene.getObjectByName( "openMenu" ).visible ) menuMgr.initFirstMenuState();
        }
    }

    this.getcloseMenu = function() 
    {
        return function() {
            menuMgr.ResetViews();
        }
    }

    this.getMainLanguageFunc = function(language){
        MenuDictionary.setMainLanguage( language );

        if(menuMgr.getMenuType() == 2){
            menuMgr.removeMenuFromParent();
            menuMgr.Init(2);
            menuMgr.initFirstMenuState();
        } else {
            menuMgr.ResetViews();
            //SettingsOptionCtrl.Exit();
            
        }
        menuMgr.Load(SettingsOptionCtrl);       
    }

    this.getChangePointerSizeFunc = function(size){
        _pointerSize = size;
        menuMgr.ResetViews();
        menuMgr.initFirstMenuState();
    }

    this.getPlayPauseFunc = function(play)
    {
        return function() {
            play ? _Sync.vc( 'play', VideoController.getMediaTime()* 1000000000 ) : _Sync.vc( 'pause', VideoController.getMediaTime()* 1000000000 );
            play ? VideoController.playAll() : VideoController.pauseAll();
        }
    };

    this.getSeekFunc = function(plus, seekTime = 5)
    {
        var sign = plus ? 1 : -1;
        return function() {
            VideoController.seekAll( sign*seekTime );
        }
    };

    this.getSpeedFunc = function(speed)
    {
        return function() {
            VideoController.speedAll( speed );
        }
    };

    this.getChangeVolumeFunc = function(plus, volumeChangeStep = 0.2)
    {
        var sign = plus ? 1 : -1;
        return function() {
            _AudioManager.changeVolume( sign * volumeChangeStep );
        }
    };


/* DEPRECATED Options are enabled and disabled by clicking in the corresponding icon*/
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


    this.changeAccesLanguage = function(lang)
    {
        return getUpdateAccesLanguage( lang );
    }

    this.getChangeMenuTypeFunction = function(){

        // TYPE 1 => Enhanced; TYPE 2 => Trdaitional;
        let newType = (menuMgr.getMenuType()%2)+1;
        menuMgr.ResetViews();
        menuMgr.removeMenuFromParent();
        menuMgr.Init(newType);
        menuMgr.initFirstMenuState();   
    }

    this.checkMenuType = function(menuType)
    {
        return menuType == menuMgr.getMenuType();
    }
}
