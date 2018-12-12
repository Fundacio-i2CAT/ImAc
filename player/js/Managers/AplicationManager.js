
var camera;
var scene;
var controls;

function AplicationManager()
{
    var renderer;
    var _display;

    var mouse3D = new THREE.Vector2( 0, 0 );

    var button_1;
    var button_2;

    function initWorld()
    {
    	camera = new THREE.PerspectiveCamera( 60.0, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.name = 'perspectivecamera';

        this.CameraParentObject = new THREE.Object3D();
        this.CameraParentObject.name = 'parentcamera';
		this.CameraParentObject.add( camera );

		scene = new THREE.Scene();
		scene.add( this.CameraParentObject );
    }

    function initRenderer()
    {
    	renderer = new THREE.WebGLRenderer({
			antialias:true,
			premultipliedAlpha: false,
			alpha: true
		});

		renderer.domElement.id = 'WebGLRenderer';
		renderer.sortObjects = true;
		renderer.setPixelRatio( Math.floor( window.devicePixelRatio ) );
		renderer.setSize( window.innerWidth, window.innerHeight );
    }

    // Used when autopositioning is activated
    this.enableVR = function()
    {
    	renderer.vr.setDevice( _display[ 0 ] );
    };

    this.disableVR = function()
    {
    	renderer.vr.setDevice( null );
    };

    this.disableVRButtons = function()
    {
    	button_1.style.display = 'none';
		button_2.style.display = 'none';
    };

    this.setVRButton1 = function(button)
    {
    	button_1 = button;
    };

    this.setVRButton2 = function(button)
    {
    	button_2 = button;
    };

    this.getDisplays = function()
    {
    	return _display;
    };

    this.setDisplays = function(displays)
    {
    	_display = displays;
    };

	function activateLogger()
	{
		if ( loggerActivated )
		{
			setInterval(function(){
				statObj.add( new StatElements() );
			}, 500);
		}
	}

    function render()
    {
    	THREE.VRController.update()
    	if ( controls ) controls.update();
    	renderer.render( scene, camera );

    	_AudioManager.updateRotationMatrix( camera.matrixWorld.elements );

    	if( THREE.VRController.getTouchPadState() && _isHMD ) 
    	{			
			interController.checkInteraction( mouse3D, camera, 'onDocumentMouseDown' );
		}

		subController.updateRadar();

		Reticulum.update();
    }

    this.init = function()
    {
        console.log('Init AplicationManager')
			
		var container = document.getElementById( 'container' );
	
        initWorld();
		initRenderer();

		controls = new THREE.DeviceOrientationAndTouchController( camera, CameraParentObject, renderer.domElement, renderer );

		container.appendChild( renderer.domElement );

		_moData.createOpenMenuMesh();

        scene.add( _moData.getSphericalVideoMesh( 100, mainContentURL, 'contentsphere' ) )
		_moData.createCastShadows();

        if ( 'getVRDisplays' in navigator ) {

            VideoController.init();

        	document.body.appendChild( createVRButton_1( renderer ) );
        	document.body.appendChild( createVRButton_2( renderer ) );

        	navigator.getVRDisplays().then( function ( displays ) 
        	{
				_display = displays;
				renderer.vr.enabled = true;
				activateLogger();
				renderer.animate( render );
			} );
        }
        else alert("This browser don't support VR content");

        initReticulum( camera );

        runDemo();
	};
}