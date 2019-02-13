/**
 * { function_description }
 *
 * @class      MenuManager (name)
 * @return     {string}  { description_of_the_return_value }
 */
function MenuManager() {

    var menuType;
    var menuParent;
    var controllers = [];
    var actualCtrl;
    var menuActivationElement;

    var menuHeight;
    var menuWidth;

    var optActiveIndex;

/**
 * { function_description }
 *
 * @class      Init (name)
 * @param      {<type>}  type    The type
 */
    this.Init = function(type)
    {
        //subController.setSubtitleLanguagesArray(list_contents[demoId].subtitles[0]);
        //subController.setSignerLanguagesArray(list_contents[demoId].signer[0]);

        menuWidth = 125;
        menuHeight = 125*9/16;
        
        menuParent = _isHMD ? scene : camera;

        // Low sighted menuType = 1; Traditional menuType = 2;
        menuMgr.setMenuType(type);

        addMenuToParent();
        InitAllCtrl();

        menuMgr.ResetViews();
    }

/**
 * { function_description }
 *
 * @class      NavigateForwardMenu (name)
 * @return     {<type>}  { description_of_the_return_value }
 */
    this.NavigateForwardMenu = function()
    {
        switch(actualCtrl.getMenuName())
        {
            case playpauseCtrl.getMenuName():
                return menuMgr.Load(volumeCtrl);

            case volumeCtrl.getMenuName():
                return menuMgr.Load(multiOptionsCtrl)

            case multiOptionsCtrl.getMenuName():
                return menuMgr.Load(settingsCtrl)

            case settingsCtrl.getMenuName():
                return menuMgr.Load(playpauseCtrl)
        }
    }

/**
 * { function_description }
 *
 * @class      NavigateBackMenu (name)
 * @return     {<type>}  { description_of_the_return_value }
 */
    this.NavigateBackMenu = function()
    {
        switch(actualCtrl.getMenuName())
        {
            case playpauseCtrl.getMenuName():
                return menuMgr.Load(settingsCtrl);

            case volumeCtrl.getMenuName():
                return menuMgr.Load(playpauseCtrl)

            case multiOptionsCtrl.getMenuName():
                return menuMgr.Load(volumeCtrl) 

            case settingsCtrl.getMenuName():
                return menuMgr.Load(multiOptionsCtrl)            

            case STOptionCtrl.getMenuName():
            case SLOptionCtrl.getMenuName():
            case ADOptionCtrl.getMenuName():
            case ASTOptionCtrl.getMenuName():
                return menuMgr.Load(multiOptionsCtrl)

            case SettingsOptionCtrl.getMenuName():
                return menuMgr.Load(settingsCtrl)
        } 
    }

/**
 * Sets the option active index.
 *
 * @param      {<type>}  newIndex  The new index
 */
    this.setOptActiveIndex = function(newIndex)
    {
        optActiveIndex = newIndex;
    }

/**
 * Sets the menu type.
 *
 * @param      {<type>}  newMenuType  The new menu type
 */
    this.setMenuType = function(newMenuType)
    {
        menuType = newMenuType;
    }

/**
 * Gets the menu type.
 *
 * @return     {<type>}  The menu type.
 */
    this.getMenuType = function()
    {
        return menuType;
    }

/**
 * Sets the actual control.
 *
 * @param      {<type>}  newCtrl  The new control
 */
    this.setActualCtrl = function(newCtrl)
    {
        actualCtrl = newCtrl;
    }

/**
 * Gets the actual control.
 *
 * @return     {<type>}  The actual control.
 */
    this.getActualCtrl = function()
    {
        return actualCtrl;
    }

/**
 * { function_description }
 *
 * @class      Load (name)
 * @param      {<type>}  controller  The controller
 */
    this.Load = function (controller)
    {
        if(actualCtrl)
        {
            actualCtrl.Exit();
            switch(menuType)
            {
                case 1:
                default:
                {
                    actualCtrl = controller;
                    controller.Init();
                    break;
                };
                case 2:
                {
                    // Compare the saved index of the traditional option dropdown with the new controller index. 
                    // If the index is deferent change the variable and initialize the doprdown
                    if(optActiveIndex != controller.getMenuIndex())
                    {
                        controller.Init();
                        optActiveIndex = controller.getMenuIndex();
                    }
                    // If the index is equal change the variable to 'undefined' in order to open the same dropdown just closed.
                    else optActiveIndex = 0;
                    break;
                };
            }
        }
        else
        {
            controller.Init();
            optActiveIndex = controller.getMenuIndex();
        }
        actualCtrl = controller;
    }

/**
 * Resets the visibility to false in all the low sighted menus and shows the menu activation area
 *
 * @class      ResetViews (name)
 */
    this.ResetViews = function()
    {  
        actualCtrl = '';
        optActiveIndex = 0;

        controllers.forEach(function(controller){
            controller.Exit();
        });

        if ( scene.getObjectByName('pointer2') && _isHMD )
        {
            scene.getObjectByName('pointer2').visible = false;
            if ( menuType == 2 ) scene.getObjectByName('pointer2').scale.set(1.1,1.1,1.1)
                else  scene.getObjectByName('pointer2').scale.set(2.5,2.5,2.5)
        }
        else if ( scene.getObjectByName( "pointer" ) && _isHMD ) 
        {
            scene.getObjectByName( "pointer" ).visible = false;
            if ( menuType == 2 ) scene.getObjectByName('pointer').scale.set(1.1,1.1,1.1)
                else  scene.getObjectByName('pointer').scale.set(2.5,2.5,2.5)
        }


        playpauseCtrl.playAllFunc();

        //TRADITIONAL
        if(menuParent.getObjectByName('traditionalmenu')) menuParent.getObjectByName('traditionalmenu').visible = false;

        if(menuActivationElement) menuActivationElement.visible = true;
    }

/**
 * Creates a menu activation element.
 */
    this.createMenuActivationElement = function()
    {
        var geometry = new THREE.SphereGeometry( 99, 32, 16, Math.PI/2, Math.PI * 2,  2.35,  0.4 );
        geometry.scale( - 1, 1, 1 );
        //var material = new THREE.MeshBasicMaterial( {color: 0x13ec56, side: THREE.FrontSide, colorWrite: false});
        var material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.FrontSide, transparent: true, opacity:0} );
        //var geometry = new THREE.SphereGeometry( 99, 64, 16, Math.PI/2, Math.PI * 2,  7*Math.PI/20,  -Math.PI/12 );
        //var material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.FrontSide, transparent: true, opacity:0.05} );
        menuActivationElement = new THREE.Mesh( geometry, material );
        menuActivationElement.name = 'openMenu';

        Reticulum.add( menuActivationElement, {
            reticleHoverColor: 0x4669a7,
            fuseDuration: 2, // Overrides global fuse duration
            fuseVisible: true,
            onGazeOver: function(){
                // do something when user targets object
                scene.getObjectByName("openmenutext").visible = true;
                this.material.color.setHex( 0xffffff );
            },
            onGazeOut: function(){
                // do something when user moves reticle off targeted object
                scene.getObjectByName("openmenutext").visible = false;
                this.material.color.setHex( 0xffffff );
            },
            onGazeLong: function(){
                

                menuMgr.initFirstMenuState(); // Initialize the first menu state when the time has expired.

            }
        });

        scene.add(menuActivationElement);
    }

