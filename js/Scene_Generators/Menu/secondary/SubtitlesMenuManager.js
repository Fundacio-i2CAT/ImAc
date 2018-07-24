THREE.SubtitlesMenuManager = function () {

/**
 * Opens a subtitles menu.
 *
 * @param      {<type>}  backgroundmenu  The backgroundmenu
 */

    this.openMenu = function(backgroundmenu)
    {
    	var title = menuData.getMenuTextMesh('ST', 22, menuDefaultColor, menuList[4].buttons[0]); //menuList.multiOptionsMenu.showSubtitleMenuButton;                
        var disabledTitle = menuData.getImageMesh( new THREE.PlaneGeometry( 50*factorScale,59*factorScale ), './img/menu/disabled_st_icon.png', menuList[4].buttons[4], 4 ); // menuList.

        var menuGroup =  new THREE.Group();

        var linesMenuGroup = menuData.menuLineVerticalDivisions(backgroundmenu, menuDefaultColor);

        //function menuLineHoritzontalDivisions(color, numberofdivisions, backgroundmenu, row)
        var firstColumnLines = menuData.menuLineHoritzontalDivisions(menuDefaultColor, 4, backgroundmenu, 1);
        linesMenuGroup.add(firstColumnLines);

        menuGroup.add( linesMenuGroup );


        // TODO- CREATE DYNAMIC FUNCTION FOR FIRST COLUMN ELEMENTS

        var onButton = menuData.getImageMesh( new THREE.PlaneGeometry( 40*factorScale,22.5*factorScale ), './img/menu/toggle_on.png', menuList[6].buttons[0], 4 ); // menuList.
        onButton.position.set(-backgroundmenu.geometry.parameters.width/3, 3*backgroundmenu.geometry.parameters.height/8, menuElementsZ)
        menuGroup.add(onButton);

        var offButton = menuData.getImageMesh( new THREE.PlaneGeometry( 40*factorScale,22.5*factorScale ), './img/menu/toggle_off.png', menuList[6].buttons[1], 4 ); // menuList.
        offButton.position.set(-backgroundmenu.geometry.parameters.width/3, 3*backgroundmenu.geometry.parameters.height/8, menuElementsZ)
        menuGroup.add(offButton);

        var subtitleShowLanguagesDropdown = menuData.getMenuTextMesh('Languages', subMenuTextSize, menuDefaultColor, menuList[6].buttons[2]); //menuList
        subtitleShowLanguagesDropdown.position.y = 3*backgroundmenu.geometry.parameters.height/8;
        menuGroup.add(subtitleShowLanguagesDropdown);
        menuGroup.add( MenuManager.dropdownSubMenuCreation(backgroundmenu, menuList[6].submenus[0], subtitlesLanguagesArray ));

        var subtitleShowPositionsDropdown = menuData.getMenuTextMesh('Position', subMenuTextSize, menuDefaultColor, menuList[6].buttons[3]); //menuList
        subtitleShowPositionsDropdown.position.y = 1*backgroundmenu.geometry.parameters.height/8
        menuGroup.add(subtitleShowPositionsDropdown);
        menuGroup.add( MenuManager.dropdownSubMenuCreation(backgroundmenu, menuList[6].submenus[1], subtitlesPositionArray));

        var subtitleShowAreasDropdown = menuData.getMenuTextMesh('Size', subMenuTextSize, menuDefaultColor, menuList[6].buttons[4]); //menuList
        subtitleShowAreasDropdown.position.y = -1*backgroundmenu.geometry.parameters.height/8;
        menuGroup.add(subtitleShowAreasDropdown);
        menuGroup.add( MenuManager.dropdownSubMenuCreation(backgroundmenu, menuList[6].submenus[2], subtitlesSizeArray ));

        var subtitleShowIndicatorDropdown = menuData.getMenuTextMesh('Indicator', subMenuTextSize, menuDefaultColor, menuList[6].buttons[5]); //menuList
        subtitleShowIndicatorDropdown.position.y = -3*backgroundmenu.geometry.parameters.height/8;
        menuGroup.add(subtitleShowIndicatorDropdown);
        menuGroup.add( MenuManager.dropdownSubMenuCreation(backgroundmenu, menuList[6].submenus[3], subtitlesIndicatorArray ));

        interController.removeInteractiveObject (menuList[4].buttons[0]);

        title.material.color.set( 0xffff00 );

        title.position.x = -backgroundmenu.geometry.parameters.width/3;
        disabledTitle.position.x = -backgroundmenu.geometry.parameters.width/3;
        title.position.z = menuElementsZ;
        disabledTitle.position.z = menuElementsZ;
        
        menuGroup.add(title);
        menuGroup.add(disabledTitle);
    
        menuGroup.name = menuList[6].name; //menuList.
        menuGroup.visible = false; //Not the first menu. Visibility false.

        backgroundmenu.add(menuGroup);
        scene.add( backgroundmenu );
    }
}

THREE.SubtitlesMenuManager.prototype.constructor = THREE.SubtitlesMenuManager;