/**
 * @author isaac.fraile@i2cat.net
 */

 // GLOBALS used: scene, menuDefaultColor, factorScale, menuElementsZ, menuList, subtitlesLanguagesArray......
 // Used class --> menuData, THREE

THREE.SecondaryMenuManager = function () {


//************************************************************************************
// Private Functions
//************************************************************************************

/**
 * Gets the menu lines.
 *
 * @param      {<type>}  w       { parameter_description }
 * @param      {<type>}  h       { parameter_description }
 * @param      {<type>}  numDiv  The number div
 * @param      {<type>}  rows    The rows
 * @return     {<type>}  The menu lines.
 */
    function getMenuLines(w, h, numDiv, rows)
    {
        var linesMenuGroup = menuData.getVerticalLineDivisions( w, h, menuDefaultColor );
        linesMenuGroup.add( menuData.getHoritzontalLineDivisions( w, h, menuDefaultColor, numDiv, rows ) );

        return linesMenuGroup;
    }

/**
 * { function_description }
 *
 * @param      {number}  w       { parameter_description }
 * @param      {number}  h       { parameter_description }
 * @param      {<type>}  name    The name
 * @return     {<type>}  On menu button.
 */
    function getOnMenuButton(w, h, name)
    {
        var onButton = menuData.getImageMesh( new THREE.PlaneGeometry( 40*factorScale, 22.5*factorScale ), './img/menu/toggle_on.png', name, 4 ); // menuList.
        onButton.position.set( -w/3, 3*h/8, menuElementsZ );

        return onButton;
    }

/**
 * { function_description }
 *
 * @param      {number}  w       { parameter_description }
 * @param      {number}  h       { parameter_description }
 * @param      {<type>}  name    The name
 * @return     {<type>}  Off menu button.
 */
    function getOffMenuButton(w, h, name)
    {
        var onButton = menuData.getImageMesh( new THREE.PlaneGeometry( 40*factorScale, 22.5*factorScale ), './img/menu/toggle_off.png', name, 4 ); // menuList.
        onButton.position.set( -w/3, 3*h/8, menuElementsZ );

        return onButton;
    }

/**
 * Gets the menu text mesh.
 *
 * @param      {<type>}   posY     The position y
 * @param      {<type>}   text     The text
 * @param      {<type>}   name     The name
 * @param      {boolean}  visible  The visible
 * @return     {<type>}   The menu text mesh.
 */
    function getMenuTextMesh(posY, text, name, visible=true)
    {
        var menuTextMesh = menuData.getMenuTextMesh( text, subMenuTextSize, menuDefaultColor, name );
        menuTextMesh.position.y = posY;

        menuTextMesh.visible = visible;

        return menuTextMesh;
    }

/**
 * Gets the menu title mesh.
 *
 * @param      {<type>}  posX    The position x
 * @param      {<type>}  text    The text
 * @param      {<type>}  name    The name
 * @return     {<type>}  The menu title mesh.
 */
    function getMenuTitleMesh(posX, text, name)
    {
        var title = menuData.getMenuTextMesh( text, 22, menuDefaultColor, name );

        title.material.color.set( 0xffff00 );
        title.position.x = posX;
        title.position.z = menuElementsZ;

        return title;
    }

/**
 * Gets the menu disabled title mesh.
 *
 * @param      {<type>}  posX    The position x
 * @param      {<type>}  name    The name
 * @return     {<type>}  The menu disabled title mesh.
 */
    function getMenuDisabledTitleMesh(posX, name)
    {
        var disabledTitle = menuData.getImageMesh( new THREE.PlaneGeometry( 50*factorScale, 59*factorScale ), './img/menu/disabled_st_icon.png', name, 4 );

        disabledTitle.position.x = posX;
        disabledTitle.position.z = menuElementsZ;

        return disabledTitle;
    }

/**
 * Gets the settings icon mesh.
 *
 * @param      {number}  w       { parameter_description }
 * @param      {<type>}  name    The name
 * @return     {<type>}  The settings icon mesh.
 */
    function getSettingsIconMesh(w, name)
    {
        var settingsIcon = scene.getObjectByName( name ).clone(); // menuList.settingsCardboardMenu.settingsButton

        settingsIcon.scale.set( 0.75, 0.75, 1 );
        settingsIcon.position.x = -w/3;

        return settingsIcon;
    }

/**
 * { function_description }
 *
 * @param      {<type>}  posY    The position y
 * @param      {<type>}  rotZ    The rot z
 * @param      {<type>}  name    The name
 * @return     {<type>}  The up down mesh.
 */
    function getUpDownMesh(posY, rotZ, name)
    {
        var mesh = menuData.getImageMesh( new THREE.PlaneGeometry( backgroundChangeMenuButtonWidth*factorScale/2, backgroundChangeMenuButtonHeight*factorScale ), './img/menu/less_than_icon.png', name, 4 ); 

        mesh.position.y = posY;
        mesh.rotation.z = rotZ;

        mesh.name = name; 

        return mesh;
    }

/**
 * Creates a dropdown sub menu.
 *
 * @param      {number}  w            { parameter_description }
 * @param      {number}  h            { parameter_description }
 * @param      {<type>}  subMenuData  The sub menu data
 * @param      {<type>}  dataArray    The data array
 * @return     {THREE}   { description_of_the_return_value }
 */
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
            if (settingsLanguage == elem || subtitlesLanguage == elem || subtitlesPosition == elem ||subtitlesSize == elem || subtitlesIndicator == elem) option.material.color.set( menuButtonActiveColor ); 
            
            secondColumGroup.add(option); 
        })

        secondColumGroup.position.z = menuElementsZ;
        secondColumGroup.name = subMenuData.name;
        secondColumGroup.visible = false;

        return secondColumGroup;
    }

