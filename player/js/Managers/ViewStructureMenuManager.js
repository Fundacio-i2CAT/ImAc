/**
 * This manager is in charge of creating all the different menu structures in the ImAc player
 *
 * @class      ViewStructureMenuManager (name)
 *
 *  BASES:
 *  	- TraditionalMenuBase (private)
 *  	- LowSightedMenuBase (private)
 *
 *  TRADITIONAL MENU:
 *  	- TraditionalMenu (public)
 *  	- TraditionalOptionMenu (public)
 *
 *  LOW SIGHTED MENU:
 *  	- PlayPauseLowSightedMenu (public)
 *  	- VolumeLowSightedMenu (public)
 *  	- SettingsLowSightedMenu (public)
 *  	- MultiOptionsLowSightedMenu (public)
 *  	- OptionLowSightedMenu (public)
 *  	- Preview (public)
 *
 */

//import IE_test from '../Models/InteractiveElementModel_class.js';

function ViewStructureMenuManager() {

    /**
     * This function sets the values of the create menu elements from the InteractiveElementModel.
     *
     * @param      {<type>}  w          The width
     * @param      {<type>}  h          The height
     * @param      {<type>}  r          The rotation
     * @param      {<type>}  n          The name
     * @param      {<type>}  t          The type (icon/text)
     * @param      {<type>}  val        The value (if icon the path / if text the text value)
     * @param      {<type>}  c          The color
     * @param      {<type>}  txtSz      The text size
     * @param      {<type>}  vis        The visibility
     * @param      {<type>}  x          The x position
     * @param      {<type>}  y          The y position
     * @param      {<type>}  z          The z position
     */
    function setMenuElementValues (w, h, r, n, t, val, c, txtSz, vis, x, y, z) {
        let IE = new InteractiveElementModel();

        IE.width = w;
        IE.height = h;
        IE.name = n;
        IE.rotation = r;
        IE.type=  t;
        IE.value = val;
        IE.color = c;
        IE.textSize = txtSz;
        IE.visible = vis;
        IE.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({visible:  false}));
        IE.position = new THREE.Vector3(x, y, z);
        IE.onexecute = function() { console.log("This is the %s button", n) }

        return IE.create();
    }


