function VideoProgressBarView() {

	this.UpdateView = function(data){
		const element = scene.getObjectByName(data.name);
       
        element.getObjectByName("play-progress").scale.set(data.playScaleX,1,1);
        element.getObjectByName("play-progress").position.x = data.playPositionX;
        element.getObjectByName("slider-progress").position.x = data.sliderPositionX;

        vpbCtrl.setSeekingProcess(false);
        element.add(refreshPlayOutTime(data));
	}

	function refreshPlayOutTime(data){
	    let element = scene.getObjectByName(data.name);
	    element.remove(scene.getObjectByName('video-playout-time'));

	    let playouttime = new InteractiveElementModel();
	    playouttime.width = 35;
	    playouttime.height = 35;
	    playouttime.name = 'video-playout-time';
	    playouttime.type =  'text';
	    playouttime.value = data.videoPlayOutTimeText;
	    playouttime.textSize = (menuMgr.getMenuType() == 1) ? 15 : menuWidth/50;
	    playouttime.color = 0xe6e6e6;
	    playouttime.position = new THREE.Vector3(-9*menuWidth/20 , -menuHeight/24, 0.01);

	    return playouttime.create();
  	}
}