/**
 * @author isaac.fraile@i2cat.net
 */

 // GLOBALS used: menuDefaultColor, menuElementsZ, menuList, subtitlesLanguagesArray......
 // Used class --> menuData, THREE

THREE.SecondaryMenuManager = function () {

    this.timelineScale = 0;
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
        var onButton = menuData.getPlaneImageMesh( 22.5, 12.6, './img/menu/toggle_on.png', name, 4 );
        onButton.position.set( -w/3, 3*h/8, menuElementsZ );
        onButton.onexecute = MenuFunctionsManager.getOnOffFunc( name );

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
        var onButton = menuData.getPlaneImageMesh( 22.5, 12.6, './img/menu/toggle_off.png', name, 4 ); 
        onButton.position.set( -w/3, 3*h/8, menuElementsZ );
        onButton.onexecute = MenuFunctionsManager.getOnOffFunc( name );

        return onButton;
    }

    function getMenuTextMesh(posY, text, textSize, name, visible, func, cw, ch)
    {
        var menuTextMesh = menuData.getMenuTextMesh( text, textSize, menuDefaultColor, name, func, cw,ch);
        menuTextMesh.position.y = posY;
        menuTextMesh.visible = visible;

        return menuTextMesh;
    }

    function getMenuTitleMesh(posX, size, text, name, setColor, func, cw, ch)
    {
        var title = menuData.getMenuTextMesh( text, size, menuDefaultColor, name, func, cw, ch);

        if ( setColor ) title.material.color.set( 0xffff00 );
        title.position.x = posX;
        title.position.z = menuElementsZ;

        return title;
    }

    function getMenuDisabledTitleMesh(posX, w, h, img, name, func)
    {
        console.error('deprecated function')
        var disabledTitle = menuData.getPlaneImageMesh( w, h, img, name, 4 );

        disabledTitle.position.x = posX;
        disabledTitle.position.z = menuElementsZ;

        disabledTitle.onexecute = func;

        return disabledTitle;
    }

    function getUpDownMesh(posY, rotZ, name, func)
    {
        var mesh = menuData.getPlaneImageMesh( backgroundChangeMenuButtonWidth*9/32, backgroundChangeMenuButtonHeight*9/16, './img/menu/less_than_icon.png', name, 4 ); 

        mesh.position.y = posY;
        mesh.rotation.z = rotZ;
        mesh.position.z = menuElementsZ;
        mesh.name = name; 
        mesh.onexecute = func;

        return mesh;
    }

    function getImageMesh(posX, w, h, img, name, func)
    {
        var mesh = menuData.getPlaneImageMesh( w, h, img, name, 4 ); 

        mesh.position.x = posX;
        mesh.position.z = menuElementsZ;

        if ( name == menuList[1].buttons[3] ) mesh.rotation.z = Math.PI;

        mesh.name = name; 
        mesh.onexecute = func;

        return mesh;
    }

    function createDropdownSubMenu(w, h, subMenuData, dataArray)
    {
        var secondColumGroup = new THREE.Group();
        var subMenuDataLength = subMenuData.buttons.length;

        var secondColumnLines = menuData.getHoritzontalLineDivisions( w, h, menuDefaultColor, subMenuDataLength, 2 );
        
        secondColumGroup.add( secondColumnLines );
        subMenuData.buttons.forEach(function( elem, index )
        {
            var factor = (index*2)+1;
            var option = menuData.getMenuTextMesh( dataArray[index], subMenuTextSize, menuDefaultColor, elem, MenuFunctionsManager.getButtonFunctionByName( elem ), w/3, h/(subMenuDataLength*2));
            option.position.set( w/3, ( h/2-factor*h/(subMenuDataLength*2) ), menuElementsZ );                    
            
            // CHANGE TO A SEPARATE FUNCTION
            if ( settingsLanguage == elem 
                || subtitlesLanguage == elem 
                || subtitlesEasy == elem 
                || subtitlesPosition == elem 
                || subtitlesSize == elem 
                || subtitlesIndicator == elem
                || subtitlesBackground == elem
                || subtitlesArea == elem
                || signerPosition == elem
                || signerIndicator == elem
                || signerArea == elem 
                || signerLanguage == elem ) 
            {
                option.material.color.set( menuButtonActiveColor ); 
            }
            
            secondColumGroup.add( option ); 
        })

        secondColumGroup.position.z = menuElementsZ;
        secondColumGroup.name = subMenuData.name;
        secondColumGroup.visible = false;

        return secondColumGroup;
    }

