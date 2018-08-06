THREE.SignLanguageMenuManager = function () {

/**
 * Opens a sign language menu.
 *
 * @param      {<type>}  backgroundmenu  The backgroundmenu
 */

    this.openMenu = function(backgroundmenu)
    {
    	var title = menuData.getMenuTextMesh('SL', 22, menuDefaultColor, menuList[4].buttons[1]); //menuList.multiOptionsMenu.showSubtitleMenuButton;                
        var disabledTitle = menuData.getImageMesh( new THREE.PlaneGeometry( 50*factorScale,59*factorScale ), './img/menu/disabled_sl_icon.png', menuList[4].buttons[5], 4 ); // menuList.

        var menuGroup =  new THREE.Group();

        var linesMenuGroup = menuData.menuLineVerticalDivisions(backgroundmenu, menuDefaultColor);

        //function menuLineHoritzontalDivisions(color, numberofdivisions, backgroundmenu, row)

        menuGroup.add( linesMenuGroup );


        // TODO- CREATE DYNAMIC FUNCTION FOR FIRST COLUMN ELEMENTS

        var onButton = menuData.getImageMesh( new THREE.PlaneGeometry( 40*factorScale,22.5*factorScale ), './img/menu/toggle_on.png', menuList[7].buttons[0], 4 ); // menuList.
        onButton.position.set(-backgroundmenu.geometry.parameters.width/3, 3*backgroundmenu.geometry.parameters.height/8, menuElementsZ)
        menuGroup.add(onButton);

        var offButton = menuData.getImageMesh( new THREE.PlaneGeometry( 40*factorScale,22.5*factorScale ), './img/menu/toggle_off.png', menuList[7].buttons[1], 4 ); // menuList.
        offButton.position.set(-backgroundmenu.geometry.parameters.width/3, 3*backgroundmenu.geometry.parameters.height/8, menuElementsZ)
        menuGroup.add(offButton);


        interController.removeInteractiveObject (menuList[4].buttons[1]);

        title.material.color.set( 0xffff00 );

        title.position.x = -backgroundmenu.geometry.parameters.width/3;
        disabledTitle.position.x = -backgroundmenu.geometry.parameters.width/3;
        title.position.z = menuElementsZ;
        disabledTitle.position.z = menuElementsZ;

        menuGroup.add(title);
        menuGroup.add(disabledTitle);
    
        menuGroup.name = menuList[7].name; //menuList.
        menuGroup.visible = false; //Not the first menu. Visibility false.

        backgroundmenu.add(menuGroup);
        //scene.add( backgroundmenu );
    }
}

THREE.SignLanguageMenuManager.prototype.constructor = THREE.SignLanguageMenuManager;