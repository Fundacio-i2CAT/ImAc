
var camera;
var scene;

var controls;

function AplicationManager()
{
    //var controls;
    var container;
    var renderer;
    var effect;
    var isVRtested = false;
    var haveVrDisplay = false;

    var _display;


    this.init_AplicationManager = function()
    {
        init();
		waitSesionManager();	
    };

    this.switchDevice = function()
    {
    	console.error('Deprecated function: switchDevice')
    	/*if ( _display.length > 0 ) 
    	{
    		if ( _isHMD )
    		{
    			ppMMgr.playAll();
    			_isHMD = false;
    			_display[ 0 ].isPresenting ? _display[ 0 ].exitPresent() : _display[ 0 ].requestPresent( [ { source: renderer.domElement } ] ).then(
				function () { 
					isVRtested=true; 
					startAllVideos(); 
					//controls = new THREE.DeviceOrientationAndTouchController( camera, CameraParentObject, renderer.domElement, renderer );
				});
    		}
    		else
    		{
    			ppMMgr.playAll();
    			_isHMD = true;;
    			//controls = undefined;
    			_display[ 0 ].isPresenting ? _display[ 0 ].exitPresent() : _display[ 0 ].requestPresent( [ { source: renderer.domElement } ] ).then(
				function () { 
					isVRtested=true; 
					startAllVideos(); 
				});

				renderer.vr.setDevice( _display[ 0 ] );

    		}
		}*/
    };


    // Used when autopositioning is activated
    this.enableVR = function()
    {
    	renderer.vr.setDevice( _display[ 0 ] );
    };

    this.disableVR = function()
    {
    	renderer.vr.setDevice( null );
    };

	function waitSesionManager()
	{ 
		if ( isVRtested == true )
		{
			activateLogger();
			haveVrDisplay ? renderer.animate( render ) : update(); 
		}
		else
		{
			requestAnimationFrame( waitSesionManager );
		}
	}

	function activateLogger()
	{
		if ( loggerActivated )
		{
			setInterval(function(){
				statObj.add(new StatElements());
			}, 500);
		}
	}

	function update() 
	{	
		if ( controls ) controls.update();
		effect.render( scene, camera );
		requestAnimationFrame( update );		
    }

    function render()
    {
    	THREE.VRController.update()
    	if ( controls ) controls.update();
    	renderer.render( scene, camera );

    	AudioManager.updateRotationMatrix( camera.matrixWorld.elements );

    	if( THREE.VRController.getTouchPadState() && _isHMD ) 
    	{
            var mouse3D = new THREE.Vector2();
	        mouse3D.x = 0;
	        mouse3D.y = 0;
					
			interController.checkInteraction(mouse3D, camera, 'onDocumentMouseDown');
		}

		subController.updateRadar();

		Reticulum.update();
    }

    function init() 
    {
		console.log("[AplicationManager]  init");
	
		blockContainer();
			
		container = document.getElementById( 'container' );
	
        camera = new THREE.PerspectiveCamera( 60.0, window.innerWidth / window.innerHeight, 0.05, 1000 );
        camera.name = 'perspectivecamera';


 		var openMenuText = menuData.getMenuTextMesh("Menu", 22, 0xffff00, "openmenutext"); 
 		openMenuText.position.y = 6;
 		openMenuText.position.z = -60;
 		openMenuText.scale.set(0.15, 0.15, 1)
 		openMenuText.visible = false;

 		camera.add(openMenuText);

        this.CameraParentObject = new THREE.Object3D();
        this.CameraParentObject.name = 'parentcamera';
		this.CameraParentObject.add( camera );

		scene = new THREE.Scene();
		scene.add( this.CameraParentObject );

		renderer = new THREE.WebGLRenderer({
			antialias:true,
			premultipliedAlpha: false,
			alpha: true
		});

		renderer.domElement.id = 'YourIDName';

		renderer.sortObjects = true;

		renderer.setPixelRatio(Math.floor(window.devicePixelRatio));
		renderer.setSize( window.innerWidth, window.innerHeight );

		controls = new THREE.DeviceOrientationAndTouchController( camera, CameraParentObject, renderer.domElement, renderer );

		container.appendChild( renderer.domElement );

        moData.createSphericalVideoInScene( mainContentURL, 'contentsphere' );

		moData.createCastShadows();

        //moData.createCubeGeometry116('./resources/cubemap3.jpg', 'name');
        //moData.createCubeGeometry65('./resources/dagomi_cube_603_edit.mp4', 'name');

        if ( 'getVRDisplays' in navigator ) {

        	document.body.appendChild( WEBVR.createButton( renderer ) );
        	document.body.appendChild( WEBVR.createButton2( renderer ) );

        	startAllVideos(); 

        	navigator.getVRDisplays().then( function ( displays ) 
        	{
				_display = displays;
				haveVrDisplay = true;
				renderer.vr.enabled = true;
				isVRtested = true; 
				VideoController.playAll();
			} );
        }
        else
        {
        	alert("This browser don't support VR content")
        }

		Reticulum.init(camera, {
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

	var WEBVR = {

		button1: undefined,
		button2: undefined,

		createButton: function ( renderer ) {

			function showEnterVR( display ) {

				button.style.display = '';

				button.style.left = 'calc(50% - 110px)';
				button.textContent = 'VR';

				button.onclick = function() {

					button1.style.display = 'none';
					button2.style.display = 'none';

					VideoController.playAll();

					display.isPresenting ? display.exitPresent() : display.requestPresent( [ { source: renderer.domElement } ] ).then(
						function () { 
							isVRtested=true; 
							_isHMD = true; 	
							createMenus();						
						});
				};

				renderer.vr.setDevice( display );

			}

			if ( 'getVRDisplays' in navigator ) {

				var button = document.createElement( 'button' );
				button.style.display = 'none';

				stylizeElement( button );

				window.addEventListener( 'vrdisplayconnect', function ( event ) {

					showEnterVR( event.display );

				}, false );

				window.addEventListener( 'vrdisplaypresentchange', function ( event ) {
					
					//if (!event.display.isPresenting) window.history.back();
					if (event.display) {
						//button.textContent = event.display.isPresenting ? 'EXIT VR' : 'ENTER VR';

						if (!event.display.isPresenting) location.reload();
					}

				}, false );

				window.addEventListener( 'vrdisplayactivate', function ( event ) {

					event.display.requestPresent( [ { source: renderer.domElement } ] ).then(function () { isVRtested = true; startAllVideos(); });

				}, false );


				navigator.getVRDisplays()
					.then( function ( displays ) {

						_display = displays;

						if ( displays.length > 0 ) 
						{
							showEnterVR( displays[ 0 ] );
						}
						else
						{
							createMenus();	

						}
					} );

				button1 = button;

				return button;

			}
		},

		createButton2: function ( renderer ) {

			function showEnterVR() {

				button.style.display = '';

				button.style.left = 'calc(50% + 10px)';
				button.textContent = 'NO VR';


				button.onclick = function () {

					button1.style.display = 'none';
					button2.style.display = 'none';

					VideoController.playAll();
					
					isVRtested=true; 
					//startAllVideos(); 
					_isHMD = false; 

					createMenus();

				};
			}

			var button = document.createElement( 'button' );
			button.style.display = 'none';

			stylizeElement( button );


			if ( 'getVRDisplays' in navigator ) {

				navigator.getVRDisplays().then( function ( displays ) 
				{
					if ( displays.length > 0 ) 
					{
						showEnterVR();
					}
				} );

				button2 = button;

				return button;
			}

		}
	};
}

function createMenus ()
{
	switch ( menuType )
    {
        case "LS_area":
            MenuManager.createMenu(false);
            break;
        default:
            MenuManager.createMenu(true);

            break;
    }
}