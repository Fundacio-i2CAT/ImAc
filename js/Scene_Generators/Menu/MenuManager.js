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
 * This function makes the menu follow the users FoV. This option is 
 * only enabled in HMD mode.
 *
 * @param      {integer}  rotationDir  The rotation direction negative/left positive/right
 */
    this.menuFollowCameraFOV = function(rotationDir)
    {
        var object = scene.getObjectByName(menuList[0].name); // The menu
        var objRotAngleY = Math.round(Math.degrees(object.rotation.y))%360; // The menu rotation angle in the Y axe.
        var camRotAngleY = Math.round(Math.degrees(camera.rotation.y))%360; // The camera rotation angle in the Y axe.
        
        // If the difference between the menu and camera angle is over 60 recalculate the new angle
        // in order to have the menu centered for the user.
        if(rotationDir<0)
        {
            if(Math.abs(camRotAngleY - objRotAngleY)>60)
            {
                // Subtract the diference between the camera and menu rotation
                menuAngle -= (camRotAngleY - objRotAngleY);

                // Calculate the new distances on the x & z axes with the new angle.
                object.position.x = Math.sin(Math.radians(menuAngle))*69;
                object.position.z = -Math.cos(Math.radians(menuAngle))*69;

                // Caculate the new menu rotation in Y adding the diference between the camera and menu rotation.
                object.rotation.y = object.rotation.y + 1*Math.radians((camRotAngleY - objRotAngleY));
            }
        }
        else
        {
            if(Math.abs(objRotAngleY - camRotAngleY)>60)
            {
                // Add the diference between the menu and camera rotation
                menuAngle += (objRotAngleY - camRotAngleY);
                object.position.x = Math.sin(Math.radians(menuAngle))*69;
                object.position.z = -Math.cos(Math.radians(menuAngle))*69;

                // Caculate the new menu rotation in Y subtracting the diference between the camera and menu rotation.
                object.rotation.y = object.rotation.y + -1*Math.radians((objRotAngleY - camRotAngleY));
            }
        }
    }
    
/**
 * Gets the menu list.
 *
 * @return     {<Array>}  The menu list.
 */
    this.getMenuList = function()
    {
        return menuList;
    }

/**
 * Sets the active submenu name.
 *
 * @param      {<String>}  name    The name
 */
    this.setSubmenuNameActive = function(name)
    {
        submenuNameActive = name;
    }

/**
 * Gets the active submenu name.
 *
 * @return     {<String>}  The submenu name active.
 */
    this.getSubmenuNameActive = function()
    {
        return submenuNameActive;
    }

    

//*******************************************************************************************************
//
//              P U B L I C       I N T E R A C T I O N       F U N C T I O N S
// 
//*******************************************************************************************************
    
/**
 * This function creates all the menus and submenus and opens the menu. 
 * If HMD or tablet the menu is attached and scaled differently (HMD -> scene; tablet -> camera).
 */
    this.openMenu = function()
    {
        isUserInSecondLevelMenus = false;
        var background = createMenuBackground(menuMargin, backgroundMenuColor);
        factorScale = background.geometry.parameters.height/background.geometry.parameters.width;

// MAIN MENUS
        secMMgr.createLSMenus( background );

        if ( _isHMD )
        {
            background.scale.set( 0.6, 0.6, 1 );
            scene.add( background );
        }
        else
        {
            background.scale.set( 1, 1, 1 );
            camera.add( background );
        }
        
///********* CODE REPITE IN LINE 23 *************************        
        menuList.forEach(function(menu, index){
            if(index == 0 || index == menuList.map(function(e) { return e.name; }).indexOf(interController.getActiveMenuName()))
            {
                menu.buttons.forEach(function(elem){interController.addInteractiveObject(scene.getObjectByName(elem))}); 
            }
        });
        
        ppMMgr.showPlayPauseButton();
        secMMgr.showMultiOptionsButtons(multiOptionsMainSubMenuIndexes);

        
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
            scene.getObjectByName(elem).material.color.set(menuDefaultColor);
            interController.addInteractiveObject(scene.getObjectByName(elem));
        }); 
        scene.getObjectByName(interController.getActiveMenuName()).visible = true;
    }

