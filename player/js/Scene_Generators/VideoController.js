/**
 * @author isaac.fraile@i2cat.net
 */

 // This library needs to use the dash.all.min.js and hls.js functions

VideoController = function() {

	var listOfVideoContents = [];

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

    function createDashVO(id, vid, url)
    {
    	var player = dashjs.MediaPlayer().create();
        player.initialize( vid, url, true );

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

    function getSTfromMPD()
    {
        return new Promise((resolve) => {

            listOfVideoContents[0].dash.on( dashjs.MediaPlayer.events.PLAYBACK_STARTED, function() { 

                var subtitleList = listOfVideoContents[0].dash.getTracksForTypeFromManifest('application');
                var videoList = listOfVideoContents[0].dash.getTracksForTypeFromManifest('video');

                if ( subtitleList && subtitleList.length > 0 )
                {
                    list_contents[demoId].subtitles = [];

                    //var split = listOfVideoContents[0].dash.getSource().split("/")
                    //var baseURL = split.slice(0, split.length - 1).join("/") + "/";
                    var langlist = {};

                    subtitleList.forEach( function( elem ) { 
                        langlist[ MenuDictionary.translate( elem.lang ) ] = elem.baseUri + elem.baseURL;                
                    } );

                    list_contents[demoId].subtitles.push(langlist)
                }

                if ( videoList && videoList.length > 0 )
                {
                    var split = listOfVideoContents[0].dash.getSource().split("/")
                    var baseURL = split.slice(0, split.length - 1).join("/") + "/";
                    var langlist = {};

                    videoList.forEach( function( elem ) { 
                        if (elem.roles && elem.roles == 'sign' ) {
                            //console.warn(elem.id)
                            langlist[ MenuDictionary.translate( elem.lang ) ] = elem.baseUri + elem.baseURL;
                        }
                    } );

                    if ( langlist && langlist != {} ) {
                        list_contents[demoId].signer = [];
                        list_contents[demoId].signer.push( langlist );
                    }
                }     

                      

                var lang = MenuDictionary.getMainLanguage();
                var sublang = list_contents[demoId].subtitles[0][lang] ? lang : Object.keys(list_contents[demoId].subtitles[0])[0];

                subController.setSubtitle( list_contents[demoId].subtitles[0][sublang], sublang );

                subController.setSubtitleLanguagesArray( list_contents[demoId].subtitles[0] );

                if ( list_contents[demoId].signer && list_contents[demoId].signer[0] ) 
                {
                    var siglang = list_contents[demoId].signer[0][lang] ? lang : Object.keys(list_contents[demoId].signer[0])[0];
                    subController.setSignerContent( list_contents[demoId].signer[0][siglang], siglang );
                    subController.setSignerLanguagesArray( list_contents[demoId].signer[0] );
                }  

                
                resolve( 'ok' );
            } );
            
        });
    }

//************************************************************************************
// Public Functions
//************************************************************************************

	this.getVideObject = function(id, url) 
    {
        var vid = document.createElement( "video" );     
        vid.muted = true;
        vid.autoplay = true;
        vid.preload = "auto"; 
        vid.loop = true;

        var type = getMediaType( url );

        if ( type == 'mpd' )
        {   
            createDashVO( id, vid, url );
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
    };

    this.pauseAll = function()
    {
    	listOfVideoContents.forEach( function( elem ) { elem.vid.pause(); } ); 
    };

    this.seekAll = function(time)
    {
    	listOfVideoContents.forEach( function( elem ) { elem.vid.currentTime += time; } ); 
    };

    var _freeSeek = true;

    this.seekAll2 = function(time)
    {
        if (!_freeSeek) return;
        else {
            _freeSeek = false;
            listOfVideoContents.forEach( function( elem ) { elem.vid.currentTime += time; } );
            setTimeout(function(){_freeSeek = true;}, 1000);
        }
    };

    this.isPausedById = function(id)
    {
        return listOfVideoContents[id].vid.paused;
    };

    this.getMediaTime = function()
    {
        return listOfVideoContents[0].vid.currentTime;
    };

    this.init = function()
    {
        getSTfromMPD().then(( str ) => { 
            subController.enableSubtitles();
            //createMenus();
//console.error(str)
        

        //subController.enableSubtitles();

            listOfVideoContents[0].vid.ontimeupdate = function() 
            {
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