THREE.MultiOptionsMenuManager = function () {

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
        subtitlesMenuButton.position.x = -3*backgroundmenu.geometry.parameters.width/8;

        subtitlesMenuButton.name = menuList[4].buttons[0]; 
        multiOptionsGroup.add( subtitlesMenuButton );

        var signLanguageMenuButton = menuData.getMenuTextMesh('SL', multioptionsMenuTextSize, 0xffffff, menuList[4].buttons[1]); //menuList.multiOptionsMenu.showSignLanguageMenuButton;                
        signLanguageMenuButton.position.x = -1*backgroundmenu.geometry.parameters.width/8;

        signLanguageMenuButton.name = menuList[4].buttons[1]; 
        multiOptionsGroup.add( signLanguageMenuButton );

        var audiodescriptionMenuButton = menuData.getMenuTextMesh('AD', multioptionsMenuTextSize, 0xffffff, menuList[4].buttons[2]); //menuList.multiOptionsMenu.showAudioDescriptionMenuButton;                
        audiodescriptionMenuButton.position.x = 1*backgroundmenu.geometry.parameters.width/8;

        audiodescriptionMenuButton.name = menuList[4].buttons[2]; 
        multiOptionsGroup.add( audiodescriptionMenuButton );


        var audioSubtitleMenuButton = menuData.getMenuTextMesh('AST', multioptionsMenuTextSize, 0xffffff, menuList[4].buttons[3]); //menuList.multiOptionsMenu.showAudioSubtitleMenuButton;                
        audioSubtitleMenuButton.position.x = 3*backgroundmenu.geometry.parameters.width/8;

        audioSubtitleMenuButton.name = menuList[4].buttons[3]; 
        multiOptionsGroup.add( audioSubtitleMenuButton );

        backgroundmenu.add(multiOptionsGroup);
        scene.add( backgroundmenu );         
    }

}

THREE.MultiOptionsMenuManager.prototype.constructor = THREE.MultiOptionsMenuManager;