/**************************************************************
 *
 *                     M E N U 		B A S E S
 *
 **************************************************************/

	/**
	 * Creates the base menu structure (menu background) for the traditional menu.
	 *
	 * @class      TraditionalMenuBaseView (name)
	 * @param      {<String>}  name    The name of the menu in order to find future find it.
	 * @return     {Mesh}   Returns a THREE.js mesh structure where the different menu elements will be attached to.
	 */
    function TraditionalMenuBase(name){

        let radius = 3;

//NEEDS TO BE REMOVED, ONLY FOR TESTING PORPOUSES
        let centerBtn = new THREE.Mesh( new THREE.CircleGeometry(1,32), new THREE.MeshBasicMaterial( { color: 0xff0000 } ) );
        centerBtn.position.set( 0,0,-67 );
        camera.add(centerBtn);
//********************************************
        
        let  menuTrad =  new THREE.Group();
        let menuShape = _moData.roundedRect( new THREE.Shape(), menuWidth, menuHeight, radius );
        let material = new THREE.MeshBasicMaterial( { color: 0x111111});
        let geometry = new THREE.ShapeGeometry( menuShape );
        let mesh =  new THREE.Mesh( geometry, material);

        mesh.name = 'traditional-base';

        menuTrad.add(mesh);

        menuTrad.position.set( 0, -20, -67 );
        menuTrad.name = name;

        //var menuBackground = new THREE.Mesh( new THREE.PlaneGeometry( menuWidth, menuHeight ), new THREE.MeshBasicMaterial( {visible:  false} ) );

        //menuBackground.position.set( 0, menuHeight/2, 0.01 );

        //menuTrad.add(menuBackground);

//CREATE GROUP OF THIS
        let lineTop = _moData.createLine( 0x1a1a1a, new THREE.Vector3( -menuWidth/2, -menuHeight/6, 0.01 ), new THREE.Vector3( menuWidth/2, -menuHeight/6, 0.01 ));

        let lineLeftRect = _moData.createLine( 0x1a1a1a, new THREE.Vector3( -menuWidth/2 +0.1, -menuHeight/6, 0.01 ), new THREE.Vector3( -menuWidth/2 +0.1, -menuHeight/2 + radius, 0.01 ));
        let lineRightRect = _moData.createLine( 0x1a1a1a, new THREE.Vector3( menuWidth/2 -0.1, -menuHeight/6, 0.01 ), new THREE.Vector3( menuWidth/2 -0.1, -menuHeight/2 + radius, 0.01 ));
        
        let lineLeftCurved = _moData.createCurvedLine( 0x1a1a1a, new THREE.Vector3( -menuWidth/2+0.1, -menuHeight/2 +0.1 + radius, 0.01 ), 
            new THREE.Vector3( -menuWidth/2 , -menuHeight/2, 0.01),
            new THREE.Vector3( -menuWidth/2 +0.1 + radius, -menuHeight/2 +0.1, 0.01 ));

        let lineRightCurved = _moData.createCurvedLine( 0x1a1a1a, new THREE.Vector3( menuWidth/2-0.1, -menuHeight/2 +0.1 + radius, 0.01 ), 
            new THREE.Vector3( menuWidth/2 , -menuHeight/2, 0.01),
            new THREE.Vector3( menuWidth/2 -0.1 - radius, -menuHeight/2 +0.1, 0.01 ));

        let lineV1 = _moData.createLine( 0x1a1a1a, new THREE.Vector3( -menuWidth/4, -menuHeight/6, 0.01 ), new THREE.Vector3( -menuWidth/4, -menuHeight/2, 0.01 ));
        let lineV2 = _moData.createLine( 0x1a1a1a, new THREE.Vector3( 0, -menuHeight/6, 0.01 ), new THREE.Vector3( 0, -menuHeight/2, 0.01 ));
        let lineV3 = _moData.createLine( 0x1a1a1a, new THREE.Vector3( menuWidth/4, -menuHeight/6, 0.01 ), new THREE.Vector3( menuWidth/4, -menuHeight/2, 0.01 ));

        let lineBot = _moData.createLine( 0x1a1a1a, new THREE.Vector3( -menuWidth/2 + radius, -menuHeight/2 +0.1, 0.01 ), new THREE.Vector3( menuWidth/2 - radius, -menuHeight/2 +0.1, 0.01 ));
        
        menuTrad.add(lineTop);

        menuTrad.add(lineLeftRect);
        menuTrad.add(lineRightRect);

        menuTrad.add(lineLeftCurved);
        menuTrad.add(lineRightCurved);

        menuTrad.add(lineV1);
        menuTrad.add(lineV2);
        menuTrad.add(lineV3);

        menuTrad.add(lineBot);

        return menuTrad;
    }

	/**
	 * Creates the base menu structure (menu background) for the low sighted menu. This base structure has some
	 * elements attached in difference with the traditional base.
	 * 	- Preview button
	 * 	- Close menu button
	 * 	- Forward nagivation button
	 * 	- Backwards navigation button
	 *
	 * 	This 4 elements are repeated through all the different menus.
	 *
	 * @class      LowSightedMenuBase (name)
	 * @param      {<String>}  name    The name of the menu in order to find future find it.
	 * @return     {Mesh}   Returns a THREE.js mesh structure where the different menu elements will be attached to.
	 */
    function LowSightedMenuBase (name){

        var material = new THREE.MeshBasicMaterial( { color: 0x000000, transparent: true, opacity: 1} );
        var geometry = new THREE.PlaneGeometry( menuWidth, menuHeight );
        var menu = new THREE.Mesh( geometry, material );
        menu.position.set( 0, 0, -69 );
        menu.name = name;

        // Create the menu button elements by loading a new InteractiveElement() model
        // and setting the data through setMenuElementValues().
        var previewMenuButton = setMenuElementValues(8, 8, null, 'previewMenuButton', 'icon',
            './img/menu/preview.png', 0xffffff, null, true, -57, 30, 0.01);

        var closeMenuButton = setMenuElementValues(10, 10, Math.PI/4, 'closeMenuButton', 'icon',
            './img/menu/plus_icon.png', 0xffffff, null, true, 57, 30, 0.01);

        var forwardMenuButton = setMenuElementValues(8.4, 8.4, Math.PI, 'forwardMenuButton', 'icon',
            './img/menu/less_than_icon.png', 0xffffff, null, true, 57, -30, 0.01);

        var backMenuButton = setMenuElementValues(8.4, 8.4, null, 'backMenuButton', 'icon',
            './img/menu/less_than_icon.png', 0xffffff, null, true, -57, -30, 0.01);

        // Add all the created elements to the parent group.
        menu.add(previewMenuButton);
        menu.add(closeMenuButton);
        menu.add(forwardMenuButton);
        menu.add(backMenuButton);

        return menu;
    }

