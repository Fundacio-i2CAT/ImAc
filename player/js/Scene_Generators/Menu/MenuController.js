/**
 * @author isaac.fraile@i2cat.net
 */

 // GLOBALS used: menuList, scene
 // Used class --> interController

THREE.MenuController = function () {

//************************************************************************************
// Private Functions
//************************************************************************************




//************************************************************************************
// Public Functions
//************************************************************************************

    this.showMultiOptionsButtons = function(menuIndexArray)
    {
        for ( var i = 0; i < menuIndexArray.length; i++ )
        {
            if( menuList[menuIndexArray[i][0]].isEnabled )
            {
                scene.getObjectByName( menuList[menuList[menuIndexArray[i][0]].firstmenuindex].buttons[menuIndexArray[i][1]] ).visible = true; //menuList.
                scene.getObjectByName( menuList[menuList[menuIndexArray[i][0]].firstmenuindex].buttons[menuIndexArray[i][2]] ).visible = false; //menuList.
            }
            else
            {
                scene.getObjectByName( menuList[menuList[menuIndexArray[i][0]].firstmenuindex].buttons[menuIndexArray[i][1]] ).visible = false; //menuList.
                scene.getObjectByName( menuList[menuList[menuIndexArray[i][0]].firstmenuindex].buttons[menuIndexArray[i][2]] ).visible = true; //menuList.
            }
        }
    };

    this.showOnOffToggleButton = function (subMenuIndex, onButtonName, offButtonName, enabledTitleIndex, disabledTitleIndex)
    {
        var mainMenuIndex = menuList[subMenuIndex].firstmenuindex;
        if ( menuList[subMenuIndex].isEnabled )
        {
            if (scene.getObjectByName( onButtonName )) scene.getObjectByName( onButtonName ).visible = true; 
            if (scene.getObjectByName( offButtonName )) scene.getObjectByName( offButtonName ).visible = false; 

            if(!_isTradMenuOpen)
            {
                scene.getObjectByName( menuList[subMenuIndex].name ).getObjectByName( menuList[mainMenuIndex].buttons[enabledTitleIndex] ).visible = true; 
                scene.getObjectByName( menuList[subMenuIndex].name ).getObjectByName( menuList[mainMenuIndex].buttons[disabledTitleIndex] ).visible = false; 
            }
            
            interController.removeInteractiveObject( offButtonName);
            interController.addInteractiveObject( scene.getObjectByName( onButtonName ) ); 
        }
        else
        {
            if (scene.getObjectByName( offButtonName )) scene.getObjectByName( offButtonName ).visible = true; 
            if (scene.getObjectByName( onButtonName )) scene.getObjectByName( onButtonName ).visible = false; 

            if(!_isTradMenuOpen)
            {
                scene.getObjectByName( menuList[subMenuIndex].name ).getObjectByName( menuList[mainMenuIndex].buttons[enabledTitleIndex] ).visible = false; 
                scene.getObjectByName( menuList[subMenuIndex].name ).getObjectByName( menuList[mainMenuIndex].buttons[disabledTitleIndex] ).visible = true; 
            }

            interController.removeInteractiveObject( onButtonName );
            interController.addInteractiveObject( scene.getObjectByName( offButtonName ) ); 
        }
    };


    this.showMuteUnmuteButton = function()
    {
        if(_AudioManager.getVolume()>0)
        {
            scene.getObjectByName( menuList[2].buttons[2] ).visible = false;
            scene.getObjectByName( menuList[2].buttons[3] ).visible = true; 
            interController.removeInteractiveObject( menuList[2].buttons[2] );
            interController.addInteractiveObject( scene.getObjectByName( menuList[2].buttons[3] ) );
        }
        else
        {
            scene.getObjectByName( menuList[2].buttons[3] ).visible = false;
            scene.getObjectByName( menuList[2].buttons[2] ).visible = true; 
            interController.removeInteractiveObject( menuList[2].buttons[3] );
            interController.addInteractiveObject( scene.getObjectByName( menuList[2].buttons[2] ) );
        }
    };

    this.volumeLevelDisplayLogic = function()
    {
        scene.getObjectByName(menuList[2].buttons[2]).visible = false; 
        interController.removeInteractiveObject(menuList[2].buttons[2]); 

        scene.getObjectByName(menuList[2].buttons[3]).visible = false; 
        interController.removeInteractiveObject(menuList[2].buttons[3]); 

        var oldText = scene.getObjectByName('volumeLevel');
        scene.getObjectByName('volumeChangeMenu').remove(oldText);

        if(!_isTradMenuOpen) 
        {
            var newText = _moData.getMenuTextMesh(_AudioManager.getVolume()*100+'%', volFeedbackMenuTextSize, menuDefaultColor, 'volumeLevel');
        }
        else
        {
            var newText = _moData.getMenuTextMesh(_AudioManager.getVolume()*100+'%', 1.25, menuDefaultColor, 'volumeLevel');
            newText.position.x  = oldText.position.x;
        }
        scene.getObjectByName('volumeChangeMenu').add(newText)
        scene.getObjectByName('volumeLevel').visible = true;

        setTimeout(function(){ 
            MenuController.showMuteUnmuteButton();
            scene.getObjectByName('volumeLevel').visible = false;
        }, visualFeedbackTimeout);
    };

    this.closeMenu = function()
    {
        if ( interController.getSubtitlesActive() ) subController.enableSubtitles();
        MenuManager.pressButtonFeedback( name );
        setTimeout(function() {
            MenuManager.closeMenu(); 
            scene.getObjectByName( "openMenu" ).visible = true;
            //scene.getObjectByName( "openMenuTrad" ).visible = true; //EXPERIMENTAL
        }, clickInteractionTimeout);
    };


    var playoutTimeout;
  

/**
 * Shows/Hides the play pause button depeding on the activeVideo status ppMMgr.isPausedById(0) = true/false
 */
    this.showPlayPauseButton = function ()
    {
        if(VideoController.isPausedById(0))
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
                _moData.getMenuTextMesh(VideoController.getPlayoutTime(VideoController.getListOfVideoContents()[0].vid.currentTime), 
                    playoutFeedbackMenuTextSize, 
                    menuDefaultColor, 'playouttime'));

            if(isPlay)
            {
                timeoutFactor = 1;
                playoutTimeout =setTimeout(function(){    
                    createPlayoutTimeFeedback(
                        _moData.getMenuTextMesh(VideoController.getPlayoutTime(VideoController.getListOfVideoContents()[0].vid.currentTime), 
                            playoutFeedbackMenuTextSize, 
                            menuDefaultColor, 'playouttime'));
                }, visualFeedbackTimeout);
            }
        }


        playoutTimeout = setTimeout(function(){ 
            scene.getObjectByName('playSeekMenu').remove(scene.getObjectByName('playouttime'));
            MenuController.showPlayPauseButton();
        }, timeoutFactor*visualFeedbackTimeout);
    }



    function createPlayoutTimeFeedback(newTime)
    {
        scene.getObjectByName('playSeekMenu').remove(scene.getObjectByName('playouttime'));           
        scene.getObjectByName('playSeekMenu').add(newTime)
        scene.getObjectByName('playouttime').visible = true;
    }

}

THREE.MenuController.prototype.constructor = THREE.MenuController;