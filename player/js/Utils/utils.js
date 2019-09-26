

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

            enterfullscreen();

            AplicationManager.disableVRButtons();
            VideoController.playAll();

            display.isPresenting ? display.exitPresent() : display.requestPresent( [ { source: renderer.domElement } ] ).then(
                function () { 
                    _isHMD = true;  
                    createMenus();                 
                });
            renderer.vr.setDevice( display );
        };
        //renderer.vr.setDevice( display );
    }

    var button = document.createElement( 'button' );

    stylizeElement( button );

    window.addEventListener( 'vrdisplaypresentchange', function ( event ) 
    {
        if ( event.display && !event.display.isPresenting ) location.reload();
    }, false );

    navigator.getVRDisplays().then( function ( displays ) 
    {
        AplicationManager.setDisplays( displays );
        displays.length > 0 ? showEnterVR( displays[ 0 ] ) : createDelayedMenu();
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
        if ( displays.length > 0 ) showEnterVR();
    });

    AplicationManager.setVRButton2( button );

    return button;
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
    _iconf.stlanguage = subController.getSubLanguage();
    _iconf.sllanguage = subController.getSignerLanguage();
    _iconf.astlanguage = _AudioManager.getASTLanguage();
    _iconf.adlanguage = _AudioManager.getADLanguage();
    _iconf.indicator = subController.getSubIndicator();
    _iconf.safearea = subController.getSubArea() == 70 ? 'L' : subController.getSubArea() == 60 ? 'M' : 'S';
    _iconf.stsize = subController.getSubSize() == 1 ? 'L' : subController.getSubSize() == 0.8 ? 'M' : 'S';
    _iconf.stbackground = subController.getSubBackground() == 0.5 ? 'box' : 'outline';
    _iconf.stposition = subController.getSubPosition().y == -1 ? 'down' : 'up';
    _iconf.ste2r = subController.getSubEasy() ? 'on' : 'off';
    _iconf.slsize = subController.getSignerSize() == 20 ? 'L' : subController.getSignerSize() == 18 ? 'M' : 'S';
    _iconf.slposition = subController.getSignerPosition().x == 1 ? 'right' : 'left';
    _iconf.aste2r = _AudioManager.getSubEasy() ? 'on': 'off';
    _iconf.astmode = _AudioManager.getASTPresentation() == 'VoiceOfGod' ? 'god' : 'dynamic';
    _iconf.astvolume = _AudioManager.getASTVolume() == 100 ? 'max' : _AudioManager.getASTVolume() == 50 ? 'mid' : 'min';
    _iconf.admode = _AudioManager.getADPresentation() == 'VoiceOfGod' ? 'god' : _AudioManager.getADPresentation() == 'Dynamic' ? 'dynamic' : 'friend';
    _iconf.advolume = _AudioManager.getADVolume() == 100 ? 'max' : _AudioManager.getADVolume() == 50 ? 'mid' : 'min';

    document.cookie = "ImAcProfileConfig=" + encodeURIComponent( JSON.stringify( _iconf ) ) + "; max-age=2592000;"; //expires=" + expiresdate.toUTCString(); max-age = 1 mes
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

        /*
        / sera necesario implentar funcion que bloquee el menu 
        / para evitar que el usuario pueda hacer play antes que
        / acabe la reproduccion del audio.
        */

        // Pause all of the ImAc contents
        _ImAc.doPause();

        // Creates a new audio object and play it
        var audio = new Audio( url );
        audio.play();
        audio.volume = 1;

        // Listener to know when the audio is ended
        audio.onended = function() {
            extraADenabled = false;
            _blockControls = false;
            // Play all of the ImAc contents
            _ImAc.doPlay();

        }; 
    }

}


function checkExtraADListByTime(time)
{
    _ManifestParser.checkExtraAD( Math.trunc(time*100)/100, _AudioManager.getADLanguage() );
}

