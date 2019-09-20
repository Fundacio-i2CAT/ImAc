
var camera;
var scene;
var controls;
var rendertime = 0;


function AplicationManager()
{
    var renderer;
    var _display;

    var mouse3D = new THREE.Vector2( 0, 0 );
    var raycaster;

    var button_1;
    var button_2;

    var intersects;

    this.getRenderer = function() { return renderer };

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

    function render(){
        renderer.render( scene, camera );
        intersects = raycaster.intersectObjects(scene.children, true);

        update();

        Reticulum.update();
    }

    this.init = function()
    {
        console.log('Init AplicationManager')
			
		var container = document.getElementById( 'container' );


        // Init World
        camera = new THREE.PerspectiveCamera( 60.0, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.name = 'perspectivecamera';
        scene = new THREE.Scene();
        scene.add( camera );

        // Init Render
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            premultipliedAlpha: false,
            alpha: true
        });

        renderer.domElement.id = 'WebGLRenderer';
        renderer.sortObjects = true;
        renderer.setPixelRatio( Math.floor( window.devicePixelRatio ) );
        renderer.setSize( window.innerWidth, window.innerHeight );
	

        // CONTROLS
        controls = new THREE.DeviceOrientationAndTouchController( camera, renderer.domElement, renderer );

		container.appendChild( renderer.domElement );

		_moData.createOpenMenuMesh();

        scene.add( _moData.getSphericalVideoMesh( 100, mainContentURL, 'contentsphere' ) )

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

        if ( localStorage.ImAc_server ) _Sync.init( localStorage.ImAc_server );
        runDemo();  

        initReticulum( camera );

        // --- init & events -------------------------------------------------
        raycaster = new THREE.Raycaster();

        document.addEventListener('mousemove', onDocumentMouseMove, false);
        //document.addEventListener('mousedown', onDocumentMouseDown, false);

        //animate(); 
	};



    function animate() 
    {
        requestAnimationFrame( animate );
        render();       
        update();

        Reticulum.update();
    }

    var touchtime = 0;
    var touchcount = 0;

    function update()
    {
        /*var time =  performance.now();
        console.log( time - rendertime )
        rendertime = time;*/

        THREE.VRController.update()
        //if ( controls ) controls.update();
        

        _AudioManager.updateRotationMatrix( camera.matrixWorld.elements );

        if( THREE.VRController.getTouchPadState() && _isHMD ) 
        {           
            interController.checkInteraction( mouse3D, camera, 'onDocumentMouseDown' );

            // function to open menu with double click
            /*if ( Date.now() - touchtime > 300 ) touchcount = 0;

            if (touchcount == 0) {
                
                touchcount++;
                touchtime = Date.now();
            }
            else if (touchcount < 1) {
                touchcount++;
            }
            else {
                touchcount = 0;
                if ( scene.getObjectByName( "openMenu" ).visible ) menuMgr.initFirstMenuState();
                else menuMgr.ResetViews();  
            }*/

            //if ( scene.getObjectByName( "openMenu" ).visible ) menuMgr.initFirstMenuState();
            if ( menuMgr.getMenuType() == 2 && scene.getObjectByName( 'trad-main-menu' ).visible == false ) menuMgr.initFirstMenuState();
            else if ( menuMgr.getMenuType() == 1 && scene.getObjectByName( 'trad-option-menu' ).visible == false && scene.getObjectByName( 'trad-main-menu' ).visible == false ) menuMgr.initFirstMenuState();
        
        }
        if ( _isHMD && subController.getSubtitleEnabled() )
        {
            subController.updateSTRotation();
        }
        if ( _isHMD && subController.getSignerEnabled() )
        {
            subController.updateSLRotation();
        }

        subController.updateRadar();


        interController.checkInteractionSubMenuHover(mouse3D, camera);
        interController.showAccessIconTooltip(mouse3D, camera);

        controls.update();
    }

    function onDocumentMouseMove(event) {
      event.preventDefault();

      mouse3D.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse3D.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
}