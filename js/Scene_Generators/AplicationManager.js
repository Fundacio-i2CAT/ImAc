
var camera;
var scene;

function AplicationManager()
{
    var controls;
    var container;
    var renderer;
    var effect;
    var isVRtested = false;
    var haveVrDisplay = false;

    var gamepad;

    var _display;


    this.init_AplicationManager = function()
    {
        init();
		waitSesionManager();	
    };

    this.switchDevice = function()
    {
    	if ( _display.length > 0 ) 
    	{
			controls = undefined;

			_display[ 0 ].isPresenting ? _display[ 0 ].exitPresent() : _display[ 0 ].requestPresent( [ { source: renderer.domElement } ] ).then(function () { isVRtested=true; startAllVideos(); });

			renderer.vr.setDevice( _display[ 0 ] );
		}
    };

	function waitSesionManager()
	{ 
		if (isVRtested == true)
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
		if (loggerActivated)
		{
			setInterval(function(){
				statObj.add(new StatElements());
			}, 500);
		}
	}

	function update() 
	{	
		if(controls) controls.update();
		effect.render( scene, camera );
		requestAnimationFrame( update );
    }

    function render()
    {
    	if ( gamepad ) gamepad.update();
    	if ( controls ) controls.update();
    	//THREE.VRController.update()
    	renderer.render( scene, camera );

    	if ( AudioManager.isAmbisonics ) AudioManager.updateRotationMatrix( camera.matrixWorld.elements );

    	if(gamepad && gamepad.getTouchPadState()) 
    	{
            var mouse3D = new THREE.Vector2();
	        mouse3D.x = 0;
	        mouse3D.y = 0;
					
			//moData.isPausedById(0) ? moData.playAll() : moData.pauseAll();
			interController.checkInteraction(mouse3D, camera, 'onDocumentMouseDown');
		}
    }


    function init() 
    {
		console.log("[AplicationManager]  init");
	
		blockContainer();
			
		container = document.getElementById( 'container' );
	
        camera = new THREE.PerspectiveCamera( 60.0, window.innerWidth / window.innerHeight, 0.05, 1000 );
        camera.name = 'perspectivecamera';
        
        this.CameraParentObject = new THREE.Object3D();
        this.CameraParentObject.name = 'parentcamera';
		this.CameraParentObject.add(camera);

		scene = new THREE.Scene();
		scene.add(this.CameraParentObject);

		renderer = new THREE.WebGLRenderer({
			antialias:true,
			premultipliedAlpha: false,
			alpha: true
		});

		renderer.domElement.id = 'YourIDName';

		renderer.sortObjects = true;

		renderer.setPixelRatio(Math.floor(window.devicePixelRatio));
		renderer.setSize( window.innerWidth, window.innerHeight );

		container.appendChild( renderer.domElement );

        moData.createSphericalVideoInScene( mainContentURL, 'contentsphere' );

        //moData.createCubeGeometry116('./resources/cubemap3.jpg', 'name');
        //moData.createCubeGeometry65('./resources/dagomi_cube_603_edit.mp4', 'name');

        document.body.appendChild( WEBVR.createButton( renderer ) );

		/*if ( 'getVRDisplays' in navigator ) 
		{

		  	navigator.getVRDisplays().then(function (vrDisplays) 
		    {
		        _display = vrDisplays;

		        if ( vrDisplays.length )
		        {
		        	gamepad = new THREE.DaydreamController( camera, renderer.domElement );
		        	//this.switchDevice();
		        	document.body.appendChild( WEBVR.createButton( renderer ) );
		        }
		        else 
		        {
		        	//document.body.appendChild( WEBVR.createButton( renderer ) );
		        }

		        //controls = new THREE.DeviceOrientationAndTouchController( camera, renderer.domElement, renderer );
		        	
        		//startAllVideos();
			    haveVrDisplay = true;
			    renderer.vr.enabled = true;

				 		//document.body.appendChild( WEBVR.createButton( renderer ) );   		 		

				 		//gamepad = new THREE.DaydreamController(renderer.domElement);
						//gamepad.position.set( 0.025, - 0.05, 0 );
						//gamepad.position.z = - 1;
						//gamepad.renderOrder = 10;

						//scene.add( gamepad );


				isVRtested = true; 
				startAllVideos();
		  	});
		}
		else 
		{
			startAllVideos();
			isVRtested=true;

			effect = new THREE.StereoEffect(renderer);
		    effect.setSize(window.innerWidth, window.innerHeight);

			controls = new THREE.DeviceOrientationAndTouchController(camera, renderer.domElement, renderer);
			//controls.connect();
		}*/
	}

	var WEBVR = {

		createButton: function ( renderer ) {

			function showEnterVR( display ) {

				button.style.display = '';

				button.style.cursor = 'pointer';
				button.style.left = 'calc(50% - 50px)';
				button.style.width = '100px';

				button.textContent = 'ENTER VR!';

				button.onmouseenter = function () { button.style.opacity = '1.0'; };
				button.onmouseleave = function () { button.style.opacity = '0.5'; };

				button.onclick = function () {

					display.isPresenting ? display.exitPresent() : display.requestPresent( [ { source: renderer.domElement } ] ).then(function () { isVRtested=true; startAllVideos(); });

				};

				renderer.vr.setDevice( display );

			}

			function stylizeElement( element ) {

				element.style.position = 'absolute';
				element.style.bottom = '200px';
				element.style.padding = '12px 6px';
				element.style.border = '1px solid #fff';
				element.style.borderRadius = '4px';
				element.style.background = 'transparent';
				element.style.color = '#fff';
				element.style.font = 'normal 13px sans-serif';
				element.style.textAlign = 'center';
				element.style.opacity = '0.5';
				element.style.outline = 'none';
				element.style.zIndex = '999';

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
						button.textContent = event.display.isPresenting ? 'EXIT VR' : 'ENTER VR';

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

							console.error('ahashashashhjasja jaskj kjaksdka k')
							gamepad = new THREE.DaydreamController( camera, renderer.domElement );

							showEnterVR( displays[ 0 ] );

							moData.createPointer();

						} 
						else 
						{
							controls = new THREE.DeviceOrientationAndTouchController( camera, renderer.domElement, renderer );
						}

						haveVrDisplay = true;
					    renderer.vr.enabled = true;

						 		//document.body.appendChild( WEBVR.createButton( renderer ) );   		 		

						 		/*gamepad = new THREE.DaydreamController(renderer.domElement);
								gamepad.position.set( 0.025, - 0.05, 0 );
								gamepad.position.z = - 1;
								gamepad.renderOrder = 10;

								scene.add( gamepad );*/


						isVRtested = true; 
						startAllVideos();

					} );

				return button;

			} else {

				startAllVideos();
				isVRtested=true;

				effect = new THREE.StereoEffect(renderer);
			    effect.setSize(window.innerWidth, window.innerHeight);

				controls = new THREE.DeviceOrientationAndTouchController(camera, renderer.domElement, renderer);

			}

		}
	};
}