/**
 * This function return the initial state for the menu.
 * For the Low Sighted menu the initial state is the PlayPause menu.
 * For the Traditional menu the initial state is init all the controllers and exit the submenus.
 * 
 * @function initFirstMenuState (name)
*/
    this.initFirstMenuState = function()
    {
        menuActivationElement.visible = false;
        scene.getObjectByName( "openmenutext" ).visible = false;

        if ( scene.getObjectByName('pointer2') && _isHMD ) scene.getObjectByName('pointer2').visible = true;
        else if ( scene.getObjectByName( "pointer" ) && _isHMD ) scene.getObjectByName( "pointer" ).visible = true;

        switch(menuType)
        {
            case 1: // LOW SIGHTED
            default:
            {
                menuMgr.Load(playpauseCtrl);
                playpauseCtrl.pauseAllFunc();

                if (_isHMD) 
                {
                    resetMenuPosition( menuParent.getObjectByName('playpausemenu') );
                    resetMenuPosition( menuParent.getObjectByName('volumemenu') )
                    resetMenuPosition( menuParent.getObjectByName('settingsmenu') )
                    resetMenuPosition( menuParent.getObjectByName('multioptionsmenu') )
                    resetMenuPosition( menuParent.getObjectByName('lowsightedoptmenu') )
                    resetMenuPosition( menuParent.getObjectByName('settingsoptmenu') )
                }

                break;
            };
            case 2: // TRADITIONAL
            {
                controllers.forEach(function(controller){
                    controller.Init();
                });

                STOptionCtrl.Exit();
                SLOptionCtrl.Exit();
                ADOptionCtrl.Exit();
                ASTOptionCtrl.Exit();
                SettingsOptionCtrl.Exit();

                if (_isHMD) 
                {
                    resetMenuPosition( menuParent.getObjectByName('traditionalmenu') )
                }

                menuParent.getObjectByName('traditionalmenu').visible = true;

                break;
            };
        }   
    }

/**
 * Opens a preview.
 *
 * @function      OpenPreview (name)
 */
    this.OpenPreview = function()
    {
        menuParent.add(createMultiOptionsPreviewStructure('multioptionspreview'));
        multiOptionsPreviewCtrl = new MultiOptionsPreviewController(menuType);

        controllers.forEach(function(controller){
            controller.Exit();
        });
        multiOptionsPreviewCtrl.Init();
        setTimeout(function()
        {
            multiOptionsPreviewCtrl.Exit();
            actualCtrl.Init();
            if(scene.getObjectByName("sign")) scene.getObjectByName("sign").visible = subController.getSignerEnabled();
//            if(scene.getObjectByName("subtitles")) scene.getObjectByName("subtitles").visible = subController.getSignerEnabled();
        },2000);

        /*var subMesh = scene.getObjectByName("subtitles");
        if(subMesh) subMesh.visible = false;*/
    }

/**
 * { function_description }
 *
 * @param      {<type>}  object  The object
 */
    function resetMenuPosition(object)
    {
        object.position.x = 0;
        object.position.z = 0;
        object.rotation.y = camera.rotation.y;

        object.position.x = Math.sin(-camera.rotation.y)*67;
        object.position.z = -Math.cos(camera.rotation.y)*67;
    }

/**
 * Adds a menu to parent.
 */
    function addMenuToParent()
    {
        switch(menuType)
        {
            case 1: // LOW SIGHTED
            default:
            {                
                menuParent.add(createPlayPauseLSMenuViewStructure('playpausemenu'));
                menuParent.add(createVolumeLSMenuViewStructure('volumemenu'));
                menuParent.add(createSettingsLSMenuViewStructure('settingsmenu'));
                menuParent.add(createMultiOptionsLSMenuViewStructure('multioptionsmenu'));
                menuParent.add(createOptionLSMenuViewStructure('lowsightedoptmenu'));
                menuParent.add(createOptionLSMenuViewStructure('settingsoptmenu'));
                break;
            };
            case 2: // TRADITIONAL
            {
                var traditionalmenu = createTraditionalViewStructure('traditionalmenu');

                if (_isHMD) traditionalmenu.scale.set( 0.8, 0.8, 0.8 );
                menuParent.add(traditionalmenu);
                traditionalmenu.add(createOptionTraditionalMenuViewStructure('tradoptionmenu'));
                break;
            };
        }
    }

/**
 * Removes a menu from parent.
 */
    this.removeMenuFromParent = function()
    {
        switch(menuType)
        {
            
            case 1: // LOW SIGHTED
            default:
            {
                menuParent.remove(scene.getObjectByName('playpausemenu'));
                menuParent.remove(scene.getObjectByName('volumemenu'));
                menuParent.remove(scene.getObjectByName('settingsmenu'));
                menuParent.remove(scene.getObjectByName('multioptionsmenu'));
                menuParent.remove(scene.getObjectByName('lowsightedoptmenu'));
                menuParent.remove(scene.getObjectByName('settingsoptmenu'));
                break;
            };
            case 2:// TRADITIONAL
            {
                menuParent.remove(scene.getObjectByName('traditionalmenu'));
                break;
            };
        }
    }

/**
 * { function_description }
 *
 * @function      InitAllCtrl (name)
 */
    function InitAllCtrl()
    {
        controllers = [];

        playpauseCtrl = new PlayPauseLSMenuController();
        controllers.push(playpauseCtrl);  

        volumeCtrl = new VolumeLSMenuController();
        controllers.push(volumeCtrl);

        settingsCtrl = new SettingsLSMenuController(menuType);
        controllers.push(settingsCtrl);

        multiOptionsCtrl = new MultiOptionsLSMenuController(menuType);
        controllers.push(multiOptionsCtrl);

        STOptionCtrl = new STOptionMenuController(menuType);
        controllers.push(STOptionCtrl);

        SLOptionCtrl = new SLOptionMenuController(menuType);
        controllers.push(SLOptionCtrl);

        ADOptionCtrl = new ADOptionMenuController(menuType);
        controllers.push(ADOptionCtrl);

        ASTOptionCtrl = new ASTOptionMenuController(menuType);
        controllers.push(ASTOptionCtrl);

        SettingsOptionCtrl = new SettingsOptionMenuController(menuType);
        controllers.push(SettingsOptionCtrl);

        if(menuType == 2)
        {
            vpbCtrl = new VideoProgressBarController();
            controllers.push(vpbCtrl);
        }

        controllers.forEach(function(controller){
            controller.Init();
        });
    }

/*******************************************************************************************************
 *
 *                                 V I E W     S T R U C T U R E S 
 *
 ******************************************************************************************************/

/**
 * Creates a multi options preview structure.
 *
 * @param      {string}  name    The name
 * @return     {THREE}   { description_of_the_return_value }
 */
    function createMultiOptionsPreviewStructure(name)
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
        
        //CREATE NEW SUBTITLES SHOWING IN TEXT THE OPTIONS OF SIZE. THIS IS AN EXAMPLE OF BIG SUBTITLES.
        var stMesh = scene.getObjectByName("subtitles");
        if(stMesh) stMesh.visible = false;

        var slMesh = scene.getObjectByName("sign");
        if(slMesh) slMesh.visible = false;


        return preview;
    }

/**
 * Creates a trad menu base view structure.
 *
 * @param      {<type>}  name    The name
 * @return     {THREE}   { description_of_the_return_value }
 */
    function createTradMenuBaseViewStructure(name) 
    {
        var material = new THREE.MeshBasicMaterial( { color: 0x333333, transparent: true, opacity: 0.8 }); 
        var geometry = new THREE.PlaneGeometry( menuWidth, menuHeight/12 );
        var menuTrad =  new THREE.Mesh( geometry, material);

        menuTrad.position.set( 0, -menuHeight/2.5 - 5, -67 );
        menuTrad.name = name;

        var menuBackground = new THREE.Mesh( new THREE.PlaneGeometry( menuWidth, menuHeight ), new THREE.MeshBasicMaterial( {visible:  false} ) );

        menuBackground.position.set( 0, menuHeight/2, 0.01 );

        menuTrad.add(menuBackground);

        return menuTrad;
    }

