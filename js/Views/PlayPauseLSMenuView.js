function PlayPauseLSMenuView() {

	

	this.UpdateView = function(data){
		var submenu = scene.getObjectByName(data.name);

		submenu.getObjectByName('playButton').visible = data.isPaused;
		submenu.getObjectByName('pauseButton').visible = !data.isPaused;

		submenu.getObjectByName('playButton').children[0].onexecute = data.playpauseMenuButtonfunc;
		submenu.getObjectByName('pauseButton').children[0].onexecute = data.playpauseMenuButtonfunc;

		submenu.getObjectByName('forwardSeekButton').children[0].onexecute = data.seekForwardMenuButtonfunc;
		submenu.getObjectByName('backSeekButton').children[0].onexecute = data.seekBackMenuButtonfunc;

		submenu.getObjectByName('forwardMenuButton').children[0].onexecute = data.forwardMenuButtonFunc;
		submenu.getObjectByName('backMenuButton').children[0].onexecute = data.backMenuButtonfunc;
  
	}
}