//////////////////////////////
//       Subtitles
//////////////////////////////

    function createSubtitleMenuGroup(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( getMenuLines( w, h, 5, 1 ) );

        menuGroup.add( getOnMenuButton( w, h, menuList[6].buttons[0] ) );
        menuGroup.add( getOffMenuButton( w, h, menuList[6].buttons[1] ) );

        menuGroup.add( getUpDownMesh( 7*h/16, -Math.PI/2, menuList[6].buttons[9], MenuFunctionsManager.getSubUpDownFunc( false ) ) );
        menuGroup.add( getUpDownMesh( -7*h/16, Math.PI/2, menuList[6].buttons[10], MenuFunctionsManager.getSubUpDownFunc( true ) ) );

        menuGroup.add( getMenuTextMesh( h/4, STMenuList[0], 5, menuList[6].buttons[2], true, MenuFunctionsManager.getSubShowDropdownFunc( 0, menuList[6].buttons[2] ), w/3, h/4 ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[6].submenus[0], subtitlesLanguagesArray ) ); // read xml num of subtitle languages

        menuGroup.add( getMenuTextMesh( 0, STMenuList[1], 5, menuList[6].buttons[3], true, MenuFunctionsManager.getSubShowDropdownFunc( 1, menuList[6].buttons[3] ), w/3, h/4 ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[6].submenus[1], subtitlesEasyArray ) ); 

        menuGroup.add( getMenuTextMesh( -h/4, STMenuList[2], 5, menuList[6].buttons[4], true, MenuFunctionsManager.getSubShowDropdownFunc( 2, menuList[6].buttons[4] ), w/3, h/4 ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[6].submenus[2], subtitlesPositionArray ) );

        menuGroup.add( getMenuTextMesh( -2*h/4, STMenuList[3], 5, menuList[6].buttons[5], false, MenuFunctionsManager.getSubShowDropdownFunc( 3, menuList[6].buttons[5] ), w/3, h/4 ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[6].submenus[3], subtitlesBackgroundArray ) );

        menuGroup.add( getMenuTextMesh( -3*h/4, STMenuList[4], 5, menuList[6].buttons[6], false, MenuFunctionsManager.getSubShowDropdownFunc( 4, menuList[6].buttons[6] ), w/3, h/4 ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[6].submenus[4], subtitlesSizeArray ) );

        menuGroup.add( getMenuTextMesh( 3*h/4, STMenuList[5], 5, menuList[6].buttons[7], false, MenuFunctionsManager.getSubShowDropdownFunc( 5, menuList[6].buttons[7] ), w/3, h/4 ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[6].submenus[5], subtitlesIndicatorArray ) );

        menuGroup.add( getMenuTextMesh( 2*h/4, STMenuList[6], 5, menuList[6].buttons[8], false, MenuFunctionsManager.getSubShowDropdownFunc( 6, menuList[6].buttons[8] ), w/3, h/4 ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[6].submenus[6], subtitlesSizeArray ) );

        interController.removeInteractiveObject( menuList[4].buttons[0] );
        
        menuGroup.add( getImageMesh( -w/3, 35, 35, MOMenuButtonsArray[0], menuList[4].buttons[0] ) );
        menuGroup.add( getImageMesh( -w/3, 35, 35, MOMenuDisabledButtonsArray[0], menuList[4].buttons[4] ) );
    
        menuGroup.name = name;
        menuGroup.visible = false; //Not the first menu. Visibility false.

        return menuGroup;
    }

//////////////////////////////
//       Settings
//////////////////////////////

    function createSettingsMenuGroup(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( getMenuLines( w, h, 3, 1 ) );

        menuGroup.add( getImageMesh( -w/3, 34, 34, './img/menu/settings_icon.png', menuList[3].buttons[0] ) );

        menuGroup.add( getMenuTextMesh( h/3, SettingsMenuList[0], 5, menuList[5].buttons[0], true, MenuFunctionsManager.getSubShowDropdownFunc( 0, menuList[5].buttons[0] ), w/3, h/3 ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[5].submenus[0], settingsLanguagesArray ) );

        menuGroup.add( getMenuTextMesh( 0, SettingsMenuList[1], 5, menuList[5].buttons[1], true, MenuFunctionsManager.getSubShowDropdownFunc( 1, menuList[5].buttons[1] ),  w/3, h/3) ); 
        menuGroup.add( createDropdownSubMenu( w, h, menuList[5].submenus[1], settingsVoiceControlArray ) );

        menuGroup.add( getMenuTextMesh( -h/3, SettingsMenuList[2], 5, menuList[5].buttons[2], true, MenuFunctionsManager.getSubShowDropdownFunc( 2, menuList[5].buttons[2] ), w/3, h/3) ); 
        menuGroup.add( createDropdownSubMenu( w, h, menuList[5].submenus[2], settingsUserProfileArray ) );
     
        menuGroup.name = name;
        menuGroup.visible = false; //Not the first menu. Visibility false.

        return menuGroup;
    }

