/**
 * @author isaac.fraile@i2cat.net
 */

 // used libs: subController, MenuManager, interController, MenuController, AplicationManager
 // used globals: subtitlesLanguage....., camera, autopositioning, menuList

MenuFunctionsManager = function() {

    function getUpdateAccesLanguage(lang, accesService)
    {
        return function() 
        {
            _iconf.accesslanguage = lang;
            var ste2r = subController.getSubEasy() ? 1 : 0;
            var aste2r = _AudioManager.getSubEasy() ? 1 : 0;

            switch(accesService){

                case 'st':
                    if ( list_contents[ demoId ].subtitles && list_contents[ demoId ].subtitles[ ste2r ] && subController.checkisSubAvailable()) {
                        var sublang = list_contents[ demoId ].subtitles[ ste2r ][ lang ] ? lang : Object.keys( list_contents[ demoId ].subtitles[ ste2r ] )[ 0 ];
                        subController.setSubtitle( list_contents[ demoId ].subtitles[ ste2r ][ sublang ], sublang );
                    } else {
                        subController.disableSubtiles();
                    }
                    break;

                case 'sl':
                    if ( list_contents[ demoId ].signer && list_contents[ demoId ].signer[ 0 ] && subController.checkisSignAvailable()) {
                        var siglang = list_contents[ demoId ].signer[ 0 ][ lang ] ? lang : Object.keys( list_contents[ demoId ].signer[ 0 ] )[ 0 ];
                        subController.setSignerContent( list_contents[ demoId ].signer[ 0 ][ siglang ], siglang );
                    } else {
                        subController.disableSigner();
                    }                
                    break;

                case 'ad':
                    if ( list_contents[ demoId ].ad && list_contents[ demoId ].ad[ 0 ] && _AudioManager.checkisADAvailable()) {
                        var adlang = list_contents[ demoId ].ad[ 0 ][ lang ] ? lang : Object.keys( list_contents[ demoId ].ad[ 0 ] )[ 0 ];
                        _AudioManager.setADContent( list_contents[ demoId ].ad[ 0 ][ adlang ], adlang );
                    } else {
                        //_AudioManager.disableAD(); // TODO
                    }                
                    break;

                case 'ast':
                    if ( list_contents[ demoId ].ast && list_contents[ demoId ].ast[ aste2r ] && _AudioManager.checkisASTAvailable()) {
                        var astlang = list_contents[ demoId ].ast[ aste2r ][ lang ] ? lang : Object.keys( list_contents[ demoId ].ast[ aste2r ] )[ 0 ];
                        _AudioManager.setASTContent( list_contents[ demoId ].ast[ aste2r ][ astlang ], astlang );
                    } else {
                        //_AudioManager.disableAST(); // TODO
                    }                
                    break;
            }
        }
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


    this.changeAccesLanguage = function(lang, accesService)
    {
        return getUpdateAccesLanguage( lang, accesService );
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


    this.getOnOffFunc = function(name){
      switch ( name ){
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
}
