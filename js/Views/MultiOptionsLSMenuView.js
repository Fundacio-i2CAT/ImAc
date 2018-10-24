function MultiOptionsLSMenuView() {

	this.UpdateView = function(data){
		var submenu = scene.getObjectByName(data.name);

        console.log(data.activeOptionIndex)
		submenu.getObjectByName('showSubtitlesMenuButton').visible = data.isSTenabled;
		submenu.getObjectByName('disabledSubtitlesMenuButton').visible = !data.isSTenabled;

		submenu.getObjectByName('showSignLanguageMenuButton').visible = data.isSLenabled;
		submenu.getObjectByName('disabledSignLanguageMenuButton').visible = !data.isSLenabled;

		submenu.getObjectByName('showAudioDescriptionMenuButton').visible = data.isADenabled;
		submenu.getObjectByName('disabledAudioDescriptionMenuButton').visible = !data.isADenabled;

		submenu.getObjectByName('showAudioSubtitlesMenuButton').visible = data.isASTenabled;
		submenu.getObjectByName('disabledAudioSubtitlesMenuButton').visible = !data.isASTenabled;

        submenu.getObjectByName('showSubtitlesMenuButton').children[0].onexecute = (data.activeOptionIndex == 1) ? data.closeSTMenuButtonFunc : data.openSTMenuButtonFunc;
        submenu.getObjectByName('disabledSubtitlesMenuButton').children[0].onexecute = (data.activeOptionIndex == 1) ? data.closeSTMenuButtonFunc : data.openSTMenuButtonFunc;

        submenu.getObjectByName('showSignLanguageMenuButton').children[0].onexecute = (data.activeOptionIndex == 2) ? data.closeSLMenuButtonFunc : data.openSLMenuButtonFunc;
        submenu.getObjectByName('disabledSignLanguageMenuButton').children[0].onexecute = (data.activeOptionIndex == 2) ? data.closeSLMenuButtonFunc : data.openSLMenuButtonFunc;

        submenu.getObjectByName('showAudioDescriptionMenuButton').children[0].onexecute = (data.activeOptionIndex == 3) ? data.closeADMenuButtonFunc : data.openADMenuButtonFunc;
        submenu.getObjectByName('disabledAudioDescriptionMenuButton').children[0].onexecute = (data.activeOptionIndex == 3) ? data.closeADMenuButtonFunc : data.openADMenuButtonFunc;

        submenu.getObjectByName('showAudioSubtitlesMenuButton').children[0].onexecute = (data.activeOptionIndex == 4) ? data.closeASTMenuButtonFunc : data.openASTMenuButtonFunc;
        submenu.getObjectByName('disabledAudioSubtitlesMenuButton').children[0].onexecute = (data.activeOptionIndex == 4) ? data.closeASTMenuButtonFunc : data.openASTMenuButtonFunc;

		if(submenu.getObjectByName('forwardMenuButton')) submenu.getObjectByName('forwardMenuButton').children[0].onexecute = data.forwardMenuButtonFunc;
		if(submenu.getObjectByName('backMenuButton')) submenu.getObjectByName('backMenuButton').children[0].onexecute = data.backMenuButtonFunc;

        if(submenu.getObjectByName('closeMenuButton')) submenu.getObjectByName('closeMenuButton').children[0].onexecute = data.closeMenuButtonFunc;
	}

    this.pressButtonFeedback = function(data)
    {   
    	var submenu = scene.getObjectByName(data.name);
        interController.removeInteractiveObject(data.clickedButtonName);

        var sceneElement = submenu.getObjectByName(data.clickedButtonName)
        var initScale = sceneElement.scale;

        sceneElement.material.color.set( menuButtonActiveColor );
        sceneElement.scale.set( initScale.x*0.8, initScale.y*0.8, 1 );

        // Set color 'menuDefaultColor' (white), size to initial and add interactivity within 300ms to sceneElement;
       setTimeout(function() { 
            sceneElement.material.color.set( menuDefaultColor );
            sceneElement.scale.set( initScale.x*1.25, initScale.y*1.25, 1 ); 
            interController.addInteractiveObject( sceneElement );
        }, 300);
    };
}