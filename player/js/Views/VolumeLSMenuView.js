function VolumeLSMenuView() {

    var submenu;

	this.UpdateView = function(data){
    
    	submenu = scene.getObjectByName(data.name);

		submenu.getObjectByName('unmuteVolumeButton').visible = data.isVolumeLevelVisible ? false : data.isMuted;
		submenu.getObjectByName('muteVolumeButton').visible = data.isVolumeLevelVisible ? false : !data.isMuted;

        submenu.getObjectByName('volumeLevel').visible = data.isVolumeLevelVisible;

		submenu.getObjectByName('unmuteVolumeButton').children[0].onexecute = data.muteUnmuteMenuButtonFunc;
		submenu.getObjectByName('muteVolumeButton').children[0].onexecute = data.muteUnmuteMenuButtonFunc;

		submenu.getObjectByName('plusVolumeButton').children[0].onexecute = data.plusVolumeMenuButtonFunc;
		submenu.getObjectByName('minusVolumeButton').children[0].onexecute = data.minusVolumeMenuButtonFunc;

		if(submenu.getObjectByName('forwardMenuButton')) submenu.getObjectByName('forwardMenuButton').children[0].onexecute = data.forwardMenuButtonFunc;
		if(submenu.getObjectByName('backMenuButton')) submenu.getObjectByName('backMenuButton').children[0].onexecute = data.backMenuButtonFunc;

        if(submenu.getObjectByName('closeMenuButton')) submenu.getObjectByName('closeMenuButton').children[0].onexecute = data.closeMenuButtonFunc;

        if(data.isVolumeLevelVisible) submenu.add(ChangeVolumeLevelText(data));
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

    function ChangeVolumeLevelText(data)
    {
        submenu.remove(submenu.getObjectByName('volumeLevel'));
        
        var volumeLevel = new InteractiveElementModel();
        volumeLevel.width = (menuMgr.getMenuType() == 1) ? 35 : 4;
        volumeLevel.height = (menuMgr.getMenuType() == 1) ? 35 : 4;
        volumeLevel.name = 'volumeLevel';
        volumeLevel.type =  'text';
        volumeLevel.value = data.volumeLevel*100+'%';
        volumeLevel.color = 0xffffff;
        volumeLevel.textSize =  (menuMgr.getMenuType() == 1) ? 18 : 1.25;
        volumeLevel.position = submenu.getObjectByName('unmuteVolumeButton').position;

        return volumeLevel.create();
    }
}