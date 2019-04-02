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
		data.playScaleX  = updatePlayProgressScale();
		data.sliderPositionX = updateSliderPosition();
		data.playPositionX = updatePlayProgressPosition();
  }


  this.updatePlayProgressBar = function(){
  	UpdateData();
  	view.UpdateView(data);
  }


  function updatePlayProgressPosition(){
		const play_progress = 44;//scene.getObjectByName("play-progress").geometry.parameters.width;
		//const play_progress = scene.getObjectByName("play-progress").geometry.boundingSphere.radius*2;

		return 	data.sliderPositionX - ( play_progress*data.playScaleX)/2
  }


  function updateSliderPosition(){
  	const progress_width = scene.getObjectByName("background-progress").geometry.parameters.shapes.currentPoint.x;
  	const play_progress = 44;//scene.getObjectByName("play-progress").geometry.parameters.width;
		console.log(play_progress)
  	//return (progress_width - play_progress/2 )+ play_progress*data.playScaleX;
		return progress_width + play_progress*data.playScaleX ;
  }


  function updatePlayProgressScale(){
  	const totalTime = VideoController.getListOfVideoContents()[0].vid.duration;
  	let playoutTime = VideoController.getListOfVideoContents()[0].vid.currentTime;
  	let newPorgressWidth = (playoutTime)/totalTime;

  	if(newPorgressWidth) return newPorgressWidth;
  	else return 0;
  }

  this.onClickSeek = function(mouse3D){
    if(!vpbCtrl.getSeekingProcess()){
      vpbCtrl.setSeekingProcess(true);
      const h = (Math.tan(30*Math.PI/180)*67)*2;
      const w = h*window.innerWidth/window.innerHeight;
			console.log(window.innerWidth)
			console.log("mouse: " +mouse3D.x)

      //let norm_vpb_w = scene.getObjectByName('background-progress').geometry.parameters.width / (w/2);
			let norm_vpb_w = scene.getObjectByName("background-progress").position.x / (window.innerWidth/2);
			console.log("norm_vpb: " + norm_vpb_w)

			//let slider_position_norm = scene.getObjectByName('slider-progress').position.x / (w/2);
			let slider_position_norm = scene.getObjectByName('slider-progress').position.x / (window.innerWidth/2);
			console.log("norm_slider: " +slider_position_norm)
      let time_diff = mouse3D.x - slider_position_norm;

		console.log("diff "+ time_diff)


      if(Math.round(time_diff*100) != 0){
        let new_seek_time = Math.round(VideoController.getListOfVideoContents()[0].vid.duration*time_diff/norm_vpb_w);
        VideoController.seekAll(new_seek_time);
      }
      else console.log("You clicked over the slidder");
    }
    else console.log("Seeking process running");
  }
};
