/**
 * { function_description }
 *
 * @class      MenuManager (name)
 * @return     {string}  { description_of_the_return_value }
 */
function MenuManager() {

    let menuType;
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
    this.Init = function(type) {

        menuMgr.setMenuType(type);

        //The size depends on the menu type.
        menuWidth = (menuType == 2) ? 70 : 130;
        menuHeight = menuWidth/4;
        
        menuParent = _isHMD ? scene : camera;

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
    this.NavigateForwardMenu = function() {
        switch(actualCtrl.getMenuName()){
            case playpauseCtrl.getMenuName():
                return menuMgr.Load(volumeCtrl);
            case volumeCtrl.getMenuName():
                return menuMgr.Load(multiOptionsCtrl);
            case multiOptionsCtrl.getMenuName():
                return menuMgr.Load(settingsCtrl);
            case settingsCtrl.getMenuName():
                return menuMgr.Load(playpauseCtrl);
        }
    }

/**
 * { function_description }
 *
 * @class      NavigateBackMenu (name)
 * @return     {<type>}  { description_of_the_return_value }
 */
    this.NavigateBackMenu = function() {
        switch(actualCtrl.getMenuName()){
            case playpauseCtrl.getMenuName():
                return menuMgr.Load(settingsCtrl);
            case volumeCtrl.getMenuName():
                return menuMgr.Load(playpauseCtrl)
            case multiOptionsCtrl.getMenuName():
                return menuMgr.Load(volumeCtrl);
            case settingsCtrl.getMenuName():
                return menuMgr.Load(multiOptionsCtrl)
            case SettingsOptionCtrl.getMenuName():
                return menuMgr.Load(settingsCtrl);
        }
    }

/**
 * Sets the option active index.
 *
 * @param      {<type>}  newIndex  The new index
 */
    this.setOptActiveIndex = function(newIndex) {
        optActiveIndex = newIndex;
    }

/**
 * Sets the actual control.
 *
 * @param      {<type>}  newCtrl  The new control
 */
    this.setActualCtrl = function(newCtrl) {
        actualCtrl = newCtrl;
    }

/**
 * Gets the actual control.
 *
 * @return     {<type>}  The actual control.
 */
    this.getActualCtrl = function() {
        return actualCtrl;
    }

    this.setMenuType = function(type){
        menuType = type;
    }

    this.getMenuType = function(){
        return menuType;
    }

/**
 * { function_description }
 *
 * @class      Load (name)
 * @param      {<type>}  controller  The controller
 */
    this.Load = function (controller) {
        if(actualCtrl){
            actualCtrl.Exit();
            // Compare the saved index of the traditional option dropdown with the new controller index.
            // If the index is deferent change the variable and initialize the doprdown
            if(optActiveIndex != controller.getMenuIndex()){
                controller.Init();
                optActiveIndex = controller.getMenuIndex();
            } else{
                // If the index is equal change the variable to 'undefined' in order to open the same dropdown just closed.
                optActiveIndex = 0;
            }
            
        } else{
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
    this.ResetViews = function() {
        actualCtrl = '';
        optActiveIndex = 0;

        controllers.forEach(function(controller){
            controller.Exit();
        });

        if ( scene.getObjectByName( "pointer2" ) && _isHMD ){
            scene.getObjectByName( "pointer2" ).visible = false;
        } else if ( scene.getObjectByName( "pointer" ) && _isHMD ) {
            scene.getObjectByName( "pointer" ).visible = false;
            scene.getObjectByName('pointer').scale.set(1*_pointerSize,1*_pointerSize,1*_pointerSize)
        }

        playpauseCtrl.playAllFunc();

        if(menuParent.getObjectByName('traditional-menu')) {
            menuParent.getObjectByName('traditional-menu').visible = false;
        }

        if(menuActivationElement){ 
            menuActivationElement.visible = true;
        }
    }

/**
 * Creates a menu activation element.
 */
    this.createMenuActivationElement = function() {
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
    this.initFirstMenuState = function() {
        menuActivationElement.visible = false;
        scene.getObjectByName( "openmenutext" ).visible = false;

        if ( scene.getObjectByName('pointer2') && _isHMD ) {
            scene.getObjectByName('pointer2').visible = true;
        } else if ( scene.getObjectByName( "pointer" ) && _isHMD ) {
            scene.getObjectByName( "pointer" ).visible = true;
        }

        controllers.forEach(function(controller){
            controller.Init();
        });
            
        SettingsOptionCtrl.Exit();

        if (_isHMD) {
            resetMenuPosition( menuParent.getObjectByName('traditional-menu') )
        }

        menuParent.getObjectByName('traditional-menu').visible = true;
    }

/**
 * Opens a preview.
 *
 * @function      OpenPreview (name)
 */
    this.OpenPreview = function() {
        let isSubmenuOpen = false;
        if(actualCtrl && actualCtrl.getMenuName() === 'trad-option-menu') {
            isSubmenuOpen = true;
        }
        VideoController.pauseAll();

        let previewMesh = vwStrucMMngr.Preview('preview');
        //previewMesh.position.set( menuX, menuY, -67 ); //TODO
        
        menuParent.add(previewMesh);
        previewCtrl = new PreviewController();

        menuMgr.ResetViews();
        previewCtrl.Init();
        setTimeout(function() {
            previewCtrl.Exit();
            VideoController.playAll();
            menuMgr.initFirstMenuState();
            if(isSubmenuOpen){
              menuMgr.Load(SettingsOptionCtrl);  
            } 
            if(scene.getObjectByName("subtitles")){
                scene.getObjectByName("subtitles").visible = subController.getSubtitleEnabled();
            }

            if(scene.getObjectByName("sign")) {
                scene.getObjectByName("sign").visible = subController.getSignerEnabled();
            }
            
        },2000);
    }

/**
 * { function_description }
 *
 * @param      {<type>}  object  The object
 */
    function resetMenuPosition(object) {
        object.position.x = 0;
        object.position.z = 0;
        object.rotation.y = camera.rotation.y;

        object.position.x = Math.sin(-camera.rotation.y)*67;
        object.position.z = -Math.cos(camera.rotation.y)*67;
    }

/**
 * Adds a menu to parent.
 */
    function addMenuToParent() {
        const traditionalmenu = vwStrucMMngr.TraditionalMenu('traditional-menu');

        if (_isHMD) {
            traditionalmenu.scale.set( 0.8, 0.8, 0.8 );
        }
        menuParent.add(traditionalmenu);

//Depending on the menu type the menu is attached to the menuParent or to the traditional menu
        if(menuMgr.getMenuType()%2 == 0){
            traditionalmenu.add(vwStrucMMngr.TraditionalOptionMenu('trad-option-menu'));
        } else {
            menuParent.add(vwStrucMMngr.TraditionalOptionMenu('trad-option-menu'));
        }
        
    }

/**
 * Removes a menu from parent.
 */
    this.removeMenuFromParent = function() {
        menuParent.remove(scene.getObjectByName('traditional-menu'));
        menuParent.remove(scene.getObjectByName('trad-option-menu'));
    }

/**
 * { function_description }
 *
 * @function      InitAllCtrl (name)
 */
    function InitAllCtrl(){
        controllers = [];

        playpauseCtrl = new PlayPauseMenuController();
        controllers.push(playpauseCtrl);

        volumeCtrl = new VolumeMenuController();
        controllers.push(volumeCtrl);

        settingsCtrl = new SettingsMenuController();
        controllers.push(settingsCtrl);

        multiOptionsCtrl = new AccessibilityOptionsMenuController();
        controllers.push(multiOptionsCtrl);

        SettingsOptionCtrl = new SettingsOptionMenuController();
        controllers.push(SettingsOptionCtrl);

        vpbCtrl = new VideoProgressBarController();
        controllers.push(vpbCtrl);

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
        if(intrElement.visible) {
            interController.addInteractiveObject(intrElement);
        } else {
            interController.removeInteractiveObject(intrElement.name)
        }
    });
  };
}
