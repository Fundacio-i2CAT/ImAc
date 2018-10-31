
// GLOBAL VARS

var _PlayerVersion = 'v0.06.0';

var AplicationManager = new AplicationManager();
var MenuFunctionsManager = new MenuFunctionsManager();
//var moData = new THREE.MediaObject();

var _moData = new THREE.MediaObjectData();

var menumanager = new MenuManager();

//var MenuManager = new THREE.MenuManager();
var MenuController = new THREE.MenuController();
var MenuDictionary = new MenuDictionary();

var secMMgr = new THREE.SecondaryMenuManager();

var _AudioManager = new AudioManager();
var subController = new SubSignManager();
var interController = new THREE.InteractionsController();
var polyfill = new WebVRPolyfill();
var statObj = new StatObject();

var VideoController = new VideoController();


var loggerActivated = false;

var demoId = 1;

var mainContentURL = './resources/rapzember-young-hurn_edit.mp4';
//var _selected_content = 'Radio';

var list_contents;

if ( annyang ) {
  // Let's define a command.
  var commands = {
    'hello': function() { console.log('Hello world!'); }
    /*'volume up': MenuFunctionsManager.getChangeVolumeFunc(true),
    'apujar volum': MenuFunctionsManager.getChangeVolumeFunc(true),
    'subir volumen': MenuFunctionsManager.getChangeVolumeFunc(true),
    'lauter': MenuFunctionsManager.getChangeVolumeFunc(true),
    'volume down': MenuFunctionsManager.getChangeVolumeFunc(false),
    'abaixar volum': MenuFunctionsManager.getChangeVolumeFunc(false),
    'bajar volumen': MenuFunctionsManager.getChangeVolumeFunc(false),
    'leiser': MenuFunctionsManager.getChangeVolumeFunc(false),
    'play': function() { console.log('play') },
    'pause': MenuFunctionsManager.getPlayPauseFunc(false),
    'pausar': MenuFunctionsManager.getPlayPauseFunc(false),
    'seek forward': MenuFunctionsManager.getSeekFunc(true),
    'avançar': MenuFunctionsManager.getSeekFunc(true),
    'avanzar': MenuFunctionsManager.getSeekFunc(true),
    'weiter': MenuFunctionsManager.getSeekFunc(true),
    'seek back': MenuFunctionsManager.getSeekFunc(false),
    'retrocedir': MenuFunctionsManager.getSeekFunc(false),
    'retroceder': MenuFunctionsManager.getSeekFunc(false),
    'zurück': MenuFunctionsManager.getSeekFunc(false),
    'subtitles on': MenuFunctionsManager.getOnOffFunc('subtitlesOffButton'),
    'activar subtitols': MenuFunctionsManager.getOnOffFunc('subtitlesOffButton'),
    'activar subtitulos': MenuFunctionsManager.getOnOffFunc('subtitlesOffButton'),
    'untertitel an': MenuFunctionsManager.getOnOffFunc('subtitlesOffButton'),
    'subtitles off': MenuFunctionsManager.getOnOffFunc('subtitlesOnButton'),
    'desactivar subtituls': MenuFunctionsManager.getOnOffFunc('subtitlesOnButton'),
    'desactivar subtitulos': MenuFunctionsManager.getOnOffFunc('subtitlesOnButton'),
    'untertitel aus': MenuFunctionsManager.getOnOffFunc('subtitlesOnButton'),
    'open menu': MenuFunctionsManager.getOpenMenuFunc(true),
    'obrir menu': MenuFunctionsManager.getOpenMenuFunc(true),
    'abrir menu': MenuFunctionsManager.getOpenMenuFunc(true),
    'Öffne Menü': MenuFunctionsManager.getOpenMenuFunc(true),
    'close menu': MenuFunctionsManager.getCloseTradMenuFunc(),
    'tancar menu': MenuFunctionsManager.getCloseTradMenuFunc(),
    'cerrar menu': MenuFunctionsManager.getCloseTradMenuFunc(),
    'Schließe Menü': MenuFunctionsManager.getCloseTradMenuFunc()*/
  };

  // Add our commands to annyang
  annyang.addCommands(commands);

  // Start listening.
  annyang.start();
}



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

                demoId = myhash[1];

                AplicationManager.init();

            }
            else window.location = window.location.origin + window.location.pathname.slice(0, -7);       
        });
    });
    //moData.setFont('./css/fonts/helvetiker_bold.typeface.json');
}

$(window).on('hashchange', function() 
{
    window.location.reload();
});