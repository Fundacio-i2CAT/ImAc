

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

function createDelayedMenu()
{
    setTimeout(function(){
        createMenus()
    },1000);
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

function startSync()
{
    var sync = new SyncController()
    sync.init();
}


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

function activateLogger()
{
    if ( loggerActivated )
    {
        setInterval(function(){
            statObj.add( new StatElements() );
        }, 500);
    }
}

function initAccessConf()
{
    var cookieconf = readCookie("ImAcProfileConfig");

    if ( cookieconf && cookieconf != null )
    {
        _iconf = JSON.parse( cookieconf );
        
        stConfig = _stMngr.initConfig( _iconf );
        slConfig = _slMngr.initConfig( _iconf );
        adConfig =  _AudioManager.setADConfig( _iconf );
        astConfig =  _AudioManager.setASTConfig( _iconf );

        _pointerSize = _iconf.pointersize == 'M' ? 1 : _iconf.pointersize == 'L' ? 2 : 0.6;// 2=Big, 1=Mid, 0.6=Small
    }
    else {
        _iconf = {
            menutype: 'traditional',
            pointersize: 'M',
            voicecontrol: 'off',
            userprofile: 'save',
            mainlanguage: 'en',
            //accesslanguage: 'en',
            indicator: 'none',
            safearea: 'L',
            stsize: 'L',
            stbackground: 'box',
            stposition: 'down',
            ste2r: 'off',
            stlanguage: 'en',
            slsize: 'M',
            slposition: 'right',
            sllanguage: 'en',
            aste2r: 'off',
            astmode: 'dynamic',
            astvolume: 'mid',
            astlanguage: 'en',
            admode: 'dynamic',
            advolume: 'mid',
            adlanguage: 'en',
            adspeed: 'x100'
        }
        stConfig = _stMngr.initConfig( _iconf );
        slConfig = _slMngr.initConfig( _iconf );
        adConfig =  _AudioManager.setADConfig( _iconf );
        astConfig =  _AudioManager.setASTConfig( _iconf );

        _pointerSize = _iconf.pointersize == 'M' ? 1 : _iconf.pointersize == 'L' ? 2 : 0.6;// 2=Big, 1=Mid, 0.6=Small
    }

    if ( !_iconf ) _iconf = [];
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}





async function createCamPortal()
{
    try {
        const constraints = window.constraints = {
            audio: false,
            video: true
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        const video = document.createElement( "video" );
        const videoTracks = stream.getVideoTracks();
        console.log('Got stream with constraints:', constraints);
        console.log(`Using video device: ${videoTracks[0].label}`);
        window.stream = stream; // make variable available to browser console
        video.srcObject = stream;
        video.play();

        let mesh = _meshGen.getVideoMesh( video, "16:9", 1 );
        mesh.position.x = ( 1.48*slConfig.area/2 - slConfig.size/2 ) *slConfig.canvasPos.x;
        mesh.position.y = -slConfig.canvasPos.y * (vHeight*(1-safeFactor) - slConfig.size)/2;
        canvasMgr.addElement( mesh )
    } catch (e) {
        console.warn(e);
    }


    
}


function doButtonFeedback( data )
{
    let submenu = scene.getObjectByName( data.name );

    interController.removeInteractiveObject( data.clickedButtonName );

    let sceneElement = submenu.getObjectByName( data.clickedButtonName )
    let initScale = sceneElement.scale;

    sceneElement.material.color.set( 0xffff00 );
    sceneElement.scale.set( initScale.x*0.8, initScale.y*0.8, 1 );

    // Set color (white), size to initial and add interactivity within 300ms to sceneElement;
    setTimeout( function() { 
        sceneElement.material.color.set( 0xe6e6e6 );
        sceneElement.scale.set( initScale.x*1.25, initScale.y*1.25, 1 ); 
        interController.addInteractiveObject( sceneElement );
    }, 300);
}


function getColiderIE( element )
{
    let coliderMesh = element.interactiveArea;

    if ( element.rotation ) coliderMesh.rotation.z = -element.rotation;

    coliderMesh.name = element.name;
    coliderMesh.position.z = 0.01
    coliderMesh.onexecute = element.onexecute;

    return coliderMesh
}

function createIEMesh( element )
{
    let mesh = element.type == 'text' ? 
        _meshGen.getTextMesh( element.text, element.textSize, element.color, element.name ) :
        _meshGen.getImageIEMesh( element.width, element.height, element.path, element.color, element.name, element.rotation );

    if ( element.interactiveArea )
    {
        mesh.onexecute = element.onexecute;
        mesh.add( getColiderIE( element ) );
    }

    mesh.visible = element.visible;
    mesh.position.set( element.position.x, element.position.y, element.position.z );
    mesh.name = element.name;

    return mesh;
}

function createMixIE( element )
{
    let mesh =  new THREE.Group();
    let text = _meshGen.getTextMesh( element.text, element.textSize, element.color, element.name );

    const w = text.geometry.boundingBox.max.x;
    
    mesh.name = element.name;
    mesh.width = text.geometry.boundingBox.max.x;
    
    if ( element.path ) 
    {
        element.width = element.textSize*2;
        element.height = element.textSize*2;

        let image = _meshGen.getImageIEMesh( element.width, element.height, element.path, element.color, element.name, element.rotation );
        
        mesh.width = w + image.geometry.parameters.width;
        image.position.x = -mesh.width;
        mesh.add( image );
    }
    mesh.add(text);
    
    if ( element.interactiveArea )
    {
        mesh.onexecute = element.onexecute;
        mesh.add( getColiderIE( element ) );
    }

    mesh.visible = element.visible;
    mesh.position.set( element.position.x, element.position.y, element.position.z );
    mesh.name = element.name;

    return mesh;
}

