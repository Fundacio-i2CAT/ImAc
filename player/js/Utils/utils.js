

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
            color: 0xffff00,
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
            color: 0x4669a7,
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
    switch ( localStorage.ImAc_menuType )
    {
        case "LS_area":
            //MenuManager.createMenu(false);
            menuMgr.Init(1);
            menuMgr.createMenuActivationElement();
            break;
        default:
            menuMgr.Init(2);
            menuMgr.createMenuActivationElement();
            //MenuManager.createMenu(true);

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
    var iconfig = {
        ST: subController.getSTConfig(),
        SL: subController.getSLConfig(),
        AD: _AudioManager.getADConfig(),
        AST: _AudioManager.getASTConfig()
    };

    //var expiresdate = new Date(2019, 01, 05, 11, 03); // aaaa/mm/dd/hh/mm/ss  els mesos van del 0-11

    document.cookie = "ImAcProfileConfig=" + encodeURIComponent( JSON.stringify( iconfig ) ) + "; max-age=2592000;" //expires=" + expiresdate.toUTCString(); max-age = 1 mes

    // Settings ( lang, menutype, voicecontrol )

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
    emoji_1.src = "./img/emojis/happy.png"; 

    emoji_2 = new Image() 
    emoji_2.src = "./img/emojis/hands.png"; 

    emoji_3 = new Image() 
    emoji_3.src = "./img/emojis/sad.png"; 

    emoji_4 = new Image() 
    emoji_4.src = "./img/emojis/steps.png"; 

    emoji_5 = new Image() 
    emoji_5.src = "./img/emojis/robot.png"; 

    emoji_6 = new Image() 
    emoji_6.src = "./img/emojis/phone.png"; 

    emoji_7 = new Image() 
    emoji_7.src = "./img/emojis/wave.png"; 

    emoji_8 = new Image() 
    emoji_8.src = "./img/emojis/music.png"; 

    emoji_9 = new Image() 
    emoji_9.src = "./img/emojis/plug.png"; 

    emoji_10 = new Image() 
    emoji_10.src = "./img/emojis/noise.png"; 
}

function startSync()
{
    var sync = new SyncController()
    sync.init();
}