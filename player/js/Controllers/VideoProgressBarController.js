function VideoProgressBarController() {

	let data;
	let view;
	let viewStructure;
    let isSeeking;

	this.Init = function(){
        vpbCtrl.setSeekingProcess(false);

        data = GetData();
        UpdateData();
        viewStructure = scene.getObjectByName(data.name);
        viewStructure.visible = true;

        view = new VideoProgressBarView();
        view.UpdateView(data);

        interController.addInteractiveObject(viewStructure); //DEPRECATED USE BELOW FUNCTION
		//menuMgr.AddInteractionIfVisible(viewStructure);
	}

	this.Exit = function(){
		if(viewStructure){
	  	    viewStructure.visible = false;
	  	    interController.removeInteractiveObject(viewStructure.name);
		}
	}

    this.getName = function(){
    	return data.name;
    }

    this.setSeekingProcess = function(value){
        isSeeking = value;
    }

    this.getSeekingProcess = function(){
        return isSeeking;
    }


    function GetData(){
        if (data == null){
            data = new VideoProgressBarModel();
        }
        return data;
	}

	function UpdateData(){
        data.videoPlayOutTimeText = VideoController.getPlayoutTime(VideoController.getListOfVideoContents()[0].vid.currentTime) || list_contents[demoId].duration;
		data.playScaleX  = updatePlayProgressScale();
		data.sliderPositionX = updateSliderPosition();
		data.playPositionX = updatePlayProgressPosition();
    }


    this.updatePlayProgressBar = function(){
        UpdateData();
        view.UpdateView(data);
    }

/**
 * { function_description }
 *
 * @return     {<type>}  { description_of_the_return_value }
 */
    function updatePlayProgressPosition(){
        const play_progress =  scene.getObjectByName("play-progress");
        if( ! play_progress.geometry.boundingBox ) {
            play_progress.geometry.computeBoundingBox();
        }
        let widthCurrent = play_progress.geometry.boundingBox.max.x - play_progress.geometry.boundingBox.min.x;
        return (-widthCurrent + widthCurrent * data.playScaleX) / 2  + menuWidth/200;
    }

/**
 * This function calculates the new position of the slider depending on the current video time over the total video length.
 *
 * @return     {number}  { New posistion of the slider }
 */
    function updateSliderPosition(){
    	const progress_width = scene.getObjectByName("background-progress").geometry.parameters.shapes.currentPoint.x;
    	return progress_width + (4*menuWidth/5)*data.playScaleX;
    }

/**
 * Returns the percentage of video reproduced.
 *
 * @return     {number}  { video percentage reproduced }
 */
    function updatePlayProgressScale(){
    	const totalTime = VideoController.getListOfVideoContents()[0].vid.duration;
    	let playoutTime = VideoController.getListOfVideoContents()[0].vid.currentTime;
    	let newPorgressWidth = (playoutTime)/totalTime;

    	if(newPorgressWidth) return newPorgressWidth;
    	else return 0;
    }

/**
 * { function_description }
 *
 * @param      {<type>}  mouse3D  The mouse 3d
 */
    this.onClickSeek = function(mouse3D){
        if(!vpbCtrl.getSeekingProcess()){
            vpbCtrl.setSeekingProcess(true);
            
            const h = (Math.tan(30*Math.PI/180)*67)*2;
            const w = h*window.innerWidth/window.innerHeight;
    		let norm_vpb_w = (4*menuWidth/5) / (w/2);
    		let slider_position_norm = scene.getObjectByName('slider-progress').position.x / (w/2);
            let time_diff = mouse3D.x - slider_position_norm;

            if(Math.round(time_diff*100) != 0){
                let new_seek_time = Math.round(VideoController.getListOfVideoContents()[0].vid.duration*time_diff/(norm_vpb_w));
                VideoController.seekAll(new_seek_time);
            } else console.log("You clicked over the slidder");
        } else console.log("Seeking process running");
    }
};
