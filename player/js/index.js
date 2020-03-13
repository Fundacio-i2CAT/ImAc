
// GLOBAL VARS

var _PlayerVersion = 'v0.11.0';

var MenuFunctionsManager = new MenuFunctionsManager();

var _rdr = new THREE.Radar();

var menuMgr = new MenuManager();
var canvasMgr = new CanvasManager();

var MenuDictionary = new MenuDictionary();
var _ManifestParser = new ManifestParser();

var _AudioManager = new AudioManager();
var subController = new SubSignManager();
var _slMngr = new SLManager();
var _stMngr = new STManager();

var interController = new THREE.InteractionsController();
var polyfill = new WebVRPolyfill();
var statObj = new StatObject();

var VideoController = new VideoController();

var _ImAc = new ImAcController();
var _Sync = new SyncController();

let mainMenuCtrl;
let SettingsOptionCtrl;

let _canvasObj;
let menuHeight;
let menuWidth;

var loggerActivated = false;
var firstQoEmsg = true;
var globalDiff = 0;

var sessionId = Date.now(); // logger

var demoId = 1;
var list_contents;

var _iconf;
var _ws_vc;

var _pointerSize = 1; // 2=Big, 1=Mid, 0.6=Small

var optHeight;
var optWidth;

var _isHMD = false;
var _blockControls = false;

let elementSelection;

var _isTV = false;

var lastUpdate = Date.now();

let stConfig;
let slConfig;
let adConfig;
let astConfig;

let actionPausedVideo = false;
let vHeight; // visible height
let safeFactor = 0.2; //Creates a margin with the height of the scren. Diferent factor for HMD.

/**
 * Initializes the web player.
 */

async function showPopup()
{
    /*if ( localStorage.ImAc_cookies == undefined )
    {
        document.getElementById('mainpopup').style.display = 'inherit';
        await resolveAfter2Seconds().then( ( str ) => { 
            localStorage.ImAc_cookies = str;
            document.getElementById('mainpopup').style.display = 'none';
            init_webplayer() 
        });
    }
    else 
    {
        document.getElementById('mainpopup').style.display = 'none';*/
        init_webplayer()
    //}
}

function init_webplayer()
{
	console.log('Version: ' + _PlayerVersion);

    if ( localStorage.ImAc_cookies == undefined ) localStorage.ImAc_cookies = confirm("Do you give us consent to register behavior metrics for research purposes?");
    if ( localStorage.ImAc_cookies ) {
        let UUID = localStorage.ImAc_UUID ? localStorage.ImAc_UUID : uuidv4();
        localStorage.ImAc_UUID = UUID;
        gtag('set', {'user_id': UUID});  
        sessionId = UUID
    }  

    loggerActivated = loggerActivated ? localStorage.ImAc_cookies : loggerActivated;

    var myhash = window.location.hash.split('#');

    _AudioManager.initAmbisonicResources();

    _meshGen.setFont('./css/fonts/TiresiasScreenfont_Regular.json').then(() => { 

        $.getJSON("https://imac.gpac-licensing.com/imac_content/content.json").done(function( json ) 
        {
            list_contents = json.contents;

            firstQoEmsg = true;

            if ( myhash && myhash[1] && myhash[1] < list_contents.length && list_contents[ myhash[1] ] && localStorage.ImAc_init == myhash[1] ) 
            {
                demoId = myhash[1];
                
                localStorage.removeItem('ImAc_init');
                localStorage.ImAc_language ? MenuDictionary.setMainLanguage( localStorage.ImAc_language ) : MenuDictionary.setMainLanguage( 'en' );

                _isTV = localStorage.ImAc_lineal == 'true' && list_contents[ myhash[1] ].urlTV ? true : false;

                let mainContentURL = ( _isTV && list_contents[ myhash[1] ].urlTV ) ? list_contents[ myhash[1] ].urlTV : list_contents[ myhash[1] ].url;

                if ( localStorage.ImAc_voiceControl == 'on' ) connectVoiceControl( localStorage.ImAc_voiceControlId, "http://51.89.138.157:3000/" );

                initAccessConf()

                let appMngr = new AplicationManager();
                appMngr.init( mainContentURL );

            }
            else window.location = window.location.origin + window.location.pathname.slice(0, -7);
        })
        .fail(function( jqxhr, textStatus, error ) 
        {
            console.error( "Request Failed: " + textStatus + ", " + error );
        });
    });
}

$(window).on( 'hashchange', () => { window.location.reload() } );
