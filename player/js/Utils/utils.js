

function SphericalToCartesian (polar ,elevation) 
{
    //Vector3 outCart = new Vector3();
    var outCart = new Array(3);

    outCart.x = Math.cos(elevation) * Math.sin(polar);
    outCart.y = Math.sin(elevation);
    outCart.z = Math.cos(elevation) * Math.cos(polar);

    return outCart;
}

function convertAngular_toCartesian(latitud, longitud)
{
    var elevation = Math.radians(latitud);
    var polar = Math.radians(longitud);
    var position = SphericalToCartesian(polar, elevation);

    return position;
}

function cartesianToAngular (x, y, z)
{
    var dist = Math.round(Math.sqrt(Math.pow(x,2) + Math.pow(y,2) + Math.pow(z,2))*100)/100;
    var lat = -Math.round(Math.degrees(Math.asin(y/-dist))*10)/10;
    var lon = z >= 0 ? Math.round(Math.degrees(Math.atan(x/z))*10)/10 + 180 : Math.round(Math.degrees(Math.atan(x/z))*10)/10;

    if (lon <= 0) lon += 360;
    lon = 360 - lon;

    if (lat < 0) lat += 360;

    var outAng = {
        latitud : lat,
        longitud : lon,
        distance : dist
    };
    return outAng;
}

function stylizeElement( element ) 
{
    element.style.display = 'none';

    element.style.position = 'absolute';
    element.style.bottom = '200px';
    element.style.padding = '12px 6px';
    element.style.border = '2px solid #fff';
    element.style.borderRadius = '4px';
    element.style.background = '#000';
    element.style.color = '#fff';
    element.style.font = 'bold 24px sans-serif';
    element.style.textAlign = 'center';
    element.style.opacity = '0.8';
    element.style.outline = 'none';
    element.style.zIndex = '999';

    element.style.cursor = 'pointer';
    element.style.width = '100px';

    element.onmouseenter = function () 
    {   
        element.style.opacity = '1.0'; 
        element.style.color = '#ff0'; 
        element.style.border = '2px solid #ff0'; 
    };

    element.onmouseleave = function () 
    { 
        element.style.opacity = '0.8'; 
        element.style.color = '#fff'; 
        element.style.border = '2px solid #fff'; 
    };
}

function initReticulum(cam)
{
    Reticulum.init(cam, {
        proximity: false,
        clickevents: true,
        reticle: {
            visible: false,
            restPoint: 50, //Defines the reticle's resting point when no object has been targeted
            color: 0xe6e6e6,
            innerRadius: 0.0004,
            outerRadius: 0.003,
            hover: {
                color: 0x13ec56,
                innerRadius: 0.02,
                outerRadius: 0.024,
                speed: 5,
                vibrate: 50 //Set to 0 or [] to disable
            }
        },
        fuse: {
            visible: false,
            duration: 3,
            color: 0xc91355,
            innerRadius: 0.045,
            outerRadius: 0.06,
            vibrate: 100, //Set to 0 or [] to disable
            clickCancelFuse: false //If users clicks on targeted object fuse is canceled
        }
    });
}

function createVRButton_1(renderer)
{
    function showEnterVR(display) 
    {
        button.style.display = '';
        button.style.left = 'calc(50% - 110px)';
        button.textContent = 'VR';
        button.id ='button_1';

        button.onclick = function() {

            //enterfullscreen();

            AplicationManager.disableVRButtons();
            VideoController.playAll();

            display.isPresenting ? display.exitPresent() : display.requestPresent( [ { source: renderer.domElement } ] ).then(
                function () { 
                    _isHMD = true;  
                    safeFactor = 0.4;
                    createMenus();                 
                });
            renderer.vr.setDevice( display );
        };
        //renderer.vr.setDevice( display );
    }

    var button = document.createElement( 'button' );

    stylizeElement( button );

    /*window.addEventListener( 'vrdisplaypresentchange', function ( event ) 
    {
        if ( event.display && !event.display.isPresenting ) location.reload();
    }, false );*/

    navigator.getVRDisplays().then( function ( displays ) 
    {
        //AplicationManager.setDisplays( displays );
        //displays.length > 0 && !_isTV ? showEnterVR( displays[ 0 ] ) : createDelayedMenu();
        displays.length > 0 && !_isTV ? showEnterVR( displays[ 0 ] ) : createMenus();
    });

    AplicationManager.setVRButton1( button );

    return button;
}

