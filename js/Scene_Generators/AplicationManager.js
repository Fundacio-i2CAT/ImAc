

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
		//this.CameraPatherObject.lookAt(new THREE.Vector3(0,0,0));
		//this.CameraPatherObject.position.x = 0;
		//this.CameraPatherObject.position.y = 0;
		//this.CameraPatherObject.position.z = 0;
		this.CameraPatherObject.add(camera);

		scene = new THREE.Scene();
		scene.add(this.CameraPatherObject);
		//scene.add(camera);

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

        moData.createSphericalVideoInScene(mainContentURL, 'name');

        //moData.createCineVideoInScene(mainContentURL, 'exp');

        //moData.createCubeGeometry65('./resources/cubemap2.jpg', 'name');
        //moData.createCubeGeometry116('./resources/cubemap3.jpg', 'name');
        //moData.createCubeGeometry65('./resources/dagomi_cube_603_edit.mp4', 'name');

        //if (isAndroid) this.CameraPatherObject.lookAt(new THREE.Vector3(0,0,0));

        if (!isHMD) 
        {
        	//CameraPatherObject.lookAt(new THREE.Vector3(1,0,0));
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

			       		//CameraPatherObject.rotateY(Math.PI/2);

				 		document.body.appendChild( WEBVR.createButton( renderer ) );    

				 		gamepad = new THREE.DaydreamController(renderer.domElement);
						gamepad.position.set( 0.025, - 0.05, 0 );
						gamepad.position.z = - 1;
						gamepad.renderOrder = 10;

					/*gamepadHelper = new THREE.Line( new THREE.BufferGeometry(), new THREE.LineBasicMaterial( { linewidth: 10 } ) );
					gamepadHelper.geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 10 ], 3 ) );
					gamepad.add( gamepadHelper );

					renderer.domElement.addEventListener( 'click', function ( event ) {
						gamepadHelper.material.color.setHex( Math.random() * 0xffffff );
					} );*/

						scene.add( gamepad );



/*

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  This shortcut will be useful for later on down the road...
applyDown = function( obj, key, value ){
  obj[ key ] = value
  if( obj.children !== undefined && obj.children.length > 0 ){
    obj.children.forEach( function( child ){
      applyDown( child, key, value )
    })
  }
}
castShadows = function( obj ){
  applyDown( obj, 'castShadow', true )
}
receiveShadows = function( obj ){
  applyDown( obj, 'receiveShadow', true )
}


var light = new THREE.DirectionalLight( 0xFFFFFF, 1, 1000 )
light.position.set(  1, 100, -0.5 )
light.castShadow = true
light.shadow.mapSize.width  = 2048
light.shadow.mapSize.height = 2048
light.shadow.camera.near    =    1
light.shadow.camera.far     =   1200
scene.add( light )

scene.add( new THREE.HemisphereLight( 0x909090, 0x404040 ))

var floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry( 6, 6, 12, 12 ),
  new THREE.MeshStandardMaterial({
    roughness: 1.0,
    metalness: 0.0,
    color: 0xFFFFFF,
    transparent: true,
    opacity: 0.8
  })
)
floor.rotation.x = Math.PI / -2
floor.receiveShadow = true
scene.add( floor )
var wireframe = new THREE.Mesh(
  floor.geometry.clone(),
  new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    wireframe: true
  })
)
wireframe.rotation.x = Math.PI / -2
wireframe.position.y = -0.001
scene.add( wireframe )
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.addEventListener( 'vr controller connected', function( event ){
  //  Here it is, your VR controller instance.
  //  It’s really a THREE.Object3D so you can just add it to your scene:
  var controller = event.detail
  scene.add( controller )

  //controller.standingMatrix = renderer.vr.getStandingMatrix()

  //controller.head = window.camera

  var
  meshColorOff = 0xDB3236,//  Red.
  meshColorOn  = 0xF4C20D,//  Yellow.
  controllerMaterial = new THREE.MeshBasicMaterial( { color: meshColorOff } ),
  //controllerMaterial = new THREE.MeshStandardMaterial({ color: meshColorOff }),
  controllerMesh = new THREE.Mesh(
    new THREE.CylinderGeometry( 0.005, 0.05, 0.1, 20 ),
    controllerMaterial
  ),
  handleMesh = new THREE.Mesh(
    new THREE.BoxGeometry( 0.03, 0.1, 0.03 ),
    controllerMaterial
  )
  controllerMaterial.flatShading = true
  handleMesh.position.y = -0.05
  controllerMesh.add( handleMesh )

  controllerMesh.rotation.x = -Math.PI / 2


  controller.userData.mesh = controllerMesh//  So we can change the color later.
  controller.add( controllerMesh )

  controller.addEventListener( 'primary press began', function( event ){
    event.target.userData.mesh.material.color.setHex( meshColorOn )
    //guiInputHelper.pressed( true )
  })
  controller.addEventListener( 'primary press ended', function( event ){
    event.target.userData.mesh.material.color.setHex( meshColorOff )
    //guiInputHelper.pressed( false )
  })
  //  Daddy, what happens when we die?
  controller.addEventListener( 'disconnected', function( event ){
    controller.parent.remove( controller )
  })
})


*/



					}
					else
					{
						//CameraPatherObject.lookAt(new THREE.Vector3(1,0,0));
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
				//camera.lookAt(new THREE.Vector3(-1,0,0));	
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