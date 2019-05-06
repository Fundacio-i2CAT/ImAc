/**
 * @author isaac.fraile@i2cat.net
 */

/************************************************************************************
    
    VideoController.js  
        * Library used to manage audovisual contents

    This library needs to use external libs:
        * dash.all.min.js
        * hls.js

    This library needs to use the global vars:
        * _ManifestParser
        * _Sync
        * subController
        * vpbCtrl
        * scene
        * playpauseCtrl
    
    FUNCTIONALITIES:
        * init = function()    --> Initialize the player contents
        * Play, Pause, seek and Synchronization services
        * Add and remove media content

************************************************************************************/

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

    function syncAllVideos()
    {
        //var mainVideoTime = listOfVideoContents[0].vid.currentTime;
        listOfVideoContents.forEach( function( elem, i ) { if ( i > 0 ) elem.vid.currentTime = listOfVideoContents[0].vid.currentTime } ); 
        //listOfAudioContents.forEach( function( elem ) { elem.currentTime = listOfVideoContents[0].vid.currentTime } ); 
    }

    function setBitrateLimitationsFor(player)
    {
    	if ( window.screen.width * window.devicePixelRatio <= 1920 ) 
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

        if ( navigator.userAgent.toLowerCase().indexOf("android") > -1 ) setBitrateLimitationsFor( player );

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

    function changeAllCurrentTime(value)
    {
        listOfVideoContents.forEach( function( elem ) { elem.vid.currentTime += value; } ); 
        listOfAudioContents.forEach( function( elem ) { elem.currentTime += value; } );
    }

    function changeAllPlaybackRate(value)
    {
        listOfVideoContents.forEach( function( elem ) { elem.vid.playbackRate = value; } ); 
        listOfAudioContents.forEach( function( elem ) { elem.playbackRate  = value; } );
    }

    function syncAll(dif)
    {  
        dif = parseInt( dif*100 )/100;       
        if ( dif > -0.05 && dif < 0.05 ) {} 

        else if ( dif < -1 || dif > 1 ) 
        {
            changeAllCurrentTime( -dif );
        } 
        else 
        {
            changeAllPlaybackRate( 1 - dif );
            setTimeout( () => { changeAllPlaybackRate( 1 ) }, 900);
        }
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
        _Sync.vc( 'play', (listOfVideoContents[0].vid.currentTime + time) * 1000000000 )
        changeAllCurrentTime( time );
    };   

    this.speedAll = function(speed)
    {
        changeAllPlaybackRate( speed );
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

    /**
     * Initialize the library
    */
    this.init = function()
    {
        listOfVideoContents[0].dash.on( dashjs.MediaPlayer.events.PERIOD_SWITCH_STARTED, function() 
        {
            if (periodCount > 0) _ManifestParser.updateSignerVideo(periodCount);
            periodCount += 1;
        });

        getAdaptationSets().then(( str ) => { 

            subController.enableSubtitles();
            var firtsIteration = true;
            listOfVideoContents[0].vid.ontimeupdate = function() 
            {
                if (listOfVideoContents[0].vid.currentTime >= listOfVideoContents[0].vid.duration - 0.5) window.location.reload();
                subController.updateSubtitleByTime( listOfVideoContents[0].vid.currentTime );
                if ( _NonCont ) subController.updateSLByTime( listOfVideoContents[0].vid.currentTime );
                if( scene.getObjectByName( "video-progress-bar" ) && scene.getObjectByName( "video-progress-bar" ).visible )
                {
                    vpbCtrl.updatePlayProgressBar();  
                    playpauseCtrl.updatePlayOutTime();   
                }
                if ( Math.trunc(listOfVideoContents[0].vid.currentTime)%10 == 0 && firtsIteration ) 
                {
                    syncAllVideos();
                    firtsIteration = false;
                }
                else if ( Math.trunc(listOfVideoContents[0].vid.currentTime)%10 != 0 ) firtsIteration = true;
            }; 
        });
    };

    this.getSync = function()
    {
        listOfVideoContents.forEach( function( elem, i ) { console.log( elem.vid.currentTime + ' id: ' + i ) } ); 
        listOfAudioContents.forEach( function( elem, i ) { console.log( elem.currentTime + ' aid: ' + i ) } );
    }

    this.syncAllContents = function(speed, dif)
    {
        if ( speed == 1 )
        {
            if ( listOfVideoContents[0].vid.paused ) this.playAll();
            else syncAll( dif );
        }
        else if ( !listOfVideoContents[0].vid.paused ) this.pauseAll();
    }
}