/**
 * Opens the submenu final dropdown
 * 
 * This function displays the dropdown with the final options to be chosen by the user.
 * The first column option selected will be highlighted with 'menuButtonActiveColor' (yellow).
 * 
 * @param      {<int>}      submenuActiveIndex  The submenu active index
 * @param      {<string>}   activeOptionName    The active option name
 */
    this.openSubMenuDropdown = function(submenuActiveIndex, activeOptionName)
    {
        // Find the main menu index with the saved variable interController.getActiveMenuName()
        var indexActiveMenu = menuList.map(function(e) { return e.name; }).indexOf(interController.getActiveMenuName());

        // Find the index of the sub menu opened before in order to remove the interativity from the array and change visible = false
        var secondColumnIndex = menuList[indexActiveMenu].submenus.map(function(e) { return e.name; }).indexOf(MenuManager.getSubmenuNameActive());
        
        if(secondColumnIndex > -1)
        {
            scene.getObjectByName(menuList[indexActiveMenu].name).getObjectByName(menuList[indexActiveMenu].submenus[secondColumnIndex].name).visible = false;
            menuList[indexActiveMenu].submenus[secondColumnIndex].buttons.forEach(function(elem)
            {
                interController.removeInteractiveObject(elem);
            });
        }

        // Set the new active sub menu name and change visible = true
        MenuManager.setSubmenuNameActive(menuList[indexActiveMenu].submenus[submenuActiveIndex].name);
        scene.getObjectByName(menuList[indexActiveMenu].name).getObjectByName(menuList[indexActiveMenu].submenus[submenuActiveIndex].name).visible = true;

        // Change color of all nonactive options to 'menuDefaultColor' (white) and active option to 'menuButtonActiveColor' (yellow)
        menuList[indexActiveMenu].buttons.forEach(function(elem)
        {
                if(elem === activeOptionName) scene.getObjectByName(elem).material.color.set( menuButtonActiveColor );
                else scene.getObjectByName(elem).material.color.set( menuDefaultColor );
        });

        // Add all buttons from active dropdown to the interactivity array.
        menuList[indexActiveMenu].submenus[submenuActiveIndex].buttons.forEach(function(elem){interController.addInteractiveObject(scene.getObjectByName(elem))}); 
    }

    function updateSubtitleSubMenu(position)
    {
        var indexActiveMenu = menuList.map(function(e) { return e.name; }).indexOf(interController.getActiveMenuName());

        var h = scene.getObjectByName(menuList[0].name).geometry.parameters.height;

        menuList[indexActiveMenu].buttons.forEach(function(elem)
        {
            if ( elem == 'subtitlesShowLanguagesDropdown' 
                || elem == 'subtitlesShowEasyReadDropdown' 
                || elem == 'subtitlesShowPositionsDropdown' 
                || elem == 'subtitlesShowBackgroundDropdown' 
                || elem == 'subtitlesShowSizesDropdown'
                || elem == 'subtitlesShowIndicatorDropdown'
                || elem == 'subtitlesShowAreasDropdown' )

            {
                var menuElem = scene.getObjectByName(elem);
                menuElem.position.y = position ? menuElem.position.y + h/4 : menuElem.position.y - h/4;

                if (menuElem.visible && menuElem.position.y > h/4) menuElem.visible = false;
                else if (menuElem.visible && menuElem.position.y < -h/4) menuElem.visible = false;
                else if (menuElem.visible == false && menuElem.position.y <= h/4 && menuElem.position.y >= -h/4) menuElem.visible = true;

                // Posible position.y -->        -2, -1, 0, 1, 2         (5 elements)
                // Posible position.y -->    -3, -2, -1, 0, 1, 2         (6 elements)
                // Posible position.y -->    -3, -2, -1, 0, 1, 2, 3      (7 elements)

                if (menuElem.position.y < -3*h/4) menuElem.position.y = 3*h/4;
                else if (menuElem.position.y > 3*h/4) menuElem.position.y = -3*h/4;

            }
        });

    }

/**
 * Closes the menu and removes all the entities from the camera/scene.
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
        //camera.remove(menu);
        _isHMD ? scene.remove(menu) : camera.remove(menu);
    }

/**
 * This function creates the visual feedback when pressing
 * any of the menu buttons (except dropdown elements)
 *
 * @param      {<tring>}  buttonName  The button name
 */
    this.pressButtonFeedback = function(buttonName)
    {   
        // Remove the interactivity during the visual feedback so users can not click while the animation is occuring.
        interController.removeInteractiveObject(buttonName);

        var sceneElement = scene.getObjectByName(buttonName)

        // Save the init scale of the element in order to return the button to the same size.
        var initScale = sceneElement.scale;

        // Change color of the button to 'menuButtonActiveColor' (yellow) for greater contrast. 
        sceneElement.material.color.set(menuButtonActiveColor);

        // Reduce size of the button.
        sceneElement.scale.set(initScale.x*0.8, initScale.y*0.8, 1);

        // Set color 'menuDefaultColor' (white), size to initial and add interactivity within 'clickInteractionTimeout' to sceneElement;
        setTimeout(function(){ 
            sceneElement.material.color.set(menuDefaultColor);
            sceneElement.scale.set(initScale.x*1.25, initScale.y*1.25, 1); 
            interController.addInteractiveObject(sceneElement);
        }, clickInteractionTimeout);
    }

