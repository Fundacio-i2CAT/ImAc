/**
 * @author isaac.fraile@i2cat.net
 */

THREE.MediaObjectData = function () {

    var subtitleFont; 
    var ST_font = "500 40px Roboto, Arial";
    var ST_font2 = "400 30px Roboto, Arial";

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

    this.getDirectiveVideo = function(url, name) 
    {
        var geometry = new THREE.PlaneGeometry( 160, 90 );
        var sphere = getVideoMesh( geometry, url, name, 0 );

        sphere.position.z = -78;

        return sphere;
    };

    this.getSphericalColorMesh = function(size, color, name) 
    {
        var geometry = new THREE.SphereBufferGeometry( size, 32, 32, Math.PI/2 );
        geometry.scale( - 1, 1, 1 );
        var material = new THREE.MeshBasicMaterial( {color: color} );
        var sphere = new THREE.Mesh( geometry, material );
        
        return sphere;
    };

    this.getSignVideoMesh = function(name, hasSLSubtitles) {

        let signer =  new THREE.Group();
        signer.name = name;

        if(localStorage.getItem("signPosition")){
            let savedPosition = JSON.parse(localStorage.getItem("signPosition"))
            signer.position.set( savedPosition.x, savedPosition.y, 0)
        } else {
            let x = _isHMD ? 0.6 * ( 1.48*slConfig.area/2 - slConfig.size/2 ) *slConfig.canvasPos.x : ( 1.48*slConfig.area/2 - slConfig.size/2 ) *slConfig.canvasPos.x;
            let y = _isHMD ? 0.6 * ( 0.82*slConfig.area/2 - slConfig.size/2) *slConfig.canvasPos.y : ( 0.82*slConfig.area/2 - slConfig.size/2 ) *slConfig.canvasPos.y;
            signer.position.set( x, y, 0)
        }


        const geometry = new THREE.PlaneGeometry( 20, 20 );
        let video = getVideoMesh( geometry, slConfig.url, name, 1 );
        video.name = 'sl-video';

        if ( !hasSLSubtitles ){
            const arrows = getSubtitlesArrowMesh(120/6, 1, 0xffffff, 0x000000, 0);
            const material = new THREE.MeshBasicMaterial( { color: 0x000000,  transparent: true, opacity: 0.5 } );
            let mesh = new THREE.Mesh( new THREE.PlaneGeometry( 38, 8.4 ), material );

            mesh.add(arrows);
            mesh.position.y = -10 -4.4/2;
            mesh.scale.set( 0.98*70/130, 0.98*70/130, 1 )
            mesh.visible = stConfig.indicator == 'arrow' ? true : false;
            mesh.name = 'backgroundSL';

            signer.add( mesh );

        }
        var signerColorBorderGeom = new THREE.PlaneGeometry( 20, 20, 32 );
        var signerColorBorderMat = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
        var signColorBorder = new THREE.Mesh( signerColorBorderGeom, signerColorBorderMat );
    
        signColorBorder.position.z = -0.01;
        signColorBorder.scale.multiplyScalar(1.05);

        //This option is creating a border but it has an issue in windows, only 1px border is possible.
        /*const signColorBorder = new THREE.LineSegments( 
            new THREE.EdgesGeometry( geometry ), 
            new THREE.LineBasicMaterial( { color: 0xffff00, linewidth: 4 } ) 
        );*/

        signColorBorder.name = 'sl-colorFrame';
        signColorBorder.visible = false;

        signer.add( signColorBorder );
        signer.add(video);
 
        return signer;
    };


    this.getSLSubtitleMesh = function(textList, slopacity, slconfig){
        var material = new THREE.MeshBasicMaterial( { color: 0x000000,  transparent: true, opacity: 0 } );
        //var plane = new THREE.Mesh( new THREE.PlaneGeometry( 20, 20 ), material );
        //var group = new THREE.Group();
        var slsize = 0.46;
        var font = textList[0].text.length < 14 ? ST_font : ST_font2;

        let subtitles4SLMesh = _moData.getSubtitleMesh(textList, slconfig, font, slopacity, true, 'sl-subtitles');
       
        //plane.add( group );
        //plane.name = 'st4slmesh';

        scene.getObjectByName('sl-colorFrame').scale.y = 1.23;
        scene.getObjectByName('sl-colorFrame').position.y = - 10*0.46/2;

        subtitles4SLMesh.position.y = -10 - 1.9;
        
        return subtitles4SLMesh;
    };


    // subtitols fixed position
    this.getExpEmojiSubtitleMesh = function(textList)
    {
        var group = new THREE.Group();

        var difPosition = stConfig.scenePos.lon ? getViewDifPositionTest( -stConfig.scenePos.lon, camera.fov ) : 0;


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
            setFixedArrow( mesh, 0, textList, isRight );

            mesh.position.x = 70 * Math.cos( Math.radians( lon-90 +stConfig.scenePos.lon) ) * Math.cos( Math.radians( -lat -20) );
            mesh.position.y = 70 * Math.sin( Math.radians( -lat -20) );
            mesh.position.z = 70 * Math.sin( Math.radians( lon-90 +stConfig.scenePos.lon) ) * Math.cos( Math.radians( -lat -20) );

            mesh.lookAt(0,0,0)

            group.add( mesh )
        }

        var needajust = false;
        if ( stConfig.scenePos.lon ) {}
        else {
            stConfig.scenePos.lon = -lon;
            stConfig.scenePos.lat = -lat;
            needajust = true;
        }
        //console.warn( position )

        ////////////////////////////////////////////////////////////////////////////////////
        stConfig.canvasPos.x = 0;
        stConfig.canvasPos.y = 70 * Math.sin( Math.radians( stConfig.scenePos.lat ) );
        //config.z = config.z * Math.cos( Math.radians( stConfig.scenePos.lat ) );

        var stmesh = _moData.getSubtitleMesh(textList, ST_font, false, 'subtitles');

        /*if ( needajust ) {
            

            stmesh.lookAt(0,0,0)
        }*/
        stmesh.position.x = 70 * Math.cos( Math.radians( lon-90 +stConfig.scenePos.lon) ) * Math.cos( Math.radians( -lat -20) );
        stmesh.position.y = 70 * Math.sin( Math.radians( -lat -20) );
        stmesh.position.z = 70 * Math.sin( Math.radians( lon-90 +stConfig.scenePos.lon) ) * Math.cos( Math.radians( -lat -20) );
        
       // group.add( stmesh );
        
        //group.rotation.y = Math.radians( stConfig.scenePos.lon );
        //stmesh.rotation.y = Math.radians( stConfig.scenePos.lon );
        stmesh.lookAt(0,0,0);

        return stmesh;
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
        //Starting point is (x=0, y=0);
        ctx.moveTo(-width/2, 0);
        ctx.lineTo( -width/2, height/2 - radius );  
        ctx.quadraticCurveTo( -width/2, height/2, -width/2 + radius, height/2);
        ctx.lineTo( width/2 - radius, height/2 );
        ctx.quadraticCurveTo( width/2, height/2, width/2, height/2 - radius );
        ctx.lineTo( width/2, -height/2 + radius );
        ctx.quadraticCurveTo( width/2, -height/2, width/2 - radius, -height/2 );
        ctx.lineTo( -width/2 + radius, -height/2 );
        ctx.quadraticCurveTo( -width/2,-height/2, -width/2,-height/2 + radius );
      return ctx;
    };


    this.getSubtitleMesh = function (t, font, isSL, name){

        const margin = 5;
        const opacity = stConfig.background;
        let scaleFactor;

        var group = new THREE.Group();
        group.name = name;

        if(isSL){
            var cnv = document.getElementById( "canvas2" );
        } else {
            var cnv = document.getElementById( "canvas" );
        }
        var ctx = cnv.getContext( "2d" );
        var ch = 50; // canvas height x line
        var fh = 40; // font height 

        ctx.font = font;
        var width = ctx.measureText( t[0].text ).width;
        if(!isSL){
            var width2 = t[1] ? ctx.measureText( t[1].text ).width : 0;
            cnv.width = ( width > width2 ) ? width + 20 : width2 + 20;
            cnv.height = ch*t.length;
        } else{ 
            cnv.width = 260;
            cnv.height = ch;
        }

        if ( t[0] ) createCanvasTextLine( ctx, t[0].text, ST_font, t[0].color, 0, 0, cnv.width, ch, opacity, ( cnv.width - width )/2, fh );
        if ( t[1] ) createCanvasTextLine( ctx, t[1].text, ST_font, t[1].color, 0, ch, cnv.width, ch, opacity, ( cnv.width - width2 )/2, fh + ch );

        var material = new THREE.MeshBasicMaterial( { map: new THREE.CanvasTexture( cnv ),  transparent: true } );
        var textMesh = new THREE.Mesh( new THREE.PlaneGeometry( cnv.width/6, ch*t.length/6 ), material );

        //Depending on the line number the center of the text mesh will change;
        let stLineFactorCorrection = (t[1]) ? (textMesh.geometry.parameters.height/4) : (textMesh.geometry.parameters.height/2);
        
        let arrows = getSubtitlesArrowMesh(cnv.width/6, t.length, t[0].color, t[0].backgroundColor, opacity);

        if(isSL){
            scaleFactor = 0.46;
            textMesh.scale.set( scaleFactor, scaleFactor, 1 );
            textMesh.position.y = 0;
        } else {
            const vFOV = THREE.Math.degToRad( camera.fov ); // convert vertical fov to radians
            const height = 2 * Math.tan( vFOV / 2 ) * 70; // visible height
            const width = height * camera.aspect;

            let latitud = stConfig.canvasPos.y * (30 * stConfig.area/100);
            let posY = _isHMD && !stConfig.fixedSpeaker ? 80 * Math.sin( Math.radians( latitud ) ) : 135 * Math.sin( Math.radians( latitud ) );

            let  y = (stConfig.fixedSpeaker) ? posY : (stConfig.canvasPos.y * (height/2 - margin));

            let esaySizeAjust = stConfig.easy2Read ? 1.25 : 1;
            scaleFactor = (stConfig.area/130) * (stConfig.size * esaySizeAjust);
            textMesh.scale.set( scaleFactor, scaleFactor, 1 );
            if(!stConfig.fixedSpeaker || !stConfig.fixedScene){
                textMesh.position.y = y - stConfig.canvasPos.y*stLineFactorCorrection*scaleFactor;
                textMesh.position.x = 0;
            } else if(stConfig.fixedScene){
                textMesh.position.y = -20;
                textMesh.position.z = -75;
                textMesh.lookAt(new THREE.Vector3(0, 0, 0));
            }

        }
        textMesh.name = 'emojitext';
        textMesh.visible = true;

        arrows.position.y = textMesh.position.y;

        group.add(textMesh);
        group.add(arrows);

        return group;
    };

    this.getSceneFixedSubtitles = function(textList, streps){
        let group = new THREE.Group();
        for (let i = 0; i < streps ; i++) {
            let mesh = _moData.getSubtitleMesh( textList, ST_font, false, 'fixed-st-'+i);
            mesh.rotation.y = Math.radians( i*(360/streps) );
            group.add( mesh );
        }
        group.name = 'subtitles';
        return group;
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

    function getImageMesh(geometry, url, name) 
    {
        var loader = new THREE.TextureLoader();
        var texture = loader.load( url );
        texture.minFilter = THREE.LinearFilter;
        texture.format = THREE.RGBAFormat;

        var material = new THREE.MeshBasicMaterial( { map: texture, transparent: true, side: THREE.FrontSide } );
        var mesh = new THREE.Mesh( geometry, material );

        mesh.name = name;

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

    function setFixedArrow(mesh, cw, t, right)
    {
        if ( right ){
            var geometry = new THREE.PlaneGeometry( 6.5, 6.5 );
            var arrow = getImageMesh( geometry, './img/arrow_final.png', 'right', 3 );
            arrow.material.color.set( t[0].color );
            arrow.add( getBackgroundMesh ( 9.4, 8.4, t[0].backgroundColor, stConfig.background ) );
            mesh.add( arrow );
        } else { 
            var geometry = new THREE.PlaneGeometry( 6.5, 6.5 );
            var arrow = getImageMesh( geometry, './img/arrow_final.png', 'left', 3 );
            arrow.material.color.set( t[0].color );
            arrow.rotation.z = Math.PI;
            arrow.add( getBackgroundMesh ( 9.4, 8.4, t[0].backgroundColor, stConfig.background ) );
            mesh.add( arrow );
        }
    }

    function getSubtitlesArrowMesh(cw, size, color, backgroundColor, o){
        let arrowGroup = new THREE.Group();
        const geometry = new THREE.PlaneGeometry( 6.5, 6.5 );

        var arrow = getImageMesh( geometry, './img/arrow_final.png', 'right');
        arrow.material.color.set( color );
        arrow.add( getBackgroundMesh ( 9.4, 8.3*size, backgroundColor, o ) );
        arrow.position.x = cw/2 + 4.7;
        arrow.visible = false;
        arrowGroup.add( arrow );

        var arrow = getImageMesh( geometry, './img/arrow_final.png', 'left');
        arrow.material.color.set( color );
        arrow.rotation.z = Math.PI;
        arrow.add( getBackgroundMesh ( 9.4, 8.3*size, backgroundColor, o ) );
        arrow.position.x = -cw/2 - 4.7;
        arrow.visible = false;
        arrowGroup.add( arrow );

        arrowGroup.name = 'arrows';

        return arrowGroup;
    }


    function createCanvasTextLine(ctx, text, font, color, x, y, w, h, o, fw, fh )
    {
        ctx.font = font;
        if ( o != 0 ) createCanvasFillRect( ctx, x, y, w, h, o );
        createCanvasText( ctx, text, font, color, fw, fh );
        if ( o == 0 ) createCanvasStrokeText( ctx, text, fw, fh );
    }


    function getPointMesh(w, h, c, o)
    {
        var pointer = new THREE.Mesh(
            new THREE.SphereBufferGeometry( w, h, 8 ),
            new THREE.MeshBasicMaterial( { color: c, transparent: true, opacity: o } )
        );

        return pointer;
    }

    function getTextMesh(text, size, color, name, func, cw, ch)
    {
        //console.warn('This function need to be updated')
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