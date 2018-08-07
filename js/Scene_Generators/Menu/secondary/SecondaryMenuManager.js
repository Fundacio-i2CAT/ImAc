/**
 * @author isaac.fraile@i2cat.net
 */

 // GLOBALS used: scene, menuDefaultColor, menuElementsZ, menuList, subtitlesLanguagesArray......
 // Used class --> menuData, THREE

THREE.SecondaryMenuManager = function () {


//************************************************************************************
// Private Functions
//************************************************************************************
    
    function getMenuLines(w, h, numDiv, rows)
    {
        var linesMenuGroup = menuData.getVerticalLineDivisions( w, h, menuDefaultColor );
        linesMenuGroup.add( menuData.getHoritzontalLineDivisions( w, h, menuDefaultColor, numDiv, rows ) );

        return linesMenuGroup;
    }

    function getOnMenuButton(w, h, name)
    {
        var onButton = menuData.getPlaneImageMesh( 22.5, 12.6, './img/menu/toggle_on.png', name, 4 );
        onButton.position.set( -w/3, 3*h/8, menuElementsZ );

        return onButton;
    }

    function getOffMenuButton(w, h, name)
    {
        var onButton = menuData.getPlaneImageMesh( 22.5, 12.6, './img/menu/toggle_off.png', name, 4 ); 
        onButton.position.set( -w/3, 3*h/8, menuElementsZ );

        return onButton;
    }

    function getMenuTextMesh(posY, text, name, visible=true)
    {
        var menuTextMesh = menuData.getMenuTextMesh( text, subMenuTextSize, menuDefaultColor, name );
        menuTextMesh.position.y = posY;

        menuTextMesh.visible = visible;

        return menuTextMesh;
    }

    function getMenuTitleMesh(posX, size, text, name, setColor=true)
    {
        var title = menuData.getMenuTextMesh( text, size, menuDefaultColor, name );

        if ( setColor ) title.material.color.set( 0xffff00 );
        title.position.x = posX;
        title.position.z = menuElementsZ;

        return title;
    }

    function getMenuDisabledTitleMesh(posX, w, h, img, name)
    {
        var disabledTitle = menuData.getPlaneImageMesh( w, h, img, name, 4 );

        disabledTitle.position.x = posX;
        disabledTitle.position.z = menuElementsZ;

        return disabledTitle;
    }

    function getSettingsIconMesh(w, name)
    {
        var settingsIcon = scene.getObjectByName( name ).clone(); // menuList.settingsCardboardMenu.settingsButton  settingsCardboardMenu

        settingsIcon.scale.set( 0.75, 0.75, 1 );
        settingsIcon.position.x = -w/3;

        return settingsIcon;
    }

    function getUpDownMesh(posY, rotZ, name)
    {
        var mesh = menuData.getPlaneImageMesh( backgroundChangeMenuButtonWidth*9/32, backgroundChangeMenuButtonHeight*9/16, './img/menu/less_than_icon.png', name, 4 ); 

        mesh.position.y = posY;
        mesh.rotation.z = rotZ;

        mesh.position.z = menuElementsZ;

        mesh.name = name; 

        return mesh;
    }

    function getImageMesh(posX, w, h, img, iname, name)
    {
        var mesh = menuData.getPlaneImageMesh( w, h, img, iname, 4 ); 

        mesh.position.x = posX;
        mesh.position.z = menuElementsZ;

        mesh.name = name; 

        return mesh;
    }

    function createDropdownSubMenu(w, h, subMenuData, dataArray)
    {
        var secondColumGroup = new THREE.Group();
        var subMenuDataLength = subMenuData.buttons.length;

        var secondColumnLines = menuData.getHoritzontalLineDivisions( w, h, menuDefaultColor, subMenuDataLength, 2 );
        
        secondColumGroup.add(secondColumnLines);
        subMenuData.buttons.forEach(function(elem, index)
        {
            var factor = (index*2)+1;
            var option = menuData.getMenuTextMesh(dataArray[index], subMenuTextSize, menuDefaultColor, elem)
            option.position.set( w/3, (h/2-factor*h/(subMenuDataLength*2)), menuElementsZ);                    
            
            // CHANGE TO A SEPARATE FUNCTION
            if (settingsLanguage == elem || subtitlesLanguage == elem || subtitlesPosition == elem || subtitlesSize == elem || subtitlesIndicator == elem) option.material.color.set( menuButtonActiveColor ); 
            
            secondColumGroup.add(option); 
        })

        secondColumGroup.position.z = menuElementsZ;
        secondColumGroup.name = subMenuData.name;
        secondColumGroup.visible = false;

        return secondColumGroup;
    }

    function createSubtitleMenuGroup(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( getMenuLines( w, h, 5, 1 ) );

        menuGroup.add( getOnMenuButton( w, h, menuList[6].buttons[0] ) );
        menuGroup.add( getOffMenuButton( w, h, menuList[6].buttons[1] ) );

        menuGroup.add( getUpDownMesh( 7*h/16, -Math.PI/2, menuList[6].buttons[9] ) );
        menuGroup.add( getUpDownMesh( -7*h/16, Math.PI/2, menuList[6].buttons[10] ) );

        menuGroup.add( getMenuTextMesh( h/4, 'Languages', menuList[6].buttons[2] ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[6].submenus[0], subtitlesLanguagesArray ) );

        menuGroup.add( getMenuTextMesh( 0, 'Easy read', menuList[6].buttons[3] ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[6].submenus[1], settingsUserProfileArray ) ); //modify array

        menuGroup.add( getMenuTextMesh( -h/4, 'Position', menuList[6].buttons[4] ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[6].submenus[2], subtitlesPositionArray ) );

        menuGroup.add( getMenuTextMesh( -2*h/4, 'Background', menuList[6].buttons[5], false ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[6].submenus[3], settingsUserProfileArray ) ); //modify array

        menuGroup.add( getMenuTextMesh( -3*h/4, 'Size', menuList[6].buttons[6], false ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[6].submenus[4], subtitlesSizeArray ) );

        menuGroup.add( getMenuTextMesh( 3*h/4, 'Indicator', menuList[6].buttons[7], false ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[6].submenus[5], subtitlesIndicatorArray ) );

        menuGroup.add( getMenuTextMesh( 2*h/4, 'Area', menuList[6].buttons[8], false ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[6].submenus[6], subtitlesSizeArray ) );

        interController.removeInteractiveObject( menuList[4].buttons[0] );
        
        menuGroup.add( getMenuTitleMesh( -w/3, 22, 'ST', menuList[4].buttons[0] ) );
        menuGroup.add( getMenuDisabledTitleMesh( -w/3, 28, 33, './img/menu/disabled_st_icon.png', menuList[4].buttons[4] ) );
    
        menuGroup.name = name;
        menuGroup.visible = false; //Not the first menu. Visibility false.

        return menuGroup;
    }

    function createSettingsMenuGroup(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( getMenuLines( w, h, 3, 1 ) );

        //menuGroup.add( getSettingsIconMesh( w, menuList[3].buttons[0] ) );
        menuGroup.add( getImageMesh( -w/3, 34, 34, './img/menu/settings_icon.png', 'right', menuList[3].buttons[0] ) );

        menuGroup.add( getMenuTextMesh( h/3, 'Languages', menuList[5].buttons[0] ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[5].submenus[0], settingsLanguagesArray ) );

        menuGroup.add( getMenuTextMesh( 0, 'Voice control', menuList[5].buttons[1] ) ); 
        menuGroup.add( createDropdownSubMenu( w, h, menuList[5].submenus[1], settingsVoiceControlArray ) );

        menuGroup.add( getMenuTextMesh( -h/3, 'User Profile', menuList[5].buttons[2] ) ); 
        menuGroup.add( createDropdownSubMenu( w, h, menuList[5].submenus[2], settingsUserProfileArray ) );
    
    
        menuGroup.name = name;
        menuGroup.visible = false; //Not the first menu. Visibility false.

        return menuGroup;
    }

    function createSignerMenuGroup(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( getMenuLines( w, h, 3, 1 ) );

        menuGroup.add( getOnMenuButton( w, h, menuList[7].buttons[0] ) );
        menuGroup.add( getOffMenuButton( w, h, menuList[7].buttons[1] ) );

        menuGroup.add( getMenuTextMesh( h/3, 'Position', menuList[7].buttons[2] ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[7].submenus[0], subtitlesPositionArray ) );

        menuGroup.add( getMenuTextMesh( 0, 'Indicator', menuList[7].buttons[3] ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[7].submenus[1], subtitlesIndicatorArray ) );

        menuGroup.add( getMenuTextMesh( -h/3, 'Area', menuList[7].buttons[4] ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[7].submenus[2], subtitlesSizeArray ) );

        interController.removeInteractiveObject( menuList[4].buttons[1] );
        
        menuGroup.add( getMenuTitleMesh( -w/3, 22, 'SL', menuList[4].buttons[1] ) );
        menuGroup.add( getMenuDisabledTitleMesh( -w/3, 28, 33, './img/menu/disabled_sl_icon.png', menuList[4].buttons[5] ) );
    
        menuGroup.name = name;
        menuGroup.visible = false; //Not the first menu. Visibility false.

        return menuGroup;
    }

    function createAudioDescriptionMenuGroup(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( getMenuLines( w, h, 0, 1 ) );

        menuGroup.add( getOnMenuButton( w, h, menuList[8].buttons[0] ) );
        menuGroup.add( getOffMenuButton( w, h, menuList[8].buttons[1] ) );

        interController.removeInteractiveObject( menuList[4].buttons[2] );
        
        menuGroup.add( getMenuTitleMesh( -w/3, 22, 'AD', menuList[4].buttons[2] ) );
        menuGroup.add( getMenuDisabledTitleMesh( -w/3, 28, 33, './img/menu/disabled_ad_icon.png', menuList[4].buttons[6] ) );
    
        menuGroup.name = name;
        menuGroup.visible = false; //Not the first menu. Visibility false.

        return menuGroup;
    }

    function createAudioSubtMenuGroup(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( getMenuLines( w, h, 0, 1 ) );

        menuGroup.add( getOnMenuButton( w, h, menuList[9].buttons[0] ) );
        menuGroup.add( getOffMenuButton( w, h, menuList[9].buttons[1] ) );

        interController.removeInteractiveObject( menuList[4].buttons[3] );
        
        menuGroup.add( getMenuTitleMesh( -w/3, 17, 'AST', menuList[4].buttons[3] ) );
        menuGroup.add( getMenuDisabledTitleMesh( -w/3, 35, 26.4, './img/menu/disabled_ast_icon.png', menuList[4].buttons[7] ) );
    
        menuGroup.name = name;
        menuGroup.visible = false; //Not the first menu. Visibility false.

        return menuGroup;
    }

    function createSettingsCardboardMenu(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( getImageMesh( -w/4, 45, 45, './img/menu/settings_icon.png', 'right', menuList[3].buttons[0] ) );
        menuGroup.add( getImageMesh( w/4, 45, 28, './img/menu/cardboard_icon.png', 'right', menuList[3].buttons[1] ) );
    
        menuGroup.name = name;
        menuGroup.visible = false; //Not the first menu. Visibility false.

        return menuGroup;
    }

    function createMultiOptionsMenu(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( getMenuTitleMesh( -3*w/8, 11, 'ST', menuList[4].buttons[0], false ) );
        menuGroup.add( getMenuDisabledTitleMesh( -3*w/8, 14, 14, './img/menu/disabled_st_icon.png', menuList[4].buttons[4] ) );

        menuGroup.add( getMenuTitleMesh( -w/8, 11, 'SL', menuList[4].buttons[1], false ) );
        menuGroup.add( getMenuDisabledTitleMesh( -w/8, 14, 14, './img/menu/disabled_sl_icon.png', menuList[4].buttons[5] ) );

        menuGroup.add( getMenuTitleMesh( w/8, 11, 'AD', menuList[4].buttons[2], false ) );
        menuGroup.add( getMenuDisabledTitleMesh( w/8, 14, 14, './img/menu/disabled_ad_icon.png', menuList[4].buttons[6] ) );

        menuGroup.add( getMenuTitleMesh( 3*w/8, 11, 'AST', menuList[4].buttons[3], false ) );
        menuGroup.add( getMenuDisabledTitleMesh( 3*w/8, 18, 14, './img/menu/disabled_ast_icon.png', menuList[4].buttons[7] ) );
    
        menuGroup.name = name;
        menuGroup.visible = false; //Not the first menu. Visibility false.

        return menuGroup;
    }


//************************************************************************************
// Public Functions
//************************************************************************************

    this.createMainMenus = function(backgroundmenu)
    {
        var w = backgroundmenu.geometry.parameters.width;
        var h = backgroundmenu.geometry.parameters.height;

        backgroundmenu.add( createSettingsCardboardMenu( w, h, menuList[3].name ) );
        backgroundmenu.add( createMultiOptionsMenu( w, h, menuList[4].name ) );

        //scene.add( backgroundmenu );
     
    };

    this.createSecondaryMenus = function(backgroundmenu)
    {
        var w = backgroundmenu.geometry.parameters.width;
        var h = backgroundmenu.geometry.parameters.height;

        backgroundmenu.add( createSettingsMenuGroup( w, h, menuList[5].name ) );
        backgroundmenu.add( createSubtitleMenuGroup( w, h, menuList[6].name ) );
        backgroundmenu.add( createSignerMenuGroup( w, h, menuList[7].name ) );
        backgroundmenu.add( createAudioDescriptionMenuGroup( w, h, menuList[8].name ) );
        backgroundmenu.add( createAudioSubtMenuGroup( w, h, menuList[9].name ) );
     
    };
}

THREE.SecondaryMenuManager.prototype.constructor = THREE.SecondaryMenuManager;
