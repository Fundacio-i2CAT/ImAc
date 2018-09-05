/**
 * @author mrdoob / http://mrdoob.com
 * @author Mugen87 / https://github.com/Mugen87
 *
 * Based on @tojiro's vr-samples-utils.js
 */

/*var WEBVR = {

	createButton: function ( renderer ) {

		function showEnterVR( display ) {

			button.style.display = '';

			button.style.cursor = 'pointer';
			button.style.left = 'calc(50% - 50px)';
			button.style.width = '100px';

			button.textContent = 'ENTER VR!';

			button.onmouseenter = function () { button.style.opacity = '1.0'; };
			button.onmouseleave = function () { button.style.opacity = '0.5'; };

			button.onclick = function () {

				display.isPresenting ? display.exitPresent() : display.requestPresent( [ { source: renderer.domElement } ] ).then(function () { isVRtested=true; startAllVideos(); });

			};

			renderer.vr.setDevice( display );

		}

		function showVRNotFound() {

			button.style.display = '';

			button.style.cursor = 'auto';
			button.style.left = 'calc(50% - 75px)';
			button.style.width = '150px';

			button.textContent = 'VR NOT FOUND';

			button.onmouseenter = null;
			button.onmouseleave = null;

			button.onclick = null;

			renderer.vr.setDevice( null );

		}

		function stylizeElement( element ) {

			element.style.position = 'absolute';
			element.style.bottom = '200px';
			element.style.padding = '12px 6px';
			element.style.border = '1px solid #fff';
			element.style.borderRadius = '4px';
			element.style.background = 'transparent';
			element.style.color = '#fff';
			element.style.font = 'normal 13px sans-serif';
			element.style.textAlign = 'center';
			element.style.opacity = '0.5';
			element.style.outline = 'none';
			element.style.zIndex = '999';

		}

		if ( 'getVRDisplays' in navigator ) {

			var button = document.createElement( 'button' );
			button.style.display = 'none';

			stylizeElement( button );

			window.addEventListener( 'vrdisplayconnect', function ( event ) {

				showEnterVR( event.display );

			}, false );

			window.addEventListener( 'vrdisplaydisconnect', function ( event ) {

				showVRNotFound();

			}, false );

			window.addEventListener( 'vrdisplaypresentchange', function ( event ) {
				
				//if (!event.display.isPresenting) window.history.back();
				if (event.display) {
					button.textContent = event.display.isPresenting ? 'EXIT VR' : 'ENTER VR';

					if (!event.display.isPresenting) location.reload();
				}

			}, false );

			window.addEventListener( 'vrdisplayactivate', function ( event ) {

				event.display.requestPresent( [ { source: renderer.domElement } ] ).then(function () { isVRtested = true; startAllVideos(); });

			}, false );

			navigator.getVRDisplays()
				.then( function ( displays ) {

					if ( displays.length > 0 ) {

						showEnterVR( displays[ 0 ] );

					} else {
						alert('WEBVR NOT SUPPORTED');
						location.reload();
						//showVRNotFound();

					}

				} );

			return button;

		} else {

			var message = document.createElement( 'a' );
			message.href = 'https://webvr.info';
			message.innerHTML = 'WEBVR NOT SUPPORTED';

			message.style.left = 'calc(50% - 90px)';
			message.style.width = '180px';
			message.style.textDecoration = 'none';

			stylizeElement( message );

			return message;

		}

	},

	// DEPRECATED

	checkAvailability: function () {
		console.warn( 'WEBVR.checkAvailability has been deprecated.' );
		return new Promise( function () {} );
	},

	getMessageContainer: function () {
		console.warn( 'WEBVR.getMessageContainer has been deprecated.' );
		return document.createElement( 'div' );
	},

	getButton: function () {
		console.warn( 'WEBVR.getButton has been deprecated.' );
		return document.createElement( 'div' );
	},

	getVRDisplay: function () {
		console.warn( 'WEBVR.getVRDisplay has been deprecated.' );
	}

};*/



