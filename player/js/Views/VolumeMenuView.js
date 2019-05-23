function VolumeMenuView() {

    let submenu;

	this.UpdateView = function(data){
    
    	submenu = scene.getObjectByName(data.name);

		submenu.getObjectByName('unmute-volume-button').visible = data.isVolumeLevelVisible ? false : data.isMuted;
        submenu.getObjectByName('unmute-volume-button').children[0].onexecute = data.muteUnmuteMenuButtonFunc;

		submenu.getObjectByName('mute-volume-button').visible = data.isVolumeLevelVisible ? false : !data.isMuted;
        submenu.getObjectByName('mute-volume-button').children[0].onexecute = data.muteUnmuteMenuButtonFunc;

        if(submenu.getObjectByName('volume-level-text')) {
            submenu.getObjectByName('volume-level-text').visible = data.isVolumeLevelVisible;
        }

		if(submenu.getObjectByName('plus-volume-button')) {
            submenu.getObjectByName('plus-volume-button').children[0].onexecute = data.plusVolumeMenuButtonFunc;
        }
        
		if(submenu.getObjectByName('minus-volume-button')) {
            submenu.getObjectByName('minus-volume-button').children[0].onexecute = data.minusVolumeMenuButtonFunc;
        }

        if(data.isVolumeLevelVisible) {
            submenu.add(ChangeVolumeLevelText(data));
        }
	}

    this.pressButtonFeedback = function(data) {   
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
        submenu.remove(submenu.getObjectByName('volume-level-text'));
        
        var volumeLevel = new InteractiveElementModel();
        volumeLevel.width = 0;
        volumeLevel.height = 0;
        volumeLevel.name = 'volume-level-text';
        volumeLevel.type =  'text';
        volumeLevel.text = data.volumeLevel*100+'%';
        volumeLevel.color = 0xffffff;
        volumeLevel.textSize = menuWidth/50;
        volumeLevel.position = submenu.getObjectByName('unmute-volume-button').position;

        return volumeLevel.create();
    }
}