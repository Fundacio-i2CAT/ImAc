THREE.SettingsMenuManager = function () {

    this.openSettingsMenu = function (backgroundmenu)
    {
    	var menuList = MenuManager.getMenuList();
        var settingsIcon = scene.getObjectByName(menuList[3].buttons[0]).clone(); // menuList.settingsCardboardMenu.settingsButton
        menuData.getMenuTextMesh('Languanges', 10, 0xffffff, menuList[5].buttons[0], function(settingsLanguageButton) //menuList.
        {
            var settingsMenuGroup =  new THREE.Group();

            var linesMenuGroup = menuData.menuLineVerticalDivisions(backgroundmenu, 0xffffff);

            //function menuLineHoritzontalDivisions(color, numberofdivisions, backgroundmenu, row)
            var firstColumnLines = menuData.menuLineHoritzontalDivisions(0xffffff, 3, backgroundmenu, 1);
            linesMenuGroup.add(firstColumnLines);

            settingsMenuGroup.add( linesMenuGroup );
            
            settingsIcon.scale.set(0.75, 0.75, 1);
            settingsIcon.position.x = -backgroundmenu.geometry.parameters.width/3;;

            settingsLanguageButton.material.color.setHex( 0xffff00 );

            settingsLanguageButton.position.x = -settingsLanguageButton.children[0].geometry.parameters.width/2;
            settingsLanguageButton.position.y = -settingsLanguageButton.children[0].geometry.parameters.height/4;

            settingsMenuGroup.add(settingsLanguageButton);

            settingsMenuGroup.add(MenuManager.dropdownSubMenuCreation(backgroundmenu, menuList[5].submenus[0]));
            settingsMenuGroup.add(settingsIcon);

            settingsMenuGroup.name = menuList[5].name; //menuList.
            settingsMenuGroup.visible = false; //Not the first menu. Visibility false.

            backgroundmenu.add(settingsMenuGroup);
            scene.add( backgroundmenu );
         });
    }
}

THREE.SettingsMenuManager.prototype.constructor = THREE.SettingsMenuManager;