function createDelayedMenu()
{
    setTimeout(function(){
        createMenus()
    },1000);
}

function createVRButton_2(renderer)
{
    function showEnterVR() 
    {
        button.style.display = '';
        button.style.left = 'calc(50% + 10px)';
        button.textContent = 'NO VR';
        button.id ='button_2';
        button.onclick = function () {

            enterfullscreen();

            AplicationManager.disableVRButtons();
            VideoController.playAll();     
            _isHMD = false; 
            createMenus();
        };
    }

    var button = document.createElement( 'button' );

    stylizeElement( button );

    navigator.getVRDisplays().then( function ( displays ) 
    {
        if ( displays.length > 0 && !_isTV ) showEnterVR();
    });

    AplicationManager.setVRButton2( button );

    return button;
}

function createVRButton_3()
{
    function showEnterVR() 
    {
        button.style.display = '';
        button.style.width = '250px';
        button.style.left = 'calc(50% - 125px)';
        button.style.top = 2*window.innerHeight/6 + 55 + 'px';
        button.style.bottom = '';
        button.textContent = MenuDictionary.getOption1Button();
        button.id ='button_3';

        button.onclick = function() {

            window.location.reload();
        };
    }

     

    var button = document.createElement( 'button' );

    stylizeElement( button );

    navigator.getVRDisplays().then( function ( displays ) 
    {
        if ( displays.length > 0 ) displays[0].exitPresent()
    });

    showEnterVR();

    return button;
}

function createVRButton_4(renderer)
{
    function showEnterVR() 
    {
        button.style.display = '';
        button.style.width = '250px';
        button.style.left = 'calc(50% - 125px)';
        button.style.top = 2*window.innerHeight/6 + 205 +'px';
        button.style.bottom = '';
        button.textContent = MenuDictionary.getOption2Button();
        button.id ='button_4';
        button.onclick = function () {

            window.location.href = 'https://www.i2cat.net/#home';
        };
    }

    var button = document.createElement( 'button' );

    stylizeElement( button );
    showEnterVR();

    return button;
}


function stylizeTextElement( element ) 
{
    element.style.display = '';

    element.style.position = 'absolute';
    element.style.padding = '12px 6px';
    element.style.color = '#e6e6e6';
    element.style.font = 'bold 24px sans-serif';
    element.style.textAlign = 'center';
    element.style.outline = 'none';
    element.style.zIndex = '999';
    //element.textContent = 'Did you like the video?';

    element.style.width = '100%';
}

function stylizeBackElement( element ) 
{
    element.style.display = '';

    element.style.position = 'absolute';
    element.style.top = '0';
    element.style.background = '#000';
    element.style.opacity = '0.8';
    element.style.outline = 'none';
    element.style.zIndex = '998';

    element.style.width = '100%';
    element.style.height = window.innerHeight + 'px';
}

function createMenus()
{
    switch ( _iconf.menutype )
    {
        case "ls":
            menuMgr.Init(1);
            menuMgr.createMenuActivationElement(0.35);
            break;
        default:
            menuMgr.Init(2);
            menuMgr.createMenuActivationElement(0.35);
            break;
    }
}

function readCookie(name)
{
    var nameEQ = name + "="; 
    var ca = document.cookie.split(';');

    for(var i=0;i < ca.length;i++) 
    {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) {
          return decodeURIComponent( c.substring(nameEQ.length,c.length) );
        }
    }

    return null;
}

