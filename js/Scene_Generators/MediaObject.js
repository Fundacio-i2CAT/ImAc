/**
 * @author isaac.fraile@i2cat.net
 */

THREE.MediaObject = function () {

    var listOfVideoContents = [];
    var mainMesh,
        imageMesh, 
        signMesh, 
        subtitleMesh,
        subtitleFont;

//************************************************************************************
// Private Functions
//************************************************************************************

    function getVideObject(id, url, isDASH) 
    {
        var vid = document.createElement( "video" );     
        vid.muted = true;
        vid.autoplay = false;
        vid.loop = true;
        //vid.src = url;

        if (isDASH)
        {
            var player = dashjs.MediaPlayer().create();
            player.initialize( vid, url, true );
            player.getDebug().setLogToBrowserConsole( false );
            var objVideo = { id: id, vid: vid, dash: player };
        }
        else
        {
            vid.src = url;
            var objVideo = { id: id, vid: vid };
        }

        listOfVideoContents.push( objVideo );

        return vid;
    }

    function getVideoMesh(geometry, url, name, order) 
    {
        var texture = new THREE.VideoTexture( getVideObject( name, url ) );
        texture.minFilter = THREE.LinearFilter;
        //texture.minFilter = THREE.NearestFilter;
        texture.format = THREE.RGBAFormat;

        var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.FrontSide });
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

        var material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.FrontSide })
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
        mesh.position.z -= 0.001;

        return mesh;
    }

    function getArrowMesh(w, h, c)
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

        mesh.position.z = 0.01;
        mesh.visible = false;
        
        return mesh;
    }

    function getSubMesh(t, c, o, l, i)
    {
        var textmaterial = new THREE.MeshBasicMaterial( { color: t.color } );
        var textShape = new THREE.BufferGeometry();
        var shapes = subtitleFont.generateShapes( t.text, 5, 2 );
        var geometry = new THREE.ShapeGeometry( shapes );
        geometry.computeBoundingBox();

        var xMid = geometry.boundingBox.max.x - geometry.boundingBox.min.x;

        textShape.fromGeometry( geometry );

        var textplane = new THREE.Mesh( textShape, textmaterial );
        textplane.position.x = -xMid/2;
        textplane.position.y = -2;
        textplane.position.z = 0.001;
               
        var material = new THREE.MeshBasicMaterial( { color: t.backgroundColor, transparent: true, opacity: o } );
        var geometry = new THREE.PlaneGeometry( xMid+4, 8.7 ); 
        var mesh = new THREE.Mesh( geometry, material );

        mesh.add(textplane);

        if (i == l-1 && c.subtitleIndicator == 'compass')
        {
            // right compass
            var imgGeometry = new THREE.PlaneGeometry( 6.7, 6.7 );
            var compass = getImageMesh( imgGeometry, './img/compass_r.png', 'right', 4 );
            compass.add( getBackgroundMesh ( 10.7, 8.7, t.backgroundColor, o ) );
            compass.position.z = 0.01;
            compass.position.x = xMid/2 + 6.7;
            compass.visible = false;

            mesh.add(compass);

            // lesft compass
            var imgGeometry = new THREE.PlaneGeometry( 6.7, 6.7 );
            var compass = getImageMesh( imgGeometry, './img/compass_l.png', 'left', 4 );
            compass.add( getBackgroundMesh ( 10.7, 8.7, t.backgroundColor, o ) );
            compass.position.z = 0.01;
            compass.position.x = -(xMid/2 + 6.79);
            compass.visible = false;

            mesh.add(compass);

        }
        else if (i == l-1 && c.subtitleIndicator == 'arrow')
        {
            // right arrow
            var arrow = getArrowMesh( 6.7, 6.7, t.color );
            arrow.add( getBackgroundMesh ( 10.7, 8.7, t.backgroundColor, o ) );
            arrow.position.x = xMid/2 + 6.7;
            arrow.name = 'right';

            mesh.add(arrow);

            // left arrow
            var arrow = getArrowMesh( 6.7, 6.7, t.color );
            arrow.rotation.z = Math.PI;
            arrow.add( getBackgroundMesh ( 10.7, 8.7, t.backgroundColor, o ) );
            arrow.position.x = -(xMid/2 + 6.7);
            arrow.name = 'left';

            mesh.add(arrow);
        }

        mesh.scale.set( c.size,c.size,c.size );

        mesh.position.z = - c.z;
        mesh.position.y = c.displayAlign == 'before' ? c.y - (9.57 * i * c.size) : c.y + (9.57 * (l-1-i) * c.size);
        mesh.position.x = c.x * (49 - xMid/2);

        mesh.renderOrder = 3;
        mesh.visible = true;

        return mesh;
    }

    function removeContentById(id)
    {
        for (var i = 0, len = listOfVideoContents.length; i < len; i++)
        {
            if (listOfVideoContents[i].id == id)
            {
                listOfVideoContents.splice(i, 1);
                break;
            }
        }
    }