/**
 * Creates an option traditional menu view structure.
 *
 * @param      {string}  name    The name
 * @return     {THREE}   { description_of_the_return_value }
 */
    function createOptionTraditionalMenuViewStructure(name)
    {   
        var tradOptionMenu = new THREE.Group();
        tradOptionMenu.name = name;

        tradOptionMenu.position.set((menuWidth-30)/2, menuHeight/12 + 1, 0.01); // The +1 in height is the height of the video-progress-bar

        var material = new THREE.MeshBasicMaterial( { color: 0x333333, transparent: true, opacity: 0.8 });   
        var geometry = new THREE.PlaneGeometry( 30, 5 );
        var tradOptionMenuBackground =  new THREE.Mesh( geometry, material);
        tradOptionMenuBackground.name = 'tradoptionmenubackground';
        tradOptionMenuBackground.position.y = menuHeight/12;
        tradOptionMenu.add(tradOptionMenuBackground);

        var tradOptionMenuTitle =  new THREE.Group();
        tradOptionMenuTitle.name = 'tradoptionmenutitle';

        var line = _moData.createLine( 0xffffff, 
            new THREE.Vector3( -15, -2.5, 0.01 ),
            new THREE.Vector3( 15, -2.5, 0.01 ) );

        tradOptionMenuTitle.add(line)

        var back = new InteractiveElementModel();
        back.width = 1.5;
        back.height = 1.5;
        back.name = 'backMenuButton';
        back.type =  'icon';
        back.value = './img/menu/less_than_icon.png';
        back.color = 0xffffff;
        back.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(back.width, back.height), new THREE.MeshBasicMaterial({visible: false}));
        back.position = new THREE.Vector3(-12, 0, 0.01);

        tradOptionMenuTitle.add(back.create());

        var onOptButton = new InteractiveElementModel();
        onOptButton.width = 4.5;
        onOptButton.height = 2.5;
        onOptButton.name = 'onoptbutton';
        onOptButton.type =  'icon';
        onOptButton.value = './img/menu/toggle_on.png';
        onOptButton.color = 0xffffff;
        onOptButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(onOptButton.width, onOptButton.height), new THREE.MeshBasicMaterial({visible: false}));
        onOptButton.position = new THREE.Vector3(-12, 0, 0.01);

        tradOptionMenuTitle.add(onOptButton.create());

        var offOptButton = new InteractiveElementModel();
        offOptButton.width = 4.5;
        offOptButton.height = 2.5;
        offOptButton.name = 'offoptbutton';
        offOptButton.type =  'icon';
        offOptButton.value = './img/menu/toggle_off.png';
        offOptButton.color = 0xffffff;
        offOptButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(offOptButton.width, offOptButton.height), new THREE.MeshBasicMaterial({visible: false}));
        offOptButton.position = new THREE.Vector3(-12, 0, 0.01);

        tradOptionMenuTitle.add(offOptButton.create());

        var optTitle = new InteractiveElementModel();
        optTitle.width = 4.5;
        optTitle.height = 2.5;
        optTitle.name = 'opttitle';
        optTitle.type =  'text';
        optTitle.textSize = 1.5;
        optTitle.value = 'Title';
        optTitle.color = 0xffffff;
        optTitle.position = new THREE.Vector3(0,0, 0.01);

        tradOptionMenuTitle.add(optTitle.create());

        tradOptionMenu.add(tradOptionMenuTitle);

        var  tradOptionMenuDropdown =  new THREE.Group();
        tradOptionMenuDropdown.name = 'parentcolumndropdown';
        tradOptionMenu.add(tradOptionMenuDropdown);

        return tradOptionMenu;
    }

