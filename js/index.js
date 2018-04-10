
// GLOBAL VARS

var _PlayerVersion = 'v0.01.2';
var AplicationManager = new AplicationManager();
var moData = new THREE.MediaObject();
var AudioManager = new AudioManager();

//var subController = new SubSignManager();

var viewArea = 30;
var signArea = 'botRight';
var subtitleIndicator = 'none';
var signIndicator = 'none';
var forcedDisplayAlign = "after"; // before, center, after
var forcedTextAlign = "center"; //start, center, end
var autoPositioning = 'disable';
var isSubtitleEnabled = false;
var textListMemory = [];


var language = "catala";

var isHMD = true;
var isVRDisplay = true;


var demoId = 1;

var mainContentURL = './resources/rapzember-young-hurn_edit.mp4';

var isAndroid = false;






var polifyConfig = (function() {
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
})();

var polyfill = new WebVRPolyfill(polifyConfig);






/**
 * Initializes the web player.
 */	

function init_webplayer() 
{
	console.log('Version: ' + _PlayerVersion);

  isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;

  AudioManager.initAmbisonicResources();
  moData.setFont('./css/fonts/TiresiasScreenfont_Regular.json');
		
  for (var i = 0; i < 6; i++) 
  {
    var id = i + 1;
    var dataText = ' ';

    if (i == 0) dataText = "Video 1: Subtitles - comfort viewing field";
    else if (i == 1) dataText = "Video 2: Subtitles - guiding to speaker";
    else if (i == 2) dataText = "Video 3: Signer - comfort viewing field";
    else if (i == 3) dataText = "Video 4: Signer - guiding to speaker (I)";
    else if (i == 4) dataText = "Video 5: Signer - guiding to speaker (forced perspective)";
    else if (i == 5) dataText = "Video 6: Demo opera";

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
  var myform2 = document.forms['myform2'];

  for (i = 0; i < myform2.length; i++) 
  {
    if (myform2[i].checked) 
    {
      device = myform2[i].value;
    }
  }
  if(device == 'Tablet') isHMD = false;
    
  demoId = id;
  if(demoId > 5) mainContentURL = './resources/cam_2_1080p.mp4';
  AplicationManager.init_AplicationManager();
  enterfullscreen();

  var myform = document.forms['myform'];

  for (i = 0; i < myform.length; i++) 
  {
    if (myform[i].checked) 
    {
      language = myform[i].value;
    }
  }  
}
       
function startAllVideos()
{
  //subController.addsubtitles("./resources/Rapzember_Cat.xml");  
  setTimeout(function()
  {
    runDemo();
    addsubtitles(); 
    //subController.startSubtitles();   
  },500);

  //moData.playAll();
}