//************************************************************************************
// Experimental
//************************************************************************************

    function getCubeGeometryByVertexUVs(f, l, r, t, b, bo)
    {
        var geometry = new THREE.BoxGeometry( -200, 200, 200 );
        
        geometry.faceVertexUvs[0] = []; // cleans the geometry UVs
        // front
        geometry.faceVertexUvs[0][0] = [ f[0], f[1], f[3] ];
        geometry.faceVertexUvs[0][1] =  [ f[1], f[2], f[3] ];
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

    function getCubeGeometry65()
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

        return getCubeGeometryByVertexUVs( face_front, face_left, face_right, face_top, face_back, face_bottom );
    }

    function getCubeGeometry116()
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

        return getCubeGeometryByVertexUVs( face_front, face_left, face_right, face_top, face_back, face_bottom );
    }

//************************************************************************************
// Public Getters
//************************************************************************************

    this.getFont = function()
    {
        return subtitleFont;
    };

    this.getListOfVideoContents = function()
    {
        return listOfVideoContents;
    };

    this.getMainMesh = function()
    {
        return mainMesh;
    };

    this.getSignMesh = function()
    {
        return signMesh;
    };

    this.getSubtitleMesh = function()
    {
        return subtitleMesh;
    };

//************************************************************************************
// Public Setters
//************************************************************************************

    this.setFont = function(url)
    {
        var loader = new THREE.FontLoader();
        loader.load( url, function ( font ) {
            subtitleFont = font;
        });
    };

//************************************************************************************
// Video Controller
//************************************************************************************

    this.playAll = function()
    {
        for (var i = 0, len = listOfVideoContents.length; i < len; i++) 
        {
            listOfVideoContents[i].vid.play();
        }
    };

    this.pauseAll = function()
    {
        for (var i = 0, len = listOfVideoContents.length; i < len; i++) 
        {
            listOfVideoContents[i].vid.pause();
        }
    };

    this.isPausedById = function(id)
    {
        return listOfVideoContents[id].vid.paused;
    };

//************************************************************************************
// Media Object Generators
//************************************************************************************

    this.createSphericalVideoInScene = function(url, name) 
    {
        var geometry = new THREE.SphereBufferGeometry( 10, 32, 16 );
        geometry.scale( - 1, 1, 1 );
        var sphere = getVideoMesh( geometry, url, name, 0 );

        mainMesh = sphere;

        scene.add( sphere );
    };

    this.createSignVideo = function(url, name, config) 
    {
        var geometry = new THREE.PlaneGeometry( config.size, config.size );
        var plane = getVideoMesh( geometry, url, name, 1 );

        // left arrow
        var arrow = getArrowMesh( config.size/5, config.size/6, 0xffffff );
        arrow.rotation.z = Math.PI;
        arrow.position.y = -7 * config.size/12;
        arrow.position.x = -3 * config.size/8;
        arrow.name = 'left';

        plane.add(arrow);

        // right arrow
        var arrow = getArrowMesh( config.size/5, config.size/6, 0xffffff );
        arrow.position.y = -7 * config.size/12;
        arrow.position.x = 3 * config.size/8;
        arrow.name = 'right';

        plane.add(arrow);

        // background 
        var backgroundMesh = getBackgroundMesh ( config.size, config.size/5, 0x000000, 0.8 );
        backgroundMesh.position.y = -6 * config.size/10;
        backgroundMesh.visible = signIndicator == 'arrow' ? true : false;

        plane.add(backgroundMesh);

        plane.position.z = - config.z;
        plane.position.x = config.x;
        plane.position.y = config.y;

        signMesh = plane;

        camera.add(plane);
    };

    this.createImageInCamera = function(url, name, config) 
    {
        var geometry = new THREE.PlaneGeometry( config.w, config.h);
        var plane = getImageMesh( geometry, url, name, 5 );
        plane.position.z = -0.5;
        plane.visible = config.visible;

        if (imageMesh) {
            var imgMesh = imageMesh;
            setTimeout(function() {
                camera.remove(imgMesh);
            }, 300);
        }

        imageMesh = plane;

        camera.add(plane);
    };

    this.createSubtitle = function(textList, config)
    {
        var group = new THREE.Group();

        for (var i = 0, len = textList.length; i < len; ++i) 
        {
            config.x = config.textAlign == 'center' ? 0 : config.textAlign == 'start' ? -config.size : config.size;

            var mesh = getSubMesh(textList[i], config, 0.8, len, i);            
            mesh.name = i;

            group.add(mesh);
        }
        
        subtitleMesh = group;

        camera.add(group);
    };

