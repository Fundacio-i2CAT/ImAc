THREE.SubtitleMenuManager = function () {

/**
 * Changes the state of the ON/OFF toggle button
 * THIS FUNCTIONS WILL CHANGE TO MENUMANAGER AS A GENERAL FUNCTION OF ALL THE MULTI OPTIONS MENUS.
 */
    this.showOnOffToggleButton = function ()
    {
        if(menuList[6].isEnabled)
        {
            scene.getObjectByName(menuList[6].buttons[0]).visible = true; //menuList.
            scene.getObjectByName(menuList[6].buttons[1]).visible = false; //menuList.


            scene.getObjectByName(menuList[6].name).getObjectByName(menuList[4].buttons[0]).visible = true; //menuList.
            scene.getObjectByName(menuList[6].name).getObjectByName(menuList[4].buttons[4]).visible = false; //menuList.

            interController.removeInteractiveObject(menuList[6].buttons[1]);
            interController.addInteractiveObject(scene.getObjectByName(menuList[6].buttons[0])); //menuList.
        }
        else
        {
            scene.getObjectByName(menuList[6].buttons[1]).visible = true; //menuList.
            scene.getObjectByName(menuList[6].buttons[0]).visible = false; //menuList.

            scene.getObjectByName(menuList[6].name).getObjectByName(menuList[4].buttons[0]).visible = false; //menuList.
            scene.getObjectByName(menuList[6].name).getObjectByName(menuList[4].buttons[4]).visible = true; //menuList.

            interController.removeInteractiveObject(menuList[6].buttons[0]);
            interController.addInteractiveObject(scene.getObjectByName(menuList[6].buttons[1])); //menuList.
        }
    }

    this.openSubtitleMenu = function(backgroundmenu)
    {
    	var subtitlesMenuTitle = menuData.getMenuTextMesh('ST', 22, menuDefaultColor, menuList[4].buttons[0]); //menuList.multiOptionsMenu.showSubtitleMenuButton;                
        var disabledSubtitles = menuData.getImageMesh( new THREE.PlaneGeometry( 50*factorScale,59*factorScale ), './img/menu/disabled_st_icon.png', menuList[4].buttons[4], 4 ); // menuList.

        var subtitlesMenuGroup =  new THREE.Group();

        var linesMenuGroup = menuData.menuLineVerticalDivisions(backgroundmenu, menuDefaultColor);

        //function menuLineHoritzontalDivisions(color, numberofdivisions, backgroundmenu, row)
        var firstColumnLines = menuData.menuLineHoritzontalDivisions(menuDefaultColor, 4, backgroundmenu, 1);
        linesMenuGroup.add(firstColumnLines);

        subtitlesMenuGroup.add( linesMenuGroup );


        // TODO- CREATE DYNAMIC FUNCTION FOR FIRST COLUMN ELEMENTS

        var onButton = menuData.getImageMesh( new THREE.PlaneGeometry( 40*factorScale,22.5*factorScale ), './img/menu/toggle_on.png', menuList[6].buttons[0], 4 ); // menuList.
        onButton.position.x = (-backgroundmenu.geometry.parameters.width/3);
        onButton.position.y = 3*backgroundmenu.geometry.parameters.height/8;
        subtitlesMenuGroup.add(onButton);

        var offButton = menuData.getImageMesh( new THREE.PlaneGeometry( 40*factorScale,22.5*factorScale ), './img/menu/toggle_off.png', menuList[6].buttons[1], 4 ); // menuList.
        offButton.position.x = (-backgroundmenu.geometry.parameters.width/3);
        offButton.position.y = 3*backgroundmenu.geometry.parameters.height/8;
        subtitlesMenuGroup.add(offButton);

        var subtitleShowLanguagesDropdown = menuData.getMenuTextMesh('Languages', subMenuTextSize, menuDefaultColor, menuList[6].buttons[2]); //menuList
        subtitleShowLanguagesDropdown.position.y = 3*backgroundmenu.geometry.parameters.height/8;
        subtitlesMenuGroup.add(subtitleShowLanguagesDropdown);
        subtitlesMenuGroup.add( MenuManager.dropdownSubMenuCreation(backgroundmenu, menuList[6].submenus[0], subtitlesLanguagesArray ));

        var subtitleShowPositionsDropdown = menuData.getMenuTextMesh('Position', subMenuTextSize, menuDefaultColor, menuList[6].buttons[3]); //menuList
        subtitleShowPositionsDropdown.position.y = 1*backgroundmenu.geometry.parameters.height/8
        subtitlesMenuGroup.add(subtitleShowPositionsDropdown);
        subtitlesMenuGroup.add( MenuManager.dropdownSubMenuCreation(backgroundmenu, menuList[6].submenus[1], subtitlesPositionArray));

        var subtitleShowAreasDropdown = menuData.getMenuTextMesh('Size', subMenuTextSize, menuDefaultColor, menuList[6].buttons[4]); //menuList
        subtitleShowAreasDropdown.position.y = -1*backgroundmenu.geometry.parameters.height/8;
        subtitlesMenuGroup.add(subtitleShowAreasDropdown);
        subtitlesMenuGroup.add( MenuManager.dropdownSubMenuCreation(backgroundmenu, menuList[6].submenus[2], subtitlesSizeArray ));

        var subtitleShowIndicatorDropdown = menuData.getMenuTextMesh('Indicator', subMenuTextSize, menuDefaultColor, menuList[6].buttons[5]); //menuList
        subtitleShowIndicatorDropdown.position.y = -3*backgroundmenu.geometry.parameters.height/8;
        subtitlesMenuGroup.add(subtitleShowIndicatorDropdown);
        subtitlesMenuGroup.add( MenuManager.dropdownSubMenuCreation(backgroundmenu, menuList[6].submenus[3], subtitlesIndicatorArray ));

        interController.removeInteractiveObject (menuList[4].buttons[0]);

        subtitlesMenuTitle.material.color.set( 0xffff00 );

        subtitlesMenuTitle.position.x = -backgroundmenu.geometry.parameters.width/3;
        disabledSubtitles.position.x = -backgroundmenu.geometry.parameters.width/3;

        subtitlesMenuGroup.add(subtitlesMenuTitle);
        subtitlesMenuGroup.add(disabledSubtitles);
    
        subtitlesMenuGroup.name = menuList[6].name; //menuList.
        subtitlesMenuGroup.visible = false; //Not the first menu. Visibility false.

        backgroundmenu.add(subtitlesMenuGroup);
        scene.add( backgroundmenu );
    }

   
//************************************************************************************
// EXPERIMENTAL
//************************************************************************************

    function testButton(name, color, x, y)
    {
        var geometry = new THREE.CircleGeometry( 8, 32 );
        var material = new THREE.MeshBasicMaterial( { color: color } );
        var circle = new THREE.Mesh( geometry, material );

        //circle.scale.set( 0.05,0.05,1 );

        circle.position.z = 0.01;
        circle.position.x = x;
        circle.position.y = y;

        //circle.lookAt(new THREE.Vector3(0, 0, 0));
        circle.name = name;

        return circle;
    }

}

THREE.SubtitleMenuManager.prototype.constructor = THREE.SubtitleMenuManager;