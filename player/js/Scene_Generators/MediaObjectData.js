/**
 * @author isaac.fraile@i2cat.net
 */

THREE.MediaObjectData = function () {

    var subtitleFont; 
    var ST_font = "500 40px Roboto, Arial";

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

    this.getCubeVideo32Mesh = function(size, url, name) 
    {
        var geometry = getCubeGeometry32( size );

        return getVideoMesh( geometry, url, name, 0 );
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
        var group = new THREE.Group();

config.size=20;
        var geometry = new THREE.PlaneGeometry( 20, 20 );
        var plane = getVideoMesh( geometry, url, name, 1 );

        var material = new THREE.MeshBasicMaterial( { color: 0x000000,  transparent: true, opacity: 0.5 } );
        var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 38, 8.4 ), material );

        setArrowToMesh( mesh, 120/6, 1, 0xffffff, 0x000000, 0, true ) 
        mesh.position.y = -10 -4.4/2;
        mesh.scale.set( 0.98*70/130, 0.98*70/130, 1 )
        mesh.children[0].visible = false;
        mesh.children[1].visible = false;
        mesh.visible = config.signIndicator == 'arrow' ? true : false;
        mesh.name = 'backgroundSL';

        plane.add( mesh );

        plane.position.z = - config.z;
        plane.position.x = config.x;
        plane.position.y = ( !_SLsubtitles && subController.checkSubtitleEnabled(true) ) ? config.y : config.y +3.4;

        group.add( plane );

        if ( _isHMD ) group.rotation.z = -camera.rotation.z;
 
        return group;
    };


    this.getSLSubtitleMesh = function(textList, config, slconfig)
    {
        var group = new THREE.Group();

        var material = new THREE.MeshBasicMaterial( { color: 0x000000,  transparent: true, opacity: 0 } );
        var plane = new THREE.Mesh( new THREE.PlaneGeometry( slconfig.size, slconfig.size ), material );

        var group2 = new THREE.Group();

        var posY = ( 0.82*60/2-20/2 ) *-1;

        config.x=0;
        config.y=0;
        config.z=0;
        config.size = 0.8*0.97;

        group2.add(  getEmojiSubMesh3( textList, config, ST_font ) );

        group2.position.y = -slconfig.size/2 - 1.8;
        plane.add( group2 );

        plane.position.z = - slconfig.z;
        plane.position.x = slconfig.x;
        plane.position.y = slconfig.y +3.4;

        //return plane;
        group.add( plane );

        //group.position.x = posX;
        //group.position.y = posY-10+2*0.97*0.8;

        if ( _isHMD ) group.rotation.z = -camera.rotation.z;
        
        return group;
    };

    this.getPreviewSubtitleMesh = function(textList, config)
    {
        var group = new THREE.Group();

        group.add( getPreviewSubMesh( textList, config, ST_font ) );

        if ( _isHMD ) group.rotation.z = -camera.rotation.z;
        
        return group;
    };

    // subtitols always visible
    this.getEmojiSubtitleMesh = function(textList, config)
    {
        var group = new THREE.Group();

        group.add( getEmojiSubMesh( textList, config, ST_font ) );

        if ( _isHMD ) group.rotation.z = -camera.rotation.z;
        
        return group;
    };

    // subtitols fixed position
    this.getExpEmojiSubtitleMesh = function(textList, config)
    {
        var group = new THREE.Group();

        var difPosition = config.lon ? getViewDifPositionTest( -config.lon, camera.fov ) : 0;


        if ( difPosition == 0 ) position = 'center';
        else position = difPosition < 0 ? 'left' : 'right';

        var target = new THREE.Vector3();
        var camView = camera.getWorldDirection( target );
        var offset = camView.z >= 0 ? 180 : -0;

        var dist = Math.sqrt( Math.pow( camView.x,2 ) + Math.pow( camView.y,2 ) + Math.pow( camView.z,2 ) );
        var lon = Math.degrees( Math.atan( camView.x/camView.z ) ) + offset;
        var lat = Math.degrees( Math.asin( camView.y/-dist ) );

        lon = lon > 0 ? 360 - lon : - lon;

        if ( position != 'center' ) 
        {
            var isRight = position == 'right' ? true : false;   
            var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 0.001, 0.001 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
            setFixedArrow( mesh, 0, config, textList, config.opacity, isRight );

            mesh.position.x = config.z * Math.cos( Math.radians( lon-90 +config.lon) ) * Math.cos( Math.radians( -lat -20) );
            mesh.position.y = config.z * Math.sin( Math.radians( -lat -20) );
            mesh.position.z = config.z * Math.sin( Math.radians( lon-90 +config.lon) ) * Math.cos( Math.radians( -lat -20) );

            mesh.lookAt(0,0,0)

            group.add( mesh )
        }

        var needajust = false;
        if ( config.lon ) {}
        else {
            config.lon = -lon;
            config.lat = -lat;
            needajust = true;
        }
        //console.warn( position )

        ////////////////////////////////////////////////////////////////////////////////////
        config.x = 0;
        config.y = config.z * Math.sin( Math.radians( config.lat ) );
        config.z = config.z * Math.cos( Math.radians( config.lat ) );

        var stmesh = getEmojiSubMesh( textList, config, ST_font, true ) 

        if ( needajust ) {
            stmesh.position.x = config.z * Math.cos( Math.radians( lon-90 +config.lon) ) * Math.cos( Math.radians( -lat -20) );
            stmesh.position.y = config.z * Math.sin( Math.radians( -lat -20) );
            stmesh.position.z = config.z * Math.sin( Math.radians( lon-90 +config.lon) ) * Math.cos( Math.radians( -lat -20) );

            stmesh.lookAt(0,0,0)
        }

        group.add( stmesh );
        
        group.rotation.y = Math.radians( config.lon );

        return group;
    };

    this.getRadarMesh = function(img, name)
    {
        var imgGeometry = new THREE.PlaneGeometry( 14, 14 );
        var mesh = getImageMesh( imgGeometry, img, name, 3 );

        mesh.position.x = _isHMD ? 0.8*( 1.48*subController.getSubArea()/2-14/2 ) : ( 1.48*subController.getSubArea()/2-14/2 );
        mesh.position.y = _isHMD ? 0.09*( 0.82*subController.getSubArea()/2-14/2 ) * subController.getSubPosition().y : ( 0.82*subController.getSubArea()/2-14/2 ) * subController.getSubPosition().y;

        mesh.position.z = -76.001;

        return mesh;
    };

    this.getSpeakerRadarMesh = function(color, pos)
    {
        var imgGeometry = new THREE.PlaneGeometry( 14, 14 );
        var mesh = getImageMesh( imgGeometry, './img/indicador_7.png', 'radar2', 3 );

        mesh.material.color.set( color ); 

        mesh.position.x = _isHMD ? 0.8*( 1.48*subController.getSubArea()/2-14/2 ) : ( 1.48*subController.getSubArea()/2-14/2 );
        mesh.position.y = _isHMD ? 0.09*( 0.82*subController.getSubArea()/2-14/2 ) * subController.getSubPosition().y : ( 0.82*subController.getSubArea()/2-14/2 ) * subController.getSubPosition().y;

        mesh.position.z = -76;
        mesh.rotation.z = Math.radians( 360 - pos );
        mesh.name = 'radarIndicartor';

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
        var pointer2 = getPointMesh( 0.06, 32, 0xffff00, 1 );
        pointer2.name = 'realpointer2';

        pointer1.add( pointer2 );

        pointer1.position.x = 0.155
        pointer1.position.y = 1.21
        pointer1.position.z = -0.15

        pointer1.name = 'pointer2';
        pointer1.visible = false;

        scene.add( pointer1 );
    };


