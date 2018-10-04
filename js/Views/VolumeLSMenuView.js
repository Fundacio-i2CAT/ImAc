function VolumeLSMenuView() {

	this.UpdateView = function(data){
    
    	var submenu = scene.getObjectByName(data.name);

		submenu.getObjectByName('unmuteVolumeButton').visible = data.isMuted;
		submenu.getObjectByName('muteVolumeButton').visible = !data.isMuted;

		submenu.getObjectByName('unmuteVolumeButton').children[0].onexecute = data.muteUnmuteMenuButtonfunc;
		submenu.getObjectByName('muteVolumeButton').children[0].onexecute = data.muteUnmuteMenuButtonfunc;

		submenu.getObjectByName('plusVolumeButton').children[0].onexecute = data.plusVolumeMenuButtonfunc;
		submenu.getObjectByName('minusVolumeButton').children[0].onexecute = data.minusVolumeMenuButtonfunc;

		submenu.getObjectByName('forwardMenuButton').children[0].onexecute = data.forwardMenuButtonFunc;
		submenu.getObjectByName('backMenuButton').children[0].onexecute = data.backMenuButtonfunc;
	}
}