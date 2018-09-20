function PlayPauseLSMenuView() {

	

	this.UpdateView = function(data){
		var submenu = scene.getObjectByName(data.name);

		if(data.isPaused)
		{
			submenu.getObjectByName('playButton').visible = true;
			submenu.getObjectByName('pauseButton').visible = false;
		}
		else 
		{
			submenu.getObjectByName('playButton').visible = false;
			submenu.getObjectByName('pauseButton').visible = true;
		}

		submenu.getObjectByName('forwardMenuButton').children[0].onexecute = data.forwardMenuButtonFunc;
		submenu.getObjectByName('backMenuButton').children[0].onexecute = data.backMenuButtonfunc;
  
	}
}