function saveConfig()
{
    console.log('save config!!!')

    if ( !_iconf ) _iconf = [];

    _iconf.menutype = _iconf.menutype ? _iconf.menutype : 'traditional';
    _iconf.pointersize = _pointerSize == 1 ? 'M' : _pointerSize == 2 ? 'L' : 'S';
    _iconf.voicecontrol = _ws_vc ? 'on' : 'off';
    _iconf.userprofile = 'save';
    _iconf.mainlanguage = localStorage.ImAc_language;
    //_iconf.accesslanguage = subController.getSubLanguage();
    _iconf.stlanguage = stConfig.language;
    _iconf.stsize = stConfig.size;
    _iconf.stbackground = stConfig.background;
    _iconf.safearea = stConfig.area;
    _iconf.stposition = stConfig.canvasPos;
    _iconf.ste2r = stConfig.easy2read;
    _iconf.indicator = stConfig.indicator;

    _iconf.sllanguage = slConfig.language;
    _iconf.slsize = slConfig.size;
    _iconf.slposition = _slMngr.getSignerPosition().x == 1 ? 'right' : 'left';


    _iconf.astlanguage = _AudioManager.getASTLanguage();
    _iconf.adlanguage = _AudioManager.getADLanguage();

    _iconf.aste2r = _AudioManager.getSubEasy() ? 'on': 'off';
    _iconf.astmode = _AudioManager.getASTPresentation() == 'VoiceOfGod' ? 'god' : 'dynamic';
    _iconf.astvolume = _AudioManager.getASTVolume() == 100 ? 'max' : _AudioManager.getASTVolume() == 50 ? 'mid' : 'min';
    _iconf.admode = _AudioManager.getADPresentation() == 'VoiceOfGod' ? 'god' : _AudioManager.getADPresentation() == 'Dynamic' ? 'dynamic' : 'friend';
    _iconf.advolume = _AudioManager.getADGain() == 'high' ? 'max' : _AudioManager.getADGain() == 'medium' ? 'mid' : 'min';
    _iconf.adspeed = _AudioManager.getExtraADSpeed() == 1 ? 'x100' : _AudioManager.getExtraADSpeed() == 1.25 ? 'x125' : 'x150';

    document.cookie = "ImAcProfileConfig=" + encodeURIComponent( JSON.stringify( _iconf ) ) + "; max-age=2592000" + "; path=/"; //expires=" + expiresdate.toUTCString(); max-age = 1 mes
}


function resetConfig(){
    localStorage.removeItem("rdrPosition");
    localStorage.removeItem("slPosition");
    localStorage.removeItem("stPosition");

    let signer = _slMngr.getSigner();
    let subtitles = _stMngr.getSubtitles();

    if(signer){
        slConfig.canvasPos = new THREE.Vector2(1, -1);
        signer.position.set(slConfig.initPos.x, slConfig.initPos.y, signer.position.z);  
        _slMngr.updatePositionY();
    } 

    if(subtitles){
        stConfig.canvasPos = new THREE.Vector2(0, -1);
        subtitles.position.set(stConfig.initPos.x, stConfig.initPos.y, subtitles.position.z);  
    } 
    _rdr.updateRadarPosition();
}
// Converts from degrees to radians.
Math.radians = function(degrees) {
    return degrees * (Math.PI / 180);
};
 
// Converts from radians to degrees.
Math.degrees = function(radians) {
    return radians * (180 / Math.PI);
};

var emoji_1, emoji_2, emoji_3, emoji_4, emoji_5, emoji_6, emoji_7, emoji_8, emoji_9, emoji_10;

function loadEmojisIcons()
{
    emoji_1 = new Image() 
    emoji_1.src = "./img/emojis/image001.png"; 

    emoji_2 = new Image() 
    emoji_2.src = "./img/emojis/image002.png"; 

    emoji_3 = new Image() 
    emoji_3.src = "./img/emojis/image003.png"; 

    emoji_4 = new Image() 
    emoji_4.src = "./img/emojis/image004.png"; 

    emoji_5 = new Image() 
    emoji_5.src = "./img/emojis/image005.png"; 

    emoji_6 = new Image() 
    emoji_6.src = "./img/emojis/image006.png"; 

    emoji_7 = new Image() 
    emoji_7.src = "./img/emojis/image007.png"; 

    emoji_8 = new Image() 
    emoji_8.src = "./img/emojis/image008.png"; 
}

