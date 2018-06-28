/**
 * @author isaac.fraile@i2cat.net
 */
THREE.MenuManager = function () {

    var menuList = 
    [
        { name: 'backgroudMenu', buttons: ['closeMenuButton', 'forwardMenuButton', 'backMenuButton']},          //0
        { name: 'playSeekMenu', buttons: ['playButton', 'pauseButton', 'backSeekButton', 'forwardSeekButton']}, //1
        { name: 'volumeChangeMenu', buttons: ['minusVolumeButton', 'plusVolumeButton']},                        //2
        { name: 'settingsCardboardMenu', buttons: ['settingsButton', 'cardboardButton']}                        //3
    ];

//************************************************************************************
// PUBLIC FUNCTIONS
//************************************************************************************

    this.changeMenuLeftOrRight = function(direction)
    {
        var index = menuList.map(function(e) { return e.name; }).indexOf(interController.getActiveMenuName());
        scene.getObjectByName(interController.getActiveMenuName()).visible = false;

        if(direction)
        {
            interController.setActiveMenuName(menuList[getNextArrayPosition(menuList, index+1)].name);        
        } 
        else
        {
            interController.setActiveMenuName(menuList[getNextArrayPosition(menuList, index-1)].name);  
        } 

        scene.getObjectByName(interController.getActiveMenuName()).visible = true;
    } 

//************************************************************************************
// PUBLIC INTERACTION FUNCTIONS
//************************************************************************************
    
    this.openMenu = function()
    {
        var backgroud = createMenuBackground();
        createPlaySeekMenu(backgroud);
        createVolumeChangeMenu(backgroud);
        createSettingsCardboardMenu(backgroud);

        showPlayPauseButton();
    }

    this.closeMenu = function()
    {
        var menu = scene.getObjectByName("backgroudMenu");
        menu.children.forEach(function(elem){
            removeEntity(elem);
        });
        removeEntity(menu);
        menu.visible = false;
        scene.remove(menu);
    }

    this.playButtonInteraction = function()
    {
        moData.isPausedById(0) ? moData.playAll() : moData.pauseAll();
        showPlayPauseButton();
        interController.removeInteractiveObject(name);
        interController.addInteractiveObject(scene.getObjectByName(menuList[1].buttons[1])); //menuList.playSeekMenu.pauseButton
    }

    this.pauseButtonInteraction = function()
    {
        moData.isPausedById(0) ? moData.playAll() : moData.pauseAll();
        showPlayPauseButton();
        interController.removeInteractiveObject(name);
        interController.addInteractiveObject(scene.getObjectByName(menuList[1].buttons[0])); //menuList.playSeekMenu.playButton
    }

//************************************************************************************
// Private Functions
//************************************************************************************

    function removeEntity (object) 
    {
        object.children.forEach(function(elem1){
            elem1.children.forEach(function(elem2){
                interController.removeInteractiveObject(elem2.name);
            });
        });
    }

    function getNextArrayPosition(array, nextIndex)
    {
        if (nextIndex > array.length - 1)
        {
            return 1;
        }
        else if (nextIndex < 1)
        {
            return array.length-1;
        }
        else
        {
            return nextIndex;
        }
    }  

    function showPlayPauseButton()
    {
        if(moData.isPausedById(0))
        {
            scene.getObjectByName(menuList[1].buttons[0]).visible = true; //menuList.playSeekMenu.playButton
            scene.getObjectByName(menuList[1].buttons[1]).visible = false; //menuList.playSeekMenu.pauseButton
        }
        else
        {
            scene.getObjectByName(menuList[1].buttons[1]).visible = true; //menuList.playSeekMenu.pauseButton
            scene.getObjectByName(menuList[1].buttons[0]).visible = false; //menuList.playSeekMenu.playButton
        }
    }

    function createMenuBackground()
    {
        var menu = getBackgroundMesh(352, 198, 0x000000,1);
        var closeButton = getCloseIconMesh(20,20,0xffffff);
        var nextR = getNextIconMesh(20,20,0xffffff,0);
        var nextL = getNextIconMesh(20,20,0xffffff, Math.PI);

        closeButton.position.y = (menu.geometry.parameters.height/2 - 15);
        closeButton.position.x = (menu.geometry.parameters.width/2 - 15);
        closeButton.scale.set(0.5,0.5,1);

        nextR.position.y = -(menu.geometry.parameters.height/2 - 15);
        nextR.position.x = (menu.geometry.parameters.width/2 - 10);
        nextR.scale.set(0.5,0.5,1);

        nextL.position.y = -(menu.geometry.parameters.height/2 - 15);
        nextL.position.x = -(menu.geometry.parameters.width/2 - 10);
        nextL.scale.set(0.5,0.5,1);

        menu.add(closeButton);
        menu.add(nextR);
        menu.add(nextL);

        menu.name = menuList[0].name; // menuList.backgroudMenu

        return menu
    }

    function createPlaySeekMenu(menu)
    {
        var playSeekGroup =  new THREE.Group();
        var pausebutton = getPauseMesh(140, 140, 0xffffff);
        var playbutton = getPlayMesh(140, 140, 0xffffff);
        playbutton.visible = false;
        var seekBarR = getSeekMesh( 80, 40, 0xffffff, 0);
        var seekBarL = getSeekMesh( 80, 40, 0xffffff, Math.PI);

        seekBarR.position.x = 120;
        seekBarL.position.x = -120;

        playSeekGroup.add( playbutton );
        playSeekGroup.add( pausebutton );
        playSeekGroup.add( seekBarR );
        playSeekGroup.add( seekBarL );

        playSeekGroup.name = menuList[1].name; //menuList.playSeekMenu
        menu.add(playSeekGroup);

        menu.scale.set(0.05,0.05,1);
        menu.position.set(0, 0, -10);

        interController.setActiveMenuName(menuList[1].name); //menuList.playSeekMenu

        scene.add(menu);
    }

    function createVolumeChangeMenu(menu)
    {

        var volumeChangeGroup =  new THREE.Group();

        var plusVolume = getPlusIconMesh( 20, 20, 0xffffff );
        var audioIcon = getImageMesh( new THREE.PlaneGeometry( 150,150 ), './img/menu/audio_volume_icon.png', 'right', 4 );
        var minusVolume = getMinusIconMesh( 20, 20, 0xffffff );

        plusVolume.position.x = 130;
        minusVolume.position.x = -130;
        
        audioIcon.position.z = 1;

        volumeChangeGroup.add( plusVolume );
        volumeChangeGroup.add( audioIcon );
        volumeChangeGroup.add( minusVolume );

        volumeChangeGroup.name = menuList[2].name; // menuList.volumeChangeMenu
        volumeChangeGroup.visible = false;
        menu.add(volumeChangeGroup);

        menu.scale.set(0.05,0.05,1);
        menu.position.set(0, 0, -10);

        scene.add( menu );
    }

    function createSettingsCardboardMenu(menu)
    {
        var settingsCardboardGroup =  new THREE.Group();

        var settingsIcon = getImageMesh( new THREE.PlaneGeometry( 120, 120 ), './img/menu/cog_icon.png', 'right', 4 );
        var cardboardIcon = getImageMesh( new THREE.PlaneGeometry( 120, 80 ), './img/menu/cardboard_icon.png', 'right', 4 );
        
        settingsIcon.name = menuList[3].buttons[0]; // menuList.settingsCardboardMenu.settingsButton;
        cardboardIcon.name = menuList[3].buttons[1]; //menuList.settingsCardboardMenu.cardboadButton;

        cardboardIcon.position.x = 80;
        settingsIcon.position.x = -80;
        
        settingsCardboardGroup.add( cardboardIcon );
        settingsCardboardGroup.add( settingsIcon );

        settingsCardboardGroup.name = menuList[3].name; // menuList.settingsCardboardMenu
        settingsCardboardGroup.visible = false;

        menu.add(settingsCardboardGroup);
        menu.scale.set(0.05,0.05,1);
        menu.position.set(0, 0, -10);

        scene.add( menu );
    } 

//************************************************************************************
// PRIVATE SHAPES
//************************************************************************************
    
    function getImageMesh(geometry, url, name, order) 
    {
        var loader = new THREE.TextureLoader();
        var texture = loader.load( url );
        texture.minFilter = THREE.LinearFilter;
        texture.format = THREE.RGBAFormat;

        var material = new THREE.MeshBasicMaterial( { map: texture, transparent: true, side: THREE.FrontSide } );
        var mesh = new THREE.Mesh( geometry, material );

        mesh.name = name;
        mesh.renderOrder = order || 0;

        return mesh;
    }

//**********************
    function getBackgroundMesh(w, h, c, o)
    {
        var material = new THREE.MeshBasicMaterial( { color: c, transparent: true, opacity: o } );
        var geometry = new THREE.PlaneGeometry( w, h ); 
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.z = -0.1;

        return mesh;
    }

    function getPlayMesh(w, h, c)
    {
        var arrowShape = new THREE.Shape();

        arrowShape.moveTo( -w/2.5, -h/2 );
        arrowShape.quadraticCurveTo ( -w/2.5, -h/2, -w/2.5, h/2 );
        arrowShape.quadraticCurveTo ( -w/2.5, h/2, w/2, 0 );
        arrowShape.quadraticCurveTo ( w/2, 0, -w/2.5, -h/2 );

        var coliderMesh = new THREE.Mesh( new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({visible: false}));
        var geometry = new THREE.ShapeGeometry( arrowShape );
        var material = new THREE.MeshBasicMaterial( { color: c } );
        var mesh = new THREE.Mesh( geometry, material ) ;

        coliderMesh.name = menuList[1].buttons[0]; //menuList.playSeekMenu.playButton
        interController.addInteractiveObject(coliderMesh);
        mesh.add(coliderMesh);
        
        mesh.position.z = 0.01;
        mesh.name = menuList[1].buttons[0]; //menuList.playSeekMenu.playButton
        
        return mesh;
    }

    function getPauseMesh(w, h, c)
    {
        var leftPauseShape = new THREE.Shape();

        leftPauseShape.moveTo( -w/8, -h/2 );
        leftPauseShape.quadraticCurveTo ( -w/8, -h/2, -3*w/8, -h/2 );
        leftPauseShape.quadraticCurveTo ( -3*w/8, -h/2, -3*w/8, h/2 );
        leftPauseShape.quadraticCurveTo ( -3*w/8, h/2, -w/8, h/2 );
        leftPauseShape.quadraticCurveTo ( -w/8, h/2, -w/8, -h/2 );

        var geometry = new THREE.ShapeGeometry( leftPauseShape );
        var material = new THREE.MeshBasicMaterial( { color: c } );
        var meshL = new THREE.Mesh( geometry, material ) ;

        var rightPauseShape = new THREE.Shape();

        rightPauseShape.moveTo( w/8, -h/2 );
        rightPauseShape.quadraticCurveTo ( w/8, -h/2, 3*w/8, -h/2 );
        rightPauseShape.quadraticCurveTo ( 3*w/8, -h/2, 3*w/8, h/2 );
        rightPauseShape.quadraticCurveTo ( 3*w/8, h/2, w/8, h/2 );
        rightPauseShape.quadraticCurveTo ( w/8, h/2, w/8, -h/2 );
        
        var coliderMesh = new THREE.Mesh( new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({visible: false}));
        var geometry = new THREE.ShapeGeometry( rightPauseShape );
        var material = new THREE.MeshBasicMaterial( { color: c } );
        var meshR = new THREE.Mesh( geometry, material ) ;

        coliderMesh.name = menuList[1].buttons[1]; //menuList.playSeekMenu.pauseButton
        interController.addInteractiveObject(coliderMesh);
        coliderMesh.position.z = 0.01;
        meshL.add(meshR);
        meshL.add(coliderMesh);
        meshL.name = menuList[1].buttons[1]; //menuList.playSeekMenu.pauseButton

        meshL.position.z = 0.01;
        
        return meshL;
    }

    function getSeekMesh(w, h, c, r)
    {
        var arrowShape = new THREE.Shape();

        arrowShape.moveTo( -w/2, -h/2 );
        arrowShape.quadraticCurveTo ( -w/2, -h/2, -w/2, h/2 );
        arrowShape.quadraticCurveTo ( -w/2, h/2, 0, 0 );
        arrowShape.quadraticCurveTo ( 0, 0, 0, h/2 );
        arrowShape.quadraticCurveTo ( 0, h/2, w/2, 0 );

        arrowShape.quadraticCurveTo ( w/2, 0, w/2, h/2 );
        arrowShape.quadraticCurveTo ( w/2, h/2, w/1.8, h/2 );
        arrowShape.quadraticCurveTo ( w/1.8, h/2, w/1.8, -h/2 );
        arrowShape.quadraticCurveTo ( w/1.8, -h/2, w/2, -h/2 );
        arrowShape.quadraticCurveTo ( w/2, -h/2, w/2, 0 );

        arrowShape.quadraticCurveTo ( w/2, 0, 0, -h/2 );
        arrowShape.quadraticCurveTo ( 0, -h/2, 0, 0 );
        arrowShape.quadraticCurveTo ( 0, 0, -w/2, -h/2 );

        var coliderMesh = new THREE.Mesh( new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({visible: false}));
        var geometry = new THREE.ShapeGeometry( arrowShape );
        var material = new THREE.MeshBasicMaterial( { color: c } );
        var mesh = new THREE.Mesh( geometry, material ) ;

        mesh.rotation.z = r;
        if(r > 0)
        {
            coliderMesh.name = menuList[1].buttons[2]; //menuList.playSeekMenu.backSeekButton
        }

        else
        {
            coliderMesh.name = menuList[1].buttons[3]; //menuList.playSeekMenu.forwardSeekButton;
        }

        interController.addInteractiveObject(coliderMesh);

        mesh.add(coliderMesh);
        mesh.position.z = 0.01;
        mesh.visible = true;

        return mesh;
    }

    function getSeekBarMesh(w, h, c)
    {
        var roundedRectShape = new THREE.Shape();
        ( function roundedRect( ctx, x, y, width, height, radius ) {
            ctx.moveTo( x, y + radius );
            ctx.lineTo( x, y + height - radius );
            ctx.quadraticCurveTo( x, y + height, x - radius/2, y + height );
            ctx.lineTo( x + width - radius, y + height );
            ctx.quadraticCurveTo( x + width, y + height, x + width, y + height - radius );
            ctx.lineTo( x + width, y + radius );
            ctx.quadraticCurveTo( x + width, y, x + width - radius, y );
            ctx.lineTo( x - radius/2, y );
            ctx.quadraticCurveTo( x, y, x, y + radius );
        } )( roundedRectShape, -w/2, -h/2, w, h, h/2 );

        var geometry = new THREE.ShapeBufferGeometry( roundedRectShape );
        var mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: c } ) );

        var seekbutton = getSeekMesh( 10, 5, 0x000000 );

        mesh.add( seekbutton );

        mesh.position.z = 0.01;
        mesh.visible = true;
        
        return mesh;
    }

    function getMinusIconMesh(w, h, c)
    {
        /* 8x8 Vector points for Minus icon:
                                    
             ____________+h___________
            |                         |
            |                         |
            |                         |
            |  2____________________3 |
            |  |                    | |
            -w |                    | +w
            |  |____________________| | 
            |  1                    4 |
            |                         |
            |                         | 
            |____________-h___________| */   

        var minusIconShape = new THREE.Shape();

        minusIconShape.moveTo( -w, -h/3 );                        //1
        minusIconShape.quadraticCurveTo ( -w, -h/3, -w, h/3 );    //1-2
        minusIconShape.quadraticCurveTo ( -w, h/3, w, h/3 );      //2-3
        minusIconShape.quadraticCurveTo (w, h/3, w, -h/3 );       //3-4
        minusIconShape.quadraticCurveTo (w, -h/3, -w, -h/3 );     //4-1

        var coliderMesh = new THREE.Mesh( new THREE.PlaneGeometry(w*2, h*2), new THREE.MeshBasicMaterial({visible: false}));
        var geometry = new THREE.ShapeGeometry( minusIconShape );
        var material = new THREE.MeshBasicMaterial( { color: c } );
        var minusMesh = new THREE.Mesh( geometry, material ) ;

        coliderMesh.name =  menuList[2].buttons[0]; //menuList.volumeChangeMenu.minusVolumeButton;
        interController.addInteractiveObject(coliderMesh);
        minusMesh.add(coliderMesh);
        minusMesh.position.z = 0.01;
        
        return minusMesh;
    }


    function getPlusIconMesh(w, h, c)
    {
        /* 8x8 Vector points for Plus icon:
                                    
             ____________+h___________
            |         4______5        |
            |         |      |        |
            |         |      |        |
            |  2______|      |______7 |
            |  |      3      6      | |
            -w |                    | +w
            |  |______12     9______| | 
            |  1      |      |     8  |
            |         |      |        |
            |       11|______|10      | 
            |____________-h___________| */   

        var plusIconShape = new THREE.Shape();

        plusIconShape.moveTo( -w, -h/3 );                         //1
        plusIconShape.quadraticCurveTo ( -w, -h/3, -w, h/3 );     //1-2
        plusIconShape.quadraticCurveTo ( -w, h/3, -w/3, h/3 );    //2-3
        plusIconShape.quadraticCurveTo ( -w/3, h/3, -w/3, h );    //3-4
        plusIconShape.quadraticCurveTo ( -w/3, h, w/3, h);        //4-5
        plusIconShape.quadraticCurveTo ( w/3, h, w/3, h/3 );      //5-6
        plusIconShape.quadraticCurveTo ( w/3, h/3 , w, h/3 );     //6-7
        plusIconShape.quadraticCurveTo (w, h/3, w, -h/3 );        //7-8
        plusIconShape.quadraticCurveTo (w, -h/3, w/3, -h/3 );     //8-9
        plusIconShape.quadraticCurveTo (w/3, -h/3, w/3, -h );     //9-10
        plusIconShape.quadraticCurveTo (w/3, -h, -w/3, -h );      //10-11
        plusIconShape.quadraticCurveTo (-w/3, -h, -w/3, -h/3 );   //11-12
        plusIconShape.quadraticCurveTo (-w/3, -h/3, -w, -h/3 );   //12-1

        var coliderMesh = new THREE.Mesh( new THREE.PlaneGeometry(w*2, h*2), new THREE.MeshBasicMaterial({visible: false}));
        var geometry = new THREE.ShapeGeometry( plusIconShape );
        var material = new THREE.MeshBasicMaterial( { color: c } );
        var plusMesh = new THREE.Mesh( geometry, material ) ;

        coliderMesh.name = menuList[2].buttons[1]; //menuList.volumeChangeMenu.plusVolumeButton;
        interController.addInteractiveObject(coliderMesh);
        plusMesh.add(coliderMesh);
        plusMesh.position.z = 0.01;
        
        return plusMesh;
    }

    function getNextIconMesh(w, h, c, r)
    {
        /* 8x8 Vector points for Next icon:
                                
          ___________+h___________
         |     ____               |
         |     5   6              |
         |      \   \             |
         |       \   \            |
         |        \   \           |
        -w        4    1          +w
         |        /   /           |
         |       /   /            |
         |      /   /             |
         |     3___2              | 
         |___________-h___________| */

        var nextIconShape = new THREE.Shape();

        nextIconShape.moveTo( w/4, 0 ); //1
        nextIconShape.quadraticCurveTo ( w/4, 0, -3*w/4, -h );     //1-2
        nextIconShape.quadraticCurveTo ( -3*w/4, -h, -w, -3*h/4 ); //2-3
        nextIconShape.quadraticCurveTo ( -w, -3*h/4, -w/4, 0 );    //3-4

        nextIconShape.quadraticCurveTo ( -w/4, 0, -w, 3*h/4);      //4-5
        nextIconShape.quadraticCurveTo ( -w, 3*h/4, -3*w/4, h );   //5-6
        nextIconShape.quadraticCurveTo ( -3*w/4, h, w/4, 0);       //6-1

        var coliderMesh = new THREE.Mesh( new THREE.PlaneGeometry(w*2, h*2), new THREE.MeshBasicMaterial({visible: false}));
        var geometry = new THREE.ShapeGeometry( nextIconShape );
        var material = new THREE.MeshBasicMaterial( { color: c } );
        var nextMesh = new THREE.Mesh( geometry, material ) ;

        nextMesh.rotation.z = r;

        if(r > 0)
        {
            coliderMesh.name = menuList[0].buttons[2]; //menuList.backgroudMenu.backMenuButton;
        }

        else
        {
            coliderMesh.name = menuList[0].buttons[1]; //menuList.backgroudMenu.forwardMenuButton;
        }

        interController.addInteractiveObject(coliderMesh);
        nextMesh.add(coliderMesh);
        nextMesh.position.z = 0.01;

        return nextMesh;
    }

    function getCloseIconMesh(w, h, c)
    {
        /* 8x8 Vector points for Close Icon :
                                
          ___________+h___________
         |     ____       ____    |
         |     5   6     8   9    |
         |      \   \   /   /     |
         |       \   \ /   /      |
         |        \   7   /       |
        -w        4 (0,0) 10      +w
         |        /   1   \       |
         |       /   / \   \      |
         |      /   /   \   \     |
         |     3___2    12___11   | 
         |___________-h___________| */

        var closeIconShape = new THREE.Shape();

        closeIconShape.moveTo( 0,-h/4 ); //1
        closeIconShape.quadraticCurveTo ( 0,-h/4, -3*w/4, -h );     //1-2
        closeIconShape.quadraticCurveTo ( -3*w/4, -h, -w, -3*h/4 ); //2-3
        closeIconShape.quadraticCurveTo ( -w, -3*h/4, -w/4, 0 );    //3-4

        closeIconShape.quadraticCurveTo ( -w/4, 0, -w, 3*h/4);      //4-5
        closeIconShape.quadraticCurveTo ( -w, 3*h/4, -3*w/4, h );   //5-6
        closeIconShape.quadraticCurveTo ( -3*w/4, h, 0, h/4);       //6-7

        closeIconShape.quadraticCurveTo ( 0, h/4, 3*w/4, h);        //7-8
        closeIconShape.quadraticCurveTo ( 3*w/4, h, w, 3*h/4 );     //8-9
        closeIconShape.quadraticCurveTo ( w, 3*h/4, w/4, 0 );       //9-10

        closeIconShape.quadraticCurveTo ( w/4, 0, w, -3*h/4 );      //10-11
        closeIconShape.quadraticCurveTo ( w, -3*h/4, 3*w/4, -h );   //11-12
        closeIconShape.quadraticCurveTo ( 3*w/4, -h, 0,-h/4 );      //12-1


        var coliderMesh = new THREE.Mesh( new THREE.PlaneGeometry(w*2, h*2), new THREE.MeshBasicMaterial({visible: false}));
        var geometry = new THREE.ShapeGeometry( closeIconShape );
        var material = new THREE.MeshBasicMaterial( { color: c} );
        var closeMesh = new THREE.Mesh( geometry, material );

        coliderMesh.name = menuList[0].buttons[0]; //menuList.backgroudMenu.closeMenuButton;
        interController.addInteractiveObject(coliderMesh);
        closeMesh.add(coliderMesh);
        closeMesh.position.z = 0.01;

        return closeMesh;
    }

//************************************************************************************
// EXPERIMENTAL
//************************************************************************************

    this.createMenu = function()
    {
        var geometry = new THREE.CircleGeometry( 8, 32 );
        var material = new THREE.MeshBasicMaterial( { color: 0xc90000 } );
        var circle = new THREE.Mesh( geometry, material );

        circle.scale.set( 0.05,0.05,1 );

        circle.position.z = -10;
        circle.position.x = 0;
        circle.position.y = 5;

        circle.lookAt(new THREE.Vector3(0, 0, 0));

        circle.renderOrder = 5;
        circle.name = 'openMenu';

        scene.add( circle );

        return circle;
    };
}

THREE.MenuManager.prototype.constructor = THREE.MenuManager;