//************************************************************************************
// Experimental
//************************************************************************************
  

    this.createOpenMenuMesh = function()
    {
        var openMenuText = getTextMesh( "Menu", 22, 0xe6e6e6, "openmenutext" ); 
        openMenuText.position.y = 6;
        openMenuText.position.z = -60;
        openMenuText.scale.set( 0.15, 0.15, 1 )
        openMenuText.visible = false;

        camera.add(openMenuText);
    };

    this.createLine = function (c, startvector, endvector){
        
        let material = new THREE.LineBasicMaterial( { color: c } );
        let geometry = new THREE.Geometry();
        geometry.vertices.push( startvector, endvector );
        let line = new THREE.Line( geometry, material );
        return line;
    };

    this.createCurvedLine = function(c, startvector, control, endvector){

        let curve = new THREE.QuadraticBezierCurve3( startvector, control, endvector);
        let points = curve.getPoints( 50 );
        let geometry = new THREE.BufferGeometry().setFromPoints( points );
        let material = new THREE.LineBasicMaterial( { color : c } );

        //Create the final object to add to the scene
        let curveObject = new THREE.Line( geometry, material );
        return curveObject      
    }

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

    this.roundedRect = function( ctx, width, height, radius ){
        //STARTING POINT IS 0,0
        ctx.moveTo(-width/2, 0);
        ctx.lineTo( -width/2, height/2 - radius );  
        ctx.quadraticCurveTo( -width/2, height/2, -width/2 + radius, height/2);
        ctx.lineTo( width/2 - radius, height/2 );
        ctx.quadraticCurveTo( width/2, height/2, width/2, height/2 - radius );
        ctx.lineTo( width/2, -height/2 + radius );
        ctx.quadraticCurveTo( width/2, -height/2, width/2 - radius, -height/2 );
        ctx.lineTo( -width/2 + radius, -height/2 );
        ctx.quadraticCurveTo( -width/2,-height/2, -width/2,-height/2 + radius );

        //OPTION RELATIVE TO STARTING POINT
        //ctx.moveTo( x, y + radius );
        //ctx.lineTo( x, y + height - radius );
        //ctx.quadraticCurveTo( x, y + height, x + radius, y + height );
        //ctx.lineTo( x + width - radius, y + height );
        //ctx.quadraticCurveTo( x + width, y + height, x + width, y + height - radius );
      
        //ctx.lineTo( x + width, y + radius );
        //ctx.quadraticCurveTo( x + width, y, x + width - radius, y );
        //ctx.lineTo( x + radius, y );
        //ctx.quadraticCurveTo( x, y, x, y + radius );

      return ctx;
    }

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
        mesh.position.z = -0.01;

        return mesh;
    }

    function createCanvasFillRect(ctx, x, y, w, h, o)
    {
        ctx.fillStyle = 'rgba(0,0,0,' + o + ')';
        ctx.fillRect( x, y, w, h );
    }

    function createCanvasStrokeText(ctx, text, w, h)
    {
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.strokeText( text, w, h );
    }

    function createCanvasText(ctx, text, font, color, w, h)
    {
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.fillText( text, w, h );
    }

    function setFixedArrow(mesh, cw, c, t, o, right)
    {
        // right arrow
        if ( right ){
            var geometry = new THREE.PlaneGeometry( 6.5, 6.5 );
            var arrow = getImageMesh( geometry, './img/arrow_final.png', 'right', 3 );
            arrow.material.color.set( t[0].color );
            arrow.add( getBackgroundMesh ( 9.4, 8.4, t[0].backgroundColor, o ) );

            arrow.name = 'right';
            mesh.add( arrow );
        }

        // left arrow
        else {
            var geometry = new THREE.PlaneGeometry( 6.5, 6.5 );
            var arrow = getImageMesh( geometry, './img/arrow_final.png', 'left', 3 );
            arrow.material.color.set( t[0].color );
            arrow.rotation.z = Math.PI;
            arrow.add( getBackgroundMesh ( 9.4, 8.4, t[0].backgroundColor, o ) );

            arrow.name = 'left';
            mesh.add( arrow );
        }
    }

    function setArrowToMesh(mesh, cw, size, color, backgroundColor, o, isSL)
    {
        // right arrow
        var geometry = new THREE.PlaneGeometry( 6.5, 6.5 );
        var arrow = getImageMesh( geometry, './img/arrow_final.png', 'right', 3 );
        arrow.material.color.set( color );
        arrow.add( getBackgroundMesh ( 9.4, 8.3*size, backgroundColor, o ) );
        arrow.position.x = cw/2 + 4.7;
        arrow.name = isSL ? 'rightSL' : 'right';
        mesh.add( arrow );

        // left arrow
        var geometry = new THREE.PlaneGeometry( 6.5, 6.5 );
        var arrow = getImageMesh( geometry, './img/arrow_final.png', 'left', 3 );
        arrow.material.color.set( color );
        arrow.rotation.z = Math.PI;
        arrow.add( getBackgroundMesh ( 9.4, 8.3*size, backgroundColor, o ) );
        arrow.position.x = -cw/2 - 4.7;
        arrow.name = isSL ? 'leftSL' : 'left';
        mesh.add( arrow );
    }

    function setPreviewArrowToMesh(mesh, cw, size, color, backgroundColor, o, isSL)
    {
        // right arrow
        var geometry = new THREE.PlaneGeometry( 6.5, 6.5 );
        var arrow = getImageMesh( geometry, './img/arrow_final.png', 'right', 3 );
        arrow.material.color.set( color );
        arrow.add( getBackgroundMesh ( 9.4, 8.3*size, backgroundColor, o ) );
        arrow.position.x = cw/2 + 4.7;
        arrow.name = 'preright';
        mesh.add( arrow );

        // left arrow
        var geometry = new THREE.PlaneGeometry( 6.5, 6.5 );
        var arrow = getImageMesh( geometry, './img/arrow_final.png', 'left', 3 );
        arrow.material.color.set( color );
        arrow.rotation.z = Math.PI;
        arrow.add( getBackgroundMesh ( 9.4, 8.3*size, backgroundColor, o ) );
        arrow.position.x = -cw/2 - 4.7;
        arrow.name = 'preleft';
        mesh.add( arrow );
    }

    function createCanvasTextLine(ctx, text, font, color, x, y, w, h, o, fw, fh )
    {
        ctx.font = font;
        if ( o != 0 ) createCanvasFillRect( ctx, x, y, w, h, o );
        createCanvasText( ctx, text, font, color, fw, fh );
        if ( o == 0 ) createCanvasStrokeText( ctx, text, fw, fh );
    }

    function getPreviewSubMesh(t, c, font, fixed)
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

        if ( t[0] ) createCanvasTextLine( ctx, t[0].text, font, t[0].color, 0, 0, canvas.width, ch, c.opacity, ( canvas.width - width )/2, fh );
        if ( t[1] ) createCanvasTextLine( ctx, t[1].text, font, t[1].color, 0, ch, canvas.width, ch, c.opacity, ( canvas.width - width2 )/2, fh + ch );

        var material = new THREE.MeshBasicMaterial( { map: new THREE.CanvasTexture( canvas ),  transparent: true } );
        var mesh = new THREE.Mesh( new THREE.PlaneGeometry( canvas.width/6, ch*t.length/6 ), material );

        if ( !fixed && c.subtitleIndicator == 'arrow' ) setPreviewArrowToMesh( mesh, canvas.width/6, t.length, t[0].color, t[0].backgroundColor, c.opacity );

        mesh.scale.set( c.area*c.size, c.area*c.size, 1 );

        mesh.renderOrder = 3;
        mesh.position.z = -c.z;
        mesh.position.y = c.y;
        mesh.position.x = c.offset;
        mesh.visible = true;

        if ( fixed ) mesh.lookAt(0,0,0);

        return mesh;
    }

    function getEmojiSubMesh(t, c, font, fixed)
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

        if ( t[0] ) createCanvasTextLine( ctx, t[0].text, font, t[0].color, 0, 0, canvas.width, ch, c.opacity, ( canvas.width - width )/2, fh );
        if ( t[1] ) createCanvasTextLine( ctx, t[1].text, font, t[1].color, 0, ch, canvas.width, ch, c.opacity, ( canvas.width - width2 )/2, fh + ch );

        var material = new THREE.MeshBasicMaterial( { map: new THREE.CanvasTexture( canvas ),  transparent: true } );
        var mesh = new THREE.Mesh( new THREE.PlaneGeometry( canvas.width/6, ch*t.length/6 ), material );

        if ( !fixed && c.subtitleIndicator == 'arrow' ) setArrowToMesh( mesh, canvas.width/6, t.length, t[0].color, t[0].backgroundColor, c.opacity );

        mesh.scale.set( c.area*c.size, c.area*c.size, 1 );

        mesh.name = 'emojitext';
        mesh.renderOrder = 3;
        mesh.position.z = -c.z;
        mesh.position.y = c.y;
        mesh.position.x = c.offset;
        mesh.visible = true;

        if ( fixed ) mesh.lookAt(0,0,0);

        return mesh;
    }

    function getEmojiSubMesh3(t, c, font)
    {
        //t[0].text = ':)'
        var canvas = document.getElementById( "canvas" );
        var ctx = canvas.getContext( "2d" );
        var ch = 50; // canvas height x line
        var fh = 40; // font height

        var text = t[0].text;
        var il = 0;

        if ( text == '01' ) {
            drawing = emoji_1; 
            il = 63;
        }
        else if ( text == '02' ) {
            drawing = emoji_2; 
            il = 63;
        }
        else if ( text == '03' ) {
            drawing = emoji_3; 
            il = 63;
        }
        else if ( text == '04' ) {
            drawing = emoji_4; 
            il = 63;
        }
        else if ( text == '05' ) {
            drawing = emoji_5; 
            il = 63;
        }
        else if ( text == '06' ) {
            drawing = emoji_6; 
            il = 63;
        }
        else if ( text == '07' ) {
            drawing = emoji_7; 
            il = 63;
        }
        else if ( text == '08' ) {
            drawing = emoji_8; 
            il = 63;
        }


        ctx.font = font;
        var width = ctx.measureText( t[0].text ).width;
        canvas.width = 285;
        canvas.height = ch;

        if( il > 0 ) {          
            createCanvasTextLine( ctx, '', font, t[0].color, 0, 0, canvas.width, ch, c.opacity, ( canvas.width - width )/2, fh );
            ctx.drawImage(drawing, 110, 0, 63, 50);
        }

        else if ( t[0] ) createCanvasTextLine( ctx, t[0].text, font, t[0].color, 0, 0, canvas.width, ch, c.opacity, ( canvas.width - width )/2, fh );

        var material = new THREE.MeshBasicMaterial( { map: new THREE.CanvasTexture( canvas ),  transparent: true } );
        var mesh = new THREE.Mesh( new THREE.PlaneGeometry( canvas.width/6, ch/6 ), material );

        setArrowToMesh( mesh, canvas.width/6-18, 1, t[0].color, t[0].backgroundColor, 0 );

        mesh.scale.set( c.area*c.size, c.area*c.size, 1 );
        mesh.name = 'emojitext';
        mesh.renderOrder = 3;
        mesh.position.z = -c.z;
        mesh.position.y = c.y;
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

    function getCubeGeometry32(size)
    {
        var threshold = 0.0002;
        var one_third = .3333;
        var two_third = .6666;

        var _00 = new THREE.Vector2(0,0);
        var _01a = new THREE.Vector2(0, .5 - threshold);
        var _01b = new THREE.Vector2(0, .5 + threshold);
        var _02 = new THREE.Vector2(0, 1);

        var _10 = new THREE.Vector2(one_third, 0);
        var _11a = new THREE.Vector2(one_third, .5 - threshold);
        var _11b = new THREE.Vector2(one_third, .5 + threshold);
        var _12 = new THREE.Vector2(one_third, 1);

        var _20 = new THREE.Vector2(two_third, 0);
        var _21a = new THREE.Vector2(two_third, .5 - threshold);
        var _21b = new THREE.Vector2(two_third, .5 + threshold);
        var _22 = new THREE.Vector2(two_third, 1);

        var _30 = new THREE.Vector2(1,0);
        var _31a = new THREE.Vector2(1, .5 - threshold);
        var _31b = new THREE.Vector2(1, .5 + threshold);
        var _32 = new THREE.Vector2(1, 1);

        /// map the faces
        var face_top = [ _31a, _21a, _20, _30 ];
        var face_back = [ _21a, _11a, _10, _20 ];
        var face_bottom = [ _11a, _01a, _00, _10 ];
        var face_front = [ _12, _11b, _21b, _22 ];
        var face_left = [ _22, _21b, _31b, _32 ];
        var face_right = [ _02, _01b, _11b, _12 ];

        return getCubeGeometryByVertexUVs( size, face_front, face_left, face_right, face_top, face_back, face_bottom );
    }

    function getCubeGeometry32(size)
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
        // The "threshold" value removes the pixel(s) between the two rows of the texture.
        // Defines the 01, 11, 21 and 31 vector points.

        var threshold = 0.00002;
        var one_third = .3333;
        var two_third = .6666;

        var _00 = new THREE.Vector2(0,0);
        var _01a = new THREE.Vector2(0, .5 - threshold);
        var _01b = new THREE.Vector2(0, .5 + threshold);
        var _02 = new THREE.Vector2(0, 1);

        var _10 = new THREE.Vector2(one_third, 0);
        var _11a = new THREE.Vector2(one_third, .5 - threshold);
        var _11b = new THREE.Vector2(one_third, .5 + threshold);
        var _12 = new THREE.Vector2(one_third, 1);

        var _20 = new THREE.Vector2(two_third, 0);
        var _21a = new THREE.Vector2(two_third, .5 - threshold);
        var _21b = new THREE.Vector2(two_third, .5 + threshold);
        var _22 = new THREE.Vector2(two_third, 1);

        var _30 = new THREE.Vector2(1,0);
        var _31a = new THREE.Vector2(1, .5 - threshold);
        var _31b = new THREE.Vector2(1, .5 + threshold);
        var _32 = new THREE.Vector2(1, 1);

        /// map the faces
        var face_front = [ _12, _11b, _21b, _22 ];
        var face_back = [ _21a, _11a, _10, _20 ];
        var face_top = [ _21a, _20,_30, _31a ];
        var face_bottom = [  _10, _11a, _01a, _00 ];
        var face_right = [ _22, _21b, _31b, _32 ];
        var face_left = [ _02, _01b, _11b, _12 ];

        return getCubeGeometryByVertexUVs( size, face_front, face_left, face_right, face_top, face_back, face_bottom );
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
        var face_right  = [ _54a, _53b, _63b, _64a ];
        var face_left  = [ _55b, _54b, _64b, _65 ];    
        var face_top  = [ _52b, _62b, _63a, _53a ];
        var face_back  = [ _52a, _51b, _61b, _62b ];
        var face_bottom  = [ _61a, _51a, _50b, _60 ]; 

        return getCubeGeometryByVertexUVs( size, face_front, face_left, face_right, face_top, face_back, face_bottom );
    }

    function getCubeGeometry116(size)
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
        // The "threshold" value removes the pixel(s) between the two rows of the texture.
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

    function getTextMesh(text, size, color, name, func, cw, ch)
    {
        console.warn('This function need to be updated')
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