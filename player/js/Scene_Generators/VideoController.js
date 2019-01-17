/**
 * @author isaac.fraile@i2cat.net
 */

 // This library needs to use the dash.all.min.js and hls.js functions

VideoController = function() {

	var listOfVideoContents = [];
    var _freeSeek = true;
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

    function getSTfromMPD()
    {
        return new Promise((resolve) => {

            listOfVideoContents[0].dash.on( dashjs.MediaPlayer.events.PLAYBACK_STARTED, function() {

                if ( ft ) 
                {
                    ft = false;  

                    var subtitleList = listOfVideoContents[0].dash.getTracksForTypeFromManifest('application');
                    var videoList = listOfVideoContents[0].dash.getTracksForTypeFromManifest('video');

                    if ( subtitleList && subtitleList.length > 0 )
                    {
                        var langlist = {};
                        list_contents[demoId].subtitles = [];

                        subtitleList.forEach( function( elem ) { 
                            langlist[ MenuDictionary.translate( elem.lang ) ] = elem.baseUri + elem.baseURL;                
                        } );

                        list_contents[demoId].subtitles.push(langlist)
                    }
//console.error(videoList)
                    if ( videoList && videoList.length > 0 )
                    {
                        var langlist;

                        videoList.forEach( function( elem ) { 
                            if (elem.roles && elem.roles == 'sign' ) {
                                if ( langlist == undefined ) langlist = {};
                                langlist[ MenuDictionary.translate( elem.lang ) ] = elem.baseUri + elem.baseURL;
                            }
                        } );

                        if ( langlist ) restartSTContent( langlist );
                    }  

                    var lang = MenuDictionary.getMainLanguage();
                    
                    setSTContent( lang );
                    setSLContent( lang ); 
                    setADContent( lang ); 
                    setASTContent( lang );     
                }

                resolve( 'ok' );
            } );
            
        });
    }

    function restartSTContent(object)
    {
        list_contents[demoId].signer = [];
        list_contents[demoId].signer.push( object );
    }

    function updateSignerVideo(periodId, mpd)
    {
        var adaptationList = mpd.manifest.Period[periodId].AdaptationSet;
        var lang = MenuDictionary.getMainLanguage();
        var langlist;

        adaptationList.forEach( function( elem ) {
            if ( elem.Role.value == 'sign') 
            {
                if ( langlist == undefined ) langlist = {};
                langlist[ MenuDictionary.translate( elem.lang ) ] = mpd.manifest.baseUri + elem.Representation.SegmentList.SegmentURL.media;
            }
        });

        if ( langlist )
        {
            restartSTContent( langlist );
            setSLContent( lang );
        }

        else subController.removeSignVideoByPeriod();

        
    }

    function setSTContent(lang)
    {
        var sublang = list_contents[demoId].subtitles[0][lang] ? lang : Object.keys(list_contents[demoId].subtitles[0])[0];
        subController.setSubtitle( list_contents[demoId].subtitles[0][sublang], sublang );
        subController.setSubtitleLanguagesArray( list_contents[demoId].subtitles[0] );
    }

    function setSLContent(lang)
    {
        if ( list_contents[demoId].signer && list_contents[demoId].signer[0] ) 
        {
            var siglang = list_contents[demoId].signer[0][lang] ? lang : Object.keys(list_contents[demoId].signer[0])[0];
            subController.setSignerContent( list_contents[demoId].signer[0][siglang], siglang );
            subController.setSignerLanguagesArray( list_contents[demoId].signer[0] );
        }
    }

    function setADContent(lang)
    {
        var adlang = list_contents[demoId].ad[0][lang] ? lang : Object.keys(list_contents[demoId].ad[0])[0];
        _AudioManager.setADContent( list_contents[demoId].ad[0][adlang], adlang );
        _AudioManager.setADLanguagesArray( list_contents[demoId].ad[0] );
    }

    function setASTContent(lang)
    {
        var astlang = list_contents[demoId].ast[0][lang] ? lang : Object.keys(list_contents[demoId].ast[0])[0];
        _AudioManager.setASTContent( list_contents[demoId].ast[0][astlang], astlang );
        _AudioManager.setASTLanguagesArray( list_contents[demoId].ast[0] );
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
    };

    this.pauseAll = function()
    {
    	listOfVideoContents.forEach( function( elem ) { elem.vid.pause(); } ); 
    };

    this.seekAll = function(time)
    {
    	listOfVideoContents.forEach( function( elem ) { elem.vid.currentTime += time; } ); 
    };   

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

    var periodCount = 0;

    this.init = function()
    {
        listOfVideoContents[0].dash.on( dashjs.MediaPlayer.events.PERIOD_SWITCH_STARTED, function() 
        {
            var mpd = listOfVideoContents[0].dash.geti2catMPD();
            //console.log(mpd.manifest)
            if (periodCount > 0) updateSignerVideo(periodCount, mpd);
            periodCount += 1;
        });

        /*listOfVideoContents[0].dash.on( dashjs.MediaPlayer.events.PLAYBACK_ENDED, function() 
        {
            console.error('PLAYBACK_ENDED')

        });*/

        getSTfromMPD().then(( str ) => { 

            subController.enableSubtitles();

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