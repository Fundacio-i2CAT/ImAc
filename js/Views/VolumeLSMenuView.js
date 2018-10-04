function VolumeLSMenuView() {

	this.UpdateView = function(data){
    
    	var submenu = scene.getObjectByName(data.name);

		submenu.getObjectByName('unmuteVolumeButton').visible = data.isMuted;
		submenu.getObjectByName('muteVolumeButton').visible = !data.isMuted;

		submenu.getObjectByName('unmuteVolumeButton').children[0].onexecute = data.muteUnmuteMenuButtonfunc;
		submenu.getObjectByName('muteVolumeButton').children[0].onexecute = data.muteUnmuteMenuButtonfunc;

		submenu.getObjectByName('plusVolumeButton').children[0].onexecute = data.plusVolumeMenuButtonfunc;
		submenu.getObjectByName('minusVolumeButton').children[0].onexecute = data.minusVolumeMenuButtonfunc;

		if(submenu.getObjectByName('forwardMenuButton')) submenu.getObjectByName('forwardMenuButton').children[0].onexecute = data.forwardMenuButtonFunc;
		if(submenu.getObjectByName('backMenuButton')) submenu.getObjectByName('backMenuButton').children[0].onexecute = data.backMenuButtonfunc;

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