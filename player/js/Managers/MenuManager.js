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
    let menu;

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

        //Add the menu to the parent element.
        if (_isHMD) {
            console.log("This function is used. But is it vital?");
            traditionalmenu.scale.set( 0.8, 0.8, 0.8 );
        }
        menuParent.add(vwStrucMMngr.TraditionalMenu('traditional-menu'));
        menu = menuParent.getObjectByName('traditional-menu');

        //Depending on the menu type the menu is attached to the menuParent or to the traditional menu
        if(menuMgr.getMenuType() == 2){
            menu.add(vwStrucMMngr.TraditionalOptionMenu('trad-option-menu'));
        } else {
            menuParent.add(vwStrucMMngr.TraditionalOptionMenu('trad-option-menu'));
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
            scene.getObjectByName('pointer').scale.set(1*_pointerSize,1*_pointerSize,1*_pointerSize)
        }

        //playpauseCtrl.playAllFunc();
        mainMenuCtrl.playAllFunc();

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
    this.createMenuActivationElement = function() {
        var geometry = new THREE.SphereGeometry( 99, 32, 16, Math.PI/2, Math.PI * 2,  2.35,  0.4 );
        geometry.scale( - 1, 1, 1 );
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
        }

        menu.visible = true;
    }

/**
 * Opens a preview during 2000ms. This function pauses the video so the user does not loose any content time.
 * The preview consists of a pre visualitzation of the enabled access service users settings.
 *
 * @function      OpenPreview (name)
 */
    this.OpenPreview = function() {
        let isSubmenuOpen = false; //Settings option menu state;
        let autoPause = false; //Has the video been paused due to opening the preview.
        let previewMesh = vwStrucMMngr.Preview('preview'); //Preview structre
        previewCtrl = new PreviewController(); //Preview controller from the model (MVC);

        //Save the settings options menu state (open/close) in isSubmenuOpen variable;
        if(actualCtrl && actualCtrl.getMenuName() === 'trad-option-menu') {
            isSubmenuOpen = true;
        }
        //If the video is already paused, do not apuse it again
        if(!VideoController.isPausedById(demoId)){
            autoPause = true; //The auto pasue in preview state is active.
            VideoController.pauseAll(); //Auto pause the video during the preview.
        }
        //Add the preview element to the camera so the preview is allways centered in the user FoV.
        camera.add(previewMesh);
        //Remove all the menu elements from the camera/scene;
        menuMgr.ResetViews();
        //Start the preview visualitzation.
        previewCtrl.Init();
        //Return to the previous menu state in 2000ms.
        setTimeout(function() {
            //Close the preview.
            previewCtrl.Exit();
            //Only play if the auto pause is active. If the video was paused in first state do not play it.
            if(autoPause){
                VideoController.playAll();
            }
            //Start the menu in the first state.
            menuMgr.initFirstMenuState();
            //Open the settings option menu if it was already open before opening the preview.
            if(isSubmenuOpen){
              menuMgr.Load(SettingsOptionCtrl);  
            } 
            //Show subtitles if they where enabled.
            if(scene.getObjectByName("subtitles")){
                scene.getObjectByName("subtitles").visible = subController.getSubtitleEnabled();
            }
            //Show signer if it was enabled.
            if(scene.getObjectByName("sign")) {
                scene.getObjectByName("sign").visible = subController.getSignerEnabled();
            }
        },3000);
    }


/**
 * Removes a menu from parent.
 */
    this.removeMenuFromParent = function() {
        menuParent.remove(scene.getObjectByName('traditional-menu'));
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
        object.position.x = 0;
        object.position.z = 0;
        object.rotation.y = camera.rotation.y;

        object.position.x = Math.sin(-camera.rotation.y)*67;
        object.position.z = -Math.cos(camera.rotation.y)*67;
    }
}
