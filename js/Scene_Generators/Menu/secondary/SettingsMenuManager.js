THREE.SettingsMenuManager = function () {

    this.openMenu = function (backgroundmenu)
    {
    	var menuList = MenuManager.getMenuList();
        var settingsIcon = scene.getObjectByName(menuList[3].buttons[0]).clone(); // menuList.settingsCardboardMenu.settingsButton
        var settingsMenuGroup =  new THREE.Group();

        var linesMenuGroup = menuData.menuLineVerticalDivisions(backgroundmenu, menuDefaultColor);

        //function menuLineHoritzontalDivisions(color, numberofdivisions, backgroundmenu, row)
        var firstColumnLines = menuData.menuLineHoritzontalDivisions(menuDefaultColor, 3, backgroundmenu, 1);
        linesMenuGroup.add(firstColumnLines);

        settingsMenuGroup.add( linesMenuGroup );

        settingsIcon.scale.set(0.75, 0.75, 1);
        settingsIcon.position.x = -backgroundmenu.geometry.parameters.width/3;
        settingsMenuGroup.add(settingsIcon);

        var settingsLanguageButton = menuData.getMenuTextMesh('Languages', subMenuTextSize, menuDefaultColor, menuList[5].buttons[0]); //menuList
        // TODO- CREATE DYNAMIC FUNCTION FOR FIRST COLUMN ELEMENTS

        settingsLanguageButton.position.y = backgroundmenu.geometry.parameters.height/3
        settingsMenuGroup.add(settingsLanguageButton);
        settingsMenuGroup.add(MenuManager.dropdownSubMenuCreation(backgroundmenu, menuList[5].submenus[0],settingsLanguagesArray));


        var settingsVoiceControlButton = menuData.getMenuTextMesh('Voice control', subMenuTextSize, menuDefaultColor, menuList[5].buttons[1]); //menuList.

        var factor = (2*1)+1;
        settingsVoiceControlButton.position.y = (backgroundmenu.geometry.parameters.height/2-factor*backgroundmenu.geometry.parameters.height/(3*2))-(settingsVoiceControlButton.children[0].geometry.parameters.height/4);
        settingsMenuGroup.add(settingsVoiceControlButton);
        settingsMenuGroup.add(MenuManager.dropdownSubMenuCreation(backgroundmenu, menuList[5].submenus[1],settingsVoiceControlArray));

        var settingsUserProfileButton = menuData.getMenuTextMesh('User Profile', subMenuTextSize, menuDefaultColor, menuList[5].buttons[2]); //menuList.
        
        var factor = (2*2)+1;
        settingsUserProfileButton.position.y = (backgroundmenu.geometry.parameters.height/2-factor*backgroundmenu.geometry.parameters.height/(3*2))-(settingsUserProfileButton.children[0].geometry.parameters.height/4);
        settingsMenuGroup.add(settingsUserProfileButton);
        settingsMenuGroup.add(MenuManager.dropdownSubMenuCreation(backgroundmenu, menuList[5].submenus[2], settingsUserProfileArray));
       
        settingsMenuGroup.name = menuList[5].name; //menuList.
        settingsMenuGroup.visible = false; //Not the first menu. Visibility false.
        backgroundmenu.add(settingsMenuGroup);
        scene.add( backgroundmenu );
    }
}

THREE.SettingsMenuManager.prototype.constructor = THREE.SettingsMenuManager;