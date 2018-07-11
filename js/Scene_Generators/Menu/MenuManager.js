/**
 * @author isaac.fraile@i2cat.net
 */
THREE.MenuManager = function () {

    var numberFirstLevelMenus = 5;
    var isUserInSecondLevelMenus = false;
    var submenuNameActive;
    var firstColumnActiveButton;
    var secondColumnActiveButton;
    var menuList = 
    [
/*0*/   { 
            name: 'backgroudMenu', 
            buttons: 
            [
                'closeMenuButton', 
                'forwardMenuButton', 
                'backMenuButton'
            ]
        },                                     
/*1*/   { 
            name: 'playSeekMenu', 
            buttons: 
            [
                'playButton', 
                'pauseButton', 
                'backSeekButton', 
                'forwardSeekButton'
            ]
        },                            
/*2*/   { 
            name: 'volumeChangeMenu', 
            buttons: 
            [
                'minusVolumeButton', 
                'plusVolumeButton', 
                'unmuteVolumeButton', 
                'muteVolumeButton'
            ]
        },         
/*3*/   { 
            name: 'settingsCardboardMenu', 
            buttons: 
            [
                'settingsButton', 
                'cardboardButton'
            ]
        }, 
/*4*/   { 
            name: 'multiOptionsMenu', 
            buttons: 
            [
                'showSubtitleMenuButton',
                'showSignLanguageMenuButton', 
                'showAudioDescriptionMenuButton', 
                'showAudioSubtitleMenuButton'
            ]
        }, 

// SECOND LEVEL MENUS

/*5*/   { 
            name: 'settingsMenu', isEnabled: true, firstmenuindex: 3, 
            submenus:
            [
                { 
                    name:'settingsLanguages', 
                    buttons:
                    [
                        'settingsLanguageEngButton',
                        'settingsLanguageEspButton',
                        'settingsLanguageCatButton',
                        'settingsLanguageGerButton'
                    ]
                },
                { 
                    name:'settingsVoiceControl', 
                    buttons:['vc1']
                },
                { 
                    name:'settingsUserProfile', 
                    buttons:['up1', 'up2']
                }
            ],
            buttons: 
            [
                'settingsLanguageButton',
                'settingsVoiceControlButton',
                'settingsUserProfileButton'
            ]
        },                                                       
/*6*/   { 
            name: 'subtitleMenu', isEnabled: true, firstmenuindex: 4,
            submenus:
            [
                { 
                    name: 'subtitleLanguages', 
                    buttons:
                    [
                        'subtitleEngButton', 
                        'subtitleEspButton',
                        'subtitleGerButton',
                        'subtitleCatButton'
                    ]
                },
                { 
                    name: 'subtitleShowPositions', 
                    buttons:
                    [
                        'subtitleTopButton',
                        'subtitleBottomButton'
                    ]
                },
                { 
                    name: 'subtitleAreas', 
                    buttons:
                    [
                        'subtitleSmallAreaButton', 
                        'subtitleMediumlAreaButton',
                        'subtitleLargeAreaButton'
                    ]
                },
            ],
            buttons: 
            [
                'subtitleOnButton', 
                'subtitleOffButton',
                'subtitleShowLanguagesDropdown',
                'subtitleShowPositionsDropdown',
                'subtitleShowAreasDropdown'
            ]
        }/*,                                   
/*7   { 
            name: 'audioDescriptionMenu', isEnabled: true, firstmenuindex: 4, 
            buttons: 
            [
                'audioDescriptionOnButton', 
                'audioDescriptionOffButton'
            ]
        } */                                   
    ];

//************************************************************************************
// PUBLIC FUNCTIONS
//************************************************************************************

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
    this.dropdownSubMenuCreation = function(backgroundmenu, subMenuData)
    {
        var secondColumGroup = new THREE.Group();
        var subMenuDataLength = subMenuData.buttons.length;
        //function menuLineHoritzontalDivisions(color, numberofdivisions, backgroundmenu, row)
        var secondColumnLines = menuData.menuLineHoritzontalDivisions(0xffffff, subMenuDataLength, backgroundmenu, 2);
        
        secondColumGroup.add(secondColumnLines);
        subMenuData.buttons.forEach(function(elem, index)
        {
            var factor = (index*2)+1;
            secondColumGroup.add(testButton(elem, 0xcce6ff, backgroundmenu.geometry.parameters.width/3, (backgroundmenu.geometry.parameters.height/2-factor*backgroundmenu.geometry.parameters.height/(subMenuDataLength*2)))); 
        })

        secondColumGroup.position.z = 0.01;
        secondColumGroup.name = subMenuData.name;
        secondColumGroup.visible = false;

        return secondColumGroup
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

        menuList[indexActiveMenu].buttons.forEach(function(elem){
            
            if(elem === firstRowButtonName) scene.getObjectByName(elem).material.color.set( 0xffff00 );
            else scene.getObjectByName(elem).material.color.set( 0xffffff );
        }); 
        
        menuList[indexActiveMenu].submenus[submenuNameActiveIndex].buttons.forEach(function(elem){interController.addInteractiveObject(scene.getObjectByName(elem))}); 
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
            if(moData.isPausedById(0)) interController.removeInteractiveObject(menuList[1].buttons[1]); //menuList.playSeekMenu.playButton
            else interController.removeInteractiveObject(menuList[1].buttons[0]); //menuList.playSeekMenu.pauseButton
        }
        else if(newIndex == 2)
        {
            showMuteUnmuteButton();
            if(AudioManager.getVolume()>0)
            {
                interController.removeInteractiveObject(menuList[2].buttons[2]); //menuList.volumeChangeMenu.unmuteVolumeButton  
            } 
            else
            {
                interController.removeInteractiveObject(menuList[2].buttons[3]); //menuList.volumeChangeMenu.unmuteVolumeButton  
            } 
        }
        scene.getObjectByName(interController.getActiveMenuName()).visible = true;
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
                menu.buttons.forEach(function(button){
                    interController.removeInteractiveObject(button)
                });
            }   
        });

        interController.setActiveMenuName(menuList[submenuindex].name);
        menuList[submenuindex].buttons.forEach(function(elem){
            interController.addInteractiveObject(scene.getObjectByName(elem));
            //scene.getObjectByName(elem).material.color.set(0xffffff);
        }); 
        scene.getObjectByName(interController.getActiveMenuName()).visible = true;
    }

