/**
 * This manager is in charge of creating all the different menu structures in the ImAc player
 *
 * @class      ViewStructureMenuManager (name)
 *
 *  BASES:
 *  	- TraditionalMenuBase (private)
 *
 *  TRADITIONAL MENU:
 *  	- TraditionalMenu (public)
 *  	- TraditionalOptionMenu (public)http://192.168.11.102:8080/ImAc/portal/img/gradient_up.png
 */

function ViewStructureMenuManager() {

/**************************************************************
 *
 *                     M E N U         B A S E S
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

        let menuBase =  new THREE.Group();
        menuBase.name = name;
        let radius = 3*menuWidth/100;        


        let menuShape = _moData.roundedRect( new THREE.Shape(), menuWidth, menuHeight, radius );
        let material = new THREE.MeshBasicMaterial( { color: 0x111111});
        let geometry = new THREE.ShapeGeometry( menuShape );
        let mesh =  new THREE.Mesh( geometry, material);

        mesh.name = 'trad-menu-background';

        let menuTradLineDivisions =  new THREE.Group();
        menuTradLineDivisions.name = 'trad-menu-lines';

        let lineTop = _moData.createLine( 0x3a3a3a, new THREE.Vector3( -menuWidth/2, -menuHeight/6, 0.01 ), new THREE.Vector3( menuWidth/2, -menuHeight/6, 0.01 ));

        let lineLeftRect = _moData.createLine( 0x3a3a3a, new THREE.Vector3( -menuWidth/2 +0.1, -menuHeight/6, 0.01 ), new THREE.Vector3( -menuWidth/2 +0.1, -menuHeight/2 + radius, 0.01 ));
        let lineRightRect = _moData.createLine( 0x3a3a3a, new THREE.Vector3( menuWidth/2 -0.1, -menuHeight/6, 0.01 ), new THREE.Vector3( menuWidth/2 -0.1, -menuHeight/2 + radius, 0.01 ));
        
        let lineLeftCurved = _moData.createCurvedLine( 0x3a3a3a, new THREE.Vector3( -menuWidth/2+0.1, -menuHeight/2 +0.1 + radius, 0.01 ), 
            new THREE.Vector3( -menuWidth/2 , -menuHeight/2, 0.01),
            new THREE.Vector3( -menuWidth/2 +0.1 + radius, -menuHeight/2 +0.1, 0.01 ));

        let lineRightCurved = _moData.createCurvedLine( 0x3a3a3a, new THREE.Vector3( menuWidth/2-0.1, -menuHeight/2 +0.1 + radius, 0.01 ), 
            new THREE.Vector3( menuWidth/2 , -menuHeight/2, 0.01),
            new THREE.Vector3( menuWidth/2 -0.1 - radius, -menuHeight/2 +0.1, 0.01 ));

        let lineV1 = _moData.createLine( 0x3a3a3a, new THREE.Vector3( -menuWidth/4, -menuHeight/6, 0.01 ), new THREE.Vector3( -menuWidth/4, -menuHeight/2, 0.01 ));
        let lineV2 = _moData.createLine( 0x3a3a3a, new THREE.Vector3( 0, -menuHeight/6, 0.01 ), new THREE.Vector3( 0, -menuHeight/2, 0.01 ));
        let lineV3 = _moData.createLine( 0x3a3a3a, new THREE.Vector3( menuWidth/4, -menuHeight/6, 0.01 ), new THREE.Vector3( menuWidth/4, -menuHeight/2, 0.01 ));

        let lineBot = _moData.createLine( 0x3a3a3a, new THREE.Vector3( -menuWidth/2 + radius, -menuHeight/2 +0.1, 0.01 ), new THREE.Vector3( menuWidth/2 - radius, -menuHeight/2 +0.1, 0.01 ));
        
        menuTradLineDivisions.add(lineTop);
        menuTradLineDivisions.add(lineLeftRect);
        menuTradLineDivisions.add(lineRightRect);
        menuTradLineDivisions.add(lineLeftCurved);
        menuTradLineDivisions.add(lineRightCurved);
        menuTradLineDivisions.add(lineV1);
        menuTradLineDivisions.add(lineV2);
        menuTradLineDivisions.add(lineV3);
        menuTradLineDivisions.add(lineBot);

        menuBase.add(menuTradLineDivisions);
        menuBase.add(mesh)

        return menuBase;
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
        
        let  mainmenu =  new THREE.Group();
        mainmenu.name = name;

        let i5 = menuWidth/20;
        let i4 = menuWidth/25;

        let i6 = 6*menuWidth/100;
        let i10 = 10*menuWidth/100;

        let traditionalmenuBase = TraditionalMenuBase('trad-menu-base');

/************************************\
|           PLAYPAUSE                |
\************************************/
        let seekLBtn = new InteractiveElementModel();
        seekLBtn.width = i6;
        seekLBtn.height = i6;
        seekLBtn.rotation = Math.PI;
        seekLBtn.name = 'back-seek-button';
        seekLBtn.type =  'icon';
        seekLBtn.path = './img/menu/seek_icon.png';
        seekLBtn.color = 0xe6e6e6;
        seekLBtn.visible = true;
        seekLBtn.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(i6, i6), new THREE.MeshBasicMaterial({visible: false}));
        seekLBtn.position = new THREE.Vector3(-menuWidth/8, menuHeight/4, 0.01);
        seekLBtn.onexecute = function() { console.log("This is the %s button", seekLBtn.name) }

        let playBtn = new InteractiveElementModel();
        playBtn.width = i10;
        playBtn.height = i10;
        playBtn.name = 'play-button';
        playBtn.type =  'icon';
        playBtn.path = './img/menu/play_icon.png';
        playBtn.color = 0xe6e6e6;
        playBtn.visible = false;
        playBtn.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(i10, i10), new THREE.MeshBasicMaterial({visible: false}));
        playBtn.position = new THREE.Vector3(0, menuHeight/4, 0.01);
        playBtn.onexecute = function() { console.log("This is the %s button", playBtn.name) };

        let pauseBtn = new InteractiveElementModel();
        pauseBtn.width = i10;
        pauseBtn.height = i10;
        pauseBtn.name = 'pause-button';
        pauseBtn.type =  'icon';
        pauseBtn.path = './img/menu/pause_icon.png';
        pauseBtn.color = 0xe6e6e6;
        pauseBtn.visible = false;
        pauseBtn.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(i10, i10), new THREE.MeshBasicMaterial({visible: false}));
        pauseBtn.position = new THREE.Vector3(0, menuHeight/4, 0.01);
        pauseBtn.onexecute = function() { console.log("This is the %s button", pauseBtn.name) };

        let seekRBtn = new InteractiveElementModel();
        seekRBtn.width = i6;
        seekRBtn.height = i6;
        seekRBtn.name = 'forward-seek-button';
        seekRBtn.type =  'icon';
        seekRBtn.path = './img/menu/seek_icon.png';
        seekRBtn.color = 0xe6e6e6;
        seekRBtn.visible = true;
        seekRBtn.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(i6, i6), new THREE.MeshBasicMaterial({visible: false}));
        seekRBtn.position = new THREE.Vector3( menuWidth/8, menuHeight/4, 0.01 );
        seekRBtn.onexecute = function() { console.log("This is the %s button", seekRBtn.name) };

        let closeBtn = new InteractiveElementModel();
        closeBtn.width = menuWidth/25;
        closeBtn.height = menuWidth/25;
        closeBtn.name = 'close-button';
        closeBtn.type =  'icon';
        closeBtn.path = './img/menu/close.png';
        closeBtn.color = 0xe6e6e6;
        closeBtn.visible = true;
        closeBtn.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(menuWidth/25, menuWidth/25), new THREE.MeshBasicMaterial({visible: false}));
        closeBtn.position = new THREE.Vector3( menuWidth/2 - menuWidth/25, menuHeight/2 - menuWidth/25, 0.01 );
        closeBtn.onexecute = function() { console.log("This is the %s button", closeBtn.name) };


        let closeBtnGroup =  new THREE.Group();

        closeBtnGroup.name = 'close-button-group';

        let menuShapeCloseBtn = _moData.roundedRect( new THREE.Shape(), 2.5 * menuWidth/25, 2.5 * menuWidth/25, 3*menuWidth/100 );
        let materialCloseBtn = new THREE.MeshBasicMaterial( { color: 0x111111});
        let geometryCloseBtn = new THREE.ShapeGeometry( menuShapeCloseBtn );
        let meshCloseBtn =  new THREE.Mesh( geometryCloseBtn, materialCloseBtn);

        let closeBtnZoom = new InteractiveElementModel();
        closeBtnZoom.width = 2 * menuWidth/25;
        closeBtnZoom.height = 2 * menuWidth/25;
        closeBtnZoom.name = 'close-button-zoom';
        closeBtnZoom.type =  'icon';
        closeBtnZoom.path = './img/menu/close.png';
        closeBtnZoom.color = 0xe6e6e6;
        closeBtnZoom.visible = true;
        closeBtnZoom.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(menuWidth/25, menuWidth/25), new THREE.MeshBasicMaterial({visible: false}));
        closeBtnZoom.position = new THREE.Vector3( 0, 0, 0.01 );
        closeBtnZoom.onexecute = function() { console.log("This is the %s button", closeBtnZoom.name) };
  
        meshCloseBtn.add(closeBtnZoom.create());
        meshCloseBtn.position.set(menuWidth/2 - menuWidth/25, menuHeight/2 - menuWidth/25, 0.02 );

        closeBtnGroup.add(meshCloseBtn);
        closeBtnGroup.visible = false;

        mainmenu.add(closeBtnGroup);

        // Add all the created elements to the parent group.
        mainmenu.add(seekLBtn.create());
        mainmenu.add(playBtn.create());
        mainmenu.add(pauseBtn.create());
        mainmenu.add(seekRBtn.create());

