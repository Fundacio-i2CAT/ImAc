
var isFullscreen = false;

function togglefullscreen()
{
    fullscreenON() ? exitfullscreen() : enterfullscreen();
}

function enterfullscreen() {
	element = document.body;
    console.log('fullscreen')
    if (document.fullscreenEnabled || document.msFullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled) 
    {
        if ( element.requestFullscreen ) 
        {
            element.requestFullscreen();
            isFullscreen = true;
        } 
        else if ( element.msRequestFullscreen ) 
        {
            element.msRequestFullscreen();
            isFullscreen = true;
        } 
        else if ( element.mozRequestFullScreen ) 
        {
            element.mozRequestFullScreen();
            isFullscreen = true;
        } 
        else if ( element.webkitRequestFullScreen ) 
        {
            element.webkitRequestFullScreen();
            isFullscreen = true;
        } 
        else 
        {
            Debug.error( 'Error going Fullscreen.' );
        }
    } 
    else 
    {
        Debug.error( 'Fullscreen API not supported.' );
    }
}

function exitfullscreen() 
{
    if ( document.exitFullscreen ) {
        document.exitFullscreen();
        isFullscreen = false;
    } else if ( document.webkitExitFullscreen ) {
        document.webkitExitFullscreen();
        isFullscreen = false;
    } else if ( document.mozCancelFullScreen ) {
        document.mozCancelFullScreen();
        isFullscreen = false;
    } else if ( document.msExitFullscreen ) {
        document.msExitFullscreen();
        isFullscreen = false;
    } else {
        Debug.error( 'Error exiting fullscreen, please report this.' );
    }
}

function fullscreenON() {
    return !((document.fullScreenElement !== undefined && document.fullScreenElement === null) ||
    (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) ||
    (document.mozFullScreen !== undefined && !document.mozFullScreen) ||
    (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen));
}