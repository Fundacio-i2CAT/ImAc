
var camera;
var scene;

var controls;

function AplicationManager()
{
    var renderer;
    var _display;


    this.init_AplicationManager = function()
    {
        init();
		//waitSesionManager();	
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

	function activateLogger()
	{
		if ( loggerActivated )
		{
			setInterval(function(){
				statObj.add(new StatElements());
			}, 500);
		}
	}

	/*function update() 
	{	
		if ( controls ) controls.update();
		effect.render( scene, camera );
		requestAnimationFrame( update );		
    }*/

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
			
		var container = document.getElementById( 'container' );
	
        camera = new THREE.PerspectiveCamera( 60.0, window.innerWidth / window.innerHeight, 0.05, 1000 );
        camera.name = 'perspectivecamera';

 		moData.createOpenMenuMesh();

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

		renderer.setPixelRatio( Math.floor( window.devicePixelRatio ) );
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
				//haveVrDisplay = true;
				renderer.vr.enabled = true;
				//isVRtested = true; 
				activateLogger();

				renderer.animate( render );

				VideoController.playAll();
			} );
        }
        else
        {
        	alert("This browser don't support VR content")
        }

        initReticulum( camera );
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
							//isVRtested=true; 
							_isHMD = true; 	
							createMenus();						
						});
				};

				renderer.vr.setDevice( display );

			}

			//if ( 'getVRDisplays' in navigator ) {

				var button = document.createElement( 'button' );
				//button.style.display = 'none';

				stylizeElement( button );

				/*window.addEventListener( 'vrdisplayconnect', function ( event ) {

					showEnterVR( event.display );

				}, false );*/

				window.addEventListener( 'vrdisplaypresentchange', function ( event ) {
			
					if (event.display) {
						if (!event.display.isPresenting) location.reload();
					}

				}, false );

				/*window.addEventListener( 'vrdisplayactivate', function ( event ) {

					event.display.requestPresent( [ { source: renderer.domElement } ] ).then(function () { isVRtested = true; startAllVideos(); });

				}, false );*/


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

			//}
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
					
					//isVRtested=true;  
					_isHMD = false; 

					createMenus();

				};
			}

			var button = document.createElement( 'button' );
			//button.style.display = 'none';

			stylizeElement( button );


			//if ( 'getVRDisplays' in navigator ) {

				navigator.getVRDisplays().then( function ( displays ) 
				{
					if ( displays.length > 0 ) 
					{
						showEnterVR();
					}
				} );

				button2 = button;

				return button;
			//}

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