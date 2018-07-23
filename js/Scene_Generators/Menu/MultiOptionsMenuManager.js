THREE.MultiOptionsMenuManager = function () {


    this.showMultiOptionsButtons = function(menuIndexArray)
    {
        for (var i = 0; i < menuIndexArray.length; i++)
        {
            if(menuList[menuIndexArray[i][0]].isEnabled)
            {
                scene.getObjectByName(menuList[menuList[menuIndexArray[i][0]].firstmenuindex].buttons[menuIndexArray[i][1]]).visible = true; //menuList.
                scene.getObjectByName(menuList[menuList[menuIndexArray[i][0]].firstmenuindex].buttons[menuIndexArray[i][2]]).visible = false; //menuList.
            }
            else
            {
                scene.getObjectByName(menuList[menuList[menuIndexArray[i][0]].firstmenuindex].buttons[menuIndexArray[i][1]]).visible = false; //menuList.
                scene.getObjectByName(menuList[menuList[menuIndexArray[i][0]].firstmenuindex].buttons[menuIndexArray[i][2]]).visible = true; //menuList.
            }
        }
    }

/**
 * Creates menu multi options.
 *
 * @param      {<type>}  backgroundmenu  The backgroundmenu
 */
    this.createMultiOptionsMenu = function (backgroundmenu)
    {
        var multiOptionsGroup =  new THREE.Group();
        multiOptionsGroup.name = menuList[4].name; // menuList.multiOptionsMenu
        multiOptionsGroup.visible = false;
        
        var subtitlesMenuButton = menuData.getMenuTextMesh('ST', multioptionsMenuTextSize, 0xffffff, menuList[4].buttons[0]); //menuList.multiOptionsMenu.showSubtitleMenuButton;
        var disabledSubtitles = menuData.getImageMesh( new THREE.PlaneGeometry( 25.1*factorScale, 29.5*factorScale ), './img/menu/disabled_st_icon.png', menuList[4].buttons[4], 4 ); // menuList.

        disabledSubtitles.position.x = -3*backgroundmenu.geometry.parameters.width/8;
        subtitlesMenuButton.position.x = -3*backgroundmenu.geometry.parameters.width/8;

        subtitlesMenuButton.name = menuList[4].buttons[0];
        disabledSubtitles.name = menuList[4].buttons[4]; 
        multiOptionsGroup.add( subtitlesMenuButton );
        multiOptionsGroup.add( disabledSubtitles );

        var signLanguageMenuButton = menuData.getMenuTextMesh('SL', multioptionsMenuTextSize, 0xffffff, menuList[4].buttons[1]); //menuList.multiOptionsMenu.showSignLanguageMenuButton;
        var disabledSignLanguageMenu = menuData.getImageMesh( new THREE.PlaneGeometry( 24.6*factorScale, 29.5*factorScale ), './img/menu/disabled_sl_icon.png', menuList[4].buttons[5], 4 ); // menuList.                
        
        signLanguageMenuButton.position.x = -1*backgroundmenu.geometry.parameters.width/8;
        disabledSignLanguageMenu.position.x = -1*backgroundmenu.geometry.parameters.width/8;

        signLanguageMenuButton.name = menuList[4].buttons[1]; 
        disabledSignLanguageMenu.name = menuList[4].buttons[5]; 
        multiOptionsGroup.add( signLanguageMenuButton );
        multiOptionsGroup.add( disabledSignLanguageMenu );

        var audiodescriptionMenuButton = menuData.getMenuTextMesh('AD', multioptionsMenuTextSize, 0xffffff, menuList[4].buttons[2]); //menuList.multiOptionsMenu.showAudioDescriptionMenuButton;                
        var disabledAudiodescriptionMenu = menuData.getImageMesh( new THREE.PlaneGeometry( 29.4*factorScale, 29.5*factorScale ), './img/menu/disabled_ad_icon.png', menuList[4].buttons[6], 4 ); // menuList.

        audiodescriptionMenuButton.position.x = 1*backgroundmenu.geometry.parameters.width/8;
        disabledAudiodescriptionMenu.position.x = 1*backgroundmenu.geometry.parameters.width/8;

        audiodescriptionMenuButton.name = menuList[4].buttons[2]; 
        disabledAudiodescriptionMenu.name = menuList[4].buttons[6]; 
        multiOptionsGroup.add( audiodescriptionMenuButton );
        multiOptionsGroup.add( disabledAudiodescriptionMenu );


        var audioSubtitleMenuButton = menuData.getMenuTextMesh('AST', multioptionsMenuTextSize, 0xffffff, menuList[4].buttons[3]); //menuList.multiOptionsMenu.showAudioSubtitleMenuButton;   
        var disabledAudioSubtitleMenu = menuData.getImageMesh( new THREE.PlaneGeometry( 42*factorScale, 29.5*factorScale ), './img/menu/disabled_ast_icon.png', menuList[4].buttons[7], 4 ); // menuList.            

        disabledAudioSubtitleMenu.position.x = 3*backgroundmenu.geometry.parameters.width/8;
        audioSubtitleMenuButton.position.x = 3*backgroundmenu.geometry.parameters.width/8;

        audioSubtitleMenuButton.name = menuList[4].buttons[3]; 
        disabledAudioSubtitleMenu.name = menuList[4].buttons[7]; 
        multiOptionsGroup.add( audioSubtitleMenuButton );
        multiOptionsGroup.add( disabledAudioSubtitleMenu );

        backgroundmenu.add(multiOptionsGroup);
        scene.add( backgroundmenu );         
    }

}

THREE.MultiOptionsMenuManager.prototype.constructor = THREE.MultiOptionsMenuManager;