/**************************************************************
 *
 *           T R A D I T I O N A L 	 	M E N U
 *
 **************************************************************/

    /**
	 * Creates a traditional view structure.
	 *
	 * @param      {string}  name    The name
	 */
    this.TraditionalMenu = function(name){
        
        let i5 = menuWidth/20;
        let i4 = menuWidth/25;

        let i6 = 6*menuWidth/100;
        let i10 = 10*menuWidth/100;

        var traditionalmenu = TraditionalMenuBase(name);

/************************************\
|    PLAYPAUSE TRADITIONAL SUB MENU  |
\************************************/
        var  playpausemenu =  new THREE.Group();
        playpausemenu.name = 'playpausemenu';

        // Create the menu button elements by loading a new InteractiveElement() model
        // and setting the data through setMenuElementValues().
        var seekBackButton = setMenuElementValues(i6, i6, Math.PI, 'backSeekButton',
            'icon', './img/menu/seek_icon.png', 0xe6e6e6, null, true, -menuWidth/8, menuHeight/4, 0.01);

        var playButton = setMenuElementValues(i10, i10, null, 'playButton', 'icon',
            './img/menu/play_icon.png', 0xe6e6e6, null, false, 0, menuHeight/4, 0.01);

        var pauseButton = setMenuElementValues(i10, i10, null, 'pauseButton', 'icon',
            './img/menu/pause_icon.png', 0xe6e6e6, null, false, 0, menuHeight/4, 0.01);

        var seekForwardButton = setMenuElementValues(i6, i6, null, 'forwardSeekButton', 'icon',
            './img/menu/seek_icon.png', 0xe6e6e6, null, true, menuWidth/8, menuHeight/4, 0.01);

        /*var closeMenuButton = setMenuElementValues(3, 3, Math.PI/4, 'closeMenuButton', 'icon',
            './img/menu/plus_icon.png', 0xffffff, null, true, (tradmenuDivisions-1)*menuWidth/(tradmenuDivisions*2), 0, 0.01);*/

        // Add all the created elements to the parent group.
        playpausemenu.add(seekBackButton);
        playpausemenu.add(playButton);
        playpausemenu.add(pauseButton);
        playpausemenu.add(seekForwardButton);
        //playpausemenu.add(closeMenuButton);


/************************************\
|    VOLUME TRADITIONAL SUB MENU     |
\************************************/
        var  volumemenu =  new THREE.Group();
        volumemenu.name = 'volumemenu';

        // Create the menu button elements by loading a new InteractiveElement() model
        // and setting the data through setMenuElementValues().
        /*var minusVolumeButton = setMenuElementValues(1.5, 1.5, null, 'minusVolumeButton', 'icon',
            './img/menu/minus_icon.png', 0xffffff, null, true, -(tradmenuDivisions-8)*menuWidth/(tradmenuDivisions*2), 2*menuHeight/3, 0.01);

        var plusVolumeButton = setMenuElementValues(1.5, 1.5, null, 'plusVolumeButton', 'icon',
            './img/menu/plus_icon.png', 0xffffff, null, true, -(tradmenuDivisions-12)*menuWidth/(tradmenuDivisions*2), 2*menuHeight/3, 0.01);*/

        var unmuteVolumeButton = setMenuElementValues(i6, i6, null, 'unmuteVolumeButton', 'icon',
            './img/menu/volume_unmute_icon.png', 0xe6e6e6, null, false, -menuWidth/4, menuHeight/4, 0.01);

        var muteVolumeButton = setMenuElementValues(i6, i6, null, 'muteVolumeButton', 'icon',
            './img/menu/volume_mute_icon.png', 0xe6e6e6, null, false, -menuWidth/4, menuHeight/4, 0.01);

        /*var volumeLevel = setMenuElementValues(4, 4, null, 'volumeLevel', 'text',
            '', 0xffffff, 1.25, false, -(tradmenuDivisions-10)*menuWidth/(tradmenuDivisions*2), 0, 0.01);*/

        // Add all the created elements to the parent group.
        //volumemenu.add(minusVolumeButton);
        //volumemenu.add(plusVolumeButton);
        volumemenu.add(unmuteVolumeButton);
        volumemenu.add(muteVolumeButton);
        //volumemenu.add(volumeLevel);


/************************************\
| MULTI-OPTIONS TRADITIONAL SUB MENU |
\************************************/
        var  multioptionsmenu =  new THREE.Group();
        multioptionsmenu.name = 'multioptionsmenu';

        // Create the menu button elements by loading a new InteractiveElement() model
        // and setting the data through setMenuElementValues().
        var subtitlesButton = setMenuElementValues(i5, i5, null, 'showSubtitlesMenuButton', 'icon',
            './img/acc_serv_icon/st_on.png', 0xc91355, null, true, -3*menuWidth/8, -menuHeight/3, 0.01);

        var subtitlesDisabledButton = setMenuElementValues(i5, i5, null, 'disabledSubtitlesMenuButton', 'icon',
            './img/acc_serv_icon/st_off.png', 0xe6e6e6, null, true, -3*menuWidth/8, -menuHeight/3, 0.01);

        var signLanguageButton = setMenuElementValues(i5, i5, null, 'showSignLanguageMenuButton', 'icon',
            './img/acc_serv_icon/sl_on.png', 0xc91355, null, true,  -menuWidth/8, -menuHeight/3, 0.01);

        var signLanguageDisabledButton = setMenuElementValues(i5, i5, null, 'disabledSignLanguageMenuButton', 'icon',
            './img/acc_serv_icon/sl_off.png', 0xe6e6e6, null, true, -menuWidth/8, -menuHeight/3, 0.01);

        var audioDescriptionButton = setMenuElementValues(i5, i5, null, 'showAudioDescriptionMenuButton', 'icon',
            './img/acc_serv_icon/ad_on.png', 0xc91355, null, true, menuWidth/8, -menuHeight/3, 0.01);

        var audioDescriptionDisabledButton = setMenuElementValues(i5, i5, null, 'disabledAudioDescriptionMenuButton', 'icon',
            './img/acc_serv_icon/ad_off.png', 0xe6e6e6, null, true, menuWidth/8, -menuHeight/3, 0.01);

        var audioSubtitlesButton = setMenuElementValues(i5, i5, null, 'showAudioSubtitlesMenuButton', 'icon',
            './img/acc_serv_icon/ast_on.png', 0xc91355, null, true, 3*menuWidth/8, -menuHeight/3, 0.01);

        var audioSubtitlesDisabledButton = setMenuElementValues(i5, i5, null, 'disabledAudioSubtitlesMenuButton', 'icon',
            './img/acc_serv_icon/ast_off.png', 0xe6e6e6, null, true, 3*menuWidth/8, -menuHeight/3, 0.01);

        // Add all the created elements to the parent group.
        multioptionsmenu.add(subtitlesButton);
        multioptionsmenu.add(subtitlesDisabledButton);
        multioptionsmenu.add(signLanguageButton);
        multioptionsmenu.add(signLanguageDisabledButton);
        multioptionsmenu.add(audioDescriptionButton);
        multioptionsmenu.add(audioDescriptionDisabledButton);
        multioptionsmenu.add(audioSubtitlesButton);
        multioptionsmenu.add(audioSubtitlesDisabledButton);


/************************************\
|   SETTINGS TRADITIONAL SUB MENU    |
\************************************/
        var  settingsmenu =  new THREE.Group();
        settingsmenu.name = 'settingsmenu';

        // Create the menu button elements by loading a new InteractiveElement() model
        // and setting the data through setMenuElementValues().
        var settingsButton = setMenuElementValues(i6, i6, null, 'settingsButton', 'icon',
            './img/menu/settings_icon.png', 0xe6e6e6, null, true, menuWidth/4, menuHeight/4, 0.01);

        // Add all the created elements to the parent group.
        settingsmenu.add(settingsButton);


/************************************\
|     VIDEO PROGRESS BAR ELEMENT     |
\************************************/
        // This is where the video progress bar is created for the traditional menu.
        var vpb_shape_background = _moData.roundedRect( new THREE.Shape(), 4*menuWidth/5, menuHeight/25, menuWidth/200 );
        var vpb =  new THREE.Group();
        vpb.name = "video-progress-bar";
        vpb.visible = true;

        var vpb_background =  new THREE.Mesh( new THREE.ShapeGeometry( vpb_shape_background ), new THREE.MeshBasicMaterial( { color:  0x666666, transparent: true, opacity: 0.8 }));
        vpb_background.position.set( 0, -menuHeight/24, 0.01 );
        vpb_background.name = "background-progress";

        let totaltime = VideoController.getPlayoutTime(VideoController.getListOfVideoContents()[0].vid.duration);
        let videototaltime = setMenuElementValues(0.5, 0.5, null, 'video-total-time', 'text',
           totaltime, 0xe6e6e6, 3*menuWidth/200, true, 9*menuWidth/20, -menuHeight/24, 0.01);

        let videoplayouttime = setMenuElementValues(0.5, 0.5, null, 'video-playout-time', 'text',
           "00:00", 0xe6e6e6, 3*menuWidth/200, true, -9*menuWidth/20, -menuHeight/24, 0.01);

        //WORKING ON NEW CONCEPT
        /*var vpb_play =  new THREE.Mesh( new THREE.ShapeGeometry( vpb_shape_play ), new THREE.MeshBasicMaterial( { color:  0xc91355, transparent: true, opacity: 1 }));
        //vpb_play.position.set( menuWidth, menuHeight/3, 0.02 );
        vpb_play.position.z = 0.02;
        vpb_play.name = "play-progress";*/

        var vpb_time_slider = new THREE.Mesh( new THREE.CircleGeometry(menuWidth/100,32), new THREE.MeshBasicMaterial( { color: 0xe6e6e6 } ) );
        vpb_time_slider.position.set( -4*menuWidth/10, -menuHeight/24, 0.03 );
        vpb_time_slider.name = "slider-progress";

        // Add all the created elements to the parent group.
        vpb.add(vpb_background);
        //vpb.add(vpb_play);
        vpb.add( vpb_time_slider );

        vpb.add(videototaltime);
        vpb.add(videoplayouttime);


        // Add all the parent submenus to the traditionalmenu base.
        traditionalmenu.add(playpausemenu);
        traditionalmenu.add(volumemenu);
        traditionalmenu.add(settingsmenu);
        traditionalmenu.add(multioptionsmenu);
        traditionalmenu.add(vpb);

        return traditionalmenu;
    }

