THREE.PlayPauseMenuManager = function () {

	/**
 * { function_description }
 */
    this.playButtonInteraction = function()
    {   
        moData.isPausedById(0) ? moData.playAll() : moData.pauseAll();
        setTimeout(function(){ PlayPauseMenuManager.showPlayPauseButton(); }, clickInteractionTimeout);
    }

/**
 * { function_description }
 */
    this.pauseButtonInteraction = function()
    {
        moData.isPausedById(0) ? moData.playAll() : moData.pauseAll();
        setTimeout(function(){ PlayPauseMenuManager.showPlayPauseButton(); }, clickInteractionTimeout);
    }

/**
 * Shows/Hides the play pause button depeding on the activeVideo status moData.isPausedById(0) = true/false
 */
    this.showPlayPauseButton = function ()
    {
        if(moData.isPausedById(0))
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
        var playbutton = menuData.getPlayMesh(playPauseButtonWidth, playPauseButtonHeight, factorScale, menuDefaultColor, menuList[1].buttons[0]);
        var pausebutton = menuData.getPauseMesh(playPauseButtonWidth, playPauseButtonHeight, factorScale, menuDefaultColor, menuList[1].buttons[1]);
        var seekBarL = menuData.getSeekMesh( seekButtonWidth, seekButtonHeigth, factorScale, menuDefaultColor, Math.PI, menuList[1].buttons[2]);
        var seekBarR = menuData.getSeekMesh( seekButtonWidth, seekButtonHeigth, factorScale, menuDefaultColor, 0, menuList[1].buttons[3]);
        
        seekBarR.position.set(Math.cos(0)*(backgroundmenu.geometry.parameters.width/2 - seekButtonMarginX*factorScale), 0, 0.01)
        seekBarL.position.set(Math.cos(Math.PI)*(backgroundmenu.geometry.parameters.width/2 - seekButtonMarginX*factorScale), 0, 0.01)

        playSeekGroup.add( playbutton );
        playSeekGroup.add( pausebutton );
        playSeekGroup.add( seekBarR );
        playSeekGroup.add( seekBarL );

        playSeekGroup.name = menuList[1].name; //menuList.playSeekMenu
        backgroundmenu.add(playSeekGroup);

        interController.setActiveMenuName(menuList[1].name); //menuList.playSeekMenu

        scene.add(backgroundmenu);
    }


}

THREE.PlayPauseMenuManager.prototype.constructor = THREE.PlayPauseMenuManager;