/**
 * Creates a traditional view structure.
 *
 * @param      {string}  name    The name
 */
    function createTraditionalViewStructure(name)
    {
        var traditionalmenu = createTradMenuBaseViewStructure(name);

        var  playpausemenu =  new THREE.Group();
        playpausemenu.name = 'playpausemenu';

        // Create the seekBackButton by loading a new InteractiveElement model and injecting the seekBackButtonData
        var seekBackButton = new InteractiveElementModel();

        seekBackButton.width = 2;
        seekBackButton.height = 1;
        seekBackButton.name =  'backSeekButton';
        seekBackButton.type =  'icon';
        seekBackButton.value = './img/menu/seek_icon.png';
        seekBackButton.color = 0xffffff;
        seekBackButton.visible = true;
        seekBackButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(seekBackButton.width, seekBackButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        seekBackButton.onexecute =  function(){ console.log("This is a seek back button"); }
        seekBackButton.position = new THREE.Vector3(-(tradmenuDivisions-1)*menuWidth/(tradmenuDivisions*2), 0, 0.01);
        
        playpausemenu.add(seekBackButton.create());

        // Create the playbutton by loading a new InteractiveElement model and injecting the playButtonData
        var playButton = new InteractiveElementModel();
        playButton.width = 2;
        playButton.height = 2;
        playButton.name =  'playButton';
        playButton.type =  'icon';
        playButton.value = './img/menu/play_icon.png';
        playButton.color = 0xffffff;
        playButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(playButton.width, playButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        playButton.onexecute =  function(){ console.log("This is the play button"); }
        playButton.position = new THREE.Vector3(-(tradmenuDivisions-3)*menuWidth/(tradmenuDivisions*2), 0, 0.01);
        
        playpausemenu.add(playButton.create());

        // Create the pauseButton by loading a new InteractiveElement model and injecting the pauseButtonData
        var pauseButton = new InteractiveElementModel();
        pauseButton.width = 2;
        pauseButton.height = 2;
        pauseButton.name =  'pauseButton';
        pauseButton.type =  'icon';
        pauseButton.value = './img/menu/pause_icon.png';
        pauseButton.color = 0xffffff;
        pauseButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(pauseButton.width, pauseButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        pauseButton.onexecute =  function(){ console.log("This is the pause button"); }
        pauseButton.position = new THREE.Vector3(-(tradmenuDivisions-3)*menuWidth/(tradmenuDivisions*2), 0, 0.01);
        
        playpausemenu.add(pauseButton.create());

        // Create the seekForwardButton by loading a new InteractiveElement model and injecting the seekForwardButtonData
        var seekForwardButton = new InteractiveElementModel();
        seekForwardButton.width = 2;
        seekForwardButton.height = 1;
        seekForwardButton.rotation = Math.PI;
        seekForwardButton.name =  'forwardSeekButton';
        seekForwardButton.type =  'icon';
        seekForwardButton.value = './img/menu/seek_icon.png';
        seekForwardButton.color = 0xffffff;
        seekForwardButton.visible = true;
        seekForwardButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(seekForwardButton.width, seekForwardButton.height), new THREE.MeshBasicMaterial({visible: false}));
        seekForwardButton.onexecute =  function(){ console.log("This is a seek forward button"); }
        seekForwardButton.position = new THREE.Vector3(-(tradmenuDivisions-5)*menuWidth/(tradmenuDivisions*2), 0, 0.01);
        
        playpausemenu.add(seekForwardButton.create());

        var playouttime = new InteractiveElementModel();
        playouttime.width = 0.3;
        playouttime.height = 0.3;
        playouttime.name = 'playOutTime';
        playouttime.type =  'text';
        playouttime.value = '00:00 / 00:00';
        playouttime.color = 0xffffff;
        playouttime.textSize =  1.5;
        playouttime.position = new THREE.Vector3(-(tradmenuDivisions-17)*menuWidth/(tradmenuDivisions*2), 0, 0.01);
            
        playpausemenu.add(playouttime.create());

        // Create the closeMenuButton by loading a new InteractiveElement model and ijecting the closeMenuButtonData
        var closeMenuButton = new InteractiveElementModel();
        closeMenuButton.width = 3;
        closeMenuButton.height = 3;
        closeMenuButton.rotation = Math.PI/4;
        closeMenuButton.name = 'closeMenuButton';
        closeMenuButton.type=  'icon';
        closeMenuButton.value = './img/menu/plus_icon.png';
        closeMenuButton.color = 0xffffff;
        closeMenuButton.visible = true;
        closeMenuButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(closeMenuButton.width, closeMenuButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        closeMenuButton.onexecute =  function(){ console.log('Close menu button clicked') };
        closeMenuButton.position = new THREE.Vector3((tradmenuDivisions-1)*menuWidth/(tradmenuDivisions*2), 0, 0.01);

        playpausemenu.add(closeMenuButton.create());

        traditionalmenu.add(playpausemenu);

// VIDEO PROGRESS BAR ELEMENT
        var vpb =  new THREE.Group();
        vpb.name = "video-progress-bar";
        vpb.visible = true;

        var vpb_background =  new THREE.Mesh( new THREE.PlaneGeometry( menuWidth, 1 ), new THREE.MeshBasicMaterial( { color:  0x888888, transparent: true, opacity: 0.8 }));
        vpb_background.position.set( 0, traditionalmenu.geometry.parameters.height/2 + vpb_background.geometry.parameters.height/2, 0.01 );
        vpb_background.name = "background-progress";
        vpb.add(vpb_background);

        var vpb_play =  new THREE.Mesh( new THREE.PlaneGeometry( menuWidth, 1 ), new THREE.MeshBasicMaterial( { color:  0xff0000, transparent: true, opacity: 1 }));
        vpb_play.position.set( 0, traditionalmenu.geometry.parameters.height/2 + vpb_play.geometry.parameters.height/2, 0.02 ); 
        vpb_play.name = "play-progress";
        vpb.add(vpb_play);      
        
        var vpb_time_slider = new THREE.Mesh( new THREE.CircleGeometry(1,32), new THREE.MeshBasicMaterial( { color: 0xff0000 } ) );
        vpb_time_slider.position.set( -traditionalmenu.geometry.parameters.width/2, traditionalmenu.geometry.parameters.height/2 + vpb_play.geometry.parameters.height/2, 0.02 ); 
        vpb_time_slider.name = "slider-progress";
        vpb.add( vpb_time_slider );

        traditionalmenu.add(vpb);

// VOLUME MENU
        var  volumemenu =  new THREE.Group();
        volumemenu.name = 'volumemenu';

        // Create the minusVolumeButton by loading a new InteractiveElement model and ijecting the minusVolumeButtonData
        var minusVolumeButton = new InteractiveElementModel();
        minusVolumeButton.width = 1.5;
        minusVolumeButton.height = 1.5;
        minusVolumeButton.name = 'minusVolumeButton';
        minusVolumeButton.type =  'icon';
        minusVolumeButton.value = './img/menu/minus_icon.png';
        minusVolumeButton.color = 0xffffff;
        minusVolumeButton.visible = true;
        minusVolumeButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(minusVolumeButton.width, minusVolumeButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        minusVolumeButton.onexecute =  function(){ console.log("This is the minus volume button"); };
        minusVolumeButton.position = new THREE.Vector3(-(tradmenuDivisions-8)*menuWidth/(tradmenuDivisions*2), 0, 0.01);

        volumemenu.add(minusVolumeButton.create());

        // Create the playbutton by loading a new InteractiveElement model and ijecting the playButtonData
        var plusVolumeButton = new InteractiveElementModel();
        plusVolumeButton.width = 1.5;
        plusVolumeButton.height = 1.5;
        plusVolumeButton.name = 'plusVolumeButton';
        plusVolumeButton.type =  'icon';
        plusVolumeButton.value = './img/menu/plus_icon.png';
        plusVolumeButton.color = 0xffffff;
        plusVolumeButton.visible = true;
        plusVolumeButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(plusVolumeButton.width, plusVolumeButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        plusVolumeButton.onexecute =  function(){ console.log("This is the plus volume button"); };
        plusVolumeButton.position = new THREE.Vector3(-(tradmenuDivisions-12)*menuWidth/(tradmenuDivisions*2), 0, 0.01);

        volumemenu.add(plusVolumeButton.create());

        // Create the pauseButton by loading a new InteractiveElement model and ijecting the pauseButtonData
        var unmuteVolumeButton = new InteractiveElementModel();
        unmuteVolumeButton.width = 2;
        unmuteVolumeButton.height = 2;
        unmuteVolumeButton.name = 'unmuteVolumeButton';
        unmuteVolumeButton.type =  'icon';
        unmuteVolumeButton.value = './img/menu/volume_unmute_icon.png';
        unmuteVolumeButton.color = 0xffffff;
        unmuteVolumeButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(unmuteVolumeButton.width, unmuteVolumeButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        unmuteVolumeButton.onexecute =  function(){ console.log("This is the unmute volume button"); };
        unmuteVolumeButton.position = new THREE.Vector3(-(tradmenuDivisions-10)*menuWidth/(tradmenuDivisions*2), 0, 0.01);

        volumemenu.add(unmuteVolumeButton.create());

        // Create the plusVolumeButton by loading a new InteractiveElement model and ijecting the plusVolumeButtonData
        var muteVolumeButton = new InteractiveElementModel();
        muteVolumeButton.width = 2;
        muteVolumeButton.height = 2;
        muteVolumeButton.name = 'muteVolumeButton';
        muteVolumeButton.type =  'icon';
        muteVolumeButton.value = './img/menu/volume_mute_icon.png';
        muteVolumeButton.color = 0xffffff;
        muteVolumeButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(muteVolumeButton.width, muteVolumeButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        muteVolumeButton.onexecute =  function(){ console.log("This is the mute volume button"); };
        muteVolumeButton.position = new THREE.Vector3(-(tradmenuDivisions-10)*menuWidth/(tradmenuDivisions*2), 0, 0.01);

        volumemenu.add(muteVolumeButton.create());

        var volumeLevel = new InteractiveElementModel();
        volumeLevel.width = 4;
        volumeLevel.height = 4;
        volumeLevel.name = 'volumeLevel';
        volumeLevel.type =  'text';
        volumeLevel.value = '';
        volumeLevel.color = 0xffffff;
        volumeLevel.textSize =  1.25;
        volumeLevel.visible = false;
        volumeLevel.position = new THREE.Vector3(-(tradmenuDivisions-10)*menuWidth/(tradmenuDivisions*2), 0, 0.01);

        volumemenu.add(volumeLevel.create());

        traditionalmenu.add(volumemenu);


        var  multioptionsmenu =  new THREE.Group();
        multioptionsmenu.name = 'multioptionsmenu';

// SUBTITLES
        var subtitlesButton = new InteractiveElementModel();
        subtitlesButton.width = 4;
        subtitlesButton.height = 4;
        subtitlesButton.name = 'showSubtitlesMenuButton';
        subtitlesButton.type =  'icon';
        subtitlesButton.value = MenuDictionary.translate('ST');
        subtitlesButton.color = 0xffffff;
        subtitlesButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(subtitlesButton.width, subtitlesButton.height), new THREE.MeshBasicMaterial({visible: false}));
        subtitlesButton.onexecute =  function(){ console.log("Open ST submenu") };
        subtitlesButton.position = new THREE.Vector3((tradmenuDivisions-13)*menuWidth/(tradmenuDivisions*2), 0, 0.01);

        multioptionsmenu.add(subtitlesButton.create());

// SUBTITLES DISABLED
        var subtitlesDisabledButton = new InteractiveElementModel();
        subtitlesDisabledButton.width = 4;
        subtitlesDisabledButton.height = 4;
        subtitlesDisabledButton.name = 'disabledSubtitlesMenuButton';
        subtitlesDisabledButton.type =  'icon';
        subtitlesDisabledButton.value = MenuDictionary.translate('ST_strike');
        subtitlesDisabledButton.color = 0xffffff;
        subtitlesDisabledButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(subtitlesDisabledButton.width, subtitlesDisabledButton.height), new THREE.MeshBasicMaterial({visible: false}));
        subtitlesDisabledButton.onexecute =  function(){ console.log("Open ST submenu") };
        subtitlesDisabledButton.position = new THREE.Vector3((tradmenuDivisions-13)*menuWidth/(tradmenuDivisions*2), 0, 0.01);

        multioptionsmenu.add(subtitlesDisabledButton.create());

//SIGN LANGUAGE
        var signLanguageButton = new InteractiveElementModel();
        signLanguageButton.width = 4;
        signLanguageButton.height = 4;
        signLanguageButton.name = 'showSignLanguageMenuButton';
        signLanguageButton.type =  'icon';
        signLanguageButton.value = MenuDictionary.translate('SL');
        signLanguageButton.color = 0xffffff;
        signLanguageButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(signLanguageButton.width, signLanguageButton.height), new THREE.MeshBasicMaterial({visible: false}));
        signLanguageButton.onexecute =  function(){ console.log("Open SL submenu")};
        signLanguageButton.position = new THREE.Vector3((tradmenuDivisions-11)*menuWidth/(tradmenuDivisions*2), 0, 0.01);

        multioptionsmenu.add(signLanguageButton.create());

//SIGN LANGUAGE DISABLED
        var signLanguageDisabledButton = new InteractiveElementModel();
        signLanguageDisabledButton.width = 4;
        signLanguageDisabledButton.height = 4;
        signLanguageDisabledButton.name = 'disabledSignLanguageMenuButton';
        signLanguageDisabledButton.type =  'icon';
        signLanguageDisabledButton.value = MenuDictionary.translate('SL_strike');
        signLanguageDisabledButton.color = 0xffffff;
        signLanguageDisabledButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(signLanguageDisabledButton.width, signLanguageDisabledButton.height), new THREE.MeshBasicMaterial({visible: false}));
        signLanguageDisabledButton.onexecute =  function(){ console.log("Open SL submenu") };
        signLanguageDisabledButton.position = new THREE.Vector3((tradmenuDivisions-11)*menuWidth/(tradmenuDivisions*2), 0, 0.01);

        multioptionsmenu.add(signLanguageDisabledButton.create());

//AUDIO DESCRIPTION
        var audioDescriptionButton = new InteractiveElementModel();
        audioDescriptionButton.width = 4;
        audioDescriptionButton.height = 4;
        audioDescriptionButton.name = 'showAudioDescriptionMenuButton';
        audioDescriptionButton.type =  'icon';
        audioDescriptionButton.value = MenuDictionary.translate('AD');
        audioDescriptionButton.color = 0xffffff;
        audioDescriptionButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(audioDescriptionButton.width, audioDescriptionButton.height), new THREE.MeshBasicMaterial({visible: false}));
        audioDescriptionButton.onexecute =  function(){ console.log("Open AD submenu") };
        audioDescriptionButton.position = new THREE.Vector3((tradmenuDivisions-9)*menuWidth/(tradmenuDivisions*2), 0, 0.01);

        multioptionsmenu.add(audioDescriptionButton.create());

//AUDIO DESCRIPTION DISABLED
        var audioDescriptionDisabledButton = new InteractiveElementModel();
        audioDescriptionDisabledButton.width = 4;
        audioDescriptionDisabledButton.height = 4;
        audioDescriptionDisabledButton.name = 'disabledAudioDescriptionMenuButton';
        audioDescriptionDisabledButton.type =  'icon';
        audioDescriptionDisabledButton.value = MenuDictionary.translate('AD_strike');
        audioDescriptionDisabledButton.color = 0xffffff;
        audioDescriptionDisabledButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(audioDescriptionDisabledButton.width, audioDescriptionDisabledButton.height), new THREE.MeshBasicMaterial({visible: false}));
        audioDescriptionDisabledButton.onexecute =  function(){ console.log("Open AD submenu") };
        audioDescriptionDisabledButton.position = new THREE.Vector3((tradmenuDivisions-9)*menuWidth/(tradmenuDivisions*2), 0, 0.01);

        multioptionsmenu.add(audioDescriptionDisabledButton.create());

//AUDIO SUBTITLES
        var audioSubtitlesButton = new InteractiveElementModel();
        audioSubtitlesButton.width = 4;
        audioSubtitlesButton.height = 4;
        audioSubtitlesButton.name = 'showAudioSubtitlesMenuButton';
        audioSubtitlesButton.type =  'icon';
        audioSubtitlesButton.value = MenuDictionary.translate('AST');
        audioSubtitlesButton.color = 0xffffff;
        audioSubtitlesButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(audioSubtitlesButton.width, audioSubtitlesButton.height), new THREE.MeshBasicMaterial({visible: false}));
        audioSubtitlesButton.onexecute =  function(){ console.log("Open AST submenu") };
        audioSubtitlesButton.position = new THREE.Vector3((tradmenuDivisions-7)*menuWidth/(tradmenuDivisions*2), 0, 0.01);

        multioptionsmenu.add(audioSubtitlesButton.create());

//AUDIO SUBTITLES DISABLED
        var audioSubtitlesDisabledButton = new InteractiveElementModel();
        audioSubtitlesDisabledButton.width = 4;
        audioSubtitlesDisabledButton.height = 4;
        audioSubtitlesDisabledButton.name = 'disabledAudioSubtitlesMenuButton';
        audioSubtitlesDisabledButton.type =  'icon';
        audioSubtitlesDisabledButton.value = MenuDictionary.translate('AST_strike');
        audioSubtitlesDisabledButton.color = 0xffffff;
        audioSubtitlesDisabledButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(audioSubtitlesDisabledButton.width, audioSubtitlesDisabledButton.height), new THREE.MeshBasicMaterial({visible: false}));
        audioSubtitlesDisabledButton.onexecute =  function(){ console.log("Open AST submenu") };
        audioSubtitlesDisabledButton.position = new THREE.Vector3((tradmenuDivisions-7)*menuWidth/(tradmenuDivisions*2), 0, 0.01);

        multioptionsmenu.add(audioSubtitlesDisabledButton.create());

        traditionalmenu.add(multioptionsmenu);


