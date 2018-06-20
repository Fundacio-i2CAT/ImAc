
// GLOBAL VARS

var _PlayerVersion = 'v0.02.0';

var AplicationManager = new AplicationManager();
var moData = new THREE.MediaObject();
var AudioManager = new AudioManager();
var subController = new SubSignManager();

var interController = new THREE.InteractionsController();



//var language = "catala";

var isHMD = true;
var isVRDisplay = true;

var demoId = 1;

var mainContentURL = './resources/rapzember-young-hurn_edit.mp4';
//var _selected_content = 'Radio';





/*var polifyConfig = (function() {
  var config = {};
  var q = window.location.search.substring(1);
  if (q === '') {
    return config;
  }
  var params = q.split('&');
  var param, name, value;
  for (var i = 0; i < params.length; i++) {
    param = params[i].split('=');
    name = param[0];
    value = param[1];
    // All config values are either boolean or float
    config[name] = value === 'true' ? true :
                   value === 'false' ? false :
                   parseFloat(value);
  }
  return config;
})();*/

//var polyfill = new WebVRPolyfill(polifyConfig);

var polyfill = new WebVRPolyfill();






/**
 * Initializes the web player.
 */	

function init_webplayer() 
{
	console.log('Version: ' + _PlayerVersion);

  AudioManager.initAmbisonicResources();
  moData.setFont('./css/fonts/TiresiasScreenfont_Regular.json');
		
  for (var i = 0; i < 2; i++) 
  {
    var id = i + 1;
    var dataText = ' ';

    if (i == 0) dataText = "Video 1: Demo radio";
    else if (i == 1) dataText = "Video 2: Demo opera";

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
  mainContentURL = id == 2 ? 'http://192.168.10.115:8080/dash/liceu_demo/video/cam_1/stream.mpd' : './resources/rapzember-young-hurn_edit.mp4';
 console.error(id)   
  demoId = id;

  AplicationManager.init_AplicationManager();
  enterfullscreen();
}
       
function startAllVideos()
{
  
  setTimeout(function()
  {
    runDemo();
    //addsubtitles(); 
    //subController.startSubtitles();   
  },500);

  //moData.playAll();
}