/**
 * { function_description }
 *
 * @class      TraditionalOptionMenuView (name)
 * @param      {string}  name    The name
 * @return     {THREE}   { description_of_the_return_value }
 */
    this.TraditionalOptionMenu = function(name){

        optWidth = menuWidth/3;
        optHeight = menuHeight/4;

        let tradOptionMenu =  new THREE.Group();
        let material = new THREE.MeshBasicMaterial( { color: 0x111111});
        let geometry = new THREE.PlaneGeometry( optWidth,  optHeight);
        let tradOptionMenuBackground =  new THREE.Mesh( geometry, material);


        tradOptionMenu.name = name;

        tradOptionMenu.position.set(optWidth, menuHeight/2 + optHeight/2 + 1, 0.01); // The +1 in height is the height of the video-progress-bar

        tradOptionMenuBackground.name = 'tradoptionmenubackground';

        //tradOptionMenuBackground.position.y = menuHeight/12;

        // Title for the traditional option sub menu.
        let tradOptionMenuTitle =  new THREE.Group();
        tradOptionMenuTitle.name = 'tradoptionmenutitle';

        // Dropdown for the traditional option sub menu.
        let  tradOptionMenuDropdown =  new THREE.Group();
        tradOptionMenuDropdown.name = 'parentcolumndropdown';

        let line = _moData.createLine( 0xc91355, new THREE.Vector3( -optWidth/2, -optHeight/2, 0.01 ), new THREE.Vector3( optWidth/2, -optHeight/2, 0.01 ) );

        // Create the menu button elements by loading a new InteractiveElement() model
        // and setting the data through setMenuElementValues().
        let back = setMenuElementValues(3*menuWidth/200, 3*menuWidth/200, null, 'backMenuButton', 'icon',
            './img/menu/less_than_icon.png', 0xe6e6e6, null, true, -menuWidth/8, 0, 0.01);

        let optTitle = setMenuElementValues(18*menuWidth/200, optHeight, null, 'opttitle', 'text',
            'Title', 0xe6e6e6, 5*menuWidth/200, true, 0, 0, 0.01);

        // Add all the created elements to the parent group.
        tradOptionMenuTitle.add(line);
        tradOptionMenuTitle.add(back);
        tradOptionMenuTitle.add(optTitle);

        // Add all the parent elements to the traditional option menu.
        tradOptionMenu.add(tradOptionMenuTitle);
        tradOptionMenu.add(tradOptionMenuBackground);
        tradOptionMenu.add(tradOptionMenuDropdown);

        return tradOptionMenu;
    }


