THREE.MenuObject = function () {


//************************************************************************************
// SHAPES
//************************************************************************************
    
    this.getImageMesh = function(geometry, url, name, order) 
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

    this.getBackgroundMesh = function(w, h, c, o)
    {
        var material = new THREE.MeshBasicMaterial( { color: c, transparent: true, opacity: o } );
        var geometry = new THREE.PlaneGeometry( w, h ); 
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.z = -0.1;

        return mesh;
    }

    this.getPlayMesh = function(w, h, f, c, name)
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

        coliderMesh.name = name; //menuList.playSeekMenu.playButton
        //interController.addInteractiveObject(coliderMesh);
        mesh.add(coliderMesh);
        
        mesh.position.z = 0.01;
        mesh.name = name; //menuList.playSeekMenu.playButton
        mesh.scale.set(f,f,1);
        
        return mesh;
    }

    this.getPauseMesh = function(w, h, f, c, name)
    {
        var shape = new THREE.Shape();

        shape.moveTo( 3*w/8, -h/2 );
        shape.quadraticCurveTo ( 3*w/8, -h/2, 3*w/8, h/2 );
        shape.quadraticCurveTo ( 3*w/8, h/2, -3*w/8, h/2 );
        shape.quadraticCurveTo ( -3*w/8, h/2, -3*w/8, -h/2 );
        shape.quadraticCurveTo ( -3*w/8, -h/2, 3*w/8, -h/2 );

        var hole = new THREE.Path();
        hole.moveTo( w/8, -h/2 );
        hole.quadraticCurveTo ( w/8, -h/2, w/8, h/2 );
        hole.quadraticCurveTo ( w/8, h/2, -w/8, h/2 );
        hole.quadraticCurveTo ( -w/8, h/2, -w/8, -h/2 );
        hole.quadraticCurveTo ( -w/8, -h/2, w/8, -h/2 );
        shape.holes.push( hole );

        var geometry = new THREE.ShapeGeometry( shape );
        var material = new THREE.MeshBasicMaterial( { color: c } );
        var mesh = new THREE.Mesh( geometry, material ) ;

        var coliderMesh = new THREE.Mesh( new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({visible: false}));


        coliderMesh.name = name; //menuList.playSeekMenu.pauseButton
        //interController.addInteractiveObject(coliderMesh);
        coliderMesh.position.z = 0.01;
        mesh.add(coliderMesh);
        mesh.name = name; //menuList.playSeekMenu.pauseButton

        mesh.position.z = 0.01;
        mesh.scale.set(f,f,1);
        
        return mesh;
    }

    this.getSeekMesh = function(w, h, f, c, r, name)
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
        mesh.name = name;
        mesh.rotation.z = r;
        coliderMesh.name = name;

        //interController.addInteractiveObject(coliderMesh);

        mesh.add(coliderMesh);
        mesh.position.z = 0.01;
        mesh.scale.set(f,f,1);

        return mesh;
    }

    /*this.getSeekBarMesh = function(w, h, c)
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
        
        return mesh;
    }*/

    this.getMinusIconMesh = function(w, h, f, c, name)
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

        //coliderMesh.name =  menuList[2].buttons[0]; //menuList.volumeChangeMenu.minusVolumeButton;
        coliderMesh.name =  name;
        minusMesh.name =  name;
        //interController.addInteractiveObject(coliderMesh);
        minusMesh.add(coliderMesh);
        minusMesh.position.z = 0.01;
        minusMesh.scale.set(f,f,1);  
        
        return minusMesh;
    }


    this.getPlusIconMesh = function(w, h, f, c, name)
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

        coliderMesh.name = name;
        plusMesh.name = name;
        //interController.addInteractiveObject(coliderMesh);
        plusMesh.add(coliderMesh);
        plusMesh.position.z = 0.01;
        plusMesh.scale.set(f,f,1);
        
        return plusMesh;
    }

    this.getNextIconMesh = function(w, h,f, c, r, name, parent)
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
        coliderMesh.name = name;

        //interController.addInteractiveObject(coliderMesh);
        nextMesh.add(coliderMesh);
        nextMesh.scale.set(f,f,1);

        return nextMesh;
    }

    this.getCloseIconMesh = function(w, h, f, c, name, parent)
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

        coliderMesh.name = name;
        //interController.addInteractiveObject(coliderMesh);
        closeMesh.add(coliderMesh);
        closeMesh.scale.set(f,f,1);

        return closeMesh;
    }

