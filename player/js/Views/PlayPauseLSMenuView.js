function PlayPauseLSMenuView() {

	this.UpdateView = function(data){
		var submenu = scene.getObjectByName(data.name);

		submenu.getObjectByName('playButton').visible = data.isPaused;
		submenu.getObjectByName('pauseButton').visible = !data.isPaused;

		submenu.getObjectByName('playButton').children[0].onexecute = data.playpauseMenuButtonFunc;
		submenu.getObjectByName('pauseButton').children[0].onexecute = data.playpauseMenuButtonFunc;

		submenu.getObjectByName('forwardSeekButton').children[0].onexecute = data.seekForwardMenuButtonFunc;
		submenu.getObjectByName('backSeekButton').children[0].onexecute = data.seekBackMenuButtonFunc;

		if(submenu.getObjectByName('forwardMenuButton')) submenu.getObjectByName('forwardMenuButton').children[0].onexecute = data.forwardMenuButtonFunc;
		if(submenu.getObjectByName('backMenuButton')) submenu.getObjectByName('backMenuButton').children[0].onexecute = data.backMenuButtonFunc;

        if(submenu.getObjectByName('closeMenuButton')) submenu.getObjectByName('closeMenuButton').children[0].onexecute = data.closeMenuButtonFunc;

        submenu.add(refreshPlayOutTime(data));
        submenu.getObjectByName('playOutTime').visible = data.isPlayOutTimeVisible;
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

    function refreshPlayOutTime(data)
    {
        var submenu = scene.getObjectByName(data.name);
        submenu.remove(scene.getObjectByName('playOutTime'));
        
        var playouttime = new InteractiveElementModel();
        playouttime.width = 35;
        playouttime.height = 35;
        playouttime.name = 'playOutTime';
        playouttime.type =  'text';
        playouttime.value = data.playOutTimeText;
        playouttime.textSize = 1.5;
        playouttime.color = 0xffffff;
        playouttime.position = new THREE.Vector3(0, 0, 0.01);

        return playouttime.create();
    }
}