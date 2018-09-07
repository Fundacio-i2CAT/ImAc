THREE.MenuObject = function () {


//************************************************************************************
// SHAPES
//************************************************************************************
    
    this.getImageMesh = function(posX, w, h, img, name, func, cw, ch)
    {
        var mesh = menuData.getPlaneImageMesh( w, h, img, name, 4 ); 

        mesh.position.x = posX;
        mesh.position.z = menuElementsZ;

        if ( name == menuList[1].buttons[3] ) mesh.rotation.z = Math.PI;

        var coliderMesh = new THREE.Mesh( new THREE.PlaneGeometry(cw-0.1, ch-0.1), new THREE.MeshBasicMaterial({visible: false}));
        
        coliderMesh.name = name;
        coliderMesh.position.z = menuElementsZ+0.01;

        if ( func ) 
        {
            coliderMesh.onexecute = func;
        }

        mesh.add(coliderMesh);

        mesh.name = name; 
        mesh.onexecute = func;

        return mesh;
    }

    this.getPlaneImageMesh = function(w, h, url, name, order) 
    {
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
    }

    this.getBackgroundMesh = function(w, h, c, o)
    {
        var material = new THREE.MeshBasicMaterial( { color: c, transparent: true, opacity: o } );
        var geometry = new THREE.PlaneGeometry( w, h ); 
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.z = -0.1;

        return mesh;
    }


    this.getNextIconMesh = function(w, h, c, r, name)
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

        return nextMesh;
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
    this.getMenuTextMesh = function(text, size, color, name, func, cw, ch)
    {
        var textShape = new THREE.BufferGeometry();
        var textmaterial = new THREE.MeshBasicMaterial( { color: color} );
        var shapes = moData.getFont().generateShapes( text, size);
        var geometry = new THREE.ShapeGeometry( shapes );

        geometry.computeBoundingBox();
        textShape.fromGeometry( geometry );
        textShape.center();

        var mesh = new THREE.Mesh(textShape, textmaterial);

        mesh.name = name;
        var coliderMesh = new THREE.Mesh( new THREE.PlaneGeometry(cw-0.1, ch-0.1), new THREE.MeshBasicMaterial({visible: false})); //{visible: false}));
        
        coliderMesh.name = name;
        coliderMesh.position.z = menuElementsZ+0.01;

        if ( func ) 
        {
            coliderMesh.onexecute = func;
        }

        mesh.add(coliderMesh);
        
        mesh.position.z = menuElementsZ;

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
    this.createLine = function (color, startvector, endvector)
    {
        var material = new THREE.LineBasicMaterial({color: color, linewidth: 1});
        var geometry = new THREE.Geometry();
        geometry.vertices.push(startvector,endvector);
        var line = new THREE.Line( geometry, material );
        return line;
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
 * { function_description }
 *
 * @param      {number}  w          { parameter_description }
 * @param      {number}  h          { parameter_description }
 * @param      {<type>}  color      The color
 * @param      {<type>}  divisions  The divisions
 * @return     {THREE}   { description_of_the_return_value }
 */
    this.menuLineVerticalDivisions = function(w, h, color, divisions)
    {
        var linesMenuGroup =  new THREE.Group();
        var line;
        for (var i = 1; i<divisions; i++)
        {
            line = createLine( color, new THREE.Vector3(  -w/2+i*w/divisions, h/2, 0 ), new THREE.Vector3( -w/2+i*w/divisions, -h/2, 0 ) );
            linesMenuGroup.add( line );
        }

        linesMenuGroup.position.z = 0.05;

        return linesMenuGroup;
    }

    this.getVerticalLineDivisions = function(w, h, color)
    {
        var linesMenuGroup =  new THREE.Group();
        var line = createLine( color, 
            new THREE.Vector3( -w/6, h/2, 0 ),
            new THREE.Vector3( -w/6, -h/2, 0 ) );

        var line2 = line.clone();
        line2.position.x = 2 * w/6;

        linesMenuGroup.add( line );
        linesMenuGroup.add( line2 );

        linesMenuGroup.position.z = 0.05;

        return linesMenuGroup;
    }

    this.tradMenuLineHoritzontalDivisions = function(w, h, color, divisions)
    {
        var linesMenuGroup =  new THREE.Group();
        var line;
        for (var i = 1; i<divisions; i++)
        {
            line = createLine( color, new THREE.Vector3(  w/2, h/2-i*h/divisions, 0 ), new THREE.Vector3( -w/2, h/2-i*h/divisions, 0 ) );
            linesMenuGroup.add( line );
        }

        linesMenuGroup.position.z = 0.05;

        return linesMenuGroup;
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

    this.getHoritzontalLineDivisions = function(w, h, color, numberofdivisions, row)
    {
        var linesHoritzontalGroup =  new THREE.Group();
        var line = createLine( color, 
                    new THREE.Vector3( -w/6, 0, 0 ),
                    new THREE.Vector3( w/6, 0, 0 ) );

        switch( numberofdivisions )
        {

            case 2:
                if( row > 1 ) line.position.x +=  w/3;
                linesHoritzontalGroup.add( line );
                return linesHoritzontalGroup;

            case 3:
                var line1 = line.clone();
                var line2 = line.clone();
                line1.position.y += h/6
                line2.position.y -= h/6
                if( row > 1 )
                    {
                      line1.position.x +=  w/3;  
                      line2.position.x +=  w/3;  
                    } 
                linesHoritzontalGroup.add(line1);
                linesHoritzontalGroup.add(line2);
                return linesHoritzontalGroup;

            case 4:
                var line2 = line.clone();
                var line3 = line.clone();
                line2.position.y += h/4
                line3.position.y -= h/4
                if( row > 1 )
                {
                  line.position.x += w/3;
                  line2.position.x += w/3; 
                  line3.position.x += w/3;  
                }
                else if ( row == 0 )
                {
                    var line4 = line.clone();
                    line4.position.x -= w/3;
                    line4.position.y += h/4;
                    linesHoritzontalGroup.add(line4);
                } 
                linesHoritzontalGroup.add(line);
                linesHoritzontalGroup.add(line2);
                linesHoritzontalGroup.add(line3);
                return linesHoritzontalGroup;

            case 5:
                var line1 = line.clone();
                var line2 = line.clone();
                var line3 = line.clone();
                var line4 = line.clone();

                line1.position.y += h/8;
                line2.position.y += 3*h/8;
                line3.position.y -= h/8;
                line4.position.y -= 3*h/8;


                linesHoritzontalGroup.add(line1);
                linesHoritzontalGroup.add(line2);
                linesHoritzontalGroup.add(line3);
                linesHoritzontalGroup.add(line4);

                return linesHoritzontalGroup;

            default:
                return linesHoritzontalGroup;
        }
    }
}

THREE.MenuObject.prototype.constructor = THREE.MenuObject;

