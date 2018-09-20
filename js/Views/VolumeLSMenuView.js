function VolumeLSMenuView() {

	this.UpdateView = function(data){
    
    	var submenu = scene.getObjectByName(data.name);

		submenu.getObjectByName('unmuteVolumeButton').visible = data.isMuted;
		submenu.getObjectByName('muteVolumeButton').visible = !data.isMuted;

		submenu.getObjectByName('forwardMenuButton').children[0].onexecute = data.forwardMenuButtonFunc;
		submenu.getObjectByName('backMenuButton').children[0].onexecute = data.backMenuButtonfunc;
	}
}