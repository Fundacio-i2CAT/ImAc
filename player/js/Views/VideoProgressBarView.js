function VideoProgressBarView() {

	this.UpdateView = function(data){
		const element = scene.getObjectByName(data.name);
       
        element.getObjectByName("play-progress").scale.set(data.playScaleX,1,1);
        element.getObjectByName("play-progress").position.x = data.playPositionX;
        element.getObjectByName("slider-progress").position.x = data.sliderPositionX;

        vpbCtrl.setSeekingProcess(false);
	}
}