//////////////////////////////
//       Signer
//////////////////////////////

    function createSignerMenuGroup(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( getMenuLines( w, h, 4, 1 ) );

        menuGroup.add( getOnMenuButton( w, h, menuList[7].buttons[0] ) );
        menuGroup.add( getOffMenuButton( w, h, menuList[7].buttons[1] ) );

        menuGroup.add( getMenuTextMesh( 3*h/8, STMenuList[0], 5, menuList[7].buttons[2], true, MenuFunctionsManager.getSubShowDropdownFunc( 0, menuList[7].buttons[2] ), w/3, h/4 ));
        menuGroup.add( createDropdownSubMenu( w, h, menuList[7].submenus[0], signerLanguagesArray ) ); // read xml num of subtitle languages

        menuGroup.add( getMenuTextMesh( h/8, SLMenuList[1], 5, menuList[7].buttons[3], true, MenuFunctionsManager.getSubShowDropdownFunc( 1, menuList[7].buttons[3] ), w/3, h/4 ));
        menuGroup.add( createDropdownSubMenu( w, h, menuList[7].submenus[1], subtitlesPositionArray ) );

        menuGroup.add( getMenuTextMesh( -h/8, SLMenuList[2], 5, menuList[7].buttons[4], true, MenuFunctionsManager.getSubShowDropdownFunc( 2, menuList[7].buttons[4] ), w/3, h/4 ));
        menuGroup.add( createDropdownSubMenu( w, h, menuList[7].submenus[2], signerIndicatorArray ) );

        menuGroup.add( getMenuTextMesh( -3*h/8, SLMenuList[3], 5, menuList[7].buttons[5], true, MenuFunctionsManager.getSubShowDropdownFunc( 3, menuList[7].buttons[5] ), w/3, h/4 ));
        menuGroup.add( createDropdownSubMenu( w, h, menuList[7].submenus[3], subtitlesSizeArray ) );

        interController.removeInteractiveObject( menuList[4].buttons[1] );
        
        menuGroup.add( getImageMesh( -w/3, 35, 35, MOMenuButtonsArray[1], menuList[4].buttons[1] ) );
        menuGroup.add( getImageMesh( -w/3, 35, 35, MOMenuDisabledButtonsArray[1], menuList[4].buttons[5] ) );
    
        menuGroup.name = name;
        menuGroup.visible = false; //Not the first menu. Visibility false.

        return menuGroup;
    }

//////////////////////////////
//       Audio Description
//////////////////////////////

    function createAudioDescriptionMenuGroup(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( getMenuLines( w, h, 3, 1 ) );

        menuGroup.add( getOnMenuButton( w, h, menuList[8].buttons[0] ) );
        menuGroup.add( getOffMenuButton( w, h, menuList[8].buttons[1] ) );

        menuGroup.add( createVolumeChangeSubMenu( w, h/3,  menuList[8].buttons[4] ) );

        menuGroup.add( getMenuTextMesh( 0, ADMenuList[0], 5, menuList[8].buttons[2], true, MenuFunctionsManager.getSubShowDropdownFunc( 0, menuList[8].buttons[2] ),w/3, h/3 ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[8].submenus[0], ADLanguagesArray ) );

        menuGroup.add( getMenuTextMesh( -h/3, ADMenuList[1], 5, menuList[8].buttons[3], true, MenuFunctionsManager.getSubShowDropdownFunc( 1, menuList[8].buttons[3] ),w/3, h/3 ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[8].submenus[1], ADPresentationArray ) );

        interController.removeInteractiveObject( menuList[4].buttons[2] );
        
        menuGroup.add( getImageMesh( -w/3, 35, 35, MOMenuButtonsArray[2], menuList[4].buttons[2] ) );
        menuGroup.add( getImageMesh( -w/3, 35, 35, MOMenuDisabledButtonsArray[2], menuList[4].buttons[6] ) );
    
        menuGroup.name = name;
        menuGroup.visible = false; //Not the first menu. Visibility false.

        return menuGroup;
    }

//////////////////////////////
//       Audio Sub
//////////////////////////////

    function createAudioSubtMenuGroup(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( getMenuLines( w, h, 3, 1 ) );

        menuGroup.add( getOnMenuButton( w, h, menuList[9].buttons[0] ) );
        menuGroup.add( getOffMenuButton( w, h, menuList[9].buttons[1] ) );

        menuGroup.add( createVolumeChangeSubMenu( w, h/3,  menuList[9].buttons[4] ) );

        menuGroup.add( getMenuTextMesh( 0, ASTMenuList[0], 5, menuList[9].buttons[2], true, MenuFunctionsManager.getSubShowDropdownFunc( 0, menuList[9].buttons[2] ), w/3, h/3 ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[9].submenus[0], ASTLanguagesArray ) );

        menuGroup.add( getMenuTextMesh( -h/3, ASTMenuList[1], 5, menuList[9].buttons[3], true, MenuFunctionsManager.getSubShowDropdownFunc( 1, menuList[9].buttons[3] ), w/3, h/3 ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[9].submenus[1], ASTEasyArray ) );

        interController.removeInteractiveObject( menuList[4].buttons[3] );
        
        menuGroup.add( getImageMesh( -w/3, 35, 35, MOMenuButtonsArray[3], menuList[4].buttons[3] ) );
        menuGroup.add( getImageMesh( -w/3, 35, 35, MOMenuDisabledButtonsArray[3], menuList[4].buttons[7] ) );
    
        menuGroup.name = name;
        menuGroup.visible = false; //Not the first menu. Visibility false.

        return menuGroup;
    }

