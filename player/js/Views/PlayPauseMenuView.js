
const PlayPauseMenuView = function(){

	this.UpdateView = function (data){
		let submenu = scene.getObjectByName(data.name);

		submenu.getObjectByName('playButton').visible = (menuMgr.getMenuType() == 1 && data.isPlayOutTimeVisible) ? false : data.isPaused;
		submenu.getObjectByName('pauseButton').visible = (menuMgr.getMenuType() == 1 && data.isPlayOutTimeVisible) ? false : !data.isPaused;

		submenu.getObjectByName('playButton').children[0].onexecute = data.playpauseMenuButtonFunc;
		submenu.getObjectByName('pauseButton').children[0].onexecute = data.playpauseMenuButtonFunc;

		submenu.getObjectByName('forwardSeekButton').children[0].onexecute = data.seekForwardMenuButtonFunc;
		submenu.getObjectByName('backSeekButton').children[0].onexecute = data.seekBackMenuButtonFunc;

    if(submenu.getObjectByName('previewMenuButton')) submenu.getObjectByName('previewMenuButton').visible = data.isPreviewVisible;

		if(submenu.getObjectByName('forwardMenuButton')) submenu.getObjectByName('forwardMenuButton').children[0].onexecute = data.forwardMenuButtonFunc;
		if(submenu.getObjectByName('backMenuButton')) submenu.getObjectByName('backMenuButton').children[0].onexecute = data.backMenuButtonFunc;

    if(submenu.getObjectByName('closeMenuButton')) submenu.getObjectByName('closeMenuButton').children[0].onexecute = data.closeMenuButtonFunc;

    //submenu.add(refreshPlayOutTime(data));
    //submenu.getObjectByName('playOutTime').visible = data.isPlayOutTimeVisible;
	}

  this.pressButtonFeedback = function(data){
  	let submenu = scene.getObjectByName(data.name);
    interController.removeInteractiveObject(data.clickedButtonName);

    let sceneElement = submenu.getObjectByName(data.clickedButtonName);
    let initScale = sceneElement.scale;

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
