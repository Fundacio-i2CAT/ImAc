

SyncController = function() {

	var clock = new SysClock();
	var server;
	var isMaster = false;

	this.init = function()
	{
		//findServer(); --> startNewSession( UUID ) // findSession( UUID )

		//connection_CII();

		setContent( 'ws://192.168.10.128:4649/cs' );

		sync_WC( 'ws://192.168.10.128:4649/wc' );

		connection_TS( 'ws://192.168.10.128:4649/dvbcssts' );

		//connection_LOG( 'ws://192.168.10.128:4649/log' )
	}

	this.vc = function ( action, time )
	{
		var cs_ws = new WebSocket( 'ws://192.168.10.128:4649/cs' );
		cs_ws.onopen = function() {
			var json = {
				action: action,
				actionTime: time
			};
			cs_ws.send( JSON.stringify( json ) );
			cs_ws.close();
		};
	}

	function connection_LOG( ws_url ) 
	{
		var cs_ws = new WebSocket( ws_url );
		cs_ws.onopen = function() {
			cs_ws.send( JSON.stringify( scene.children ) );
		};
	}

	function setContent( ws_url )
	{
		var cs_ws = new WebSocket( ws_url );
		cs_ws.onopen = function() {

			var json = {
				contentId: list_contents[demoId].url
			};
			cs_ws.send( JSON.stringify( json ) );
			cs_ws.close();
		};
	}

	function sync_WC( ws_url )
	{
		var wc_ws = new WebSocket( ws_url );
		//active_sockets.push( wc_ws );

		wc_ws.onopen = function() {
			getWC( wc_ws, 5000 ); // get wallclock time every X seconds, en aquest cas cada 5 segons
		};

		wc_ws.onmessage = function( message ) 
		{
			var t4 = clock.time;
			var wc_msg = JSON.parse( message.data );
			//console.log(wc_msg)
			var offset = ( ( wc_msg.t3 + wc_msg.t2 ) - ( t4 + wc_msg.t1 ) )/2;
			var RTT = ( ( t4 - wc_msg.t1 ) - ( wc_msg.t3 - wc_msg.t2 ) )/2;
			var ajustment = offset - RTT;

			clock.ajustOffset = ( ajustment >= 2000000 || ajustment <= -2000000 ) ? ajustment : 0;  //+- 2ms 
		};
	}

	function connection_TS( ws_url )
	{
		ts_ws = new WebSocket( ws_url );
		//startContentTime = (wallClock.getTicks() / 1000000000);

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

	function getWC( wc_ws, millis ) 
	{
		var startTime = clock.time;
		wc_ws.send( JSON.stringify( startTime ) );
		var wcsettimeout = setTimeout(function() {
			getWC( wc_ws, millis );
		}, millis);
	}	
}