//////////////////////////////
//       Settings Cardboard
//////////////////////////////

    function createSettingsCardboardMenu(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( getImageMesh( -w/4, 45, 45, './img/menu/settings_icon.png', menuList[3].buttons[0], MenuFunctionsManager.getSettingsMenuFunc( menuList[3].buttons[0] ) ) );
        menuGroup.add( getImageMesh( w/4, 45, 28, './img/menu/cardboard_icon.png', menuList[3].buttons[1], MenuFunctionsManager.getCardboardFunc() ) );
    
        menuGroup.name = name;
        menuGroup.visible = false; //Not the first menu. Visibility false.

        return menuGroup;
    }

    function createSettingsCardboardMenuTraditional(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( menuData.getImageMesh((tradmenuDivisions-1)*w/(tradmenuDivisions*2), 2, 2, './img/menu/settings_icon.png', menuList[3].buttons[0], MenuFunctionsManager.getCloseTradMenuFunc(), w/tradmenuDivisions, 4));
        menuGroup.name = name;

        return menuGroup;
    }

    function createMultiOptionsMenu(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( getImageMesh( -3*w/8, 25, 25, MOMenuButtonsArray[0], menuList[4].buttons[0], MenuFunctionsManager.getSTMenuFunc( menuList[4].buttons[0] ) ) );
        menuGroup.add( getImageMesh( -3*w/8, 25, 25, MOMenuDisabledButtonsArray[0], menuList[4].buttons[4], MenuFunctionsManager.getSTMenuFunc( menuList[4].buttons[4] ) ) );

        menuGroup.add( getImageMesh( -w/8, 25, 25, MOMenuButtonsArray[1], menuList[4].buttons[1], MenuFunctionsManager.getSLMenuFunc( menuList[4].buttons[1] ) ) );
        menuGroup.add( getImageMesh( -w/8, 25, 25, MOMenuDisabledButtonsArray[1], menuList[4].buttons[5], MenuFunctionsManager.getSLMenuFunc( menuList[4].buttons[5] ) ) );

        menuGroup.add( getImageMesh( w/8, 25, 25, MOMenuButtonsArray[2], menuList[4].buttons[2], MenuFunctionsManager.getADMenuFunc( menuList[4].buttons[2] ) ) );
        menuGroup.add( getImageMesh( w/8, 25, 25, MOMenuDisabledButtonsArray[2], menuList[4].buttons[6], MenuFunctionsManager.getADMenuFunc( menuList[4].buttons[6] ) ) );

        menuGroup.add( getImageMesh( 3*w/8, 25, 25, MOMenuButtonsArray[3], menuList[4].buttons[3], MenuFunctionsManager.getASTMenuFunc( menuList[4].buttons[3] ) ) );
        menuGroup.add( getImageMesh( 3*w/8, 25, 25, MOMenuDisabledButtonsArray[3], menuList[4].buttons[7], MenuFunctionsManager.getASTMenuFunc( menuList[4].buttons[7] ) ) );
    
        menuGroup.name = name;
        menuGroup.visible = false; //Not the first menu. Visibility false.

        return menuGroup;
    }

