
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

	/*function updateT() 
	{	
		if(controls) controls.update();
		renderer.render( scene, camera );
		requestAnimationFrame( updateT );
    }*/

    function render()
    {
    	if ( gamepad ) gamepad.update();
    	if ( controls ) controls.update();
    	//THREE.VRController.update()
    	renderer.render( scene, camera );

    	if ( AudioManager.isAmbisonics ) AudioManager.updateRotationMatrix( camera.matrixWorld.elements );

    	/*if(gamepad.getTouchPadState()) 
    	{
            moData.isPausedById(0) ? moData.playAll() : moData.pauseAll();
		}*/
    }


    function init() 
    {
		console.log("[AplicationManager]  init");
	
		blockContainer();
			
		container = document.getElementById( 'container' );
	
        camera = new THREE.PerspectiveCamera( 60.0, window.innerWidth / window.innerHeight, 0.05, 1000 );
        this.CameraPatherObject = new THREE.Object3D();
		this.CameraPatherObject.add(camera);

		scene = new THREE.Scene();
		scene.add(this.CameraPatherObject);

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

        moData.createSphericalVideoInScene( mainContentURL, 'name' );

        //moData.createCubeGeometry116('./resources/cubemap3.jpg', 'name');
        //moData.createCubeGeometry65('./resources/dagomi_cube_603_edit.mp4', 'name');


		if ( 'getVRDisplays' in navigator ) 
		{

		  	navigator.getVRDisplays().then(function (vrDisplays) 
		    {
		        _display = vrDisplays;

		        if ( vrDisplays.length )
		        {
		        	gamepad = new THREE.DaydreamController( camera, renderer.domElement );
		        }
		        else 
		        {

		        }

		        controls = new THREE.DeviceOrientationAndTouchController( camera, renderer.domElement, renderer );
		        	
		        		//startAllVideos();
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
		}
	}
}