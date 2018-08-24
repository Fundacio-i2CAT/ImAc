/**
 * @author isaac.fraile@i2cat.net
 */
THREE.MenuManager = function () {

//************************************************************************************
// Private Functions
//************************************************************************************

    function getOpenMenuButton()
    {
        var geometry = new THREE.CircleGeometry( 1, 32 );
        var material = new THREE.MeshBasicMaterial( { color: 0x13ec56 } );
        var activationElement = new THREE.Mesh( geometry, material );

        activationElement.position.z = -8;
        activationElement.position.x = 1.2;
        activationElement.position.y = 5;

        activationElement.lookAt(new THREE.Vector3(0, 0, 0));
        activationElement.renderOrder = 5;
        activationElement.onexecute = MenuFunctionsManager.getOpenMenuFunc();
        activationElement.name = 'openMenu';

        interController.addInteractiveObject( activationElement );

        return activationElement;
    }

    function getOpenMenuAreaButton()
    {
        var geometry = new THREE.SphereGeometry( 99, 64, 16, Math.PI/2, Math.PI * 2,  7*Math.PI/20,  -Math.PI/12 );
        //var material = new THREE.MeshBasicMaterial( {color: 0x13ec56, side: THREE.FrontSide, colorWrite: false});
        var material = new THREE.MeshBasicMaterial( {color: 0x00ff00, side: THREE.FrontSide, transparent: true, opacity:0.05} );
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
            onGazeLong: MenuFunctionsManager.getOpenMenuFunc(),
            onGazeClick: MenuFunctionsManager.getOpenMenuFunc()
        });

        return activationElement;
    }

    function checkMenuInteractions()
    {
        menuList.forEach( function( menu, index ) {
            if ( index == 0 || index == menuList.map(function(e) { return e.name; } ).indexOf( interController.getActiveMenuName() ) )
            {
                menu.buttons.forEach( function( elem ) { 
                    interController.addInteractiveObject( scene.getObjectByName( elem ) );
                });
            }
        });
    }

    function checkSubMenuInteractions()
    {
        menuList.forEach( function( menu, index ) {
            if ( index != 0 )
            {
                if ( menu.submenus )
                {
                    menu.submenus.forEach( function( submenus ) {
                        submenus.buttons.forEach( function( button ) {
                            interController.removeInteractiveObject( button )
                        });
                    });
                }
                menu.buttons.forEach( function( button ) {
                    interController.removeInteractiveObject( button )
                });
            }   
        });
    }

    function removeEntity (object) 
    {
        object.children.forEach(function(elem1){
            elem1.children.forEach(function(elem2){
                interController.removeInteractiveObject(elem2.name);
            });
        });
    }


//************************************************************************************
// Public Functions
//************************************************************************************

    this.createMenu = function(_isMenuOpenButton)
    {
        var activationElement = _isMenuOpenButton ? getOpenMenuButton() : getOpenMenuAreaButton();
        scene.add( activationElement );
    };

    /**
    * This function creates all the menus and submenus and opens the menu. 
    * If HMD or tablet the menu is attached and scaled differently (HMD -> scene; tablet -> camera).
    */
    this.openMenu = function()
    {
        isUserInSecondLevelMenus = false;

        secMMgr.createMenu();
        checkMenuInteractions();
        ppMMgr.showPlayPauseButton();
        MenuController.showMultiOptionsButtons( multiOptionsMainSubMenuIndexes );  
    
    };

    this.closeMenu = function()
    {
        var menu = scene.getObjectByName( menuList[0].name ); //menuList.backgroundMenu
        menu.children.forEach(function(elem){ removeEntity( elem ); });
        removeEntity( menu );
        menu.visible = false;

        _isHMD ? scene.remove(menu) : camera.remove(menu);
    };

    this.openSecondLevelMenu = function(submenuindex)
    {
        isUserInSecondLevelMenus = true; 
        // Forward menu button invisible and not interactive
        scene.getObjectByName( menuList[0].buttons[1] ).visible = false;
        interController.removeInteractiveObject( menuList[0].buttons[1] );

        //var indexActiveMenu = menuList.map(function(e) { return e.name; }).indexOf( interController.getActiveMenuName() );
        scene.getObjectByName(interController.getActiveMenuName()).visible = false;

        checkSubMenuInteractions();

        interController.setActiveMenuName( menuList[submenuindex].name );
        menuList[submenuindex].buttons.forEach(function( elem ) {
            if( scene.getObjectByName(elem).material ) scene.getObjectByName( elem ).material.color.set( menuDefaultColor );
            interController.addInteractiveObject( scene.getObjectByName(elem) );
        }); 
        scene.getObjectByName(interController.getActiveMenuName()).visible = true;
    };

    this.changeMenuLeftOrRight = function(direction)
    {
        var indexActiveMenu = menuList.map(function(e) { return e.name; }).indexOf(interController.getActiveMenuName());
        var newIndex = direction ? getNextArrayPosition( indexActiveMenu + 1 ) : getNextArrayPosition( indexActiveMenu - 1 );
        scene.getObjectByName(interController.getActiveMenuName()).visible = false;

        checkSubMenuInteractions();

        interController.setActiveMenuName( menuList[newIndex].name );
        menuList[newIndex].buttons.forEach( function(elem) {
            interController.addInteractiveObject(scene.getObjectByName(elem))
        }); 

        // If the next menu is PLAY/PAUSE or volume change MUTE/UNMUTE remove the nonactive button interactivity from the list.
        if(newIndex == 1)
        {
            if(ppMMgr.isPausedById(0)) interController.removeInteractiveObject(menuList[1].buttons[1]); //menuList.playSeekMenu.playButton
            else interController.removeInteractiveObject(menuList[1].buttons[0]); //menuList.playSeekMenu.pauseButton
        }
        else if(newIndex == 2)
        {
            MenuController.showMuteUnmuteButton();
            if(AudioManager.getVolume()>0) interController.removeInteractiveObject(menuList[2].buttons[2]); //menuList.volumeChangeMenu.unmuteVolumeButton  
            else interController.removeInteractiveObject(menuList[2].buttons[3]); //menuList.volumeChangeMenu.unmuteVolumeButton  
        }
        scene.getObjectByName(interController.getActiveMenuName()).visible = true;
    };

    /**
    * This function creates the visual feedback when pressing
    * any of the menu buttons (except dropdown elements)
    *
    * @param      {<tring>}  buttonName  The button name
    */
    this.pressButtonFeedback = function(buttonName)
    {   
        interController.removeInteractiveObject(buttonName);

        var sceneElement = scene.getObjectByName(buttonName)
        var initScale = sceneElement.scale;

        sceneElement.material.color.set( menuButtonActiveColor );
        sceneElement.scale.set( initScale.x*0.8, initScale.y*0.8, 1 );

        // Set color 'menuDefaultColor' (white), size to initial and add interactivity within 'clickInteractionTimeout' to sceneElement;
        setTimeout(function() { 
            sceneElement.material.color.set( menuDefaultColor );
            sceneElement.scale.set( initScale.x*1.25, initScale.y*1.25, 1 ); 
            interController.addInteractiveObject( sceneElement );
        }, clickInteractionTimeout);
    };


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



//************************************************************************************
//
//                  P R I V A T E       F U N C T I O N S 
// 
//************************************************************************************   

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