//SETTINGS
        var  settingsmenu =  new THREE.Group();
        settingsmenu.name = 'settingsmenu';

        var settingsButton = new InteractiveElementModel();
        settingsButton.width = 2.5;
        settingsButton.height = 2.5;
        settingsButton.name = 'settingsButton';
        settingsButton.type =  'icon';
        settingsButton.value = './img/menu/settings_icon.png';
        settingsButton.color = 0xffffff;
        settingsButton.visible = true;
        settingsButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(settingsButton.width, settingsButton.height), new THREE.MeshBasicMaterial({visible: false}));
        settingsButton.onexecute =  function(){ console.log("Open SETTINGS submenu") };
        settingsButton.position = new THREE.Vector3((tradmenuDivisions-4)*menuWidth/(tradmenuDivisions*2), 0, 0.01);

        settingsmenu.add(settingsButton.create());

        traditionalmenu.add(settingsmenu);

        return traditionalmenu;
    }


/**
* Creates the background of the lowsighted menu with the close and navigation icons.
*
* @param      {string}  name    The menu name
* @return     {mesh}   { returns the background menu mesh }
*/
    function createLSMenuBaseViewStructure (name)
    {
        var material = new THREE.MeshBasicMaterial( { color: 0x000000, transparent: true, opacity: 1 } );
        var geometry = new THREE.PlaneGeometry( menuWidth, menuHeight ); 
        var menu = new THREE.Mesh( geometry, material );
        menu.position.set( 0, 0, -69 );
        menu.name = name;

        var previewMenuButton = new InteractiveElementModel();
        previewMenuButton.width = 8;
        previewMenuButton.height = 8;
        previewMenuButton.name = 'previewMenuButton';
        previewMenuButton.type=  'icon';
        previewMenuButton.value = './img/menu/preview.png';
        previewMenuButton.color = 0xffffff;
        previewMenuButton.visible = true;
        previewMenuButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(previewMenuButton.width, previewMenuButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        previewMenuButton.onexecute =  function(){ console.log('Preview menu button clicked') };
        previewMenuButton.position = new THREE.Vector3(-57, 30, 0.01);

        menu.add(previewMenuButton.create());

        // Create the closeMenuButton by loading a new InteractiveElement model and ijecting the closeMenuButtonData
        var closeMenuButton = new InteractiveElementModel();
        closeMenuButton.width = 10;
        closeMenuButton.height = 10;
        closeMenuButton.rotation = Math.PI/4;
        closeMenuButton.name = 'closeMenuButton';
        closeMenuButton.type=  'icon';
        closeMenuButton.value = './img/menu/plus_icon.png';
        closeMenuButton.color = 0xffffff;
        closeMenuButton.visible = true;
        closeMenuButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(closeMenuButton.width, closeMenuButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        closeMenuButton.onexecute =  function(){ console.log('Close menu button clicked') };
        closeMenuButton.position = new THREE.Vector3(57, 30, 0.01);

        menu.add(closeMenuButton.create());

        // Create the forwardMenuButton by loading a new InteractiveElement model and ijecting the forwardMenuButtonData
        var forwardMenuButton = new InteractiveElementModel();
        forwardMenuButton.width = 8.4;
        forwardMenuButton.height = 8.4;
        forwardMenuButton.rotation = Math.PI;
        forwardMenuButton.name = 'forwardMenuButton';
        forwardMenuButton.type =  'icon';
        forwardMenuButton.value = './img/menu/less_than_icon.png';
        forwardMenuButton.color = 0xffffff;
        forwardMenuButton.visible = true;
        forwardMenuButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(forwardMenuButton.width, forwardMenuButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        forwardMenuButton.onexecute =  function(){ console.log("This is the forward menu button"); };
        forwardMenuButton.position = new THREE.Vector3(57, -30, 0.01);

        menu.add(forwardMenuButton.create());

        // Create the backMenuButton by loading a new InteractiveElement model and ijecting the backMenuButtonData
        var backMenuButton = new InteractiveElementModel();
        backMenuButton.width = 8.4;
        backMenuButton.height = 8.4;
        backMenuButton.name = 'backMenuButton';
        backMenuButton.type =  'icon';
        backMenuButton.value = './img/menu/less_than_icon.png';
        backMenuButton.color = 0xffffff;
        backMenuButton.visible = true;
        backMenuButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(backMenuButton.width, backMenuButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        backMenuButton.onexecute =  function(){ console.log("This is the back menu button"); };
        backMenuButton.position = new THREE.Vector3(-57, -30, 0.01);

        menu.add(backMenuButton.create());

        return menu;
    }

/**
 * Creates the PLAY/PAUSE low sighted menu structure.
 *
 * @return     {mesh}  { the play/pause menu mesh }
 */
    function createPlayPauseLSMenuViewStructure(name)
    {
        var playpausemenu = createLSMenuBaseViewStructure(name);

        // Create the seekBackButton by loading a new InteractiveElement model and ijecting the seekBackButtonData
        var seekBackButton = new InteractiveElementModel();

        seekBackButton.width = 30;
        seekBackButton.height = 15;
        seekBackButton.name =  'backSeekButton';
        seekBackButton.type =  'icon';
        seekBackButton.value = './img/menu/seek_icon.png';
        seekBackButton.color = 0xffffff;
        seekBackButton.visible = true;
        seekBackButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(seekBackButton.width, seekBackButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        seekBackButton.onexecute =  function(){ console.log("This is a seek back button"); }
        seekBackButton.position = new THREE.Vector3(-45, 0, 0.01);
        
        playpausemenu.add(seekBackButton.create());

        // Create the playbutton by loading a new InteractiveElement model and ijecting the playButtonData
        var playButton = new InteractiveElementModel();
        playButton.width = 50;
        playButton.height = 50;
        playButton.name =  'playButton';
        playButton.type =  'icon';
        playButton.value = './img/menu/play_icon.png';
        playButton.color = 0xffffff;
        playButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(playButton.width, playButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        playButton.onexecute =  function(){ console.log("This is the play button"); }
        playButton.position = new THREE.Vector3(0, 0, 0.01);
        
        playpausemenu.add(playButton.create());

        // Create the pauseButton by loading a new InteractiveElement model and ijecting the pauseButtonData
        var pauseButton = new InteractiveElementModel();
        pauseButton.width = 50;
        pauseButton.height = 50;
        pauseButton.name =  'pauseButton';
        pauseButton.type =  'icon';
        pauseButton.value = './img/menu/pause_icon.png';
        pauseButton.color = 0xffffff;
        pauseButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(pauseButton.width, pauseButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        pauseButton.onexecute =  function(){ console.log("This is the pause button"); }
        pauseButton.position = new THREE.Vector3(0, 0, 0.01);
        
        playpausemenu.add(pauseButton.create());

        var playouttime = new InteractiveElementModel();
        playouttime.width = 50;
        playouttime.height = 50;
        playouttime.name = 'playOutTime';
        playouttime.type =  'text';
        playouttime.value = '00:00';
        playouttime.color = 0xffffff;
        playouttime.textSize =  15;
        playouttime.position = new THREE.Vector3(0, 0, 0.01);
        
        playpausemenu.add(playouttime.create());

        // Create the seekForwardButton by loading a new InteractiveElement model and ijecting the seekForwardButtonData
        var seekForwardButton = new InteractiveElementModel();
        seekForwardButton.width = 30;
        seekForwardButton.height = 15;
        seekForwardButton.rotation = Math.PI;
        seekForwardButton.name =  'forwardSeekButton';
        seekForwardButton.type =  'icon';
        seekForwardButton.value = './img/menu/seek_icon.png';
        seekForwardButton.color = 0xffffff;
        seekForwardButton.visible = true;
        seekForwardButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(seekForwardButton.width, seekForwardButton.height), new THREE.MeshBasicMaterial({visible: false}));
        seekForwardButton.onexecute =  function(){ console.log("This is a seek forward button"); }
        seekForwardButton.position = new THREE.Vector3(45, 0, 0.01);
        
        playpausemenu.add(seekForwardButton.create());

        if (_isHMD) playpausemenu.scale.set( 0.6, 0.6, 0.6 );

        return playpausemenu;
    }

/**
 * Creates the VOLUME low sighted menu structure.
 *
 * @return     {mesh}  { the volume menu mesh }
 */
    function createVolumeLSMenuViewStructure(name)
    {
        var volumemenu = createLSMenuBaseViewStructure(name);

        // Create the minusVolumeButton by loading a new InteractiveElement model and ijecting the minusVolumeButtonData
        var minusVolumeButton = new InteractiveElementModel();
        minusVolumeButton.width = 22.5;
        minusVolumeButton.height = 22.5;
        minusVolumeButton.name = 'minusVolumeButton';
        minusVolumeButton.type =  'icon';
        minusVolumeButton.value = './img/menu/minus_icon.png';
        minusVolumeButton.color = 0xffffff;
        minusVolumeButton.visible = true;
        minusVolumeButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(minusVolumeButton.width, minusVolumeButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        minusVolumeButton.onexecute =  function(){ console.log("This is the minus volume button"); };
        minusVolumeButton.position = new THREE.Vector3(-45, 0, 0.01);

        volumemenu.add(minusVolumeButton.create());

        // Create the playbutton by loading a new InteractiveElement model and ijecting the playButtonData
        var plusVolumeButton = new InteractiveElementModel();
        plusVolumeButton.width = 22.5;
        plusVolumeButton.height = 22.5;
        plusVolumeButton.name = 'plusVolumeButton';
        plusVolumeButton.type =  'icon';
        plusVolumeButton.value = './img/menu/plus_icon.png';
        plusVolumeButton.color = 0xffffff;
        plusVolumeButton.visible = true;
        plusVolumeButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(plusVolumeButton.width, plusVolumeButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        plusVolumeButton.onexecute =  function(){ console.log("This is the plus volume button"); };
        plusVolumeButton.position = new THREE.Vector3(45, 0, 0.01);

        volumemenu.add(plusVolumeButton.create());

        // Create the pauseButton by loading a new InteractiveElement model and ijecting the pauseButtonData
        var unmuteVolumeButton = new InteractiveElementModel();
        unmuteVolumeButton.width = 50;
        unmuteVolumeButton.height = 50;
        unmuteVolumeButton.name = 'unmuteVolumeButton';
        unmuteVolumeButton.type =  'icon';
        unmuteVolumeButton.value = './img/menu/volume_unmute_icon.png';
        unmuteVolumeButton.color = 0xffffff;
        unmuteVolumeButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(unmuteVolumeButton.width, unmuteVolumeButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        unmuteVolumeButton.onexecute =  function(){ console.log("This is the unmute volume button"); };
        unmuteVolumeButton.position = new THREE.Vector3(0, 0, 0.01);

        volumemenu.add(unmuteVolumeButton.create());

        // Create the plusVolumeButton by loading a new InteractiveElement model and ijecting the plusVolumeButtonData
        var muteVolumeButton = new InteractiveElementModel();
        muteVolumeButton.width = 50;
        muteVolumeButton.height = 50;
        muteVolumeButton.name = 'muteVolumeButton';
        muteVolumeButton.type =  'icon';
        muteVolumeButton.value = './img/menu/volume_mute_icon.png';
        muteVolumeButton.color = 0xffffff;
        muteVolumeButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(muteVolumeButton.width, muteVolumeButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        muteVolumeButton.onexecute =  function(){ console.log("This is the mute volume button"); };
        muteVolumeButton.position = new THREE.Vector3(0, 0, 0.01);

        volumemenu.add(muteVolumeButton.create());

        var volumeLevel = new InteractiveElementModel();
        volumeLevel.width = 35;
        volumeLevel.height = 35;
        volumeLevel.name = 'volumeLevel';
        volumeLevel.type =  'text';
        volumeLevel.value = '';
        volumeLevel.color = 0xffffff;
        volumeLevel.textSize =  18;
        volumeLevel.position = new THREE.Vector3(0, 0, 0.01);

        volumemenu.add(volumeLevel.create());

        if (_isHMD) volumemenu.scale.set( 0.6, 0.6, 0.6 );
        
        return volumemenu;
    }

/**
 * Creates the SETTINGS low sighted menu structure.
 *
 * @return     {mesh}  { the settings menu mesh }
 */
    function createSettingsLSMenuViewStructure(name)
    {
        var settingsmenu = createLSMenuBaseViewStructure(name);

        var settingsButton = new InteractiveElementModel();
        settingsButton.width = 45;
        settingsButton.height = 45;
        settingsButton.name = 'settingsButton';
        settingsButton.type =  'icon';
        settingsButton.value = './img/menu/settings_icon.png';
        settingsButton.color = 0xffffff;
        settingsButton.visible = true;
        settingsButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(settingsButton.width, settingsButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        settingsButton.onexecute =  function(){ Load(SettingsOptionCtrl) };
        settingsButton.position = new THREE.Vector3(-30, 0, 0.01);

        settingsmenu.add(settingsButton.create());

        // Create the playbutton by loading a new InteractiveElement model and ijecting the playButtonData
        var cardboardButton = new InteractiveElementModel();
        cardboardButton.width = 45;
        cardboardButton.height = 28;
        cardboardButton.name = 'cardboardButton';
        cardboardButton.type =  'icon';
        cardboardButton.value = './img/menu/cardboard_icon.png';
        cardboardButton.color = 0xffffff;
        cardboardButton.visible = false;
        cardboardButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(cardboardButton.width, cardboardButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        cardboardButton.onexecute =  function(){ console.log("This is the cardboard button"); };
        cardboardButton.position = new THREE.Vector3(30, 0, 0.01);

        settingsmenu.add(cardboardButton.create());

        if (_isHMD) settingsmenu.scale.set( 0.6, 0.6, 0.6 );

        return settingsmenu;
    }

/**
 * Creates the MULTI OPTIONS low sighted menu structure.
 *
 * @return     {mesh}  { the multi options menu mesh }
 */
    function createMultiOptionsLSMenuViewStructure(name)
    {
        var multioptionsmenu = createLSMenuBaseViewStructure(name);

// SUBTITLES
        var subtitlesButton = new InteractiveElementModel();
        subtitlesButton.width = 30;
        subtitlesButton.height = 30;
        subtitlesButton.name = 'showSubtitlesMenuButton';
        subtitlesButton.type =  'icon';
        subtitlesButton.value = MenuDictionary.translate('ST');
        subtitlesButton.color = 0xffffff;
        subtitlesButton.textSize =  12;
        subtitlesButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(subtitlesButton.width, subtitlesButton.height), new THREE.MeshBasicMaterial({visible: false}));
        subtitlesButton.onexecute =  function(){ Load(STOptionCtrl) };
        subtitlesButton.position = new THREE.Vector3(-3*menuWidth/8, 0, 0.01);

        multioptionsmenu.add(subtitlesButton.create());

// SUBTITLES DISABLED
        var subtitlesDisabledButton = new InteractiveElementModel();
        subtitlesDisabledButton.width = 30;
        subtitlesDisabledButton.height = 30;
        subtitlesDisabledButton.name = 'disabledSubtitlesMenuButton';
        subtitlesDisabledButton.type =  'icon';
        subtitlesDisabledButton.value = MenuDictionary.translate('ST_strike');
        subtitlesDisabledButton.color = 0xffffff;
        subtitlesDisabledButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(subtitlesDisabledButton.width, subtitlesDisabledButton.height), new THREE.MeshBasicMaterial({visible: false}));
        subtitlesDisabledButton.onexecute =  function(){ Load(STOptionCtrl) };
        subtitlesDisabledButton.position = new THREE.Vector3(-3*menuWidth/8, 0, 0.01);

        multioptionsmenu.add(subtitlesDisabledButton.create());

//SIGN LANGUAGE
        var signLanguageButton = new InteractiveElementModel();
        signLanguageButton.width = 30;
        signLanguageButton.height = 30;
        signLanguageButton.name = 'showSignLanguageMenuButton';
        signLanguageButton.type =  'icon';
        signLanguageButton.value = MenuDictionary.translate('SL');
        signLanguageButton.color = 0xffffff;
        signLanguageButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(signLanguageButton.width, signLanguageButton.height), new THREE.MeshBasicMaterial({visible: false}));
        signLanguageButton.onexecute =  function(){ Load(SLOptionCtrl) };
        signLanguageButton.position = new THREE.Vector3(-1*menuWidth/8, 0, 0.01);

        multioptionsmenu.add(signLanguageButton.create());

//SIGN LANGUAGE DISABLED
        var signLanguageDisabledButton = new InteractiveElementModel();
        signLanguageDisabledButton.width = 30;
        signLanguageDisabledButton.height = 30;
        signLanguageDisabledButton.name = 'disabledSignLanguageMenuButton';
        signLanguageDisabledButton.type =  'icon';
        signLanguageDisabledButton.value = MenuDictionary.translate('SL_strike');
        signLanguageDisabledButton.color = 0xffffff;
        signLanguageDisabledButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(signLanguageDisabledButton.width, signLanguageDisabledButton.height), new THREE.MeshBasicMaterial({visible: false}));
        signLanguageDisabledButton.onexecute =  function(){ Load(SLOptionCtrl) };
        signLanguageDisabledButton.position = new THREE.Vector3(-1*menuWidth/8, 0, 0.01);

        multioptionsmenu.add(signLanguageDisabledButton.create());

//AUDIO DESCRIPTION
        var audioDescriptionButton = new InteractiveElementModel();
        audioDescriptionButton.width = 30;
        audioDescriptionButton.height = 30;
        audioDescriptionButton.name = 'showAudioDescriptionMenuButton';
        audioDescriptionButton.type =  'icon';
        audioDescriptionButton.value = MenuDictionary.translate('AD');
        audioDescriptionButton.color = 0xffffff;
        audioDescriptionButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(audioDescriptionButton.width, audioDescriptionButton.height), new THREE.MeshBasicMaterial({visible: false}));
        audioDescriptionButton.onexecute =  function(){ Load(ADOptionCtrl) };
        audioDescriptionButton.position = new THREE.Vector3(1*menuWidth/8, 0, 0.01);

        multioptionsmenu.add(audioDescriptionButton.create());

//AUDIO DESCRIPTION DISABLED
        var audioDescriptionDisabledButton = new InteractiveElementModel();
        audioDescriptionDisabledButton.width = 30;
        audioDescriptionDisabledButton.height = 30;
        audioDescriptionDisabledButton.name = 'disabledAudioDescriptionMenuButton';
        audioDescriptionDisabledButton.type =  'icon';
        audioDescriptionDisabledButton.value = MenuDictionary.translate('AD_strike');
        audioDescriptionDisabledButton.color = 0xffffff;
        audioDescriptionDisabledButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(audioDescriptionDisabledButton.width, audioDescriptionDisabledButton.height), new THREE.MeshBasicMaterial({visible: false}));
        audioDescriptionDisabledButton.onexecute =  function(){ Load(ADOptionCtrl) };
        audioDescriptionDisabledButton.position = new THREE.Vector3(1*menuWidth/8, 0, 0.01);

        multioptionsmenu.add(audioDescriptionDisabledButton.create());

//AUDIO SUBTITLES
        var audioSubtitlesButton = new InteractiveElementModel();
        audioSubtitlesButton.width = 30;
        audioSubtitlesButton.height = 30;
        audioSubtitlesButton.name = 'showAudioSubtitlesMenuButton';
        audioSubtitlesButton.type =  'icon';
        audioSubtitlesButton.value = MenuDictionary.translate('AST');
        audioSubtitlesButton.color = 0xffffff;
        audioSubtitlesButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(audioSubtitlesButton.width, audioSubtitlesButton.height), new THREE.MeshBasicMaterial({visible: false}));
        audioSubtitlesButton.onexecute =  function(){ Load(ASTOptionCtrl) };
        audioSubtitlesButton.position = new THREE.Vector3(3*menuWidth/8, 0, 0.01);

        multioptionsmenu.add(audioSubtitlesButton.create());

//AUDIO SUBTITLES DISABLED
        var audioSubtitlesDisabledButton = new InteractiveElementModel();
        audioSubtitlesDisabledButton.width = 30;
        audioSubtitlesDisabledButton.height = 30;
        audioSubtitlesDisabledButton.name = 'disabledAudioSubtitlesMenuButton';
        audioSubtitlesDisabledButton.type =  'icon';
        audioSubtitlesDisabledButton.value = MenuDictionary.translate('AST_strike');
        audioSubtitlesDisabledButton.color = 0xffffff;
        audioSubtitlesDisabledButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(audioSubtitlesDisabledButton.width, audioSubtitlesDisabledButton.height), new THREE.MeshBasicMaterial({visible: false}));
        audioSubtitlesDisabledButton.onexecute =  function(){ Load(ASTOptionCtrl) };
        audioSubtitlesDisabledButton.position = new THREE.Vector3(3*menuWidth/8, 0, 0.01);

        multioptionsmenu.add(audioSubtitlesDisabledButton.create());

        if (_isHMD) multioptionsmenu.scale.set( 0.6, 0.6, 0.6 );

        return multioptionsmenu;

    }

    function createOptionLSMenuViewStructure(name)
    {
        var lowsightedoptmenu = createLSMenuBaseViewStructure(name);

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

// LS OPTION ENABLED
        var lsOptEnabledLabel = new InteractiveElementModel();
        lsOptEnabledLabel.width = 30;
        lsOptEnabledLabel.height = 30;
        lsOptEnabledLabel.name = 'lsOptEnabledLabel';
        lsOptEnabledLabel.type =  'icon';
        lsOptEnabledLabel.color = 0xffffff;
        lsOptEnabledLabel.position = new THREE.Vector3(-menuWidth/3, 0, 0.01);

        lowsightedoptmenu.add(lsOptEnabledLabel.create());

// LS OPTION DISABLED
        var lsOptDisabledLabel = new InteractiveElementModel();
        lsOptDisabledLabel.width = 30;
        lsOptDisabledLabel.height = 30;
        lsOptDisabledLabel.name = 'lsOptDisabledLabel';
        lsOptDisabledLabel.type =  'icon';
        lsOptDisabledLabel.color = 0xffffff;
        lsOptDisabledLabel.position = new THREE.Vector3(-menuWidth/3, 0, 0.01);

        lowsightedoptmenu.add(lsOptDisabledLabel.create());

        var onLSOptButton = new InteractiveElementModel();
        onLSOptButton.width = 22.5;
        onLSOptButton.height = 12.6;
        onLSOptButton.name = 'onlsoptbutton';
        onLSOptButton.type =  'icon';
        onLSOptButton.value = './img/menu/toggle_on.png';
        onLSOptButton.color = 0xffffff;
        onLSOptButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(onLSOptButton.width, onLSOptButton.height), new THREE.MeshBasicMaterial({visible: false}));
        onLSOptButton.position = new THREE.Vector3(-menuWidth/3, 3*menuHeight/8, 0.01);

        lowsightedoptmenu.add(onLSOptButton.create());

        var offLSOptButton = new InteractiveElementModel();
        offLSOptButton.width = 22.5;
        offLSOptButton.height = 12.6;
        offLSOptButton.name = 'offlsoptbutton';
        offLSOptButton.type =  'icon';
        offLSOptButton.value = './img/menu/toggle_off.png';
        offLSOptButton.color = 0xffffff;
        offLSOptButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(offLSOptButton.width, offLSOptButton.height), new THREE.MeshBasicMaterial({visible: false}));
        offLSOptButton.position = new THREE.Vector3(-menuWidth/3, 3*menuHeight/8, 0.01);

        lowsightedoptmenu.add(offLSOptButton.create());

        var upDropdownButton = new InteractiveElementModel();
        upDropdownButton.width = 4;
        upDropdownButton.height = 12;
        upDropdownButton.rotation = -Math.PI/2;
        upDropdownButton.name = 'upDropdownButton';
        upDropdownButton.type =  'icon';
        upDropdownButton.value = './img/menu/less_than_icon.png';
        upDropdownButton.color = 0xffffff;
        upDropdownButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(menuWidth/3, upDropdownButton.height), new THREE.MeshBasicMaterial({visible: false}));
        upDropdownButton.onexecute =  function(){ console.log("This is the up menu button"); };
        upDropdownButton.position = new THREE.Vector3(0, 6*menuHeight/14, 0.01);

        lowsightedoptmenu.add(upDropdownButton.create());

        var downDropdownButton = new InteractiveElementModel();
        downDropdownButton.width = 4;
        downDropdownButton.height = 12;
        downDropdownButton.rotation = Math.PI/2;
        downDropdownButton.name = 'downDropdownButton';
        downDropdownButton.type =  'icon';
        downDropdownButton.value = './img/menu/less_than_icon.png';
        downDropdownButton.color = 0xffffff;
        downDropdownButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(menuWidth/3, downDropdownButton.height), new THREE.MeshBasicMaterial({visible: false}));
        downDropdownButton.onexecute =  function(){ console.log("This is the down menu button"); };
        downDropdownButton.position = new THREE.Vector3(0, -6*menuHeight/14, 0.01);

        lowsightedoptmenu.add(downDropdownButton.create());

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

}