/**************************************************************
 *
 *           L O W    S I G H T E D 	 	M E N U
 *
 **************************************************************/

/**
 * Creates the PLAY/PAUSE low sighted menu structure.
 *
 * @return     {mesh}  { the play/pause menu mesh }
 */
    this.PlayPauseLowSightedMenu = function(name)
    {
        var playpausemenu = LowSightedMenuBase(name);

        // Create the menu button elements by loading a new InteractiveElement() model
        // and setting the data through setMenuElementValues().
        var seekBackButton = setMenuElementValues(30, 15, null, 'backSeekButton', 'icon',
            './img/menu/seek_icon.png', 0xffffff, null, true, -45, 0, 0.01);

        var playButton = setMenuElementValues(50, 50, null, 'playButton', 'icon',
            './img/menu/play_icon.png', 0xffffff, null, true, 0, 0, 0.01);

        var pauseButton = setMenuElementValues(50, 50, null, 'pauseButton', 'icon',
            './img/menu/pause_icon.png', 0xffffff, null, true, 0, 0, 0.01);

        var playouttime = setMenuElementValues(50, 50, null, 'playOutTime', 'text',
            '00:00', 0xffffff, 15, true, 0, 0, 0.01);

        var seekForwardButton = setMenuElementValues(30, 15, Math.PI, 'forwardSeekButton', 'icon',
            './img/menu/seek_icon.png', 0xffffff, null, true, 45, 0, 0.01);

        // Add all the created elements to the parent group.
        playpausemenu.add(seekBackButton);
        playpausemenu.add(playButton);
        playpausemenu.add(pauseButton);
        playpausemenu.add(playouttime);
        playpausemenu.add(seekForwardButton);

        if (_isHMD) playpausemenu.scale.set( 0.6, 0.6, 0.6 );

        return playpausemenu;
    }

