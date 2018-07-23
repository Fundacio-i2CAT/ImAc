/**
 * @author isaac.fraile@i2cat.net
 */
THREE.MenuManager = function () {

//*******************************************************************************************************
//
//                              P U B L I C       F U N C T I O N S
// 
//*******************************************************************************************************

/**
 * Gets the menu list.
 *
 * @return     {<type>}  The menu list.
 */
    this.getMenuList = function()
    {
        return menuList;
    }

/**
 * Sets the submenu name active.
 *
 * @param      {<type>}  name    The name
 */
    this.setSubmenuNameActive = function(name)
    {
        submenuNameActive = name;
    }

/**
 * Gets the submenu name active.
 *
 * @return     {<type>}  The submenu name active.
 */
    this.getSubmenuNameActive = function()
    {
        return submenuNameActive;
    }

    /**
 * { function_description }
 *
 * @param      {<type>}  backgroundmenu  The backgroundmenu
 * @param      {<type>}  subMenuData     The sub menu data
 */
    this.dropdownSubMenuCreation = function(backgroundmenu, subMenuData, dataArray)
    {
        var secondColumGroup = new THREE.Group();
        var subMenuDataLength = subMenuData.buttons.length;

        /*function menuLineHoritzontalDivisions(color, numberofdivisions, backgroundmenu, row)*/
        var secondColumnLines = menuData.menuLineHoritzontalDivisions(menuDefaultColor, subMenuDataLength, backgroundmenu, 2);
        
        secondColumGroup.add(secondColumnLines);
        subMenuData.buttons.forEach(function(elem, index)
        {
            var factor = (index*2)+1;
            var option = menuData.getMenuTextMesh(dataArray[index], subMenuTextSize, menuDefaultColor, elem)
            option.position.set( backgroundmenu.geometry.parameters.width/3, (backgroundmenu.geometry.parameters.height/2-factor*backgroundmenu.geometry.parameters.height/(subMenuDataLength*2)), 0.01);                    
            
            // CHANGE TO A SEPARATE FUNCTION
            if (settingsLanguage == elem || subtitlesLanguage == elem || subtitlesPosition == elem ||subtitlesSize == elem || subtitlesIndicator == elem) option.material.color.set( menuButtonActiveColor ); 
            
            secondColumGroup.add(option); 
        })

        secondColumGroup.position.z = 0.01;
        secondColumGroup.name = subMenuData.name;
        secondColumGroup.visible = false;

        return secondColumGroup
    }

//*******************************************************************************************************
//
//              P U B L I C       I N T E R A C T I O N       F U N C T I O N S
// 
//*******************************************************************************************************
    
    this.openMenu = function()
    {
        isUserInSecondLevelMenus = false;
        var background = createMenuBackground(menuMargin, backgroundMenuColor);
        factorScale = background.geometry.parameters.height/background.geometry.parameters.width

// FIRST LEVEL MENUS
        PlayPauseMenuManager.createPlaySeekMenu(background, factorScale);
        VolumeMenuManager.createVolumeChangeMenu(background, factorScale);
        SettingsCardboardMenuManager.createSettingsCardboardMenu(background, factorScale);
        MultiOptionsMenuManager.createMultiOptionsMenu(background,factorScale); 

// SECOND LEVEL MENUS
        SettingsMenuManager.openSettingsMenu(background); 
        SubtitleMenuManager.openSubtitleMenu(background); 
        //openAudioDescriptionMenu(background); //EXPERIMENTAL
        
///********* CODE REPITE IN LINE 23 *************************        
        menuList.forEach(function(menu, index){
            if(index == 0 || index == menuList.map(function(e) { return e.name; }).indexOf(interController.getActiveMenuName()))
            {
                menu.buttons.forEach(function(elem){interController.addInteractiveObject(scene.getObjectByName(elem))}); 
            }
        });
        PlayPauseMenuManager.showPlayPauseButton();
        MultiOptionsMenuManager.showMultiOptionsButtons(multiOptionsMainSubMenuIndexes);
///************************************************************  

        // THIS OPTION HAS TO EXIST ONLY IN TABLET/PC OPTION
        // VR MODE NEEDS OTHER OPTION   
        camera.add(background);   
        //scene.add(background);   
    }

    /**
 * Opens a second level menu.
 *
 * @param      {<type>}  submenuindex  The submenuindex
 */
    this.openSecondLevelMenu = function(submenuindex)
    {
        isUserInSecondLevelMenus = true; 
        // Forward menu button invisible and not interactive
        scene.getObjectByName(menuList[0].buttons[1]).visible = false;
        interController.removeInteractiveObject (menuList[0].buttons[1]);

        var indexActiveMenu = menuList.map(function(e) { return e.name; }).indexOf(interController.getActiveMenuName());
        scene.getObjectByName(interController.getActiveMenuName()).visible = false;

///********* CODE REPITE IN LINE 59 *************************  
        menuList.forEach(function(menu, index){
            if(index != 0)
            {
                if(menu.submenus)
                {
                    menu.submenus.forEach(function(submenus){
                        submenus.buttons.forEach(function(button){
                            interController.removeInteractiveObject(button)
                        });
                    });
                }
                menu.buttons.forEach(function(button){
                    interController.removeInteractiveObject(button)
                });
            }   
        });
        interController.setActiveMenuName(menuList[submenuindex].name);
        menuList[submenuindex].buttons.forEach(function(elem){
            scene.getObjectByName(elem).material.color.set(menuDefaultColor)
            interController.addInteractiveObject(scene.getObjectByName(elem));
        }); 
        scene.getObjectByName(interController.getActiveMenuName()).visible = true;
    }

/**
 * Opens a sub menu dropdown.
 *
 * @param      {<type>}  submenuNameActiveIndex  The submenu name active index
 */
    this.openSubMenuDropdown = function(submenuNameActiveIndex, firstRowButtonName)
    {
        var indexActiveMenu = menuList.map(function(e) { return e.name; }).indexOf(interController.getActiveMenuName());
        var secondColumnIndex = menuList[indexActiveMenu].submenus.map(function(e) { return e.name; }).indexOf(MenuManager.getSubmenuNameActive());
        if(secondColumnIndex > -1)
        {
            scene.getObjectByName(menuList[indexActiveMenu].name).getObjectByName(menuList[indexActiveMenu].submenus[secondColumnIndex].name).visible = false;
            menuList[indexActiveMenu].submenus[secondColumnIndex].buttons.forEach(function(elem)
            {
                interController.removeInteractiveObject(elem);
            });
        }

        MenuManager.setSubmenuNameActive(menuList[indexActiveMenu].submenus[submenuNameActiveIndex].name);

        scene.getObjectByName(menuList[indexActiveMenu].name).getObjectByName(menuList[indexActiveMenu].submenus[submenuNameActiveIndex].name).visible = true;

        menuList[indexActiveMenu].buttons.forEach(function(elem)
        {
            if(elem != menuList[6].buttons[0] && elem != menuList[6].buttons[1])
            {
                if(elem === firstRowButtonName) scene.getObjectByName(elem).material.color.set( menuButtonActiveColor );
                else scene.getObjectByName(elem).material.color.set( menuDefaultColor );
            }
        }); 
        menuList[indexActiveMenu].submenus[submenuNameActiveIndex].buttons.forEach(function(elem){interController.addInteractiveObject(scene.getObjectByName(elem))}); 
    }

/**
 * Closes a menu.
 */
    this.closeMenu = function()
    {
        var menu = scene.getObjectByName(menuList[0].name); //menuList.backgroundMenu
        menu.children.forEach(function(elem){
            removeEntity(elem);
        });
        removeEntity(menu);
        menu.visible = false;

        // THIS OPTION HAS TO EXIST ONLY IN TABLET/PC OPTION
        // VR MODE MENU MAY BE ATTACHED TO BACKGROUND/SCENE ONLY   
        camera.remove(menu);
        //scene.remove(menu);
    }

/**
 * This function creates the visual feedback when pressing any of the menu buttons (except dropdown elements)
 *
 * @param      {<type>}  buttonName  The button name
 */
    this.pressButtonFeedback = function(buttonName)
    {   
        interController.removeInteractiveObject(buttonName);
        var sceneElement = scene.getObjectByName(buttonName)
        var initScale = sceneElement.scale;
        sceneElement.material.color.set(menuButtonActiveColor);
        sceneElement.scale.set(initScale.x*0.8, initScale.y*0.8, 1);

        setTimeout(function(){ 
            sceneElement.material.color.set(menuDefaultColor);
            sceneElement.scale.set(initScale.x*1.25, initScale.y*1.25, 1); 
            interController.addInteractiveObject(sceneElement);
        }, clickInteractionTimeout);
    }

/**
 * { function_description }
 *
 * @param      {<type>}  buttonName  The button name
 */
    this.selectOptionFinalDropdown = function(buttonName)
    {
        var indexActiveMenu = menuList.map(function(e) { return e.name; }).indexOf(interController.getActiveMenuName());
        var secondColumnIndex = menuList[indexActiveMenu].submenus.map(function(e) { return e.name; }).indexOf(MenuManager.getSubmenuNameActive());

        menuList[indexActiveMenu].submenus[secondColumnIndex].buttons.forEach(function(elem)
        {    
            if(elem === buttonName) scene.getObjectByName(elem).material.color.set( menuButtonActiveColor );
            else scene.getObjectByName(elem).material.color.set( menuDefaultColor );
        }); 
    }

/**
 * { function_description }
 *
 * @param      {<type>}  direction  The direction
 */
    this.changeMenuLeftOrRight = function(direction)
    {
        var indexActiveMenu = menuList.map(function(e) { return e.name; }).indexOf(interController.getActiveMenuName());
        var newIndex = 0;
        scene.getObjectByName(interController.getActiveMenuName()).visible = false;

///********* CODE REPITE IN LINE 59 *************************  
        menuList.forEach(function(menu, index){
            if(index != 0)
            {
                if(menu.submenus)
                {
                    menu.submenus.forEach(function(submenus){
                        submenus.buttons.forEach(function(button){
                            interController.removeInteractiveObject(button)
                        });
                    });
                }
                menu.buttons.forEach(function(button){
                    interController.removeInteractiveObject(button)
                });
            }   
        });
///***********************************************************
        if(direction) newIndex = getNextArrayPosition(indexActiveMenu+1);
        else newIndex = getNextArrayPosition(indexActiveMenu-1);

        interController.setActiveMenuName(menuList[newIndex].name);
        menuList[newIndex].buttons.forEach(function(elem){interController.addInteractiveObject(scene.getObjectByName(elem))}); 

        // If the next menu is PLAY/PAUSE or volume change MUTE/UNMUTE remove the nonactive button interactivity from the list.
        if(newIndex == 1)
        {
            if(PlayPauseMenuManager.isPausedById(0)) interController.removeInteractiveObject(menuList[1].buttons[1]); //menuList.playSeekMenu.playButton
            else interController.removeInteractiveObject(menuList[1].buttons[0]); //menuList.playSeekMenu.pauseButton
        }
        else if(newIndex == 2)
        {
            VolumeMenuManager.showMuteUnmuteButton();
            if(AudioManager.getVolume()>0) interController.removeInteractiveObject(menuList[2].buttons[2]); //menuList.volumeChangeMenu.unmuteVolumeButton  
            else interController.removeInteractiveObject(menuList[2].buttons[3]); //menuList.volumeChangeMenu.unmuteVolumeButton  
        }
        scene.getObjectByName(interController.getActiveMenuName()).visible = true;
    } 

//************************************************************************************
//
//                  P R I V A T E       F U N C T I O N S 
// 
//************************************************************************************

    function getSizeOfMenu (cameraFOV, sphereRadius, margin) 
    {
        var menuWidth = sphereRadius+margin;
        var menuHeight = menuWidth*menuAspectRatioHeigth/menuAspectRatioWidth;
        var menuDiagonal = Math.round(Math.sqrt(Math.pow(menuWidth,2)+Math.pow(menuHeight,2)));

        var piramidHeight = Math.round(Math.sqrt(Math.pow(sphereRadius,2)-Math.pow(menuDiagonal/2,2)));

        // Remove 1 unit for precision purpose. Sphere is not perfect it is formed from planes.
        return piramidHeight-1;
    }

    function removeEntity (object) 
    {
        object.children.forEach(function(elem1){
            elem1.children.forEach(function(elem2){
                interController.removeInteractiveObject(elem2.name);
            });
        });
    }

    function getNextArrayPosition(nextIndex)
    {
        if(isUserInSecondLevelMenus)
        {
            isUserInSecondLevelMenus = false;
            var indexActiveMenu = menuList.map(function(e) { return e.name; }).indexOf(interController.getActiveMenuName());

            // Forward menu nutton visible and interactive
            var forwardMenuButton = scene.getObjectByName(menuList[0].buttons[1])
            forwardMenuButton.visible = true;
            interController.addInteractiveObject(forwardMenuButton)

            // Make the second level sub menu dissapear and remove interactivity.
            var secondColumnIndex = menuList[indexActiveMenu].submenus.map(function(e) { return e.name; }).indexOf(submenuNameActive)
            if(secondColumnIndex > -1)
            {
                scene.getObjectByName(menuList[indexActiveMenu].name).getObjectByName(menuList[indexActiveMenu].submenus[secondColumnIndex].name).visible = false;
                menuList[indexActiveMenu].submenus[secondColumnIndex].buttons.forEach(function(elem)
                {
                    interController.removeInteractiveObject(elem);
                });
            }

            return menuList[indexActiveMenu].firstmenuindex;
        }
        else
        {
            //First level menu cycling 
            if (nextIndex > numberFirstLevelMenus - 1)
            {
                return 1;
            }
            else if (nextIndex < 1)
            {
                return numberFirstLevelMenus-1;
            }
            else
            {
                return nextIndex;
            }
        }
    } 

/**
 * Creates the menu background of the first level of menus.
 */
    function createMenuBackground(margin, color)
    {
        var sphereRadius = scene.getObjectByName('contentsphere').geometry.parameters.radius;
        var cameraFOV = scene.getObjectByName('perspectivecamera').fov;

        var distance = getSizeOfMenu(cameraFOV, sphereRadius , margin);
        var menuWidth = sphereRadius+margin;
        var menuHeight = menuWidth*menuAspectRatioHeigth/menuAspectRatioWidth;
        var menu = menuData.getBackgroundMesh(menuWidth, menuHeight, color, 1);
        var factorScale = menuHeight/menuWidth;

        var closeButton = menuData.getImageMesh( new THREE.PlaneGeometry( backgroundMenuCloseButtonWidth*factorScale,backgroundMenuCloseButtonHeight*factorScale ), './img/menu/plus_icon.png', menuList[0].buttons[0], 4 ); // menuList.
        var nextR = menuData.getImageMesh( new THREE.PlaneGeometry( backgroundChangeMenuButtonWidth*factorScale,backgroundChangeMenuButtonHeight*factorScale ), './img/menu/less_than_icon.png', menuList[0].buttons[1], 4 ); // menuList.
        var nextL = menuData.getImageMesh( new THREE.PlaneGeometry( backgroundChangeMenuButtonWidth*factorScale,backgroundChangeMenuButtonHeight*factorScale ), './img/menu/less_than_icon.png', menuList[0].buttons[2], 4 ); // menuList.

        closeButton.position.set((menu.geometry.parameters.width/2-closeButtonMarginX*factorScale), (menu.geometry.parameters.height/2-closeButtonMarginY*factorScale), 0.01)
        closeButton.rotation.z = Math.PI/4;
        nextR.position.set(Math.cos(0)*(menu.geometry.parameters.width/2 - nextButtonMarginX*factorScale), -(menu.geometry.parameters.height/2 - nextButtonMarginY*factorScale), 0.01)
        nextR.rotation.z = Math.PI;
        nextL.position.set(Math.cos(Math.PI)*(menu.geometry.parameters.width/2 - nextButtonMarginX*factorScale), -(menu.geometry.parameters.height/2 - nextButtonMarginY*factorScale), 0.01)

        closeButton.name = menuList[0].buttons[0]; //menuList.backgroudMenu.closeMenuButton;
        nextR.name = menuList[0].buttons[1]; //menuList.backgroudMenu.forwardMenuButton;
        nextL.name = menuList[0].buttons[2]; //menuList.backgroudMenu.backMenuButton;

        menu.add(closeButton);
        menu.add(nextR);
        menu.add(nextL);

        menu.name = menuList[0].name; //menuList.backgroudMenu
        menu.position.set(0,0, -distance);
        return menu
    }

//************************************************************************************
// EXPERIMENTAL
//************************************************************************************

    function testButton(name, color, x, y)
    {
        var geometry = new THREE.CircleGeometry( 8, 32 );
        var material = new THREE.MeshBasicMaterial( { color: color } );
        var circle = new THREE.Mesh( geometry, material );

        circle.position.z = 0.01;
        circle.position.x = x;
        circle.position.y = y;

        circle.name = name;

        return circle;
    }

    this.createMenu = function()
    {
        var geometry = new THREE.CircleGeometry( 1,32 );
        var material = new THREE.MeshBasicMaterial( { color: 0x13ec56 } );
        var circle = new THREE.Mesh( geometry, material );

        circle.position.z = -8;
        circle.position.x = 0;
        circle.position.y = 5;

        circle.lookAt(new THREE.Vector3(0, 0, 0));

        circle.renderOrder = 5;
        circle.name = 'openMenu';

        scene.add( circle );

        return circle;
    };


    this.createButton2 = function()
    {
        var geometry = new THREE.CircleGeometry( 8, 32 );
        var material = new THREE.MeshBasicMaterial( { color: 0xc900c2 } );
        var circle = new THREE.Mesh( geometry, material );

        circle.scale.set( 0.05,0.05,1 );

        circle.position.z = -10;
        circle.position.x = 1;
        circle.position.y = -4;

        circle.lookAt(new THREE.Vector3(0, 0, 0));

        circle.renderOrder = 5;
        circle.name = 'cardboardButton';

        scene.add( circle );

        return circle;
    };

    /*function openAudioDescriptionMenu(backgroundmenu)
    {
        menuData.getMenuTextMesh('AD', 40, 0xffffff, menuList[4].buttons[1], function(audiodescriptionMenuButton) //menuList.multiOptionsMenu.showAudioDescriptionMenuButton;           
        {
            var audiodescriptionMenuGroup =  new THREE.Group();
            var onButton = testButton('audioDescriptionOnButton', 0x00ff00, 5);
            var offButton = testButton('audioDescriptionOffButton', 0xff0000, 25);

            interController.removeInteractiveObject (menuList[4].buttons[1]);

            audiodescriptionMenuButton.material.color.set( 0xffff00 );
            audiodescriptionMenuButton.position.x = -150;
            audiodescriptionMenuButton.position.y = -20;

            audiodescriptionMenuGroup.add(audiodescriptionMenuButton);
            audiodescriptionMenuGroup.add(onButton);
            audiodescriptionMenuGroup.add(offButton);

            audiodescriptionMenuGroup.name = menuList[7].name; //menuList.
            audiodescriptionMenuGroup.visible = false; //Not the first menu. Visibility false.

            backgroundmenu.add(audiodescriptionMenuGroup);

            scene.add( backgroundmenu );
         });
    }*/
}

THREE.MenuManager.prototype.constructor = THREE.MenuManager;