//************************************************************************************
// PUBLIC INTERACTION FUNCTIONS
//************************************************************************************
    
    this.openMenu = function()
    {
        isUserInSecondLevelMenus = false;
        var background = createMenuBackground();
        background.scale.set(0.05,0.05,1);
        background.position.set(0, 0, -10);

// FIRST LEVEL MENUS
        createPlaySeekMenu(background);
        createVolumeChangeMenu(background);
        createSettingsCardboardMenu(background);
        createMenuMultiOptions(background); //EXPERIMENTAL

// SECOND LEVEL MENUS
        SettingsMenuManager.openSettingsMenu(background) //EXPERIMENTAL
        SubtitleMenuManager.openSubtitleMenu(background); //EXPERIMENTAL
        //openAudioDescriptionMenu(background); //EXPERIMENTAL
        
        showPlayPauseButton();

///********* CODE REPITE IN LINE 23 *************************        
        menuList.forEach(function(menu, index){
            if(index != 0 && index != menuList.map(function(e) { return e.name; }).indexOf(interController.getActiveMenuName()))
            {
                menu.buttons.forEach(function(button){
                    interController.removeInteractiveObject(button)
                });
            }
        });
///************************************************************        
    }

    this.closeMenu = function()
    {
        var menu = scene.getObjectByName(menuList[0].name); //menuList.backgroundMenu
        menu.children.forEach(function(elem){
            removeEntity(elem);
        });
        removeEntity(menu);
        menu.visible = false;
        scene.remove(menu);
    }

    this.playButtonInteraction = function()
    {
        moData.isPausedById(0) ? moData.playAll() : moData.pauseAll();
        showPlayPauseButton();
        interController.removeInteractiveObject(menuList[1].buttons[0]);
        interController.addInteractiveObject(scene.getObjectByName(menuList[1].buttons[1])); //menuList.playSeekMenu.pauseButton
    }

    this.pauseButtonInteraction = function()
    {
        moData.isPausedById(0) ? moData.playAll() : moData.pauseAll();
        showPlayPauseButton();
        interController.removeInteractiveObject(menuList[1].buttons[1]);
        interController.addInteractiveObject(scene.getObjectByName(menuList[1].buttons[0])); //menuList.playSeekMenu.playButton
    }

    this.unMuteButtonInteraction = function()
    {
        showMuteUnmuteButton();
        interController.removeInteractiveObject(menuList[2].buttons[2]); //menuList.volumeChangeMenu.unmuteVolumeButton
        interController.addInteractiveObject(scene.getObjectByName(menuList[2].buttons[3])); //menuList.volumeChangeMenu.muteVolumeButton
    }

    this.muteButtonInteraction = function()
    {
        showMuteUnmuteButton();
        interController.removeInteractiveObject(menuList[2].buttons[3]); //menuList.volumeChangeMenu.muteVolumeButton
        interController.addInteractiveObject(scene.getObjectByName(menuList[2].buttons[2])); //menuList.volumeChangeMenu.unMuteVolumeButton
    }

