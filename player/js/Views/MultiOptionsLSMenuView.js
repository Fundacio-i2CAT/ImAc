function MultiOptionsLSMenuView() {

    var submenu;

	this.UpdateView = function(data){
		submenu = scene.getObjectByName(data.name);
        
        this.UpdateMultiOptionsIconStatusView(data);

        submenu.getObjectByName('showSubtitlesMenuButton').children[0].onexecute = data.openSTMenuButtonFunc;
        submenu.getObjectByName('disabledSubtitlesMenuButton').children[0].onexecute = data.openSTMenuButtonFunc;

        submenu.getObjectByName('showSignLanguageMenuButton').children[0].onexecute =  data.openSLMenuButtonFunc;
        submenu.getObjectByName('disabledSignLanguageMenuButton').children[0].onexecute = data.openSLMenuButtonFunc;

        submenu.getObjectByName('showAudioDescriptionMenuButton').children[0].onexecute = data.openADMenuButtonFunc;
        submenu.getObjectByName('disabledAudioDescriptionMenuButton').children[0].onexecute = data.openADMenuButtonFunc;

        submenu.getObjectByName('showAudioSubtitlesMenuButton').children[0].onexecute = data.openASTMenuButtonFunc;
        submenu.getObjectByName('disabledAudioSubtitlesMenuButton').children[0].onexecute = data.openASTMenuButtonFunc;

        if(submenu.getObjectByName('previewMenuButton')) submenu.getObjectByName('previewMenuButton').children[0].onexecute = data.previewButtonFunc;

		if(submenu.getObjectByName('forwardMenuButton')) submenu.getObjectByName('forwardMenuButton').children[0].onexecute = data.forwardMenuButtonFunc;
		if(submenu.getObjectByName('backMenuButton')) submenu.getObjectByName('backMenuButton').children[0].onexecute = data.backMenuButtonFunc;

        if(submenu.getObjectByName('closeMenuButton')) submenu.getObjectByName('closeMenuButton').children[0].onexecute = data.closeMenuButtonFunc;
	}

    this.pressButtonFeedback = function(data)
    {   
        interController.removeInteractiveObject(data.clickedButtonName);

        var sceneElement = submenu.getObjectByName(data.clickedButtonName);
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

    this.UpdateMultiOptionsIconStatusView = function(data)
    {
        submenu.getObjectByName('showSubtitlesMenuButton').visible = data.isSTenabled;
        submenu.getObjectByName('disabledSubtitlesMenuButton').visible = !data.isSTenabled;

        submenu.getObjectByName('showSignLanguageMenuButton').visible = data.isSLenabled;
        submenu.getObjectByName('disabledSignLanguageMenuButton').visible = !data.isSLenabled;

        submenu.getObjectByName('showAudioDescriptionMenuButton').visible = data.isADenabled;
        submenu.getObjectByName('disabledAudioDescriptionMenuButton').visible = !data.isADenabled;

        submenu.getObjectByName('showAudioSubtitlesMenuButton').visible = data.isASTenabled;
        submenu.getObjectByName('disabledAudioSubtitlesMenuButton').visible = !data.isASTenabled;
    }
}