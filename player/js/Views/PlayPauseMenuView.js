
const PlayPauseMenuView = function()
{
	this.UpdateView = function( data )
	{
		let submenu = scene.getObjectByName( data.name );

		submenu.getObjectByName( 'play-button' ).visible = data.isPlayOutTimeVisible ? false : data.isPaused;
		submenu.getObjectByName( 'pause-button' ).visible = data.isPlayOutTimeVisible ? false : !data.isPaused;

		submenu.getObjectByName( 'play-button' ).children[0].onexecute = data.playpauseMenuButtonFunc;
		submenu.getObjectByName( 'pause-button' ).children[0].onexecute = data.playpauseMenuButtonFunc;

		submenu.getObjectByName( 'forward-seek-button' ).children[0].onexecute = data.seekForwardMenuButtonFunc;
		submenu.getObjectByName( 'back-seek-button' ).children[0].onexecute = data.seekBackMenuButtonFunc;
	}
}
