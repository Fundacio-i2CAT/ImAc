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

    this.volumeLevelDisplayLogic = function()
    {
        scene.getObjectByName(menuList[2].buttons[2]).visible = false; //menuList.volumeChangeMenu.unmuteVolumeButton
        interController.removeInteractiveObject(menuList[2].buttons[2]); //menuList.volumeChangeMenu.unmuteVolumeButton

        scene.getObjectByName(menuList[2].buttons[3]).visible = false; //menuList.volumeChangeMenu.muteVolumeButton
        interController.removeInteractiveObject(menuList[2].buttons[3]); //menuList.volumeChangeMenu.muteVolumeButton

        scene.getObjectByName('volumeChangeMenu').remove(scene.getObjectByName('volumeLevel'));
        var newText = menuData.getMenuTextMesh(AudioManager.getVolume()*100+'%', volFeedbackMenuTextSize, menuDefaultColor, 'volumeLevel');
        scene.getObjectByName('volumeChangeMenu').add(newText)
        scene.getObjectByName('volumeLevel').visible = true;
        setTimeout(function(){ 
            VolumeMenuManager.showMuteUnmuteButton();
            scene.getObjectByName('volumeLevel').visible = false;
             }, visualFeedbackTimeout);
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
        //var plusVolume = menuData.getPlusIconMesh( volumeLevelButtonWidth, volumeLevelButtonHeight,factorScale, menuDefaultColor,  menuList[2].buttons[1]);
        var audioMuteIcon = menuData.getImageMesh( new THREE.PlaneGeometry( muteUnmuteButtonWidth*factorScale,muteUnmuteButtonHeight*factorScale ), './img/menu/volume_mute_icon.png', menuList[2].buttons[3], 4 ); // menuList.volumeChangeMenu.muteVolumeButton
        var audioUnmuteIcon = menuData.getImageMesh( new THREE.PlaneGeometry( muteUnmuteButtonWidth*factorScale,muteUnmuteButtonHeight*factorScale ), './img/menu/volume_unmute_icon.png', menuList[2].buttons[2], 4 ); // menuList.volumeChangeMenu.unmuteVolumeButton
        
        var minusVolume = menuData.getImageMesh( new THREE.PlaneGeometry( volumeLevelButtonWidth*factorScale, volumeLevelButtonHeight*factorScale ), './img/menu/minus_icon.png', menuList[2].buttons[0], 4 ); // menuList.volumeChangeMenu.
        var plusVolume = menuData.getImageMesh( new THREE.PlaneGeometry( volumeLevelButtonWidth*factorScale, volumeLevelButtonHeight*factorScale ), './img/menu/plus_icon.png', menuList[2].buttons[1], 4 ); // menuList.volumeChangeMenu.
        
        var volumeLevel = menuData.getMenuTextMesh(AudioManager.getVolume()*100+'%', volFeedbackMenuTextSize, menuDefaultColor, 'volumeLevel');
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