/************************************\
|               VOLUME               |
\************************************/

        let minVolBtn = new InteractiveElementModel();
        minVolBtn.width = menuWidth/40;
        minVolBtn.height = menuWidth/40;
        minVolBtn.name = 'minus-volume-button';
        minVolBtn.type =  'icon';
        minVolBtn.path = './img/menu/minus_icon.png';
        minVolBtn.color = 0xe6e6e6;
        minVolBtn.visible = true;
        minVolBtn.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(menuWidth/40, menuWidth/40), new THREE.MeshBasicMaterial({visible: false}));
        minVolBtn.position = new THREE.Vector3( -3*menuWidth/8,  menuHeight/4, 0.01 );
        minVolBtn.onexecute = function() { console.log("This is the %s button", minVolBtn.name) };

        let plusVolBtn = new InteractiveElementModel();
        plusVolBtn.width = menuWidth/40;
        plusVolBtn.height = menuWidth/40;
        plusVolBtn.name = 'plus-volume-button';
        plusVolBtn.type =  'icon';
        plusVolBtn.path = './img/menu/plus_icon.png';
        plusVolBtn.color = 0xe6e6e6;
        plusVolBtn.visible = true;
        plusVolBtn.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(menuWidth/40, menuWidth/40), new THREE.MeshBasicMaterial({visible: false}));
        plusVolBtn.position = new THREE.Vector3( -menuWidth/4,  menuHeight/4, 0.01 );
        plusVolBtn.onexecute = function() { console.log("This is the %s button", plusVolBtn.name) };

        let unmuteVolBtn = new InteractiveElementModel();
        unmuteVolBtn.width = i6;
        unmuteVolBtn.height = i6;
        unmuteVolBtn.name = 'unmute-volume-button';
        unmuteVolBtn.type =  'icon';
        unmuteVolBtn.path = './img/menu/volume_unmute_icon.png';
        unmuteVolBtn.color = 0xe6e6e6;
        unmuteVolBtn.visible = true;
        unmuteVolBtn.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(i6, i6), new THREE.MeshBasicMaterial({visible: false}));
        unmuteVolBtn.position = new THREE.Vector3( -5*menuWidth/16, menuHeight/4, 0.01 );
        unmuteVolBtn.onexecute = function() { console.log("This is the %s button", unmuteVolBtn.name) };
        
        let muteVolBtn = new InteractiveElementModel();
        muteVolBtn.width = i6;
        muteVolBtn.height = i6;
        muteVolBtn.name = 'mute-volume-button';
        muteVolBtn.type =  'icon';
        muteVolBtn.path = './img/menu/volume_mute_icon.png';
        muteVolBtn.color = 0xe6e6e6;
        muteVolBtn.visible = true;
        muteVolBtn.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(i6, i6), new THREE.MeshBasicMaterial({visible: false}));
        muteVolBtn.position = new THREE.Vector3( -5*menuWidth/16, menuHeight/4, 0.01 );
        muteVolBtn.onexecute = function() { console.log("This is the %s button", muteVolBtn.name) };
        
        let volLvlTxt = new InteractiveElementModel();
        volLvlTxt.width = 0;
        volLvlTxt.height = 0;
        volLvlTxt.name = 'volume-level-text';
        volLvlTxt.type = 'text';
        volLvlTxt.text = '';
        volLvlTxt.color = 0xe6e6e6;
        volLvlTxt.textSize = menuWidth/50;
        volLvlTxt.visible = false;
        volLvlTxt.position = new THREE.Vector3( -5*menuWidth/16, menuHeight/4, 0.01 );

        // Add all the created elements to the parent group.
        mainmenu.add(minVolBtn.create());
        mainmenu.add(plusVolBtn.create());
        mainmenu.add(unmuteVolBtn.create());
        mainmenu.add(muteVolBtn.create());
        mainmenu.add(volLvlTxt.create());

