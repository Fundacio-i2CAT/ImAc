
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

}






 //<p><input id="btnVolume_5" value="Volume 5" type="button" onclick="sendCommand('volume_x|5');" /></p>
    
    