//************************************************************************************
// Private Functions
//************************************************************************************

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
 * Shows/Hides the play pause button depeding on the activeVideo status moData.isPausedById(0) = true/false
 */
    function showPlayPauseButton()
    {
        if(moData.isPausedById(0))
        {
            scene.getObjectByName(menuList[1].buttons[0]).visible = true; //menuList.playSeekMenu.playButton
            scene.getObjectByName(menuList[1].buttons[1]).visible = false; //menuList.playSeekMenu.pauseButton
        }
        else
        {
            scene.getObjectByName(menuList[1].buttons[1]).visible = true; //menuList.playSeekMenu.pauseButton
            scene.getObjectByName(menuList[1].buttons[0]).visible = false; //menuList.playSeekMenu.playButton
        }
    }

/**
 * Shows/Hides the mute unmute button depending on the activeVideo volume AudioManager.getVolume()>0 
 */
    function showMuteUnmuteButton()
    {
        if(AudioManager.getVolume()>0)
        {
            scene.getObjectByName(menuList[2].buttons[2]).visible = false; //menuList.volumeChangeMenu.unmuteVolumeButton
            scene.getObjectByName(menuList[2].buttons[3]).visible = true; //menuList.volumeChangeMenu.muteVolumeButton
        }
        else
        {
            scene.getObjectByName(menuList[2].buttons[3]).visible = false; //menuList.volumeChangeMenu.muteVolumeButton
            scene.getObjectByName(menuList[2].buttons[2]).visible = true; //menuList.volumeChangeMenu.unmuteVolumeButton
        }
    }

/**
 * Creates the menu background of the first level of menus.
 */
    function createMenuBackground()
    {
        var menu = menuData.getBackgroundMesh(352, 198, 0x000000,1);
        var closeButton = menuData.getCloseIconMesh(10,10,0xffffff, menuList[0].buttons[0]);
        var nextR = menuData.getNextIconMesh(10,10,0xffffff,0, menuList[0].buttons[1]);
        var nextL = menuData.getNextIconMesh(10,10,0xffffff, Math.PI, menuList[0].buttons[2]);

        closeButton.position.y = (menu.geometry.parameters.height/2 - 15);
        closeButton.position.x = (menu.geometry.parameters.width/2 - 15);

        nextR.position.y = -(menu.geometry.parameters.height/2 - 15);
        nextR.position.x = (menu.geometry.parameters.width/2 - 10);

        nextL.position.y = -(menu.geometry.parameters.height/2 - 15);
        nextL.position.x = -(menu.geometry.parameters.width/2 - 10);

        closeButton.name = menuList[0].buttons[0]; //menuList.backgroudMenu.closeMenuButton;
        nextR.name = menuList[0].buttons[1]; //menuList.backgroudMenu.forwardMenuButton;
        nextL.name = menuList[0].buttons[2]; //menuList.backgroudMenu.backMenuButton;

        menu.add(closeButton);
        menu.add(nextR);
        menu.add(nextL);

        menu.name = menuList[0].name; //menuList.backgroudMenu

        return menu
    }