/************************************\
|       ACCESSIBILITY OPTIONS        |
\************************************/

        let stBtn = new InteractiveElementModel();
        stBtn.width = i5;
        stBtn.height = i5;
        stBtn.name = 'show-st-button';
        stBtn.type =  'icon';
        stBtn.path = './img/acc_serv_icon/st_on.png';
        stBtn.color = 0xc91355;
        stBtn.visible = false;
        stBtn.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(i5*2, i5), new THREE.MeshBasicMaterial({visible: false}));
        stBtn.position = new THREE.Vector3( -3*menuWidth/8, -menuHeight/3, 0.01 );
        stBtn.onexecute = function() { console.log("This is the %s button", stBtn.name) };

        let stDisBtn = new InteractiveElementModel();
        stDisBtn.width = i5;
        stDisBtn.height = i5;
        stDisBtn.name = 'disable-st-button';
        stDisBtn.type =  'icon';
        stDisBtn.path = './img/acc_serv_icon/st_off.png';
        stDisBtn.color = 0xe6e6e6;
        stDisBtn.visible = false;
        stDisBtn.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(i5*2, i5), new THREE.MeshBasicMaterial({visible: false}));
        stDisBtn.position = new THREE.Vector3( -3*menuWidth/8, -menuHeight/3, 0.01 );
        stDisBtn.onexecute = function() { console.log("This is the %s button", stDisBtn.name) };

        let stTooltip = new InteractiveElementModel();
        stTooltip.width = i6;
        stTooltip.height = i6;
        stTooltip.name = 'tooltip-st-button';
        stTooltip.type =  'text';
        stTooltip.text = MenuDictionary.translate( 'st' );
        stTooltip.textSize = menuWidth/45;
        stTooltip.color = 0xe6e6e6;
        stTooltip.visible = false;
        stTooltip.position = new THREE.Vector3( -7*menuWidth/16, -menuHeight/3, 0.01 );
       
        let slBtn = new InteractiveElementModel();
        slBtn.width = i5;
        slBtn.height = i5;
        slBtn.name = 'show-sl-button';
        slBtn.type =  'icon';
        slBtn.path = './img/acc_serv_icon/sl_on.png';
        slBtn.color = 0xc91355;
        slBtn.visible = false;
        slBtn.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(i5*2, i5), new THREE.MeshBasicMaterial({visible: false}));
        slBtn.position = new THREE.Vector3( -menuWidth/8, -menuHeight/3, 0.01 );
        slBtn.onexecute = function() { console.log("This is the %s button", slBtn.name) };

        let slDisBtn = new InteractiveElementModel();
        slDisBtn.width = i5;
        slDisBtn.height = i5;
        slDisBtn.name = 'disable-sl-button';
        slDisBtn.type =  'icon';
        slDisBtn.path = './img/acc_serv_icon/sl_off.png';
        slDisBtn.color = 0xe6e6e6;
        slDisBtn.visible = false;
        slDisBtn.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(i5*2, i5), new THREE.MeshBasicMaterial({visible: false}));
        slDisBtn.position = new THREE.Vector3( -menuWidth/8, -menuHeight/3, 0.01 );
        slDisBtn.onexecute = function() { console.log("This is the %s button", slDisBtn.name) };

        let slTooltip = new InteractiveElementModel();
        slTooltip.width = i6;
        slTooltip.height = i6;
        slTooltip.name = 'tooltip-sl-button';
        slTooltip.type =  'text';
        slTooltip.text = MenuDictionary.translate( 'sl' );
        slTooltip.textSize = menuWidth/45;
        slTooltip.color = 0xe6e6e6;
        slTooltip.visible = false;
        slTooltip.position = new THREE.Vector3( -3*menuWidth/16, -menuHeight/3, 0.01 );

        let adBtn = new InteractiveElementModel();
        adBtn.width = i5;
        adBtn.height = i5;
        adBtn.name = 'show-ad-button';
        adBtn.type =  'icon';
        adBtn.path = './img/acc_serv_icon/ad_on.png';
        adBtn.color = 0xc91355;
        adBtn.visible = false;
        adBtn.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(i5*2, i5), new THREE.MeshBasicMaterial({visible: false}));
        adBtn.position = new THREE.Vector3( menuWidth/8, -menuHeight/3, 0.01 );
        adBtn.onexecute = function() { console.log("This is the %s button", adBtn.name) };

        let adDisBtn = new InteractiveElementModel();
        adDisBtn.width = i5;
        adDisBtn.height = i5;
        adDisBtn.name = 'disable-ad-button';
        adDisBtn.type =  'icon';
        adDisBtn.path = './img/acc_serv_icon/ad_off.png';
        adDisBtn.color = 0xe6e6e6;
        adDisBtn.visible = false;
        adDisBtn.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(i5*2, i5), new THREE.MeshBasicMaterial({visible: false}));
        adDisBtn.position = new THREE.Vector3( menuWidth/8, -menuHeight/3, 0.01 );
        adDisBtn.onexecute = function() { console.log("This is the %s button", adDisBtn.name) };

        let adTooltip = new InteractiveElementModel();
        adTooltip.width = i6;
        adTooltip.height = i6;
        adTooltip.name = 'tooltip-ad-button';
        adTooltip.type =  'text';
        adTooltip.text = MenuDictionary.translate( 'ad' );
        adTooltip.textSize = menuWidth/45;
        adTooltip.color = 0xe6e6e6;
        adTooltip.visible = false;
        adTooltip.position = new THREE.Vector3( 1*menuWidth/16, -menuHeight/3, 0.01 );

        let astBtn = new InteractiveElementModel();
        astBtn.width = i5;
        astBtn.height = i5;
        astBtn.name = 'show-ast-button';
        astBtn.type =  'icon';
        astBtn.path = './img/acc_serv_icon/ast_on.png';
        astBtn.color = 0xc91355;
        astBtn.visible = false;
        astBtn.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(i5*2, i5), new THREE.MeshBasicMaterial({visible: false}));
        astBtn.position = new THREE.Vector3( 3*menuWidth/8, -menuHeight/3, 0.01 );
        astBtn.onexecute = function() { console.log("This is the %s button", astBtn.name) };

        let astDisBtn = new InteractiveElementModel();
        astDisBtn.width = i5;
        astDisBtn.height = i5;
        astDisBtn.name = 'disable-ast-button';
        astDisBtn.type =  'icon';
        astDisBtn.path = './img/acc_serv_icon/ast_off.png';
        astDisBtn.color = 0xe6e6e6;
        astDisBtn.visible = false;
        astDisBtn.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(i5*2, i5), new THREE.MeshBasicMaterial({visible: false}));
        astDisBtn.position = new THREE.Vector3( 3*menuWidth/8, -menuHeight/3, 0.01 );
        astDisBtn.onexecute = function() { console.log("This is the %s button", astDisBtn.name) };

        let astTooltip = new InteractiveElementModel();
        astTooltip.width = i6;
        astTooltip.height = i6;
        astTooltip.name = 'tooltip-ast-button';
        astTooltip.type =  'text';
        astTooltip.text = MenuDictionary.translate( 'ast' );
        astTooltip.textSize = menuWidth/45;
        astTooltip.color = 0xe6e6e6;
        astTooltip.visible = false;
        astTooltip.position = new THREE.Vector3( 5*menuWidth/16, -menuHeight/3, 0.01 );

        // Add all the created elements to the parent group.
        mainmenu.add(stBtn.create());
        mainmenu.add(stDisBtn.create());
        mainmenu.add(stTooltip.create()); 
        mainmenu.add(slBtn.create());
        mainmenu.add(slDisBtn.create());
        mainmenu.add(slTooltip.create()); 
        mainmenu.add(adBtn.create());
        mainmenu.add(adDisBtn.create());
        mainmenu.add(adTooltip.create()); 
        mainmenu.add(astBtn.create());
        mainmenu.add(astDisBtn.create());
        mainmenu.add(astTooltip.create()); 


