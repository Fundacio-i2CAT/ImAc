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
    var tpCache = new Array();

    var _mouseMoved = false;

	//this.enableManualDrag = true;

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

		tmpQuat.copy( scope.object.quaternion );

		startX = currentX = event.pageX;
		startY = currentY = event.pageY;
			
        mouse2D.x = _isHMD ? 0 : ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse2D.y = _isHMD ? 0 : - ( event.clientY / window.innerHeight ) * 2 + 1;

        menuMgr.setMenuState(scene.getObjectByName('trad-main-menu').visible);
		
		if(!_isHMD){
	        if(scene.getObjectByName('trad-main-menu') && scene.getObjectByName('trad-main-menu').visible) {
		    	interController.checkInteractionVPB( mouse2D, scope.object);   
	        }
	        interController.checkInteractionCanvasElements(mouse2D, scope.object);
		}
	
		//changing state 
		appState = CONTROLLER_STATE.MANUAL_ROTATE;

		scope.enabled = false;
		
		// Set consistent scroll speed based on current viewport width/height
		scrollSpeedX = ( 1200 / window.innerWidth ) * 0.2;
		scrollSpeedY = ( 800 / window.innerHeight ) * 0.2;

		this.element.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
		this.element.addEventListener( 'mouseup', this.onDocumentMouseUp, false );
		
	}.bind( this );


	this.onDocumentMouseMove = function ( event ) {

		// While the user has selected the slider in order to week, no video rotation is posible.
		if ( Math.abs(event.pageX - startX) > 2 && Math.abs(event.pageY -startY) > 2  && !elementSelection){
			_mouseMoved = true;
			currentX = event.pageX;
			currentY = event.pageY;
		}

		mouse2D.x = _isHMD ? 0 : ( event.clientX / window.innerWidth ) * 2 - 1;
    	mouse2D.y = _isHMD ? 0 : - ( event.clientY / window.innerHeight ) * 2 + 1;

    	raycaster.setFromCamera(  mouse2D, scope.object );

    	if(elementSelection){
	 		if(elementSelection.name.localeCompare('slider-progress') == 0){
				//This function updates the position of the slider after been clicked and during the mousemmove event.
				mainMenuCtrl.updatePositionOnMove(raycaster, elementSelection);
			} else if(elementSelection.name.localeCompare('radar') == 0 || elementSelection.name.localeCompare('signer') == 0 ||  elementSelection.name.localeCompare('subtitles') == 0){
	            interController.checkInteractionGrid(raycaster, mouse2D);
	    	}
    	}

		
	}.bind( this );

	this.onDocumentMouseUp = function ( event ) {
		if(Math.abs(event.pageX - startX) < 2 && Math.abs(event.pageY -startY) < 2) _mouseMoved  = false;
		if ( _blockControls ) initExtraAdAudio();

		if(elementSelection){
			//CODE DUPLICATES LOWER
			if(actionPausedVideo) mainMenuCtrl.playAllFunc();		
			switch(elementSelection.name){
				case 'slider-progress':
					mainMenuCtrl.setSlidingStatus(false);
					mainMenuCtrl.onSlideSeek();
					break;
				case'radar':
					canvas.getObjectByName('rdr-colorFrame').visible = false;
	            	localStorage.setItem("rdrPosition", JSON.stringify(elementSelection.position));
					break;
				case'signer':
					canvas.getObjectByName('sl-colorFrame').visible = false;
            		localStorage.setItem("slPosition", JSON.stringify(elementSelection.position));
					break;
				case'subtitles':
					canvas.getObjectByName('st-colorFrame').visible = false;
					localStorage.setItem("stPosition", JSON.stringify(elementSelection.position));
		            //This will remove the checkmark so all optins of st position are available.
					break;
			}
			menuMgr.checkMenuStateVisibility();
			//canvas.getObjectByName('cnv-fov').visible = false;
			elementSelection = null;
		} else {
			interController.checkInteraction(mouse2D, scope.object, _mouseMoved);
		}
		
		this.element.removeEventListener( 'mousemove', this.onDocumentMouseMove, false );
		this.element.removeEventListener( 'mouseup', this.onDocumentMouseUp, false );

		appState = CONTROLLER_STATE.AUTO;

		scope.enabled = true;
		
	}.bind( this );
	

	this.onkeydownStart = function ( event ) {

		switch ( event.keyCode ) 
		{
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
				stConfig.isEnabled ? _stMngr.switchSubtitles( false ) : _stMngr.switchSubtitles( true );
				break;

			case 50:  // 2
				slConfig.isEnabled ? _slMngr.switchSigner( false ) : _slMngr.switchSigner( true );
				break;

			case 51:  // 3

				doZoom( 'in' );

				break;

			case 52:  // 4

				doZoom( 'out' );

				break;

			case 77:  // m
				if ( !autopositioning ) {
					if (scene.getObjectByName( "openMenu" ) && scene.getObjectByName( "openMenu" ).visible ) menuMgr.initFirstMenuState();
					else menuMgr.ResetViews();
				}
				break;
				
			default:
				//console.log( event.keyCode )
				break;
		}

	}.bind( this );

	this.onDocumentTouchStart = function ( event ) {
        enterfullscreen();
		event.preventDefault();
		event.stopPropagation();

		switch ( event.touches.length ) {
			case 1: // ROTATE
						
				mouse2D.x = _isHMD ? 0 : ( event.touches[0].pageX / window.innerWidth ) * 2 - 1;
                mouse2D.y = _isHMD ? 0 : - ( event.touches[0].pageY / window.innerHeight ) * 2 + 1;

                if(scene.getObjectByName('trad-main-menu') && scene.getObjectByName('trad-main-menu').visible) {
			    	interController.checkInteractionVPB( mouse2D, scope.object);   
		        }

				appState = CONTROLLER_STATE.MANUAL_ROTATE_DEVICE;

				scope.enabled = false;

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


	this.onDocumentTouchMove = function ( event ) {

		const dpi = window.devicePixelRatio;
		let difX = Math.abs( Math.round((startX - event.touches[0].pageX)/dpi));
		let difY = Math.abs( Math.round(( startY - event.touches[ 0 ].pageY)/dpi)); 

		if ( difX > 1 && difY > 1 && !elementSelection){
			_mouseMoved = true;	
			if ( event.touches.length == 1 ){
				currentX = event.touches[ 0 ].pageX;
				currentY = event.touches[ 0 ].pageY;
			}
		} 

		mouse2D.x = _isHMD ? 0 : ( event.touches[0].pageX / window.innerWidth ) * 2 - 1;
        mouse2D.y = _isHMD ? 0 : - ( event.touches[0].pageY / window.innerHeight ) * 2 + 1;

    	raycaster.setFromCamera(  mouse2D, scope.object );

    	if(elementSelection){
	 		if(elementSelection.name.localeCompare('slider-progress') == 0){
				//This function updates the position of the slider after been clicked and during the mousemmove event.
				mainMenuCtrl.updatePositionOnMove(raycaster, elementSelection);
			} 
    	}



	}.bind( this );

	this.onDocumentTouchEnd = function ( event ) {
		if ( _blockControls ){
			initExtraAdAudio();
		} 

		if(elementSelection){
	 		if(elementSelection.name.localeCompare('slider-progress') == 0){
				mainMenuCtrl.setSlidingStatus(false);
				mainMenuCtrl.onSlideSeek();
			}
			elementSelection = null;
		} else {
			interController.checkInteraction(mouse2D, scope.object, _mouseMoved);
		}
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

		let lat, lon;
		let phi, theta;
		let rotation = new THREE.Euler( 0, 0, 0, 'YXZ' );
		let rotQuat = new THREE.Quaternion();
		let objQuat = new THREE.Quaternion();
		let tmpZ, objZ, realZ;

		return function () {
			
			objQuat.copy( tmpQuat );

			if ( appState === CONTROLLER_STATE.MANUAL_ROTATE && !autopositioning) {	
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
			} else if ( appState === CONTROLLER_STATE.MANUAL_ROTATE_DEVICE && !autopositioning) {				
				if ( !_isHMD ) {
					lat = ( - startY + currentY ) * scrollSpeedY; 
					phi	 = THREE.Math.degToRad( lat );  
				}

				lon = ( startX - currentX ) * scrollSpeedX;				 
				theta = THREE.Math.degToRad( - lon );

				rotQuat.set( 0, Math.sin( theta / 2 ), 0, Math.cos( theta / 2 ) );
				objQuat.multiply( rotQuat );

				if ( !_isHMD ) {
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

	function sendVRInteraction(quat){
		if (_blockControls){
			initExtraAdAudio();
		/*else if ( menuMgr.getMenuType() == 2 && scene.getObjectByName( 'trad-main-menu' ).visible == false ) {
			menuMgr.initFirstMenuState();
		}else if ( menuMgr.getMenuType() == 1 && scene.getObjectByName( 'trad-option-menu' ).visible == false && scene.getObjectByName( 'trad-main-menu' ).visible == false ) {
			menuMgr.initFirstMenuState();*/
		} else {
			menuMgr.setMenuState(scene.getObjectByName('trad-main-menu').visible);
			var direction = new THREE.Vector3( 0, 0, -1 );

			direction.applyQuaternion( quat ).normalize();

	    	interController.checkInteractionVPB( _origin, direction);

        	if(canvas.getObjectByName('radar').visible || canvas.getObjectByName('signer') || canvas.getObjectByName('subtitles')){
        		interController.checkInteractionCanvasElements( _origin, direction);
        	}

			interController.checkInteraction( _origin, direction, false);
		}
	}

	var gamepadConnected = false;

	var openmenutimer = 0;
	var openmenuinterval;

	this.onVRControllerUpdate = function( event ){
		if ( !gamepadConnected ) {
			gamepadConnected = true;
			_moData.createPointer2(); 

			var controller = event.detail
			controller.name = "controller"

			scene.add( controller )

			controller.standingMatrix = renderer.vr.getStandingMatrix()

			controller.addEventListener( 'primary press began', function( event ){
				sendVRInteraction(event.target.quaternion)
			})
			controller.addEventListener( 'primary press ended', function( event ){

				if (elementSelection){
					if( elementSelection.name.localeCompare('slider-progress') == 0 ){
						mainMenuCtrl.setSlidingStatus(false);
						mainMenuCtrl.onSlideSeek();
					} else if( elementSelection.name.localeCompare('radar') == 0 ){
						camera.getObjectByName('rdr-colorFrame').visible = false;
						localStorage.setItem("rdrPosition", JSON.stringify(elementSelection.position));
					} else if(elementSelection.name.localeCompare('signer') == 0){
						canvas.getObjectByName('sl-colorFrame').visible = false;
			            localStorage.setItem("slPosition", JSON.stringify(elementSelection.position));
					}
					//canvas.getObjectByName('cnv-fov').visible = false;
					menuMgr.checkMenuStateVisibility();
					elementSelection = null;
				} 
			})
			controller.addEventListener( 'button_0 press began', function( event ){
				sendVRInteraction(event.target.quaternion)
			})
			controller.addEventListener( 'button_0 press ended', function( event ){
				if (elementSelection){
					if( elementSelection.name.localeCompare('slider-progress') == 0) {
						mainMenuCtrl.setSlidingStatus(false);
						mainMenuCtrl.onSlideSeek();
					} else if(elementSelection.name.localeCompare('radar') == 0){
						canvas.getObjectByName('rdr-colorFrame').visible = false;
						localStorage.setItem("rdrPosition", JSON.stringify(elementSelection.position));
					} else if(elementSelection.name.localeCompare('signer') == 0){
						canvas.getObjectByName('sl-colorFrame').visible = false;
			            localStorage.setItem("slPosition", JSON.stringify(elementSelection.position));
					}
					//canvas.getObjectByName('cnv-fov').visible = false;
					menuMgr.checkMenuStateVisibility();
					elementSelection = null;
				} 
			})	
			controller.addEventListener( 'thumbpad press began', function( event ){
				sendVRInteraction(event.target.quaternion)
			})
			controller.addEventListener( 'thumbpad press ended', function( event ){
				if (elementSelection){
					if( elementSelection.name.localeCompare('slider-progress') == 0) {
						mainMenuCtrl.setSlidingStatus(false);
						mainMenuCtrl.onSlideSeek();
					}else if(elementSelection.name.localeCompare('radar') == 0){
						canvas.getObjectByName('rdr-colorFrame').visible = false;
						localStorage.setItem("rdrPosition", JSON.stringify(elementSelection.position));
					} else if(elementSelection.name.localeCompare('signer') == 0){
						canvas.getObjectByName('sl-colorFrame').visible = false;
			            localStorage.setItem("slPosition", JSON.stringify(elementSelection.position));
					}
					//canvas.getObjectByName('cnv-fov').visible = false;
					menuMgr.checkMenuStateVisibility();
					elementSelection = null;
				}  
			})	
			controller.addEventListener( 'disconnected', function( event ){
				controller.parent.remove( controller )
			})
		}
	};
	

	this.update = function() {
		if (this.isAndroid){
	        if(scene.getObjectByName('trad-main-menu')){
	        	scene.getObjectByName('slider-progress').visible = true;
	        }	
		}
		
		if (this.isAndroid && !autopositioning && _isHMD) {

		} else if ( appState !== CONTROLLER_STATE.AUTO ) {
			this.updateManualMove();	
		}

		if ( scene.getObjectByName('controller') ){
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
            if ( p2 ){
                p2.position.x = direction2.x;
                p2.position.y = direction2.y;
                p2.position.z = direction2.z;

                p2.scale.set( pointscale*dist/10,pointscale*dist/10,pointscale*dist/10 )
            }
            
	        if(scene.getObjectByName('trad-option-menu')){
        		interController.checkInteractionSubMenuHover( _origin, direction);
	        }
	        
	        if(scene.getObjectByName('trad-main-menu')){
	            interController.accessIconsHoverOver( _origin, direction);  
	            interController.vpbHoverOver( _origin, direction );
	        }

	        if(elementSelection){
		        if( elementSelection.name.localeCompare('slider-progress') == 0){
					mainMenuCtrl.updatePositionOnMove(raycaster, elementSelection);
		        } else if( elementSelection.name.localeCompare('radar') == 0 || elementSelection.name.localeCompare('signer') == 0){
		            interController.checkInteractionGrid(raycaster, mouse2D);
		    	}
	        }
		} else if(_isHMD){
			var mouse3D = new THREE.Vector3( 0, 0, 0 );

			//interController.checkInteraction( mouse3D, scope.object, true );
		}

		_AudioManager.updateRotationMatrix( camera.matrixWorld.elements );
	};
	
	this.connect = function() {	
		window.addEventListener( 'resize', onWindowResize, false );	
		window.addEventListener( 'vr controller connected', this.onVRControllerUpdate, false);	

		this.element.addEventListener( 'touchstart', this.onDocumentTouchStart, false );
		this.element.addEventListener( 'mousedown', this.onDocumentMouseDown, false );

		document.onkeydown = this.onkeydownStart;

		scope.enabled = true;
	};

	this.disconnect = function() {
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
