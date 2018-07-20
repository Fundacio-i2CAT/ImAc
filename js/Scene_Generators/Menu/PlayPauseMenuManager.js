THREE.PlayPauseMenuManager = function () {

    var listOfVideoContents = moData.getListOfVideoContents();
    var playoutTimeout;

this.getPlayoutTime = function(secs, format) {
        var hr  = Math.floor(secs / 3600);
        var min = Math.floor((secs - (hr * 3600))/60);
        var sec = Math.floor(secs - (hr * 3600) -  (min * 60));

        if (min < 10) { min = "0" + min; }
        if (sec < 10)  { sec  = "0" + sec; }
        return min + ':' + sec;
    }

/**
 * { function_description }
 */
    this.playAll = function()
    {
        for ( var i = 0, len = listOfVideoContents.length; i < len; i++ ) 
        {
            listOfVideoContents[i].vid.play();
        }
        syncVideos();
    };

/**
 * { function_description }
 */
    this.pauseAll = function()
    {
        for ( var i = 0, len = listOfVideoContents.length; i < len; i++ ) 
        {
            listOfVideoContents[i].vid.pause();
        }
    };

/**
 * Determines if paused by identifier.
 *
 * @param      {<type>}   id      The identifier
 * @return     {boolean}  True if paused by identifier, False otherwise.
 */
    this.isPausedById = function(id)
    {
        return listOfVideoContents[id].vid.paused;
    };

/**
 * { function_description }
 *
 * @param      {<type>}  time    The time
 */
    this.seekAll = function(time)
    {
        for ( var i = 0, len = listOfVideoContents.length; i < len; i++ ) 
        {
            listOfVideoContents[i].vid.currentTime += time;
        }
    };


	/**
 * { function_description }
 */
    this.playButtonInteraction = function()
    {   
        PlayPauseMenuManager.isPausedById(0) ? PlayPauseMenuManager.playAll() : PlayPauseMenuManager.pauseAll();
    }

/**
 * { function_description }
 */
    this.pauseButtonInteraction = function()
    {
        PlayPauseMenuManager.isPausedById(0) ? PlayPauseMenuManager.playAll() : PlayPauseMenuManager.pauseAll();
    }

/**
 * Shows/Hides the play pause button depeding on the activeVideo status PlayPauseMenuManager.isPausedById(0) = true/false
 */
    this.showPlayPauseButton = function ()
    {
        if(PlayPauseMenuManager.isPausedById(0))
        {
            scene.getObjectByName(menuList[1].buttons[0]).visible = true; //menuList.playSeekMenu.playButton
            scene.getObjectByName(menuList[1].buttons[1]).visible = false; //menuList.playSeekMenu.pauseButton
            interController.removeInteractiveObject(menuList[1].buttons[1]);
            interController.addInteractiveObject(scene.getObjectByName(menuList[1].buttons[0])); //menuList.playSeekMenu.playButton
        }
        else
        {
            scene.getObjectByName(menuList[1].buttons[1]).visible = true; //menuList.playSeekMenu.pauseButton
            scene.getObjectByName(menuList[1].buttons[0]).visible = false; //menuList.playSeekMenu.playButton
            interController.removeInteractiveObject(menuList[1].buttons[0]);
            interController.addInteractiveObject(scene.getObjectByName(menuList[1].buttons[1])); //menuList.playSeekMenu.pauseButton
        }
    }

    /**
 * Creates the play/seek menu.
 *
 * @param      {<mesh>}  backgroundmenu  The backgroundmenu
 */
    this.createPlaySeekMenu = function (backgroundmenu, factorScale)
    {
        //The 4 main buttons are created inside a group 'playSeekGroup'
        var playSeekGroup =  new THREE.Group();
        var playbutton = menuData.getImageMesh( new THREE.PlaneGeometry( playPauseButtonWidth*factorScale,playPauseButtonHeight*factorScale ), './img/menu/play_icon.png', menuList[1].buttons[0], 4 ); // menuList.
        var pausebutton = menuData.getImageMesh( new THREE.PlaneGeometry( playPauseButtonWidth*factorScale,playPauseButtonHeight*factorScale ), './img/menu/pause_icon.png', menuList[1].buttons[1], 4 ); // menuList.
        var seekBarL = menuData.getImageMesh( new THREE.PlaneGeometry( seekButtonWidth*factorScale,seekButtonHeigth*factorScale ), './img/menu/seek_icon.png', menuList[1].buttons[2], 4 ); // menuList.
        var seekBarR = menuData.getImageMesh( new THREE.PlaneGeometry( seekButtonWidth*factorScale,seekButtonHeigth*factorScale ), './img/menu/seek_icon.png', menuList[1].buttons[3], 4 ); // menuList.
        
        var playouttime = menuData.getMenuTextMesh(PlayPauseMenuManager.getPlayoutTime(moData.getListOfVideoContents()[0].vid.currentTime), playoutFeedbackMenuTextSize, menuDefaultColor, 'playouttime');
        playouttime.visible = false;

        seekBarR.position.set(Math.cos(0)*(backgroundmenu.geometry.parameters.width/2 - seekButtonMarginX*factorScale), 0, 0.01);
        seekBarR.rotation.z = Math.PI;
        seekBarL.position.set(Math.cos(Math.PI)*(backgroundmenu.geometry.parameters.width/2 - seekButtonMarginX*factorScale), 0, 0.01);

        playSeekGroup.add( playbutton );
        playSeekGroup.add( pausebutton );
        playSeekGroup.add( seekBarR );
        playSeekGroup.add( seekBarL );
        playSeekGroup.add( playouttime );

        playSeekGroup.name = menuList[1].name; //menuList.playSeekMenu
        backgroundmenu.add(playSeekGroup);

        interController.setActiveMenuName(menuList[1].name); //menuList.playSeekMenu

        scene.add(backgroundmenu);
    }

    this.playoutTimeDisplayLogic = function(isPlay)
    {
        var timeoutFactor = 1;
        clearTimeout(playoutTimeout);

        scene.getObjectByName(menuList[1].buttons[0]).visible = false; //menuList.
        interController.removeInteractiveObject(menuList[1].buttons[0]); //menuList.

        scene.getObjectByName(menuList[1].buttons[1]).visible = false; //menuList.
        interController.removeInteractiveObject(menuList[1].buttons[1]); //menuList.

        createPlayoutTimeFeedback(
            menuData.getMenuTextMesh(PlayPauseMenuManager.getPlayoutTime(moData.getListOfVideoContents()[0].vid.currentTime), 
                playoutFeedbackMenuTextSize, 
                menuDefaultColor, 'playouttime'));

        if(isPlay)
        {
            timeoutFactor = 2;
            playoutTimeout =setTimeout(function(){    
                createPlayoutTimeFeedback(
                    menuData.getMenuTextMesh(PlayPauseMenuManager.getPlayoutTime(moData.getListOfVideoContents()[0].vid.currentTime), 
                        playoutFeedbackMenuTextSize, 
                        menuDefaultColor, 'playouttime'));
            }, visualFeedbackTimeout);
        }

        playoutTimeout = setTimeout(function(){ 
            scene.getObjectByName('playSeekMenu').remove(scene.getObjectByName('playouttime'));
            PlayPauseMenuManager.showPlayPauseButton();
        }, timeoutFactor*visualFeedbackTimeout);
    }

/**
 * { function_description }
 */
    function syncVideos()
    {
        for ( var i = 1, l = listOfVideoContents.length; i < l; i++ )
        {
            listOfVideoContents[i].vid.currentTime = listOfVideoContents[0].vid.currentTime;
        }
    }

    function createPlayoutTimeFeedback(newTime)
    {
        scene.getObjectByName('playSeekMenu').remove(scene.getObjectByName('playouttime'));           
        scene.getObjectByName('playSeekMenu').add(newTime)
        scene.getObjectByName('playouttime').visible = true;
    }

}

THREE.PlayPauseMenuManager.prototype.constructor = THREE.PlayPauseMenuManager;