/************************************\
|            SETTINGS                |
\************************************/
        let settingsBtn = new InteractiveElementModel();
        settingsBtn.width = i6;
        settingsBtn.height = i6;
        settingsBtn.name = 'settings-button';
        settingsBtn.type =  'icon';
        settingsBtn.path = './img/menu/settings_icon.png';
        settingsBtn.color = 0xe6e6e6;
        settingsBtn.visible = true;
        settingsBtn.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(i6, i6), new THREE.MeshBasicMaterial({visible: false}));
        settingsBtn.position = new THREE.Vector3( menuWidth/4, menuHeight/4, 0.01 );
        settingsBtn.onexecute = function() { console.log("This is the %s button", settingsBtn.name) };

        let zoomBtn = new InteractiveElementModel();
        zoomBtn.width = i5;
        zoomBtn.height = i5;
        zoomBtn.name = 'zoom-button';
        zoomBtn.type =  'icon';
        zoomBtn.path = './img/menu/zoom.png';
        zoomBtn.color = 0xe6e6e6;
        zoomBtn.visible = true;
        zoomBtn.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(i6, i6), new THREE.MeshBasicMaterial({visible: false}));
        zoomBtn.position = new THREE.Vector3( 3*menuWidth/8, menuHeight/4, 0.01 );
        zoomBtn.onexecute = function() { console.log("This is the %s button", zoomBtn.name) };

        let zoomLvlTxt = new InteractiveElementModel();
        zoomLvlTxt.width = 0;
        zoomLvlTxt.height = 0;
        zoomLvlTxt.name = 'zoom-level-text';
        zoomLvlTxt.type = 'text';
        zoomLvlTxt.text = 'x1';
        zoomLvlTxt.color = 0xe6e6e6;
        zoomLvlTxt.textSize = menuWidth/35;
        zoomLvlTxt.visible = true;
        zoomLvlTxt.position = new THREE.Vector3( 27*menuWidth/64, menuHeight/4 + menuWidth/120, 0.01 );

        let tradMenuBtn = new InteractiveElementModel();
        tradMenuBtn.width = menuWidth/25;
        tradMenuBtn.height = menuWidth/25;
        tradMenuBtn.name = 'traditional-menu-button';
        tradMenuBtn.type =  'icon';
        tradMenuBtn.path = './img/menu/traditional.png';
        tradMenuBtn.color = 0xe6e6e6;
        tradMenuBtn.visible = true;
        tradMenuBtn.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(menuWidth/25, menuWidth/25), new THREE.MeshBasicMaterial({visible: false}));
        tradMenuBtn.position = new THREE.Vector3( -menuWidth/2 + menuWidth/25, menuHeight/2 - menuWidth/25, 0.01 );
        tradMenuBtn.onexecute = function() { console.log("This is the %s button", tradMenuBtn.name) };

        let enhancedMenuBtn = new InteractiveElementModel();
        enhancedMenuBtn.width = menuWidth/25;
        enhancedMenuBtn.height = menuWidth/25;
        enhancedMenuBtn.name = 'enhanced-menu-button';
        enhancedMenuBtn.type =  'icon';
        enhancedMenuBtn.path = './img/menu/enhanced.png';
        enhancedMenuBtn.color = 0xe6e6e6;
        enhancedMenuBtn.visible = true;
        enhancedMenuBtn.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(menuWidth/25, menuWidth/25), new THREE.MeshBasicMaterial({visible: false}));
        enhancedMenuBtn.position = new THREE.Vector3(-menuWidth/2 + menuWidth/25, menuHeight/2 - menuWidth/25, 0.01 );
        enhancedMenuBtn.onexecute = function() { console.log("This is the %s button", enhancedMenuBtn.name) };

