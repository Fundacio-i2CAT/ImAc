function MultiOptionsLSMenuView() {

	this.UpdateView = function(data){
		var submenu = scene.getObjectByName(data.name);

		submenu.getObjectByName('showSubtitlesMenuButton').children[0].visible = data.isSTenabled;
		submenu.getObjectByName('disabledSubtitlesMenuButton').children[0].visible = !data.isSTenabled;

		submenu.getObjectByName('showSignLanguageMenuButton').children[0].visible = data.isSLenabled;
		submenu.getObjectByName('disabledSignLanguageMenuButton').children[0].visible = !data.isSLenabled;

		submenu.getObjectByName('showAudioDescriptionMenuButton').children[0].visible = data.isADenabled;
		submenu.getObjectByName('disabledAudioDescriptionMenuButton').children[0].visible = !data.isADenabled;

		submenu.getObjectByName('showAudioSubtitlesMenuButton').children[0].visible = data.isASTenabled;
		submenu.getObjectByName('disabledAudioSubtitlesMenuButton').children[0].visible = !data.isASTenabled;

		submenu.getObjectByName('forwardMenuButton').children[0].onexecute = data.forwardMenuButtonFunc;
		submenu.getObjectByName('backMenuButton').children[0].onexecute = data.backMenuButtonfunc;
  
	}
}