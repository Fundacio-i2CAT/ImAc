THREE.AudioSubtitlesMenuManager = function () {

/**
 * Opens an audio subtitles menu.
 *
 * @param      {<type>}  backgroundmenu  The backgroundmenu
 */
    this.openMenu = function(backgroundmenu)
    {
    	var title = menuData.getMenuTextMesh('AST', 17, menuDefaultColor, menuList[4].buttons[3]); //menuList.multiOptionsMenu.                
        var disabledTitle = menuData.getImageMesh( new THREE.PlaneGeometry( 63*factorScale, 44*factorScale ), './img/menu/disabled_ast_icon.png', menuList[4].buttons[7], 4 ); // menuList.

        var menuGroup =  new THREE.Group();

        var linesMenuGroup = menuData.menuLineVerticalDivisions(backgroundmenu, menuDefaultColor);

        //function menuLineHoritzontalDivisions(color, numberofdivisions, backgroundmenu, row)

        menuGroup.add( linesMenuGroup );

        // TODO- CREATE DYNAMIC FUNCTION FOR FIRST COLUMN ELEMENTS

        var onButton = menuData.getImageMesh( new THREE.PlaneGeometry( 40*factorScale,22.5*factorScale ), './img/menu/toggle_on.png', menuList[9].buttons[0], 4 ); // menuList.
        onButton.position.set(-backgroundmenu.geometry.parameters.width/3, 3*backgroundmenu.geometry.parameters.height/8, menuElementsZ)
        menuGroup.add(onButton);

        var offButton = menuData.getImageMesh( new THREE.PlaneGeometry( 40*factorScale,22.5*factorScale ), './img/menu/toggle_off.png', menuList[9].buttons[1], 4 ); // menuList.
        offButton.position.set(-backgroundmenu.geometry.parameters.width/3, 3*backgroundmenu.geometry.parameters.height/8, menuElementsZ)
        menuGroup.add(offButton);


        interController.removeInteractiveObject (menuList[4].buttons[3]);

        title.material.color.set( 0xffff00 );

        title.position.x = -backgroundmenu.geometry.parameters.width/3;
        disabledTitle.position.x = -backgroundmenu.geometry.parameters.width/3;
        title.position.z = menuElementsZ;
        disabledTitle.position.z = menuElementsZ;

        menuGroup.add(title);
        menuGroup.add(disabledTitle);
    
        menuGroup.name = menuList[9].name; //menuList.
        menuGroup.visible = false; //Not the first menu. Visibility false.

        backgroundmenu.add(menuGroup);
        scene.add( backgroundmenu );
    }
}

THREE.AudioSubtitlesMenuManager.prototype.constructor = THREE.AudioSubtitlesMenuManager;