// TO BE CHANGED AFTER IFA
        let enhancedMenuBtnGroup =  new THREE.Group();

        enhancedMenuBtnGroup.name = 'enhanced-menu-button-group';

        let menuShape = _moData.roundedRect( new THREE.Shape(), 2.5 * menuWidth/25, 2.5 * menuWidth/25, 3*menuWidth/100 );
        let material = new THREE.MeshBasicMaterial( { color: 0x111111});
        let geometry = new THREE.ShapeGeometry( menuShape );
        let mesh =  new THREE.Mesh( geometry, material);

        let enhancedMenuBtnZoom = new InteractiveElementModel();
        enhancedMenuBtnZoom.width = 2 * menuWidth/25;
        enhancedMenuBtnZoom.height = 2 * menuWidth/25;
        enhancedMenuBtnZoom.name = 'enhanced-menu-button-zoom';
        enhancedMenuBtnZoom.type =  'icon';
        enhancedMenuBtnZoom.path = './img/menu/enhanced.png';
        enhancedMenuBtnZoom.color = 0xe6e6e6;
        enhancedMenuBtnZoom.visible = true;
        enhancedMenuBtnZoom.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(menuWidth/25, menuWidth/25), new THREE.MeshBasicMaterial({visible: false}));
        enhancedMenuBtnZoom.position = new THREE.Vector3( 0, 0, 0.01 );
        enhancedMenuBtnZoom.onexecute = function() { console.log("This is the %s button", enhancedMenuBtnZoom.name) };
  
        mesh.add(enhancedMenuBtnZoom.create());
        mesh.position.set(-menuWidth/2 + menuWidth/25, menuHeight/2 - menuWidth/25, 0.02 );

        enhancedMenuBtnGroup.add(mesh);
        enhancedMenuBtnGroup.visible = false;

        mainmenu.add(enhancedMenuBtnGroup);

        // Add all the created elements to the parent group.
        mainmenu.add(settingsBtn.create());
        mainmenu.add(zoomBtn.create());
        mainmenu.add(zoomLvlTxt.create());
        mainmenu.add(tradMenuBtn.create());
        mainmenu.add(enhancedMenuBtn.create());


