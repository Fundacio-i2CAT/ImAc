function MainMenuController() {

    let data;
	let playPauseView;
    let volumeView;
    let settingsView;
    let accessOptionsView;
	let viewStructure;

    let PlayPauseMemory = false;

    this.Init = function(){
		data = GetData();

		UpdatePlayPauseData();
        UpdateVolumeData();
        UpdateSettingsData();
        UpdateAccessOptionsData();

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

        menuMgr.AddInteractionIfVisible(viewStructure);
	};

/**
 * This function 'closes' the submenu page.
 * Removes all the interactive elements from the 'interactiveListObjects' array stated in Managers/InteractionsController.js
 * Hides the viewStructure.
 * This function is called when closing the menu or when navigating through the different menus in the Enhaced-Accessibility.
 *
 * @function      Exit (name)
 */
    this.Exit = function(){
    // Works if the viewStructure is loaded.
        menuMgr.setOptActiveIndex(0); //SettingsController

        if(viewStructure){
            viewStructure.visible = false;
            viewStructure.children.forEach(function(intrElement){
                interController.removeInteractiveObject(intrElement.name);
            });
        }
    };

/**
 * Gets the data.
 *
 * @class      GetData (name)
 * @return     {PlayPauseMenuModel}  The data.
 */
    function GetData(){
        if (data == null){
            data = new MainMenuModel();
        }
        return data;
    };


	function UpdatePlayPauseData(){
        data.isPaused = VideoController.isPausedById(0);
    
        data.playpauseMenuButtonFunc = function(){ AddVisualFeedbackOnClick(playPauseView, VideoController.isPausedById(0) ? 'play-button' : 'pause-button', function(){ PlayPauseFunc()} )};
        data.seekForwardMenuButtonFunc = function(){ AddVisualFeedbackOnClick(playPauseView, 'forward-seek-button',  function(){ SeekFunc(true)} )};
        data.seekBackMenuButtonFunc = function(){ AddVisualFeedbackOnClick(playPauseView, 'back-seek-button',  function(){ SeekFunc(false)} )};
        //data.backMenuButtonFunc = function(){ AddVisualFeedbackOnClick('backMenuButton', function(){ menuMgr.NavigateBackMenu()} )};
        //data.forwardMenuButtonFunc = function(){ AddVisualFeedbackOnClick('forwardMenuButton', function(){menuMgr.NavigateForwardMenu()} )};
        data.closeMenuButtonFunc = function(){ AddVisualFeedbackOnClick(playPauseView, 'close-button', function(){ menuMgr.ResetViews()} )};
        //data.previewButtonFunc = function(){ AddVisualFeedbackOnClick('previewMenuButton', function(){menuMgr.OpenPreview()} )};
        data.isPreviewVisible = false;
    };

    function UpdateVolumeData(){
        data.volumeLevel = _AudioManager.getVolume()*100+'%';
        data.isVolumeLevelVisible = false;
        data.isMuted = _AudioManager.isAudioMuted();

        data.muteUnmuteMenuButtonFunc = function(){ AddVisualFeedbackOnClick(volumeView, _AudioManager.isAudioMuted() ? 'unmute-volume-button' : 'mute-volume-button', function(){ MuteUnmuteVolumeFunc()} )};
        data.plusVolumeMenuButtonFunc = function(){ AddVisualFeedbackOnClick(volumeView, 'plus-volume-button', function(){ ChangeVolumeFunc(true)} )};
        data.minusVolumeMenuButtonFunc = function(){ AddVisualFeedbackOnClick(volumeView, 'minus-volume-button', function(){ ChangeVolumeFunc(false)} )};
        data.isPreviewVisible = false;
    };

    function UpdateSettingsData(){
        data.openSettingsMenuButtonFunc = function(){ 
            AddVisualFeedbackOnClick(settingsView, 'settings-button', function(){
                if( menuMgr.getMenuType() == 1) {
                    menuMgr.ResetViews();
                    if( scene.getObjectByName( "pointer2" ) && _isHMD ){
                        scene.getObjectByName( "pointer2" ).visible = true;
                    }else if( scene.getObjectByName( "pointer" ) && _isHMD ) {
                        scene.getObjectByName( "pointer" ).visible = true;
                        scene.getObjectByName('pointer').scale.set(1*_pointerSize,1*_pointerSize,1*_pointerSize)
                    }
                }
                menuMgr.Load(SettingsOptionCtrl)
            });
        };
        data.previewButtonFunc = function(){ AddVisualFeedbackOnClick(settingsView, 'preview-button', function(){menuMgr.OpenPreview()} )};
        data.menuTypeButtonFunc = function(){ AddVisualFeedbackOnClick(settingsView, menuMgr.getMenuType() == 2 ? 'enhanced-menu-button' :'traditional-menu-button', function(){ settingsMgr.getChangeMenuTypeFunction()} )};
        data.isPreviewVisible = false;
  }

    function UpdateAccessOptionsData(){
        data.isSTenabled = subController.getSubtitleEnabled();
        data.isSLenabled = subController.getSignerEnabled();
        data.isADenabled = _AudioManager.getADEnabled();
        data.isASTenabled = _AudioManager.getASTEnabled();

        data.isSTavailable = subController.checkisSubAvailable();
        data.isSLavailable = subController.checkisSignAvailable();
        data.isADavailable = _AudioManager.checkisADAvailable();
        data.isASTavailable = _AudioManager.checkisASTAvailable();

//SUBTITLES
        data.subtitlesButtonFunc =  function() {
            AddVisualFeedbackOnClick(accessOptionsView, data.isSTenabled ? 'show-st-button' : 'disable-st-button', function(){
                data.isSTenabled = !data.isSTenabled;
                subController.switchSubtitles(data.isSTenabled);
                accessOptionsView.UpdateAccessibilityOptionsIconStatusView(data);
                // Add interactivity to visible elements and remove interactivity to none visible elements.
                menuMgr.AddInteractionIfVisible(viewStructure);
            });
        };

//SIGN LANGUAGE
        data.signlanguageButtonFunc = function() {
            AddVisualFeedbackOnClick(accessOptionsView, data.isSLenabled ? 'show-sl-button' : 'disable-sl-button',function(){
                data.isSLenabled = !data.isSLenabled;
                subController.switchSigner(data.isSLenabled);
                accessOptionsView.UpdateAccessibilityOptionsIconStatusView(data);
                // Add interactivity to visible elements and remove interactivity to none visible elements.
                menuMgr.AddInteractionIfVisible(viewStructure);
            });
        };

//AUDIO DESCRIPTION
        data.audioDescriptionButtonFunc = function() {
            AddVisualFeedbackOnClick(accessOptionsView, data.isADenabled ? 'show-ad-button' : 'disable-ad-button',function(){
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
                data.isASTenabled = !data.isASTenabled;
                _AudioManager.switchAST(data.isASTenabled);
                accessOptionsView.UpdateAccessibilityOptionsIconStatusView(data);
                // Add interactivity to visible elements and remove interactivity to none visible elements.
                menuMgr.AddInteractionIfVisible(viewStructure);
            });
        };
    }


/**
 * Adds a visual feedback on click.
 *
 * @class      AddVisualFeedbackOnClick (name)
 * @param      {<type>}    buttonName  The button name
 * @param      {Function}  callback    The callback
 */
    function AddVisualFeedbackOnClick(view, buttonName, callback){
        data.clickedButtonName = buttonName;
        view.pressButtonFeedback(data);
        setTimeout(callback, 300);
    };

/*-----------------------------------------------------------------------
                    PlayPause controller functions
-----------------------------------------------------------------------*/

/**
 * { function_description }
 */
    this.updatePlayOutTime = function(){
        UpdatePlayPauseData();
        playPauseView.UpdateView(data);
    };

/**
 * { function_description }
 */
    this.pauseAllFunc = function(){
        PlayPauseMemory = true;
        VideoController.pauseAll();
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
        VideoController.playAll();
        UpdatePlayPauseData();
        playPauseView.UpdateView(data);
    }
  };

