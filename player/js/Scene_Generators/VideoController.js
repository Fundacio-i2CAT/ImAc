/**
 * @author isaac.fraile@i2cat.net
 */

 // This library needs to use the dash.all.min.js and hls.js functions

VideoController = function() {

	var listOfVideoContents = [];
    var listOfAudioContents = [];
    var ft = true;

//************************************************************************************
// Private Functions
//************************************************************************************

	function getMediaType(url)
    {
        return url.split('.').pop();
    }

    function syncVideos()
    {
    	var mainVideoTime = listOfVideoContents[0].vid.currentTime;
    	listOfVideoContents.forEach( function( elem ) { elem.vid.currentTime = mainVideoTime } ); 
        listOfAudioContents.forEach( function( elem ) { elem.currentTime = mainVideoTime } ); 
    }

    function setBitrateLimitationsFor(player)
    {
    	if ( window.screen.width * window.devicePixelRatioh <= 1920 ) 
        {
            player.setMaxAllowedBitrateFor( 'video', 13000 );
        }
        else if ( window.screen.width * window.devicePixelRatio <= 2300 ) 
        {
            player.setMaxAllowedBitrateFor( 'video', 15000 );
        }
    }

    function createDashVO(id, vid, url, autoplay)
    {
    	var player = dashjs.MediaPlayer().create();
        player.initialize( vid, url, autoplay );

        setBitrateLimitationsFor( player );

        player.getDebug().setLogToBrowserConsole( false );
        
        var objVideo = { id: id, vid: vid, dash: player };
        listOfVideoContents.push( objVideo );
    }

    function createHLSVO(id, vid, url)
    {
    	if ( Hls.isSupported() ) 
        {
            var hls = new Hls();
            hls.loadSource( url );
            hls.attachMedia( vid );
            hls.on( Hls.Events.MANIFEST_PARSED, function() { vid.play() } );
            var objVideo = { id: id, vid: vid };
        }
        else
        {
            vid.src = url;

            if ( vid.canPlayType( 'application/vnd.apple.mpegurl' ) )  
            {
            	vid.addEventListener( 'loadedmetadata', function() { vid.play() } );
            }
            var objVideo = { id: id, vid: vid };
        }
        
        listOfVideoContents.push( objVideo );
    }

    function getAdaptationSets()
    {
        return new Promise((resolve) => {

            listOfVideoContents[0].dash.on( dashjs.MediaPlayer.events.PLAYBACK_STARTED, function() {

                if ( ft ) 
                {
                    ft = false;
                    _ManifestParser.init( listOfVideoContents[0].dash.geti2catMPD() );
                }

                resolve( 'ok' );
            });   
        });
    }

//************************************************************************************
// Public Functions
//************************************************************************************

	this.getVideObject = function(id, url) 
    {
        var vid = document.createElement( "video" );     
        vid.muted = true;
        vid.autoplay = listOfVideoContents[0] && listOfVideoContents[0].vid.paused ? false : true;
        vid.preload = "auto"; 
        vid.loop = true;

        var type = getMediaType( url );

        if ( type == 'mpd' )
        {   
            createDashVO( id, vid, url, vid.autoplay );
        }
        else if ( type == 'm3u8' )
        {
            createHLSVO( id, vid, url );          
        }
        else
        {
            vid.src = url;
            var objVideo = { id: id, vid: vid };
            listOfVideoContents.push( objVideo );
        }

        return vid;
    };

    this.getListOfVideoContents = function()
    {
        return listOfVideoContents;
    };

    this.removeContentById = function(id)
    {
        for ( var i = 0, len = listOfVideoContents.length; i < len; i++ )
        {
            if ( listOfVideoContents[i].id == id )
            {
                listOfVideoContents.splice( i, 1 );
                break;
            }
        }
    };

    this.getPlayoutTime = function(secs) 
    {
        var hr  = Math.floor( secs/3600 );
        var min = Math.floor( ( secs - ( hr*3600 ) )/60 );
        var sec = Math.floor( secs - ( hr*3600 ) -  ( min*60 ) );

        if ( min < 10 ) min = "0" + min;
        if ( sec < 10 ) sec  = "0" + sec;
        return min + ':' + sec;
    };

    this.playAll = function()
    {
    	listOfVideoContents.forEach( function( elem ) { 
            if (elem.vid.paused) {
                elem.vid.play().then( _ => {  syncVideos() }); 
            }
        }); 
        listOfAudioContents.forEach( function( elem ) { 
            if (elem.paused) {
                elem.play().then( _ => {  syncVideos() }); 
            }
        }); 
    };

    this.pauseAll = function()
    {
    	listOfVideoContents.forEach( function( elem ) { elem.vid.pause(); } ); 
        listOfAudioContents.forEach( function( elem ) { elem.pause(); } );
    };

    this.seekAll = function(time)
    {
    	listOfVideoContents.forEach( function( elem ) { elem.vid.currentTime += time; } ); 
        listOfAudioContents.forEach( function( elem ) { elem.currentTime += time; } );
    };   

    this.isPausedById = function(id)
    {
        return listOfVideoContents[id].vid.paused;
    };

    this.getMediaTime = function()
    {
        return listOfVideoContents[0].vid.currentTime;
    };

    this.addAudioContent = function(audio)
    {
        listOfAudioContents.push( audio );
        syncVideos();
    };

    this.removeAudioContent = function(audio)
    {
        for ( var i = 0, len = listOfAudioContents.length; i < len; i++ )
        {
            if ( listOfAudioContents[i] == audio )
            {
                listOfAudioContents.splice( i, 1 );
                break;
            }
        }
    };

    var periodCount = 0;

    this.init = function()
    {
        listOfVideoContents[0].dash.on( dashjs.MediaPlayer.events.PERIOD_SWITCH_STARTED, function() 
        {
            //var mpd = listOfVideoContents[0].dash.geti2catMPD();
            //console.log(mpd.manifest)
            if (periodCount > 0) _ManifestParser.updateSignerVideo(periodCount);
            periodCount += 1;
        });

        /*listOfVideoContents[0].dash.on( dashjs.MediaPlayer.events.PLAYBACK_ENDED, function() 
        {
            console.error('PLAYBACK_ENDED')

        });*/

        getAdaptationSets().then(( str ) => { 

            subController.enableSubtitles();

            listOfVideoContents[0].vid.ontimeupdate = function() 
            {

                if (listOfVideoContents[0].vid.currentTime >= listOfVideoContents[0].vid.duration - 0.5) window.location.reload();
                subController.updateSubtitleByTime( listOfVideoContents[0].vid.currentTime );
                if( scene.getObjectByName( "video-progress-bar" ) && scene.getObjectByName( "video-progress-bar" ).visible )
                {
                    vpbCtrl.updatePlayProgressBar();  
                    playpauseCtrl.updatePlayOutTime();   
                }
            }; 
        });
    };

}