/************************************\
|     VIDEO PROGRESS BAR ELEMENT     |
\************************************/
        // This is where the video progress bar is created for the traditional menu.
        let vpb_shape_background = _moData.roundedRect( new THREE.Shape(), 4*menuWidth/5, menuHeight/25, menuWidth/200 );
        let vpb =  new THREE.Group();
        vpb.name = "video-progress-bar";
        vpb.visible = true;

        let vpb_background =  new THREE.Mesh( new THREE.ShapeGeometry( vpb_shape_background ), new THREE.MeshBasicMaterial( { color:  0x666666, transparent: true, opacity: 0.8 }));
        
        vpb_background.position.set( 0, -menuHeight/24, 0.01);
        vpb_background.name = "background-progress";

        // Interaction area 
        let coliderMesh = new THREE.Mesh( new THREE.PlaneGeometry(4*menuWidth/5, menuHeight/10), new THREE.MeshBasicMaterial({visible: false}));
        coliderMesh.name = vpb_background.name;
        coliderMesh.position.z = 0.01
        vpb_background.add(coliderMesh);
        
        let videoTotalTime = new InteractiveElementModel();
        videoTotalTime.width = 0;
        videoTotalTime.height = 0;
        videoTotalTime.name = 'video-total-time';
        videoTotalTime.type =  'text';
        videoTotalTime.text = list_contents[demoId].duration;
        videoTotalTime.textSize = menuWidth/50;
        videoTotalTime.color = 0xe6e6e6;
        videoTotalTime.visible = true;
        videoTotalTime.position = new THREE.Vector3( 9*menuWidth/20, -menuHeight/24, 0.01 );

        let videoPlayoutTime = new InteractiveElementModel();
        videoPlayoutTime.width = 0;
        videoPlayoutTime.height = 0;
        videoPlayoutTime.name = 'video-playout-time';
        videoPlayoutTime.type =  'text';
        videoPlayoutTime.text = "00:00";
        videoPlayoutTime.textSize = menuWidth/50;
        videoPlayoutTime.color = 0xe6e6e6;
        videoPlayoutTime.visible = true;
        videoPlayoutTime.position = new THREE.Vector3( -9*menuWidth/20, -menuHeight/24, 0.01 );

        let vpbPlayLeftBorder = new THREE.Mesh( new THREE.CircleGeometry(menuWidth/200,32), new THREE.MeshBasicMaterial( { color: 0xc91355 } ) );
        vpbPlayLeftBorder.position.set( -4*menuWidth/10 + menuWidth/200, -menuHeight/24, 0.03);
        vpb.add(vpbPlayLeftBorder);

        let vpb_play =  new THREE.Mesh( new THREE.ShapeGeometry( vpb_shape_background ), new THREE.MeshBasicMaterial( { color:  0xc91355, transparent: true, opacity: 1 }));
        vpb_play.position.set( 0, -menuHeight/24, 0.03 );
        vpb_play.name = "play-progress";

        let vpb_seek =  new THREE.Mesh( new THREE.ShapeGeometry( vpb_shape_background ), new THREE.MeshBasicMaterial( { color:  0x939393, transparent: true, opacity: 1 }));
        vpb_seek.position.set( 0, -menuHeight/24, 0.02 );
        vpb_seek.visible = false;
        vpb_seek.name = "seek-progress";

        let vpb_time_slider = new THREE.Mesh( new THREE.CircleGeometry(6*menuWidth/500,32), new THREE.MeshBasicMaterial( { color: 0xc91355 } ) );
        vpb_time_slider.visible = false;
        vpb_time_slider.position.set( -4*menuWidth/10, -menuHeight/24, 0.04 );
        vpb_time_slider.name = "slider-progress";

        // Add all the created elements to the parent group.
        vpb.add(vpb_background);
        vpb.add(vpb_play);
        vpb.add(vpb_time_slider);
        vpb.add(vpb_seek);

        vpb.add(videoTotalTime.create());
        vpb.add(videoPlayoutTime.create());

        mainmenu.add(vpb);
        mainmenu.add(traditionalmenuBase);
        
        //The position depends on the menu type.
        if(menuMgr.getMenuType() == 2){
            mainmenu.position.set( 0, -25, 0.02 );     
        } else {
            mainmenu.position.set( 0, 0, 0.02 );
        }

        return mainmenu;
    }