/**
 * Select one of the options in the final dropdown.
 *
 * @param      {<string>}  buttonName  The button name
 */
    this.selectFinalDropdownOption = function(buttonName)
    {
        // Find the main menu index with the saved variable interController.getActiveMenuName()
        var indexActiveMenu = menuList.map(function(e) { return e.name; }).indexOf(interController.getActiveMenuName());

        // Find the index of the sub menu opened with MenuManager.getSubmenuNameActive()
        var secondColumnIndex = menuList[indexActiveMenu].submenus.map(function(e) { return e.name; }).indexOf(MenuManager.getSubmenuNameActive());

        // Change color of all nonactive options to 'menuDefaultColor' (white) and active option to 'menuButtonActiveColor' (yellow)
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
            if(ppMMgr.isPausedById(0)) interController.removeInteractiveObject(menuList[1].buttons[1]); //menuList.playSeekMenu.playButton
            else interController.removeInteractiveObject(menuList[1].buttons[0]); //menuList.playSeekMenu.pauseButton
        }
        else if(newIndex == 2)
        {
            volMMgr.showMuteUnmuteButton();
            if(AudioManager.getVolume()>0) interController.removeInteractiveObject(menuList[2].buttons[2]); //menuList.volumeChangeMenu.unmuteVolumeButton  
            else interController.removeInteractiveObject(menuList[2].buttons[3]); //menuList.volumeChangeMenu.unmuteVolumeButton  
        }
        scene.getObjectByName(interController.getActiveMenuName()).visible = true;
    } 

    this.changeMenuUpOrDown = function(direction)
    {
        //secondarySubIndex = direction ? secondarySubIndex + 1 : secondarySubIndex - 1;

        updateSubtitleSubMenu(direction);
    } 