// EXPERIMENTAL
    function createMultiOptionsMenuTraditional(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( 
            getMenuTitleMesh(
                (tradmenuDivisions-11)*w/(tradmenuDivisions*2), 
                1.5, 
                'ST', 
                menuList[4].buttons[0], 
                false, 
                MenuFunctionsManager.getMultiOptionsMenuFunc(menuList[4].buttons[0]),
                w/tradmenuDivisions,
                4
            ));
        var stDis = menuData.getImageMesh((tradmenuDivisions-11)*w/(tradmenuDivisions*2), 2,2, './img/menu/disabled_st_icon.png', menuList[4].buttons[4], MenuFunctionsManager.getMultiOptionsMenuFunc(menuList[4].buttons[4]), w/tradmenuDivisions,4);
        stDis.visible = false;
        menuGroup.add(stDis );

        menuGroup.add( 
            getMenuTitleMesh(
                (tradmenuDivisions-9)*w/(tradmenuDivisions*2),
                1.5,
                'SL',
                menuList[4].buttons[1],
                false,
                MenuFunctionsManager.getMultiOptionsMenuFunc(menuList[4].buttons[1]),
                w/tradmenuDivisions,
                4
            ));
        var slDis = menuData.getImageMesh( (tradmenuDivisions-9)*w/(tradmenuDivisions*2), 2,2, './img/menu/disabled_sl_icon.png', menuList[4].buttons[5], MenuFunctionsManager.getMultiOptionsMenuFunc(menuList[4].buttons[5]), w/tradmenuDivisions,4 );
        slDis.visible = false;
        menuGroup.add( slDis );

        menuGroup.add( 
            getMenuTitleMesh(
                (tradmenuDivisions-7)*w/(tradmenuDivisions*2),
                1.5,
                'AD',
                menuList[4].buttons[2],
                false,
                MenuFunctionsManager.getMultiOptionsMenuFunc(menuList[4].buttons[2]),
                w/tradmenuDivisions,
                4
            ));
        var adDis = menuData.getImageMesh((tradmenuDivisions-7)*w/(tradmenuDivisions*2), 2,2, './img/menu/disabled_ad_icon.png', menuList[4].buttons[6], MenuFunctionsManager.getMultiOptionsMenuFunc(menuList[4].buttons[6]), w/tradmenuDivisions,4 );
        adDis.visible = false;
        menuGroup.add( adDis );

        menuGroup.add(
            getMenuTitleMesh(
                (tradmenuDivisions-5)*w/(tradmenuDivisions*2), 
                1.5, 
                'AST', 
                menuList[4].buttons[3], 
                false, 
                MenuFunctionsManager.getMultiOptionsMenuFunc(menuList[4].buttons[3]),
                w/tradmenuDivisions,
                4
            ));
        var astDis = menuData.getImageMesh((tradmenuDivisions-5)*w/(tradmenuDivisions*2), 3,2, './img/menu/disabled_ast_icon.png', menuList[4].buttons[7], MenuFunctionsManager.getMultiOptionsMenuFunc(menuList[4].buttons[7]), w/tradmenuDivisions,4 );
        astDis.visible = false;
        menuGroup.add( astDis );

        menuGroup.name = name;
        return menuGroup;
    }

    function createVolumeChangeMenu(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( getImageMesh( 3*w/8, 22.5, 22.5, './img/menu/plus_icon.png', menuList[2].buttons[1], MenuFunctionsManager.getChangeVolumeFunc( true, menuList[2].buttons[1] ) ) );
        menuGroup.add( getImageMesh( 0, 56, 56, './img/menu/volume_mute_icon.png', menuList[2].buttons[3], MenuFunctionsManager.getMuteVolumeFunc( menuList[2].buttons[3] ) ) );
        menuGroup.add( getImageMesh( 0, 56, 56, './img/menu/volume_unmute_icon.png', menuList[2].buttons[2], MenuFunctionsManager.getUnMuteVolumeFunc( menuList[2].buttons[2] ) ) );
        menuGroup.add( getImageMesh( -3*w/8, 22.5, 22.5, './img/menu/minus_icon.png', menuList[2].buttons[0], MenuFunctionsManager.getChangeVolumeFunc( false, menuList[2].buttons[0] ) ) );

        menuGroup.add( getMenuTextMesh( 0, AudioManager.getVolume()*100+'%', 18, 'volumeLevel', false ) );

        menuGroup.name = name;
        menuGroup.visible = false; //Not the first menu. Visibility false.

        return menuGroup;
    }

    function createVolumeChangeSubMenu(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( getImageMesh( 3*w/8, 22.5, 22.5, './img/menu/plus_icon.png', menuList[2].buttons[1] ) );
        menuGroup.add( getImageMesh( 0, 35, 35, './img/menu/volume_mute_icon.png', menuList[2].buttons[3] ) );
        menuGroup.add( getImageMesh( 0, 35, 35, './img/menu/volume_unmute_icon.png', menuList[2].buttons[2] ) );
        menuGroup.add( getImageMesh( -3*w/8, 22.5, 22.5, './img/menu/minus_icon.png', menuList[2].buttons[0] ) );

        menuGroup.add( getMenuTextMesh( 0, AudioManager.getVolume()*100+'%', 18, 'volumeLevel', false ) );

        menuGroup.name = name;
        menuGroup.visible = true; //Not the first menu. Visibility false.

        menuGroup.scale.set(0.3,0.3,1);
        menuGroup.position.y = h;

        return menuGroup;
    }

    function createPlaySeekMenu(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( getImageMesh( 0, 42.2, 42.2, './img/menu/play_icon.png', menuList[1].buttons[0], MenuFunctionsManager.getPlayPauseFunc( menuList[1].buttons[0] ) ) );
        menuGroup.add( getImageMesh( 0, 42.2, 42.2, './img/menu/pause_icon.png', menuList[1].buttons[1], MenuFunctionsManager.getPlayPauseFunc( menuList[1].buttons[1] ) ) );
        menuGroup.add( getImageMesh( 11*w/32, 22.5, 11.25, './img/menu/seek_icon.png', menuList[1].buttons[3], MenuFunctionsManager.getSeekFunc( true, menuList[1].buttons[3] ) ) ); 
        menuGroup.add( getImageMesh( -11*w/32, 22.5, 11.25, './img/menu/seek_icon.png', menuList[1].buttons[2], MenuFunctionsManager.getSeekFunc( false, menuList[1].buttons[2] ) ) );

        interController.setActiveMenuName( name );

        menuGroup.name = name;

        return menuGroup;
    }

    function createCloseButtonMenu(name)
    {
        var mesh = getImageMesh( 0, 10, 10, './img/menu/plus_icon.png', name );
        mesh.position.set( 57, 30, menuElementsZ );
        mesh.rotation.z = Math.PI/4;

        mesh.onexecute = function() {
            if ( interController.getSubtitlesActive() ) subController.enableSubtitles();
            subController.switchSigner( interController.getSignerActive() );
            MenuManager.pressButtonFeedback( name );
            setTimeout(function() {
                MenuManager.closeMenu(); 
                scene.getObjectByName( "openMenu" ).visible = true;
                //scene.getObjectByName( "openMenuTrad" ).visible = true; //EXPERIMENTAL
            }, clickInteractionTimeout);
        };

        return mesh;
    }

    function createNextRButtonMenu(name)
    {
        var mesh = getImageMesh( 0, 8.4, 8.4, './img/menu/less_than_icon.png', name );
        mesh.position.set( 57, -30, menuElementsZ );
        mesh.rotation.z = Math.PI;

        mesh.onexecute = function() {
            MenuManager.pressButtonFeedback( name );
            MenuManager.changeMenuLeftOrRight( true );
        };

        return mesh;
    }

    function createNextLButtonMenu(name)
    {
        var mesh = getImageMesh( 0, 8.4, 8.4, './img/menu/less_than_icon.png', name );
        mesh.position.set( -57, -30, menuElementsZ );

        mesh.onexecute = function() {
            MenuManager.pressButtonFeedback( name );
            MenuManager.changeMenuLeftOrRight( false );
        };

        return mesh;
    }

    function createLSMenus(backgroundmenu)
    {
        var w = backgroundmenu.geometry.parameters.width;
        var h = backgroundmenu.geometry.parameters.height;

        backgroundmenu.add( createPlaySeekMenu( w, h, menuList[1].name ) );
        backgroundmenu.add( createVolumeChangeMenu( w, h, menuList[2].name ) );
        backgroundmenu.add( createSettingsCardboardMenu( w, h, menuList[3].name ) );
        backgroundmenu.add( createMultiOptionsMenu( w, h, menuList[4].name ) );

        backgroundmenu.add( createSettingsMenuGroup( w, h, menuList[5].name ) );

        backgroundmenu.add( createSubtitleMenuGroup( w, h, menuList[6].name ) );
        backgroundmenu.add( createSignerMenuGroup( w, h, menuList[7].name ) );
        backgroundmenu.add( createAudioDescriptionMenuGroup( w, h, menuList[8].name ) );
        backgroundmenu.add( createAudioSubtMenuGroup( w, h, menuList[9].name ) );    
    }

    function createTradMenus(backgroundmenu)
    {
        var w = backgroundmenu.geometry.parameters.width;
        var h = backgroundmenu.geometry.parameters.height;

        var menuGroup =  new THREE.Group();

        var linesHoritzontalGroup =  new THREE.Group();
        var linesMenuGroup = menuData.menuLineVerticalDivisions(w, h, 0xffffff, 16)

        menuGroup.add( linesMenuGroup );
    
        menuGroup.name = 'trad';
        menuGroup.visible = true; //Not the first menu. Visibility false.

        backgroundmenu.add( menuGroup );
    }


