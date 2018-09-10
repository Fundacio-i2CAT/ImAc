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
            scene.getObjectByName( onButtonName ).visible = true; 
            scene.getObjectByName( offButtonName ).visible = false; 

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
            scene.getObjectByName( offButtonName ).visible = true; 
            scene.getObjectByName( onButtonName ).visible = false; 

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
        if(AudioManager.getVolume()>0)
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
            var newText = menuData.getMenuTextMesh(AudioManager.getVolume()*100+'%', volFeedbackMenuTextSize, menuDefaultColor, 'volumeLevel');
        }
        else
        {
            var newText = menuData.getMenuTextMesh(AudioManager.getVolume()*100+'%', 1.25, menuDefaultColor, 'volumeLevel');
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

}

THREE.MenuController.prototype.constructor = THREE.MenuController;