function VolumeLSMenuView() {

	this.UpdateView = function(data){
    
    	var submenu = scene.getObjectByName(data.name);

		if(data.isMuted)
		{
			submenu.getObjectByName('unmuteVolumeButton').visible = true;
			submenu.getObjectByName('muteVolumeButton').visible = false;
		}
		else 
		{
			submenu.getObjectByName('unmuteVolumeButton').visible = false;
			submenu.getObjectByName('muteVolumeButton').visible = true;
		}

		submenu.getObjectByName('forwardMenuButton').children[0].onexecute = data.forwardMenuButtonFunc;
		submenu.getObjectByName('backMenuButton').children[0].onexecute = data.backMenuButtonfunc;
	}
}