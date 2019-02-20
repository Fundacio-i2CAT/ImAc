
// GLOBAL VARS

var _PlayerVersion = 'v0.06.0';

var AplicationManager = new AplicationManager();
var MenuFunctionsManager = new MenuFunctionsManager();

var _moData = new THREE.MediaObjectData();

var menuMgr = new MenuManager();
var settingsMgr = new SettingsManager();

var MenuDictionary = new MenuDictionary();

var _ManifestParser = new ManifestParser();

var _AudioManager = new AudioManager();
var subController = new SubSignManager();
var interController = new THREE.InteractionsController();
var polyfill = new WebVRPolyfill();
var statObj = new StatObject();

var VideoController = new VideoController();

var _ImAc = new ImAcController();

let playpauseCtrl;
let volumeCtrl;
let settingsCtrl;
let multiOptionsCtrl;
let STOptionCtrl;
let SLOptionCtrl;
let ADOptionCtrl;
let ASTOptionCtrl;
let vpbCtrl;
let SettingsOptionCtrl;
let multiOptionsPreviewCtrl;

var loggerActivated = false;

var sessionId = Date.now(); // logger

var demoId = 1;

var mainContentURL = './resources/rapzember-young-hurn_edit.mp4';
//var _selected_content = 'Radio';

var list_contents;


/**
 * Initializes the web player.
 */	

function init_webplayer() 
{
	console.log('Version: ' + _PlayerVersion);

    var myhash = window.location.hash.split('#');

    _AudioManager.initAmbisonicResources();

    _moData.setFont('./css/fonts/TiresiasScreenfont_Regular.json').then(() => { 

        $.getJSON('../content.json', function(json)
        {
            list_contents = json.contents;

            if ( myhash && myhash[1] && myhash[1] < list_contents.length && list_contents[ myhash[1] ] && localStorage.ImAc_init == myhash[1] ) 
            {
                localStorage.removeItem('ImAc_init');
                localStorage.ImAc_language ? MenuDictionary.setMainLanguage( localStorage.ImAc_language ) : MenuDictionary.setMainLanguage( 'en' );

                mainContentURL = list_contents[ myhash[1] ].url;

                ///////////////////////////////////////////////////////////////
                var cookieconf = readCookie("ImAcProfileConfig");

                if ( cookieconf && cookieconf != null ) 
                {
                    var iconf = JSON.parse( cookieconf );
                    subController.setSTConfig( iconf.ST );
                    subController.setSLConfig( iconf.SL );
                    _AudioManager.setADConfig( iconf.AD );
                    _AudioManager.setASTConfig( iconf.AST );
                }
                ////////////////////////////////////////////////////////////////

                demoId = myhash[1];

                AplicationManager.init();

            }
            else window.location = window.location.origin + window.location.pathname.slice(0, -7);       
        });
    });
    //moData.setFont('./css/fonts/helvetiker_bold.typeface.json');
}

$(window).on( 'hashchange', () => { window.location.reload() } );