/**
 * { function_description }
 *
 * @class      TraditionalOptionMenuView (name)
 * @param      {string}  name    The name
 * @return     {THREE}   { description_of_the_return_value }
 */
    this.TraditionalOptionMenu = function(name){

        optWidth = 7*menuWidth/16;
        optHeight = menuHeight/4 + 1;

        let tradOptionMenu =  new THREE.Group();
        let material = new THREE.MeshBasicMaterial( { color: 0x111111});
        let geometry = new THREE.PlaneGeometry( optWidth,  optHeight);
        let tradOptionMenuBackground =  new THREE.Mesh( geometry, material);

        tradOptionMenu.name = name;

        // The position depends on the menu type.
        if(menuMgr.getMenuType() == 2){
            tradOptionMenu.position.set(9*menuWidth/32, 0, 0.02);
        } else {
            tradOptionMenu.position.set(0, 0, 0.02); 
        }

        tradOptionMenuBackground.name = 'tradoptionmenubackground';

        // Title for the traditional option sub menu.
        let tradOptionMenuTitle =  new THREE.Group();
        tradOptionMenuTitle.name = 'tradoptionmenutitle';

        // Dropdown for the traditional option sub menu.
        let tradOptionMenuDropdown =  new THREE.Group();
        tradOptionMenuDropdown.name = 'parentcolumndropdown';

        let line = _moData.createLine( 0xc91355, new THREE.Vector3( -optWidth/2, -optHeight/2, 0.01 ), new THREE.Vector3( optWidth/2, -optHeight/2, 0.01 ) );

        let checkMark = new InteractiveElementModel();
        checkMark.width = menuWidth/20;
        checkMark.height = menuWidth/20;
        checkMark.name = 'checkmark';
        checkMark.type =  'icon';
        checkMark.path = './img/menu/checkmark.png';
        checkMark.color = 0xe6e6e6;
        checkMark.visible = false;
        checkMark.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry( menuWidth/20, menuWidth/20), new THREE.MeshBasicMaterial({visible: false}));
        checkMark.position = new THREE.Vector3( 0, 0, 0.01 );

        let backBtn = new InteractiveElementModel();
        backBtn.width = menuWidth/30;
        backBtn.height = menuWidth/30;
        backBtn.rotation = -Math.PI;
        backBtn.name = 'back-button';
        backBtn.type =  'icon';
        backBtn.path = './img/menu/play_icon.png';
        backBtn.color = 0xe6e6e6;
        backBtn.visible = true;
        backBtn.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry( 2*menuWidth/30, menuWidth/30), new THREE.MeshBasicMaterial({visible: false}));
        backBtn.position = new THREE.Vector3( -optWidth/2 + menuWidth/35, 0, 0.01 );
        backBtn.onexecute = function() { console.log("This is the %s button", backBtn.name) };

        let closeBtn = new InteractiveElementModel();
        closeBtn.width = menuWidth/30;
        closeBtn.height = menuWidth/30;
        closeBtn.name = 'close-button-opt';
        closeBtn.type =  'icon';
        closeBtn.path = './img/menu/close.png';
        closeBtn.color = 0xe6e6e6;
        closeBtn.visible = true;
        closeBtn.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(menuWidth/25, menuWidth/25), new THREE.MeshBasicMaterial({visible: false}));
        closeBtn.position = new THREE.Vector3( optWidth/2 - menuWidth/35, 0, 0.01 );
        closeBtn.onexecute = function() { console.log("This is the %s button", closeBtn.name) };

        let optTitle = new InteractiveElementModel();
        optTitle.width = 18*menuWidth/200;
        optTitle.height = optHeight;
        optTitle.name = 'settings-opt-title';
        optTitle.type =  'text';
        optTitle.text = 'Title';
        optTitle.path = '';
        optTitle.textSize =  menuWidth/40;
        optTitle.color = 0xe6e6e6;
        optTitle.visible = true;
        optTitle.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(optTitle.width, optHeight), new THREE.MeshBasicMaterial({visible:  false}));
        optTitle.position = new THREE.Vector3( 0, 0, 0.01 );

        // Add all the created elements to the parent group.
        tradOptionMenuTitle.add(line);
        tradOptionMenuTitle.add(backBtn.create());
        tradOptionMenuTitle.add(optTitle.create());

        // Add all the parent elements to the traditional option menu.
        tradOptionMenu.add(checkMark.create());
        tradOptionMenu.add(tradOptionMenuTitle);
        tradOptionMenu.add(tradOptionMenuBackground);
        tradOptionMenu.add(tradOptionMenuDropdown);

        return tradOptionMenu;
    }
}