/**
 * This functions displays the correct on/off toggle state and shows/hides the multi options disabled icons.
 */
    this.showOnOffToggleButton = function (subMenuIndex, onButtonIndex, offButtonIndex, enabledTitleIndex, disabledTitleIndex)
    {
        var mainMenuIndex = menuList[subMenuIndex].firstmenuindex;
        if(menuList[subMenuIndex].isEnabled)
        {
            scene.getObjectByName(menuList[subMenuIndex].buttons[onButtonIndex]).visible = true; 
            scene.getObjectByName(menuList[subMenuIndex].buttons[offButtonIndex]).visible = false; 


            scene.getObjectByName(menuList[subMenuIndex].name).getObjectByName(menuList[mainMenuIndex].buttons[enabledTitleIndex]).visible = true; 
            scene.getObjectByName(menuList[subMenuIndex].name).getObjectByName(menuList[mainMenuIndex].buttons[disabledTitleIndex]).visible = false; 

            interController.removeInteractiveObject(menuList[subMenuIndex].buttons[offButtonIndex]);
            interController.addInteractiveObject(scene.getObjectByName(menuList[subMenuIndex].buttons[onButtonIndex])); 
        }
        else
        {
            scene.getObjectByName(menuList[subMenuIndex].buttons[offButtonIndex]).visible = true; 
            scene.getObjectByName(menuList[subMenuIndex].buttons[onButtonIndex]).visible = false; 

            scene.getObjectByName(menuList[subMenuIndex].name).getObjectByName(menuList[mainMenuIndex].buttons[enabledTitleIndex]).visible = false; 
            scene.getObjectByName(menuList[subMenuIndex].name).getObjectByName(menuList[mainMenuIndex].buttons[disabledTitleIndex]).visible = true; 

            interController.removeInteractiveObject(menuList[subMenuIndex].buttons[onButtonIndex]);
            interController.addInteractiveObject(scene.getObjectByName(menuList[subMenuIndex].buttons[offButtonIndex])); 
        }
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

        closeButton.position.set((menu.geometry.parameters.width/2-closeButtonMarginX*factorScale), (menu.geometry.parameters.height/2-closeButtonMarginY*factorScale), menuElementsZ)
        closeButton.rotation.z = Math.PI/4;
        nextR.position.set(Math.cos(0)*(menu.geometry.parameters.width/2 - nextButtonMarginX*factorScale), -(menu.geometry.parameters.height/2 - nextButtonMarginY*factorScale), menuElementsZ)
        nextR.rotation.z = Math.PI;
        nextL.position.set(Math.cos(Math.PI)*(menu.geometry.parameters.width/2 - nextButtonMarginX*factorScale), -(menu.geometry.parameters.height/2 - nextButtonMarginY*factorScale), menuElementsZ)

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

        circle.position.z = menuElementsZ;
        circle.position.x = x;
        circle.position.y = y;

        circle.name = name;

        return circle;
    }

    this.createMenu = function()
    {
        var _isMenuOpenButton = true;
        var activationElement;

        if(_isMenuOpenButton)
        {
            var geometry = new THREE.CircleGeometry( 1, 32 );
            var material = new THREE.MeshBasicMaterial( { color: 0x13ec56 } );
            var activationElement = new THREE.Mesh( geometry, material );

            activationElement.position.z = -8;
            activationElement.position.x = 1.2;
            activationElement.position.y = 5;

            activationElement.lookAt(new THREE.Vector3(0, 0, 0));

            activationElement.renderOrder = 5;
            activationElement.name = 'openMenu';
            scene.add( activationElement );
        }
        else
        {
            var geometry = new THREE.SphereGeometry(99, 64, 16, Math.PI/2, Math.PI * 2,  7*Math.PI/20,  -Math.PI/12);
            //var material = new THREE.MeshBasicMaterial( {color: 0x13ec56, side: THREE.FrontSide, colorWrite: false});
            var material = new THREE.MeshBasicMaterial( {color: 0x00ff00, side: THREE.FrontSide, transparent: true, opacity:0.05});
            var activationElement = new THREE.Mesh( geometry, material );
            activationElement.name = 'openMenu';

            Reticulum.add( activationElement, {
                reticleHoverColor: 0xff0000,
                fuseDuration: 2.5, // Overrides global fuse duration
                fuseVisible: true,
                onGazeOver: function(){
                    // do something when user targets object
                    scene.getObjectByName("openmenutext").visible = true;

                    this.material.color.setHex( 0xffcc00 );
                },
                onGazeOut: function(){
                    // do something when user moves reticle off targeted object
                    scene.getObjectByName("openmenutext").visible = false;
                    this.material.color.setHex( 0x13ec56 );
                },
                onGazeLong: function(){
                    // do something user targetes object for specific time
                    this.material.color.setHex( 0x0000cc );
                    MenuManager.openMenu();
                    scene.getObjectByName( "openMenu" ).visible = false;
                },
                onGazeClick: function(){
                    // have the object react when user clicks / taps on targeted object
                    //this.material.color.setHex( 0x00cccc * Math.random() );
                    this.material.color.setHex( 0x13ec56 );
                    MenuManager.openMenu();
                    scene.getObjectByName( "openMenu" ).visible = false;
                    scene.getObjectByName("openmenutext").visible = false;
                }
            });

            scene.add( activationElement );
        }

        return activationElement;
    };

    this.createMenuTrad = function()
    {

        var geometry = new THREE.CircleGeometry( 1, 32 );
        var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        var activationElement = new THREE.Mesh( geometry, material );

        activationElement.position.z = -8;
        activationElement.position.x = -1.2;
        activationElement.position.y = 5;

        activationElement.lookAt(new THREE.Vector3(0, 0, 0));

        activationElement.renderOrder = 5;
        activationElement.name = 'openMenuTrad';
        scene.add( activationElement );


        scene.add( activationElement );

        return activationElement;
    };

   function visibleHeightAtZDepth ( depth, camera )
   {
      // compensate for cameras not positioned at z=0
      const cameraOffset = camera.position.z;
      if ( depth < cameraOffset ) depth -= cameraOffset;
      else depth += cameraOffset;

      // vertical fov in radians
      const vFOV = camera.fov * Math.PI / 180; 

      // Math.abs to ensure the result is always positive
      return 2 * Math.tan( vFOV / 2 ) * Math.abs( depth );
    };

    function visibleWidthAtZDepth ( depth, camera ) 
    {
      const height = visibleHeightAtZDepth( depth, camera );
      return height * camera.aspect;
    };

    this.openMenuTrad = function()
    {
        _isTradMenuOpen = true;
        var bgWidth = Math.round(visibleWidthAtZDepth( 60, camera )-20);
        var bg = menuData.getBackgroundMesh(bgWidth, 4, 0x333333, 0.75);
        bg.position.set(0, (-visibleHeightAtZDepth( 60, camera )/2)+2+5,-60);

        var playSeekGroup =  new THREE.Group();
        var playbutton = menuData.getImageMesh( new THREE.PlaneGeometry( 2,2 ), './img/menu/play_icon.png', menuList[1].buttons[0], 4 ); // menuList.
        var pausebutton = menuData.getImageMesh( new THREE.PlaneGeometry( 2,2 ), './img/menu/pause_icon.png', menuList[1].buttons[1], 4 ); // menuList.
        var seekBarL = menuData.getImageMesh( new THREE.PlaneGeometry( 2,1 ), './img/menu/seek_icon.png', menuList[1].buttons[2], 4 ); // menuList.
        var seekBarR = menuData.getImageMesh( new THREE.PlaneGeometry( 2,1 ), './img/menu/seek_icon.png', menuList[1].buttons[3], 4 ); // menuList.
        
        playbutton.position.z = menuElementsZ;
        pausebutton.position.z = menuElementsZ;

        seekBarR.rotation.z = Math.PI;

        seekBarR.position.x = -15*bgWidth/(20*2);
        playbutton.position.x = -17*bgWidth/(20*2);
        pausebutton.position.x = -17*bgWidth/(20*2); //pausebutton.visible = false;
        seekBarL.position.x = -19*bgWidth/(20*2);
        

        playSeekGroup.add( playbutton );
        playSeekGroup.add( pausebutton );
        playSeekGroup.add( seekBarR );
        playSeekGroup.add( seekBarL );

        playSeekGroup.name = menuList[1].name; //menuList.playSeekMenu
        bg.add(playSeekGroup);

        //interController.setActiveMenuName(menuList[1].name); //menuList.playSeekMenu






        //The 4 main buttons are created inside a group 'volumeChangeGroup'
        var volumeChangeGroup =  new THREE.Group();
        //var plusVolume = menuData.getPlusIconMesh( volumeLevelButtonWidth, volumeLevelButtonHeight,factorScale, menuDefaultColor,  menuList[2].buttons[1]);
        var audioMuteIcon = menuData.getImageMesh( new THREE.PlaneGeometry(2,2 ), './img/menu/volume_mute_icon.png', menuList[2].buttons[3], 4 ); // menuList.volumeChangeMenu.muteVolumeButton
        var audioUnmuteIcon = menuData.getImageMesh( new THREE.PlaneGeometry(2,2 ), './img/menu/volume_unmute_icon.png', menuList[2].buttons[2], 4 ); // menuList.volumeChangeMenu.unmuteVolumeButton
        
        var minusVolume = menuData.getImageMesh( new THREE.PlaneGeometry( 1,1), './img/menu/minus_icon.png', menuList[2].buttons[0], 4 ); // menuList.volumeChangeMenu.
        var plusVolume = menuData.getImageMesh( new THREE.PlaneGeometry( 1,1 ), './img/menu/plus_icon.png', menuList[2].buttons[1], 4 ); // menuList.volumeChangeMenu.
        
        
        minusVolume.position.x = -13*bgWidth/(20*2);
        audioMuteIcon.position.x = -11*bgWidth/(20*2);
        audioUnmuteIcon.position.x = -11*bgWidth/(20*2); audioUnmuteIcon.visible = false;
        plusVolume.position.x = -9*bgWidth/(20*2);

        volumeChangeGroup.add( plusVolume );
        volumeChangeGroup.add( audioMuteIcon );
        volumeChangeGroup.add( audioUnmuteIcon );
        volumeChangeGroup.add( minusVolume );

        volumeChangeGroup.name = menuList[2].name; // menuList.volumeChangeMenu


        secMMgr.createSecondaryMenusTraditional(bg);

        //var linesTest = menuData.menuLineVerticalDivisions(bgWidth, 4, 0xffffff, 20)
        

        //bg.add(linesTest); //DESIGN PURPOSE

        bg.add(playSeekGroup);
        bg.add(volumeChangeGroup);


        camera.add(bg);

        menuList.forEach(function(menu, index){
            if(index > 0 && index < 5 )
            {
                menu.buttons.forEach(function(elem){interController.addInteractiveObject(scene.getObjectByName(elem))}); 
            }
        });
        ppMMgr.showPlayPauseButton();
        secMMgr.showMultiOptionsButtons(multiOptionsMainSubMenuIndexes);

    }


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
}

THREE.MenuManager.prototype.constructor = THREE.MenuManager;
