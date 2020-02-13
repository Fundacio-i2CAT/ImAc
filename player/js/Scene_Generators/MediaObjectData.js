/**
 * @author isaac.fraile@i2cat.net
 */

THREE.MediaObjectData = function () {

    var subtitleFont; 
    var ST_font =  "500 40px Roboto, Arial";


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

    this.getSignVideoMesh = function(name) {
        const scaleFactor = slConfig.size/slConfig.maxSize;
        let signer =  new THREE.Group();
        signer.name = name;
        signer.visible = false;

        let x = _isHMD ? 0.6 * ( 1.48*slConfig.area/2 - slConfig.size/2 ) *slConfig.canvasPos.x : ( 1.48*slConfig.area/2 - slConfig.size/2 ) *slConfig.canvasPos.x;
        let y = slConfig.canvasPos.y * (vHeight*(1-safeFactor) - slConfig.size)/2;

        //This will save the very 1st position.
        if(!slConfig.initPos){
            slConfig.initPos = new THREE.Vector2(x, y);
        }

        if(localStorage.getItem("slPosition")){
            let savedPosition = JSON.parse(localStorage.getItem("slPosition"))
            signer.position.set( savedPosition.x, savedPosition.y, 0)
        } else {
            signer.position.set(x, y, 0);
        }

        const geometry = new THREE.PlaneGeometry( slConfig.maxSize, slConfig.maxSize );
        let video = getVideoMesh( geometry, slConfig.url, name, 1 );
        video.name = 'sl-video';
        video.scale.set(scaleFactor, scaleFactor, 1);

        let signerColorBorderGeom = new THREE.PlaneGeometry( slConfig.maxSize, slConfig.maxSize, 32 );
        let signerColorBorderMat = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
        let signColorBorder = new THREE.Mesh( signerColorBorderGeom, signerColorBorderMat );
        signColorBorder.position.z = -0.01;
        signColorBorder.name = 'sl-colorFrame';
        signColorBorder.visible = false;

        if( !imsc1doc_SL ){        
            let textList = [{
                  text: "",
                  color: "rgb(255,255,255)",
                  backgroundColor: "rgb(0,0,0)"
            }];
            let st4sl = _moData.getSLSubtitleMesh(textList);
            st4sl.visible = (stConfig.indicator == 'arrow' && !stConfig.isEnabled) ? true : false;
            signer.add( st4sl );
        }

        signer.add(signColorBorder );
        signer.add(video);
 
        return signer;
    };


    this.getSLSubtitleMesh = function(textList){
        const material = new THREE.MeshBasicMaterial( { color: 0x000000,  transparent: true, opacity: 0 } );
        let font;

        if(textList[0].text.length < 12){
            font = "500 40px Roboto, Arial";
        } else if (textList[0].text.length < 16){
            font = "500 35px Roboto, Arial"
        } else if (textList[0].text.length < 18) {
            font = "500 30px Roboto, Arial"
        }

        let subtitles4SLMesh = _moData.getSubtitleMesh(textList, font, true, 'sl-subtitles');
        return subtitles4SLMesh;
    };


    // subtitols fixed position
    this.getSpeakerSubtitleMesh = function(textList)
    {
        var group = new THREE.Group();

        var difPosition = stConfig.scenePos.lon ? getViewDifPositionTest( stConfig.scenePos.lon, camera.fov ) : 0;

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

        var stmesh = getSpeakerSubMesh( textList, ST_font, true ) 

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


    function getSpeakerSubMesh(t, font, fixed)
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
        scaleFactor = (stConfig.area/130) * stConfig.size * esaySizeAjust;
        mesh.scale.set( scaleFactor, scaleFactor, 1 );

        mesh.name = 'emojitext';
        mesh.renderOrder = 3;
        mesh.position.z = -80 * Math.cos( Math.radians( stConfig.scenePos.lat ) );
        mesh.position.y = 80 * Math.sin( Math.radians( stConfig.scenePos.lat ) );
        mesh.position.x = 0;
        mesh.visible = true;

        mesh.lookAt(0,0,0);

        return mesh;
    }

    this.getSubtitleMesh = function (t, font, isSL, name){
        const opacity = (isSL) ? 0.75 : stConfig.background;
        let scaleFactor = 1;
        let cnv;

        let stGroup = new THREE.Group();
        stGroup.name = name;

        if(isSL){
            cnv = document.getElementById( "canvas2" );
        } else {
            cnv = document.getElementById( "canvas" );
        }
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

        let arrows = getSubtitlesArrowMesh(6.5, t.length, t[0].color, t[0].backgroundColor, (!imsc1doc_SL && !stConfig.isEnabled) ? 0 : opacity);

        if (isSL){//&& !imsc1doc_SL){
            scaleFactor = (slConfig.size/textMesh.geometry.parameters.width);
            stGroup.position.y = -(slConfig.size + textMesh.geometry.parameters.height*scaleFactor)/2;
            stGroup.position.x = 0;
        } else {
            scaleFactor = (stConfig.area/130) * stConfig.size * (stConfig.easy2read ? 1.25 : 1);
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
                    stGroup.position.x = (slConfig.isEnabled ? _stMngr.removeOverlap(scaleFactor) : 0);
                }
                let stColorBorderGeom = new THREE.PlaneGeometry( stConfig.width+1, stConfig.height+1, 32 );
                let stColorBorderMat = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
                let stColorBorder = new THREE.Mesh( stColorBorderGeom, stColorBorderMat );
                stColorBorder.position.z = -0.01;
                stColorBorder.name = 'st-colorFrame';
                stColorBorder.visible = false;
                stGroup.add(stColorBorder);
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

    this.getSceneFixedSubtitles = function(textList, stReps){
        let group = new THREE.Group();
        for (let i = 0; i < stReps ; i++) {
            let mesh = _moData.getSubtitleMesh( textList, ST_font, false, 'fixed-st-'+i);
            mesh.rotation.y = Math.radians( i*(360/stReps) );
            group.add( mesh );
        }
        group.name = 'subtitles';
        group.position.y = -20
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
        //mesh.renderOrder = order || 0;

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

/**
 * Gets the background mesh.
 *
 * @param      {Number}  w       The width
 * @param      {Number}  h       The height
 * @param      {<type>}  c       The color
 * @param      {Number}  o       The opacity
 * @return     {THREE}   The background mesh.
 */
    function getBackgroundMesh(w, h, c, o){
        var material = new THREE.MeshBasicMaterial( { color: c, transparent: true, opacity: o } );
        var geometry = new THREE.PlaneGeometry( w, h ); 
        var mesh = new THREE.Mesh( geometry, material );
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
            let arrowback = getBackgroundMesh ( geometry.parameters.width * 1.5, 8.4, t[0].backgroundColor, stConfig.background );
            arrowback.position.z = -0.01;
            arrow.add( arrowback );
            mesh.add( arrow );
        } else { 
            var geometry = new THREE.PlaneGeometry( 6.5, 6.5 );
            var arrow = getImageMesh( geometry, './img/arrow_final.png', 'left', 3 );
            arrow.material.color.set( t[0].color );
            arrow.rotation.z = Math.PI;
            let arrowback = getBackgroundMesh ( geometry.parameters.width * 1.5, 8.4, t[0].backgroundColor, stConfig.background );
            arrowback.position.z = -0.01;
            arrow.add( arrowback );
            mesh.add( arrow );
        }
    }

/**
 * Gets the subtitles arrow mesh.
 *
 * @param      {number}  lineFactor       The number of lines factor
 * @param      {<type>}  color            The color
 * @param      {<type>}  backgroundColor  The background color
 * @param      {<type>}  o                { parameter_description }
 * @return     {THREE}   The subtitles arrow mesh.
 */
    function getSubtitlesArrowMesh(size, lineFactor, color, backgroundColor, o){
        const arwGeom = new THREE.PlaneGeometry( size, size );    
        let arrowGroup = new THREE.Group();
        arrowGroup.name = 'arrows';

        let arrowR = new THREE.Group();
        arrowR.name = 'right';
        let arrowImgR = getImageMesh( arwGeom, './img/arrow_final.png', 'right-img');
        arrowImgR.material.color.set( color );
        arrowImgR.position.z = 0.01;
        let arrowBckgR = getBackgroundMesh ( arwGeom.parameters.width * 1.5, 8.3*lineFactor, backgroundColor, o );
        arrowR.add(arrowImgR);
        arrowR.add(arrowBckgR);
        arrowR.visible = false;

        let arrowL = new THREE.Group();
        arrowL.name = 'left';
        let arrowImgL = getImageMesh( arwGeom, './img/arrow_final.png', 'left-img');
        arrowImgL.material.color.set( color );
        arrowImgL.position.z = 0.01;
        arrowImgL.rotation.z = Math.PI;
        let arrowBckgL = getBackgroundMesh ( arwGeom.parameters.width * 1.5, 8.3*lineFactor, backgroundColor, o );
        arrowL.add(arrowImgL);
        arrowL.add(arrowBckgL);
        arrowL.visible = false;

        arrowGroup.add( arrowL );
        arrowGroup.add( arrowR );

        return arrowGroup;
    }

/**
 * Creates a canvas text line.
 *
 * @param      {<type>}  ctx     The context
 * @param      {<type>}  text    The text
 * @param      {<type>}  font    The font
 * @param      {<type>}  color   The color
 * @param      {<type>}  x       { parameter_description }
 * @param      {<type>}  y       { parameter_description }
 * @param      {<type>}  w       { parameter_description }
 * @param      {<type>}  h       { parameter_description }
 * @param      {number}  o       { parameter_description }
 * @param      {<type>}  fw      The firmware
 * @param      {<type>}  fh      { parameter_description }
 */
    function createCanvasTextLine(ctx, text, font, color, x, y, w, h, o, fw, fh ){
        ctx.font = font;
        if ( o != 0 ) createCanvasFillRect( ctx, x, y, w, h, o );
        createCanvasText( ctx, text, font, color, fw, fh );
        if ( o == 0 ) createCanvasStrokeText( ctx, text, fw, fh );
    }

/**
 * Gets the point mesh.
 *
 * @param      {<type>}  w       { parameter_description }
 * @param      {<type>}  h       { parameter_description }
 * @param      {<type>}  c       { parameter_description }
 * @param      {<type>}  o       { parameter_description }
 * @return     {THREE}   The point mesh.
 */
    function getPointMesh(w, h, c, o){
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