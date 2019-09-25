//**
//*
//* ImmersiaTV webApp
//*
//* Orientation and touch controllers
//*
//**

THREE.DeviceOrientationAndTouchController = function( object, domElement, renderer ) {

	var scope = this;
	var touchtime = 0;
	var touchcount = 0;

	var raycaster = new THREE.Raycaster();
	var interList = [];

	var _origin = new THREE.Vector3( 0.155, 1.21, -0.15 );

	this.isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;
	this.object = object;
	this.object.rotation.reorder( "YXZ" );
	this.element = domElement || document;
	this.enabled = true;
	
	// Manual rotate override components
	var startX = 0, startY = 0,
	    currentX = 0, currentY = 0,
	    scrollSpeedX, scrollSpeedY;

	var CONTROLLER_STATE = {
		AUTO: 0,
		MANUAL_ROTATE: 1,
		MANUAL_ROTATE_DEVICE: 2
	};

	var appState = CONTROLLER_STATE.AUTO;	

	var tmpQuat = new THREE.Quaternion()
	var deviceQuat = new THREE.Quaternion();
	var mouse2D = new THREE.Vector2();
	//var mouse3D = new THREE.Vector3();
    var sliderSelection;
    var tpCache = new Array();

	this.enableManualDrag = true;

	function zoom(n) {
		// Important! ==> [( 0 < camera.fov < 180 )]
		if (camera.fov-n < 10) 
		{
			camera.fov = 10;
		}
		else if (camera.fov-n > 60) 
		{
			camera.fov = 60;
		}
		else 
		{
			camera.fov -= n;
		}
		camera.updateProjectionMatrix();
	}





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
	
	var onWindowResize = function() 
	{	
		object.aspect = window.innerWidth / window.innerHeight;
		object.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	};

	this.onDocumentMouseDown = function ( event ) {

		event.preventDefault();

		/*if ( autopositioning == false ) 
		{
			if ( Date.now() - touchtime > 300 ) touchcount = 0;

			if (touchcount == 0) {
				
				touchcount++;
				touchtime = Date.now();
			}
			else if (touchcount < 1) {
				touchcount++;
			}
			else {
				touchcount = 0;
				menuMgr.initFirstMenuState();
			}
		}*/

		//tmpQuat.copy( scope.objectPather.quaternion );
		tmpQuat.copy( scope.object.quaternion );

		startX = currentX = event.pageX;
		startY = currentY = event.pageY;
			
		//var mouse3D = new THREE.Vector2();
        mouse2D.x = _isHMD ? 0 : ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse2D.y = _isHMD ? 0 : - ( event.clientY / window.innerHeight ) * 2 + 1;
		
		//INTERACTIVITY DETECT
		interController.checkInteraction(mouse2D, scope.object, 'onDocumentMouseDown');
		
		//changing state 
		appState = CONTROLLER_STATE.MANUAL_ROTATE;

		scope.enabled = false;
		
		// Set consistent scroll speed based on current viewport width/height
		scrollSpeedX = ( 1200 / window.innerWidth ) * 0.2;
		scrollSpeedY = ( 800 / window.innerHeight ) * 0.2;

		this.element.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
		this.element.addEventListener( 'mouseup', this.onDocumentMouseUp, false );
		
	}.bind( this );


var _mouseMoved = false;

	this.onDocumentMouseMove = function ( event ) {
		if ( event.pageX != startX && event.pageX != startX )
		{
			_mouseMoved = true;
			currentX = event.pageX;
			currentY = event.pageY;
		}
	}.bind( this );

	this.onDocumentMouseUp = function ( event ) {

		//if ( scene.getObjectByName( "openMenu" ).visible && !_mouseMoved ) menuMgr.initFirstMenuState();
		if ( menuMgr.getMenuType() == 2 && scene.getObjectByName( 'trad-main-menu' ).visible == false && !_mouseMoved ) menuMgr.initFirstMenuState();
		else if ( menuMgr.getMenuType() == 1 && scene.getObjectByName( 'trad-option-menu' ).visible == false && scene.getObjectByName( 'trad-main-menu' ).visible == false && !_mouseMoved ) menuMgr.initFirstMenuState();
		// scene.getObjectByName( 'trad-option-menu' ).visible == false && scene.getObjectByName( 'trad-main-menu' ).visible == false
		_mouseMoved = false;

		this.element.removeEventListener( 'mousemove', this.onDocumentMouseMove, false );
		this.element.removeEventListener( 'mouseup', this.onDocumentMouseUp, false );

		appState = CONTROLLER_STATE.AUTO;

		scope.enabled = true;
		
	}.bind( this );
	
	this.onDocumentTouchStart = function ( event ) {

        enterfullscreen();
		event.preventDefault();
		event.stopPropagation();

		switch ( event.touches.length ) {
			case 1: // ROTATE
			
				if ( this.enableManualDrag !== true ) return;
				if (autopositioning == true) {

					if ( Date.now() - touchtime > 5000 ) touchcount = 0;

					if (touchcount == 0) {
						
						touchcount++;
						touchtime = Date.now();
						navigator.vibrate([100]);
					}
					else if (touchcount < 4) {
						touchcount++;
						navigator.vibrate([50]);
					}
					else {
						navigator.vibrate([500]);
						touchcount = 0;
						disableAutopositioning()
					}
					
				}
				/*else if ( scene.getObjectByName( "openMenu" ).visible ){

					if ( Date.now() - touchtime > 300 ) touchcount = 0;

					if (touchcount == 0) {
						
						touchcount++;
						touchtime = Date.now();
					}
					else if (touchcount < 1) {
						touchcount++;
					}
					else {
						navigator.vibrate([200]);
						touchcount = 0;
						menuMgr.initFirstMenuState();
					}
				}*/
				//touchtime = Date.now();
			
				//var mouse3D = new THREE.Vector2();
				mouse2D.x = _isHMD ? 0 : ( event.touches[0].pageX / window.innerWidth ) * 2 - 1;
                mouse2D.y = _isHMD ? 0 : - ( event.touches[0].pageY / window.innerHeight ) * 2 + 1;
				
				//INTERACTIVITY DETECT
                interController.checkInteraction(mouse2D, scope.object, 'onDocumentMouseDown');

				appState = CONTROLLER_STATE.MANUAL_ROTATE_DEVICE;

				scope.enabled = false;

				//tmpQuat.copy( scope.objectPather.quaternion );
				tmpQuat.copy( scope.object.quaternion );

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

	function disableAutopositioning()
	{
    	subController.disableAutoPositioning();
		autopositioning = false;
		if ( scene.getObjectByName('subtitlesIndicatorNoneButton') ) scene.getObjectByName('subtitlesIndicatorNoneButton').onexecute();
		if ( scene.getObjectByName('signerIndicatorNoneButton') ) scene.getObjectByName('signerIndicatorNoneButton').onexecute();
	}

	this.onkeydownStart = function ( event ) {

		switch ( event.keyCode ) 
		{
			case 27:  // Esc.
				if ( autopositioning ) disableAutopositioning();
				break;

			case 37:  // left
				scope.object.rotation.y += Math.PI/40;
				break;

			case 38:  // up
				if ( scope.object.rotation.x < Math.PI/2 ) scope.object.rotation.x += Math.PI/20;
				break;

			case 39:  // right
				scope.object.rotation.y -= Math.PI/40;
				break;

			case 40:  // down
				if ( scope.object.rotation.x > -Math.PI/2 ) scope.object.rotation.x -= Math.PI/20;
				break;

			case 32:  // space
				VideoController.isPausedById(0) ? _ImAc.doPlay() : _ImAc.doPause();
				break;

			case 49:  // 1
				subController.getSubtitleEnabled() ? subController.disableSubtiles() : subController.enableSubtitles();
				break;

			case 50:  // 2
				subController.getSignerEnabled() ? subController.switchSigner( false ) : subController.switchSigner( true );
				break;

			case 51:  // 3
				camera.fov = camera.fov * 0.5;

				camera.children.forEach( function( e ) 
	        	{
	        		//e.visible = pos == 'left' ? true : false;
	        		e.scale.set( e.scale.x * 0.5, e.scale.x * 0.5, 1)
	            }); 


				camera.updateProjectionMatrix();
				break;

			case 52:  // 4

				if (camera.fov * 2 <= 60) {

					camera.fov = camera.fov * 2;

					camera.children.forEach( function( e ) 
		        	{
		        		//e.visible = pos == 'left' ? true : false;
		        		e.scale.set( e.scale.x * 2, e.scale.x * 2, 1)
		            }); 
					//camera.fovx += 10;
					camera.updateProjectionMatrix();
				}
				break;

			case 77:  // m
				if ( !autopositioning ) {
					//xxx.swichtMenuState();
					if ( scene.getObjectByName( "openMenu" ).visible ) menuMgr.initFirstMenuState();
					else menuMgr.ResetViews();
				}
				break;

			//TEST	
			case 81:
				clearTimeout(timerCloseMenu);
				timerCloseMenu = setTimeout( function(){ menuMgr.ResetViews() }, 5000);
				break;

			default:
				//console.log( event.keyCode )
				break;
		}

	}.bind( this );

	this.onDocumentTouchMove = function ( event ) {

		_mouseMoved = true;

		if ( event.touches.length == 1 )
		{
			currentX = event.touches[ 0 ].pageX;
			currentY = event.touches[ 0 ].pageY;
		}

		else if ( event.touches.length == 2 )
		{
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
				if ( ( tpCache[point1].pageX < tpCache[point2].pageX && (diff1 - diff2) > 0 ) || ( tpCache[point1].pageX > tpCache[point2].pageX && (diff2 - diff1) > 0 ) ) {
					//zoom(Math.trunc((diff1 - diff2)/20));

					if (camera.fov * 0.8 >= 10) {
						camera.fov = camera.fov * 0.8;

						camera.children.forEach( function( e ) 
			        	{
			        		//e.visible = pos == 'left' ? true : false;
			        		e.scale.set( e.scale.x * 0.8, e.scale.x * 0.8, 1)
			            }); 

						camera.updateProjectionMatrix();
					}


				}
				else {
					//zoom(Math.trunc((diff2 - diff1)/20));

					if (camera.fov * 1.25 <= 60) {

						camera.fov = camera.fov * 1.25;

						camera.children.forEach( function( e ) 
			        	{
			        		//e.visible = pos == 'left' ? true : false;
			        		e.scale.set( e.scale.x * 1.25, e.scale.x * 1.25, 1)
			            }); 
						//camera.fovx += 10;
						camera.updateProjectionMatrix();
					}
				}
			}
			else {
				// empty tpCache
				tpCache = new Array();
			}
		}

		/*switch( event.touches.length ) {
			case 1:
				currentX = event.touches[ 0 ].pageX;
				currentY = event.touches[ 0 ].pageY;
				break;

			
		}*/
	}.bind( this );

	this.onDocumentTouchEnd = function ( event ) 
	{
		//if ( scene.getObjectByName( "openMenu" ).visible && !_mouseMoved ) menuMgr.initFirstMenuState();
		if ( menuMgr.getMenuType() == 2 && scene.getObjectByName( 'trad-main-menu' ).visible == false && !_mouseMoved ) menuMgr.initFirstMenuState();
		else if ( menuMgr.getMenuType() == 1 && scene.getObjectByName( 'trad-option-menu' ).visible == false && scene.getObjectByName( 'trad-main-menu' ).visible == false && !_mouseMoved ) menuMgr.initFirstMenuState();
		

		_mouseMoved = false;

		//startAllAudios();		
		tpCache = new Array();
		
		this.element.removeEventListener( 'touchmove', this.onDocumentTouchMove, false );
		this.element.removeEventListener( 'touchend', this.onDocumentTouchEnd, false );

		if ( appState === CONTROLLER_STATE.MANUAL_ROTATE_DEVICE ) {

			appState = CONTROLLER_STATE.AUTO; // reset control state

			scope.enabled = true;
		}
	}.bind( this );

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

			if ( appState === CONTROLLER_STATE.MANUAL_ROTATE && !autopositioning) 
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

				//scope.objectPather.quaternion.copy( objQuat );
				scope.object.quaternion.copy( objQuat );
			} 
			else if ( appState === CONTROLLER_STATE.MANUAL_ROTATE_DEVICE && !autopositioning) 
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

				scope.object.quaternion.copy( objQuat );
			}
		};
	}();

	function sendVRInteraction(quat)
	{
		if ( menuMgr.getMenuType() == 2 && scene.getObjectByName( 'trad-main-menu' ).visible == false ) 
		{
			menuMgr.initFirstMenuState();
		}
		else if ( menuMgr.getMenuType() == 1 && scene.getObjectByName( 'trad-option-menu' ).visible == false && scene.getObjectByName( 'trad-main-menu' ).visible == false ) 
		{
			menuMgr.initFirstMenuState();
		}
		else
		{
			var direction = new THREE.Vector3( 0, 0, -1 );

			direction.applyQuaternion( quat ).normalize();

			interController.checkVRInteraction( _origin, direction );
		}
	}

	var gamepadConnected = false;

	var openmenutimer = 0;
	var openmenuinterval;

	this.onVRControllerUpdate = function( event )
	{
		if ( !gamepadConnected ) 
		{
			gamepadConnected = true;
			_moData.createPointer2(); 

			var controller = event.detail
			controller.name = "controller"

			scene.add( controller )

			controller.standingMatrix = renderer.vr.getStandingMatrix()

			controller.addEventListener( 'primary press began', function( event ){
				//event.target.userData.mesh.material.color.setHex( meshColorOn )
				//startMenuInterval()
				sendVRInteraction(event.target.quaternion)
			})
			controller.addEventListener( 'primary press ended', function( event ){
				//event.target.userData.mesh.material.color.setHex( meshColorOff )
				stopMenuInterval()
			})
			controller.addEventListener( 'button_0 press began', function( event ){
				//event.target.userData.mesh.material.color.setHex( meshColorOn )
				//startMenuInterval()
				sendVRInteraction(event.target.quaternion)
			})
			controller.addEventListener( 'button_0 press ended', function( event ){
				//event.target.userData.mesh.material.color.setHex( meshColorOff )
				stopMenuInterval()
			})	
			controller.addEventListener( 'thumbpad press began', function( event ){
				//event.target.userData.mesh.material.color.setHex( meshColorOn )
				//startMenuInterval()
				sendVRInteraction(event.target.quaternion)
			})
			controller.addEventListener( 'thumbpad press ended', function( event ){
				//event.target.userData.mesh.material.color.setHex( meshColorOff )
				stopMenuInterval()
			})	
			controller.addEventListener( 'disconnected', function( event ){
				controller.parent.remove( controller )
			})
		}
	};

	function startMenuInterval()
	{
		//if ( scene.getObjectByName( "openMenu" ).visible ) menuMgr.initFirstMenuState();
		if ( menuMgr.getMenuType() == 2 && scene.getObjectByName( 'trad-main-menu' ).visible == false ) menuMgr.initFirstMenuState();
		else if ( menuMgr.getMenuType() == 1 && scene.getObjectByName( 'trad-option-menu' ).visible == false && scene.getObjectByName( 'trad-main-menu' ).visible == false ) menuMgr.initFirstMenuState();
		
		/*if ( scene.getObjectByName( "openMenu" ).visible ) {
			openmenuinterval = setInterval(function(){
				openmenutimer++;
				if ( openmenutimer == 3 ) menuMgr.initFirstMenuState();
			}, 1000);
		}
		else {*/
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
		//}
	}

	function stopMenuInterval()
	{
		clearInterval( openmenuinterval );
		openmenutimer = 0;
	}

	

	this.update = function() {
		if (this.isAndroid && !autopositioning && _isHMD) {}
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

        	var pointscale = menuMgr.getMenuType() == 1 ? 3*_pointerSize : 1*_pointerSize;

        	var p2 = scene.getObjectByName('pointer2').children[0];
            if ( p2 )
            {
                p2.position.x = direction2.x;
                p2.position.y = direction2.y;
                p2.position.z = direction2.z;

                p2.scale.set( pointscale*dist/10,pointscale*dist/10,pointscale*dist/10 )
            }

           	if ( scene.getObjectByName( "openMenu" ).visible ) {

				
			}
			//else interController.checkVRHoverInteraction( _origin, direction );

			//else{}
	        if(scene.getObjectByName('trad-option-menu')){
        		interController.checkInteractionSubMenuHover( _origin, direction, true);
	        }
	        
	        if(scene.getObjectByName('trad-main-menu')){
	            interController.showAccessIconTooltip( _origin, direction, true );   
	        }

		}
		else if(_isHMD)
		{
			var mouse3D = new THREE.Vector3( 0, 0, 0 );
			
			interController.checkInteraction( mouse3D, scope.object, 'onDocumentMouseMove' );
		}

		_AudioManager.updateRotationMatrix( camera.matrixWorld.elements );
	};
	
	this.connect = function() 
	{	
		window.addEventListener( 'resize', onWindowResize, false );	
		window.addEventListener( 'vr controller connected', this.onVRControllerUpdate, false);	

		this.element.addEventListener( 'touchstart', this.onDocumentTouchStart, false );
		this.element.addEventListener( 'mousedown', this.onDocumentMouseDown, false );

		document.onkeydown = this.onkeydownStart;

		scope.enabled = true;
	};

	this.disconnect = function() 
	{
		window.removeEventListener( 'resize', onWindowResize, false );	
		window.removeEventListener( 'vr controller connected', this.onVRControllerUpdate, false);		

		this.element.removeEventListener( 'touchstart', this.onDocumentTouchStart, false );
		this.element.removeEventListener( 'mousedown', this.onDocumentMouseDown, false );

		scope.enabled = false;
	};

	this.dispose = function() {

		this.disconnect();
	};

	this.connect();
};