//************************************************************************************
// Media Object Destructors
//************************************************************************************

    this.removeSubtitle = function()
    {
        camera.remove(subtitleMesh);
        subtitleMesh = undefined;
    };

    this.removeSignVideo = function()
    {
        removeContentById(signMesh.name);
        camera.remove(signMesh);
        signMesh = undefined;
    };

    this.removeInfoImage = function()
    {
        camera.remove(imageMesh);
        imageMesh = undefined;
    };

//************************************************************************************
// Media Object Position Controller
//************************************************************************************

    this.changeSubtitleIndicator = function(pos)
    {
        if (subtitleMesh)
        {
            for (var i = 0, li = subtitleMesh.children.length; i < li; ++i) 
            {
                for (var j = 0, lj = subtitleMesh.children[i].children.length; j < lj; ++j)
                {
                    if (subtitleMesh.children[i].children[j].name == 'left') subtitleMesh.children[i].children[j].visible = pos == 'left' ? true : false;
                    else if (subtitleMesh.children[i].children[j].name == 'right') subtitleMesh.children[i].children[j].visible = pos == 'right' ? true : false;
                }
            }
        }
    };

    this.changeSignIndicator = function(pos)
    {
        if (signMesh)
        {
            for (var i = 0, l = signMesh.children.length; i < l; ++i) 
            {
                if (signMesh.children[i].name == 'left') signMesh.children[i].visible = pos == 'left' ? true : false;
                else if (signMesh.children[i].name == 'right') signMesh.children[i].visible = pos == 'right' ? true : false;
            }
        }
    };

    this.changeSignPosition = function(pos) 
    {
        if (signMesh && ((pos == 'left' && signMesh.position.x > 0) || (pos == 'right' && signMesh.position.x < 0)))
        {
            signMesh.position.x = signMesh.position.x * -1;
        }
    };

//************************************************************************************
// Experimental
//************************************************************************************

    this.createCubeGeometry65 = function(url, name) 
    {
        var geometry = getCubeGeometry65();  
        var cube = getVideoMesh( geometry, url, name, 0 );

        mainMesh = cube;

        scene.add( cube );
    };

    this.createCubeGeometry116 = function(url, name) 
    {
        var geometry = getCubeGeometry116();  

        var cube = getVideoMesh( geometry, url, name, 0 );      

        /*var loader = new THREE.TextureLoader();
        var texture = loader.load( url );
        //texture.minFilter = THREE.LinearFilter;
        //texture.format = THREE.RGBAFormat;
        
        // Using THREE.NearestFilter (instead of THREE.LinearFilter) avoids noise lines.
        texture.minFilter = THREE.NearestFilter;
        
        // Clamp
        texture.format = THREE.RGBAFormat;       

        var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.FrontSide });
        var cube = new THREE.Mesh(geometry, material);

        cube.renderOrder = 0;
        cube.visible = true;*/

        mainMesh = cube;

        scene.add( cube );
    };
}

THREE.MediaObject.prototype.constructor = THREE.MediaObject;