/**
 * @author isaac.fraile@i2cat.net
 */

AudioManager = function() {

    var audioResources = Array();
    var audioResources_order_1 = Array();
    var volume; // Variable for volume level state saving;
    var isMuted = false;
    var foaRenderer,
        isAmbisonics,
        activeVideoElement;  // Video element been reproduced.

    function getFOARenderer(audioContext)
    {
        return Omnitone.createFOARenderer( audioContext, { hrirPathList: audioResources_order_1 } );
    }

    function getHOARenderer(audioContext)
    {
        return Omnitone.createHOARenderer( audioContext, { hrirPathList: audioResources } );
    }

    function updateMatrix4(m)
    {
        if (foaRenderer) foaRenderer.setRotationMatrix4( m );
    }

    this.initAmbisonicResources = function()
    {
        console.log( '[AudioManager] Initialized audio resources' );

        isAmbisonics = false;

        audioResources.push( 'resources/omnitone-toa-1.wav' );
        audioResources.push( 'resources/omnitone-toa-2.wav' );
        audioResources.push( 'resources/omnitone-toa-3.wav' );
        audioResources.push( 'resources/omnitone-toa-4.wav' );
        audioResources.push( 'resources/omnitone-toa-5.wav' );
        audioResources.push( 'resources/omnitone-toa-6.wav' );
        audioResources.push( 'resources/omnitone-toa-7.wav' );
        audioResources.push( 'resources/omnitone-toa-8.wav' );

        audioResources_order_1.push( 'resources/omnitone-foa-1.wav' );
        audioResources_order_1.push( 'resources/omnitone-foa-2.wav' );
    };

    this.initializeAudio = function(videoElement, n, m)
    {
        var audioContext = new AudioContext();

        activeVideoElement = videoElement;

        activeVideoElement.volume = initialVolumeLevel; // Start volume level in 0.5 

        videoElement.muted = false;

        var videoElementSource = audioContext.createMediaElementSource( videoElement );

        foaRenderer = n < 16 ? getFOARenderer( audioContext ) : getHOARenderer( audioContext );

        foaRenderer.initialize().then(function() 
        {
            isAmbisonics = n > 2 ? true : false;
            videoElementSource.connect( foaRenderer.input );
            foaRenderer.output.connect( audioContext.destination );

            isAmbisonics ? updateMatrix4( m ) : foaRenderer.setRenderingMode( 'bypass' );

        }, function () 
        {
            console.error( '[AudioManager] Error to init Ambisonics' );
        });
    };

    this.getFoaRenderer = function()
    {
        return foaRenderer;
    };

    this.setmute = function()
    {
        isMuted = true;
        volume = activeVideoElement.volume;
        activeVideoElement.volume = 0;
    };

    this.setunmute = function()
    {
        isMuted = false;
        activeVideoElement.volume = volume > 0 ? volume : volumeChangeStep;
    };

    this.changeVolume = function(value)
    {
        var newVolume = activeVideoElement.volume + value;

        if ( newVolume < 0 )
        {
            newVolume = 0;
        }
        else if ( newVolume > 1 )
        {
            newVolume = 1;
        }
        
        activeVideoElement.volume = newVolume;
        volume = activeVideoElement.volume;
    }

    this.isAmbisonics = function()
    {
        return isAmbisonics;
    };

    this.updateRotationMatrix = function(m)
    {
        updateMatrix4( m );
    };

    this.getVolume = function()
    {
        return Math.round(activeVideoElement.volume * 100) / 100
    }

    this.isAudioMuted = function()
    {
        return isMuted;
    }
}