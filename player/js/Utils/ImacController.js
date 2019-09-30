
ImAcController = function() 
{
	this.doPlay = function() { MenuFunctionsManager.getPlayPauseFunc( true )() };
	this.doPause = function() { MenuFunctionsManager.getPlayPauseFunc( false )() };
	this.volumeUp = function() { MenuFunctionsManager.getChangeVolumeFunc( true )() };
	this.volumeDown = function() { MenuFunctionsManager.getChangeVolumeFunc( false )() };
	this.goForward = function( time ) { MenuFunctionsManager.getSeekFunc( true, time )() };
	this.goBack = function( time ) { MenuFunctionsManager.getSeekFunc( false, time )() };
	this.changePlaybackRate = function( speed ) { MenuFunctionsManager.getSpeedFunc( speed )() };
	this.enableSubtitles = function() { MenuFunctionsManager.getOnOffFunc( 'subtitlesOffButton' )() };
	this.disableSubtitles = function() { MenuFunctionsManager.getOnOffFunc( 'subtitlesOnButton' )() };
	this.enableSigner = function() { MenuFunctionsManager.getOnOffFunc( 'signLanguageOffButton' )() };
	this.disableSigner = function() { MenuFunctionsManager.getOnOffFunc( 'signLanguageOnButton' )() };
	this.enableAD = function() { MenuFunctionsManager.getOnOffFunc( 'audioDescriptionOffButton' )() };
	this.disableAD = function() { MenuFunctionsManager.getOnOffFunc( 'audioDescriptionOnButton' )() };
	this.enableAST = function() { MenuFunctionsManager.getOnOffFunc( 'audioSubtitlesOffButton' )() };
	this.disableAST = function() { MenuFunctionsManager.getOnOffFunc( 'audioSubtitlesOnButton' )() };
	this.openMenu = function() { MenuFunctionsManager.getopenMenu()() };
	this.closeMenu = function() { MenuFunctionsManager.getcloseMenu()() };
	this.zoomIn = function() { doZoom( 'in' ) };
	this.zoomOut = function() { doZoom( 'out' ) };
}

function launchVoiceCommand( com )
{
	if ( com == 'play' ) _ImAc.doPlay();
	else if ( com == 'pause' ) _ImAc.doPause();
	else if ( com == 'volume_up' ) _ImAc.volumeUp();
	else if ( com == 'volume_down' ) _ImAc.volumeDown();
	else if ( com == 'AD_on' ) _ImAc.enableAD();
	else if ( com == 'AD_off' ) _ImAc.disableAD();
	else if ( com == 'seek_forward' ) _ImAc.goForward(5);
	else if ( com == 'seek_back' ) _ImAc.goBack(5);
	else if ( com == 'subtitles_on' ) _ImAc.enableSubtitles();
	else if ( com == 'subtitles_off' ) _ImAc.disableSubtitles();
	else if ( com == 'menu_open' ) _ImAc.openMenu();
	else if ( com == 'menu_close' ) _ImAc.closeMenu();
	else if ( com.includes("forward|") ) _ImAc.goForward(23);
	else if ( com.includes("backward|") ) _ImAc.goBack( com.split("backward|")[1] );
	else if ( com == 'return' ) window.history.back();
	else if ( com == 'VR_on' ) document.getElementById('button_1').onclick()();
	else if ( com == 'VR_off' ) document.getElementById('button_2').onclick()();
	// new functionalities
	else if ( com == 'zoom_in' ) _ImAc.zoomIn();
	else if ( com == 'zoom_out' ) _ImAc.zoomOut();

}