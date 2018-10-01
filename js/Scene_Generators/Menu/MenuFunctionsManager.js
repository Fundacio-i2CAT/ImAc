/**
 * @author isaac.fraile@i2cat.net
 */

 // used libs: subController, MenuManager, interController, MenuController, AplicationManager
 // used globals: subtitlesLanguage....., camera, autopositioning, menuList

MenuFunctionsManager = function() {

//************************************************************************************
// Subtitle Functions
//************************************************************************************

    function getSubLanguageFunc(xml, lang, name)
    {    
        return function() {
            subController.setSubtitle( xml, lang );
            MenuManager.selectFinalDropdownOption( name );
            subtitlesLanguage = name;
        }
    }

    function getSubEasyOnOffFunc(enable, name)
    {       
        return function() {
            subController.setSubEasy( enable );
            MenuManager.selectFinalDropdownOption( name );
            subtitlesEasy = name;
        }
    }

    function getSubPositionFunc(position, name)
    {       
        return function() {
            subController.setSubPosition( 0, position );
            MenuManager.selectFinalDropdownOption( name );
            subtitlesPosition = name;
        }
    }

    function getSubBackgroundFunc(index, name)
    {       
        return function() {
            subController.setSubBackground( index );
            MenuManager.selectFinalDropdownOption( name );
            subtitlesBackground = name;
        }
    }

    function getSubSizeFunc(size, name)
    {       
        return function() {
            subController.setSubSize( size );
            MenuManager.selectFinalDropdownOption( name );
            subtitlesSize = name;
        }
    }

    function getSubIndicatorFunc(indicator, name)
    {       
        return function() {
            subController.setSubIndicator( indicator );
            MenuManager.selectFinalDropdownOption( name );
            subtitlesIndicator = name;
        }
    }

    function getSubAutoPositioningFunc(name)
    {       
        return function() {
            if ( !_isHMD ) AplicationManager.disableVR();
            camera.rotation.set( 0,0,0 );
            CameraParentObject.quaternion.set(0,0,0,0);

            //if ( interController.getSubtitlesActive() ) subController.enableSubtitles();
            //subController.switchSigner( interController.getSignerActive() );

            setTimeout(function() {
                MenuManager.closeMenu(); 
                scene.getObjectByName( "openMenu" ).visible = true;
                //scene.getObjectByName( "openMenuTrad" ).visible = true; //EXPERIMENTAL
            }, clickInteractionTimeout);

            subController.setSubIndicator( 'none' );
            subController.enableAutoPositioning();
            MenuManager.selectFinalDropdownOption( name );
            //subtitlesIndicator = name;
            autopositioning = true;
        }
    }

    function getSubAreaFunc(area, name)
    {       
        return function() {
            subController.setSubArea( area );
            MenuManager.selectFinalDropdownOption( name );
            subtitlesArea = name;
        }
    }

    function getSubOnOffFunc(isEnabled)
    {       
        return function() {
            //interController.setSubtitlesActive( isEnabled );
            subController.switchSubtitles(isEnabled);
            menuList[6].isEnabled = isEnabled;
            MenuController.showMultiOptionsButtons( multiOptionsMainSubMenuIndexes.slice(0,1) );
            MenuController.showOnOffToggleButton( 6, menuList[6].buttons[0], menuList[6].buttons[1], 0, 4 );
        }
    }

    function getSignerOnOffFunc(isEnabled)
    {       
        return function() {
            //interController.setSignerActive( isEnabled );
            subController.switchSigner( isEnabled );
            menuList[7].isEnabled = isEnabled;
            MenuController.showMultiOptionsButtons( multiOptionsMainSubMenuIndexes.slice(1,2) );
            MenuController.showOnOffToggleButton( 7, menuList[7].buttons[0], menuList[7].buttons[1], 1, 5 );
        }
    }

    function getAudioDescOnOffFunc(isEnabled)
    {       
        return function() {
            //TODO AD functionality
            menuList[8].isEnabled = isEnabled;
            MenuController.showMultiOptionsButtons( multiOptionsMainSubMenuIndexes.slice(2,3) );
            MenuController.showOnOffToggleButton( 8, menuList[8].buttons[0], menuList[8].buttons[1], 2, 6 );
        }
    }

    function getAudioSubOnOffFunc(isEnabled)
    {       
        return function() {
            //TODO AST functionality
            menuList[9].isEnabled = isEnabled;
            MenuController.showMultiOptionsButtons( multiOptionsMainSubMenuIndexes.slice(3,4) );
            MenuController.showOnOffToggleButton( 9, menuList[9].buttons[0], menuList[9].buttons[1], 3, 7 );
        }
    }

//************************************************************************************
// Settings Functions
//************************************************************************************

    function getMainLanguageFunc(name, language)
    {       
        return function() {
            MenuManager.selectFinalDropdownOption( name );
            mainLanguage = name;
            MenuDictionary.initGlobalArraysByLanguage( language );
            setTimeout(function() {

                if( menuType == 'Traditional') 
                {

                    var activeSecondaryMenuTrad = secMMgr.getActiveSecondaryMenuTrad();
                    if(activeSecondaryMenuTrad)
                    {
                        activeSecondaryMenuTrad.buttons.forEach(function(elem){
                            interController.removeInteractiveObject(elem);
                        }); 
                      camera.remove(camera.getObjectByName(activeSecondaryMenuTrad.name));
                      //subController.switchSigner( interController.getSignerActive() );
                        
                    } 

                    interController.clearInteractiveObjectList();

                    if ( _isHMD ) {
                        scene.remove(scene.getObjectByName( "traditionalMenu" ))
                    }
                    else {
                        camera.remove(scene.getObjectByName( "traditionalMenu" ))
                    }

                    MenuFunctionsManager.getOpenTradMenuFunc();
                }
                else
                {
                    MenuManager.closeMenu(); 
                    MenuManager.openMenu();
                }

                
                //scene.getObjectByName( "openMenu" ).visible = true;
                //scene.getObjectByName( "openMenuTrad" ).visible = true; //EXPERIMENTAL
            }, clickInteractionTimeout);
        }
    }

    function getSignerPositionFunc(position, name)
    {       
        return function() {
            subController.setSignerPosition( 1, position );
            MenuManager.selectFinalDropdownOption( name );
            signerPosition = name;
        }
    }

    function getSignerAreaFunc(area, name)
    {       
        return function() {
            subController.setSignerArea( area );
            MenuManager.selectFinalDropdownOption( name );
            signerArea = name;
        }
    }

    function getSignerIndicatorFunc(indicator, name)
    {       
        return function() {
            subController.setSignerIndicator( indicator );
            MenuManager.selectFinalDropdownOption( name );
            signerIndicator = name;
        }
    }

    function getSignerLanguageFunc(url, lang, name)
    {    
        return function() {
            subController.setSignerContent( url, lang );
            MenuManager.selectFinalDropdownOption( name );
            signerLanguage = name;
        }
    }


//************************************************************************************
// Public Functions
//************************************************************************************

    this.getOpenMenuFunc = function(_isMenuTrad)
    {       
        return function() {
            /*interController.setSubtitlesActive( subController.getSubtitleEnabled() );
            if ( interController.getSubtitlesActive() ) subController.disableSubtiles();
            subController.switchSigner( false );*/
            MenuDictionary.initGlobalArraysByLanguage();
            //MenuFunctionsManager.getOpenTradMenuFunc();
            if ( _isMenuTrad ) 
            {
                MenuFunctionsManager.getOpenTradMenuFunc();
            }
            else 
            {
                //interController.setSubtitlesActive( subController.getSubtitleEnabled() );
                //if ( interController.getSubtitlesActive() ) subController.disableSubtiles();
                //subController.switchSigner( false );
                MenuManager.openMenu();
            }

            //MenuManager.openMenu();
            //MenuManager.openMenuTrad();
            scene.getObjectByName( "openMenu" ).visible = false;
            scene.getObjectByName( "openmenutext" ).visible = false;
        }
    };

    this.getOpenTradMenuFunc = function()
    {

        //return function() {
            if(scene.getObjectByName( "traditionalMenu" ))  console.error("Menu already open");
            else
            {
                MenuManager.openMenuTrad();
                scene.getObjectByName( "traditionalMenu" ).visible = false; // Removes the blink of elemnts not created on time
                
                var total = VideoController.getListOfVideoContents()[0].vid.duration;
                var current  = VideoController.getListOfVideoContents()[0].vid.currentTime;
                var w = scene.getObjectByName("bgTimeline").geometry.parameters.width;
                secMMgr.scaleTimeLine(total,current, w, scene.getObjectByName("currentTimeline"), scene.getObjectByName("bgTimeline"));
                scene.getObjectByName("timeline").visible = true;
                
                //interController.removeInteractiveObject("openMenuTrad" );  
                
                setTimeout(function(){ 
                    //scene.getObjectByName( "openMenuTrad" ).visible = false;
                    scene.getObjectByName( "traditionalMenu" ).visible = true; // Onces all the elements are created show the menu
                }, 50);    
            }
        //}
    }

    this.getCloseTradMenuFunc = function()
    {
        return function() {
            //if ( interController.getSubtitlesActive() ) subController.enableSubtitles();

            //scene.getObjectByName( "openMenuTrad" ).visible = true; 
            scene.getObjectByName( "openMenu" ).visible = true; 

            interController.clearInteractiveObjectList();
            //interController.addInteractiveObject(scene.getObjectByName( "openMenuTrad" ))
            
            //camera.remove(camera.getObjectByName( "traditionalMenu" ))
            if ( _isHMD ) scene.remove(scene.getObjectByName( "traditionalMenu" ))
            else camera.remove(scene.getObjectByName( "traditionalMenu" ))


            var activeSubMenu = secMMgr.getActiveSecondaryMenuTrad();
            if(activeSubMenu) secMMgr.removeSubTradMenu('');  
            //subController.switchSigner( interController.getSignerActive() );          
        }
    }

     this.getMultiOptionsMenuFunc = function(name)
    {
        switch ( name )
        {
            case "showSubtitlesMenuButton":
            case "disabledSubtitlesMenuButton":
                return function() 
                {
                    interController.setActiveMenuName( menuList[6].name );
                    var tradMenuBg = scene.getObjectByName("traditionalMenuBackground");
                    var h = (STMenuList.length+1) * heigthDropdownOption;
                    var x = (tradMenuBg.geometry.parameters.width-tradMenuWidth)/2;
                    var y = (tradMenuBg.position.y+(tradMenuBg.geometry.parameters.height + h)/2)+1+scene.getObjectByName("bgTimeline").geometry.parameters.height;
                    secMMgr.createListBackground(x, y, tradMenuWidth, h, MenuDictionary.translate("subtitles"), 6, STMenuList);
                };

            case "showSignLanguageMenuButton":
            case "disabledSignLanguageMenuButton":
                return function() 
                {
                    interController.setActiveMenuName( menuList[7].name );
                    var tradMenuBg = scene.getObjectByName("traditionalMenuBackground");
                    var h = (SLMenuList.length+1) * heigthDropdownOption;
                    var x = (tradMenuBg.geometry.parameters.width-tradMenuWidth)/2;
                    var y = (tradMenuBg.position.y+(tradMenuBg.geometry.parameters.height + h)/2)+1+scene.getObjectByName("bgTimeline").geometry.parameters.height;
                    secMMgr.createListBackground(x, y, tradMenuWidth, h, MenuDictionary.translate("signlanguage"), 7, SLMenuList);
                }

            case "showAudioDescriptionMenuButton":
            case "disabledAudioDescriptionMenuButton":
                return function() 
                {
                    interController.setActiveMenuName( menuList[8].name );
                    var tradMenuBg = scene.getObjectByName("traditionalMenuBackground");
                    var h = (ADMenuList.length+1) * heigthDropdownOption;
                    var x = (tradMenuBg.geometry.parameters.width-tradMenuWidth)/2;
                    var y = (tradMenuBg.position.y+(tradMenuBg.geometry.parameters.height + h)/2)+1+scene.getObjectByName("bgTimeline").geometry.parameters.height;
                    secMMgr.createListBackground(x, y, tradMenuWidth, h, MenuDictionary.translate("audiodescription") ,8, ADMenuList);
                }

            case "showAudioSubtitlesMenuButton":
            case "disabledAudioSubtitlesMenuButton":
                return function() 
                {
                    interController.setActiveMenuName( menuList[9].name );
                    var tradMenuBg = scene.getObjectByName("traditionalMenuBackground");
                    var h = (ASTMenuList.length+1) * heigthDropdownOption;
                    var x = (tradMenuBg.geometry.parameters.width-tradMenuWidth)/2;
                    var y = (tradMenuBg.position.y+(tradMenuBg.geometry.parameters.height + h)/2)+1+scene.getObjectByName("bgTimeline").geometry.parameters.height;
                    secMMgr.createListBackground(x, y, tradMenuWidth, h, MenuDictionary.translate("audiosubtitles"), 9, ASTMenuList);
                }

            case "settingsButton":
                return function() 
                {
                    interController.setActiveMenuName( menuList[5].name );
                    var tradMenuBg = scene.getObjectByName("traditionalMenuBackground");
                    var h = (ASTMenuList.length+1) * heigthDropdownOption;
                    var x = (tradMenuBg.geometry.parameters.width-tradMenuWidth)/2;
                    var y = (tradMenuBg.position.y+(tradMenuBg.geometry.parameters.height + h)/2)+1+scene.getObjectByName("bgTimeline").geometry.parameters.height;
                    secMMgr.createListBackground(x, y, tradMenuWidth, h, MenuDictionary.translate("settings"), 5, SettingsMenuList);
                }
        }
    };  

     this.getMultiOptionsSubMenuFunc = function(name)
    {
        switch ( name )
        {
            case "subtitlesLanguages":
                return function() { secMMgr.openTradSubMenuDropdown(0, 6, STMenuList[0], MenuDictionary.getSubtitleLanguagesList(), STMenuList)};

            case "subtitlesEasyRead":
                return function() { secMMgr.openTradSubMenuDropdown(1, 6, STMenuList[1], subtitlesEasyArray, STMenuList)};

            case "subtitlesShowPositions":
                return function() { secMMgr.openTradSubMenuDropdown(2, 6, STMenuList[2], subtitlesPositionArray, STMenuList)};

            case "subtitlesBackground":
                return function() { secMMgr.openTradSubMenuDropdown(3, 6, STMenuList[3], subtitlesBackgroundArray, STMenuList)};

            case "subtitlesSizes":
                return function() { secMMgr.openTradSubMenuDropdown(4, 6, STMenuList[4], subtitlesSizeArray, STMenuList)};

            case "subtitlesIndicator":
                return function() { secMMgr.openTradSubMenuDropdown(5, 6, STMenuList[5], subtitlesIndicatorArray, STMenuList)};

            case "subtitlesAreas":
                return function() { secMMgr.openTradSubMenuDropdown(6, 6, STMenuList[6], subtitlesSizeArray, STMenuList)};

            case "signerLanguages":
                return function() { secMMgr.openTradSubMenuDropdown(0, 7, SLMenuList[0], MenuDictionary.getSignerLanguagesList(), SLMenuList)};
            
            case "signerShowPositions":
                return function() { secMMgr.openTradSubMenuDropdown(1, 7, SLMenuList[1], subtitlesPositionArray, SLMenuList)};
            
            case "signerIndicator":
                return function() { secMMgr.openTradSubMenuDropdown(2, 7, SLMenuList[2], signerIndicatorArray, SLMenuList)};
            
            case "signerAreas":
                return function() { secMMgr.openTradSubMenuDropdown(3, 7, SLMenuList[3], subtitlesSizeArray, SLMenuList)};

            case "settingsLanguages":
                return function() { secMMgr.openTradSubMenuDropdown(0, 5, SettingsMenuList[0], MenuDictionary.getSettingsLanguagesList(), SettingsMenuList)};

            default: 
                return undefined;
        }
    };  

    this.getSTMenuFunc = function(name)
    {       
        return function() {
            MenuManager.pressButtonFeedback( name );
            setTimeout(function(){ 
                MenuManager.openSecondLevelMenu(6);
                MenuController.showOnOffToggleButton(6, menuList[6].buttons[0], menuList[6].buttons[1], 0, 4);// Indexes from MenuState menuList
            }, clickInteractionTimeout);
        }
    };

    this.getSLMenuFunc = function(name)
    {       
        return function() {
            MenuManager.pressButtonFeedback( name );
            setTimeout(function(){ 
                MenuManager.openSecondLevelMenu(7);
                MenuController.showOnOffToggleButton(7, menuList[7].buttons[0], menuList[7].buttons[1], 1, 5);// Indexes from MenuState menuList
            }, clickInteractionTimeout);
        }
    };

    this.getADMenuFunc = function(name)
    {       
        return function() {
            MenuManager.pressButtonFeedback( name );
            setTimeout(function(){ 
                MenuManager.openSecondLevelMenu(8);
                MenuController.showOnOffToggleButton(8, menuList[8].buttons[0], menuList[8].buttons[1], 2, 6);// Indexes from MenuState menuList
            }, clickInteractionTimeout);
        }
    };

    this.getASTMenuFunc = function(name)
    {       
        return function() {
            MenuManager.pressButtonFeedback( name );
            setTimeout(function(){ 
                MenuManager.openSecondLevelMenu(9);
                MenuController.showOnOffToggleButton(9, menuList[9].buttons[0], menuList[9].buttons[1], 3, 7);// Indexes from MenuState menuList
            }, clickInteractionTimeout);
        }
    };

    this.getSubShowDropdownFunc = function(index, name)
    {       
        return function() {
            MenuManager.openSubMenuDropdown( index, name );
        }
    };

    this.getSubUpDownFunc = function(position)
    {
        return function() {
            var indexActiveMenu = menuList.map(function(e) { return e.name; }).indexOf(interController.getActiveMenuName());
            var h = scene.getObjectByName(menuList[0].name).geometry.parameters.height;

            menuList[indexActiveMenu].buttons.forEach( function( elem )
            {
                if ( elem == 'subtitlesShowLanguagesDropdown' 
                    || elem == 'subtitlesShowEasyReadDropdown' 
                    || elem == 'subtitlesShowPositionsDropdown' 
                    || elem == 'subtitlesShowBackgroundDropdown' 
                    || elem == 'subtitlesShowSizesDropdown'
                    || elem == 'subtitlesShowIndicatorDropdown'
                    || elem == 'subtitlesShowAreasDropdown' )
                {
                    var menuElem = scene.getObjectByName( elem );
                    menuElem.position.y = position ? menuElem.position.y + h/4 : menuElem.position.y - h/4;

                    if ( menuElem.visible && menuElem.position.y > h/4 ) menuElem.visible = false;
                    else if ( menuElem.visible && menuElem.position.y < -h/4 ) menuElem.visible = false;
                    else if ( menuElem.visible == false && menuElem.position.y <= h/4 && menuElem.position.y >= -h/4 ) menuElem.visible = true;

                    // Posible position.y -->        -2, -1, 0, 1, 2         (5 elements)
                    // Posible position.y -->    -3, -2, -1, 0, 1, 2         (6 elements)
                    // Posible position.y -->    -3, -2, -1, 0, 1, 2, 3      (7 elements)

                    if ( menuElem.position.y < -3*h/4 ) menuElem.position.y = 3*h/4;
                    else if ( menuElem.position.y > 3*h/4 ) menuElem.position.y = -3*h/4;
                }
            });
        }
    };

    this.getPlayPauseFunc = function(name)
    {
        return function() {
            MenuManager.pressButtonFeedback( name );
            VideoController.isPausedById(0) ? VideoController.playAll() : VideoController.pauseAll();
            setTimeout(function() { 
                MenuController.playoutTimeDisplayLogic( VideoController.isPausedById(0) ); 
            }, clickInteractionTimeout);
        }
    };

    this.getSeekFunc = function(plus, name)
    {
        var sign = plus ? 1 : -1;
        return function() {
            MenuManager.pressButtonFeedback( name );
            VideoController.seekAll( sign*seekTime );
            MenuController.playoutTimeDisplayLogic( true );
        }
    };

    this.getChangeVolumeFunc = function(plus, name)
    {
        var sign = plus ? 1 : -1;
        return function() {
            MenuManager.pressButtonFeedback( name );
            AudioManager.changeVolume( sign*volumeChangeStep );
            MenuController.volumeLevelDisplayLogic();
        }
    };

    this.getMuteVolumeFunc = function(name)
    {
        return function() {
            MenuManager.pressButtonFeedback( name );
            AudioManager.setmute();
            setTimeout(function() { 
                MenuController.showMuteUnmuteButton(); 
            }, clickInteractionTimeout); 
        }
    };

    this.getUnMuteVolumeFunc = function(name)
    {
        return function() {
            MenuManager.pressButtonFeedback( name );
            AudioManager.setunmute();
            setTimeout(function() { 
                MenuController.showMuteUnmuteButton(); 
            }, clickInteractionTimeout); 
        }
    };

    this.getSettingsMenuFunc = function(name)
    {
        return function() {
            MenuManager.pressButtonFeedback( name );
            setTimeout(function() { 
                MenuManager.openSecondLevelMenu(5); 
            }, clickInteractionTimeout);
        }
    };

    this.getCardboardFunc = function()
    {
        return function() {
            //interController.closeMenu();
            //if ( interController.getSubtitlesActive() ) subController.enableSubtitles();
            //subController.switchSigner( interController.getSignerActive() );
            setTimeout(function() {
                console.error('Deprecated function! getCardboardFunc')
                /*MenuManager.closeMenu(); 
                AplicationManager.switchDevice();
                scene.getObjectByName( "openMenu" ).visible = true;*/
             }, clickInteractionTimeout);
        }
    };

    this.getOnOffFunc = function(name)
    {
        switch ( name )
        {
            case "subtitlesOnButton":
                return getSubOnOffFunc( false );

            case "subtitlesOffButton":
                return getSubOnOffFunc( true );

            case "signLanguageOnButton":
                return getSignerOnOffFunc( false );

            case "signLanguageOffButton":
                return getSignerOnOffFunc( true );

            case "audioDescriptionOnButton":
                return getAudioDescOnOffFunc( false );

            case "audioDescriptionOffButton":
                return getAudioDescOnOffFunc( true );

            case "audioSubtitlesOnButton":
                return getAudioSubOnOffFunc( false );

            case "audioSubtitlesOffButton":
                return getAudioSubOnOffFunc( true );

            default: 
                return undefined;
        }
    };  

    this.getButtonFunctionByName = function(name)
    {
        switch ( name )
        {
        // Subtitles
            case "subtitlesEngButton":
                return getSubLanguageFunc( list_contents[demoId].subtitles[0]['en'], 'en', name );

            case "subtitlesEspButton":
                return getSubLanguageFunc( list_contents[demoId].subtitles[0]['es'], 'es', name );

            case "subtitlesGerButton":
                return getSubLanguageFunc( list_contents[demoId].subtitles[0]['de'], 'de', name );

            case "subtitlesCatButton":
                return getSubLanguageFunc( list_contents[demoId].subtitles[0]['ca'], 'ca', name );

            case "subtitlesEasyOn":
                return getSubEasyOnOffFunc( true, name );

            case "subtitlesEasyOff":
                return getSubEasyOnOffFunc( false, name );

            case "subtitlesTopButton":
                return getSubPositionFunc( 1, name );

            case "subtitlesBottomButton":
                return getSubPositionFunc( -1, name );

            case "subtitlesSemitrans":
                return getSubBackgroundFunc( 0.8, name );

            case "subtitlesOutline":
                return getSubBackgroundFunc( 0, name );

            case "subtitlesSmallSizeButton":
                return getSubSizeFunc( 0.6, name );

            case "subtitlesMediumSizeButton":
                return getSubSizeFunc( 0.8, name );

            case "subtitlesLargeSizeButton":
                return getSubSizeFunc( 1, name );

            case "subtitlesIndicatorNoneButton":
                return getSubIndicatorFunc( "none", name );

            case "subtitlesIndicatorArrowButton":
                return getSubIndicatorFunc( "arrow", name );

            case "subtitlesIndicatorRadarButton":
                return getSubIndicatorFunc( "radar", name );

            case "subtitlesIndicatorAutoButton":
                return getSubAutoPositioningFunc( name );

            case "subtitlesSmallAreaButton":
                return getSubAreaFunc( 50, name );

            case "subtitlesMediumAreaButton":
                return getSubAreaFunc( 60, name );

            case "subtitlesLargeAreaButton":
                return getSubAreaFunc( 70, name );

        // Signer
            case "signerEngButton":
                return getSignerLanguageFunc( list_contents[demoId].signer[0]['en'], 'en', name );

            case "signerEspButton":
                return getSignerLanguageFunc( list_contents[demoId].signer[0]['es'], 'es', name );

            case "signerGerButton":
                return getSignerLanguageFunc( list_contents[demoId].signer[0]['de'], 'de', name );

            case "signerCatButton":
                return getSignerLanguageFunc( list_contents[demoId].signer[0]['ca'], 'ca', name );

            case "signerTopButton":
                return getSignerPositionFunc( 1, name );

            case "signerBottomButton":
                return getSignerPositionFunc( -1, name );

            case "signerIndicatorNoneButton":
                return getSignerIndicatorFunc( "none", name );

            case "signerIndicatorArrowButton":
                return getSignerIndicatorFunc( "arrow", name );

            case "signerIndicatorRadarButton":
                return getSubAutoPositioningFunc( name );

            case "signerSmallAreaButton":
                return getSignerAreaFunc( 50, name );

            case "signerMediumlAreaButton":
                return getSignerAreaFunc( 60, name );

            case "signerLargeAreaButton":
                return getSignerAreaFunc( 70, name );

        // Audio Description
            case "adEngButton":
                return;

            case "adEspButton":
                return;

            case "adGerButton":
                return;

            case "adCatButton":
                return;

            case "adPrespectiveButton":
                return;

            case "adAnchoredButton":
                return;

            case "adClassicButton":
                return;

            case "adPanoramaButton":
                return;

        // Audio Description
            case "astEngButton":
                return;

            case "astEspButton":
                return;

            case "astGerButton":
                return;

            case "astCatButton":
                return;

            case "astEasyOn":
                return;

            case "astEasyOff":
                return;

        // Settings
            case "settingsLanguageEngButton":
                return getMainLanguageFunc( name, 'en' );

            case "settingsLanguageEspButton":
                return getMainLanguageFunc( name, 'es' );

            case "settingsLanguageGerButton":
                return getMainLanguageFunc( name, 'de' );

            case "settingsLanguageCatButton":
                return getMainLanguageFunc( name, 'ca' );

            case "vc1":
                return;

            case "up1":
                return;

            case "up2":
                return;

        // Default
            default: 
                return undefined;
        }
    };	
}
