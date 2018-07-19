THREE.VolumeMenuManager = function () {

/**
 * Shows/Hides the mute unmute button depending on the activeVideo volume AudioManager.getVolume()>0 
 */
    this.showMuteUnmuteButton = function()
    {
        if(AudioManager.getVolume()>0)
        {
            scene.getObjectByName(menuList[2].buttons[2]).visible = false; //menuList.volumeChangeMenu.unmuteVolumeButton
            scene.getObjectByName(menuList[2].buttons[3]).visible = true; //menuList.volumeChangeMenu.muteVolumeButton
            interController.removeInteractiveObject(menuList[2].buttons[2]); //menuList.volumeChangeMenu.unmuteVolumeButton
            interController.addInteractiveObject(scene.getObjectByName(menuList[2].buttons[3])); //menuList.volumeChangeMenu.muteVolumeButton
        }
        else
        {
            scene.getObjectByName(menuList[2].buttons[3]).visible = false; //menuList.volumeChangeMenu.muteVolumeButton
            scene.getObjectByName(menuList[2].buttons[2]).visible = true; //menuList.volumeChangeMenu.unmuteVolumeButton
            interController.removeInteractiveObject(menuList[2].buttons[3]); //menuList.volumeChangeMenu.muteVolumeButton
            interController.addInteractiveObject(scene.getObjectByName(menuList[2].buttons[2])); //menuList.volumeChangeMenu.unMuteVolumeButton
        }
    }


// TODO CHANGE TO DIFFERENT SMALL FUNCTIONS 

    this.volumeLevelDispolayLogic = function(boolean)
    {
    	if(!boolean)
    	{
    	if(AudioManager.getVolume()>0)
        {
            scene.getObjectByName('muteVolumeButton').visible = false; //menuList.volumeChangeMenu.unmuteVolumeButton
            interController.removeInteractiveObject('muteVolumeButton'); //menuList.volumeChangeMenu.unmuteVolumeButton
        }
        else
        {
            scene.getObjectByName('unmuteVolumeButton').visible = false; //menuList.volumeChangeMenu.muteVolumeButton
            interController.removeInteractiveObject('unmuteVolumeButton'); //menuList.volumeChangeMenu.muteVolumeButton
        }
        scene.getObjectByName('volumeChangeMenu').remove(scene.getObjectByName('volumeLevel'));
        var newText = menuData.getMenuTextMesh(AudioManager.getVolume()*100+'%', volFeedbackMenuTextSize, menuDefaultColor, 'volumeLevel');
        console.log(newText.children[0].geometry.parameters.width);
        scene.getObjectByName('volumeChangeMenu').add(newText)
        scene.getObjectByName('volumeLevel').visible = true;
        interController.removeInteractiveObject(name); //menuList.volumeChangeMenu.
        setTimeout(function(){ 
            VolumeMenuManager.showMuteUnmuteButton();
            scene.getObjectByName('volumeLevel').visible = false;
            interController.addInteractiveObject(scene.getObjectByName(name)); //menuList.volumeChangeMenu.
             }, 1000);
    	}
    	else
    	{
    		if(AudioManager.getVolume()>0)
            {
                scene.getObjectByName('muteVolumeButton').visible = false; //menuList.volumeChangeMenu.unmuteVolumeButton
                interController.removeInteractiveObject('muteVolumeButton'); //menuList.volumeChangeMenu.unmuteVolumeButton
            }
            else
            {
                scene.getObjectByName('unmuteVolumeButton').visible = false; //menuList.volumeChangeMenu.muteVolumeButton
                interController.removeInteractiveObject('unmuteVolumeButton'); //menuList.volumeChangeMenu.muteVolumeButton
            }

            scene.getObjectByName('volumeChangeMenu').remove(scene.getObjectByName('volumeLevel'));
            var newText = menuData.getMenuTextMesh(AudioManager.getVolume()*100+'%', volFeedbackMenuTextSize, menuDefaultColor, 'volumeLevel');
            scene.getObjectByName('volumeChangeMenu').add(newText)
            scene.getObjectByName('volumeLevel').visible = true;
            interController.removeInteractiveObject(name); //menuList.volumeChangeMenu.
            setTimeout(function(){ 
                VolumeMenuManager.showMuteUnmuteButton();
                scene.getObjectByName('volumeLevel').visible = false;
                interController.addInteractiveObject(scene.getObjectByName(name)); //menuList.volumeChangeMenu.
                 }, 1000);         	
    	}          
    }

    /**
 * Creates a volume change mute/unmute menu.
 *
 * @param      {<mesh>}  backgroundmenu  The backgroundmenu
 */
    this.createVolumeChangeMenu = function (backgroundmenu, factorScale)
    {
        //The 4 main buttons are created inside a group 'volumeChangeGroup'
        var volumeChangeGroup =  new THREE.Group();
        var plusVolume = menuData.getPlusIconMesh( volumeLevelButtonWidth, volumeLevelButtonHeight,factorScale, menuDefaultColor,  menuList[2].buttons[1]);
        var audioMuteIcon = menuData.getImageMesh( new THREE.PlaneGeometry( muteUnmuteButtonWidth*factorScale,muteUnmuteButtonHeight*factorScale ), './img/menu/audio_volume_icon.png', menuList[2].buttons[3], 4 ); // menuList.volumeChangeMenu.muteVolumeButton
        var audioUnmuteIcon = menuData.getImageMesh( new THREE.PlaneGeometry( muteUnmuteButtonWidth*factorScale,muteUnmuteButtonHeight*factorScale ), './img/menu/audio_volume_mute_icon.png', menuList[2].buttons[2], 4 ); // menuList.volumeChangeMenu.unmuteVolumeButton
        var minusVolume = menuData.getMinusIconMesh( volumeLevelButtonWidth, volumeLevelButtonHeight, factorScale, menuDefaultColor,  menuList[2].buttons[0] );
        var volumeLevel = menuData.getMenuTextMesh(AudioManager.getVolume()*100+'%', volFeedbackMenuTextSize, menuDefaultColor, 'volumeLevel');
        volumeLevel.position.x -= 20; 
        volumeLevel.visible = false;

        plusVolume.position.set(backgroundmenu.geometry.parameters.width/2 - volumeLevelMarginX*factorScale, 0, 0.01);
        minusVolume.position.set(-(backgroundmenu.geometry.parameters.width/2 - volumeLevelMarginX*factorScale), 0, 0.01);
        
        audioMuteIcon.position.z = 1;
        audioUnmuteIcon.position.z = 1;

        volumeChangeGroup.add( plusVolume );
        volumeChangeGroup.add( audioMuteIcon );
        volumeChangeGroup.add( audioUnmuteIcon );
        volumeChangeGroup.add( minusVolume );
        volumeChangeGroup.add( volumeLevel );

        volumeChangeGroup.name = menuList[2].name; // menuList.volumeChangeMenu
        volumeChangeGroup.visible = false; //Not the first menu. Visibility false.
        backgroundmenu.add(volumeChangeGroup);

        scene.add( backgroundmenu );
    }

}

THREE.VolumeMenuManager.prototype.constructor = THREE.VolumeMenuManager;