

function MediaObjectData ()
{

//************************************************************************************
// MESH GENERATORS
//************************************************************************************

    this.Create_SphereVideo_Mesh  = function() 
    {
        console.log("[MediaObjectData] Create_SphereVideo_Mesh");

        var objectVideo = this.createVideo_Component('./resources/rapzember-young-hurn_edit.mp4', true);

        var mesh = this.createSphereGeometry(objectVideo.vid);

        mesh.name = 1;

        scene.add( mesh );
    };


    this.Create_RectangleVideo_Mesh = function() 
    {
        console.log("[MediaObjectData] Create_RectangleVideo_Mesh");

        var objectVideo = this.createVideo_Component('./resources/signer_rbb_1.mp4', true);

        var mesh = this.createPlaneGeometry (objectVideo.vid);

        mesh.name = 2;

        signMesh = mesh;

        camera.add(mesh);
    };

    this.Create_RectangleImage_Mesh = function() 
    {
        console.log("[MediaObjectData] Create_RectangleImage_Mesh");

        var mesh = language == "catala" ? this.createImageGeometry ('./resources/feedback.png') : this.createImageGeometry ('./resources/feedback_ger.png');

        mesh.name = 5;

        imageMesh = mesh;

        camera.add(mesh);
    };

    this.Create_Text_Mesh = function(textList)
    {
        var group = new THREE.Group();

        var listSize =  textList.length;

        for (var i = 0; i < listSize; ++i) 
        {
            var mesh = this.createTextGeometry (textList[i].text, textList[i].color, textList[i].backgroundColor, 80, listSize, i);
            
            mesh.name = i;

            group.add(mesh);

        }

        subtitles3d = group;

        camera.add(group);
    }


//************************************************************************************
// GEOMETRY GENERATORS
//************************************************************************************

    this.createTextGeometry = function(text, textColor, backgroundColor, opacity, listSize, id)
    {
        console.log('createTextGeometry')
        var latitud = forcedDisplayAlign == 'before' ? 30 * viewArea/100 : 30 * viewArea/ -100; 

        var planePosition = convertAngular_toCartesian (latitud, 0);

        var textmaterial = new THREE.MeshBasicMaterial( { color: textColor} );


        var textShape = new THREE.BufferGeometry();
        var shapes = myfont.generateShapes( text, 5, 2 );
        var geometry = new THREE.ShapeGeometry( shapes );

        geometry.computeBoundingBox();

        xMid = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
        yMid = geometry.boundingBox.max.y - geometry.boundingBox.min.y;

        textShape.fromGeometry( geometry );

        textplane = new THREE.Mesh(textShape, textmaterial);

        textplane.position.x -= xMid/2;
        textplane.position.y -= 2;
        textplane.position.z += 0.001;
               
        var material1 = new THREE.MeshBasicMaterial( { color: backgroundColor, transparent: true, opacity: opacity/100} );

        var geometry2 = new THREE.PlaneGeometry( xMid+4 , yMid+2); // font size + padding
        //var geometry2 = new THREE.PlaneGeometry( 100 , 100);
        var plane1 = new THREE.Mesh( geometry2, material1 );

        plane1.add(textplane);

        if ((subtileIndicator == 'arrow' || subtileIndicator == 'compass') && (id == listSize-1))
        {
            var img1 = './img/' + subtileIndicator + '.png';
            var img2 = './img/' + subtileIndicator + '2.png';
            
            var imagesize = yMid;

            var imgGeometry = new THREE.PlaneGeometry( imagesize, imagesize );
            var loader = new THREE.TextureLoader();
            var texture2 = loader.load(img1);
            texture2.minFilter = THREE.LinearFilter;
            texture2.format = THREE.RGBAFormat;

            var material2 = new THREE.MeshBasicMaterial({map:texture2, side: THREE.FrontSide})

            var crosshair = new THREE.Mesh( imgGeometry, material2 );

            var material_ = new THREE.MeshBasicMaterial( { color: backgroundColor, transparent: true, opacity: opacity/100} );
            var geometry_ = new THREE.PlaneGeometry( imagesize+4, imagesize+2); 
            var plane_ = new THREE.Mesh( geometry_, material_ );
            plane_.position.z -= 0.001;

            crosshair.add(plane_);

            crosshair.position.z += 0.01;
            crosshair.position.x += xMid/2 + imagesize;
            crosshair.renderOrder = 4;
            crosshair.material.transparent = true;
            crosshair.visible = false;
            crosshair.name = 'subIndicatorR';

            plane1.add(crosshair);

            var imgGeometry2 = new THREE.PlaneGeometry( imagesize, imagesize );
            var loader2 = new THREE.TextureLoader();
            var texture3 = loader2.load(img2);
            texture3.minFilter = THREE.LinearFilter;
            texture3.format = THREE.RGBAFormat;

            var material3 = new THREE.MeshBasicMaterial({map:texture3, side: THREE.FrontSide})

            var crosshair3 = new THREE.Mesh( imgGeometry2, material3 );

            var material_ = new THREE.MeshBasicMaterial( { color: backgroundColor, transparent: true, opacity: opacity/100} );
            var geometry_ = new THREE.PlaneGeometry( imagesize+4, imagesize+2); 
            var plane_ = new THREE.Mesh( geometry_, material_ );
            plane_.position.z -= 0.001;

            crosshair3.add(plane_);

            crosshair3.position.z += 0.01;
            crosshair3.position.x -= xMid/2 + imagesize;
            crosshair3.renderOrder = 4;
            crosshair3.material.transparent = true;
            crosshair3.visible = false;
            crosshair3.name = 'subIndicatorL';

            plane1.add(crosshair3);
        }

        var escaleSize = 0.01 * viewArea/100;

        plane1.scale.set(escaleSize,escaleSize,escaleSize);

        var paddingY = forcedDisplayAlign == 'before' ? 1.1 * (yMid+2) * id * escaleSize : 1.1 * (yMid+2) * (listSize-1-id) * escaleSize;

        plane1.position.z = - planePosition.z;
        plane1.position.x = planePosition.x;
        plane1.position.y = forcedDisplayAlign == 'before' ? planePosition.y - paddingY : planePosition.y + paddingY;

        if (forcedTextAlign == 'start')
        {
            plane1.position.x -= (50 - (xMid+2)/2) * escaleSize;
        }
        else if (forcedTextAlign == 'end')
        {
            plane1.position.x += (50 - (xMid+2)/2) * escaleSize;
        }

        plane1.renderOrder = 3;
        plane1.visible = true;

        return plane1;
    }

    this.createSphereGeometry = function(vid)
    {
        var geometry = new THREE.SphereBufferGeometry( 10, 32, 16 );

        geometry.scale( - 1, 1, 1 );

        var texture = new THREE.VideoTexture( vid );
        texture.minFilter = THREE.LinearFilter;
        texture.format = THREE.RGBAFormat;
       
        var material = new THREE.MeshBasicMaterial({map:texture, side: THREE.FrontSide})
        var sphere = new THREE.Mesh( geometry, material );

        sphere.renderOrder = 0;
        sphere.visible = true;

        return sphere;
    }

    this.createPlaneGeometry = function (vid) 
    {
        var fov = camera.fov;

        if (signArea == 'topLeft')
        {
            var userLatitud = 0;
            var userLongitud = 0;
        }
        else if (signArea == 'topRight')
        {
            var userLatitud = 0;
            var userLongitud = 100;
        }
        else if (signArea == 'botLeft')
        {
            var userLatitud = 100;
            var userLongitud = 0;
        }
        else if (signArea == 'botRight')
        {
            var userLatitud = 100;
            var userLongitud = 100;
        }
        else 
        {  
            var userLatitud = 50;
            var userLongitud = 50;
        }

        var size = 0.45 * viewArea/100;


        latitud = (((fov/2) * (viewArea/100)) - fov* (viewArea/100)*(userLatitud/100)) * (1 - size) * (1 + size/(2*(2-size))) * (1 - Math.pow(((userLongitud-50)/105), 2));
        longitud = ((fov) * (viewArea/100)) *((userLongitud/100) - 0.5) * (1 - size) * (1 + size/(1*(2-size))) * (0.88 - Math.pow(((userLatitud-50)/500), 2));

        var planePosition = convertAngular_toCartesian (latitud, longitud);

        var geometry = new THREE.PlaneGeometry( size, size);
        var texture = new THREE.VideoTexture( vid );
        texture.minFilter = THREE.LinearFilter;
        texture.format = THREE.RGBAFormat;

        var material = new THREE.MeshBasicMaterial({map:texture, side: THREE.FrontSide})

        var plane = new THREE.Mesh( geometry, material );


        var img1 = './img/arrow.png';
        var img2 = './img/arrow2.png';
        
        var imagesize = 0.25 * size;

        var imgGeometry = new THREE.PlaneGeometry( imagesize, imagesize );
        var loader = new THREE.TextureLoader();
        var texture2 = loader.load(img1);
        texture2.minFilter = THREE.LinearFilter;
        texture2.format = THREE.RGBAFormat;

        var material2 = new THREE.MeshBasicMaterial({map:texture2, side: THREE.FrontSide})

        var crosshair = new THREE.Mesh( imgGeometry, material2 );

        crosshair.position.z += 0.01;
        crosshair.position.y -= (size/2 + imagesize/2);
        crosshair.position.x += (size/2 - imagesize/2);
        crosshair.renderOrder = 4;
        crosshair.material.transparent = true;
        crosshair.visible = false;
        crosshair.name = 'id';

        plane.add(crosshair);

        var imgGeometry2 = new THREE.PlaneGeometry( imagesize, imagesize );
        var loader2 = new THREE.TextureLoader();
        var texture3 = loader2.load(img2);
        texture3.minFilter = THREE.LinearFilter;
        texture3.format = THREE.RGBAFormat;

        var material3 = new THREE.MeshBasicMaterial({map:texture3, side: THREE.FrontSide})

        var crosshair3 = new THREE.Mesh( imgGeometry2, material3 );

        crosshair3.position.z += 0.01;
        crosshair3.position.y -= (size/2 + imagesize/2);
        crosshair3.position.x -= (size/2 - imagesize/2);
        crosshair3.renderOrder = 4;
        crosshair3.material.transparent = true;
        crosshair3.visible = false;
        crosshair3.name = 'id3';

        plane.add(crosshair3);


        var material_ = new THREE.MeshBasicMaterial( { color: 0x000000, transparent: true, opacity: 0.8} );
        var geometry_ = new THREE.PlaneGeometry( size , imagesize); 
        var plane_ = new THREE.Mesh( geometry_, material_ );
        plane_.position.y -= (size/2 + imagesize/2);

        plane_.visible = signIndicator == 'arrow' ? true : false;

        plane.add(plane_);
     

        plane.position.z = - planePosition.z;
        plane.position.x = planePosition.x;
        plane.position.y = planePosition.y;

        signPositionX = planePosition.x;

        plane.renderOrder = 1;
        plane.visible = true; 

        return plane;
    }

    this.createImageGeometry = function (img) 
    {
        var geometry = new THREE.PlaneGeometry( 1, 1);

        var loader = new THREE.TextureLoader();
        var texture = loader.load(img);
        texture.minFilter = THREE.LinearFilter;
        texture.format = THREE.RGBAFormat;

        var material = new THREE.MeshBasicMaterial({map:texture, side: THREE.FrontSide})

        var plane = new THREE.Mesh( geometry, material );

        plane.position.z = -0.5;
        plane.scale.set(0.7,0.7,0.7);

        plane.renderOrder = 5;
        plane.visible = false;; 

        return plane;
    }

//************************************************************************************
// UTILS
//************************************************************************************

    this.createVideo_Component = function(url, loop) 
    {
        var vid = document.createElement( 'video' );
        
        vid.muted = true;
        vid.autoplay = true;
        vid.loop = loop;
        vid.src = url;

        var objVideo = {
            vid : vid
        };

        vid.play();

        list_contents.push(objVideo);

        return objVideo;
    } 
}

