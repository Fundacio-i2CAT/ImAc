/**
 * @author isaac.fraile@i2cat.net
 */

THREE.MediaObject = function () {

    var listOfVideoContents = [];
    var mainMesh, 
        signMesh, 
        subtitleMesh,
        subtitleFont;

    function getVideObject(url, isDASH) 
    {
        var vid = document.createElement( "video" );
        
        vid.muted = true;
        vid.autoplay = true;
        vid.loop = true;

        vid.src = url;

        var objVideo = { vid : vid };

        listOfVideoContents.push( objVideo );

        return vid;
    }

    function getVideoMesh(geometry, url, name, order) 
    {
        var texture = new THREE.VideoTexture( getVideObject( url ) );
        texture.minFilter = THREE.LinearFilter;
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

    function getSubtitleMesh(t, c, o, l, i)
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

        if (i == l-1 && c.subtileIndicator == 'compass')
        {
            // right compass
            var imgGeometry = new THREE.PlaneGeometry( 6.7, 6.7 );
            var compass = getImageMesh( imgGeometry, './img/compass.png', 'subIndicatorR', 4 );
            compass.add( getBackgroundMesh ( 10.7, 8.7, t.backgroundColor, o) );
            compass.position.z = 0.01;
            compass.position.x = xMid/2 + 6.7;
            compass.visible = false;

            mesh.add(compass);

            // lesft compass
            var imgGeometry = new THREE.PlaneGeometry( 6.7, 6.7 );
            var compass = getImageMesh( imgGeometry, './img/compass2.png', 'subIndicatorL', 4 );
            compass.add( getBackgroundMesh ( 10.7, 8.7, t.backgroundColor, o) );
            compass.position.z = 0.01;
            compass.position.x = -(xMid/2 + 6.79);
            compass.visible = false;

            mesh.add(compass);

        }
        else if (i == l-1 && c.subtileIndicator == 'arrow')
        {
            // right arrow
            var arrow = getArrowMesh( 6.7, 6.7, t.color );
            arrow.add( getBackgroundMesh ( 10.7, 8.7, t.backgroundColor, o) );
            arrow.position.x = xMid/2 + 6.7;
            arrow.name = 'subIndicatorR';

            mesh.add(arrow);

            // left arrow
            var arrow = getArrowMesh( 6.7, 6.7, t.color );
            arrow.rotation.z = Math.PI;
            arrow.add( getBackgroundMesh ( 10.7, 8.7, t.backgroundColor, o) );
            arrow.position.x = -(xMid/2 + 6.7);
            arrow.name = 'subIndicatorL';

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
        plane.visible = false;

        imageMesh = plane;

        camera.add(plane);
    };

    this.createSubtitle = function(textList, config)
    {
        var group = new THREE.Group();

        for (var i = 0, len = textList.length; i < len; ++i) 
        {
            config.x = config.textAlign == 'center' ? 0 : config.textAlign == 'start' ? -config.size : config.size;

            var mesh = getSubtitleMesh(textList[i], config, 0.8, len, i);            
            mesh.name = i;

            group.add(mesh);
        }
        subtitleMesh = group;

        camera.add(group);
    };

    this.removeSubtitle = function()
    {
        camera.remove(subtitleMesh);
        subtitleMesh = undefined;
    };

    this.removeSignVideo = function()
    {
        camera.remove(signMesh);
        signMesh = undefined;
    };
}

THREE.MediaObject.prototype.constructor = THREE.MediaObject;