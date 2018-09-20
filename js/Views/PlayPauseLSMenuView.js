function PlayPauseLSMenuView() {

	

	this.UpdateView = function(data){
		var submenu = scene.getObjectByName(data.name);

		submenu.getObjectByName('playButton').visible = data.isPaused;
		submenu.getObjectByName('pauseButton').visible = !data.isPaused;


		submenu.getObjectByName('forwardMenuButton').children[0].onexecute = data.forwardMenuButtonFunc;
		submenu.getObjectByName('backMenuButton').children[0].onexecute = data.backMenuButtonfunc;
  
	}
}