/**
 * @author isaac.fraile@i2cat.net
 */

'use strict'

THREE.MeshGenerator = function () 
{
    var subtitleFont;

    this.setFont = function( url )
    {
        return new Promise((resolve, reject) => {
            let loader = new THREE.FontLoader();
            loader.load( url, function ( font ) {
                subtitleFont = font;
                resolve();
            });
        });
    }

    this.getVideo360Mesh = function( video, type="ERP", size=1000 ) 
    {
        let mesh;

        switch ( type ) 
        {
            case "ERP":
            default:
                let geometry = new THREE.SphereBufferGeometry( size, 32, 32, Math.PI/2 );
                geometry.scale( - 1, 1, 1 );
                
                return createVideoMesh( video, geometry );

            case "CMP32":
                mesh = createVideoMesh( video, getCubeGeometry32( size ) );
                mesh.rotation.y = -Math.PI/2;

                return mesh;

            case "CMP65":
                mesh = createVideoMesh( video, getCubeGeometry65( size ) );
                mesh.rotation.y = -Math.PI/2;

                return mesh;

            case "CMP116":
                mesh = createVideoMesh( video, getCubeGeometry116( size ) );
                mesh.rotation.y = -Math.PI/2;

                return mesh;
        }
    }

    this.getVideoMesh = function( video, aspect="16:9", size=10 )
    {
        let par = aspect.split(':');
        par = par.length == 2 ? par : ["16", "9"];

        return createVideoMesh( video, new THREE.PlaneGeometry( par[0]*size, par[1]*size ) );
    }

    this.getImage360Mesh = function( img, type="ERP", size=1000 )
    {
        let mesh;

        switch ( type ) 
        {
            case "ERP":
            default:
                let geometry = new THREE.SphereBufferGeometry( size, 32, 32, Math.PI/2 );
                geometry.scale( - 1, 1, 1 );
                
                return createImageMesh( img, geometry );

            case "CMP32":
                mesh = createImageMesh( img, getCubeGeometry32( size ) );
                mesh.rotation.y = -Math.PI/2;

                return mesh;

            case "CMP65":
                mesh = createImageMesh( img, getCubeGeometry65( size ) );
                mesh.rotation.y = -Math.PI/2;

                return mesh;

            case "CMP116":
                mesh = createImageMesh( img, getCubeGeometry116( size ) );
                mesh.rotation.y = -Math.PI/2;

                return mesh;
        }
    }

    this.getImageMesh = function( img, aspect="16:9", size=10 )
    {
        let par = aspect.split(':');
        par = par.length == 2 ? par : ["16", "9"];

        return createImageMesh( img, new THREE.PlaneGeometry( par[0]*size, par[1]*size ) );
    }

    this.getColor360Mesh = function( color=0xffff00, opacity=1, size=1000 ) 
    {
        let geometry = new THREE.SphereBufferGeometry( size, 32, 32, Math.PI/2 );
        geometry.scale( - 1, 1, 1 );
        
        return new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: color, transparent: true, opacity: opacity } ) );
    }

    this.getColorMesh = function( color=0xffff00, opacity=1, aspect="16:9", size=10 ) 
    {
        let par = aspect.split(':');
        par = par.length == 2 ? par : ["16", "9"];
        
        return new THREE.Mesh( new THREE.PlaneGeometry( par[0]*size, par[1]*size ), new THREE.MeshBasicMaterial( { color: color, transparent: true, opacity: opacity } ) );
    }

    this.getPointerMesh = function()
    {
        let pointer = getPointMesh( 0.02, 16, 0xffff00, 1 );

        pointer.position.z = -4;
        pointer.name = 'pointer';
        pointer.visible = false;

        return pointer;
    }

    this.getPointer2Mesh = function()
    {
        var pointer1 = getPointMesh( 0.002, 16, 0xffff00, 0 );
        var pointer2 = getPointMesh( 0.06, 32, 0xffff00, 1 );

        pointer1.add( pointer2 );

        pointer1.position.x = 0.155
        pointer1.position.y = 1.21
        pointer1.position.z = -0.15

        pointer1.name = 'pointer2';
        pointer1.visible = false;

        return pointer1;
    }

    this.getSignerMesh = function( video, x, y, scaleFactor, size=20, st4sl=undefined ) 
    {
        let signer =  new THREE.Group();
        signer.name = 'signer';
        signer.visible = false;
        signer.position.set( x, y, 0 );        

        let videoMesh = createVideoMesh( video, new THREE.PlaneGeometry( size, size ) );
        videoMesh.name = 'sl-video';
        videoMesh.scale.set( scaleFactor, scaleFactor, 1);

        if ( st4sl ) signer.add( st4sl );

        signer.add( getBorderMesh( size, size, 'sl-colorFrame' ) );
        signer.add( videoMesh );
 
        return signer;
    }

    // revisar parametres a pasar a createSubtitleMesh
    this.getSubtitleMesh = function ( t, font, isSL, name )
    {
        return createSubtitleMesh( t, font, isSL, name );
    }

    // revisar parametres a pasar a createSubtitleMesh
    this.getST4SLMesh = function( textList )
    {
        let font = textList[0].text.length < 12 ? "500 40px Roboto, Arial" : textList[0].text.length < 16 ? "500 35px Roboto, Arial" : "500 30px Roboto, Arial";

        return createSubtitleMesh( textList, font, true, 'sl-subtitles' );
    }

    // revisar -> eliminar crides a variables externes stConfig
    this.getSpeakerSubtitleMesh = function( textList, position='center', arrow=false )
    {
        let group = new THREE.Group();

        // position, indicator, indx, indy, indz, stx, sty, stz, rotationy


        var target = new THREE.Vector3();
        var camView = camera.getWorldDirection( target );
        var offset = camView.z >= 0 ? 180 : -0;

        var dist = Math.sqrt( Math.pow( camView.x,2 ) + Math.pow( camView.y,2 ) + Math.pow( camView.z,2 ) );
        var lon = Math.degrees( Math.atan( camView.x/camView.z ) ) + offset;
        var lat = Math.degrees( Math.asin( camView.y/-dist ) );

        lon = lon > 0 ? 360 - lon : - lon;

        if ( position != 'center' && stConfig.indicator.localeCompare('arrow') === 0) 
        {
            var isRight = position == 'right' ? true : false;   
            var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 0.001, 0.001 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
            setFixedArrow( mesh, 0, textList, isRight, opacity );

            mesh.position.x = 80 * Math.cos( Math.radians( lon-90 -stConfig.scenePos.lon) ) * Math.cos( Math.radians( -lat -20) );
            mesh.position.y = 80 * Math.sin( Math.radians( -lat -20) );
            mesh.position.z = 80 * Math.sin( Math.radians( lon-90 -stConfig.scenePos.lon) ) * Math.cos( Math.radians( -lat -20) );

            mesh.lookAt(0,0,0)

            group.add( mesh )
        }

        var needajust = false;
        if ( stConfig.scenePos.lon ) {}
        else {
            stConfig.scenePos.lon = lon;
            stConfig.scenePos.lat = -lat;
            needajust = true;
        }

        var stmesh = getSpeakerSubMesh( textList, ST_font ) 

        if ( needajust ) 
        {
            stmesh.position.x = 80 * Math.cos( Math.radians( stConfig.scenePos.lat ) ) * Math.cos( Math.radians( lon-90 -stConfig.scenePos.lon) ) * Math.cos( Math.radians( -lat -20) );
            stmesh.position.y = 80 * Math.cos( Math.radians( stConfig.scenePos.lat ) ) * Math.sin( Math.radians( -lat -20) );
            stmesh.position.z = 80 * Math.cos( Math.radians( stConfig.scenePos.lat ) ) * Math.sin( Math.radians( lon-90 -stConfig.scenePos.lon) ) * Math.cos( Math.radians( -lat -20) );

            stmesh.lookAt(0,0,0)
        }

        group.add( stmesh );      
        group.rotation.y = Math.radians( -stConfig.scenePos.lon );
        group.name = 'subtitles';

        return group;
    };

    // revisar quins paremetres s'han de pasar a createSubtitleMesh
    this.getSceneFixedSubtitles = function( textList, stReps )
    {
        let group = new THREE.Group();

        for ( let i = 0; i < stReps ; i++ ) 
        {
            let mesh = createSubtitleMesh( textList, "500 40px Roboto, Arial", false, 'fixed-st-' + i );

            mesh.rotation.y = Math.radians( i*( 360/stReps ) );
            group.add( mesh );
        }

        group.name = 'subtitles';
        group.position.y = -20;

        return group;
    }

    // revisar si es necessari en el cas de deixar d'utilitzar reticulum
    this.getOpenMenuMesh = function()
    {
        let openMenuText = getTextMesh( "Menu", 22, 0xe6e6e6, "openmenutext" ); 

        openMenuText.position.y = 6;
        openMenuText.position.z = -60;
        openMenuText.scale.set( 0.15, 0.15, 1 )
        openMenuText.visible = false;

        return openMenuText;
    }

    this.getLine = function( c, startvector, endvector )
    {    
        let material = new THREE.LineBasicMaterial( { color: c } );
        let geometry = new THREE.Geometry();

        geometry.vertices.push( startvector, endvector );

        return new THREE.Line( geometry, material );
    }

    this.getCurvedLine = function( c, startvector, control, endvector )
    {
        let curve = new THREE.QuadraticBezierCurve3( startvector, control, endvector );
        let points = curve.getPoints( 50 );

        return new THREE.Line( 
            new THREE.BufferGeometry().setFromPoints( points ), 
            new THREE.LineBasicMaterial( { color : c } ) 
        );      
    }

    this.getRoundedRect = function( ctx, width, height, radius )
    {
        ctx.moveTo( -width/2, 0 );
        ctx.lineTo( -width/2, height/2 - radius );  
        ctx.quadraticCurveTo( -width/2, height/2, -width/2 + radius, height/2 );
        ctx.lineTo( width/2 - radius, height/2 );
        ctx.quadraticCurveTo( width/2, height/2, width/2, height/2 - radius );
        ctx.lineTo( width/2, -height/2 + radius );
        ctx.quadraticCurveTo( width/2, -height/2, width/2 - radius, -height/2 );
        ctx.lineTo( -width/2 + radius, -height/2 );
        ctx.quadraticCurveTo( -width/2,-height/2, -width/2,-height/2 + radius );
        
        return ctx;
    }

    this.getTextMesh = function()
    {

    }
    
    function createVideoMesh( video, geometry ) 
    {
        let texture = new THREE.VideoTexture( video );
        texture.minFilter = THREE.LinearFilter;
        texture.format = THREE.RGBAFormat;

        return new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: texture, side: THREE.FrontSide } ) );
    }

    function createImageMesh( img, geometry ) 
    {
        let loader = new THREE.TextureLoader();
        let texture = loader.load( img );
        texture.minFilter = THREE.LinearFilter;
        texture.format = THREE.RGBAFormat;

        return new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: texture, transparent: true, side: THREE.FrontSide } ) );
    }

    function getCubeGeometryByVertexUVs( size, f, l, r, t, b, bo )
    {
        let geometry = new THREE.BoxGeometry( -size, size, size );
        
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

    function getCubeGeometry32( size )
    {
        /// Used to modify the cube UVs adding a threshold between the conflictive edges.
        /// 3x2 Texture UV vertices map:
        /// 
        ///       ^
        ///       |
        ///      0,1    +--------+--------+--------+
        ///       |     |02      |12      |22      |32
        ///       |     |        |        |        |
        ///       |     |        |        |        |
        ///       |     |01b     |11b     |21b     |31b
        ///      0,0.5  +--------+--------+--------+
        ///       |     |01a     |11a     |21a     |31a
        ///       |     |        |        |        |
        ///       |     |        |        |        |
        ///       |     |        |        |        |
        ///       |     +--------+--------+--------+
        ///       |      00       10       20       30 
        ///       |
        ///      0,0-------------|--------|-------1,0------->
        ///                      - one_third
        ///                               - two_third
        // cubemap UV points

        let threshold = 0.00002,
            one_third = .3333,
            two_third = .6666;

        let _00 = new THREE.Vector2( 0, 0 ),
            _01a = new THREE.Vector2( 0, .5 - threshold ),
            _01b = new THREE.Vector2( 0, .5 + threshold ),
            _02 = new THREE.Vector2( 0, 1 ),

            _10 = new THREE.Vector2( one_third, 0 ),
            _11a = new THREE.Vector2( one_third, .5 - threshold ),
            _11b = new THREE.Vector2( one_third, .5 + threshold ),
            _12 = new THREE.Vector2( one_third, 1 ),

            _20 = new THREE.Vector2( two_third, 0 ),
            _21a = new THREE.Vector2( two_third, .5 - threshold ),
            _21b = new THREE.Vector2( two_third, .5 + threshold ),
            _22 = new THREE.Vector2( two_third, 1 ),

            _30 = new THREE.Vector2( 1, 0 ),
            _31a = new THREE.Vector2( 1, .5 - threshold ),
            _31b = new THREE.Vector2( 1, .5 + threshold ),
            _32 = new THREE.Vector2( 1, 1 );

        /// map the faces
        let face_front = [ _12, _11b, _21b, _22 ],
            face_back = [ _21a, _11a, _10, _20 ],
            face_top = [ _21a, _20,_30, _31a ],
            face_bottom = [  _10, _11a, _01a, _00 ],
            face_right = [ _22, _21b, _31b, _32 ],
            face_left = [ _02, _01b, _11b, _12 ];

        return getCubeGeometryByVertexUVs( size, face_front, face_left, face_right, face_top, face_back, face_bottom );
    }

    function getCubeGeometry65( size )
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
        var face_right  = [ _54a, _53b, _63b, _64a ];
        var face_left  = [ _55b, _54b, _64b, _65 ];    
        var face_top  = [ _52b, _62b, _63a, _53a ];
        var face_back  = [ _52a, _51b, _61b, _62b ];
        var face_bottom  = [ _61a, _51a, _50b, _60 ]; 

        return getCubeGeometryByVertexUVs( size, face_front, face_left, face_right, face_top, face_back, face_bottom );
    }

    function getCubeGeometry116( size )
    {
        /* 11x6 Texture UV vertices map:
         /// 
         ///       ^
         ///       |
         ///      0,1    +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
         ///       |     |06    16    26    36    46    56   |66b   76    86   |96b   106  |116 
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
         ///       |     |                                60a|60b           90a|90b        |110
         ///       |     +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
         ///       |      00    10    20    30    40    50    60    70    80    90    100   110
         ///       |
         ///      0,0----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----1,0--->
         ///                                                  0.5454            0.8181
         ///
        */ 
        // cubemap UV points
        var threshold = 0.0002;

        var _00 = new THREE.Vector2( 0, 0 );
        var _06 = new THREE.Vector2( 0, 1 );

        var _60a = new THREE.Vector2( 6/11 - threshold, 0 );
        var _60b = new THREE.Vector2( 6/11 + threshold, 0 );
        var _63a = new THREE.Vector2( 6/11 + threshold, 0.5 - threshold *2 );
        var _63b = new THREE.Vector2( 6/11 + threshold, 0.5 + threshold *2 );
        var _66a = new THREE.Vector2( 6/11 - threshold, 1 );
        var _66b = new THREE.Vector2( 6/11 + threshold, 1 );

        var _90a = new THREE.Vector2( 9/11 - threshold, 0 );
        var _90b = new THREE.Vector2( 9/11 + threshold, 0 );
        var _92a = new THREE.Vector2( 9/11 + threshold, 2/6 - threshold );
        var _92b = new THREE.Vector2( 9/11 + threshold, 2/6 + threshold );
        var _93a = new THREE.Vector2( 9/11 - threshold, 0.5 - threshold *2 );
        var _93b = new THREE.Vector2( 9/11 - threshold, 0.5 + threshold *2 );
        var _94a = new THREE.Vector2( 9/11 + threshold, 4/6 - threshold );
        var _94b = new THREE.Vector2( 9/11 + threshold, 4/6 + threshold );
        var _96a = new THREE.Vector2( 9/11 - threshold, 1 );
        var _96b = new THREE.Vector2( 9/11 + threshold, 1 );

        var _110 = new THREE.Vector2( 1, 0 );
        var _112a = new THREE.Vector2( 1, 2/6 - threshold );
        var _112b = new THREE.Vector2( 1, 2/6 + threshold );
        var _114a = new THREE.Vector2( 1, 4/6 - threshold );
        var _114b = new THREE.Vector2( 1, 4/6 + threshold );
        var _116 = new THREE.Vector2( 1, 1 );

        /// map the faces
        var face_front = [ _06, _00, _60a, _66a ];
        var face_left = [ _66b, _63b, _93b, _96a ];
        var face_right = [ _63a, _60b, _90a, _93a ];
        var face_top = [ _94b, _114b, _116, _96b ];
        var face_back = [ _94a, _92b, _112b, _114a ];
        var face_bottom = [ _112a, _92a, _90b, _110 ];

        return getCubeGeometryByVertexUVs( size, face_front, face_left, face_right, face_top, face_back, face_bottom );
    }

    function getPointMesh( w, h, color=0xffff00, opacity=1 ) 
    {
        let pointer = new THREE.Mesh(
            new THREE.SphereBufferGeometry( w, h, 8 ),
            new THREE.MeshBasicMaterial( { color: color, transparent: true, opacity: opacity } )
        );

        return pointer;
    }

    function getBorderMesh( w, h, name )
    {
        let colorBorderMesh = new THREE.Mesh( 
            new THREE.PlaneGeometry( w, h, 32 ), 
            new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} ) 
        );

        colorBorderMesh.position.z = -0.01;
        colorBorderMesh.name = name;
        colorBorderMesh.visible = false;

        return colorBorderMesh;
    }

    function createCanvasFillRect( ctx, x, y, w, h, o )
    {
        ctx.fillStyle = 'rgba(0,0,0,' + o + ')';
        ctx.fillRect( x, y, w, h );
    }

    function createCanvasTextLine( ctx, text, font, color, x, y, w, h, o, fw, fh )
    {
        ctx.font = font;
        if ( o != 0 ) createCanvasFillRect( ctx, x, y, w, h, o );
        createCanvasText( ctx, text, font, color, fw, fh );
        if ( o == 0 ) createCanvasStrokeText( ctx, text, fw, fh );
    }

    function createCanvasStrokeText( ctx, text, w, h )
    {
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.strokeText( text, w, h );
    }

    function createCanvasText( ctx, text, font, color, w, h )
    {
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.fillText( text, w, h );
    }

    function getBackgroundMesh( w, h, c, o )
    {
        return new THREE.Mesh( 
            new THREE.PlaneGeometry( w, h ), 
            new THREE.MeshBasicMaterial( { color: c, transparent: true, opacity: o } ) 
        );
    }

    function setFixedArrow( mesh, cw, t, right, opacity )
    {
        let geometry = new THREE.PlaneGeometry( 6.5, 6.5 );
        let name = right ? 'right' : 'left';
        let arrow = getImageMesh( geometry, './img/arrow_final.png', name, 3 );

        arrow.material.color.set( t[0].color );

        if ( !right ) arrow.rotation.z = Math.PI;

        let arrowback = getBackgroundMesh ( geometry.parameters.width * 1.5, 8.4, t[0].backgroundColor, opacity );
        arrowback.position.z = -0.01;
        arrow.add( arrowback );
        mesh.add( arrow );
    }

    // revisar -> eliminar crides a variables externes stConfig
    // getSubtitleMesh, getST4SLMesh, getSceneFixedSubtitles
    function createSubtitleMesh( t, font, isSL, name ) 
    {
        let stGroup = new THREE.Group();

        stGroup.name = name;


        const opacity = (isSL) ? 0.75 : stConfig.background;
        let scaleFactor = 1;

        let cnv = isSL ? document.getElementById( "canvas2" ) : document.getElementById( "canvas" );
        let ctx = cnv.getContext( "2d" );
        let ch = 50; // canvas height x line
        let fh = 40; // font height 
        
        ctx.font = font;

        let width = ctx.measureText( t[0].text ).width;
        let width2;

        if(!isSL){
            width2 = t[1] ? ctx.measureText( t[1].text ).width : 0;
            cnv.width = ( width > width2 ) ? width + 20 : width2 + 20;
            cnv.height = ch*t.length;
        } else{ 
            cnv.width = 260;
            cnv.height = ch;
        }

        stConfig.width = cnv.width/6;
        stConfig.height = ch*t.length/6; 

        if ( t[0] ) createCanvasTextLine( ctx, t[0].text, font, t[0].color, 0, 0, cnv.width, ch, opacity, ( cnv.width - width )/2, fh );
        if ( t[1] ) createCanvasTextLine( ctx, t[1].text, font, t[1].color, 0, ch, cnv.width, ch, opacity, ( cnv.width - width2 )/2, fh + ch );

        let material = new THREE.MeshBasicMaterial( { map: new THREE.CanvasTexture( cnv ),  transparent: true } );
        let textMesh = new THREE.Mesh( new THREE.PlaneGeometry( stConfig.width, stConfig.height ), material );
        textMesh.name = 'emojitext';
        textMesh.visible = true;

        let arrows = getSubtitlesArrowMesh( 6.5, t.length, t[0].color, t[0].backgroundColor, (!imsc1doc_SL && !stConfig.isEnabled) ? 0 : opacity );

        if (isSL){//&& !imsc1doc_SL){
            scaleFactor = _isHMD ? 0.8*(slConfig.size/textMesh.geometry.parameters.width) : (slConfig.size/textMesh.geometry.parameters.width);
            stGroup.position.y =  _isHMD ? 0.825 *-(slConfig.size + textMesh.geometry.parameters.height*scaleFactor)/2 : -(slConfig.size + textMesh.geometry.parameters.height*scaleFactor)/2;
            stGroup.position.x = 0;
        } else {
            scaleFactor = _isHMD ? 0.8*(stConfig.area/130) * stConfig.size * (stConfig.easy2read ? 1.25 : 1) : (stConfig.area/130) * stConfig.size * (stConfig.easy2read ? 1.25 : 1);
            if(!stConfig.fixedSpeaker && !stConfig.fixedScene){
                let initY = stConfig.canvasPos.y * (vHeight*(1-safeFactor) - scaleFactor*stConfig.height)/2;

                //This will save the very 1st position.
                if(!stConfig.initPos){
                    stConfig.initPos = new THREE.Vector2(0, initY);
                }

                if(localStorage.getItem("stPosition")) {
                    let savedPosition = JSON.parse(localStorage.getItem("stPosition"));
                    stGroup.position.y = savedPosition.y;
                    stGroup.position.x = savedPosition.x;
                } else {
                    stGroup.position.y = initY;
                    stGroup.position.x = ((slConfig.isEnabled || stConfig.indicator.localeCompare('radar') === 0) ? _stMngr.removeOverlap(scaleFactor) : 0);
                }

                stGroup.add( getBorderMesh( stConfig.width+1, stConfig.height+1, 'st-colorFrame' ) );

            } else if(stConfig.fixedScene){
                textMesh.position.y = -20;
                textMesh.position.z = -75;
            }
        }

        stGroup.add(textMesh);
        stGroup.add(arrows);
        stGroup.scale.set(scaleFactor, scaleFactor, 1);

        return stGroup;
    };

    // revisar -> eliminar crides a variables externes stConfig
    function getSpeakerSubMesh( t, font )
    {
        var canvas = document.getElementById( "canvas" );
        var ctx = canvas.getContext( "2d" );
        var ch = 50; // canvas height x line
        var fh = 40; // font height

        ctx.font = font;
        var width = ctx.measureText( t[0].text ).width;
        var width2 = t[1] ? ctx.measureText( t[1].text ).width : 0;
        canvas.width = ( width > width2 ) ? width + 20 : width2 + 20;
        canvas.height = ch*t.length;

        if ( t[0] ) createCanvasTextLine( ctx, t[0].text, font, t[0].color, 0, 0, canvas.width, ch, stConfig.background, ( canvas.width - width )/2, fh );
        if ( t[1] ) createCanvasTextLine( ctx, t[1].text, font, t[1].color, 0, ch, canvas.width, ch, stConfig.background, ( canvas.width - width2 )/2, fh + ch );

        var material = new THREE.MeshBasicMaterial( { map: new THREE.CanvasTexture( canvas ),  transparent: true } );
        var mesh = new THREE.Mesh( new THREE.PlaneGeometry( canvas.width/6, ch*t.length/6 ), material );

        let esaySizeAjust = stConfig.easy2read ? 1.25 : 1;
        scaleFactor = _isHMD ? 0.8*(stConfig.area/130) * stConfig.size * esaySizeAjust : (stConfig.area/130) * stConfig.size * esaySizeAjust;
        mesh.scale.set( scaleFactor, scaleFactor, 1 );

        mesh.name = 'emojitext';
        mesh.renderOrder = 3;
        mesh.position.z = -80 * Math.cos( Math.radians( stConfig.scenePos.lat ) );
        mesh.position.y = 80 * Math.sin( Math.radians( stConfig.scenePos.lat ) );
        mesh.position.x = 0;
        mesh.visible = true;

        mesh.lookAt( 0, 0, 0 );

        return mesh;
    }

    function getTextMesh( text, size, color, name, func, cw, ch )
    {
        let textShape = new THREE.BufferGeometry();
        let textmaterial = new THREE.MeshBasicMaterial( { color: color} );
        let shapes = subtitleFont.generateShapes( text, size );
        let geometry = new THREE.ShapeGeometry( shapes );

        geometry.computeBoundingBox();
        textShape.fromGeometry( geometry );
        textShape.center();

        let mesh = new THREE.Mesh( textShape, textmaterial );

        let coliderMesh = new THREE.Mesh( 
            new THREE.PlaneGeometry( cw, ch ), 
            new THREE.MeshBasicMaterial( { visible: false } ) 
        );
        
        coliderMesh.name = name;
        coliderMesh.position.z = 0.06;

        if ( func ) coliderMesh.onexecute = func;

        mesh.add( coliderMesh );   
        mesh.position.z = 0.05;
        mesh.name = name;

        return mesh;
    }
}

THREE.MeshGenerator.prototype.constructor = THREE.MeshGenerator;

var _meshGen = new THREE.MeshGenerator();