/**
 * Creates the play/seek menu.
 *
 * @param      {<mesh>}  backgroundmenu  The backgroundmenu
 */
    function createPlaySeekMenu(backgroundmenu)
    {
        //The 4 main buttons are created inside a group 'playSeekGroup'
        var playSeekGroup =  new THREE.Group();
        var playbutton = menuData.getPlayMesh(140, 140, 0xffffff, menuList[1].buttons[0]);
        var pausebutton = menuData.getPauseMesh(140, 140, 0xffffff, menuList[1].buttons[1]);
        var seekBarL = menuData.getSeekMesh( 80, 40, 0xffffff, Math.PI, menuList[1].buttons[2]);
        var seekBarR = menuData.getSeekMesh( 80, 40, 0xffffff, 0, menuList[1].buttons[3]);

        //Video starts in play so PLAY button is not visible and interaction is removed from list.
        playbutton.visible = false; 
        interController.removeInteractiveObject(menuList[1].buttons[0]); //Remove intercativity because it is the first menu to be open.

        seekBarR.position.x = 120;
        seekBarL.position.x = -120;

        playSeekGroup.add( playbutton );
        playSeekGroup.add( pausebutton );
        playSeekGroup.add( seekBarR );
        playSeekGroup.add( seekBarL );

        playSeekGroup.name = menuList[1].name; //menuList.playSeekMenu
        backgroundmenu.add(playSeekGroup);

        interController.setActiveMenuName(menuList[1].name); //menuList.playSeekMenu

        scene.add(backgroundmenu);
    }

/**
 * Creates a volume change mute/unmute menu.
 *
 * @param      {<mesh>}  backgroundmenu  The backgroundmenu
 */
    function createVolumeChangeMenu(backgroundmenu)
    {

        //The 4 main buttons are created inside a group 'volumeChangeGroup'
        var volumeChangeGroup =  new THREE.Group();
        var plusVolume = menuData.getPlusIconMesh( 20, 20, 0xffffff,  menuList[2].buttons[1]);
        var audioMuteIcon = menuData.getImageMesh( new THREE.PlaneGeometry( 150,150 ), './img/menu/audio_volume_icon.png', menuList[2].buttons[3], 4 ); // menuList.volumeChangeMenu.muteVolumeButton
        var audioUnmuteIcon = menuData.getImageMesh( new THREE.PlaneGeometry( 150,150 ), './img/menu/audio_volume_mute_icon.png', menuList[2].buttons[2], 4 ); // menuList.volumeChangeMenu.unmuteVolumeButton
        var minusVolume = menuData.getMinusIconMesh( 20, 20, 0xffffff,  menuList[2].buttons[0] );

        //Video starts unmuted so UNMUTE button is not visible.Interaction is will be removed when change menu button is clicked.
        audioUnmuteIcon.visible = false;

        plusVolume.position.x = 130;
        minusVolume.position.x = -130;
        
        audioMuteIcon.position.z = 1;
        audioUnmuteIcon.position.z = 1;

        volumeChangeGroup.add( plusVolume );
        volumeChangeGroup.add( audioMuteIcon );
        volumeChangeGroup.add( audioUnmuteIcon );
        volumeChangeGroup.add( minusVolume );

        volumeChangeGroup.name = menuList[2].name; // menuList.volumeChangeMenu
        volumeChangeGroup.visible = false; //Not the first menu. Visibility false.
        backgroundmenu.add(volumeChangeGroup);

        scene.add( backgroundmenu );
    }

