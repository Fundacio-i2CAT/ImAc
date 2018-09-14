function MenuManager2() {


	this.createPlayPauseMenuView = function(){

		var menu =  new THREE.Group();
		menu.name = 'playpausemenu';

        // Create the playbutton by loading a new InteractiveElement model and ijecting the playButtonData
		var playButton = new InteractiveElementModel(new playButtonData());
		playButton.position = new THREE.Vector3(0,0,0);
		menu.add(playButton.create());

        // Create the pauseButton by loading a new InteractiveElement model and ijecting the pauseButtonData
		var pauseButton = new InteractiveElementModel(new pauseButtonData());
		pauseButton.position = new THREE.Vector3(0,0,0);
		menu.add(pauseButton.create());

        // Create the seekBackButton by loading a new InteractiveElement model and ijecting the seekBackButtonData
		var seekBackButton = new InteractiveElementModel(new seekBackButtonData());
		seekBackButton.position = new THREE.Vector3(0,0,0);
		menu.add(seekBackButton.create());

        // Create the seekForwardButton by loading a new InteractiveElement model and ijecting the seekForwardButtonData
		var seekForwardButton = new InteractiveElementModel(new seekForwardButtonData());
		seekForwardButton.position = new THREE.Vector3(0,0,0);
		menu.add(seekForwardButton.create());

		return menu;
	}



	this.createMenu = function(){

		var material = new THREE.MeshBasicMaterial( { color: 0x000000, transparent: true, opacity: 1 } );
        var geometry = new THREE.PlaneGeometry( 125, 125*9/16 ); 
        var mesh = new THREE.Mesh( geometry, material );
        



        var closeButton = getImageMesh( 0, 10, 10, './img/menu/plus_icon.png', name );


		var geometry = new THREE.PlaneGeometry( w, h );
        var loader = new THREE.TextureLoader();
        var texture = loader.load( url );
        texture.minFilter = THREE.LinearFilter;
        texture.format = THREE.RGBAFormat;

        var material = new THREE.MeshBasicMaterial( { map: texture, transparent: true, side: THREE.FrontSide } );
        var mesh = new THREE.Mesh( geometry, material );

        mesh.name = name;
        mesh.renderOrder = order || 0;

        return mesh;




        mesh.position.set( 57, 30, menuElementsZ );
        mesh.rotation.z = Math.PI/4;

        mesh.onexecute = function() {
            if ( interController.getSubtitlesActive() ) subController.enableSubtitles();
            subController.switchSigner( interController.getSignerActive() );
            MenuManager.pressButtonFeedback( name );
            setTimeout(function() {
                MenuManager.closeMenu(); 
                scene.getObjectByName( "openMenu" ).visible = true;
                //scene.getObjectByName( "openMenuTrad" ).visible = true; //EXPERIMENTAL
            }, clickInteractionTimeout);
        };

        menu.add( createCloseButtonMenu( menuList[0].buttons[0] ) );
        menu.add( createNextRButtonMenu( menuList[0].buttons[1] ) );
        menu.add( createNextLButtonMenu( menuList[0].buttons[2] ) );

        menu.name = menuList[0].name; //menuList.backgroudMenu
        menu.position.set( 0, 0, -69 );

        if ( _isHMD )
        {
            menu.scale.set( 0.5, 0.5, 1 );
            scene.add( menu );
        }
        else
        {
            menu.scale.set( 1, 1, 1 );
            camera.add( menu );
        }
	}
}