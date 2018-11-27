/**
 * @author isaac.fraile@i2cat.net
 */

THREE.MediaObjectData = function () {

    var subtitleFont;

//************************************************************************************
// Public Setters
//************************************************************************************

    this.setFont = function(url)
    {
        return new Promise((resolve, reject) => {
            var loader = new THREE.FontLoader();
            loader.load( url, function ( font ) {
                subtitleFont = font;
                resolve();
            });
        });
    };

//************************************************************************************
// Public Getters
//************************************************************************************

    this.getFont = function()
    {
        return subtitleFont;
    };

    this.getSphericalVideoMesh = function(size, url, name) 
    {
        var geometry = new THREE.SphereBufferGeometry( size, 32, 32, Math.PI/2 );
        geometry.scale( - 1, 1, 1 );
        
        return getVideoMesh( geometry, url, name, 0 );
    };

    this.getSphericalColorMesh = function(size, color, name) 
    {
        var geometry = new THREE.SphereBufferGeometry( size, 32, 32, Math.PI/2 );
        geometry.scale( - 1, 1, 1 );
        var material = new THREE.MeshBasicMaterial( {color: color} );
        var sphere = new THREE.Mesh( geometry, material );
        
        return sphere;
    };

    this.getCubeVideo65Mesh = function(size, url, name) 
    {
        var geometry = getCubeGeometry65( size );

        return getVideoMesh( geometry, url, name, 0 );
    };

    this.getCubeVideo116Mesh = function(size, url, name) 
    {
        var geometry = getCubeGeometry116( size );

        return getVideoMesh( geometry, url, name, 0 );
    };

    this.getSignVideoMesh = function(url, name, config) 
    {
        var geometry = new THREE.PlaneGeometry( config.size, config.size );
        var plane = getVideoMesh( geometry, url, name, 1 );

        // left arrow
        var arrow = getArrowMesh( config.size/5, config.size/6, 0xffffff );
        arrow.rotation.z = Math.PI;
        arrow.position.y = -7 * config.size/12;
        arrow.position.x = -3 * config.size/8;
        arrow.name = 'left';

        plane.add( arrow );

        // right arrow
        var arrow = getArrowMesh( config.size/5, config.size/6, 0xffffff );
        arrow.position.y = -7 * config.size/12;
        arrow.position.x = 3 * config.size/8;
        arrow.name = 'right';

        plane.add( arrow );

        // background 
        var backgroundMesh = getBackgroundMesh ( config.size, config.size/5, 0x000000, 0.8 );
        backgroundMesh.position.y = -6 * config.size/10;
        backgroundMesh.visible = config.signIndicator == 'arrow' ? true : false;

        plane.add( backgroundMesh );

        plane.position.z = - config.z;
        plane.position.x = config.x;
        plane.position.y = config.y;

        return plane;
    };

    this.getSubtitleMesh = function(textList, config)
    {
        var group = new THREE.Group();

        for ( var i = 0, len = textList.length; i < len; ++i ) 
        {
            config.x = config.textAlign == 0 ? 0 : config.textAlign == -1 ? -config.size : config.size;

            var mesh = getSubMesh( textList[i], config, config.opacity, len, i );
            mesh.name = i;

            group.add( mesh );
        }
        
        return group;
    };

    this.getExpSubtitleMesh = function(textList, config)
    {
        var group = new THREE.Group();
        var group1 = new THREE.Group();
        var group2 = new THREE.Group();
        var group3 = new THREE.Group();

        for ( var i = 0, len = textList.length; i < len; ++i ) 
        {
            config.x = config.textAlign == 0 ? 0 : config.textAlign == -1 ? -config.size : config.size;

            var mesh = getSubMesh( textList[i], config, config.opacity, len, i );
            mesh.name = i;
            if (isLookAt) mesh.lookAt(new THREE.Vector3(0, 0, 0)); 

            group1.add( mesh );
        }

        for ( var i = 0, len = textList.length; i < len; ++i ) 
        {
            config.x = config.textAlign == 0 ? 0 : config.textAlign == -1 ? -config.size : config.size;

            var mesh = getSubMesh( textList[i], config, config.opacity, len, i );
            mesh.name = i;
            if (isLookAt) mesh.lookAt(new THREE.Vector3(0, 0, 0)); 

            group2.add( mesh );
        }

        for ( var i = 0, len = textList.length; i < len; ++i ) 
        {
            config.x = config.textAlign == 0 ? 0 : config.textAlign == -1 ? -config.size : config.size;

            var mesh = getSubMesh( textList[i], config, config.opacity, len, i );
            mesh.name = i;
            if (isLookAt) mesh.lookAt(new THREE.Vector3(0, 0, 0)); 

            group3.add( mesh );
        }

        group2.rotation.y = Math.radians( 120 );
        group3.rotation.y = Math.radians( 240 );

        group.add( group1 );
        group.add( group2 );
        group.add( group3 );
        
        return group;
    };

    this.getRadarMesh = function()
    {
        var imgGeometry = new THREE.PlaneGeometry( 14, 14 );
        var mesh = getImageMesh( imgGeometry, './img/radar1.png', 'radar', 3 );

        mesh.position.x = _isHMD ? 35 : 40
        mesh.position.y = _isHMD ? -2 : -22
        mesh.position.z = -76.001;

        return mesh;
    };

    this.getSpeakerRadarMesh = function(color, pos)
    {
        var imgGeometry = new THREE.PlaneGeometry( 14, 14 );
        var mesh = getImageMesh( imgGeometry, './img/radar2.png', 'radar2', 3 );

        mesh.material.color.set( color ); 

        mesh.position.x = _isHMD ? 35 : 40
        mesh.position.y = _isHMD ? -2 : -22
        mesh.position.z = -76;

        mesh.rotation.z = Math.radians( 360 - pos );

        return mesh;
    };

    this.createPointer = function()
    {
        var pointer = getPointMesh( 0.02, 16, 0xffff00, 1 );

        pointer.position.z = -4;
        pointer.name = 'pointer';
        pointer.visible = false;

        camera.add( pointer );
    };

    this.createPointer2 = function()
    {
        var pointer1 = getPointMesh( 0.002, 16, 0xffff00, 0 );
        var pointer2 = getPointMesh( 0.04, 32, 0xffff00, 1 );

        pointer1.add( pointer2 );

        pointer1.position.x = 0.155
        pointer1.position.y = 1.21
        pointer1.position.z = -0.15

        pointer1.name = 'pointer2';
        pointer1.visible = true;

        scene.add( pointer1 );
    };

    this.createCastShadows = function()
    {
        applyDown = function( obj, key, value ) {
            obj[ key ] = value
            if( obj.children !== undefined && obj.children.length > 0 ) {
                obj.children.forEach( function( child ){
                    applyDown( child, key, value )
                })
            }
        }
        castShadows = function( obj ) {
            applyDown( obj, 'castShadow', true )
        }
        receiveShadows = function( obj ) {
            applyDown( obj, 'receiveShadow', true )
        }

        var light = new THREE.DirectionalLight( 0xFFFFFF, 1, 1000 )
        light.position.set(  1, 100, -0.5 )
        light.castShadow = true
        light.shadow.mapSize.width  = 2048
        light.shadow.mapSize.height = 2048
        light.shadow.camera.near    =    1
        light.shadow.camera.far     =   1200
        scene.add( light )

        scene.add( new THREE.HemisphereLight( 0x909090, 0x404040 ))
    };



//************************************************************************************
// Experimental
//************************************************************************************
  

    this.createOpenMenuMesh = function()
    {
        var openMenuText = getTextMesh( "Menu", 22, 0xffff00, "openmenutext" ); 
        openMenuText.position.y = 6;
        openMenuText.position.z = -60;
        openMenuText.scale.set( 0.15, 0.15, 1 )
        openMenuText.visible = false;

        camera.add(openMenuText);
    };




    this.createLine = function (color, startvector, endvector)
    {
        return getLineMesh(color, startvector, endvector);
    };

    this.getMenuTextMesh = function(text, size, color, name, func, cw, ch)
    {
        return getTextMesh(text, size, color, name, func, cw, ch);
    };

    this.getImageMesh = function(posX, w, h, img, name, func, cw, ch)
    {
        var geometry = new THREE.PlaneGeometry( w, h );
        var mesh = getImageMesh( geometry, img, name, 4 ); 

        mesh.position.x = posX;
        mesh.position.z = 0.05;

        if ( name == 'forwardSeekButton' ) mesh.rotation.z = Math.PI;

        var coliderMesh = new THREE.Mesh( new THREE.PlaneGeometry(cw, ch), new THREE.MeshBasicMaterial({visible: false}));
        
        coliderMesh.name = name;
        coliderMesh.position.z = 0.06;

        if ( func ) 
        {
            coliderMesh.onexecute = func;
        }

        mesh.add(coliderMesh);

        mesh.name = name; 
        mesh.onexecute = func;

        return mesh;
    };

    this.getPlaneImageMesh = function(w, h, url, name, order) 
    {
        var geometry = new THREE.PlaneGeometry( w, h );

        return getImageMesh( geometry, url, name, order );
    };

    this.getBackgroundMesh = function(w, h, c, o)
    {
        return getBackgroundMesh( w, h, c, o );
    };

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
    };  

    this.menuLineVerticalDivisions = function(w, h, color, divisions)
    {
        var linesMenuGroup =  new THREE.Group();
        var line;
        for (var i = 1; i<divisions; i++)
        {
            line = getLineMesh( color, new THREE.Vector3(  -w/2+i*w/divisions, h/2, 0 ), new THREE.Vector3( -w/2+i*w/divisions, -h/2, 0 ) );
            linesMenuGroup.add( line );
        }

        linesMenuGroup.position.z = 0.05;

        return linesMenuGroup;
    };

    this.getVerticalLineDivisions = function(w, h, color)
    {
        var linesMenuGroup =  new THREE.Group();
        var line = getLineMesh( color, 
            new THREE.Vector3( -w/6, h/2, 0 ),
            new THREE.Vector3( -w/6, -h/2, 0 ) );

        var line2 = line.clone();
        line2.position.x = 2 * w/6;

        linesMenuGroup.add( line );
        linesMenuGroup.add( line2 );

        linesMenuGroup.position.z = 0.05;

        return linesMenuGroup;
    };


    this.getHoritzontalLineDivisions = function(w, h, color, numberofdivisions, row)
    {
        var linesHoritzontalGroup =  new THREE.Group();
        var line = getLineMesh( color, 
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
    };


//************************************************************************************
// Private Functions
//************************************************************************************
    
    function getVideoMesh(geometry, url, name, order) 
    {
        var texture = new THREE.VideoTexture( VideoController.getVideObject( name, url ) );
        texture.minFilter = THREE.LinearFilter;
        //texture.minFilter = THREE.NearestFilter;
        texture.format = THREE.RGBAFormat;

        var material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.FrontSide } );
        var mesh = new THREE.Mesh( geometry, material );

        mesh.name = name;
        mesh.renderOrder = order || 0;

        return mesh;
    }

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

    function getBackgroundMesh(w, h, c, o)
    {
        var material = new THREE.MeshBasicMaterial( { color: c, transparent: true, opacity: o } );
        var geometry = new THREE.PlaneGeometry( w, h ); 
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.z = -0.1;

        return mesh;
    }

    function getArrowMesh(w, h, c, o)
    {
        var arrowShape = new THREE.Shape();

        arrowShape.moveTo( -w/2, -h/4 );
        arrowShape.quadraticCurveTo ( -w/2, -h/4, -w/2, h/4 );
        arrowShape.quadraticCurveTo ( -w/2, h/4, 0, h/4 );
        arrowShape.quadraticCurveTo ( 0, h/4, 0, h/2 );
        arrowShape.quadraticCurveTo ( 0, h/2, w/2, 0 );
        arrowShape.quadraticCurveTo ( w/2, 0, 0, -h/2 );
        arrowShape.quadraticCurveTo ( 0, -h/2, 0, -h/4 );
        arrowShape.quadraticCurveTo ( 0, -h/4, -w/2, -h/4 );

        var geometry = new THREE.ShapeGeometry( arrowShape );
        var material = new THREE.MeshBasicMaterial( { color: c } );
        var mesh = new THREE.Mesh( geometry, material ) ;

        if ( o == 0 )
        {
            var geometry = new THREE.Geometry();
            geometry.vertices.push(
                new THREE.Vector3( -w/2, -h/4, 0 ),
                new THREE.Vector3( -w/2, h/4, 0 ),
                new THREE.Vector3( 0, h/4, 0 ),
                new THREE.Vector3( 0, h/2, 0 ),
                new THREE.Vector3( w/2, 0, 0 ),
                new THREE.Vector3( 0, -h/2, 0 ),
                new THREE.Vector3( 0, -h/4, 0 ),
                new THREE.Vector3( -w/2, -h/4, 0 )
            );
            var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 1.1 } ) );
            //line.renderOrder = 6;
            mesh.add(line)
        }

        mesh.position.z = 0.1;
        mesh.visible = false;
        
        return mesh;
    }

    function getSubMesh(t, c, o, l, i)
    {
        var textmaterial = new THREE.MeshBasicMaterial( { color: t.color } );
        var textShape = new THREE.BufferGeometry();
        var shapes = subtitleFont.generateShapes( /*'MMMMMWWWWWMMMMMWWWWWMMMMMWWWWWMMMMMQQ'*/t.text, 5*c.size );
        var geometry = new THREE.ShapeGeometry( shapes );
        geometry.computeBoundingBox();

        var xMid = geometry.boundingBox.max.x - geometry.boundingBox.min.x;

        textShape.fromGeometry( geometry );

        var textplane = new THREE.Mesh( textShape, textmaterial );
        textplane.position.x = -xMid/2;
        textplane.position.y = -2*c.size;
        textplane.position.z = 0.1;

        var material = new THREE.MeshBasicMaterial( { color: t.backgroundColor, transparent: true, opacity: o } );
        var geometry = new THREE.PlaneGeometry( xMid+4*c.size, 8.7*c.size ); 
        var mesh = new THREE.Mesh( geometry, material );

        mesh.add( textplane );


        if ( o == 0 )
        {
            var matDark = new THREE.LineBasicMaterial( { color: t.backgroundColor,
                linewidth: 1.1
            } );

            var holeShapes = [];
            for ( var j = 0; j < shapes.length; j ++ ) {
                var shape = shapes[ j ];
                if ( shape.holes && shape.holes.length > 0 ) {
                    for ( var k = 0; k < shape.holes.length; k ++ ) {
                        var hole = shape.holes[ k ];
                        holeShapes.push( hole );
                    }
                }
            }
            shapes.push.apply( shapes, holeShapes );
            var lineText = new THREE.Object3D();
            for ( var j = 0; j < shapes.length; j ++ ) {
                var shape = shapes[ j ];
                var points = shape.getPoints();
                var geometry = new THREE.BufferGeometry().setFromPoints( points );
                var lineMesh = new THREE.Line( geometry, matDark );
                      

                lineText.add( lineMesh );
            }
            lineText.position.x = -xMid/2;
            lineText.position.y = -2*c.size;
            lineText.position.z = 0.1;

            mesh.add( lineText );
        }

        if ( i == l-1 && c.subtitleIndicator == 'arrow' )
        {
            // right arrow
            var arrow = getArrowMesh( 6.7*c.size, 6.7*c.size, t.color, o );
            arrow.add( getBackgroundMesh ( 9.7*c.size, 8.7*c.size, t.backgroundColor, o ) );
            arrow.position.x = xMid/2 + 6.8*c.size;
            arrow.name = 'right';

            mesh.add( arrow );

            // left arrow
            var arrow = getArrowMesh( 6.7*c.size, 6.7*c.size, t.color, o );
            arrow.rotation.z = Math.PI;
            arrow.add( getBackgroundMesh ( 9.7*c.size, 8.7*c.size, t.backgroundColor, o ) );
            arrow.position.x = -(xMid/2 + 6.8*c.size);
            arrow.name = 'left';

            mesh.add( arrow );
        }

        mesh.scale.set( c.area,c.area,1 );

        mesh.position.z = - c.z;
        mesh.position.y = c.displayAlign == 1 ? c.y - (9.57 * i * c.area *c.size) : c.y + (9.57 * (l-1-i) * c.area *c.size); //c.displayAlign == 'before'
        mesh.position.x = c.x * (49 - xMid/2);

        mesh.renderOrder = 3;
        mesh.visible = true;

        return mesh;
    }

    function getPointMesh(w, h, c, o)
    {
        var pointer = new THREE.Mesh(
            new THREE.SphereBufferGeometry( w, h, 8 ),
            new THREE.MeshBasicMaterial( { color: c, transparent: true, opacity: o } )
        );

        return pointer;
    }

    function getLineMesh(c, startvector, endvector)
    {
        var material = new THREE.LineBasicMaterial( { color: c, linewidth: 1 } );
        var geometry = new THREE.Geometry();
        geometry.vertices.push( startvector, endvector );
        var line = new THREE.Line( geometry, material );

        return line;
    }

    function getCubeGeometryByVertexUVs(size, f, l, r, t, b, bo)
    {
        var geometry = new THREE.BoxGeometry( -size, size, size );
        
        geometry.faceVertexUvs[0] = []; // cleans the geometry UVs
        // front
        geometry.faceVertexUvs[0][0] = [ f[0], f[1], f[3] ];
        geometry.faceVertexUvs[0][1] = [ f[1], f[2], f[3] ];
        // back
        geometry.faceVertexUvs[0][2] = [ b[0], b[1], b[3] ];
        geometry.faceVertexUvs[0][3] = [ b[1], b[2], b[3] ];
        // top
        geometry.faceVertexUvs[0][4] = [ t[0], t[1], t[3] ];
        geometry.faceVertexUvs[0][5] = [ t[1], t[2], t[3] ];
        // bottom
        geometry.faceVertexUvs[0][6] = [ bo[0], bo[1], bo[3] ];
        geometry.faceVertexUvs[0][7] = [ bo[1], bo[2], bo[3] ];
        // left
        geometry.faceVertexUvs[0][8] = [ l[0], l[1], l[3] ];
        geometry.faceVertexUvs[0][9] = [ l[1], l[2], l[3] ];
        // right
        geometry.faceVertexUvs[0][10] = [ r[0], r[1], r[3] ];
        geometry.faceVertexUvs[0][11] = [ r[1], r[2], r[3] ];

        return geometry;
    }

    function getCubeGeometry65(size)
    {
        /* 6x5 Texture UV vertices map:
         //////////////////////////////////////////////////////////////////////
         // 
         //     ^
         //     |
         //    0,1     +-----+-----+-----+-----+-----+-----+
         //     |      |05    15    25    35      55a|55b  |65   top
         //     |      |                             |54b  |64b
         //    0,0.8   +     +     +     +     +     +-----+
         //     |      |                             |54a  |64a  back
         //     |      |                             |53b  |63b
         //    0,0.6   +     +     +     +     +     +-----+
         //     |      |                             |53a  |63a  bottom
         //     |      |                             |52b  |62b
         //    0,0.4   +     +     +     +     +     +-----+
         //     |      |                             |52a  |62a  right
         //     |      |                             |51b  |61b
         //    0,0.2   +     +     +     +     +     +-----+
         //     |      |                             |51a  |61a  left
         //     |      |                          50a|50b  |60
         //     |      +-----+-----+-----+-----+-----+-----+
         //     |       00    10    20    30    40    50    60
         //     |
         //    0,0-----|-----|-----|-----|-----|-----|-----1,0--->
         //                                        0.8333
         // 
         //////////////////////////////////////////////////////////////////////
        */ 
        // cubemap UV points
        // The "threshold" value removes the pixel(s) between the two rows of the texture.
        var threshold = 0.0002;

        var _00 = new THREE.Vector2( 0, 0 );
        var _05 = new THREE.Vector2( 0, 1 );

        var _50a = new THREE.Vector2( 5/6 - threshold, 0 );
        var _50b = new THREE.Vector2( 5/6 + threshold, 0 );       
        var _51a = new THREE.Vector2( 5/6 + threshold, 0.2 - threshold );
        var _51b = new THREE.Vector2( 5/6 + threshold, 0.2 + threshold );
        var _52a = new THREE.Vector2( 5/6 + threshold, 0.4 - threshold );
        var _52b = new THREE.Vector2( 5/6 + threshold, 0.4 + threshold );
        var _53a = new THREE.Vector2( 5/6 + threshold, 0.6 - threshold );
        var _53b = new THREE.Vector2( 5/6 + threshold, 0.6 + threshold );
        var _54a = new THREE.Vector2( 5/6 + threshold, 0.8 - threshold );
        var _54b = new THREE.Vector2( 5/6 + threshold, 0.8 + threshold );
        var _55a = new THREE.Vector2( 5/6 - threshold, 1 );
        var _55b = new THREE.Vector2( 5/6 + threshold, 1 );

        var _60 = new THREE.Vector2( 1, 0 );
        var _61a = new THREE.Vector2( 1, 0.2 - threshold );
        var _61b = new THREE.Vector2( 1, 0.2 + threshold );
        var _62a = new THREE.Vector2( 1, 0.4 - threshold );
        var _62b = new THREE.Vector2( 1, 0.4 + threshold );
        var _63a = new THREE.Vector2( 1, 0.6 - threshold );
        var _63b = new THREE.Vector2( 1, 0.6 + threshold );
        var _64a = new THREE.Vector2( 1, 0.8 - threshold );
        var _64b = new THREE.Vector2( 1, 0.8 + threshold );
        var _65 = new THREE.Vector2( 1, 1 );

        /// map the faces
        var face_front = [ _05, _00, _50a, _55a ];
        var face_back = [ _54a, _53b, _63b, _64a ];
        var face_top = [ _54b, _64b, _65, _55b ];    
        var face_bottom = [ _63a, _53a, _52b, _62b ];
        var face_right = [ _52a, _51b, _61b, _62b ];
        var face_left = [ _51a, _50b, _60, _61a ]; 

        return getCubeGeometryByVertexUVs( size, face_front, face_left, face_right, face_top, face_back, face_bottom );
    }

    function getCubeGeometry116(size)
    {
        /* 11x6 Texture UV vertices map:
         /// 
         ///       ^
         ///       |
         ///      0,1    +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
         ///       |     |06    16    26    36    46    56   |66    76    86   |96    106  |116 
         ///       |     |                                   |                 |           |
         ///      0,0.833+     +     +     +     +     +     +     +     +     +     +     +
         ///       |     |                                   |                 |           |
         ///       |     |                                   |                 |94b        |114b
         ///      0,0.667+     +     +     +     +     +     +     +     +     +-----+-----+
         ///       |     |                                   |                 |94a        |114a
         ///       |     |                                   |63b              |93b        |
         ///      0,0.5  +     +     +     +     +     +     +-----+-----+-----+     +     +
         ///       |     |                                   |63a              |93a        |
         ///       |     |                                   |                 |92b        |112b
         ///      0,0.333+     +     +     +     +     +     +     +     +     +-----+-----+
         ///       |     |                                   |                 |92a        |112a
         ///       |     |                                   |                 |           |
         ///      0,0.167+     +     +     +     +     +     +     +     +     +     +     +
         ///       |     |                                   |                 |           |
         ///       |     |                                   |60               |90         |110
         ///       |     +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
         ///       |      00    10    20    30    40    50    60    70    80    90    100   110
         ///       |
         ///      0,0----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----1,0--->
         ///                                                  0.5454            0.8181
         ///
        */ 
        // cubemap UV points
        // The "threshold" value removes the pixel(s) between the two rows of the texture.
        var threshold = 0.0002;

        var _00 = new THREE.Vector2( 0, 0 );
        var _06 = new THREE.Vector2( 0, 1 );

        var _60 = new THREE.Vector2( 0.5454, 0 );
        var _63a = new THREE.Vector2( 0.5454, 0.5 - threshold );
        var _63b = new THREE.Vector2( 0.5454, 0.5 + threshold );
        var _66 = new THREE.Vector2( 0.5454, 1 );

        var _90 = new THREE.Vector2( 0.8181, 0 );
        var _92a = new THREE.Vector2( 0.8181, 0.3333 - threshold );
        var _92b = new THREE.Vector2( 0.8181, 0.3333 + threshold );
        var _93a = new THREE.Vector2( 0.8181, 0.5 - threshold );
        var _93b = new THREE.Vector2( 0.8181, 0.5 + threshold );
        var _94a = new THREE.Vector2( 0.8181, 0.8333 - threshold );
        var _94b = new THREE.Vector2( 0.8181, 0.8333 + threshold );
        var _96 = new THREE.Vector2( 0.8181, 1 );

        var _110 = new THREE.Vector2( 1, 0 );
        var _112a = new THREE.Vector2( 1, 0.3333 - threshold );
        var _112b = new THREE.Vector2( 1, 0.3333 + threshold );
        var _114a = new THREE.Vector2( 1, 0.8333 - threshold );
        var _114b = new THREE.Vector2( 1, 0.8333 + threshold );
        var _116 = new THREE.Vector2( 1, 1 );

        /// map the faces
        var face_front = [ _06, _00, _60, _66 ];
        var face_left = [ _66, _63b, _93b, _96 ];
        var face_right = [ _63a, _60, _90, _93a ];
        var face_top = [ _94b, _114b, _116,_96 ];
        var face_back = [ _94a, _92b, _112b, _114a ];
        var face_bottom = [ _112a, _92a, _90, _110 ];

        return getCubeGeometryByVertexUVs( size, face_front, face_left, face_right, face_top, face_back, face_bottom );
    }

    function getTextMesh(text, size, color, name, func, cw, ch)
    {
        var textShape = new THREE.BufferGeometry();
        var textmaterial = new THREE.MeshBasicMaterial( { color: color} );
        var shapes = subtitleFont.generateShapes( text, size );
        var geometry = new THREE.ShapeGeometry( shapes );

        geometry.computeBoundingBox();
        textShape.fromGeometry( geometry );
        textShape.center();

        var mesh = new THREE.Mesh( textShape, textmaterial );

        mesh.name = name;
        var coliderMesh = new THREE.Mesh( new THREE.PlaneGeometry( cw, ch ), new THREE.MeshBasicMaterial( { visible: false } ) );
        
        coliderMesh.name = name;
        coliderMesh.position.z = 0.06;

        if ( func ) 
        {
            coliderMesh.onexecute = func;
        }

        mesh.add( coliderMesh );
        
        mesh.position.z = 0.05;

        return mesh;
    }

}

THREE.MediaObjectData.prototype.constructor = THREE.MediaObjectData;