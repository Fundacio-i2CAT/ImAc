/**
 * @author Mugen87 / https://github.com/Mugen87
 */

THREE.DaydreamController = function (object, domElement) {

	THREE.Object3D.call( this );

	this.object = object;

	var scope = this;
	var gamepad;

	var axes = [ 0, 0 ];
	var touchpadIsPressed = false;
	var triggerIsPressed = false;
	var gripsArePressed = false;
	var menuIsPressed = false;
	var angularVelocity = new THREE.Vector3();

	this.element = domElement || document;

	this.matrixAutoUpdate = false;

	

	function findGamepad(callback) {

		// iterate across gamepads as the Daydream Controller may not be
		// in position 0

		var gamepads = navigator.getGamepads && navigator.getGamepads();

		for ( var i = 0; i < 4; i ++ ) {

			var gamepad = gamepads[ i ];

			if ( gamepad && ( gamepad.id === 'Daydream Controller' || 
				gamepad.id === 'Xbox 360 Controller' || 
				gamepad.id === 'OpenVR Gamepad' || 
				gamepad.id === 'Oculus Remote' || 
				gamepad.id.startsWith( 'Gear VR' ) || 
				gamepad.id === 'Gear VR Controller' ||
				/*gamepad.id.startsWith( 'Oculus Touch' ) ||*/ 
				gamepad.id.startsWith( 'Spatial Controller' )) ) {

				callback(gamepad);
				//console.log(gamepad)

				return;// gamepad;

			}
			//else return;

		}
		return;

	}

	this.getGamepad = function () {

		return gamepad;

	};

	this.getTouchPadState = function () {

		return touchpadIsPressed;

	};

	this.update = function () {

		findGamepad(function(gamepad) {

		if ( gamepad !== undefined ) {

			// axes (touchpad)

			if ( axes[ 0 ] !== gamepad.axes[ 0 ] || axes[ 1 ] !== gamepad.axes[ 1 ] ) {

				axes[ 0 ] = gamepad.axes[ 0 ];
				axes[ 1 ] = gamepad.axes[ 1 ];
				scope.dispatchEvent( { type: 'axischanged', axes: axes } );

			}

			// button (touchpad)

			if ( touchpadIsPressed !== gamepad.buttons[ 0 ].pressed ) {
				
				touchpadIsPressed = gamepad.buttons[ 0 ].pressed;
				scope.dispatchEvent( { type: touchpadIsPressed ? 'touchpaddown' : 'touchpadup' } );

			}

			if ( gamepad.buttons[ 1 ] && triggerIsPressed !== gamepad.buttons[ 1 ].pressed ) {

				triggerIsPressed = gamepad.buttons[ 1 ].pressed;
				scope.dispatchEvent( { type: triggerIsPressed ? 'triggerdown' : 'triggerup' } );

			}

			if ( gamepad.buttons[ 2 ] && gripsArePressed !== gamepad.buttons[ 2 ].pressed ) {

				gripsArePressed = gamepad.buttons[ 2 ].pressed;
				scope.dispatchEvent( { type: gripsArePressed ? 'gripsdown' : 'gripsup' } );

			}

			if ( gamepad.buttons[ 3 ] && menuIsPressed !== gamepad.buttons[ 3 ].pressed ) {

				menuIsPressed = gamepad.buttons[ 3 ].pressed;
				scope.dispatchEvent( { type: menuIsPressed ? 'menudown' : 'menuup' } );

			}

			// app button not available, reserved for use by the browser

		} else {

			scope.visible = false;

		}
		});

	};

	this.onDocumentMouseDown = function ( event ) {
		event.preventDefault();

		console.log('onDocumentMouseDown');

		var mouse3D = new THREE.Vector2();
        mouse3D.x = 0;
        mouse3D.y = 0;
				
		//moData.isPausedById(0) ? moData.playAll() : moData.pauseAll();
		interController.checkInteraction(mouse3D, camera, 'onDocumentMouseDown');
		
	}.bind( this );

	this.connect = function() 
	{	

		this.element.addEventListener( 'mousedown', this.onDocumentMouseDown, false );

		scope.enabled = true;

	};

	this.connect();

};

THREE.DaydreamController.prototype = Object.create( THREE.Object3D.prototype );
THREE.DaydreamController.prototype.constructor = THREE.DaydreamController;