/**
 * Creates a subtitle menu group.
 *
 * @param      {number}  w       { parameter_description }
 * @param      {number}  h       { parameter_description }
 * @param      {<type>}  name    The name
 * @return     {THREE}   { description_of_the_return_value }
 */
    function createSubtitleMenuGroup(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( getMenuLines( w, h, 5, 1 ) );

        menuGroup.add( getOnMenuButton( w, h, menuList[6].buttons[0] ) );
        menuGroup.add( getOffMenuButton( w, h, menuList[6].buttons[1] ) );

        menuGroup.add( getUpDownMesh( 7*h/16, -Math.PI/2, menuList[6].buttons[7] ) );
        menuGroup.add( getUpDownMesh( -7*h/16, Math.PI/2, menuList[6].buttons[8] ) );

        menuGroup.add( getMenuTextMesh( h/4, 'Languages', menuList[6].buttons[2] ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[6].submenus[0], subtitlesLanguagesArray ) );

        menuGroup.add( getMenuTextMesh( 0, 'Position', menuList[6].buttons[3] ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[6].submenus[1], subtitlesPositionArray ) );

        menuGroup.add( getMenuTextMesh( -h/4, 'Size', menuList[6].buttons[4] ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[6].submenus[2], subtitlesSizeArray ) );

        menuGroup.add( getMenuTextMesh( -2*h/4, 'Indicator', menuList[6].buttons[5], false ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[6].submenus[3], subtitlesIndicatorArray ) );

        menuGroup.add( getMenuTextMesh( 2*h/4, 'Area', menuList[6].buttons[6], false ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[6].submenus[4], subtitlesSizeArray ) );

        interController.removeInteractiveObject( menuList[4].buttons[0] );
        
        menuGroup.add( getMenuTitleMesh( -w/3, 'ST', menuList[4].buttons[0] ) );
        menuGroup.add( getMenuDisabledTitleMesh( -w/3, menuList[4].buttons[4] ) );
    
        menuGroup.name = name;
        menuGroup.visible = false; //Not the first menu. Visibility false.

        return menuGroup;
    }

/**
 * Creates a settings menu group.
 *
 * @param      {<type>}  w       { parameter_description }
 * @param      {number}  h       { parameter_description }
 * @param      {<type>}  name    The name
 * @return     {THREE}   { description_of_the_return_value }
 */
    function createSettingsMenuGroup(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( getMenuLines( w, h, 3, 1 ) );

        menuGroup.add( getSettingsIconMesh( w, menuList[3].buttons[0] ) );

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

//************************************************************************************
// Public Functions
//************************************************************************************

    this.createSecondaryMenus = function(backgroundmenu)
    {
        var w = backgroundmenu.geometry.parameters.width;
        var h = backgroundmenu.geometry.parameters.height;

        console.error(h)

        backgroundmenu.add( createSubtitleMenuGroup( w, h, menuList[6].name ) );

        backgroundmenu.add( createSettingsMenuGroup( w, h, menuList[5].name ) );

        
    };

}

THREE.SecondaryMenuManager.prototype.constructor = THREE.SecondaryMenuManager;