var WEBVR = {

	button1: undefined,
	button2: undefined,

	createButton: function ( renderer ) {

		function showEnterVR( display ) {

			button.style.display = '';

			button.style.cursor = 'pointer';
			button.style.left = 'calc(50% - 110px)';
			button.style.width = '100px';

			button.textContent = 'ENTER VR!';

			button.onmouseenter = function () { button.style.opacity = '1.0'; };
			button.onmouseleave = function () { button.style.opacity = '0.5'; };

			button.onclick = function () {

				//button1.style.display = 'none';
				//button2.style.display = 'none';

				//ppMMgr.playAll();

				//controls = new THREE.DeviceOrientationAndTouchController( camera, CameraParentObject, renderer.domElement, renderer );

				display.isPresenting ? display.exitPresent() : display.requestPresent( [ { source: renderer.domElement } ] ).then(
					function () { 
						//gamepad = new THREE.DaydreamController( camera, renderer.domElement );
						isVRtested=true; 
						_isHMD = true; 							
					});
			};

			renderer.vr.setDevice( display );
		}

		if ( 'getVRDisplays' in navigator ) {

			var button = document.createElement( 'button' );
			button.style.display = 'none';

			stylizeElement( button );

			window.addEventListener( 'vrdisplayconnect', function ( event ) {

				showEnterVR( event.display );

			}, false );

			window.addEventListener( 'vrdisplaypresentchange', function ( event ) {
				
				//if (!event.display.isPresenting) window.history.back();
				if (event.display) {
					button.textContent = event.display.isPresenting ? 'EXIT VR' : 'ENTER VR';

					if (!event.display.isPresenting) location.reload();
				}

			}, false );

			window.addEventListener( 'vrdisplayactivate', function ( event ) {

				event.display.requestPresent( [ { source: renderer.domElement } ] ).then(function () { isVRtested = true; startAllVideos(); });

			}, false );


			navigator.getVRDisplays()
				.then( function ( displays ) {

					_display = displays;

					if ( displays.length > 0) 
					{
						showEnterVR( displays[ 0 ] );
					}
					else
					{
						controls = new THREE.DeviceOrientationAndTouchController( camera, CameraParentObject, renderer.domElement, renderer );
					}
				} );

			button1 = button;

			return button;

		}
	},

	createButton2: function ( renderer ) {

		function showEnterVR() {

			button.style.display = '';

			button.style.cursor = 'pointer';
			button.style.left = 'calc(50% + 10px)';
			button.style.width = '100px';

			button.textContent = 'NO ENTER VR!';

			button.onmouseenter = function () { button.style.opacity = '1.0'; };
			button.onmouseleave = function () { button.style.opacity = '0.5'; };

			button.onclick = function () {

				button1.style.display = 'none';
				button2.style.display = 'none';

				ppMMgr.playAll();

				controls = new THREE.DeviceOrientationAndTouchController( camera, CameraParentObject, renderer.domElement, renderer );
				
				isVRtested=true; 
				//startAllVideos(); 
				_isHMD = false; 

			};
		}

		var button = document.createElement( 'button' );
		button.style.display = 'none';

		stylizeElement( button );


		if ( 'getVRDisplays' in navigator ) {

			navigator.getVRDisplays().then( function ( displays ) 
			{
				if ( displays.length > 0) 
				{
					showEnterVR();
				}
			} );

			button2 = button;

			return button;
		}

	}
};


function stylizeElement( element ) 
{
	element.style.position = 'absolute';
	element.style.bottom = '200px';
	element.style.padding = '12px 6px';
	element.style.border = '1px solid #fff';
	element.style.borderRadius = '4px';
	element.style.background = 'transparent';
	element.style.color = '#fff';
	element.style.font = 'normal 13px sans-serif';
	element.style.textAlign = 'center';
	element.style.opacity = '0.5';
	element.style.outline = 'none';
	element.style.zIndex = '999';
}