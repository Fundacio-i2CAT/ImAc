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

    let isMenuOpen;

/**
 * { function_description }
 *
 * @class      Init (name)
 * @param      {<type>}  type    The type
 */
    this.Init = function(type) {

        menuMgr.setMenuType(type);

        //The size depends on the menu type.
        menuWidth = (menuType == 2) ? 80 : 130;
        menuHeight = menuWidth/4;

        menuParent = _isHMD ? scene : canvas;
        menu = vwStrucMMngr.TraditionalMenu('trad-main-menu');

        if (_isHMD) {
            menu.scale.set( 0.8, 0.8, 0.8 );
        }
        menuParent.add(menu);

        settingsMenu = vwStrucMMngr.TraditionalOptionMenu('trad-option-menu')
        //Depending on the menu type the menu is attached to the menuParent or to the traditional menu
        if(menuMgr.getMenuType() == 2){
            menu.add(settingsMenu);
        } else {
            menuParent.add(settingsMenu);
        }  

        mainMenuCtrl = new MainMenuController();
        controllers.push(mainMenuCtrl);

        SettingsOptionCtrl = new SettingsOptionMenuController();
        controllers.push(SettingsOptionCtrl);

        menuMgr.ResetViews();
    }

    

    /**
     * Sets the option active index.
     *
     * @param      {<Integer>}  newIndex  The new index
     */
    this.setOptActiveIndex = function(newIndex) {
        optActiveIndex = newIndex;
    }

    /**
     * Sets the actual control.
     *
     * @param      {<Object>}  newCtrl  The new control
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

    /**
     * Sets the menu type.
     *
     * @param     {<Integer>}  The menu type (1 for HMD - 2 for PC).
     */
    this.setMenuType = function(type){
        menuType = type;
    }

    /**
     * Gets the menu type.
     *
     * @return     {<Integer>}  The menu type (1 for HMD - 2 for PC).
     */
    this.getMenuType = function(){
        return menuType;
    }


    this.setMenuState = function(state) {
        isMenuOpen = state;
    }

    /**
     * Gets the actual control.
     *
     * @return     {<type>}  The actual control.
     */
    this.getMenuState = function() {
        return isMenuOpen;
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
            // If the index is different change the variable and initialize the doprdown
            if(optActiveIndex != controller.getMenuIndex()){
                controller.Init();
                optActiveIndex = controller.getMenuIndex();
            } else{
                // If the index is equal change the variable to 'undefined' 
                // in order to open the same dropdown just closed.
                optActiveIndex = 0;
            }
            
        } else{
            controller.Init();
            optActiveIndex = controller.getMenuIndex();
        }
        actualCtrl = controller;

        if( scene.getObjectByName( "pointer2" ) && _isHMD ){
            scene.getObjectByName( "pointer2" ).visible = true;
        }else if( scene.getObjectByName( "pointer" ) && _isHMD ) {
            scene.getObjectByName( "pointer" ).visible = true;
            scene.getObjectByName('pointer').scale.set(1*_pointerSize,1*_pointerSize,1*_pointerSize)
        }
    }

/**
 * Resets the visibility to false in all the low 
 * sighted menus and shows the menu activation area
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
            scene.getObjectByName('pointer').scale.set(1*_pointerSize,1*_pointerSize,1*_pointerSize);
        }

        if(menu) {
            menu.visible = false;
            // If the Enhaced menu is selected on initial settings, 
            // hide menu options which is not attached to the proper menu.
            if(menuMgr.getMenuType() == 1){
                menuParent.getObjectByName('trad-option-menu').visible = false;
            } 
        }

        if(menuActivationElement){ 
            menuActivationElement.visible = true;
        }
    }

/**
 * Creates a menu activation element.
 */
    this.createMenuActivationElement = function(start) {
        var geometry = new THREE.SphereGeometry( 99, 32, 16, Math.PI/2, Math.PI * 2,  2.35,  0.4 );
        //var geometry = new THREE.SphereGeometry( 99, 32, 16, Math.PI/2, Math.PI * 2, start,  0.4 );
        geometry.scale( -1, 1, 1 );
        var material = new THREE.MeshBasicMaterial( {color: 0xc91355, side: THREE.FrontSide, transparent: true, opacity:0} );
        menuActivationElement = new THREE.Mesh( geometry, material );
        menuActivationElement.name = 'openMenu';

        Reticulum.add( menuActivationElement, {
            reticleHoverColor: 0xc91355,
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
        lastUpdate = Date.now();
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
            resetMenuPosition( menu )
            if(menuMgr.getMenuType() == 1) resetMenuPosition( settingsMenu )
        }

        menu.visible = true;
    }

    this.checkMenuStateVisibility = function() { 
        let isSubmenuOpen = false; //Settings option menu state;
         
        if(actualCtrl && actualCtrl.getMenuName() === 'trad-option-menu') {
            isSubmenuOpen = true;
        }

        if(menuMgr.getMenuType() == 2){
            scene.getObjectByName('trad-option-menu').visible = isSubmenuOpen;
            scene.getObjectByName('trad-main-menu').visible = (isSubmenuOpen) ? isSubmenuOpen : menuMgr.getMenuState();

        } else{
            scene.getObjectByName('trad-option-menu').visible = isSubmenuOpen;
            scene.getObjectByName('trad-main-menu').visible = !isSubmenuOpen;
        } 
    }



/**
 * Removes a menu from parent.
 */
    this.removeMenuFromParent = function() {
        menuParent.remove(scene.getObjectByName('trad-main-menu'));
        menuParent.remove(scene.getObjectByName('trad-option-menu'));
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

    /**
 * { function_description }
 *
 * @param      {<type>}  object  The object
 */
    function resetMenuPosition(object) {
        object.rotation.y = camera.rotation.y;
        object.position.x = Math.sin(-camera.rotation.y)*67;
        object.position.z = -Math.cos(camera.rotation.y)*67;
    }
}
