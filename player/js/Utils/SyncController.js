/**
 * @author isaac.fraile@i2cat.net
 */

/************************************************************************************
	
	SyncController.js  
		* Library used to manage Subtitle and Signer elements

	This library needs to use external libs:
		* VideoController.js         -->  To sync all the video contents and get the current media time ( syncAllContents(speed, diff) , getMediaTime() )
		* Clock.js

	This library needs to use the global vars:
		* demoId
		* VideoController
		* localStorage.ImAc_init
		* SysClock
	
	FUNCTIONALITIES:
		* init = function( ip )    --> Initialize the sync connections
		* vc = function( action, time )  --> Used to do play, pause and seek synchronously

************************************************************************************/

SyncController = function() {

	var clock = new SysClock();
	var first_entry = true;
	//var server;
	//var isMaster = false;

	var _tsUrl;
	var _wcUrl;
	var _csUrl;

	var _roomID = 23;

	/**
	 * Initialize the library
	 *
	 * @param  {ip}
	*/
	this.init = function( ip, rid=24 )
	{
		first_entry = true;
		connection_CII( 'ws://' + ip + ':4649/' + rid + '/dvbcsscii' );
		//connection_NEW( 'ws://' + ip + ':4649/new' );
	};

	this.room = function()
	{
		//connection_NEW( '192.168.10.128' );
		connection_NEW( '195.81.194.222' );
	}

	/**
	 * Function used to do Play, Pause and Seek actions synchronously
	 *
	 * @param  {string}
	 * @param  {integer}
	*/
	this.vc = function( action, time )
	{
		if ( _csUrl ) 
		{
			var cs_ws = new WebSocket( _csUrl );
			cs_ws.onopen = function() {
				var json = {
					action: action,
					actionTime: time
				};
				cs_ws.send( JSON.stringify( json ) );
				cs_ws.close();
			};
		}
	};

	/**
	 * Initialize the DVB-CSS-CII connection and stay listening
	 * When receive a message initializes the url of each active service
	 *
	 * @param  {url}
	*/
	function connection_CII(ws_url)
	{
		var cii_ws = new WebSocket( ws_url );

		cii_ws.onmessage = function(message) 
		{
			var data = JSON.parse( message.data );

			console.log( data );

			_tsUrl = data.tsUrl;
			_csUrl = data.private[0].contentSetterUrl;
			_wcUrl = data.private[0].wsClockUrl;

			data.contentId ? checkContent( data.contentId ) : setContent( _csUrl );
		}
	}

	/**
	 * Checks if the content setted is the same that the content selected
	 * Checks if this is the first entry to initilize the sync. services
	 *
	 * @param  {string}
	*/
	function checkContent( contentId )
	{
		if ( demoId != contentId ) 
		{
			if ( first_entry ) setContent( _csUrl ); 
			else 
			{ 
				localStorage.ImAc_init = contentId;
				window.location = window.location.origin + window.location.pathname + '#' + localStorage.ImAc_init;
			}
		}

		if ( first_entry )	
		{
			sync_WC( _wcUrl );
			connection_TS( _tsUrl );
			first_entry = false;
		}
	}

	/**
	 * Set a new content on the synchronize server using a websocket connection
	 *
	 * @param  {url}
	*/
	function setContent( ws_url )
	{
		var cs_ws = new WebSocket( ws_url );

		cs_ws.onopen = function() 
		{
			var json = { contentId: demoId };

			cs_ws.send( JSON.stringify( json ) );
			cs_ws.close();
		};
	}

	/**
	 * Initialize the WallClock connection and stay listening
	 * Used to sinchronize the clock time
	 * This function checks the WC time every 5 seconds
	 * When receive a websocket message, checks and sync the clock
	 *
	 * @param  {url}
	*/
	function sync_WC( ws_url )
	{
		var wc_ws = new WebSocket( ws_url );

		wc_ws.onopen = function() 
		{
			getWC( wc_ws, 5000 ); // get wallclock time every X seconds, en aquest cas cada 5 segons
		};

		wc_ws.onmessage = function( message ) 
		{
			var t4 = clock.time;
			var wc_msg = JSON.parse( message.data );
			var offset = ( ( wc_msg.t3 + wc_msg.t2 ) - ( t4 + wc_msg.t1 ) )/2;
			var RTT = ( ( t4 - wc_msg.t1 ) - ( wc_msg.t3 - wc_msg.t2 ) )/2;
			var ajustment = offset - RTT;

			clock.ajustOffset = ( ajustment >= 2000000 || ajustment <= -2000000 ) ? ajustment : 0;  //+- 2ms 
		};
	}

	/**
	 * Initialize the DVB-CSS-TS connection and stay listening
	 * When receive a websocket message, checks and sync all contents
	 *
	 * @param  {url}
	*/
	function connection_TS( ws_url )
	{
		ts_ws = new WebSocket( ws_url );

		var delay = 0;
		var syncoffset = 0;

		ts_ws.onopen = function() 
		{
			var json = {
				contentIdStem: 'this:is:new:stem',
				timelineSelector: 'this:is:new:timeline:selector'
			};
			ts_ws.send( JSON.stringify( json ) );
		};
		
		ts_ws.onmessage = function(message) 
		{ 
			var data = JSON.parse( message.data );
			var serverCT = data.contentTime / 1000000000;		
			var serverWC = data.wallClockTime / 1000000000;
			var dif = serverWC - serverCT - clock.time/1000000000 + VideoController.getMediaTime() - syncoffset;

			VideoController.syncAllContents( data.timelineSpeedMultiplier, dif );
		};
	}

	/**
	 * Send a websocket message with the WC params (clock time)
	 *
	 * @param  {websocket}
	 * @param  {integer}
	*/
	function getWC( wc_ws, millis ) 
	{
		var startTime = clock.time;
		wc_ws.send( JSON.stringify( startTime ) );
		var wcsettimeout = setTimeout(function() {
			getWC( wc_ws, millis );
		}, millis);
	}	

	function connection_LOG( ws_url ) 
	{
		var cs_ws = new WebSocket( ws_url );
		cs_ws.onopen = function() 
		{
			cs_ws.send( JSON.stringify( scene.children ) );
		};
	}




	function connection_NEW(ip)
	{
		var cii_ws = new WebSocket( 'ws://' + ip + ':4649/new' );

		cii_ws.onmessage = function(message) 
		{
			_roomID = message.data;
			console.log( _roomID );
			_Sync.init( ip, _roomID )
		}
	}
}