/**
 * Creates the VOLUME low sighted menu structure.
 *
 * @return     {mesh}  { the volume menu mesh }
 */
    this.VolumeLowSightedMenu = function(name)
    {
        var volumemenu = LowSightedMenuBase(name);

        // Create the menu button elements by loading a new InteractiveElement() model
        // and setting the data through setMenuElementValues().
        var minusVolumeButton = setMenuElementValues(22.5, 22.5, null, 'minusVolumeButton', 'icon',
            './img/menu/minus_icon.png', 0xffffff, null, true, -45, 0, 0.01);

        var plusVolumeButton = setMenuElementValues(22.5, 22.5, null, 'plusVolumeButton', 'icon',
            './img/menu/plus_icon.png', 0xffffff, null, true, 45, 0, 0.01);

        var unmuteVolumeButton = setMenuElementValues(50, 50, null, 'unmuteVolumeButton', 'icon',
            './img/menu/volume_unmute_icon.png', 0xffffff, null, true, 0, 0, 0.01);

        var muteVolumeButton = setMenuElementValues(50, 50, null, 'muteVolumeButton', 'icon',
            './img/menu/volume_mute_icon.png', 0xffffff, null, true, 0, 0, 0.01);

        var volumeLevel = setMenuElementValues(35, 35, null, 'volumeLevel', 'text',
            '', 0xffffff, 18, true, 0, 0, 0.01);

        // Add all the created elements to the parent group.
        volumemenu.add(minusVolumeButton);
        volumemenu.add(plusVolumeButton);
        volumemenu.add(unmuteVolumeButton);
        volumemenu.add(muteVolumeButton);
        volumemenu.add(volumeLevel);

        if (_isHMD) volumemenu.scale.set( 0.6, 0.6, 0.6 );

        return volumemenu;
    }

