function VideoProgressBarController() {

	let data;
	let view;
	let viewStructure;

	this.Init = function(){

		data = GetData();
		UpdateData();
		viewStructure = scene.getObjectByName(data.name);
		viewStructure.visible = true;

		view = new VideoProgressBarView();
		view.UpdateView(data); 

		AddInteractivityToMenuElements();
	}

	this.Exit = function()
    {
    	if(viewStructure)
    	{
	    	viewStructure.visible = false;
	    	interController.removeInteractiveObject(viewStructure.name);
	    	/*viewStructure.children.forEach(function(intrElement){
	    		interController.removeInteractiveObject(intrElement.name);
	    	});*/
    	}
    }

    this.getName = function()
    {
    	return data.name;
    }


    function GetData()
	{
	    if (data == null)
	    {
	        data = new VideoProgressBarModel();
	    }
	    return data;
	}


	function UpdateData()
    {
		data.playScaleX  = updatePlayProgressScale();
		data.playPositionX = updatePlayProgressPosition();
		data.sliderPositionX = updateSliderPosition();
    }

    function AddInteractivityToMenuElements()
    {
    	interController.addInteractiveObject(viewStructure);
    	/*viewStructure.children.forEach(function(intrElement){
    		if(intrElement.visible)
    		{
    			interController.addInteractiveObject(intrElement);
    		}
    	});*/
    }

    this.updatePlayProgressBar = function()
    {
    	UpdateData();
    	view.UpdateView(data);
    }

    function updatePlayProgressPosition()
    {
    	const play_progress = scene.getObjectByName("play-progress");
    	if( ! play_progress.geometry.boundingBox ) play_progress.geometry.computeBoundingBox();
        let widthCurrent = play_progress.geometry.boundingBox.max.x - play_progress.geometry.boundingBox.min.x;
        return (-widthCurrent + widthCurrent * data.playScaleX) / 2 ;
    }

    function updateSliderPosition()
    {
    	const progress_width = scene.getObjectByName("background-progress").geometry.parameters.width;
    	const play_progress = scene.getObjectByName("play-progress").geometry.parameters.width;
    	return -progress_width/2 + play_progress*data.playScaleX;
    }


    function updatePlayProgressScale()
    {
		const progress_width = scene.getObjectByName("background-progress").geometry.parameters.width;
    	const totalTime = VideoController.getListOfVideoContents()[0].vid.duration;
    	let playoutTime = VideoController.getListOfVideoContents()[0].vid.currentTime;
    	let newPorgressWidth = (playoutTime)/totalTime;

    	if(newPorgressWidth) return newPorgressWidth;
    	else return 0;
    }

    this.onClickSeek = function(mouse3D)
    {
	    var h = (Math.tan(30*Math.PI/180)*67)*2;
	    var w = h*window.innerWidth/window.innerHeight
	    
	    var norm_vpb_w = scene.getObjectByName('background-progress').geometry.parameters.width / (w/2);
	    var slider_position_norm = scene.getObjectByName('slider-progress').position.x / (w/2);
	    let time_diff = mouse3D.x - slider_position_norm;

	    if(Math.sign(time_diff) != 0)
	    {
	        let new_seek_time = Math.round(VideoController.getListOfVideoContents()[0].vid.duration*time_diff/norm_vpb_w);
	        VideoController.seekAll2(new_seek_time)
	    }
	    else console.log("You clicked over the slidder")
    }


};