/**
 * The MainMenuController is the one in charge of the initialitzacion and update of the main menu elements:
 *      -   Play, pause and seek.
 *      -   Volume level.
 *      -   Settings and Preview.
 *      -   Accessibility options.
 *      -   Video progress bar.
 *      
 * The controller has some functions which are shared by all the different group elements.
 *      - Init()
 *      - Exit()
 *      - GetData()
 *      - AddVisualFeedbackOnClick()
 *      
 * For each element group we have individual functions:
 *      - PlayPause:
 *          · UpdatePlayPauseData()
 *          · updatePlayOutTime()
 *          · pauseAllFunc()
 *          · playAllFunc()
 *          · PlayPauseFunc()
 *          · SeekFunc()
 *          
 *      - Volume:
 *          · UpdateVolumeData()
 *          · ChangeVolumeFunc() 
 *          · MuteUnmuteVolumeFunc() 
 *          · volumeLevelDisplayLogic()
 *          
 *      - Settings:
 *          · UpdateSettingsData()
 *          
 *      - Access:
 *          · UpdateAccessOptionsData():
 *          . updateAccessOptionsView()
 *          
 *      - VPB:
 *          · UpdateVideoProgressBarData():
 *          · setSeekingProcess() 
 *          · getSeekingProcess()
 *          · updatePlayProgressBar()
 *          · onClickSeek()
 *          · updatePlayProgressPosition() 
 *          · updateSliderPosition() 
 *          · updatePlayProgressScale()
 *          
 * @class      MainMenuController (name)
 */