/**
 * Gets the menu text mesh.
 *
 * @param      {<type>}  text    The text
 * @param      {number}  size    The size
 * @param      {<type>}  color   The color
 * @param      {<type>}  name    The name
 * @return     {THREE}   The menu text mesh.
 */
    this.getMenuTextMesh = function(text, size, color, name)
    {
        var textShape = new THREE.BufferGeometry();
        var textmaterial = new THREE.MeshBasicMaterial( { color: color} );
        var shapes = moData.getFont().generateShapes( text, size);
        var geometry = new THREE.ShapeGeometry( shapes );

        var coliderMesh = new THREE.Mesh( new THREE.PlaneGeometry(size*shapes.length*0.7, size*2), new THREE.MeshBasicMaterial({visible: false}));
        //var coliderMesh = new THREE.Mesh( new THREE.PlaneGeometry(size*shapes.length*0.7, size*2), new THREE.MeshBasicMaterial({color:0x00ff00}));

        geometry.computeBoundingBox();
        textShape.fromGeometry( geometry );
        textShape.center();

        var mesh = new THREE.Mesh(textShape, textmaterial);

        mesh.name = name;
        coliderMesh.name = name;
        coliderMesh.position.z = 0.02;
        mesh.add(coliderMesh);
        mesh.position.z = 0.01;

        return mesh;
    }

    

/**
 * Creates a line.
 *
 * @param      {<type>}  color        The color
 * @param      {<type>}  startvector  The startvector
 * @param      {<type>}  endvector    The endvector
 * @return     {THREE}   { description_of_the_return_value }
 */
    function createLine(color, startvector, endvector)
    {
        var material = new THREE.LineBasicMaterial({color: color, linewidth: 1});
        var geometry = new THREE.Geometry();
        geometry.vertices.push(startvector,endvector);
        var line = new THREE.Line( geometry, material );
        return line;
    }

/**
 * Creates all the vertical and horitzontal lines in the menus.
 *
 * @param      {<type>}  backgroundmenu    The backgroundmenu
 * @param      {<type>}  color             The color
 * @param      {number}  firstcolumnrows   The firstcolumnrows
 * @param      {number}  secondcolumnrows  The secondcolumnrows
 */
    this.menuLineVerticalDivisions = function(backgroundmenu, color)
    {
        var linesMenuGroup =  new THREE.Group();
        var line = createLine(color, 
            new THREE.Vector3( -backgroundmenu.geometry.parameters.width/6, backgroundmenu.geometry.parameters.height/2, 0 ),
            new THREE.Vector3( -backgroundmenu.geometry.parameters.width/6, -backgroundmenu.geometry.parameters.height/2, 0 ));

        var line2 = line.clone();
        line2.position.x = 2*backgroundmenu.geometry.parameters.width/6;

        linesMenuGroup.add( line );
        linesMenuGroup.add( line2 );

        linesMenuGroup.position.z = 0.01;

        return linesMenuGroup
    }
/**
 * Creates the horitzontal lines that divide the menu depending on the indicated row 
 *
 * @param      {<type>}  color              The color
 * @param      {<type>}  numberofdivisions  The numberofdivisions
 * @param      {<type>}  backgroundmenu     The backgroundmenu
 * @param      {number}  row                The row
 * @return     {Group}   { Returns the group of lines }
 */
    this.menuLineHoritzontalDivisions = function(color, numberofdivisions, backgroundmenu, row)
    {
        var linesHoritzontalGroup =  new THREE.Group();
        var line = createLine(color, 
                    new THREE.Vector3( -backgroundmenu.geometry.parameters.width/6, 0, 0 ),
                    new THREE.Vector3( backgroundmenu.geometry.parameters.width/6, 0, 0 ));
        switch(numberofdivisions)
        {
            case 1:
            default:
                return linesHoritzontalGroup
                break;
            case 2:
                if(row>1) line.position.x +=  backgroundmenu.geometry.parameters.width/3;
                linesHoritzontalGroup.add(line);
                return linesHoritzontalGroup
                break;
            case 3:
                var line1 = line.clone();
                var line2 = line.clone();
                line1.position.y += backgroundmenu.geometry.parameters.height/6
                line2.position.y -= backgroundmenu.geometry.parameters.height/6
                if(row>1)
                    {
                      line1.position.x +=  backgroundmenu.geometry.parameters.width/3;  
                      line2.position.x +=  backgroundmenu.geometry.parameters.width/3;  
                    } 
                linesHoritzontalGroup.add(line1);
                linesHoritzontalGroup.add(line2);
                return linesHoritzontalGroup
                break;
            case 4:
                var line2 = line.clone();
                var line3 = line.clone();
                line2.position.y += backgroundmenu.geometry.parameters.height/4
                line3.position.y -= backgroundmenu.geometry.parameters.height/4
                if(row>1)
                {
                  line.position.x +=  backgroundmenu.geometry.parameters.width/3;
                  line2.position.x +=  backgroundmenu.geometry.parameters.width/3; 
                  line3.position.x +=  backgroundmenu.geometry.parameters.width/3;  
                }
                else if (row == 0)
                {
                    var line4 = line.clone();
                    line4.position.x -=  backgroundmenu.geometry.parameters.width/3;
                    line4.position.y += backgroundmenu.geometry.parameters.height/4;
                    linesHoritzontalGroup.add(line4);
                } 
                linesHoritzontalGroup.add(line);
                linesHoritzontalGroup.add(line2);
                linesHoritzontalGroup.add(line3);
                return linesHoritzontalGroup
                break;
        }
    }
}

THREE.MenuObject.prototype.constructor = THREE.MenuObject;