/**
 * Creates the SETTINGS low sighted menu structure.
 *
 * @return     {mesh}  { the settings menu mesh }
 */
    this.SettingsLowSightedMenu = function(name)
    {
        var settingsmenu = LowSightedMenuBase(name);

        var settingsButton = setMenuElementValues(45, 45, null, 'settingsButton', 'icon',
            './img/menu/settings_icon.png', 0xffffff, null, true, -30, 0, 0.01);

        /*var cardboardButton = setMenuElementValues(45, 28, null, 'cardboardButton', 'icon',
            './img/menu/cardboard_icon.png', 0xffffff, null, false, 30, 0, 0.01);*/

        settingsmenu.add(settingsButton);
        //settingsmenu.add(cardboardButton);

        if (_isHMD) settingsmenu.scale.set( 0.6, 0.6, 0.6 );

        return settingsmenu;
    }

/**
 * Creates the MULTI OPTIONS low sighted menu structure.
 *
 * @return     {mesh}  { the multi options menu mesh }
 */
    this.MultiOptionsLowSightedMenu = function(name)
    {
        var multioptionsmenu = LowSightedMenuBase(name);

        // Create the menu button elements by loading a new InteractiveElement() model
        // and setting the data through setMenuElementValues().
        var subtitlesButton = setMenuElementValues(30, 30, null, 'showSubtitlesMenuButton', 'icon',
            MenuDictionary.translate('ST'), 0xffffff, null, true, -3*menuWidth/8, 0, 0.01);

        var subtitlesDisabledButton = setMenuElementValues(30, 30, null, 'disabledSubtitlesMenuButton', 'icon',
            MenuDictionary.translate('ST_strike'), 0xffffff, null, true, -3*menuWidth/8, 0, 0.01);

        var signLanguageButton = setMenuElementValues(30, 30, null, 'showSignLanguageMenuButton', 'icon',
            MenuDictionary.translate('SL'), 0xffffff, null, true, -1*menuWidth/8, 0, 0.01);

        var signLanguageDisabledButton = setMenuElementValues(30, 30, null, 'disabledSignLanguageMenuButton', 'icon',
            MenuDictionary.translate('SL_strike'), 0xffffff, null, true, -1*menuWidth/8, 0, 0.01);

        var audioDescriptionButton = setMenuElementValues(30, 30, null, 'showAudioDescriptionMenuButton', 'icon',
            MenuDictionary.translate('AD'), 0xffffff, null, true, 1*menuWidth/8, 0, 0.01);

        var audioDescriptionDisabledButton = setMenuElementValues(30, 30, null, 'disabledAudioDescriptionMenuButton', 'icon',
            MenuDictionary.translate('AD_strike'), 0xffffff, null, true, 1*menuWidth/8, 0, 0.01);

        var audioSubtitlesButton = setMenuElementValues(30, 30, null, 'showAudioSubtitlesMenuButton', 'icon',
            MenuDictionary.translate('AST'), 0xffffff, null, true, 3*menuWidth/8, 0, 0.01);

        var audioSubtitlesDisabledButton = setMenuElementValues(30, 30, null, 'disabledAudioSubtitlesMenuButton', 'icon',
            MenuDictionary.translate('AST_strike'), 0xffffff, null, true, 3*menuWidth/8, 0, 0.01);


        // Add all the created elements to the parent group.
        multioptionsmenu.add(subtitlesButton);
        multioptionsmenu.add(subtitlesDisabledButton);
        multioptionsmenu.add(signLanguageButton);
        multioptionsmenu.add(signLanguageDisabledButton);
        multioptionsmenu.add(audioDescriptionButton);
        multioptionsmenu.add(audioDescriptionDisabledButton);
        multioptionsmenu.add(audioSubtitlesButton);
        multioptionsmenu.add(audioSubtitlesDisabledButton);

        if (_isHMD) multioptionsmenu.scale.set( 0.6, 0.6, 0.6 );

        return multioptionsmenu;

    }

    this.OptionLowSightedMenu = function(name)
    {
        var lowsightedoptmenu = LowSightedMenuBase(name);

        var linesMenuGroup =  new THREE.Group();
        linesMenuGroup.name = 'linesMenuGroup';
        var line1 = _moData.createLine( 0xffffff,
            new THREE.Vector3( -menuWidth/6, menuHeight/2, 0 ),
            new THREE.Vector3( -menuWidth/6, -menuHeight/2, 0 ) );

        var line2 = line1.clone();
        line2.position.x = 2 * menuWidth/6;

        linesMenuGroup.add( line1 );
        linesMenuGroup.add( line2 );

        linesMenuGroup.position.z = 0.01;

        lowsightedoptmenu.add(linesMenuGroup);

        // Create the menu button elements by loading a new InteractiveElement() model
        // and setting the data through setMenuElementValues().
        var lsOptEnabledLabel = setMenuElementValues(30, 30, null, 'lsOptEnabledLabel', 'icon',
            '', 0xffffff, null, true, -menuWidth/3, 0, 0.01);

        var lsOptDisabledLabel = setMenuElementValues(30, 30, null, 'lsOptDisabledLabel', 'icon',
            '', 0xffffff, null, true, -menuWidth/3, 0, 0.01);

        var onLSOptButton = setMenuElementValues(22.5, 12.6, null, 'onlsoptbutton', 'icon',
            './img/menu/toggle_on.png', 0xffffff, null, true, -menuWidth/3, 3*menuHeight/8, 0.01);

        var offLSOptButton = setMenuElementValues(22.5, 12.6, null, 'offlsoptbutton', 'icon',
            './img/menu/toggle_off.png', 0xffffff, null, true, -menuWidth/3, 3*menuHeight/8, 0.01);

        var upDropdownButton = setMenuElementValues(4, 12, -Math.PI/2, 'upDropdownButton', 'icon',
            './img/menu/less_than_icon.png', 0xffffff, null, true, 0, 6*menuHeight/14, 0.01);

        var downDropdownButton = setMenuElementValues(4, 12, Math.PI/2, 'downDropdownButton', 'icon',
            './img/menu/less_than_icon.png', 0xffffff, null, true, 0, -6*menuHeight/14, 0.01);


        // Add all the created elements to the parent group.
        lowsightedoptmenu.add(lsOptEnabledLabel);
        lowsightedoptmenu.add(lsOptDisabledLabel);
        lowsightedoptmenu.add(onLSOptButton);
        lowsightedoptmenu.add(offLSOptButton);
        lowsightedoptmenu.add(upDropdownButton);
        lowsightedoptmenu.add(downDropdownButton);


        var parentColumnHoritzontalLines = new THREE.Group();
        parentColumnHoritzontalLines.position.set(0,0,0.01)
        parentColumnHoritzontalLines.name = 'parentcolumnhoritzontallines';

        lowsightedoptmenu.add(parentColumnHoritzontalLines);

        var childColumnHoritzontalLines = new THREE.Group();
        childColumnHoritzontalLines.position.set(0,0,0.01)
        childColumnHoritzontalLines.name = 'childcolumnhoritzontallines';

        lowsightedoptmenu.add(childColumnHoritzontalLines)

        var parentColumnDropdown =  new THREE.Group();
        parentColumnDropdown.name = 'parentcolumndropdown';

        lowsightedoptmenu.add(parentColumnDropdown);

        var childColumnDropdown =  new THREE.Group();
        childColumnDropdown.name = 'childcolumndropdown';

        childColumnDropdown.position.set(menuWidth/3,0,0.01)

        lowsightedoptmenu.add(childColumnDropdown);

        if (_isHMD) lowsightedoptmenu.scale.set( 0.6, 0.6, 0.6 );

        return lowsightedoptmenu;
    }

    /**
 * Creates a multi options preview structure.
 *
 * @param      {string}  name    The name
 * @return     {THREE}   { description_of_the_return_value }
 */
    this.Preview = function(name)
    {
        var preview = new THREE.Group();
        preview.name = name;

        var subtitleMesh =  new THREE.Group();
        subtitleMesh.name = 'subtitlespreview';

        var subtitlesAreaMesh = new THREE.Group();
        subtitlesAreaMesh.name = 'areaSTpreview';

        var signerMesh = new THREE.Group();
        signerMesh.name = 'signerpreview';

        var signerAreaMesh = new THREE.Group();
        signerAreaMesh.name = 'areaSLpreview';

        preview.add(subtitleMesh);
        preview.add(subtitlesAreaMesh);
        preview.add(signerMesh);
        preview.add(signerAreaMesh);

        var stMesh = scene.getObjectByName("subtitles");
        if(stMesh) stMesh.visible = false;

        var slMesh = scene.getObjectByName("sign");
        if(slMesh) slMesh.visible = false;


        return preview;
    }
}
