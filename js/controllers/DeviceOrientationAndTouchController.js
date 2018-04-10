//**
//*
//* ImmersiaTV webApp
//*
//* Orientation and touch controllers
//*
//**
THREE.DeviceOrientationAndTouchController = function( object, domElement, renderer) {

	var scope = this;

	this.isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;

	this.object = object;
	this.object.rotation.reorder( "YXZ" );
	
	
	this.element = domElement || document;
	
	var container = document.getElementById( 'container' );

	this.enabled = true;

	this.deviceOrientation = {};
	this.screenOrientation = window.orientation || 0;

	this.alpha = 0;
	this.alphaOffsetAngle = THREE.Math.degToRad(90);
	
	// Manual rotate override components
	var startX = 0, startY = 0,
	    currentX = 0, currentY = 0,
	    scrollSpeedX, scrollSpeedY,
	    tmpQuat = new THREE.Quaternion();
	
	var deviceQuat = new THREE.Quaternion();


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

	var onDeviceOrientationChangeEvent = function( event ) 
	{
		scope.deviceOrientation = event;
	};

	this.onkeydownStart = function ( event ) {
		
		//event.preventDefault();
		//event.stopPropagation();

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
            	moData.isPausedById(0) ? moData.playAll() : moData.pauseAll();
            	break;
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

			alpha = scope.deviceOrientation.alpha ? THREE.Math.degToRad( scope.deviceOrientation.alpha ) + this.alphaOffsetAngle : 0; // Z
			beta = scope.deviceOrientation.beta ? THREE.Math.degToRad( scope.deviceOrientation.beta ) : 0; // X'
			gamma = scope.deviceOrientation.gamma ? THREE.Math.degToRad( scope.deviceOrientation.gamma ) : 0; // Y''
			orient = scope.screenOrientation ? THREE.Math.degToRad( scope.screenOrientation ) : 0; // O
			setObjectQuaternion( scope.object.quaternion, alpha, beta, gamma, orient );
			this.alpha = alpha;
		
		}

	}();
	

	this.update = function() {
		
		if (this.isAndroid) 
		{
			this.updateDeviceMove();		
		}

		if (AudioManager.isAmbisonics) AudioManager.updateRotationMatrix( camera.matrixWorld.elements );
	};
	
	this.connect = function() {

		onScreenOrientationChangeEvent();
		
		container.appendChild( domElement );

		window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );	
		window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );	
		window.addEventListener( 'resize', onWindowResize, false );		

		this.element.addEventListener( 'touchstart', this.onDocumentTouchStart, false );

		document.onkeydown = this.onkeydownStart;

		scope.enabled = true;

	};

	this.disconnect = function() {

		window.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		window.removeEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );
		window.removeEventListener( 'resize', onWindowResize, false );		

		this.element.removeEventListener( 'touchstart', this.onDocumentTouchStart, false );

		scope.enabled = false;

	};

	this.dispose = function() {

		this.disconnect();

	};
	
	this.updateAlphaOffsetAngle = function( angle ) {

		this.alphaOffsetAngle = angle;
		this.update();

	};

	this.connect();

};
