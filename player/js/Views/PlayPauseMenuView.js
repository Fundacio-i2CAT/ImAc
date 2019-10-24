
const PlayPauseMenuView = function(){

  let submenu;

	this.UpdateView = function (data){
		submenu = scene.getObjectByName(data.name);

		submenu.getObjectByName('play-button').visible = data.isPlayOutTimeVisible ? false : data.isPaused;
		submenu.getObjectByName('pause-button').visible = data.isPlayOutTimeVisible ? false : !data.isPaused;

		submenu.getObjectByName('play-button').children[0].onexecute = data.playpauseMenuButtonFunc;
		submenu.getObjectByName('pause-button').children[0].onexecute = data.playpauseMenuButtonFunc;

		submenu.getObjectByName('forward-seek-button').children[0].onexecute = data.seekForwardMenuButtonFunc;
		submenu.getObjectByName('back-seek-button').children[0].onexecute = data.seekBackMenuButtonFunc;

    //submenu.getObjectByName('close-button').children[0].onexecute = data.closeMenuButtonFunc;
    //submenu.getObjectByName('close-button-zoom').children[0].onexecute = data.closeMenuButtonFunc;

	}

  this.pressButtonFeedback = function(data){
    interController.removeInteractiveObject(data.clickedButtonName);

    let sceneElement = submenu.getObjectByName(data.clickedButtonName);
    let initScale = sceneElement.scale;

    sceneElement.material.color.set( menuButtonActiveColor );
    sceneElement.scale.set( initScale.x*0.8, initScale.y*0.8, 1 );

      // Set color 'menuDefaultColor', size to initial and add interactivity within 300ms to sceneElement;
     setTimeout(function() {
      sceneElement.material.color.set( menuDefaultColor );
      sceneElement.scale.set( initScale.x*1.25, initScale.y*1.25, 1 );
      interController.addInteractiveObject( sceneElement );
    }, 300);
  };
}