function startSync()
{
    var sync = new SyncController()
    sync.init();
}

var SLTImes = [
    { state: 'on', time: 16.07 },
    { state: 'off', time: 25.23 },
    { state: 'on', time: 51.19 },
    { state: 'off', time: 80.20 },
    { state: 'on', time: 81.04 },
    { state: 'off', time: 97.01 },
    { state: 'on', time: 109.13 },
    { state: 'off', time: 115.00 },
    { state: 'on', time: 116.22 },
    { state: 'off', time: 159.24 },
    { state: 'on', time: 160.03 },
    { state: 'off', time: 175.04 },
    { state: 'on', time: 177.11 },
    { state: 'off', time: 331.13 },
    { state: 'on', time: 347.08 },
    { state: 'off', time: 366.14 },
    { state: 'on', time: 368.15 },
    { state: 'off', time: 377.07 },
    { state: 'on', time: 389.16 },
    { state: 'off', time: 505.08 },
    { state: 'on', time: 520.21 },
    { state: 'off', time: 526.16 },
    { state: 'on', time: 530.13 },
    { state: 'off', time: 539.06 },
    { state: 'on', time: 547.13 },
    { state: 'off', time: 574.20 },
    { state: 'on', time: 585.05 },
    { state: 'off', time: 593.20 },
    { state: 'on', time: 601.06 },
    { state: 'off', time: 607.22 },
    { state: 'on', time: 611.20 },
    { state: 'off', time: 623.16 },
    { state: 'on', time: 643.23 },
    { state: 'off', time: 659.03 },
    { state: 'on', time: 659.23 },
    { state: 'off', time: 663.12 },
    { state: 'on', time: 678.18 },
    { state: 'off', time: 697.23 },
    { state: 'on', time: 698.19 },
    { state: 'off', time: 745.05 }
];


function getViewDifPositionTest(sp, fov)
{
    var target = new THREE.Vector3();
    var camView = camera.getWorldDirection( target );
    var offset = camView.z >= 0 ? 180 : -0;

    var lon = Math.degrees( Math.atan( camView.x/camView.z ) ) + offset;

    lon = lon > 0 ? 360 - lon : - lon;

    if ( ( lon - sp + 360 )%360 > fov && ( lon - sp + 360 )%360 <= 180 ) return -1; 
    else if ( ( lon - sp + 360 )%360 > 180 && ( lon - sp + 360 )%360 <= 360 - fov ) return 1;
    else return 0;
}

function addSphericalGrid()
{
    var radius = 40;
    var segments = 36;
    var rings = 18;

    var geometry = new THREE.SphereGeometry(radius, segments, rings);
    var material = new THREE.MeshBasicMaterial({
      color: 0xF3A2B0,
      wireframe: true
    });

    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    var radius = 40;
    var segments = 36;
    var rings = 18;

    var geometry = new THREE.SphereGeometry(radius, segments, rings);
    var material = new THREE.MeshBasicMaterial({
      color: 0xF3A2B0,
      wireframe: true
    });

    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    var radius = 35;
    var segments = 4;
    var rings = 4;

    var geometry = new THREE.SphereGeometry(radius, segments, rings);
    var material = new THREE.MeshBasicMaterial({
      color: 0x0FA2B0,
      wireframe: true
    });

    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
}


function connectVoiceControl( devoceId="i2CAT", ws_url="http://51.89.138.157:3000/" )
{
    _ws_vc = io( ws_url );

    _ws_vc.on('connect', function(){
      _ws_vc.emit('setClientID', { customId:devoceId, type:'player', description:'ImAc Player' });
    });

    _ws_vc.on('command', function(msg){

        launchVoiceCommand( msg );
      
      console.log( msg );
    });
}

function disconnectVoiceControl()
{
    _ws_vc.disconnect();
    _ws_vc = undefined;
}


