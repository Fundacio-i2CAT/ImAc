/**
 * @author isaac.fraile@i2cat.net
 */

 // used libs: _slMngr, _stMngr, MenuManager, interController, MenuController, AplicationManager
 // used globals: subtitlesLanguage....., camera, autopositioning, menuList

MenuFunctionsManager = function() {

    function getUpdateAccesLanguage(lang, accesService){
        return function(){
            //_iconf.accesslanguage = lang;

            switch(accesService){

                case 'st':
                    let ste2r = stConfig.easy2read ? 1 : 0;
                    if ( list_contents[ demoId ].subtitles && list_contents[ demoId ].subtitles[ ste2r ] && _stMngr.checkisSubAvailable( lang )) {
                        _iconf.stlanguage = lang;
                        _stMngr.setSubtitle( list_contents[ demoId ].subtitles[ ste2r ][ lang ], lang, 'st');
                    }else {
                        _stMngr.switchSubtitles(false);
                    }
                    break;

                case 'sl':
                    if ( list_contents[ demoId ].signer && list_contents[ demoId ].signer[ 0 ] && _slMngr.checkisSignAvailable( lang )) {
                        _iconf.sllanguage = lang;
                        _slMngr.setContent( list_contents[ demoId ].signer[ 0 ][ lang ], lang );
                    }else {
                        _slMngr.switchSigner(false);
                    } 

                    if ( list_contents[ demoId ].st4sl && list_contents[ demoId ].st4sl[ 0 ] && _slMngr.checkisSignAvailable( lang )) {
                        var siglang = list_contents[ demoId ].st4sl[ 0 ][ lang ] ? lang : Object.keys( list_contents[ demoId ].st4sl[ 0 ] )[ 0 ];
                        _slMngr.setSubtitle( list_contents[demoId].st4sl[0][siglang], siglang, 'sl' ); 
                    }              
                    break;

                case 'ad':
                    //_iconf.adlanguage = lang;
                    if ( list_contents[ demoId ].ad && list_contents[ demoId ].ad[ 0 ] && _AudioManager.checkisADAvailable( lang )) {
                        var adlang = list_contents[ demoId ].ad[ 0 ][ lang ] ? lang : Object.keys( list_contents[ demoId ].ad[ 0 ] )[ 0 ];
                        _AudioManager.setADContent( list_contents[ demoId ].ad[ 0 ][ adlang ], adlang );
                    } else {
                        //_AudioManager.disableAD(); // TODO
                    }                
                    break;

                case 'ast':
                    //_iconf.astlanguage = lang;
                    let aste2r = _AudioManager.getSubEasy() ? 1 : 0;

                    if ( list_contents[ demoId ].ast && list_contents[ demoId ].ast[ aste2r ] && _AudioManager.checkisASTAvailable( lang )) {
                        var astlang = list_contents[ demoId ].ast[ aste2r ][ lang ] ? lang : Object.keys( list_contents[ demoId ].ast[ aste2r ] )[ 0 ];
                        _AudioManager.setASTContent( list_contents[ demoId ].ast[ aste2r ][ astlang ], astlang );
                    }else {
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

    this.getUpdateVolumeFunc = function(volume)
    {
        return function() {
            _AudioManager.setNewVolume( volume );
        }
    }

    function getSubOnOffFunc(isEnabled)
    {
        return function() {
            _stMngr.switchSubtitles(isEnabled);
        }
    }

    function getSignerOnOffFunc(isEnabled)
    {
        return function() {
            _slMngr.switchSigner( isEnabled );
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

    this.getActiveExtraADFunc = function()
    {
        if ( _blockControls ) initExtraAdAudio();
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
