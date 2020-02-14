
var camera;
var scene;
var controls;


function AplicationManager()
{
    var renderer;
    var _display;

    var mouse3D = new THREE.Vector2( 0, 0 );
    var hmdTouchVector = new THREE.Vector2( 0, 0 );

    var button_1;
    var button_2;

    this.getRenderer = function() { return renderer };


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

    /*this.getDisplays = function()
    {
    	return _display;
    };

    this.setDisplays = function(displays)
    {
    	_display = displays;
    };*/

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

        update();

        Reticulum.update();
    }

    this.init = function()
    {
        console.log('Init AplicationManager')
			
		var container = document.getElementById( 'container' );


        // Init World
        camera = new THREE.PerspectiveCamera( 60.0, window.innerWidth / window.innerHeight, 1, 2000);
        camera.name = 'perspectivecamera';
        scene = new THREE.Scene();
        scene.add( camera );

        vFOV = THREE.Math.degToRad( camera.fov ); // convert vertical fov to radians
        vHeight = 2 * Math.tan( vFOV / 2 ) * canvasDistance; // visible height

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

        //scene.add( _moData.getSphericalVideoMesh( 100, mainContentURL, 'contentsphere' ) )

        _isTV ? camera.add( _moData.getDirectiveVideo( mainContentURL, 'contentsphere' ) ) : scene.add( _moData.getSphericalVideoMesh( 1000, mainContentURL, 'contentsphere' ) );

        if ( 'getVRDisplays' in navigator ) {

            VideoController.init();

        	document.body.appendChild( createVRButton_1( renderer ) );
        	document.body.appendChild( createVRButton_2( renderer ) );

        	navigator.getVRDisplays().then( function ( displays ) 
        	{
				//_display = displays;
				renderer.vr.enabled = true;
				activateLogger();
				renderer.animate( render );
			} );
        }
        else alert("This browser don't support VR content");

        if ( localStorage.ImAc_server ) _Sync.init( localStorage.ImAc_server );
        runDemo();  

        initReticulum( camera );

        canvasMgr.Init();

        document.addEventListener('mousemove', onDocumentMouseMove, false);
        //document.addEventListener('mousedown', onDocumentMouseDown, false);
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

        if ( _isHMD ) canvas.rotation.z = -camera.rotation.z;

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

        /*window.onbeforeunload = sendTimeToServer;
        function sendTimeToServer() {
            // some ajax code
            console.log('PAGE CLOSE');

            var QoE_URL = 'http://' + window.location.hostname + ':4000/api/create';

            let lastSessionLog = {
                messageType: 'STOP',
                sessionId: sessionId,
                date: Date.now()
            }

            $.post( QoE_URL, lastSessionLog, function(data, status){
                if (status == 'success' && firstQoEmsg ){
                    firstQoEmsg = false;
                }
                //Debug.log("Data: " + data + "\nStatus: " + status);
            });
        }*/
    }

    function onDocumentMouseMove(event) {
        event.preventDefault();

        mouse3D.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse3D.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
}