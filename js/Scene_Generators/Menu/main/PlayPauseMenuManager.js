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
 * Shows/Hides the play pause button depeding on the activeVideo status ppMMgr.isPausedById(0) = true/false
 */
    this.showPlayPauseButton = function ()
    {
        if(ppMMgr.isPausedById(0))
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

    this.playoutTimeDisplayLogic = function(isPlay)
    {
        if(!_isTradMenuOpen)
        {
            var timeoutFactor = 1;
            clearTimeout(playoutTimeout);

            scene.getObjectByName(menuList[1].buttons[0]).visible = false; 
            interController.removeInteractiveObject(menuList[1].buttons[0]); 

            scene.getObjectByName(menuList[1].buttons[1]).visible = false; 
            interController.removeInteractiveObject(menuList[1].buttons[1]);

            createPlayoutTimeFeedback(
                menuData.getMenuTextMesh(ppMMgr.getPlayoutTime(moData.getListOfVideoContents()[0].vid.currentTime), 
                    playoutFeedbackMenuTextSize, 
                    menuDefaultColor, 'playouttime'));

            if(isPlay)
            {
                timeoutFactor = 1;
                playoutTimeout =setTimeout(function(){    
                    createPlayoutTimeFeedback(
                        menuData.getMenuTextMesh(ppMMgr.getPlayoutTime(moData.getListOfVideoContents()[0].vid.currentTime), 
                            playoutFeedbackMenuTextSize, 
                            menuDefaultColor, 'playouttime'));
                }, visualFeedbackTimeout);
            }
        }


        playoutTimeout = setTimeout(function(){ 
            scene.getObjectByName('playSeekMenu').remove(scene.getObjectByName('playouttime'));
            ppMMgr.showPlayPauseButton();
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