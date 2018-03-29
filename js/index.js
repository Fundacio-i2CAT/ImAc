
// GLOBAL VARS

var _PlayerVersion = 'v0.01.0';

var AplicationManager = new AplicationManager();
var moData = new THREE.MediaObject();

var viewArea = 30;
var signArea = 'botRight';
var subtileIndicator = 'none';
var signIndicator = 'none';
var forcedDisplayAlign = "after"; // before, center, after
var forcedTextAlign = "center"; //start, center, end
var autoPositioning = 'disable';
var language = "catala";

var isHMD = true;
var isVRDisplay = true;
var isSubtitleEnabled = false;

var obj1, obj2, obj3, obj4;

var textListMemory = [];

var demoId = 1;

var myVar;

var imageMesh;
var timerCounter = 0;

var mainContentURL = './resources/rapzember-young-hurn_edit.mp4';


var audioResources = Array();
var audioResources_order_1 = Array();

var _foaRenderer;
var _isAmbisonics = false;

var config = (function() {
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

var polyfill = new WebVRPolyfill(config);




/**
 * Initializes the web player.
 */	

function init_webplayer() 
{
	console.log('Version: ' + _PlayerVersion);


  audioResources.push('resources/omnitone-toa-1.wav');
    audioResources.push('resources/omnitone-toa-2.wav');
    audioResources.push('resources/omnitone-toa-3.wav');
    audioResources.push('resources/omnitone-toa-4.wav');
    audioResources.push('resources/omnitone-toa-5.wav');
    audioResources.push('resources/omnitone-toa-6.wav');
    audioResources.push('resources/omnitone-toa-7.wav');
    audioResources.push('resources/omnitone-toa-8.wav');

    audioResources_order_1.push('resources/omnitone-foa-1.wav');
    audioResources_order_1.push('resources/omnitone-foa-2.wav');

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
  demoId = id;
  if(demoId > 5) mainContentURL = './resources/cam2.mp4';
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
  //createSubtittleDiv();

  setTimeout(function()
  {
    runDemo();
    addsubtitles();    
  },500);

  moData.playAll();
}




function startAmbisonic(url, vid)
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() 
    {
        if (this.readyState == 4 && this.status == 200) 
        {
            var xmlDoc = this.responseXML;   
            if(xmlDoc == null)
            {
                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(this.responseText, "application/xml");
            }
            for (var i = 0; i < xmlDoc.getElementsByTagName('AudioChannelConfiguration').length; i++) 
            {
                var node = xmlDoc.getElementsByTagName('AudioChannelConfiguration')[i].getAttribute("value") ;
                if (node >= 4) 
                {
                    initializeAudio(vid, node);
                }
            }
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
    //initializeAudio(vid);
}

/**
* Initialize Ambisonic audio.
*/

//var audioElement;
function initializeAudio () 
{
  var n = 4;
  var listVideoContent = moData.getListOfVideoContents();
  var _videoElement = listVideoContent[0].vid;
    //audioElement = document.createElement('audio');
    //audioElement.src = 'Liceu/AmbiX-1er_Orquestra_Cam_02.wav';


    _videoElement.muted = false;

    _audioContext = new AudioContext();
    
    var videoElementSource = _audioContext.createMediaElementSource(_videoElement);
    //var videoElementSource = _audioContext.createMediaElementSource(audioElement);

    if (n < 16) 
    {
        _foaRenderer = Omnitone.createFOARenderer(_audioContext, {
            hrirPathList: audioResources_order_1
        });
    }
    else
    {
        _foaRenderer = Omnitone.createHOARenderer(_audioContext, {
            hrirPathList: audioResources
        });
    }

    _foaRenderer.initialize().then(function() 
    {
        _isAmbisonics = true;
        videoElementSource.connect(_foaRenderer.input);
        _foaRenderer.output.connect(_audioContext.destination);
        _foaRenderer.setRotationMatrix4(camera.matrixWorld.elements);


        //audioElement.play();
    }, function () 
    {
        console.log('Error to init Ambisonics');
    });
}