function iniGeneralSettings(conf)
{
    _pointerSize = conf.pointersize == 'M' ? 1 : conf.pointersize == 'L' ? 2 : 0.6;// 2=Big, 1=Mid, 0.6=Small
    _userprofile = conf.userprofile == 'save' ? true : false;
}


// Funcion para activar una pista de audio adicional pausando el contenido principal
var extraADenabled = false;

function initExtraAdAudio()
{
    if ( !extraADenabled )
    {
        console.log('init Extra AD')

        extraADenabled = true;

        var url = _ManifestParser.getExtraAD();

        // Pause all of the ImAc contents
        _ImAc.doPause();

        // Creates a new audio object and play it
        var audio = new Audio( url );
        audio.play();
        audio.volume = 1;

        // modify audio playback rate
        audio.playbackRate = _AudioManager.getExtraADSpeed();

        // Listener to know when the audio is ended
        audio.onended = function() {
            extraADenabled = false;
            _blockControls = false;

            _ImAc.goBack( VideoController.getMediaTime() - _ManifestParser.getExtraADTime() );
            // Play all of the ImAc contents
            _ImAc.doPlay();

        }; 
    }

}

function checkExtraADListByTime(time)
{
    _ManifestParser.checkExtraAD( Math.trunc(time*100)/100, _AudioManager.getADLanguage() );
}

function changeSpeed(obj, speed)
{
    obj.playbackRate = speed;
}

function doZoom(mode)
{
    if ( mode == 'in' && camera.fov * 0.5 >= 15 )
    {
        camera.fov = camera.fov * 0.5;
        camera.children.forEach( function( e ) 
        {
            e.scale.set( e.scale.x * 0.5, e.scale.y * 0.5, 1)
        }); 

        camera.updateProjectionMatrix();
    }
    else if ( mode == 'out' && camera.fov * 2 <= 60 ) 
    {
        camera.fov = camera.fov * 2;
        camera.children.forEach( function( e ) 
        {
            //e.visible = pos == 'left' ? true : false;
            e.scale.set( e.scale.x * 2, e.scale.y * 2, 1)
        }); 
        //camera.fovx += 10;
        camera.updateProjectionMatrix();
    }
}

function adaptRGBA(rgb){
    return ( rgb && rgb.length === 4 ) ? "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")" : '';
}

function getViewDifPosition(sp, fov){
    var target = new THREE.Vector3();
    var camView = camera.getWorldDirection( target );
      var offset = camView.z >= 0 ? 180 : -0;

    var lon = Math.degrees( Math.atan( camView.x/camView.z ) ) + offset;

    lon = lon > 0 ? 360 - lon : - lon;

    if ( ( lon - sp + 360 )%360 > fov && ( lon - sp + 360 )%360 <= 180 ) return -1; 
    else if ( ( lon - sp + 360 )%360 > 180 && ( lon - sp + 360 )%360 <= 360 - fov ) return 1;
    else return 0;
}

function showEndingOptions()
{
    VideoController.pauseAll();
    //window.location.reload();

    var back = document.createElement( 'div' );
    stylizeBackElement( back )
    document.body.appendChild( back );

    var vrtext1 = document.createElement( 'div' );
    stylizeTextElement( vrtext1 )
    vrtext1.style.top = 2*window.innerHeight/6 + 'px';
    vrtext1.textContent = MenuDictionary.getOption1Text();
    document.body.appendChild( vrtext1 );

    var vrtext2 = document.createElement( 'div' );
    stylizeTextElement( vrtext2 )
    vrtext2.style.top = 2*window.innerHeight/6 + 150 +'px';
    vrtext2.textContent = MenuDictionary.getOption2Text();
    document.body.appendChild( vrtext2 );



    document.body.appendChild( createVRButton_3() );
    document.body.appendChild( createVRButton_4() );
}

function resolveAfter2Seconds() {
  return new Promise(resolve => {
    /*setTimeout(() => {
      resolve('resolved');
    }, 2000);*/
      document.getElementById('popupbutton1').addEventListener('click', function(e) {
          resolve(true)
      });
      document.getElementById('popupbutton2').addEventListener('click', function(e) {
          resolve(false)
      })
  });
}
