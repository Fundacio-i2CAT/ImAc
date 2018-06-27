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

    function getVideObject(id, url, type) 
    {
        var vid = document.createElement( "video" );     
        vid.muted = true;
        vid.autoplay = false;
        vid.loop = true;

        if ( type == 'dash' )
        {
            var player = dashjs.MediaPlayer().create();
            player.initialize( vid, url, true );
            player.getDebug().setLogToBrowserConsole( false );
            var objVideo = { id: id, vid: vid, dash: player };
        }
        else if ( type == 'hls' )
        {
            if ( Hls.isSupported() ) 
            {
                var hls = new Hls();
                hls.loadSource( url );
                hls.attachMedia( vid );
                hls.on( Hls.Events.MANIFEST_PARSED, function() { vid.play() } );
                var objVideo = { id: id, vid: vid };
            }
            else if ( vid.canPlayType( 'application/vnd.apple.mpegurl' ) ) 
            {
                vid.src = url;
                vid.addEventListener( 'loadedmetadata', function() { vid.play() } );
                var objVideo = { id: id, vid: vid };
            }           
        }
        else
        {
            vid.src = url;
            var objVideo = { id: id, vid: vid };
        }

        listOfVideoContents.push( objVideo );

        return vid;
    }

    function syncVideos()
    {
        for ( var i = 1, l = listOfVideoContents.length; i < l; i++ )
        {
            listOfVideoContents[i].vid.currentTime = listOfVideoContents[0].vid.currentTime;
        }
    }

    function getVideoMesh(geometry, url, type, name, order) 
    {
        var texture = new THREE.VideoTexture( getVideObject( name, url, type ) );
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

        mesh.position.z = 0.1;
        mesh.visible = false;
        
        return mesh;
    }

    function getPlayMesh(w, h, c)
    {
        var arrowShape = new THREE.Shape();

        arrowShape.moveTo( -w/2.5, -h/2 );
        arrowShape.quadraticCurveTo ( -w/2.5, -h/2, -w/2.5, h/2 );
        arrowShape.quadraticCurveTo ( -w/2.5, h/2, w/2, 0 );
        arrowShape.quadraticCurveTo ( w/2, 0, -w/2.5, -h/2 );

        var coliderMesh = new THREE.Mesh( new THREE.PlaneGeometry(w*2, h*2), new THREE.MeshBasicMaterial({visible: false}));
        var geometry = new THREE.ShapeGeometry( arrowShape );
        var material = new THREE.MeshBasicMaterial( { color: c } );
        var mesh = new THREE.Mesh( geometry, material ) ;

        coliderMesh.name = 'btnPlay';
        interController.addInteractiveObject(coliderMesh);
        mesh.add(coliderMesh);
        
        mesh.position.z = 0.01;
        //mesh.visible = true;
        //mesh.name = 'btnPlay';
        
        return mesh;
    }

    function getPauseMesh(w, h, c)
    {
        var group = new THREE.Group();

        var arrowShape = new THREE.Shape();

        arrowShape.moveTo( -w/8, -h/2 );
        arrowShape.quadraticCurveTo ( -w/8, -h/2, -3*w/8, -h/2 );
        arrowShape.quadraticCurveTo ( -3*w/8, -h/2, -3*w/8, h/2 );
        arrowShape.quadraticCurveTo ( -3*w/8, h/2, -w/8, h/2 );
        arrowShape.quadraticCurveTo ( -w/8, h/2, -w/8, -h/2 );

        var geometry = new THREE.ShapeGeometry( arrowShape );
        var material = new THREE.MeshBasicMaterial( { color: c } );
        var mesh1 = new THREE.Mesh( geometry, material ) ;

        group.add(mesh1);

        var arrowShape = new THREE.Shape();

        arrowShape.moveTo( w/8, -h/2 );
        arrowShape.quadraticCurveTo ( w/8, -h/2, 3*w/8, -h/2 );
        arrowShape.quadraticCurveTo ( 3*w/8, -h/2, 3*w/8, h/2 );
        arrowShape.quadraticCurveTo ( 3*w/8, h/2, w/8, h/2 );
        arrowShape.quadraticCurveTo ( w/8, h/2, w/8, -h/2 );

        var geometry = new THREE.ShapeGeometry( arrowShape );
        var material = new THREE.MeshBasicMaterial( { color: c } );
        var mesh2 = new THREE.Mesh( geometry, material ) ;

        group.add(mesh2);

        group.position.z = 0.01;
        group.visible = true;

        group.name = 'btnPause';
        
        return group;
    }

    function getSeekMesh(w, h, c)
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

        var geometry = new THREE.ShapeGeometry( arrowShape );
        var material = new THREE.MeshBasicMaterial( { color: c } );
        var mesh = new THREE.Mesh( geometry, material ) ;

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
        textplane.position.z = 0.1;
               
        var material = new THREE.MeshBasicMaterial( { color: t.backgroundColor, transparent: true, opacity: o } );
        var geometry = new THREE.PlaneGeometry( xMid+4, 8.7 ); 
        var mesh = new THREE.Mesh( geometry, material );

        mesh.add( textplane );

        if ( i == l-1 && c.subtitleIndicator == 'compass' )
        {
            // right compass
            var imgGeometry = new THREE.PlaneGeometry( 6.7, 6.7 );
            var compass = getImageMesh( imgGeometry, './img/compass_r.png', 'right', 4 );
            compass.add( getBackgroundMesh ( 9.7, 8.7, t.backgroundColor, o ) );
            compass.position.z = 0.1;
            compass.position.x = xMid/2 + 6.8;
            compass.visible = false;

            mesh.add( compass );

            // lesft compass
            var imgGeometry = new THREE.PlaneGeometry( 6.7, 6.7 );
            var compass = getImageMesh( imgGeometry, './img/compass_l.png', 'left', 4 );
            compass.add( getBackgroundMesh ( 9.7, 8.7, t.backgroundColor, o ) );
            compass.position.z = 0.1;
            compass.position.x = -(xMid/2 + 6.8);
            compass.visible = false;

            mesh.add( compass );

        }
        else if ( i == l-1 && c.subtitleIndicator == 'arrow' )
        {
            // right arrow
            var arrow = getArrowMesh( 6.7, 6.7, t.color );
            arrow.add( getBackgroundMesh ( 9.7, 8.7, t.backgroundColor, o ) );
            arrow.position.x = xMid/2 + 6.8;
            arrow.name = 'right';

            mesh.add( arrow );

            // left arrow
            var arrow = getArrowMesh( 6.7, 6.7, t.color );
            arrow.rotation.z = Math.PI;
            arrow.add( getBackgroundMesh ( 9.7, 8.7, t.backgroundColor, o ) );
            arrow.position.x = -(xMid/2 + 6.8);
            arrow.name = 'left';

            mesh.add( arrow );
        }

        mesh.scale.set( c.size,c.size,c.size );

        mesh.position.z = - c.z;
        mesh.position.y = c.displayAlign == 1 ? c.y - (9.57 * i * c.size) : c.y + (9.57 * (l-1-i) * c.size); //c.displayAlign == 'before'
        mesh.position.x = c.x * (49 - xMid/2);

        mesh.renderOrder = 3;
        mesh.visible = true;

        return mesh;
    }

    function removeContentById(id)
    {
        for ( var i = 0, len = listOfVideoContents.length; i < len; i++ )
        {
            if ( listOfVideoContents[i].id == id )
            {
                listOfVideoContents.splice( i, 1 );
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
        for ( var i = 0, len = listOfVideoContents.length; i < len; i++ ) 
        {
            listOfVideoContents[i].vid.play();
        }
        syncVideos();
    };

    this.pauseAll = function()
    {
        for ( var i = 0, len = listOfVideoContents.length; i < len; i++ ) 
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

    this.createSphericalVideoInScene = function(url, type, name) 
    {
        var geometry = new THREE.SphereBufferGeometry( 100, 32, 16, Math.PI/2 );

        geometry.scale( - 1, 1, 1 );
        var sphere = getVideoMesh( geometry, url, type, name, 0 );

        mainMesh = sphere;

        scene.add( sphere );
    };

    this.createSignVideo = function(url, type, name, config) 
    {
        var geometry = new THREE.PlaneGeometry( config.size, config.size );
        var plane = getVideoMesh( geometry, url, type, name, 1 );

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
        backgroundMesh.visible = signIndicator == 'arrow' ? true : false;

        plane.add( backgroundMesh );

        plane.position.z = - config.z;
        plane.position.x = config.x;
        plane.position.y = config.y;

        signMesh = plane;

        camera.add( plane );
    };

    this.createImageInCamera = function(url, name, config) 
    {
        var geometry = new THREE.PlaneGeometry( config.w, config.h );
        var plane = getImageMesh( geometry, url, name, 5 );
        plane.position.z = -0.5;
        plane.visible = config.visible;

        if ( imageMesh ) {
            var imgMesh = imageMesh;
            setTimeout(function() {
                camera.remove( imgMesh );
            }, 300);
        }

        imageMesh = plane;

        camera.add( plane );
    };

    this.createSubtitle = function(textList, config)
    {
        var group = new THREE.Group();

        for ( var i = 0, len = textList.length; i < len; ++i ) 
        {
            config.x = config.textAlign == 0 ? 0 : config.textAlign == -1 ? -config.size : config.size;

            var mesh = getSubMesh( textList[i], config, 0.8, len, i );            
            mesh.name = i;

            group.add( mesh );
        }
        
        subtitleMesh = group;

        camera.add( group );
    };

//************************************************************************************
// Media Object Destructors
//************************************************************************************

    this.removeSubtitle = function()
    {
        camera.remove( subtitleMesh );
        subtitleMesh = undefined;
    };

    this.removeSignVideo = function()
    {
        removeContentById( signMesh.name );
        camera.remove( signMesh );
        signMesh = undefined;
    };

    this.removeInfoImage = function()
    {
        camera.remove( imageMesh );
        imageMesh = undefined;
    };

//************************************************************************************
// Media Object Position Controller
//************************************************************************************

    this.changeSubtitleIndicator = function(pos)
    {
        if ( subtitleMesh )
        {
            for ( var i = 0, li = subtitleMesh.children.length; i < li; ++i ) 
            {
                for ( var j = 0, lj = subtitleMesh.children[i].children.length; j < lj; ++j )
                {
                    if ( subtitleMesh.children[i].children[j].name == 'left' ) subtitleMesh.children[i].children[j].visible = pos == 'left' ? true : false;
                    else if ( subtitleMesh.children[i].children[j].name == 'right' ) subtitleMesh.children[i].children[j].visible = pos == 'right' ? true : false;
                }
            }
        }
    };

    this.changeSignIndicator = function(pos)
    {
        if ( signMesh )
        {
            for ( var i = 0, l = signMesh.children.length; i < l; ++i ) 
            {
                if ( signMesh.children[i].name == 'left' ) signMesh.children[i].visible = pos == 'left' ? true : false;
                else if ( signMesh.children[i].name == 'right' ) signMesh.children[i].visible = pos == 'right' ? true : false;
            }
        }
    };

    this.changeSignPosition = function(pos) 
    {
        if ( signMesh && ( ( pos == 'left' && signMesh.position.x > 0 ) || ( pos == 'right' && signMesh.position.x < 0 ) ) )
        {
            signMesh.position.x = signMesh.position.x * -1;
        }
    };

//************************************************************************************
// Experimental
//************************************************************************************

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

        coliderMesh.name = 'closeButton';
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

        coliderMesh.name = 'closeButton';
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

        coliderMesh.name = 'closeButton';
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
        var closeMesh = new THREE.Mesh( geometry, material ) ;

        coliderMesh.name = 'closeButton';
        interController.addInteractiveObject(coliderMesh);
        closeMesh.add(coliderMesh);
        closeMesh.position.z = 0.01;

        return closeMesh;
    }

    this.createVolumeChangeMenu = function(menu)
    {
        var plusVolume = getPlusIconMesh( 20, 20, 0xffffff );
        var audioIcon = getImageMesh( new THREE.PlaneGeometry( 150,150 ), './img/menu/audio_volume_icon.png', 'right', 4 );
        var minusVolume = getMinusIconMesh( 20, 20, 0xffffff );

        plusVolume.position.x = 130;
        minusVolume.position.x = -130;
        
        audioIcon.position.z = 1;

        menu.add( plusVolume );
        menu.add( audioIcon );
        menu.add( minusVolume );

        menu.scale.set(0.05,0.05,1);
        menu.position.set(0, 0, -10);

        scene.add( menu );
    }


    this.createSettingsCardboardMenu = function(menu)
    {
        var settingsIcon = getImageMesh( new THREE.PlaneGeometry( 120, 120 ), './img/menu/cog_icon.png', 'right', 4 );
        var cardboardIcon = getImageMesh( new THREE.PlaneGeometry( 120, 80 ), './img/menu/cardboard_icon.png', 'right', 4 );


        cardboardIcon.position.x = 80;
        settingsIcon.position.x = -80;
        
        menu.add( cardboardIcon );
        menu.add( settingsIcon );

        menu.scale.set(0.05,0.05,1);
        menu.position.set(0, 0, -10);

        scene.add( menu );
    }

    this.createPlaySeekMenu = function(menu)
    {
        //var playPusebutton = moData.isPausedById(0) ? getPauseMesh(140, 140, 0xffffff) : getPlayMesh(140, 140, 0xffffff);
        var playPausebutton = getPlayMesh(140, 140, 0xffffff);
        var seekBarR = getSeekMesh( 80, 40, 0xffffff );
        var seekBarL = getSeekMesh( 80, 40, 0xffffff );

        seekBarL.rotation.z = Math.PI;  
        seekBarR.position.x = 120;
        seekBarL.position.x = -120;

        menu.add( playPausebutton );
        menu.add( seekBarR );
        menu.add( seekBarL );

        menu.scale.set(0.05,0.05,1);
        menu.position.set(0, 0, -10);

        menu.name = 'playseekmenu';
        scene.add(menu);
    }

    this.removeEntity = function(name) {
        
        var selectedObject = scene.getObjectByName(name);
        selectedObject.children.forEach(function(elem1){
            elem1.children.forEach(function(elem2){
                interController.removeInteractiveObject(elem2.name);
            });
        });
        scene.remove(selectedObject);
    }

    this.createMenuBackground = function()
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

        return menu
    }


    this.createCubeGeometry65 = function(url, type, name) 
    {
        var geometry = getCubeGeometry65();  
        var cube = getVideoMesh( geometry, url, type, name, 0 );

        mainMesh = cube;

        scene.add( cube );
    };

    this.createCubeGeometry116 = function(url, type, name) 
    {
        var geometry = getCubeGeometry116();  
        var cube = getVideoMesh( geometry, url, type, name, 0 );      

        mainMesh = cube;

        scene.add( cube );
    };

    this.createControlBar = function()
    {
        var geometry = new THREE.CircleGeometry( 8, 32 );
        var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        var circle = new THREE.Mesh( geometry, material );

        var playbutton = getPlayMesh(10, 10, 0x000000);
        var seekBarR = getSeekBarMesh(15, 10, 0xffffff);
        var seekBarL = getSeekBarMesh(15, 10, 0xffffff);

        seekBarR.name = 'btnSeekR';
        seekBarL.name = 'btnSeekL';

        seekBarL.rotation.z = Math.PI;
        seekBarR.position.x = 16;
        seekBarL.position.x = -16;

        circle.add( playbutton );
        circle.add( seekBarR );
        circle.add( seekBarL );

        circle.scale.set( 0.05,0.05,1 );

        circle.position.z = -10;
        circle.position.x = 0;
        circle.position.y = 0;

        circle.lookAt(new THREE.Vector3(0, 0, 0));

        circle.renderOrder = 5;
        circle.name = 'playpause';

        scene.add( circle );

        return circle;
    };

    this.createButton1 = function()
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
        circle.name = 'button1';

        scene.add( circle );

        return circle;
    };

    /*this.createButton2 = function()
    {
        var geometry = new THREE.CircleGeometry( 8, 32 );
        var material = new THREE.MeshBasicMaterial( { color: 0xc900c2 } );
        var circle = new THREE.Mesh( geometry, material );

        circle.scale.set( 0.05,0.05,1 );

        circle.position.z = 1;
        circle.position.x = 0;
        circle.position.y = -4;

        circle.lookAt(new THREE.Vector3(0, 0, 0));

        circle.renderOrder = 5;
        circle.name = 'button2';

        scene.add( circle );

        return circle;
    };

    this.createButton3 = function()
    {
        var geometry = new THREE.CircleGeometry( 8, 32 );
        var material = new THREE.MeshBasicMaterial( { color: 0x330031 } );
        var circle = new THREE.Mesh( geometry, material );

        circle.scale.set( 0.05,0.05,1 );

        circle.position.z = 1;
        circle.position.x = 1;
        circle.position.y = -4;

        circle.lookAt(new THREE.Vector3(0, 0, 0));

        circle.renderOrder = 5;
        circle.name = 'button3';

        scene.add( circle );

        return circle;
    };

    this.createButton4 = function()
    {
        var geometry = new THREE.CircleGeometry( 8, 32 );
        var material = new THREE.MeshBasicMaterial( { color: 0x420008 } );
        var circle = new THREE.Mesh( geometry, material );

        circle.scale.set( 0.05,0.05,1 );

        circle.position.z = 1;
        circle.position.x = 2;
        circle.position.y = -4;

        circle.lookAt(new THREE.Vector3(0, 0, 0));

        circle.renderOrder = 5;
        circle.name = 'button4';

        scene.add( circle );

        return circle;
    };

    this.createButton5 = function()
    {
        var geometry = new THREE.CircleGeometry( 8, 32 );
        var material = new THREE.MeshBasicMaterial( { color: 0x5b3300 } );
        var circle = new THREE.Mesh( geometry, material );

        circle.scale.set( 0.05,0.05,1 );

        circle.position.z = 1;
        circle.position.x = 3;
        circle.position.y = -4;

        circle.lookAt(new THREE.Vector3(0, 0, 0));

        circle.renderOrder = 5;
        circle.name = 'button5';

        scene.add( circle );

        return circle;
    };

    this.createButton6 = function()
    {
        var geometry = new THREE.CircleGeometry( 8, 32 );
        var material = new THREE.MeshBasicMaterial( { color: 0x895513 } );
        var circle = new THREE.Mesh( geometry, material );

        circle.scale.set( 0.05,0.05,1 );

        circle.position.z = -10;
        circle.position.x = 4;
        circle.position.y = -4;

        circle.lookAt(new THREE.Vector3(0, 0, 0));

        circle.renderOrder = 5;
        circle.name = 'button6';

        scene.add( circle );

        return circle;
    };*/

}

THREE.MediaObject.prototype.constructor = THREE.MediaObject;