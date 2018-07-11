THREE.SubtitleMenuManager = function () {

    this.openSubtitleMenu = function(backgroundmenu)
    {
    	var menuList = MenuManager.getMenuList();
    	var subtitlesMenuTitle = menuData.getMenuTextMesh('ST', 40, 0xffffff, menuList[4].buttons[0]); //menuList.multiOptionsMenu.showSubtitleMenuButton;                
        var subtitlesMenuGroup =  new THREE.Group();

        var linesMenuGroup = menuData.menuLineVerticalDivisions(backgroundmenu, 0xffffff);

        //function menuLineHoritzontalDivisions(color, numberofdivisions, backgroundmenu, row)
        var firstColumnLines = menuData.menuLineHoritzontalDivisions(0xffffff, 4, backgroundmenu, 1);
        linesMenuGroup.add(firstColumnLines);


        subtitlesMenuGroup.add( linesMenuGroup );


        // TODO- CREATE DYNAMIC FUNCTION FOR FIRST COLUMN ELEMENTS

        var onButton = menuData.getMenuTextMesh('ON', 10, 0xffffff, menuList[6].buttons[0]); //menuList
        onButton.position.x = 20-onButton.children[0].geometry.parameters.width/2;
        onButton.position.y = 3*backgroundmenu.geometry.parameters.height/8-(onButton.children[0].geometry.parameters.height/4);
        subtitlesMenuGroup.add(onButton);


        var offButton = menuData.getMenuTextMesh('OFF', 10, 0xffffff, menuList[6].buttons[1]); //menuList
        offButton.position.x = -20-offButton.children[0].geometry.parameters.width/2;
        offButton.position.y = 3*backgroundmenu.geometry.parameters.height/8-(offButton.children[0].geometry.parameters.height/4);
        subtitlesMenuGroup.add(offButton);


        var subtitleShowLanguagesDropdown = menuData.getMenuTextMesh('Languanges', 10, 0xffffff, menuList[6].buttons[2]); //menuList
        subtitleShowLanguagesDropdown.position.x = -backgroundmenu.geometry.parameters.height/3+20;
        subtitleShowLanguagesDropdown.position.y = 1*backgroundmenu.geometry.parameters.height/8-(subtitleShowLanguagesDropdown.children[0].geometry.parameters.height/4);
        subtitlesMenuGroup.add(subtitleShowLanguagesDropdown);
        subtitlesMenuGroup.add( MenuManager.dropdownSubMenuCreation(backgroundmenu, menuList[6].submenus[0]) );

        var subtitleShowPositionsDropdown = menuData.getMenuTextMesh('Position', 10, 0xffffff, menuList[6].buttons[3]); //menuList
        subtitleShowPositionsDropdown.position.x = -backgroundmenu.geometry.parameters.height/3+20;
        subtitleShowPositionsDropdown.position.y = -1*backgroundmenu.geometry.parameters.height/8-(subtitleShowPositionsDropdown.children[0].geometry.parameters.height/4);
        subtitlesMenuGroup.add(subtitleShowPositionsDropdown);
        subtitlesMenuGroup.add( MenuManager.dropdownSubMenuCreation(backgroundmenu, menuList[6].submenus[1]) );

        var subtitleShowAreasDropdown = menuData.getMenuTextMesh('Area', 10, 0xffffff, menuList[6].buttons[4]); //menuList
        subtitleShowAreasDropdown.position.x = -backgroundmenu.geometry.parameters.height/3+20;
        subtitleShowAreasDropdown.position.y = -3*backgroundmenu.geometry.parameters.height/8-(subtitleShowAreasDropdown.children[0].geometry.parameters.height/4);
        subtitlesMenuGroup.add(subtitleShowAreasDropdown);
        subtitlesMenuGroup.add( MenuManager.dropdownSubMenuCreation(backgroundmenu, menuList[6].submenus[2]) );


        interController.removeInteractiveObject (menuList[4].buttons[0]);

        subtitlesMenuTitle.material.color.set( 0xffff00 );
        subtitlesMenuTitle.position.x = -150;
        subtitlesMenuTitle.position.y = -20;

        subtitlesMenuGroup.add(subtitlesMenuTitle);

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