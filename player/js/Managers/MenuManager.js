/**
 * { function_description }
 *
 * @class      MenuManager (name)
 * @return     {string}  { description_of_the_return_value }
 */
function MenuManager() {

    let MENU_TYPE = localStorage.ImAc_menuType == "LS_area" ? 1 : 2;

    let controllers = [];
    let actualCtrl;
    let menuActivationElement;

    let optActiveIndex;

/**
 * { function_description }
 *
 * @class      Init (name)
 * @param      {<type>}  type    The type
 */
    this.Init = function(type){

        menuWidth = 80;
        menuHeight = menuWidth/4;

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

            //DEPRECATED
            /*case STOptionCtrl.getMenuName():
            case SLOptionCtrl.getMenuName():
            case ADOptionCtrl.getMenuName():
            case ASTOptionCtrl.getMenuName():
                return menuMgr.Load(multiOptionsCtrl)*/

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
 * @param      {<type>}  type  The new menu type
 */
    this.setMenuType = function(type)
    {
        MENU_TYPE = type;
    }

/**
 * Gets the menu type.
 *
 * @return     {<type>}  The menu type.
 */
    this.getMenuType = function()
    {
        return MENU_TYPE;
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
            switch(MENU_TYPE)
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

        if ( scene.getObjectByName( "pointer2" ) && _isHMD )
        {
            scene.getObjectByName( "pointer2" ).visible = false;
        }

        else if ( scene.getObjectByName( "pointer" ) && _isHMD )
        {
            scene.getObjectByName( "pointer" ).visible = false;
            if ( MENU_TYPE == 2 ) scene.getObjectByName('pointer').scale.set(1*_pointerSize,1*_pointerSize,1*_pointerSize)
            else  scene.getObjectByName('pointer').scale.set(3*_pointerSize,3*_pointerSize,3*_pointerSize)
        }

        playpauseCtrl.playAllFunc();

        //TRADITIONAL
        if(menuParent.getObjectByName('traditionalmenu')) menuParent.getObjectByName('traditionalmenu').visible = false;

        if(menuActivationElement) menuActivationElement.visible = true;
    }

/**
 * Creates a menu activation element.
 */
    this.createMenuActivationElement = function(){
        var geometry = new THREE.SphereGeometry( 99, 32, 16, Math.PI/2, Math.PI * 2,  2.35,  0.4 );
        geometry.scale( - 1, 1, 1 );
        var material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.FrontSide, transparent: true, opacity:0} );
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

        switch(MENU_TYPE)
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

                //DEPRECATED
                /*STOptionCtrl.Exit();
                SLOptionCtrl.Exit();
                ADOptionCtrl.Exit();
                ASTOptionCtrl.Exit();*/
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

        menuParent.add(vwStrucMMngr.Preview('preview'));
        previewCtrl = new PreviewController(MENU_TYPE);

        controllers.forEach(function(controller){
            controller.Exit();
        });
        previewCtrl.Init();
        setTimeout(function()
        {
            previewCtrl.Exit();
            actualCtrl.Init();
            if(scene.getObjectByName("sign")) scene.getObjectByName("sign").visible = subController.getSignerEnabled();
            //if(scene.getObjectByName("radarIndicartor")) scene.getObjectByName("radarIndicartor").visible = (subController.getSignerIndicator() == 'radar');
            //if(scene.getObjectByName("subtitles")) scene.getObjectByName("subtitles").visible = subController.getSignerEnabled();
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
        switch(MENU_TYPE)
        {
            case 1: // LOW SIGHTED
            default:
            {
                menuParent.add(vwStrucMMngr.PlayPauseLowSightedMenu('playpausemenu'));
                menuParent.add(vwStrucMMngr.VolumeLowSightedMenu('volumemenu'));
                menuParent.add(vwStrucMMngr.SettingsLowSightedMenu('settingsmenu'));
                menuParent.add(vwStrucMMngr.MultiOptionsLowSightedMenu('multioptionsmenu'));
                menuParent.add(vwStrucMMngr.OptionLowSightedMenu('lowsightedoptmenu'));
                menuParent.add(vwStrucMMngr.OptionLowSightedMenu('settingsoptmenu'));
                break;
            };
            case 2: // TRADITIONAL
            {
                var traditionalmenu = vwStrucMMngr.TraditionalMenu('traditionalmenu');

                if (_isHMD) traditionalmenu.scale.set( 0.8, 0.8, 0.8 );
                menuParent.add(traditionalmenu);
                traditionalmenu.add(vwStrucMMngr.TraditionalOptionMenu('tradoptionmenu'));
                break;
            };
        }
    }

/**
 * Removes a menu from parent.
 */
    this.removeMenuFromParent = function()
    {
        switch(MENU_TYPE)
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

        playpauseCtrl = new PlayPauseMenuController();
        controllers.push(playpauseCtrl);

        volumeCtrl = new VolumeLSMenuController();
        controllers.push(volumeCtrl);

        settingsCtrl = new SettingsLSMenuController(MENU_TYPE);
        controllers.push(settingsCtrl);

        multiOptionsCtrl = new AccessibilityOptionsMenuController(MENU_TYPE);
        controllers.push(multiOptionsCtrl);

        //DEPRECATED
        /*STOptionCtrl = new STOptionMenuController(MENU_TYPE);
        controllers.push(STOptionCtrl);

        SLOptionCtrl = new SLOptionMenuController(MENU_TYPE);
        controllers.push(SLOptionCtrl);

        ADOptionCtrl = new ADOptionMenuController(MENU_TYPE);
        controllers.push(ADOptionCtrl);

        ASTOptionCtrl = new ASTOptionMenuController(MENU_TYPE);
        controllers.push(ASTOptionCtrl);*/

        SettingsOptionCtrl = new SettingsOptionMenuController(MENU_TYPE);
        controllers.push(SettingsOptionCtrl);

        if(MENU_TYPE == 2)
        {
            vpbCtrl = new VideoProgressBarController();
            controllers.push(vpbCtrl);
        }

        controllers.forEach(function(controller){
            controller.Init();
        });
    }

/**
 * Adds interactivity to menu elements.
 *
 * @class      AddInteractivityToMenuElements (name)
 */
  this.AddInteractionIfVisible = function(viewStructure){
    viewStructure.children.forEach(function(intrElement){
      if(intrElement.visible) interController.addInteractiveObject(intrElement);
      else interController.removeInteractiveObject(intrElement.name)
    });
  };
}
