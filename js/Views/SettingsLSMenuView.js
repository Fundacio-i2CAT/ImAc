function SettingsLSMenuView() {

	this.UpdateView = function(data){
		var submenu = scene.getObjectByName(data.name);

		submenu.getObjectByName('forwardMenuButton').children[0].onexecute = data.forwardMenuButtonFunc;
		submenu.getObjectByName('backMenuButton').children[0].onexecute = data.backMenuButtonfunc;
  
	}
}