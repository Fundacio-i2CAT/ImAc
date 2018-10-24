function SettingsLSMenuView() {

	this.UpdateView = function(data){
		var submenu = scene.getObjectByName(data.name);
                console.log(data.activeOptionIndex)

        submenu.getObjectByName('settingsButton').children[0].onexecute = (data.activeOptionIndex == 5) ? data.closeSettingsMenuButtonFunc : data.openSettingsMenuButtonFunc;

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