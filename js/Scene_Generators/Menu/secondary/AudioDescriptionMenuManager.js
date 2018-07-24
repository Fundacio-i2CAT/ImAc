THREE.AudioDescriptionMenuManager = function () {

/**
 * Opens an audio description menu.
 *
 * @param      {<type>}  backgroundmenu  The backgroundmenu
 */
    this.openMenu = function(backgroundmenu)
    {
    	var title = menuData.getMenuTextMesh('AD', 22, menuDefaultColor, menuList[4].buttons[2]); //menuList.multiOptionsMenu.                
        var disabledTitle = menuData.getImageMesh( new THREE.PlaneGeometry( 50*factorScale,59*factorScale ), './img/menu/disabled_ad_icon.png', menuList[4].buttons[6], 4 ); // menuList.

        var menuGroup =  new THREE.Group();

        var linesMenuGroup = menuData.menuLineVerticalDivisions(backgroundmenu, menuDefaultColor);

        //function menuLineHoritzontalDivisions(color, numberofdivisions, backgroundmenu, row)

        menuGroup.add( linesMenuGroup );


        // TODO- CREATE DYNAMIC FUNCTION FOR FIRST COLUMN ELEMENTS

        var onButton = menuData.getImageMesh( new THREE.PlaneGeometry( 40*factorScale,22.5*factorScale ), './img/menu/toggle_on.png', menuList[8].buttons[0], 4 ); // menuList.
        onButton.position.set(-backgroundmenu.geometry.parameters.width/3, 3*backgroundmenu.geometry.parameters.height/8, menuElementsZ)
        menuGroup.add(onButton);

        var offButton = menuData.getImageMesh( new THREE.PlaneGeometry( 40*factorScale,22.5*factorScale ), './img/menu/toggle_off.png', menuList[8].buttons[1], 4 ); // menuList.
        offButton.position.set(-backgroundmenu.geometry.parameters.width/3, 3*backgroundmenu.geometry.parameters.height/8, menuElementsZ)
        menuGroup.add(offButton);


        interController.removeInteractiveObject (menuList[4].buttons[2]);

        title.material.color.set( 0xffff00 );

        title.position.x = -backgroundmenu.geometry.parameters.width/3;
        disabledTitle.position.x = -backgroundmenu.geometry.parameters.width/3;
        title.position.z = menuElementsZ;
        disabledTitle.position.z = menuElementsZ;

        menuGroup.add(title);
        menuGroup.add(disabledTitle);
    
        menuGroup.name = menuList[8].name; //menuList.
        menuGroup.visible = false; //Not the first menu. Visibility false.

        backgroundmenu.add(menuGroup);
        scene.add( backgroundmenu );
    }
}

THREE.AudioDescriptionMenuManager.prototype.constructor = THREE.AudioDescriptionMenuManager;