/**
 * Creates a settings/cardboard menu.
 *
 * @param      {<mesh>}  backgroundmenu  The backgroundmenu
 */
    function createSettingsCardboardMenu(backgroundmenu)
    {
        //The 2 main buttons are created inside a group 'settingsCardboardGroup'
        var settingsCardboardGroup =  new THREE.Group();
        var settingsIcon = menuData.getImageMesh( new THREE.PlaneGeometry( 120, 120 ), './img/menu/cog_icon.png', 'right', 4 );
        var cardboardIcon = menuData.getImageMesh( new THREE.PlaneGeometry( 120, 80 ), './img/menu/cardboard_icon.png', 'right', 4 );
        
        settingsIcon.name = menuList[3].buttons[0]; // menuList.settingsCardboardMenu.settingsButton;
        cardboardIcon.name = menuList[3].buttons[1]; //menuList.settingsCardboardMenu.cardboadButton;

        cardboardIcon.position.x = 80;
        cardboardIcon.position.z = 0.01;
        settingsIcon.position.x = -80;
        settingsIcon.position.z = 0.01;
        
        settingsCardboardGroup.add( cardboardIcon );
        settingsCardboardGroup.add( settingsIcon );

        settingsCardboardGroup.name = menuList[3].name; // menuList.settingsCardboardMenu
        settingsCardboardGroup.visible = false; //Not the first menu. Visibility false.

        backgroundmenu.add(settingsCardboardGroup);

        scene.add( backgroundmenu );
    } 

/**
 * Creates menu multi options.
 *
 * @param      {<type>}  backgroundmenu  The backgroundmenu
 */
    function createMenuMultiOptions(backgroundmenu)
    {
        var multiOptionsGroup =  new THREE.Group();
        multiOptionsGroup.name = menuList[4].name; // menuList.multiOptionsMenu
        multiOptionsGroup.visible = false;
        
        var subtitlesMenuButton = menuData.getMenuTextMesh('ST', 30, 0xffffff, menuList[4].buttons[0]); //menuList.multiOptionsMenu.showSubtitleMenuButton;                
        subtitlesMenuButton.position.x = -4*backgroundmenu.geometry.parameters.width/9;
        subtitlesMenuButton.position.y = -subtitlesMenuButton.children[0].geometry.parameters.height/4;

        subtitlesMenuButton.name = menuList[4].buttons[0]; 
        multiOptionsGroup.add( subtitlesMenuButton );

        var signLanguageMenuButton = menuData.getMenuTextMesh('SL', 30, 0xffffff, menuList[4].buttons[1]); //menuList.multiOptionsMenu.showSignLanguageMenuButton;                
        signLanguageMenuButton.position.x = -2*backgroundmenu.geometry.parameters.width/9;
        signLanguageMenuButton.position.y = -signLanguageMenuButton.children[0].geometry.parameters.height/4;

        signLanguageMenuButton.name = menuList[4].buttons[1]; 
        multiOptionsGroup.add( signLanguageMenuButton );

        var audiodescriptionMenuButton = menuData.getMenuTextMesh('AD', 30, 0xffffff, menuList[4].buttons[2]); //menuList.multiOptionsMenu.showAudioDescriptionMenuButton;                
        audiodescriptionMenuButton.position.x = 0*backgroundmenu.geometry.parameters.width/9;
        audiodescriptionMenuButton.position.y = -audiodescriptionMenuButton.children[0].geometry.parameters.height/4;

        audiodescriptionMenuButton.name = menuList[4].buttons[2]; 
        multiOptionsGroup.add( audiodescriptionMenuButton );


        var audioSubtitleMenuButton = menuData.getMenuTextMesh('AST', 30, 0xffffff, menuList[4].buttons[3]); //menuList.multiOptionsMenu.showAudioSubtitleMenuButton;                
        audioSubtitleMenuButton.position.x = 2*backgroundmenu.geometry.parameters.width/9;
        audioSubtitleMenuButton.position.y = -audioSubtitleMenuButton.children[0].geometry.parameters.height/4;

        audioSubtitleMenuButton.name = menuList[4].buttons[3]; 
        multiOptionsGroup.add( audioSubtitleMenuButton );

        backgroundmenu.add(multiOptionsGroup);
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

    this.createMenu = function()
    {
        var geometry = new THREE.CircleGeometry( 8, 32 );
        var material = new THREE.MeshBasicMaterial( { color: 0x13ec56 } );
        var circle = new THREE.Mesh( geometry, material );

        circle.scale.set( 0.05,0.05,1 );

        circle.position.z = -10;
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