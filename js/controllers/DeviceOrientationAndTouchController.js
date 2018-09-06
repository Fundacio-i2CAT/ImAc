//**
//*
//* ImmersiaTV webApp
//*
//* Orientation and touch controllers
//*
//**
THREE.DeviceOrientationAndTouchController = function( object, objectPather, domElement, renderer ) {

	var scope = this;
	var touchtime;

	var raycaster = new THREE.Raycaster();
	var interList = [];

	var _origin = new THREE.Vector3( 0.155, 1.21, -0.15 );

	this.isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;

	this.object = object;
	this.objectPather = objectPather;
	this.object.rotation.reorder( "YXZ" );
	
	
	this.element = domElement || document;
	
	var container = document.getElementById( 'container' );
	var mouse;

	this.enabled = true;

	this.deviceOrientation = {};
	this.screenOrientation = window.orientation || 0;

	this.alpha = 0;
	this.enableManualDrag = true;
	//this.alphaOffsetAngle = 0;//THREE.Math.degToRad(90);
	
	// Manual rotate override components
	var startX = 0, startY = 0,
	    currentX = 0, currentY = 0,
	    scrollSpeedX, scrollSpeedY,
	    tmpQuat = new THREE.Quaternion();

	var CONTROLLER_STATE = {
		AUTO: 0,
		MANUAL_ROTATE: 1,
		MANUAL_ROTATE_DEVICE: 2
	};

	var appState = CONTROLLER_STATE.AUTO;
	
	var deviceQuat = new THREE.Quaternion();

	
	this.objectPather = objectPather;

	var mouse;

	this.enableManualDrag = true;

	this.setInteractiveObject = function(object)
	{
		interList.push(object);
	};

	this.getInteractiveObject = function()
	{
		return interList;
	};

	this.removeInteractiveObject = function(name)
	{
		interList = interList.filter(e => e.name != name);
	};


	var onScreenOrientationChangeEvent = function() 
	{
		scope.screenOrientation = window.orientation || 0;
	};
	
	
	var onWindowResize = function() 
	{	
		object.aspect = window.innerWidth / window.innerHeight;
		object.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	};

	this.onDocumentMouseDown = function ( event ) {
		event.preventDefault();

		tmpQuat.copy( scope.objectPather.quaternion );

		startX = currentX = event.pageX;
		startY = currentY = event.pageY;
			
		var mouse3D = new THREE.Vector2();
        mouse3D.x = _isHMD ? 0 : ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse3D.y = _isHMD ? 0 : - ( event.clientY / window.innerHeight ) * 2 + 1;
		
		//INTERACTIVITY DETECT
        interController.checkInteraction(mouse3D, scope.object, 'onDocumentMouseDown');
		
		//changing state 
		appState = CONTROLLER_STATE.MANUAL_ROTATE;

		scope.enabled = false;
		
		// Set consistent scroll speed based on current viewport width/height
		scrollSpeedX = ( 1200 / window.innerWidth ) * 0.2;
		scrollSpeedY = ( 800 / window.innerHeight ) * 0.2;

		this.element.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
		this.element.addEventListener( 'mouseup', this.onDocumentMouseUp, false );

		if ( _isHMD ) {
			var mouse3D = new THREE.Vector2();
	        mouse3D.x = 0;
	        mouse3D.y = 0;
		}
		
	}.bind( this );

	var onDeviceOrientationChangeEvent = function( event ) 
	{
		scope.deviceOrientation = event;
	};

	this.onDocumentMouseMove = function ( event ) {
		currentX = event.pageX;
		currentY = event.pageY;
	}.bind( this );

	this.onDocumentMouseUp = function ( event ) {

		this.element.removeEventListener( 'mousemove', this.onDocumentMouseMove, false );
		this.element.removeEventListener( 'mouseup', this.onDocumentMouseUp, false );

		appState = CONTROLLER_STATE.AUTO;

		scope.enabled = true;
		
	}.bind( this );
	
	this.onDocumentTouchStart = function ( event ) {

        //enterfullscreen();		
		event.preventDefault();
		event.stopPropagation();

		switch ( event.touches.length ) {
			case 1: // ROTATE
				if ( this.enableManualDrag !== true ) return;
				touchtime = Date.now();
				
				var mouse3D = new THREE.Vector2();
				mouse3D.x = _isHMD ? 0 : ( event.touches[0].pageX / window.innerWidth ) * 2 - 1;
                mouse3D.y = _isHMD ? 0 : - ( event.touches[0].pageY / window.innerHeight ) * 2 + 1;
				
				//INTERACTIVITY DETECT
                interController.checkInteraction(mouse3D, scope.object, 'onDocumentMouseDown');

				appState = CONTROLLER_STATE.MANUAL_ROTATE_DEVICE;

				scope.enabled = false;

				tmpQuat.copy( scope.objectPather.quaternion );

				startX = currentX = event.touches[ 0 ].pageX;
				startY = currentY = event.touches[ 0 ].pageY;

				// Set consistent scroll speed based on current viewport width/height
				scrollSpeedX = ( 1200 / window.innerWidth ) * 0.1;
				scrollSpeedY = ( 800 / window.innerHeight ) * 0.1;

				this.element.addEventListener( 'touchmove', this.onDocumentTouchMove, false );
				this.element.addEventListener( 'touchend', this.onDocumentTouchEnd, false );

				break;
			case 2:
				for (var i=0; i < event.touches.length; i++) {
     				tpCache.push(event.touches[i]);
   				}

				break;
		}
	}.bind( this );

	var myangle = 0;

	this.onkeydownStart = function ( event ) {
		
/*
		if( !autopositioning )
		{
			switch ( event.keyCode ) 
			{
				case 37:
	            	camera.rotation.y += Math.PI / 90;

					if (AudioManager.isAmbisonics) AudioManager.updateRotationMatrix( camera.matrixWorld.elements );
			        //subtitles3d.position.x += 0.1;
	            	break;

	        	case 38:
	            	camera.rotation.x += Math.PI / 180;

					if (AudioManager.isAmbisonics) AudioManager.updateRotationMatrix( camera.matrixWorld.elements );

	            	break;

	        	case 39:
	        		//subtitles3d.position.x -= 0.1;
	            	camera.rotation.y -= Math.PI / 90;

					if (AudioManager.isAmbisonics) AudioManager.updateRotationMatrix( camera.matrixWorld.elements );

	            	break;

	        	case 40:
	            	camera.rotation.x -= Math.PI / 180;

					if (AudioManager.isAmbisonics) AudioManager.updateRotationMatrix( camera.matrixWorld.elements );

	            	break;

	        	case 32:

	            	//moData.isPausedById(0) ? moData.playAll() : moData.pauseAll();
	            	//camera.position.z += 10;
	            	//camera.position.y += 5;

	            	break;


	        	case 87:

	        		scene.getObjectByName(menuList[0].name).position.y += 1;
	            	break;

	        	case 83:

	    			scene.getObjectByName(menuList[0].name).position.y -= 1;
	        		break;

	        	case 65:

	        		myangle -= 120;

	    			scene.getObjectByName(menuList[0].name).position.x = Math.sin(Math.radians(myangle))*69;
	    			scene.getObjectByName(menuList[0].name).position.z = -Math.cos(Math.radians(myangle))*69;

	    			scene.getObjectByName(menuList[0].name).rotation.y += Math.radians(120);

	        		break;        			

	    		case 68:

	    			myangle += 120;

	    			scene.getObjectByName(menuList[0].name).position.x = Math.sin(Math.radians(myangle))*69;
	    			scene.getObjectByName(menuList[0].name).position.z = -Math.cos(Math.radians(myangle))*69;

	    			scene.getObjectByName(menuList[0].name).rotation.y -= Math.radians(120);
	    			
	        		break;

			}

		}
*/
	}.bind( this );

	this.onDocumentTouchMove = function ( event ) {
	
		switch( event.touches.length ) {
			case 1:
				currentX = event.touches[ 0 ].pageX;
				currentY = event.touches[ 0 ].pageY;
				break;

			case 2:
				var point1=-1, point2=-1;
   				for (var i=0; i < tpCache.length; i++) {
     				if (tpCache[i].identifier == event.touches[0].identifier) point1 = i;
     				if (tpCache[i].identifier == event.touches[1].identifier) point2 = i;
   				}
   				if (point1 >=0 && point2 >= 0) {
    		 		// Calculate the difference between the start and move coordinates
    		 		var diff1 = tpCache[point1].pageX - event.touches[0].pageX;
     				var diff2 = tpCache[point2].pageX - event.touches[1].pageX;
     				// This threshold is device dependent as well as application specific
     				//var PINCH_THRESHHOLD = event.target.clientWidth / 10;
     				if(tpCache[point1].pageX < tpCache[point2].pageX) {
     					zoom(Math.trunc((diff1 - diff2)/10));
     				}
     				else {
     					zoom(Math.trunc((diff2 - diff1)/10));
     				}
   				}
   				else {
     				// empty tpCache
     				tpCache = new Array();
   				}
				break;
		}
	}.bind( this );

	this.onDocumentTouchEnd = function ( event ) 
	{
		//startAllAudios();		
		tpCache = new Array();
		
		this.element.removeEventListener( 'touchmove', this.onDocumentTouchMove, false );
		this.element.removeEventListener( 'touchend', this.onDocumentTouchEnd, false );

		if ( appState === CONTROLLER_STATE.MANUAL_ROTATE_DEVICE ) {

			appState = CONTROLLER_STATE.AUTO; // reset control state

			scope.enabled = true;
		}
	}.bind( this );

	// The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

	var setObjectQuaternion = function() {

		var zee = new THREE.Vector3( 0, 0, 1 );
		var euler = new THREE.Euler();
		var q0 = new THREE.Quaternion();
		var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

		return function( quaternion, alpha, beta, gamma, orient ) {

			euler.set( beta, alpha, - gamma, 'YXZ' ); // 'ZXY' for the device, but 'YXZ' for us
			quaternion.setFromEuler( euler ); // orient the device
			quaternion.multiply( q1 ); // camera looks out the back of the device, not the top
			quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) ); // adjust for screen orientation
		}
	}();

	
	this.updateDeviceMove = function () {
		
		var alpha, beta, gamma, orient;
		
		return function () {
			
			if ( scope.enabled === false ) return;

			alpha = scope.deviceOrientation.alpha ? THREE.Math.degToRad( scope.deviceOrientation.alpha ) : 0; // Z
			beta = scope.deviceOrientation.beta ? THREE.Math.degToRad( scope.deviceOrientation.beta ) : 0; // X'
			gamma = scope.deviceOrientation.gamma ? THREE.Math.degToRad( scope.deviceOrientation.gamma ) : 0; // Y''
			orient = scope.screenOrientation ? THREE.Math.degToRad( scope.screenOrientation ) : 0; // O
			setObjectQuaternion( scope.object.quaternion, alpha, beta, gamma, orient );
			this.alpha = alpha;	
		}
	}();

	this.updateManualMove = function () {
				
		var lat, lon;
		var phi, theta;

		var rotation = new THREE.Euler( 0, 0, 0, 'YXZ' );

		var rotQuat = new THREE.Quaternion();
		var objQuat = new THREE.Quaternion();

		var tmpZ, objZ, realZ;

		//var zoomFactor, minZoomFactor = 1; // maxZoomFactor = Infinity

		return function () {
			
			objQuat.copy( tmpQuat );

			if ( appState === CONTROLLER_STATE.MANUAL_ROTATE && !autopositioning ) 
			{	
				lat = ( startY - currentY ) * scrollSpeedY;
				lon = ( startX - currentX ) * scrollSpeedX;

			    phi	 = THREE.Math.degToRad(  - lat );
				theta = THREE.Math.degToRad(  - lon );

				rotQuat.set( 0, Math.sin( theta / 2 ), 0, Math.cos( theta / 2 ) );
				objQuat.multiply( rotQuat );

				rotQuat.set( Math.sin( phi / 2 ), 0, 0, Math.cos( phi / 2 ) ); 
				objQuat.multiply( rotQuat );

				// Remove introduced z-axis rotation and add device's current z-axis rotation
				tmpZ  = rotation.setFromQuaternion( tmpQuat, 'YXZ' ).z;
				objZ  = rotation.setFromQuaternion( objQuat, 'YXZ' ).z;
				realZ = rotation.setFromQuaternion( deviceQuat || tmpQuat, 'YXZ' ).z;

				rotQuat.set( 0, 0, Math.sin( ( realZ - tmpZ  ) / 2 ), Math.cos( ( realZ - tmpZ ) / 2 ) );
				tmpQuat.multiply( rotQuat );

				rotQuat.set( 0, 0, Math.sin( ( realZ - objZ  ) / 2 ), Math.cos( ( realZ - objZ ) / 2 ) );
				objQuat.multiply( rotQuat );

				scope.objectPather.quaternion.copy( objQuat );
			} 
			else if ( appState === CONTROLLER_STATE.MANUAL_ROTATE_DEVICE && !autopositioning ) 
			{				
				if ( !_isHMD ) 
				{
					lat = ( - startY + currentY ) * scrollSpeedY; 
					phi	 = THREE.Math.degToRad( lat );  
				}

				lon = ( startX - currentX ) * scrollSpeedX;				 
				theta = THREE.Math.degToRad( - lon );

				rotQuat.set( 0, Math.sin( theta / 2 ), 0, Math.cos( theta / 2 ) );
				objQuat.multiply( rotQuat );

				if ( !_isHMD ) 
				{
					rotQuat.set( Math.sin( phi / 2 ), 0, 0, Math.cos( phi / 2 ) ); 
					objQuat.multiply( rotQuat );
				}

				// Remove introduced z-axis rotation and add device's current z-axis rotation
				tmpZ  = rotation.setFromQuaternion( tmpQuat, 'YXZ' ).z;
				objZ  = rotation.setFromQuaternion( objQuat, 'YXZ' ).z;
				realZ = rotation.setFromQuaternion( deviceQuat || tmpQuat, 'YXZ' ).z;

				rotQuat.set( 0, 0, Math.sin( ( realZ - tmpZ  ) / 2 ), Math.cos( ( realZ - tmpZ ) / 2 ) );
				tmpQuat.multiply( rotQuat );

				rotQuat.set( 0, 0, Math.sin( ( realZ - objZ  ) / 2 ), Math.cos( ( realZ - objZ ) / 2 ) );
				objQuat.multiply( rotQuat );

				scope.objectPather.quaternion.copy( objQuat );
			}
		};

	}();

	function sendVRInteraction(quat)
	{
		var direction = new THREE.Vector3( 0, 0, -1 );

		direction.applyQuaternion( quat ).normalize();

		interController.checkVRInteraction( _origin, direction );
	}

	var onVRControllerUpdate = function()
	{
		moData.createPointer2();

		var controller = event.detail
		controller.name = "controller"
		/*var axesHelper = new THREE.AxesHelper( 5 );
		controller.add( axesHelper )*/
		scene.add( controller )

		controller.standingMatrix = renderer.vr.getStandingMatrix()

		var
		meshColorOff = 0xDB3236,//  Red.
		meshColorOn  = 0xF4C20D,//  Yellow.
		controllerMaterial = new THREE.MeshStandardMaterial({ color: meshColorOff }),
		controllerMesh = new THREE.Mesh(
			new THREE.CylinderGeometry( 0.005, 0.05, 0.1, 15 ),
			controllerMaterial
		),
		handleMesh = new THREE.Mesh(
			new THREE.BoxGeometry( 0.03, 0.1, 0.03 ),
			controllerMaterial
		)
		
		controllerMaterial.flatShading = true
		controllerMesh.rotation.x = -Math.PI / 2
		handleMesh.position.y = -0.05
		controllerMesh.visible = true
		controllerMesh.add( handleMesh )

		/*var material = new THREE.LineBasicMaterial( { color: 0x7f7f7f } );
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3( 0, 0, 0) );
        geometry.vertices.push(new THREE.Vector3( 0, 1, 0) );
        var line = new THREE.Line( geometry, material );
        line.name = 'controllerline'

		controllerMesh.add( line );*/

		controller.userData.mesh = controllerMesh//  So we can change the color later.

		controllerMesh.scale.set( 0.5,0.5,0.5 );
		controller.add( controllerMesh )

		castShadows( controller )
		receiveShadows( controller )

		controller.addEventListener( 'primary press began', function( event ){
			event.target.userData.mesh.material.color.setHex( meshColorOn )
			sendVRInteraction(event.target.quaternion)
		})
		controller.addEventListener( 'primary press ended', function( event ){
			event.target.userData.mesh.material.color.setHex( meshColorOff )
		})
		controller.addEventListener( 'button_0 press began', function( event ){
			event.target.userData.mesh.material.color.setHex( meshColorOn )
			sendVRInteraction(event.target.quaternion)
		})
		controller.addEventListener( 'button_0 press ended', function( event ){
			event.target.userData.mesh.material.color.setHex( meshColorOff )
		})	
		controller.addEventListener( 'thumbpad press began', function( event ){
			event.target.userData.mesh.material.color.setHex( meshColorOn )
			sendVRInteraction(event.target.quaternion)
		})
		controller.addEventListener( 'thumbpad press ended', function( event ){
			event.target.userData.mesh.material.color.setHex( meshColorOff )
		})	
		controller.addEventListener( 'disconnected', function( event ){
			controller.parent.remove( controller )
		})
	};
	

	this.update = function() {
		
		if (this.isAndroid && !autopositioning && _isHMD) 
		{
			this.updateDeviceMove();		
		}
		else if ( appState !== CONTROLLER_STATE.AUTO ) 
		{
			this.updateManualMove();	
		}

		if ( scene.getObjectByName('controller') )
		{
			var direction = new THREE.Vector3( 0, 0, -1 );
			var contr = scene.getObjectByName('controller');
			var rot = contr.quaternion;

			direction.applyQuaternion( rot ).normalize();

			raycaster.set( _origin, direction );

	        var intersects = raycaster.intersectObjects( interList, true ); // false

	        var dist = intersects[0] ? intersects[0].distance : 50;

	        var direction2 = new THREE.Vector3( 0, 0, -dist );
        	direction2.applyQuaternion(rot)

        	var p2 = scene.getObjectByName('pointer2').children[0];
            if ( p2 )
            {
                p2.position.x = direction2.x;
                p2.position.y = direction2.y;
                p2.position.z = direction2.z;

                p2.scale.set( dist/10,dist/10,dist/10 )
            }
		}
		else {
			var mouse3D = new THREE.Vector3( 0, 0, 0 );
			interController.checkInteraction(mouse3D, scope.object, 'onDocumentMouseMove');
		}

		if (AudioManager.isAmbisonics) AudioManager.updateRotationMatrix( camera.matrixWorld.elements );
	};
	
	this.connect = function() {

		onScreenOrientationChangeEvent();
		
		container.appendChild( domElement );

		window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );	
		window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );	
		window.addEventListener( 'resize', onWindowResize, false );	

		window.addEventListener( 'vr controller connected', onVRControllerUpdate, false);	

		this.element.addEventListener( 'touchstart', this.onDocumentTouchStart, false );
		this.element.addEventListener( 'mousedown', this.onDocumentMouseDown, false );

		document.onkeydown = this.onkeydownStart;

		scope.enabled = true;
	};

	this.disconnect = function() {

		window.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		window.removeEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );
		window.removeEventListener( 'resize', onWindowResize, false );	

		window.removeEventListener( 'vr controller connected', onVRControllerUpdate, false);		

		this.element.removeEventListener( 'touchstart', this.onDocumentTouchStart, false );
		this.element.removeEventListener( 'mousedown', this.onDocumentMouseDown, false );

		scope.enabled = false;
	};

	this.dispose = function() {

		this.disconnect();
	};

	this.connect();
};
