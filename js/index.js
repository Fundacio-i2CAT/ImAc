
// GLOBAL VARS

var _PlayerVersion = 'v0.02.0';

var AplicationManager = new AplicationManager();
var moData = new THREE.MediaObject();
var menuData = new THREE.MenuObject();

var MenuManager = new THREE.MenuManager();

var ppMMgr = new THREE.PlayPauseMenuManager();
var volMMgr = new THREE.VolumeMenuManager();
var setcarMMgr = new THREE.SettingsCardboardMenuManager();
var mloptMMgr = new THREE.MultiOptionsMenuManager();

//var stMMngr = new THREE.SubtitlesMenuManager();
var slMMngr = new THREE.SignLanguageMenuManager();
var adMMngr = new THREE.AudioDescriptionMenuManager();
var astMMngr = new THREE.AudioSubtitlesMenuManager();
var setMMgr = new THREE.SettingsMenuManager();

var secMMgr = new THREE.SecondaryMenuManager();

var AudioManager = new AudioManager();
var subController = new SubSignManager();
var interController = new THREE.InteractionsController();
var polyfill = new WebVRPolyfill();
var statObj = new StatObject();


var loggerActivated = false;


var demoId = 1;

var mainContentURL = './resources/rapzember-young-hurn_edit.mp4';
//var _selected_content = 'Radio';




/**
 * Initializes the web player.
 */	

function init_webplayer() 
{
	console.log('Version: ' + _PlayerVersion);

  AudioManager.initAmbisonicResources();
  moData.setFont('./css/fonts/TiresiasScreenfont_Regular.json');
  //moData.setFont('./css/fonts/helvetiker_bold.typeface.json');
		
  for (var i = 0; i < 3; i++) 
  {
    var id = i + 1;
    var dataText = ' ';

    if (i == 0) dataText = "Video 1: Demo radio";
    else if (i == 1) dataText = "Video 2: Demo opera";
    else if (i == 2) dataText = "Video 3: Demo RBB";

    createListGroup(id, "img/LOGO-IMAC.png", dataText);
  }
}


function blockContainer()
{
	document.getElementById("header").style.display = "none";
	document.getElementById("content_area").style.display = "none";
	document.getElementById("container").style.display = "block";
}

function selectXML(id)
{
  //mainContentURL = id == 2 ? './resources/cam_2_2k.mp4' : './resources/rapzember-young-hurn_edit.mp4';

  if (id == 2) mainContentURL = './resources/cam_2_2k.mp4';
  else if (id == 1) mainContentURL = './resources/rapzember-young-hurn_edit.mp4';
  else mainContentURL = './resources/rbb/dash/stream.mpd';
 
  demoId = id;

  AplicationManager.init_AplicationManager();
  enterfullscreen();
}
       
function startAllVideos()
{
  
  setTimeout(function() {
    runDemo(); 
  },500);

  //moData.playAll();
}


(function() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
              .register('./service-worker.js')
              .then(function() { console.log('Service Worker Registered'); });
    }
})();