//************************************************************************************
// Public Functions
//************************************************************************************

    this.createMenu = function()
    {
        var menu = menuData.getBackgroundMesh( 125, 125*9/16, backgroundMenuColor, 1 );

        menu.add( createCloseButtonMenu( menuList[0].buttons[0] ) );
        menu.add( createNextRButtonMenu( menuList[0].buttons[1] ) );
        menu.add( createNextLButtonMenu( menuList[0].buttons[2] ) );

        menu.name = menuList[0].name; //menuList.backgroudMenu
        menu.position.set( 0, 0, -69 );

        createLSMenus( menu );       

        if ( _isHMD )
        {
            menu.scale.set( 0.5, 0.5, 1 );
            scene.add( menu );
        }
        else
        {
            menu.scale.set( 1, 1, 1 );
            camera.add( menu );
        }
    };


// EXPERIMENTAL
    this.createSecondaryMenusTraditional = function(backgroundmenu)
    {
        var w = backgroundmenu.geometry.parameters.width;
        var h = backgroundmenu.geometry.parameters.height;

        backgroundmenu.add( createMultiOptionsMenuTraditional(w,h, menuList[4].name) );
        backgroundmenu.add( createSettingsCardboardMenuTraditional(w,h, "settingsCardboardTrad") );
            
    };

    var activeSecondaryMenuTrad;

    this.getActiveSecondaryMenuTrad = function()
    {
        return activeSecondaryMenuTrad;
    }

    this.setActiveSecondaryMenuTrad = function(name)
    {
        activeSecondaryMenuTrad = name;
    }

    this.createListBackground = function(xPos, yPos, w, h, title, submenuIndex, options)
    {
        var submenu = menuList[submenuIndex];
        if(!scene.getObjectByName(submenu.name))
        {
            subController.switchSigner( false );
            if(activeSecondaryMenuTrad)
            {
                activeSecondaryMenuTrad.buttons.forEach(function(elem){
                    interController.removeInteractiveObject(elem);
                }); 
              camera.remove(camera.getObjectByName(activeSecondaryMenuTrad.name));
                
            } 
            secMMgr.setActiveSecondaryMenuTrad(submenu); 

            var listBg = menuData.getBackgroundMesh(w, h, 0x333333, 0.8);

            listBg.position.set(xPos, yPos, -60);

            var menuGroup =  new THREE.Group();

            var listHeight = (h - h/(options.length+1));
            var height = listHeight/2;

            var dropdowmTitle = getMenuTextMesh( height, title, tradMenuLetterSize, title, true, null, w, heigthDropdownOption);


            var onButton = menuData.getPlaneImageMesh( 4.5, 2.5, './img/menu/toggle_on.png', submenu.buttons[0], 4 );
            onButton.position.set( -w/2+onButton.geometry.parameters.width/2+2,height, menuElementsZ );
            onButton.onexecute = MenuFunctionsManager.getOnOffFunc( submenu.buttons[0] );

            var offButton = menuData.getPlaneImageMesh( 4.5, 2.5, './img/menu/toggle_off.png', submenu.buttons[1], 4 );
            offButton.position.set( -w/2+offButton.geometry.parameters.width/2+2, height, menuElementsZ );
            offButton.onexecute = MenuFunctionsManager.getOnOffFunc( submenu.buttons[1] );

            menuGroup.add( onButton );
            menuGroup.add( offButton );

            var opt_length = options.length;

            var line = menuData.createLine( 0xffffff, new THREE.Vector3(  w/2, h/2 - listHeight/options.length, 0), new THREE.Vector3( -w/2, h/2 - listHeight/opt_length, 0) );

            menuGroup.add(dropdowmTitle);

            options.forEach(function(opt, i){
                height = height - listHeight/opt_length;
                var option = getMenuTextMesh( height, opt, tradMenuLetterSize, submenu.buttons[i+2], true, MenuFunctionsManager.getMultiOptionsSubMenuFunc(submenu.submenus[i].name), w, heigthDropdownOption);
                option.position.x = -w/2+option.geometry.boundingBox.max.x+2;
                option.children[0].position.x = +w/2-option.geometry.boundingBox.max.x-2;
                interController.addInteractiveObject(option);
                menuGroup.add(option);
                var next = menuData.getNextIconMesh(heigthDropdownOption/6, heigthDropdownOption/6, 0xffffff, 0, "next");
                next.position.x = w-option.geometry.boundingBox.max.x-4;
                option.add(next);      
            });

            listBg.add(line)

            listBg.add(menuGroup);
            listBg.name = submenu.name;

            camera.add(listBg);
            MenuController.showOnOffToggleButton(submenuIndex, submenu.buttons[0], submenu.buttons[1], null, null);

        }
        else
        {
            subController.switchSigner( interController.getSignerActive() );
            secMMgr.removeSubTradMenu(undefined);
        } 
    }

    this.openTradSubMenuDropdown = function(index, submenuIndex, title, options, previousOptions)
    {
        var submenu = menuList[submenuIndex];
        MenuManager.setSubmenuNameActive(submenu.submenus[index].name);
        secMMgr.removeSubTradMenu(submenu.submenus[index]);

        var tradMenuBg = scene.getObjectByName("traditionalMenuBackground");
        var h = (options.length+1) * heigthDropdownOption;
        var x = (tradMenuBg.geometry.parameters.width-tradMenuWidth)/2;
        var y = (tradMenuBg.position.y+(tradMenuBg.geometry.parameters.height + h)/2)+1+scene.getObjectByName("bgTimeline").geometry.parameters.height;


        var listBg = menuData.getBackgroundMesh(tradMenuWidth,h, 0x333333, 0.8);
        listBg.position.set(x, y, -60);

        var menuGroup =  new THREE.Group();

        var listHeight = (h - h/(options.length+1));
        var height = listHeight/2;

        //posY, text, textSize, name, visible, func, cw, ch
        var dropdowmTitle = getMenuTextMesh( height, title, tradMenuLetterSize,"back", true, secMMgr.goBack(previousOptions, submenuIndex), tradMenuWidth, heigthDropdownOption);
        interController.addInteractiveObject(dropdowmTitle);
        var back = menuData.getNextIconMesh(heigthDropdownOption/6, heigthDropdownOption/6, 0xffffff, Math.PI, "back");

        back.position.x = -tradMenuWidth/2+2;
        dropdowmTitle.add(back);

        menuGroup.add(dropdowmTitle);

        var line = menuData.createLine( 0xffffff, new THREE.Vector3( tradMenuWidth/2, h/2 - listHeight/options.length, 0), new THREE.Vector3( -tradMenuWidth/2, h/2 - listHeight/options.length, 0));
        listBg.add(line)
        

        for(var i = 0; i<submenu.submenus[index].buttons.length; i++)
        {
            height = height - listHeight/options.length;

            var option = getMenuTextMesh( height, options[i], tradMenuLetterSize, submenu.submenus[index].buttons[i], true, MenuFunctionsManager.getButtonFunctionByName(submenu.submenus[index].buttons[i]), tradMenuWidth, heigthDropdownOption);
            option.position.x = -tradMenuWidth/2+option.geometry.boundingBox.max.x+2;
            option.children[0].position.x = +tradMenuWidth/2-option.geometry.boundingBox.max.x-2;

            menuGroup.add( option );
        }

        listBg.add(menuGroup);
        
        listBg.name = submenu.submenus[index].name;

        camera.add(listBg)

        submenu.submenus[index].buttons.forEach(function(elem){
            if(camera.getObjectByName(elem))
            interController.addInteractiveObject(camera.getObjectByName(elem));
            // CHANGE TO A SEPARATE FUNCTION
            if ( settingsLanguage == elem 
                || subtitlesLanguage == elem 
                || subtitlesEasy == elem 
                || subtitlesPosition == elem 
                || subtitlesSize == elem 
                || subtitlesIndicator == elem
                || subtitlesBackground == elem
                || subtitlesArea == elem
                || signerPosition == elem
                || signerIndicator == elem
                || signerArea == elem 
                || signerLanguage == elem ) 
            {
                scene.getObjectByName(elem).material.color.set( menuButtonActiveColor ); 
            }
        }); 
    }

    this.removeSubTradMenu = function(newActiveSubMenu)
    {
         secMMgr.getActiveSecondaryMenuTrad().buttons.forEach(function(elem){
            interController.removeInteractiveObject(elem);
        }); 
        camera.remove(camera.getObjectByName(secMMgr.getActiveSecondaryMenuTrad().name)); 
        secMMgr.setActiveSecondaryMenuTrad(newActiveSubMenu);  
    }

    this.goBack = function(multiOptionsMenuList, prevIndex)
    {
        return function()
        {
            interController.removeInteractiveObject("back");
            var tradMenuBg = scene.getObjectByName("traditionalMenuBackground");
            var h = (multiOptionsMenuList.length+1) * heigthDropdownOption;
            var x = (tradMenuBg.geometry.parameters.width-tradMenuWidth)/2;
            var y = (tradMenuBg.position.y+(tradMenuBg.geometry.parameters.height + h)/2)+1+scene.getObjectByName("bgTimeline").geometry.parameters.height;
            secMMgr.createListBackground(x, y, tradMenuWidth, h, menuList[prevIndex].title, prevIndex, multiOptionsMenuList);
        }
    }

    this.scaleTimeLine = function(totalTime, currentTime, w, currentTimeMesh, bgTimelineMesh)
    {
        var newWidth = (currentTime*w)/totalTime;

        secMMgr.timelineScale = newWidth/w;
        currentTimeMesh.scale.set(secMMgr.timelineScale, 1,1);
        bgTimelineMesh.scale.set(1-secMMgr.timelineScale, 1,1);

        if( ! currentTimeMesh.geometry.boundingBox ) currentTimeMesh.geometry.computeBoundingBox();
        if( ! bgTimelineMesh.geometry.boundingBox ) bgTimelineMesh.geometry.computeBoundingBox();

        var widthCurrent = currentTimeMesh.geometry.boundingBox.max.x - currentTimeMesh.geometry.boundingBox.min.x;
        var widthBg = bgTimelineMesh.geometry.boundingBox.max.x - bgTimelineMesh.geometry.boundingBox.min.x;

        currentTimeMesh.position.x = (-widthCurrent + widthCurrent * (secMMgr.timelineScale)) / 2 ;
        bgTimelineMesh.position.x = (widthBg - widthCurrent * (1-secMMgr.timelineScale)) / 2 ;

        var currentTime = menuData.getMenuTextMesh(ppMMgr.getPlayoutTime(moData.getListOfVideoContents()[0].vid.currentTime), 1.25, 0xffffff, "currentTime", null, null);
        currentTime.position.x =  -(tradmenuDivisions-15)*scene.getObjectByName("traditionalMenuBackground").geometry.parameters.width/(tradmenuDivisions*2);

        scene.getObjectByName("playoutTime").add(currentTime);
    }
}

THREE.SecondaryMenuManager.prototype.constructor = THREE.SecondaryMenuManager;