function MainMenuController() {

    let data;
	let playPauseView;
    let volumeView;
    let settingsView;
    let accessOptionsView;
    let videoProgressBarView;
	let viewStructure;

    let PlayPauseMemory = false;
    let isSeeking;
    let isSliding = false;
    let lastSliderPos;
    let initialSlidingPos;
    let newSeekTime;

    let index = 1;

    /**
     * This function initializes and update all the datat and 
     * views of the different groups that compose the main menu.
     *
     * @function      Init 
     */
    this.Init = function(){
        mainMenuCtrl.setSeekingProcess(false);

		data = GetData();

		UpdatePlayPauseData();
        UpdateVolumeData();
        UpdateSettingsData();
        UpdateAccessOptionsData();
        UpdateVideoProgressBarData();

        data.isPreviewVisible = false;

		viewStructure = scene.getObjectByName(data.name);
		viewStructure.visible = true;

		playPauseView = new PlayPauseMenuView();
        playPauseView.UpdateView(data);

        volumeView = new VolumeMenuView();
        volumeView.UpdateView(data);

        settingsView = new SettingsMenuView();
        settingsView.UpdateView(data);

        accessOptionsView = new AccessibilityOptionsMenuView();
        accessOptionsView.UpdateView(data);

        videoProgressBarView = new VideoProgressBarView();
        videoProgressBarView.UpdateView(data);

        menuMgr.AddInteractionIfVisible(viewStructure);
	};

    /**
     * This function 'closes' the submenu page.
     * Removes all the interactive elements from the 'interactiveListObjects' array stated in Managers/InteractionsController.js
     * Hides the viewStructure.
     * This function is called when closing the menu.
     *
     * @function      Exit
     */
    this.Exit = function(){
        //Works if the viewStructure is loaded.
        menuMgr.setOptActiveIndex(0); //SettingsController

        if (viewStructure) {
            viewStructure.visible = false;
            viewStructure.children.forEach(function(intrElement){
                interController.removeInteractiveObject(intrElement.name);
            });
        }
    };

    /**
     * Gets the data data model MainMenuModel and initializes it if null.
     *
     * @return     {<MainMenuModel>}  The data model.
     */
    function GetData(){
        if (data == null) {
            data = new MainMenuModel();
        }
        return data;
    };

    /** 
     * Adds a visual feedback on click that changes the size and color of the clicked element.
     * 
     * @param      {<View>}      view  Th view where the button is.
     * @param      {<String>}    buttonName  The button name.
     * @param      {Function}    callback    The function linked toi the button.
     */
    function AddVisualFeedbackOnClick(view, buttonName, callback){
        data.clickedButtonName = buttonName;
        view.pressButtonFeedback(data);
        setTimeout(callback, 300);
    };


    /**
     * This function updates the data in the PlayPause group. 
     * It adds the functions to the different interactive elements (Play, Pause, Seek and Close buttons).
     */
	function UpdatePlayPauseData(){
        data.isPaused = VideoController.isPausedById(0);
        data.playpauseMenuButtonFunc = function(){ AddVisualFeedbackOnClick(playPauseView, VideoController.isPausedById(0) ? 'play-button' : 'pause-button', function(){ PlayPauseFunc()} )};
        data.seekForwardMenuButtonFunc = function(){ AddVisualFeedbackOnClick(playPauseView, 'forward-seek-button',  function(){ SeekFunc(true)} )};
        data.seekBackMenuButtonFunc = function(){ AddVisualFeedbackOnClick(playPauseView, 'back-seek-button',  function(){ SeekFunc(false)} )};
        data.closeMenuButtonFunc = function(){ AddVisualFeedbackOnClick(playPauseView, 'close-button', function(){ menuMgr.ResetViews()} )};
    };

    /**
     * This function updates the data in the Volume group. 
     * Adds the value of the volume level and its visibility.
     * It adds the functions to the different interactive elements (Mute/Unmute, plus and minus buttons).
     */
    function UpdateVolumeData(){
        data.volumeLevel = _AudioManager.getVolume()*100+'%';
        data.isVolumeLevelVisible = false;
        data.isMuted = _AudioManager.isAudioMuted();
        data.muteUnmuteMenuButtonFunc = function(){ AddVisualFeedbackOnClick(volumeView, _AudioManager.isAudioMuted() ? 'unmute-volume-button' : 'mute-volume-button', function(){ MuteUnmuteVolumeFunc()} )};
        data.plusVolumeMenuButtonFunc = function(){ AddVisualFeedbackOnClick(volumeView, 'plus-volume-button', function(){ ChangeVolumeFunc(true)} )};
        data.minusVolumeMenuButtonFunc = function(){ AddVisualFeedbackOnClick(volumeView, 'minus-volume-button', function(){ ChangeVolumeFunc(false)} )};
    };

    /**
     * This function updates the data in the Settings group. 
     * It adds the functions to the different interactive elements (Settings, preview and menuType buttons).
     */
    function UpdateSettingsData(){
        data.openSettingsMenuButtonFunc = function(){ 
            AddVisualFeedbackOnClick(settingsView, 'settings-button', function(){
                if( menuMgr.getMenuType() == 1) {
                    menuMgr.ResetViews();
                    if( scene.getObjectByName( "pointer2" ) && _isHMD ){
                        scene.getObjectByName( "pointer2" ).visible = true;
                    }else if( scene.getObjectByName( "pointer" ) && _isHMD ) {
                        scene.getObjectByName( "pointer" ).visible = true;
                        scene.getObjectByName('pointer').scale.set(1*_pointerSize,1*_pointerSize,1*_pointerSize);
                    }
                }
                menuMgr.Load(SettingsOptionCtrl);
            });
        };
        //data.previewButtonFunc = function(){ AddVisualFeedbackOnClick(settingsView, 'preview-button', function(){menuMgr.OpenPreview()} )};
        data.zoomButtonFunc = function(){ AddVisualFeedbackOnClick(settingsView, 'zoom-button', function(){
            data.zoomLevel = Math.pow(2,index)%5;
            settingsView.changeZoomLevelText(data);
            index +=1;
            if(index>2) index = 0;

            let zoomFactor = data.zoomLevel;
            camera.zoom = zoomFactor;

            canvas.scale.set((1/zoomFactor), (1/zoomFactor), 1); 
            if(stConfig.fixedSpeaker) scene.getObjectByName('subtitles').scale.set((1/zoomFactor), (1/zoomFactor), 1); 
            camera.updateProjectionMatrix();
        } )};
        data.menuTypeButtonFunc = function(){ AddVisualFeedbackOnClick(settingsView, menuMgr.getMenuType() == 2 ? 'enhanced-menu-button' :'traditional-menu-button', function(){ MenuFunctionsManager.getChangeMenuTypeFunction()} )};
    }

    /**
     * This function updates the data in the AccessOptions group. 
     * Adds the functions to the different interactive elements (Subtitles, Sign Language, Audio Description and Audio Subtitle buttons).
     * Checks for the availability of the services. In case of unavailability the view will disable the button.
     */
    function UpdateAccessOptionsData(){
        //Save the state of all the accessibility services.
        //In case the services is unavailable the button will be disabled and shown in grey.
        data.isSTenabled = stConfig.isEnabled;
        data.isSLenabled = slConfig.isEnabled;
        data.isADenabled = _AudioManager.getADEnabled();
        data.isASTenabled = _AudioManager.getASTEnabled();

        //Save the state of availability of all the accessibility services.
        data.isSTavailable = _stMngr.checkisSubAvailable();
        data.isSLavailable = _slMngr.checkisSignAvailable();
        data.isADavailable = _AudioManager.checkisADAvailable();
        data.isASTavailable = _AudioManager.checkisASTAvailable();

        //SUBTITLES
        data.subtitlesButtonFunc =  function() {
            AddVisualFeedbackOnClick(accessOptionsView, data.isSTenabled ? 'show-st-button' : 'disable-st-button', function(){
                //Change the state of the subtiles from enabled to disabled and viceversa.
                data.isSTenabled = !data.isSTenabled;
                
                _stMngr.switchSubtitles(data.isSTenabled);
                SettingsOptionCtrl.UpdateView();
                accessOptionsView.UpdateAccessibilityOptionsIconStatusView(data);
                // Add interactivity to visible elements and remove interactivity to none visible elements.
                menuMgr.AddInteractionIfVisible(viewStructure);
                //If subtitles are disabled signer goes back to bottom position.
                if (!localStorage.getItem("slPosition") && _slMngr.getSigner() && !stConfig.fixedScene ) {
                    //_slMngr.setPosition(slConfig.canvasPos.x, data.isSTenabled ? stConfig.canvasPos.y : -1);
                    _slMngr.setPosition(slConfig.canvasPos.x*Math.abs(slConfig.initPos.x), Math.abs(slConfig.initPos.y) * (data.isSTenabled ? stConfig.canvasPos.y : -1));
                }
            });
        };

        //SIGN LANGUAGE
        data.signlanguageButtonFunc = function() {
            AddVisualFeedbackOnClick(accessOptionsView, data.isSLenabled ? 'show-sl-button' : 'disable-sl-button',function(){
                //Change the state of the signer from enabled to disabled and viceversa.
                data.isSLenabled = !data.isSLenabled;
                _slMngr.switchSigner(data.isSLenabled);
                
                accessOptionsView.UpdateAccessibilityOptionsIconStatusView(data);
                // Add interactivity to visible elements and remove interactivity to none visible elements.
                menuMgr.AddInteractionIfVisible(viewStructure);

                //Update the Radar position
                //Needs if/else if position has been updated by user;
                _rdr.updateRadarPosition();
            });
        };

        //AUDIO DESCRIPTION
        data.audioDescriptionButtonFunc = function() {
            AddVisualFeedbackOnClick(accessOptionsView, data.isADenabled ? 'show-ad-button' : 'disable-ad-button',function(){
                //Change the state of the audio description from enabled to disabled and viceversa.
                data.isADenabled = !data.isADenabled;
                _AudioManager.switchAD(data.isADenabled);
                
                accessOptionsView.UpdateAccessibilityOptionsIconStatusView(data);
                // Add interactivity to visible elements and remove interactivity to none visible elements.
                menuMgr.AddInteractionIfVisible(viewStructure);
            });
        };

        //AUDIO SUBTITLES
        data.audioSubtitlesButtonFunc = function() {
            AddVisualFeedbackOnClick(accessOptionsView, data.isASTenabled ? 'show-ast-button' : 'disable-ast-button', function(){
                //Change the state of the audio subtitles from enabled to disabled and viceversa.
                data.isASTenabled = !data.isASTenabled;
                _AudioManager.switchAST(data.isASTenabled);
                
                accessOptionsView.UpdateAccessibilityOptionsIconStatusView(data);
                // Add interactivity to visible elements and remove interactivity to none visible elements.
                menuMgr.AddInteractionIfVisible(viewStructure);
            });
        };
    }

    /**
     * This function updates the data in the Video progress bar group. 
     * Updates the time and position of the slidder in the progress bar. 
     * Updates the scale in the X axes of the played time bar. 
     */
    function UpdateVideoProgressBarData(){
        data.videoPlayOutTimeText = VideoController.getPlayoutTime(VideoController.getListOfVideoContents()[0].vid.currentTime);
        data.playScaleX  = updatePlayProgressScale();
        data.sliderPositionX = updateSliderPosition();
        data.playPositionX = updatePlayProgressPosition();
    }




/*-----------------------------------------------------------------------
                    PlayPause controller functions
-----------------------------------------------------------------------*/

    /**
     * This function update the playout time and if the view is visible updates the view.
     */
    this.updatePlayOutTime = function(){
        if (!mainMenuCtrl.getSlidingStatus()) UpdatePlayPauseData();
        if (playPauseView) playPauseView.UpdateView(data);
    };

    /**
     * This function plays or pasues the video depending on the previous state.
     * Updates the data and the view.
     */
    this.pauseAllFunc = function(){
        PlayPauseMemory = true;
        _ImAc.doPause();
        UpdatePlayPauseData();
        playPauseView.UpdateView(data);
        menuMgr.AddInteractionIfVisible(viewStructure);
    };

    /**
     * { function_description }
     *
     * @function   playAllFunc (name)
     */
    this.playAllFunc = function(){
        if ( PlayPauseMemory ){
            PlayPauseMemory = false;
            _ImAc.doPlay();
            UpdatePlayPauseData();
            playPauseView.UpdateView(data);
            menuMgr.AddInteractionIfVisible(viewStructure);
        }
    };

    /**
     * Depending on the video status (play or pause) the video will be resumed or paused.
     * The data model is updated together with the view and the interaction array.
     */
    function PlayPauseFunc(){
        VideoController.isPausedById(0) ? _ImAc.doPlay() : _ImAc.doPause();
        UpdatePlayPauseData();
        playPauseView.UpdateView(data);
        menuMgr.AddInteractionIfVisible(viewStructure);
    };

    /**
     * Seeks the video to a determine point depending on the 
     * user click position over the video progress bar.
     * 
     * @param      {<Boolean>}  isPositive    Determines if the seek is forward or backwards.
     */
    function SeekFunc(isPositive){
        VideoController.seekAll( 5 * (isPositive ? 1 : -1) );
        UpdatePlayPauseData();
        playPauseView.UpdateView(data);
    };

/*-----------------------------------------------------------------------
                    Volume controller functions
-----------------------------------------------------------------------*/

    /**
     * Changes the valume of the volume depending on isPositive.
     *
     * @param      {<Boolean>}  isPositive    Determines if the volume goes higher or lower
     */
    function ChangeVolumeFunc(isPositive){
        _AudioManager.changeVolume( 0.1 * (isPositive ? 1 : -1) );
        volumeLevelDisplayLogic();
    };

    /**
     * Controls the logic of the mute unmute buttons. 
     * It updates the data, updates the view and adds 
     * the corresponding interaction to the new visible button.
     */
    function MuteUnmuteVolumeFunc(){
        _AudioManager.isAudioMuted() ? _AudioManager.setunmute() : _AudioManager.setmute();
        UpdateVolumeData();
        volumeView.UpdateView(data);
        menuMgr.AddInteractionIfVisible(viewStructure);
    };

    /**
    * Displays the volumen level in % during 500ms every 
    * time the user changes the value by clicking on the 
    * plus or minus volumen level button.
    */
    function volumeLevelDisplayLogic(){
        data.volumeLevel = _AudioManager.getVolume();
        data.isVolumeLevelVisible =  true;
        volumeView.UpdateView(data);

        setTimeout(function(){
           (_AudioManager.getVolume()>0) ? _AudioManager.setunmute() : _AudioManager.setmute();
           data.isMuted = _AudioManager.isAudioMuted();
           data.isVolumeLevelVisible =  false;
           volumeView.UpdateView(data);
        }, 500);
    };

/*-----------------------------------------------------------------------
                    Access Options controller functions
-----------------------------------------------------------------------*/
    
    /**
     * { function_description }
     */
    this.updateAccessOptionsView = function(){

        data.isSTenabled = stConfig.isEnabled;
        data.isSLenabled = slConfig.isEnabled;
        data.isADenabled = _AudioManager.getADEnabled();
        data.isASTenabled = _AudioManager.getASTEnabled();

        data.isSTavailable = _stMngr.checkisSubAvailable();
        data.isSLavailable = _slMngr.checkisSignAvailable();
        data.isADavailable = _AudioManager.checkisADAvailable();
        data.isASTavailable = _AudioManager.checkisASTAvailable();

        accessOptionsView.UpdateView(data);
        //After the view is updated refresh the list of interctive elements depending on visibility.
        menuMgr.AddInteractionIfVisible(viewStructure);
    }


/*-----------------------------------------------------------------------
                Video progress bar controller functions
-----------------------------------------------------------------------*/
    /**
     * Sets the seeking process. 
     * This function is used in order to block the user from seeing during a seeking process
     * until the current seeking process has ended
     * @param      {<Boolean>}  value   Is there a current seeking process beeing executed.
     */
    this.setSeekingProcess = function(value){
        isSeeking = value;
    }

    /**
     * Gets the seeking process.
     *
     * @return     {<Boolean>}  The seeking process.
     */
    this.getSeekingProcess = function(){
        return isSeeking;
    }

    /**
     * This function updates the played colored bar automaticaly and with user interaction (onClick seek)
     */
    this.updatePlayProgressBar = function(){
        UpdateVideoProgressBarData();
        if (videoProgressBarView) videoProgressBarView.UpdateView(data);
    }

    /**
     * OnClick in the progress bar it seeks the video to the clicked position.
     *
     * @param      {<Vector3>}  mouse3D  The mouse 3d
     */
    this.onClickSeek = function(intersectedPoint){
        if(!mainMenuCtrl.getSeekingProcess()){
            mainMenuCtrl.setSeekingProcess(true);

            let time_diff = intersectedPoint.x - scene.getObjectByName('slider-progress').position.x;

            if(Math.round(time_diff*100) != 0){
                let new_seek_time = Math.floor(VideoController.getListOfVideoContents()[0].vid.duration*time_diff/(4*menuWidth/5));
                VideoController.seekAll(new_seek_time);

            } else console.log("You clicked over the slidder");
        } else console.log("Seeking process running");
    }

    /**
     * Determines the position of the play colored bar.
     *
     * @return     {<Float>}  { description_of_the_return_value }
     */
    function updatePlayProgressPosition(){
        const play_progress =  scene.getObjectByName("play-progress");
        if( ! play_progress.geometry.boundingBox ) {
            play_progress.geometry.computeBoundingBox();
        }
        let widthCurrent = play_progress.geometry.boundingBox.max.x - play_progress.geometry.boundingBox.min.x;
        return (-widthCurrent + widthCurrent * data.playScaleX) / 2  + menuWidth/200;
    }

    function updateSeekProgressPosition(){
        const seek_progress =  scene.getObjectByName("seek-progress");
        if( ! seek_progress.geometry.boundingBox ) {
            seek_progress.geometry.computeBoundingBox();
        }
        let widthCurrent = seek_progress.geometry.boundingBox.max.x - seek_progress.geometry.boundingBox.min.x;
        return (-widthCurrent + widthCurrent * data.seekScaleX) / 2  + menuWidth/200;
    }

    /**
     * Calculates the new position of the slider depending on the current video time over the total video length.
     *
     * @return     {<Float>}  { New posistion of the slider }
     */
    function updateSliderPosition(){
        const progress_width = scene.getObjectByName("background-progress").geometry.parameters.shapes.currentPoint.x;
        return progress_width + (4*menuWidth/5)*data.playScaleX;
    }

    /**
     * Returns the percentage of video reproduced.
     *
     * @return     {<Float>}  { video percentage reproduced }
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
 * @param      {<type>}  raycaster        The raycaster
 * @param      {<type>}  elementSelection  The slider selection
 */
    this.updatePositionOnMove = function(raycaster, elementSelection){
        if (elementSelection) {
            const x = elementSelection.position.x;

            isSliding = true;
            // Check the position where the background menu is intersected
            let elementArray = (scene.getObjectByName("trad-main-menu")) ? [scene.getObjectByName('trad-menu-background')] : [];
            let intersects = raycaster.intersectObjects( elementArray , true );

            const totalTime = VideoController.getListOfVideoContents()[0].vid.duration;   
            let currentTime = VideoController.getListOfVideoContents()[0].vid.currentTime;
            let newSliderPos;

            if(intersects[0]){   
                //The sliding boundries are from -(4*menuWidth/10) to +(4*menuWidth/10) which is the VPB width;           
                if(elementSelection.position.x > -(4*menuWidth/10) && elementSelection.position.x < (4*menuWidth/10)){

                    // Reposition the object based on the intersection point with the background menu
                    newSliderPos  = intersects[0].object.worldToLocal(intersects[0].point).x;
                    newSeekTime = timeDiffOnSlide(newSliderPos);

                    //Update all values (playOuTime, slider position, etc) while sliding seek;
                    if((newSeekTime + currentTime) < 0){
                        data.videoPlayOutTimeText = VideoController.getPlayoutTime(0);
                        data.playScaleX = 0.001;
                    } else if((newSeekTime + currentTime) > totalTime){
                        data.videoPlayOutTimeText = VideoController.getPlayoutTime(totalTime);
                        data.playScaleX  = 1;
                    } else {
                        data.videoPlayOutTimeText = VideoController.getPlayoutTime(currentTime + newSeekTime);
                        data.playScaleX  = (currentTime + newSeekTime)/totalTime;
                    }
                } else {
                    if(Math.sign(elementSelection.position.x) < 0){
                        data.videoPlayOutTimeText = VideoController.getPlayoutTime(0);
                        data.playScaleX = 0.001;
                    } else {
                        data.videoPlayOutTimeText = VideoController.getPlayoutTime(totalTime);
                        data.playScaleX  = 1;
                    }
                    newSliderPos = Math.sign(elementSelection.position.x) * (4*menuWidth/10);
                    newSeekTime = timeDiffOnSlide(newSliderPos);
                }
                data.sliderPositionX = newSliderPos;
                data.playPositionX = updatePlayProgressPosition();   

            }
            videoProgressBarView.UpdateView(data);
        }
    }

    function timeDiffOnSlide(elementSelection){
        timeDiff = elementSelection - initialSlidingPos;
        if(Math.ceil(timeDiff*100) != 0){
            return Math.floor(VideoController.getListOfVideoContents()[0].vid.duration*timeDiff/(4*menuWidth/5));
        }
    }

    this.onSlideSeek = function(elementSelection){
        if(!isSliding){
            VideoController.seekAll(newSeekTime);
            if(actionPausedVideo) mainMenuCtrl.playAllFunc();
        }    
    }

    this.setSlidingStatus = function(status){
        isSliding = status;
    }

    this.getSlidingStatus = function(){
        return isSliding;
    }

    this.setInitialSlidingPosition = function(position){
        initialSlidingPos = position;
    }
}
