

SLManager = function() 
{
    let subtitleSLMesh;    // ST4SL mesh object saved state;

    let _signerMesh;

    let _conf = {
        url: '',                                // {String}   Signer video url.
        st4sltext: '',                          // {String}   Text for the signer subtitles.
        isMoved: false,                         // {Boolean}  Has the signer been moved by the user.
        isEnabled: false,                       // {Boolean}  Determines if the signer video is active or not.
        initPos: null,                          // {Vector2}  Initial position of the signer video when 1st created.
        canvasPos: new THREE.Vector2( 1, -1 ),  // {Vector2}  Screen position of the signer video.
        scenePos: { lat: 0, lon: 0 },           // {Object}   Wolrd position of the signer video.
        language: 'en',                         // {String}   Language of the signer video. Default is English.
        area: 60,                               // {Integer}  Limit area where objects can be placed.
        size: 18,                               // {Integer}  Signer video size. Default medium size.
        maxSize: 20,                            // {Integer}  Maximum size the signer video can be.
        autoHide: false,                        // {Boolean}  Determines if the autohide option is enabled or not.
        availableLang: []                       // {Array}    Array of available lamguages through which the video can change.
    };


    // URGENT REFACTOR
    this.initConfig = function(conf)
    {
        // NEEDS TO BE ADDED THE PRE STABLISHED VALUES FROM THE WEB (utils.js line 313)
        let config = {
            url: '',                              // {String}   Signer video url.
            st4sltext: '',                        // {String}   Text for the signer subtitles.
            isMoved: false,                       // {Boolean}  Has the signer been moved by the user.
            isEnabled: false,                     // {Boolean}  Determines if the signer video is active or not.
            initPos: null,                        // {Vector2}  Initial position of the signer video when 1st created.
            canvasPos: new THREE.Vector2(1, -1),  // {Vector2}  Screen position of the signer video.
            scenePos: { lat: 0, lon: 0 },         // {Object}   Wolrd position of the signer video.
            language: 'en',                       // {String}   Language of the signer video. Default is English.
            area: 60,                             // {Integer}  Limit area where objects can be placed.
            size: 18,                             // {Integer}  Signer video size. Default medium size.
            maxSize: 20,                          // {Integer}  Maximum size the signer video can be.
            autoHide: false,                      // {Boolean}  Determines if the autohide option is enabled or not.
            availableLang: []                     // {Array}    Array of available lamguages through which the video can change.
        };

        return config;
    }

    // revisar
    this.create = function() 
    {
        _slMngr.remove(); 
 
        let scaleFactor = _isHMD ? 0.8*slConfig.size/slConfig.maxSize : slConfig.size/slConfig.maxSize;
        let st4sl = undefined;

        if( !subController.hasImsc1docSL() )
        {        
            let textList = [{
                  text: "",
                  color: "rgb(255,255,255)",
                  backgroundColor: "rgb(0,0,0)"
            }];

            st4sl = _stMngr.getST4SL( textList, "500 40px Roboto, Arial", 'sl-subtitles' );

            st4sl.visible = (stConfig.indicator == 'arrow' && !stConfig.isEnabled) ? true : false;
        }

        let x = _isHMD ? 0.5 * ( 1.48*slConfig.area/2 - slConfig.size/2 ) *slConfig.canvasPos.x : ( 1.48*slConfig.area/2 - slConfig.size/2 ) *slConfig.canvasPos.x;
        let y = _isHMD ? slConfig.canvasPos.y * (vHeight*(1-safeFactor) - 0.8*slConfig.size)/2 : slConfig.canvasPos.y * (vHeight*(1-safeFactor) - slConfig.size)/2;

        //This will save the very 1st position.
        if ( !slConfig.initPos )
        {
            slConfig.initPos = new THREE.Vector2(x, y);
        }

        if(localStorage.getItem("slPosition")){
            let savedPosition = JSON.parse(localStorage.getItem("slPosition"))
            x = savedPosition.x;
            y = savedPosition.y;
        } 

        let slvideo = VideoController.getVideObject( 'signer', slConfig.url )

        // Add signer element to the canvas.
        canvasMgr.addElement( _meshGen.getSignerMesh( slvideo, x, y, scaleFactor, slConfig.maxSize, st4sl ) );

        // Save the signer element in a global class variable.
        _signerMesh = _canvasObj.getObjectByName('signer');
        _conf.isEnabled = true;

        if(stConfig.isEnabled){
            _signerMesh.position.y = Math.abs(_signerMesh.position.y) * stConfig.canvasPos.y;
            //Not working as it should (CHECK)
            let subtitles = _stMngr.getSubtitles();
            if(subtitles){
                //subtitles.position.x = _stMngr.removeOverlap(subtitles.scale.x);
            }
        }

        if (subController.hasImsc1docSL()) {
            // If the metadata has ST (imsc1doc_SL) for SL, 
            // create and add the ST mesh under the SL video.
            if (slConfig.st4sltext){
                _slMngr.createSLSubtitle(slConfig.st4sltext);  
            } 
        }
        // Play the SL video.
        VideoController.play(1, slConfig.url, _signerMesh);
        if (VideoController.getListOfVideoContents()[0].vid.paused) VideoController.pauseAll()
    };

    this.remove = function() 
    {
        if ( _signerMesh ) 
        {
            VideoController.removeContentById( _signerMesh.name );

            canvasMgr.removeElement( _signerMesh );

            _signerMesh = undefined;
            _conf.isEnabled = false;
        }
    }

    this.move = function( pos )
    {
        if ( elementSelection ) 
        {
            scene.getObjectByName( 'trad-main-menu' ).visible = false;
            scene.getObjectByName( 'trad-option-menu' ).visible = false;

            if ( _signerMesh ) 
            {
                let st4slHeight = subtitleSLMesh ? subtitleSLMesh.children[0].geometry.parameters.height : 0;
                let paramX = ( vHeight * camera.aspect - slConfig.size )/2;


                if ( pos.x > -paramX && pos.x < paramX ) 
                {
                    _signerMesh.position.x = pos.x;
                }

                if (pos.y > -(vHeight - (slConfig.size + st4slHeight))/2 && pos.y < (vHeight - slConfig.size)/2) 
                {
                    _signerMesh.position.y = pos.y;
                }
            }
        }
    }

    this.createSLSubtitle = function(textList){
        if( subController.hasImsc1docSL() ){
            _slMngr.removeSLSubtitle(); 

        } 
        slConfig.st4sltext = textList;

        let font = textList[0].text.length < 12 ? "500 40px Roboto, Arial" : textList[0].text.length < 16 ? "500 35px Roboto, Arial" : "500 30px Roboto, Arial";

        subtitleSLMesh = _stMngr.getST4SL( textList, font, 'sl-subtitles' );

        _canvasObj.getObjectByName('signer').add(subtitleSLMesh);
       _slMngr.updatePositionY();
    }

    this.removeSLSubtitle = function()
    {
        subController.resetST4SLMenory();
        _canvasObj.getObjectByName('signer').remove(subtitleSLMesh);
        subtitleSLMesh = undefined;
    }

    this.switchSigner = function(enable)
    {
        _conf.isEnabled = enable;
        enable ? _slMngr.create() : _slMngr.remove();

        if ( enable ) 
        {
            if ( stConfig.indicator.localeCompare( 'arrow' ) === 0 ) 
            {
                if ( scene.getObjectByName( 'backgroundSL' ) ) 
                {
                    scene.getObjectByName( 'backgroundSL' ).visible = !stConfig.isEnabled;
                }
            }

            if (stConfig.isEnabled) _stMngr.remove();
        }
    };

    this.scaleColorBorder = function(element)
    {
        let slSTscale = _signerMesh.getObjectByName('sl-subtitles').scale.x;
        let slSTHeight = _signerMesh.getObjectByName('sl-subtitles').children[0].geometry.parameters.height*slSTscale;
        let newScale = 1;

        if (_signerMesh.getObjectByName('sl-subtitles').visible) {
           newScale = ((slConfig.size+slSTHeight)/slConfig.size);
           element.position.y = -((slSTHeight)/2);
        } else {
           element.position.y = 0;
        }
        element.scale.y = newScale * (slConfig.size+1)/slConfig.maxSize;
        element.scale.x = (slConfig.size+1)/slConfig.maxSize;
    };

    this.updatePositionY = function(){
        if (_signerMesh && !localStorage.getItem("slPosition")) {
            let st4slMesh = _signerMesh.getObjectByName('sl-subtitles');
            let y = _isHMD ? (vHeight*(1-safeFactor) - 0.8*slConfig.size)/2 : (vHeight*(1-safeFactor) - slConfig.size)/2;                
            let offsetY = 0;
            if((subController.hasImsc1docSL() && st4slMesh) || (stConfig.indicator.localeCompare('arrow') === 0 && !stConfig.isEnabled)){
                //Update the position of the signer subtitles.
                let scaleFactor = _isHMD ? 0.8*(slConfig.size/st4slMesh.children[0].geometry.parameters.width) : (slConfig.size/st4slMesh.children[0].geometry.parameters.width);
                st4slMesh.scale.set(scaleFactor, scaleFactor, 1);
                st4slMesh.position.y = _isHMD ? 0.825 *-(slConfig.size + st4slMesh.children[0].geometry.parameters.height*scaleFactor)/2 : -(slConfig.size + st4slMesh.children[0].geometry.parameters.height*scaleFactor)/2;

                // Add offset to the signer 'y' if the signer is on bottom position.
                if (slConfig.canvasPos.y < 0 && _conf.isEnabled){
                    offsetY = slConfig.canvasPos.y * st4slMesh.children[0].geometry.parameters.height * st4slMesh.scale.x;
                }
            }
            _signerMesh.position.y = slConfig.canvasPos.y * Math.abs(y + offsetY);
        }
    }

    this.getSigner = function(){
        return _signerMesh;
    };


   this.getSLAvailableLang = function(lang){
       if (list_contents[demoId].signer[0][lang]) {
           return lang;
       } else if (list_contents[demoId].acces[0].SL && list_contents[demoId].signer[0][list_contents[demoId].acces[0].SL[0]]) {
           _iconf.sllanguage = list_contents[demoId].acces[0].SL[0];
           return list_contents[demoId].acces[0].SL[0];
       } else {
           return;
       }
   };


    this.setPosition = function( x, y )
    {
        if ( _signerMesh )
        {
            _signerMesh.position.x = x;
            _signerMesh.position.y = y;
        }

        slConfig.canvasPos.x = Math.sign( x );

        if ( stConfig.isEnabled ) 
        {
            slConfig.canvasPos.y = Math.sign( y );
            _stMngr.remove();
        } 
        else 
        {
            slConfig.canvasPos.y = -1;
        }

        _slMngr.updatePositionY();
        _rdr.updateRadarPosition();
    };


    this.setSize = function(size){
        let scaleFactor = _isHMD ? 0.8*size/slConfig.maxSize : size/slConfig.maxSize;
        if (_signerMesh) {
            _signerMesh.getObjectByName('sl-video').scale.set(scaleFactor, scaleFactor, 1);
            slConfig.size = size;
            if(_signerMesh.getObjectByName('sl-subtitles').visible){
                _slMngr.updatePositionY();
            } else {
                _signerMesh.position.y = slConfig.canvasPos.y * (vHeight*(1-safeFactor) - slConfig.size)/2;
            } 
        }

        if(_conf.isEnabled){
            _stMngr.remove();
        }
    };


    this.setContent = function(url, lang) {
        slConfig.url = url;
        slConfig.language = lang;
        if (_conf.isEnabled) {
            _slMngr.create();
        }
    };


    this.setLanguagesArray = function(subList){
        slConfig.availableLang = [];

        if (subList.en) {
            slConfig.availableLang.push({
                name: 'signerEngButton',
                value: 'en',
                default: (slConfig.language.localeCompare('en') === 0)
            });
        }

        if (subList.de) {
            slConfig.availableLang.push({
                name: 'signerGerButton',
                value: 'de',
                default: (slConfig.language.localeCompare('de') === 0)
            });
        }

        if (subList.es) {
            slConfig.availableLang.push({
                name: 'signerEspButton',
                value: 'es',
                default: (slConfig.language.localeCompare('es') === 0)
            });
        }

        if (subList.ca) {
            slConfig.availableLang.push({
                name: 'signerCatButton',
                value: 'ca',
                default: (slConfig.language.localeCompare('ca') === 0)
            });
        }
    };

    this.checkisSignAvailable = function(lang){
        if (!lang && list_contents[demoId].acces[0].SL) {
            lang = list_contents[demoId].acces[0].SL[0];
        }
        return (list_contents[demoId].acces && list_contents[demoId].acces[0].SL && list_contents[demoId].acces[0].SL.includes((lang) ? lang : _iconf.sllanguage));
    };



    /////////////////////////////////////////////////////////////////////////////////////////////

    this.isSLEnabled = function()
    {
        return _conf.isEnabled;
    }

    // revisar
    this.updateSLPosition = function( aux=1 )
    {
        if( _conf.isEnabled && !localStorage.getItem( "slPosition" ) )
        {
            _slMngr.setPosition( _signerMesh.position.x, aux*Math.abs( _signerMesh.position.y ) );
        } 
    }

    // revisar
    this.updateSLPositionByST = function( isFixedScene=false, posY=-1 )
    {
        if ( _conf.isEnabled && !localStorage.getItem( "slPosition" ) && !isFixedScene ) 
        {
            _slMngr.setPosition( slConfig.canvasPos.x*Math.abs( slConfig.initPos.x ), Math.abs( slConfig.initPos.y )*posY );
        }
    }

    this.generateST4SL = function( isdObj )
    {
        if ( _conf.isEnabled ) 
        {
            if ( isdObj.contents.length > 0 ) 
            { 
                if ( slConfig.autoHide ) _signerMesh.visible = true; 

                subController.printText( isdObj, true );
            } 
            else 
            {
                if ( slConfig.autoHide ) _signerMesh.visible = false;
                else _slMngr.removeSLSubtitle();
            }
        }
    }

}

// setPosition( slConfig.initPos.x, stConfig.canvasPos.y*Math.abs(slConfig.initPos.y) );
// setPosition( -slConfig.initPos.x, stConfig.canvasPos.y*Math.abs(slConfig.initPos.y) );