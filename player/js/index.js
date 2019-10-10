
// GLOBAL VARS

var _PlayerVersion = 'v0.09.0';

var AplicationManager = new AplicationManager();
var MenuFunctionsManager = new MenuFunctionsManager();

var _moData = new THREE.MediaObjectData();
var _rdr = new THREE.Radar();

var vwStrucMMngr = new ViewStructureMenuManager();
var menuMgr = new MenuManager();

var MenuDictionary = new MenuDictionary();

var _ManifestParser = new ManifestParser();

var _AudioManager = new AudioManager();
var subController = new SubSignManager();
var interController = new THREE.InteractionsController();
var polyfill = new WebVRPolyfill();
var statObj = new StatObject();

var VideoController = new VideoController();

var _ImAc = new ImAcController();
var _Sync = new SyncController();

let mainMenuCtrl;
let SettingsOptionCtrl;
let multiOptionsPreviewCtrl;

let menu;
let settingsMenu;
let menuParent;
let menuHeight;
let menuWidth;
let menuPositionY;
let mensuSettingsPostionX;

let menuUpDown = 1;


var loggerActivated = false;

var sessionId = Date.now(); // logger

var demoId = 1;

var mainContentURL = './resources/rapzember-young-hurn_edit.mp4';
//var _selected_content = 'Radio';

var list_contents;

var __etype = 0;

var _fixedST = false;
var _SLsubtitles = false;
var _iconf;
var _userprofile = true;
var _ws_vc;

var _pointerSize = 1; // 2=Big, 1=Mid, 0.6=Small

var optHeight;
var optWidth;
var menuDefaultColor = 0xe6e6e6;
var menuButtonActiveColor = 0xffff00;
var secondarySubIndex = 0;

var _isHMD = false;
var autopositioning = false;
var radarautopositioning = false;

var _blockControls = false;

let timerCloseMenu;

let sliderSelection;
var _isTV = false;
let isMenuInteracted = false;

var lastUpdate = Date.now();

/**
 * Initializes the web player.
 */

function init_webplayer()
{
	console.log('Version: ' + _PlayerVersion);

    if ( localStorage.ImAc_cookies == undefined ) localStorage.ImAc_cookies = confirm("Do you give us consent to register behavior metrics for research purposes?");
    if ( localStorage.ImAc_cookies ) gtag('set', {'user_id': localStorage.ImAc_UUID});   

    var myhash = window.location.hash.split('#');

    _AudioManager.initAmbisonicResources();

    _moData.setFont('./css/fonts/TiresiasScreenfont_Regular.json').then(() => { 

        $.getJSON('../content.json', function(json)
        {
            list_contents = json.contents;

            loadEmojisIcons()

            //if ( myhash && myhash[1] && myhash[1] < list_contents.length && list_contents[ myhash[1] ] && localStorage.ImAc_init == myhash[1] ) 
            //{
                demoId = myhash[1];
                
                localStorage.removeItem('ImAc_init');
                localStorage.ImAc_language ? MenuDictionary.setMainLanguage( localStorage.ImAc_language ) : MenuDictionary.setMainLanguage( 'en' );

                _isTV = localStorage.ImAc_lineal == 'true' && list_contents[ myhash[1] ].urlTV ? true : false;

                mainContentURL = ( _isTV && list_contents[ myhash[1] ].urlTV ) ? list_contents[ myhash[1] ].urlTV : list_contents[ myhash[1] ].url;

                if ( localStorage.ImAc_voiceControl == 'on' ) connectVoiceControl( localStorage.ImAc_voiceControlId, "http://51.89.138.157:3000/" );

                ///////////////////////////////////////////////////////////////
                var cookieconf = readCookie("ImAcProfileConfig");

                if ( cookieconf && cookieconf != null )
                {
                    _iconf = JSON.parse( cookieconf );

                    //_iconf.menutype= 'ls';

                    console.log( _iconf )
                    subController.setSTConfig( _iconf );
                    subController.setSLConfig( _iconf );
                    _AudioManager.setADConfig( _iconf );
                    _AudioManager.setASTConfig( _iconf );
                    iniGeneralSettings( _iconf );
                }
                ////////////////////////////////////////////////////////////////

                if ( !_iconf ) _iconf = [];
                
                //_iconf.accesslanguage = (MenuDictionary.isMainLanguageAvailable(_iconf.accesslanguage)) ? _iconf.accesslanguage : MenuDictionary.getAvailableLanguage();

                AplicationManager.init();

            //}
            //else window.location = window.location.origin + window.location.pathname.slice(0, -7);
        });
    });
}

$(window).on( 'hashchange', () => { window.location.reload() } );
