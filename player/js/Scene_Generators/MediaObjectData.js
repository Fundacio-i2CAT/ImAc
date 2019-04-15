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

        var geometry = new THREE.PlaneGeometry( config.size, config.size );
        var plane = getVideoMesh( geometry, url, name, 1 );

        // left arrow
        /*var arrow = getArrowMesh( config.size/5, config.size/6, 0xffffff );
        arrow.rotation.z = Math.PI;
        //arrow.add( getBackgroundMesh ( config.size/5, config.size/5, 0x000000, 0.8 ) );
        arrow.position.y = -7 * config.size/12;
        arrow.position.x = -3 * config.size/8;
        arrow.name = 'left';

        plane.add( arrow );

        // right arrow
        var arrow = getArrowMesh( config.size/5, config.size/6, 0xffffff );
        //arrow.add( getBackgroundMesh ( config.size/5, config.size/5, 0x000000, 0.8 ) );
        arrow.position.y = -7 * config.size/12;
        arrow.position.x = 3 * config.size/8;
        arrow.name = 'right';

        plane.add( arrow );*/

        // background
/*
        var textList = [];
        var isdTextObject = {
              text: 'Hola',
              color: 0xffffff,
              backgroundColor: 0x000000 
        };

        textList.push( isdTextObject );

        var subConfig = {
            subtitleIndicator: 'arrow',
            size: 0.8 * 0.97 * 1,
            area: 70/130,
            opacity: 0.5,
            x: 0,
            y: 0,
            z: 0
        };

        var backgroundMesh = this.getEmojiSubtitleMesh( textList, subConfig )
        backgroundMesh.position.y = -7 * config.size/12;
        backgroundMesh.position.x = -3 * config.size/8;
        plane.add( backgroundMesh );
*/

        //setArrowToMesh( plane, config.size/10, config.size/24, 0xffffff, 0x000000, 0.8 );

        /*var backgroundMesh = getBackgroundMesh ( config.size, config.size/5, 0x000000, 0.8 );
        backgroundMesh.position.y = -6 * config.size/10;
        backgroundMesh.visible = config.signIndicator == 'arrow' ? true : false;

        plane.add( backgroundMesh );*/

        plane.position.z = - config.z;
        plane.position.x = config.x;
        plane.position.y = config.y;

        //return plane;
        group.add( plane );

        if ( _isHMD ) group.rotation.z = -camera.rotation.z;
        
        return group;
    };

    this.getSubtitleMesh = function(textList, config)
    {
        console.error('Deprecated function (getSubtitleMesh), please change to getEmojiSubtitleMesh')
        var group = new THREE.Group();

        /*for ( var i = 0, len = textList.length; i < len; ++i ) 
        {
            config.x = config.textAlign == 0 ? 0 : config.textAlign == -1 ? -config.size : config.size;

            var mesh = getSubMesh( textList[i], config, config.opacity, len, i );
            mesh.name = i;

            group.add( mesh );
        }*/
        config.x = config.textAlign == 0 ? 0 : config.textAlign == -1 ? -config.size : config.size;

        var font = "500 40px Roboto, Arial";

        var mesh = getEmojiSubMesh( textList, config, font );
        mesh.name = textList.length;

        group.add( mesh );

        if ( _isHMD ) group.rotation.z = -camera.rotation.z;
        
        return group;
    };

    this.getSLSubtitleMesh = function(textList, config)
    {
        var group = new THREE.Group();
        var font = "500 30px Roboto, Arial";

        var posX = ( 1.48*60/2-20/2 ) *1;
        var posY = ( 0.82*60/2-20/2 ) *-1;

        config.x=0;
        config.y=0;
        config.z=70;
        config.size = 0.8*0.97;

        group.add( getEmojiSubMesh3( textList, config, font ) );
        group.position.x = posX;
        group.position.y = posY-10-1.5;

        if ( _isHMD ) group.rotation.z = -camera.rotation.z;
        
        return group;
    };

    this.getEmojiSubtitleMesh = function(textList, config)
    {
        var group = new THREE.Group();
        var font = "500 40px Roboto, Arial";

        group.add( getEmojiSubMesh( textList, config, font ) );

        if ( _isHMD ) group.rotation.z = -camera.rotation.z;
        
        return group;
    };

    this.getExpEmojiSubtitleMesh = function(textList, config)
    {
        var group = new THREE.Group();
        var font = "500 40px Roboto, Arial";

        var view = camera.getWorldDirection( _targetVector );
        var position = cartesianToAngular( view.x,view.y,view.z );
        var lon = config.lon;

        if ( -lon > 180 ) lon = -(lon +360)

        console.log(config.lon + '  ' + position.longitud)

        if ( ( ( lon + 360 )%360 - position.longitud ) > 180 && ( ( lon + 360 )%360 - position.longitud ) <= ( 360 - camera.fov ) ) {
            var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 0.001, 0.001 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
            setFixedArrow( mesh, 0, config, textList, config.opacity, false );
            mesh.position.x = config.z * Math.cos( Math.radians( position.longitud -90 +lon) );
            mesh.position.y = config.z * Math.sin( Math.radians( position.latitud -20 ) );
            mesh.position.z = config.z * Math.sin( Math.radians( position.longitud -90 +lon) ) * Math.cos( Math.radians( position.latitud -20 ) );
            mesh.lookAt(0,0,0)

            group.add( mesh )
        }
        else if ( ( ( lon + 360 )%360 - position.longitud ) >= camera.fov && ( ( lon + 360 )%360 - position.longitud ) <= 180 ) { 
            var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 0.001, 0.001 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
            setFixedArrow( mesh, 0, config, textList, config.opacity, true );
            mesh.position.x = config.z * Math.cos( Math.radians( position.longitud -90 +lon) );
            mesh.position.y = config.z * Math.sin( Math.radians( position.latitud -20 ) );
            mesh.position.z = config.z * Math.sin( Math.radians( position.longitud -90 +lon) ) * Math.cos( Math.radians( position.latitud -20 ) );
            mesh.lookAt(0,0,0)

            group.add( mesh )
        }

        config.x = 0;
        config.y = config.z * Math.sin( Math.radians( config.lat ) );
        config.z = config.z * Math.cos( Math.radians( config.lat ) );

        group.add( getEmojiSubMesh( textList, config, font, true ) );
        
        group.rotation.y = Math.radians( config.lon );
        
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
        var mesh = getImageMesh( imgGeometry, './img/radar_7.png', 'radar', 3 );

        mesh.position.x = _isHMD ? 0.8*( 1.48*subController.getSubArea()/2-14/2 ) : ( 1.48*subController.getSubArea()/2-14/2 );
        mesh.position.y = _isHMD ? 0.09*( 0.82*subController.getSubArea()/2-14/2 ) * subController.getSubPosition().y : ( 0.82*subController.getSubArea()/2-14/2 ) * subController.getSubPosition().y;

        mesh.position.z = -76.001;

        mesh.name = 'radarIndicartor';

        return mesh;
    };

    this.getIconRadarMesh = function()
    {
        var imgGeometry = new THREE.PlaneGeometry( 14, 14 );
        var mesh = getImageMesh( imgGeometry, './img/area_7.png', 'radar3', 3 );

        mesh.position.x = _isHMD ? 0.8*( 1.48*subController.getSubArea()/2-14/2 ) : ( 1.48*subController.getSubArea()/2-14/2 );
        mesh.position.y = _isHMD ? 0.09*( 0.82*subController.getSubArea()/2-14/2 ) * subController.getSubPosition().y : ( 0.82*subController.getSubArea()/2-14/2 ) * subController.getSubPosition().y;

        mesh.position.z = -76.001;

        mesh.name = 'radarIcon';

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

    this.getPlaneImageMesh2 = function(x, y, z, w, h, url, name, order) 
    {
        var geometry = new THREE.PlaneGeometry( w, h );
        var mesh = getImageMesh( geometry, url, name, order );
        mesh.position.set(x,y,z)

        return mesh;
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
        var material = new THREE.MeshBasicMaterial( { color: c, transparent: true } );
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
        console.error('Deprecated function (getSubMesh), change to getEmojiSubMesh ');

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
            var geometry = new THREE.PlaneGeometry( 6.7*c.size, 6.7*c.size );
            var arrow = getImageMesh(geometry, './img/arrow_final.png', 'right', 3)
            arrow.material.color.set( t.color );
            //var arrow = getArrowMesh( 6.7*c.size, 6.7*c.size, t.color, o );
            arrow.add( getBackgroundMesh ( 9.7*c.size, 8.7*c.size, t.backgroundColor, o ) );
            arrow.position.x = xMid/2 + 6.8*c.size;
            arrow.name = 'right';

            mesh.add( arrow );

            // left arrow
            var geometry = new THREE.PlaneGeometry( 6.7*c.size, 6.7*c.size );
            var arrow = getImageMesh(geometry, './img/arrow_final.png', 'left', 3)
            arrow.material.color.set( t.color );
            //var arrow = getArrowMesh( 6.7*c.size, 6.7*c.size, t.color, o );
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
            var geometry = new THREE.PlaneGeometry( 6.7*c.size, 6.7*c.size );
            var arrow = getImageMesh( geometry, './img/arrow_final.png', 'right', 3 );
            arrow.material.color.set( t[0].color );
            arrow.add( getBackgroundMesh ( 9.7*c.size, 8.7*c.size, t[0].backgroundColor, o ) );

            arrow.name = 'right';
            mesh.add( arrow );
        }

        // left arrow
        else {
            var geometry = new THREE.PlaneGeometry( 6.7*c.size, 6.7*c.size );
            var arrow = getImageMesh( geometry, './img/arrow_final.png', 'left', 3 );
            arrow.material.color.set( t[0].color );
            arrow.rotation.z = Math.PI;
            arrow.add( getBackgroundMesh ( 9.7*c.size, 8.7*c.size, t[0].backgroundColor, o ) );
            //arrow.position.x = -cw/2 - 9.7*c.size/2;
            arrow.name = 'left';
            mesh.add( arrow );
        }
    }

    function setArrowToMesh(mesh, cw, size, color, backgroundColor, o)
    {
        // right arrow
        var geometry = new THREE.PlaneGeometry( 6.7*size, 6.7*size );
        var arrow = getImageMesh( geometry, './img/arrow_final.png', 'right', 3 );
        arrow.material.color.set( color );
        arrow.add( getBackgroundMesh ( 9.7*size, 8.7*size, backgroundColor, o ) );
        arrow.position.x = cw/2 + 10*size/2;
        arrow.name = 'right';
        mesh.add( arrow );

        // left arrow
        var geometry = new THREE.PlaneGeometry( 6.7*size, 6.7*size );
        var arrow = getImageMesh( geometry, './img/arrow_final.png', 'left', 3 );
        arrow.material.color.set( color );
        arrow.rotation.z = Math.PI;
        arrow.add( getBackgroundMesh ( 9.7*size, 8.7*size, backgroundColor, o ) );
        arrow.position.x = -cw/2 - 9.6*size/2;
        arrow.name = 'left';
        mesh.add( arrow );
    }

    function createCanvasTextLine(ctx, text, font, color, x, y, w, h, o, fw, fh )
    {
        ctx.font = font;
        if ( o != 0 ) createCanvasFillRect( ctx, x, y, w, h, o );
        createCanvasText( ctx, text, font, color, fw, fh );
        if ( o == 0 ) createCanvasStrokeText( ctx, text, fw, fh );
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

        if ( !fixed && c.subtitleIndicator == 'arrow' ) setArrowToMesh( mesh, canvas.width/6, c.size, t[0].color, t[0].backgroundColor, c.opacity );

        mesh.scale.set( c.area*c.size, c.area*c.size, 1 );
        mesh.name = 'emojitext';
        mesh.renderOrder = 3;
        mesh.position.z = -c.z;
        mesh.position.y = c.y;
        mesh.visible = true;

        if ( fixed ) mesh.lookAt(0,0,0);

        return mesh;
    }

    function getEmojiSubMesh3(t, c, font)
    {
        //t[0].text = ':)'
        var canvas = document.getElementById( "canvas" );
        var ctx = canvas.getContext( "2d" );
        var ch = 50*0.8; // canvas height x line
        var fh = 30; // font height

        ctx.font = font;
        var width = ctx.measureText( t[0].text ).width;
        canvas.width = 200;
        canvas.height = ch;

        if ( t[0] ) createCanvasTextLine( ctx, t[0].text, font, t[0].color, 0, 0, canvas.width, ch, c.opacity, ( canvas.width - width )/2, fh );

        var material = new THREE.MeshBasicMaterial( { map: new THREE.CanvasTexture( canvas ),  transparent: true } );
        var mesh = new THREE.Mesh( new THREE.PlaneGeometry( canvas.width/6, ch/6 ), material );

        if ( c.subtitleIndicator == 'arrow' ) setArrowToMesh( mesh, canvas.width/6, c.size, t[0].color, t[0].backgroundColor, c.opacity );

        mesh.scale.set( c.area*c.size, c.area*c.size, 1 );
        mesh.name = 'emojitext';
        mesh.renderOrder = 3;
        mesh.position.z = -c.z;
        mesh.position.y = c.y;
        mesh.visible = true;

        return mesh;
    }

    function getEmojiSubMesh2(t, c, o, i, font)
    {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        var text = /*'😃 ' + */t[0].text;
        var ch = 50; // canvas height x line
        var fh = 40; // font height
        var drawing;
        var il = 0; // emoji width

        if ( text.indexOf("🤖") > -1 ) {
            text = text.replace("🤖", "");
            drawing = emoji_5; // robot
            il = 63;
        }
        else if ( text.indexOf("😃") > -1 ) {
            text = text.replace("😃", "");
            drawing = emoji_1; // happy
            il = 63;
        }
        else if ( text.indexOf("👏🏼") > -1 ) {
            text = text.replace("👏🏼", "");
            drawing = emoji_2; // hands
            il = 63;
        }
        else if ( text.indexOf("😢") > -1 ) {
            text = text.replace("😢", "");
            drawing = emoji_3; // sad
            il = 63;
        }
        else if ( text.indexOf("👣") > -1 ) {
            text = text.replace("👣", "");
            drawing = emoji_4; // steps
            il = 63;
        }
        else if ( text.indexOf("📳") > -1 ) {
            text = text.replace("📳", "");
            drawing = emoji_6; // phone
            il = 63;
        }
        else if ( text.indexOf("🌊") > -1 ) {
            text = text.replace("🌊", "");
            drawing = emoji_7; // wave
            il = 63;
        }
        else if ( text.indexOf("🎶") > -1 ) {
            text = text.replace("🎶", "");
            drawing = emoji_8; // music
            il = 63;
        }
        else if ( text.indexOf("🔌") > -1 ) {
            text = text.replace("🔌", "");
            drawing = emoji_9; // plug
            il = 63;
        }
        else if ( text.indexOf("👂") > -1 ) {
            text = text.replace("👂", "");
            drawing = emoji_10; // noise
            il = 63;
        }

        ctx.font = font;
        var width = ctx.measureText( text ).width + il;
        var width2 = t[1] ? ctx.measureText( t[1].text ).width : 0;
        canvas.width = (width > width2) ? width + 20 : width2 + 20;
        canvas.height = 50*i;

        ctx.font = font;
        if ( o != 0 ) {ctx.fillStyle = 'rgba(0,0,0,' + o + ')';
        ctx.fillRect( 0, 0, il + canvas.width, 50);}
        ctx.fillStyle = t[0].color;
        ctx.fillText(text, il + (canvas.width - width)/2, 40);
        if ( o == 0 )  {ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.strokeText(text, il + (canvas.width - width)/2, 40);}

        if( il > 0 ) {
            ctx.drawImage(drawing, (canvas.width - width)/2, 0, 63, 50);
        }

        if ( t[1] ) {
            var text2 = t[1].text;
            ctx.font = font;
            if ( o != 0 ) {ctx.fillStyle = 'rgba(0,0,0,' + o + ')';
            ctx.fillRect( 0, 50, canvas.width, 50);}
            ctx.fillStyle = t[1].color;     
            ctx.fillText(text2, (canvas.width - width2)/2, 40+50);
            if ( o == 0 ) {ctx.strokeStyle = "#000";
            ctx.lineWidth = 2;
            ctx.strokeText(text2, (canvas.width - width2)/2, 40+50);}
        }

        let texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;

        var material = new THREE.MeshBasicMaterial( { map: texture,  transparent: true } );
        var mesh = new THREE.Mesh( new THREE.PlaneGeometry( canvas.width/6, 50*i/6 ), material );

        if ( c.subtitleIndicator == 'arrow' ) setArrowToMesh( mesh, canvas.width/6, c, t[0].color, t[0].backgroundColor, o );

        mesh.scale.set( c.area,c.area,1 );

        mesh.name = 'test';
        mesh.renderOrder = 3;
        mesh.position.z = - c.z;
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