/**
 * { function_description }
 *
 * @function      PlayPauseFunc (name)
 */
    function PlayPauseFunc(){
        VideoController.isPausedById(0) ? VideoController.playAll() : VideoController.pauseAll();
        UpdatePlayPauseData();
        playPauseView.UpdateView(data);
        menuMgr.AddInteractionIfVisible(viewStructure);
    };

/**
 * { function_description }
 *
 * @function      SeekFunc (name)
 * @param      {number}  plus    The plus
 */
    function SeekFunc(plus){
        var sign = plus ? 1 : -1;
        VideoController.seekAll( 5*sign );
        UpdatePlayPauseData();
        playPauseView.UpdateView(data);
    };

/*-----------------------------------------------------------------------
                    Volume controller functions
-----------------------------------------------------------------------*/

/**
 * { function_description }
 *
 * @function      ChangeVolumeFunc (name)
 * @param      {number}  plus    The plus
 */
    function ChangeVolumeFunc(plus){
        let sign = plus ? 1 : -1;
        _AudioManager.changeVolume( 0.1*sign );
        volumeLevelDisplayLogic();
    };

/**
 * [MuteUnmuteVolumeFunc description]
 * @function
 */
    function MuteUnmuteVolumeFunc(){
        _AudioManager.isAudioMuted() ? _AudioManager.setunmute() : _AudioManager.setmute();
        UpdateVolumeData();
        volumeView.UpdateView(data);
        menuMgr.AddInteractionIfVisible(viewStructure);
    };

/**
 * [volumeLevelDisplayLogic description]
 * @function
 * @return {[type]} [description]
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

    this.updateAccessOptionsView = function(){

        data.isSTenabled = subController.getSubtitleEnabled();
        data.isSLenabled = subController.getSignerEnabled();
        data.isADenabled = _AudioManager.getADEnabled();
        data.isASTenabled = _AudioManager.getASTEnabled();

        data.isSTavailable = subController.checkisSubAvailable();
        data.isSLavailable = subController.checkisSignAvailable();
        data.isADavailable = _AudioManager.checkisADAvailable();
        data.isASTavailable = _AudioManager.checkisASTAvailable();

        accessOptionsView.UpdateView(data);
        //After the view is updated refresh the list of interctive elements depending on visibility.
        menuMgr.AddInteractionIfVisible(viewStructure);
    }
}