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
            volMMgr.showMuteUnmuteButton();
            scene.getObjectByName('volumeLevel').visible = false;
             }, visualFeedbackTimeout);
    }
}

THREE.VolumeMenuManager.prototype.constructor = THREE.VolumeMenuManager;