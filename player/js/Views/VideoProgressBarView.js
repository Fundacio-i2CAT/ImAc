function VideoProgressBarView() {

	let menu;
	let vpb;
	this.UpdateView = function(data){
		menu = scene.getObjectByName(data.name);
		vpb = menu.getObjectByName('video-progress-bar');
       
        menu.getObjectByName("play-progress").scale.set(data.playScaleX,1,1);
        menu.getObjectByName("play-progress").position.x = data.playPositionX;
        menu.getObjectByName("slider-progress").position.x = data.sliderPositionX;

        mainMenuCtrl.setSeekingProcess(false);
        vpb.add(refreshPlayOutTime(data));
	}

	function refreshPlayOutTime(data){
	    //menu = scene.getObjectByName(data.name);
	    vpb.remove(scene.getObjectByName('video-playout-time'));

	    let playouttime = new InteractiveElementModel();
	    playouttime.width = 35;
	    playouttime.height = 35;
	    playouttime.name = 'video-playout-time';
	    playouttime.type =  'text';
	    playouttime.text = data.videoPlayOutTimeText;
	    playouttime.textSize = menuWidth/50;
	    playouttime.color = 0xe6e6e6;
	    playouttime.position = new THREE.Vector3(-9*menuWidth/20 , -menuHeight/24, 0.01);

	    return playouttime.create();
  	}
}