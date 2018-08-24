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

    this.showOnOffToggleButton = function (subMenuIndex, onButtonIndex, offButtonIndex, enabledTitleIndex, disabledTitleIndex)
    {
        var mainMenuIndex = menuList[subMenuIndex].firstmenuindex;
        if ( menuList[subMenuIndex].isEnabled )
        {
            scene.getObjectByName( menuList[subMenuIndex].buttons[onButtonIndex] ).visible = true; 
            scene.getObjectByName( menuList[subMenuIndex].buttons[offButtonIndex] ).visible = false; 


            scene.getObjectByName( menuList[subMenuIndex].name ).getObjectByName( menuList[mainMenuIndex].buttons[enabledTitleIndex] ).visible = true; 
            scene.getObjectByName( menuList[subMenuIndex].name ).getObjectByName( menuList[mainMenuIndex].buttons[disabledTitleIndex] ).visible = false; 

            interController.removeInteractiveObject( menuList[subMenuIndex].buttons[offButtonIndex]);
            interController.addInteractiveObject( scene.getObjectByName( menuList[subMenuIndex].buttons[onButtonIndex] ) ); 
        }
        else
        {
            scene.getObjectByName( menuList[subMenuIndex].buttons[offButtonIndex] ).visible = true; 
            scene.getObjectByName( menuList[subMenuIndex].buttons[onButtonIndex] ).visible = false; 

            scene.getObjectByName( menuList[subMenuIndex].name ).getObjectByName( menuList[mainMenuIndex].buttons[enabledTitleIndex] ).visible = false; 
            scene.getObjectByName( menuList[subMenuIndex].name ).getObjectByName( menuList[mainMenuIndex].buttons[disabledTitleIndex] ).visible = true; 

            interController.removeInteractiveObject( menuList[subMenuIndex].buttons[onButtonIndex] );
            interController.addInteractiveObject( scene.getObjectByName( menuList[subMenuIndex].buttons[offButtonIndex] ) ); 
        }
    };

    this.showMuteUnmuteButton = function()
    {
        if(AudioManager.getVolume()>0)
        {
            scene.getObjectByName( menuList[2].buttons[2] ).visible = false; //menuList.volumeChangeMenu.unmuteVolumeButton
            scene.getObjectByName( menuList[2].buttons[3] ).visible = true; //menuList.volumeChangeMenu.muteVolumeButton
            interController.removeInteractiveObject( menuList[2].buttons[2] ); //menuList.volumeChangeMenu.unmuteVolumeButton
            interController.addInteractiveObject( scene.getObjectByName( menuList[2].buttons[3] ) ); //menuList.volumeChangeMenu.muteVolumeButton
        }
        else
        {
            scene.getObjectByName( menuList[2].buttons[3] ).visible = false; //menuList.volumeChangeMenu.muteVolumeButton
            scene.getObjectByName( menuList[2].buttons[2] ).visible = true; //menuList.volumeChangeMenu.unmuteVolumeButton
            interController.removeInteractiveObject( menuList[2].buttons[3] ); //menuList.volumeChangeMenu.muteVolumeButton
            interController.addInteractiveObject( scene.getObjectByName( menuList[2].buttons[2] ) ); //menuList.volumeChangeMenu.unMuteVolumeButton
        }
    };

    this.volumeLevelDisplayLogic = function()
    {
        if(!_isTradMenuOpen) 
        {
            scene.getObjectByName(menuList[2].buttons[2]).visible = false; //menuList.volumeChangeMenu.unmuteVolumeButton
            interController.removeInteractiveObject(menuList[2].buttons[2]); //menuList.volumeChangeMenu.unmuteVolumeButton

            scene.getObjectByName(menuList[2].buttons[3]).visible = false; //menuList.volumeChangeMenu.muteVolumeButton
            interController.removeInteractiveObject(menuList[2].buttons[3]); //menuList.volumeChangeMenu.muteVolumeButton

            scene.getObjectByName('volumeChangeMenu').remove(scene.getObjectByName('volumeLevel'));
            var newText = menuData.getMenuTextMesh(AudioManager.getVolume()*100+'%', volFeedbackMenuTextSize, menuDefaultColor, 'volumeLevel');
            scene.getObjectByName('volumeChangeMenu').add(newText)
            scene.getObjectByName('volumeLevel').visible = true;
        }


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

}

THREE.MenuController.prototype.constructor = THREE.MenuController;