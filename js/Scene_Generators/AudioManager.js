/**
 * @author isaac.fraile@i2cat.net
 */

AudioManager = function() {

    var audioResources = Array();
    var audioResources_order_1 = Array();
    var foaRenderer,
        isAmbisonics;

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

        videoElement.muted = false;

        var videoElementSource = audioContext.createMediaElementSource( videoElement );

        foaRenderer = n < 16 ? getFOARenderer( audioContext ) : getHOARenderer( audioContext );

        foaRenderer.initialize().then(function() 
        {
            isAmbisonics = true;
            videoElementSource.connect( foaRenderer.input );
            foaRenderer.output.connect( audioContext.destination );
            updateMatrix4( m );
        }, function () 
        {
            console.error( '[AudioManager] Error to init Ambisonics' );
        });
    };

    this.getFoaRenderer = function()
    {
        return foaRenderer;
    };

    this.isAmbisonics = function()
    {
        return isAmbisonics;
    };

    this.updateRotationMatrix = function(m)
    {
        updateMatrix4( m );
    };
}