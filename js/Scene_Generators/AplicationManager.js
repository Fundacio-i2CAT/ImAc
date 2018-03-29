
var contentURI;
var camera;
var scene;
var isVRtested = false;
var haveVrDisplay = false;


function AplicationManager ()
{
    var controls;
    var container;
    var renderer;
    var effect;

    var gamepad;


    this.init_AplicationManager = function()
    {
        init();
		waitSesionManager();	
    }

	function waitSesionManager()
	{ 
		if (isVRtested == true)
		{
			haveVrDisplay ? renderer.animate( render ) : update(); 
		}
		else
		{
			requestAnimationFrame( waitSesionManager );
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
    	gamepad.update();
    	renderer.render( scene, camera );

    	if (_isAmbisonics) _foaRenderer.setRotationMatrix4(camera.matrixWorld.elements);

    	if(gamepad.getTouchPadState()) 
    	{
            moData.isPausedById(0) ? moData.playAll() : moData.pauseAll();
		}
    }


    function init() 
    {
		console.log("[AplicationManager]  init");
	
		blockContainer();
			
		container = document.getElementById( 'container' );
	
        camera = new THREE.PerspectiveCamera( 60.0, window.innerWidth / window.innerHeight, 0.05, 100 );
        camera.lookAt(new THREE.Vector3(0,0,0));

		scene = new THREE.Scene();
		scene.add(camera);

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

        //moData.Create_SphereVideo_Mesh();
        moData.createSphericalVideoInScene(mainContentURL, 'name');


		if ( 'getVRDisplays' in navigator ) 
		{
	  		navigator.getVRDisplays().then(function (vrDisplays) 
	        {
	        	if (vrDisplays.length)
	        	{
		       		haveVrDisplay = true;
		       		renderer.vr.enabled = true;

		       		//camera.eulerOrder = 'ZXY';

			 		document.body.appendChild( WEBVR.createButton( renderer ) );    

			 		gamepad = new THREE.DaydreamController(renderer.domElement);
					gamepad.position.set( 0.025, - 0.05, 0 );
					gamepad.position.z = - 1;

					scene.add( gamepad );		
				}
				else
				{
					camera.lookAt(new THREE.Vector3(-1,0,0));	
					startAllVideos();
					isVRtested=true;

					effect = new THREE.StereoEffect(renderer);
	           		effect.setSize(window.innerWidth, window.innerHeight);

					controls = new THREE.DeviceOrientationAndTouchController(camera, renderer.domElement, renderer);
					controls.connect();
				}

	  		}, function() 
		    {
		       	alert('error!!!!!')
		       	isVRtested=true;
				controls = new THREE.DeviceOrientationAndTouchController(camera, renderer.domElement, renderer);
				controls.connect();
		    });
		}
		else 
		{
			camera.lookAt(new THREE.Vector3(-1,0,0));	
			startAllVideos();
			isVRtested=true;

			effect = new THREE.StereoEffect(renderer);
	        effect.setSize(window.innerWidth, window.innerHeight);

			controls = new THREE.DeviceOrientationAndTouchController(camera, renderer.domElement, renderer);
			controls.connect();
		}
	}
}