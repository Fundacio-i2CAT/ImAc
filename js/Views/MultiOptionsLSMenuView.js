function MultiOptionsLSMenuView() {

	this.UpdateView = function(data){
		var submenu = scene.getObjectByName(data.name);
		
		submenu.getObjectByName('showSubtitlesMenuButton').visible = data.isSTenabled;
		submenu.getObjectByName('disabledSubtitlesMenuButton').visible = !data.isSTenabled;

		submenu.getObjectByName('showSignLanguageMenuButton').visible = data.isSLenabled;
		submenu.getObjectByName('disabledSignLanguageMenuButton').visible = !data.isSLenabled;

		submenu.getObjectByName('showAudioDescriptionMenuButton').visible = data.isADenabled;
		submenu.getObjectByName('disabledAudioDescriptionMenuButton').visible = !data.isADenabled;

		submenu.getObjectByName('showAudioSubtitlesMenuButton').visible = data.isASTenabled;
		submenu.getObjectByName('disabledAudioSubtitlesMenuButton').visible = !data.isASTenabled;

		submenu.getObjectByName('forwardMenuButton').children[0].onexecute = data.forwardMenuButtonFunc;
		submenu.getObjectByName('backMenuButton').children[0].onexecute = data.backMenuButtonfunc;
  		
	}
}