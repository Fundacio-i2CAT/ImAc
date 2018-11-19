/**
 * @author isaac.fraile@i2cat.net
 */

 // used libs: subController, MenuManager, interController, MenuController, AplicationManager
 // used globals: subtitlesLanguage....., camera, autopositioning, menuList

MenuFunctionsManager = function() {

//************************************************************************************
// Subtitle Functions
//************************************************************************************

    function getSubLanguageFunc(xml, lang)
    {    
        return function() {
            subController.setSubtitle( xml, lang );
        }
    }

    function getSubEasyOnOffFunc(enable, xml)
    {       
        return function() {
            subController.setSubEasy( enable, xml );
        }
    }

    function getSubPositionFunc(position)
    {       
        return function() {
            subController.setSubPosition( 0, position );
        }
    }

    function getSubBackgroundFunc(index)
    {       
        return function() {
            subController.setSubBackground( index );
        }
    }

    function getSubSizeFunc(size)
    {       
        return function() {
            subController.setSubSize( size );
        }
    }

    function getSubIndicatorFunc(indicator)
    {       
        return function() {
            subController.setSubIndicator( indicator );
        }
    }

    function getSubAutoPositioningFunc()
    {       
        return function() {
            if ( !_isHMD ) AplicationManager.disableVR();
            camera.rotation.set( 0,0,0 );
            CameraParentObject.quaternion.set(0,0,0,0);

            menuMgr.ResetViews();

            subController.setSubIndicator( 'none' );
            subController.enableAutoPositioning();

            autopositioning = true;
        }
    }

    function getSubAreaFunc(area)
    {       
        return function() {
            subController.setSubArea( area );
        }
    }

    function getSubOnOffFunc(isEnabled)
    {       
        return function() {
            subController.switchSubtitles(isEnabled);
        }
    }

    function getSignerOnOffFunc(isEnabled)
    {       
        return function() {
            subController.switchSigner( isEnabled );
        }
    }

    function getAudioDescOnOffFunc(isEnabled)
    {       
        return function() {
            //TODO AD functionality
            console.warn('TODO AD functionality')
        }
    }

    function getAudioSubOnOffFunc(isEnabled)
    {       
        return function() {
            //TODO AST functionality
            console.warn('TODO AST functionality')
        }
    }

//************************************************************************************
// Settings Functions
//************************************************************************************

    function getMainLanguageFunc(name, language)
    {      
        return function() {
            //MenuManager.selectFinalDropdownOption( name );
            //mainLanguage = name;
            MenuDictionary.setMainLanguage( language );

            //menumanager.ResetViews();



            /*setTimeout(function() {

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
            }, 300);*/
        }
    }

    function getSignerPositionFunc(position)
    {       
        return function() {
            subController.setSignerPosition( 1, position );
        }
    }

    function getSignerAreaFunc(area)
    {       
        return function() {
            subController.setSignerArea( area );
        }
    }

    function getSignerIndicatorFunc(indicator)
    {       
        return function() {
            subController.setSignerIndicator( indicator );
        }
    }

    function getSignerLanguageFunc(url, lang)
    {    
        return function() {
            subController.setSignerContent( url, lang );
        }
    }

    function getE2RURL() {

        var url;
        
        if ( list_contents[demoId].subtitles[1] )
        {
            var lang = subController.getSubLanguage();
            var e2r = list_contents[demoId].subtitles[1][lang] ? lang : Object.keys(list_contents[demoId].subtitles[1])[0];
            url = list_contents[demoId].subtitles[1][e2r];
        }

        return url;
    }


//************************************************************************************
// Public Functions
//************************************************************************************

    this.getOpenMenuFunc = function(_isMenuTrad)
    {   
    console.error('zscasdasasdas')    
        return function() {
            /*interController.setSubtitlesActive( subController.getSubtitleEnabled() );
            if ( interController.getSubtitlesActive() ) subController.disableSubtiles();
            subController.switchSigner( false );*/
            //MenuDictionary.initGlobalArraysByLanguage();
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
console.error('ydydydyddydydydyddyy')
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
        console.error('popopopopopopopopopopopopopop')
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
/*
     this.getMultiOptionsMenuFunc = function(name)
    {
        switch ( name )
        {
            case "showSubtitlesMenuButton":
            case "overSTbutton":
            case "disabledoverSTbutton":
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
*/
    this.getSubShowDropdownFunc = function(index, name)
    {       
        return function() {
            MenuManager.openSubMenuDropdown( index, name );
        }
    };
/*
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

    this.getPlayPauseFunc = function(play, name)
    {
        return function() {
            if (name) MenuManager.pressButtonFeedback( name );
            play ? VideoController.playAll() : VideoController.pauseAll();
            setTimeout(function() { 
                MenuController.playoutTimeDisplayLogic( VideoController.isPausedById(0) ); 
            }, clickInteractionTimeout);
        }
    };

    this.getSeekFunc = function(plus, name)
    {
        var sign = plus ? 1 : -1;
        return function() {
            if (name) MenuManager.pressButtonFeedback( name );
            VideoController.seekAll( sign*seekTime );
            MenuController.playoutTimeDisplayLogic( true );
        }
    };

    this.getChangeVolumeFunc = function(plus, name)
    {
        var sign = plus ? 1 : -1;
        return function() {
            if (name) MenuManager.pressButtonFeedback( name );
            _AudioManager.changeVolume( sign*volumeChangeStep );
            MenuController.volumeLevelDisplayLogic();
        }
    };

    this.getMuteVolumeFunc = function(name)
    {
        return function() {
            MenuManager.pressButtonFeedback( name );
            _AudioManager.setmute();
            setTimeout(function() { 
                MenuController.showMuteUnmuteButton(); 
            }, clickInteractionTimeout); 
        }
    };

    this.getUnMuteVolumeFunc = function(name)
    {
        return function() {
            MenuManager.pressButtonFeedback( name );
            _AudioManager.setunmute();
            setTimeout(function() { 
                MenuController.showMuteUnmuteButton(); 
            }, clickInteractionTimeout); 
        }
    };
*/
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
            console.error('Deprecated function! getCardboardFunc')
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
                var e2r = subController.getSubEasy() ? 1 : 0;
                return getSubLanguageFunc( list_contents[demoId].subtitles[e2r]['en'], 'en' );

            case "subtitlesEspButton":
                var e2r = subController.getSubEasy() ? 1 : 0;
                return getSubLanguageFunc( list_contents[demoId].subtitles[e2r]['es'], 'es' );

            case "subtitlesGerButton":
                var e2r = subController.getSubEasy() ? 1 : 0;
                return getSubLanguageFunc( list_contents[demoId].subtitles[e2r]['de'], 'de' );

            case "subtitlesCatButton":
                var e2r = subController.getSubEasy() ? 1 : 0;
                return getSubLanguageFunc( list_contents[demoId].subtitles[e2r]['ca'], 'ca' );

            case "subtitlesEasyOn":
                var url = getE2RURL();
                return getSubEasyOnOffFunc( true, url );

            case "subtitlesEasyOff":
                return getSubEasyOnOffFunc( false, list_contents[demoId].subtitles[0][subController.getSubLanguage()] );

            case "subtitlesTopButton":
                return getSubPositionFunc( 1 );

            case "subtitlesBottomButton":
                return getSubPositionFunc( -1 );

            case "subtitlesSemitrans":
                return getSubBackgroundFunc( 0.8 );

            case "subtitlesOutline":
                return getSubBackgroundFunc( 0 );

            case "subtitlesSmallSizeButton":
                return getSubSizeFunc( 0.6 );

            case "subtitlesMediumSizeButton":
                return getSubSizeFunc( 0.8 );

            case "subtitlesLargeSizeButton":
                return getSubSizeFunc( 1 );

            case "subtitlesIndicatorNoneButton":
                return getSubIndicatorFunc( "none" );

            case "subtitlesIndicatorArrowButton":
                return getSubIndicatorFunc( "arrow" );

            case "subtitlesIndicatorRadarButton":
                return getSubIndicatorFunc( "radar" );

            case "subtitlesIndicatorAutoButton":
                return getSubAutoPositioningFunc();

            case "subtitlesSmallAreaButton":
                return getSubAreaFunc( 50 );

            case "subtitlesMediumAreaButton":
                return getSubAreaFunc( 60 );

            case "subtitlesLargeAreaButton":
                return getSubAreaFunc( 70 );

        // Signer
            case "signerEngButton":
                return getSignerLanguageFunc( list_contents[demoId].signer[0]['en'], 'en' );

            case "signerEspButton":
                return getSignerLanguageFunc( list_contents[demoId].signer[0]['es'], 'es' );

            case "signerGerButton":
                return getSignerLanguageFunc( list_contents[demoId].signer[0]['de'], 'de' );

            case "signerCatButton":
                return getSignerLanguageFunc( list_contents[demoId].signer[0]['ca'], 'ca' );

            case "signerTopButton":
                return getSignerPositionFunc( 1 );

            case "signerBottomButton":
                return getSignerPositionFunc( -1 );

            case "signerIndicatorNoneButton":
                return getSignerIndicatorFunc( "none" );

            case "signerIndicatorArrowButton":
                return getSignerIndicatorFunc( "arrow" );

            case "signerIndicatorRadarButton":
                return getSubAutoPositioningFunc();

            case "signerSmallAreaButton":
                return getSignerAreaFunc( 50 );

            case "signerMediumlAreaButton":
                return getSignerAreaFunc( 60 );

            case "signerLargeAreaButton":
                return getSignerAreaFunc( 70 );

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

            case "settingsMenuTraditionalButton":
                return settingsMgr.getChangeMenuTypeFunction(2);

            case "settingsMenuLowSightedButton":
                return settingsMgr.getChangeMenuTypeFunction(1);

        // Default
            default: 
                return undefined;
        }
    };	
}
