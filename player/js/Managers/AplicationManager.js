
var camera;
var scene;
var controls;


function AplicationManager()
{
    var renderer;

    var mouse3D = new THREE.Vector2( 0, 0 );
    var hmdTouchVector = new THREE.Vector2( 0, 0 );

    function render()
    {
        renderer.render( scene, camera );
        update();
    }

    function initCamera()
    {
        camera = new THREE.PerspectiveCamera( 60.0, window.innerWidth / window.innerHeight, 1, 2000 );
        camera.name = 'perspectivecamera';
        scene = new THREE.Scene();
        scene.add( camera );
    }

    function inirRenderer()
    {
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            premultipliedAlpha: false,
            alpha: true
        });

        renderer.domElement.id = 'WebGLRenderer';
        renderer.sortObjects = true;
        renderer.setPixelRatio( Math.floor( window.devicePixelRatio ) );
        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    this.init = function( mainContentURL )
    {
        console.log('Init AplicationManager')
			
		var container = document.getElementById( 'container' );

        initCamera();
        inirRenderer();

        vHeight = 2 * Math.tan( THREE.Math.degToRad( camera.fov ) / 2 ) * 70; // visible height
	
        controls = new THREE.DeviceOrientationAndTouchController( camera, renderer.domElement, renderer );
		container.appendChild( renderer.domElement );

        let mainVideo = VideoController.getVideObject( 'contentsphere', mainContentURL )
        _isTV ? camera.add( _meshGen.getVideoMesh( mainVideo ) ) : scene.add( _meshGen.getVideo360Mesh( mainVideo ) );

        //createCamPortal()

        // UPDATE TO XR
        if ( 'getVRDisplays' in navigator ) {

            console.warn('This function needs to be updated')

            VideoController.init();

        	document.body.appendChild( createVRButton_1( renderer ) );
        	document.body.appendChild( createVRButton_2( renderer ) );

        	navigator.getVRDisplays().then( function ( displays ) 
        	{
				renderer.vr.enabled = true;
				activateLogger();
				renderer.animate( render );
			});
        }
        else alert("This browser don't support VR content");

        if ( localStorage.ImAc_server ) _Sync.init( localStorage.ImAc_server );

        _AudioManager.initializeAudio( mainVideo, list_contents[demoId].audioChannels, camera.matrixWorld.elements );
        VideoController.createMainAudioList();

        runDemo();  

        canvasMgr.Init();

        document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	};


    function update()
    {
        THREE.VRController.update();

        //if ( controls ) controls.update();
        
        _AudioManager.updateRotationMatrix( camera.matrixWorld.elements );

        if( THREE.VRController.getTouchPadState() && _isHMD ) 
        {   
            interController.checkInteractionVPB( hmdTouchVector, camera, true );        
            interController.checkInteraction( hmdTouchVector, camera, false, true );

            // function to open menu with a simple click
            if ( menuMgr.getMenuType() == 2 && scene.getObjectByName( 'trad-main-menu' ).visible == false ) 
            {
                menuMgr.initFirstMenuState();
            }
            else if ( menuMgr.getMenuType() == 1 && scene.getObjectByName( 'trad-option-menu' ).visible == false && scene.getObjectByName( 'trad-main-menu' ).visible == false ) 
            {
                menuMgr.initFirstMenuState();
            }     
        }

        if ( _isHMD ) _canvasObj.rotation.z = -camera.rotation.z;

        if(camera.getObjectByName('radar') && camera.getObjectByName('radar').visible){
            _rdr.updateRadarAreaRotation();
        }

        if( !_isHMD && scene.getObjectByName('trad-option-menu') ) {
            interController.checkInteractionSubMenuHover( mouse3D, camera);
        }
        
        if( !_isHMD && scene.getObjectByName('trad-main-menu') ) {
            interController.accessIconsHoverOver( mouse3D, camera );  
            interController.vpbHoverOver( mouse3D, camera )
        }

        var now = Date.now();
        var dt = now - lastUpdate;
        //Close menu if no interactivity for 10s;
        if ( dt > 10000 && (scene.getObjectByName( "openMenu" ) && !scene.getObjectByName( "openMenu" ).visible) ) menuMgr.ResetViews();
        //console.log(dt)
       
        controls.update();
    }

    function onDocumentMouseMove(event) 
    {
        event.preventDefault();

        mouse3D.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse3D.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
}