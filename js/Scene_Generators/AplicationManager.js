

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
			haveVrDisplay ? renderer.animate( render ) : isHMD ? update() : updateT(); 
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

	function updateT() 
	{	
		if(controls) controls.update();
		renderer.render( scene, camera );
		requestAnimationFrame( updateT );
    }

    function render()
    {
    	gamepad.update();
    	//THREE.VRController.update()
    	renderer.render( scene, camera );

    	if (AudioManager.isAmbisonics) AudioManager.updateRotationMatrix(camera.matrixWorld.elements);//_foaRenderer.setRotationMatrix4(camera.matrixWorld.elements);

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

        moData.createSphericalVideoInScene(mainContentURL, 'mp4', 'name');

        //moData.createCineVideoInScene(mainContentURL, 'mp4','exp');

        //moData.createCubeGeometry65('./resources/cubemap2.jpg', 'mp4', 'name');
        //moData.createCubeGeometry116('./resources/cubemap3.jpg', 'mp4', 'name');
        //moData.createCubeGeometry65('./resources/dagomi_cube_603_edit.mp4', 'mp4', 'name');

        if (!isHMD) 
        {
			startAllVideos();
			isVRtested = true;

			controls = new THREE.DeviceOrientationAndTouchController(camera, renderer.domElement, renderer);
			controls.connect();
        }
        else 
        {
			if ( 'getVRDisplays' in navigator ) 
			{
		  		navigator.getVRDisplays().then(function (vrDisplays) 
		        {
		        	if (vrDisplays.length)
		        	{
			       		haveVrDisplay = true;
			       		renderer.vr.enabled = true;

				 		document.body.appendChild( WEBVR.createButton( renderer ) );    

				 		gamepad = new THREE.DaydreamController(renderer.domElement);
						gamepad.position.set( 0.025, - 0.05, 0 );
						gamepad.position.z = - 1;
						gamepad.renderOrder = 10;

						scene.add( gamepad );

					}
					else
					{
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
				startAllVideos();
				isVRtested=true;

				effect = new THREE.StereoEffect(renderer);
		        effect.setSize(window.innerWidth, window.innerHeight);

				controls = new THREE.DeviceOrientationAndTouchController(camera, renderer.domElement, renderer);
				controls.connect();
			}
		}
	}
}