THREE.SettingsCardboardMenuManager = function () {

/**
 * Creates a settings/cardboard menu.
 *
 * @param      {<mesh>}  backgroundmenu  The backgroundmenu
 */
    this.createSettingsCardboardMenu = function (backgroundmenu, factorScale)
    {
        //The 2 main buttons are created inside a group 'settingsCardboardGroup'
        var settingsCardboardGroup =  new THREE.Group();
        var settingsIcon = menuData.getImageMesh( new THREE.PlaneGeometry( settingsButtonWidth*factorScale, settingsButtonHeight*factorScale ), './img/menu/settings_icon.png', 'right', 4 );
        var cardboardIcon = menuData.getImageMesh( new THREE.PlaneGeometry( cardboardButtonWidth*factorScale, cardboardButtonHeight*factorScale ), './img/menu/cardboard_icon.png', 'right', 4 );
        
        settingsIcon.name = menuList[3].buttons[0]; // menuList.settingsCardboardMenu.settingsButton;
        cardboardIcon.name = menuList[3].buttons[1]; //menuList.settingsCardboardMenu.cardboadButton;

        cardboardIcon.position.x = backgroundmenu.geometry.parameters.width/4;
        cardboardIcon.position.z = menuElementsZ;
        settingsIcon.position.x = -backgroundmenu.geometry.parameters.width/4;
        settingsIcon.position.z = menuElementsZ;

        settingsCardboardGroup.add( cardboardIcon );
        settingsCardboardGroup.add( settingsIcon );

        settingsCardboardGroup.name = menuList[3].name; // menuList.settingsCardboardMenu
        settingsCardboardGroup.visible = false; //Not the first menu. Visibility false.

        backgroundmenu.add(settingsCardboardGroup);

        //scene.add( backgroundmenu );
    } 

}

THREE.SettingsCardboardMenuManager.prototype.constructor = THREE.SettingsCardboardMenuManager;