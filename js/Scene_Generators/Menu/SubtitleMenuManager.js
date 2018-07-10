THREE.SubtitleMenuManager = function () {

    this.openSubtitleMenu = function(backgroundmenu)
    {
    	var menuList = MenuManager.getMenuList();
        menuData.getMenuTextMesh('ST', 40, 0xffffff, menuList[4].buttons[0], function(subtitlesMenuTitle) //menuList.multiOptionsMenu.showSubtitleMenuButton;                
        {
            var subtitlesMenuGroup =  new THREE.Group();

            var linesMenuGroup = menuData.menuLineVerticalDivisions(backgroundmenu, 0xffffff);

            //function menuLineHoritzontalDivisions(color, numberofdivisions, backgroundmenu, row)
            var firstColumnLines = menuData.menuLineHoritzontalDivisions(0xffffff, 4, backgroundmenu, 1);
            linesMenuGroup.add(firstColumnLines);


            subtitlesMenuGroup.add( linesMenuGroup );


            // TODO- CREATE DYNAMIC FUNCTION FOR FIRST COLUMN ELEMENTS

            var onButton = testButton('subtitleOnButton', 0x00ff00, 10, 3*backgroundmenu.geometry.parameters.height/8);
            var offButton = testButton('subtitleOffButton', 0xff0000, -10, 3*backgroundmenu.geometry.parameters.height/8);

            var subtitleShowLanguagesDropdown = testButton('subtitleShowLanguagesDropdown', 0x0059b3, 0, backgroundmenu.geometry.parameters.height/8);
            var subtitleShowPositionsDropdown = testButton('subtitleShowPositionsDropdown', 0xffcccc, 0, -backgroundmenu.geometry.parameters.height/8);
            var subtitleShowAreasDropdown = testButton('subtitleShowAreasDropdown', 0xffffcc, 0, -3*backgroundmenu.geometry.parameters.height/8);

            interController.removeInteractiveObject (menuList[4].buttons[0]);

            subtitlesMenuTitle.material.color.setHex( 0xffff00 );
            subtitlesMenuTitle.position.x = -150;
            subtitlesMenuTitle.position.y = -20;

            subtitlesMenuGroup.add(subtitlesMenuTitle);
            subtitlesMenuGroup.add(onButton);
            subtitlesMenuGroup.add(offButton);

            subtitlesMenuGroup.add(subtitleShowLanguagesDropdown);
            subtitlesMenuGroup.add(subtitleShowPositionsDropdown);
            subtitlesMenuGroup.add(subtitleShowAreasDropdown);

            subtitlesMenuGroup.add( MenuManager.dropdownSubMenuCreation(backgroundmenu, menuList[6].submenus[0]) );
            subtitlesMenuGroup.add( MenuManager.dropdownSubMenuCreation(backgroundmenu, menuList[6].submenus[1]) );
            subtitlesMenuGroup.add( MenuManager.dropdownSubMenuCreation(backgroundmenu, menuList[6].submenus[2]) );

            subtitlesMenuGroup.name = menuList[6].name; //menuList.
            subtitlesMenuGroup.visible = false; //Not the first menu. Visibility false.

            backgroundmenu.add(subtitlesMenuGroup);
            scene.add( backgroundmenu );
         });
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