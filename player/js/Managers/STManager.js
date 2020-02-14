/**
 * { function_description }
 *
 * @class      STManager (name)
 * @return     {<type>}  { description_of_the_return_value }
 * 
 * - MAIN FUNCTION:
 *         · initConfig             -->
 *         · create                 -->
 *         · remove                 -->
 *         · move                   --> 
 *         
 * - PUBLIC FUNCTION:
 *         · switchSubtitles        -->  Enable or disable the subtitles.
 *         · removeOverlap          -->
 *         
 * - PRIVATE FUNCTION:
 * 
 * - PUBLIC GETTERS:
 *         · getSubtitles           -->
 *         · getSTAvailableLang     -->
 *         
 * - PUBLIC SETTERS: 
 *         · setSubtitle            -->
 *         · setIndicator           -->
 *         · setSize                -->
 *         · setBackground          -->
 *         · setEasy2Read           -->
 *         · setPosition            -->
 *         · setScenePos            -->
 *         · setLanguagesArray      -->
 *         
 * - PUBLIC CHECKERS:
 *         · checkisSubAvailable    --> 
 *         · checkSubEasyAvailable  --> 
 *         · checkSubtitleIdicator  -->      
 *         
 */
STManager = function() {

    let subtitles;    
    const indicators = {
        NONE: 'none',
        ARROW: 'arrow',
        RADAR: 'radar'
    };

/*****************************************************************************************************************************
*                                           M A I N     F U N C T I O N S  
******************************************************************************************************************************/    

/**
 * Initializes the configuration.
 *
 * @param      {<type>}  conf    The conf
 * @return     {<type>}  { description_of_the_return_value }
 */
    this.initConfig = function(conf){

        let config = {
            width: 0,
            height: 0,
            fixedSpeaker: false,
            fixedScene: false,
            isEnabled: false,
            initPos: null,
            canvasPos: new THREE.Vector2(0, -1),
            scenePos: { lat: 0, lon: 0 },
            language: 'en',
            indicator:  indicators.NONE,
            area: 70,
            size: 0.8, //Default medium size;
            easy2read: false,
            background: 0.75,
            availableLang: []
        };

        /*let config = {
            fixedSpeaker: (conf.fixedSpeaker) ? conf.fixedSpeaker : false,
            fixedScene: (conf.fixedScene) ? fixedScene : false,
            isEnabled: (conf.isEnabled) ? conf.isEnabled : false,
            canvasPos: (conf.stposition) ? new THREE.Vector2(conf.stposition.x, conf.stposition.y) :  new THREE.Vector2(0, -1),
            scenePos: { lat: 0, lon: 0 },
            language: (conf.stlanguage) ? conf.stlanguage : 'en',
            indicator: (conf.indicator) ? conf.indicator : indicators.NONE,
            area: (conf.safearea) ? conf.safearea : 70,
            size: (conf.stsize) ? conf.stsize : 1,
            easy2read: (conf.ste2r) ? conf.ste2r : false,
            background: (conf.stbackground) ? conf.stbackground : 0.75,
            availableLang: []
        }*/

        return config;
    };

/**
 * { function_description }
 *
 * @param      {<type>}  textList  The text list
 */
    this.create = function(textList){
        let stMesh;
        if(subtitles){
            _stMngr.remove();
        }
        
        if (!stConfig.fixedSpeaker && !stConfig.fixedScene){
            stMesh = _moData.getSubtitleMesh(textList, "500 40px Roboto, Arial", false, 'subtitles');
            canvasMgr.addElement(stMesh);
            subtitles = canvas.getObjectByName('subtitles');
        } else{
            stMesh = !stConfig.fixedScene ? _moData.getSpeakerSubtitleMesh(textList) : _moData.getSceneFixedSubtitles(textList, 3);
            scene.add( stMesh );
            subtitles = scene.getObjectByName('subtitles');
        }
    };

/**
 * Removes the object.
 */
    this.remove = function(){
        if(subtitles){
            subController.setTextListMemory( [] );
            (stConfig.fixedScene || stConfig.fixedSpeaker) ? scene.remove( subtitles ) : canvasMgr.removeElement( subtitles );
            subtitles = undefined;
        }
    };

/**
 * Function that moves the subtitles.
 *
 * @param      {<type>}  pos     The position
 */
    this.move = function(pos){
        if (elementSelection) {
            scene.getObjectByName('trad-main-menu').visible = false;
            scene.getObjectByName('trad-option-menu').visible = false;

            if(subtitles){
                let w = vHeight * camera.aspect - ((1+safeFactor) * elementSelection.getObjectByName('emojitext').geometry.parameters.width/2);
                let h = (vHeight - stConfig.height) * (1-safeFactor);
                if(stConfig.indicator.localeCompare(indicators.ARROW) == 0){
                    w = w - elementSelection.getObjectByName('arrows').children[0].children[1].geometry.parameters.width;
                }

                if(pos.x > -w/2 && pos.x < w/2){
                    canvas.getObjectByName('subtitles').position.x = pos.x;
                }

                if(pos.y > -h/2 && pos.y < h/2){
                    canvas.getObjectByName('subtitles').position.y = pos.y;
                }
            }
        }
    };

/*****************************************************************************************************************************
*                                           P U B L I C    F U N C T I O N S  
******************************************************************************************************************************/

/**
 * { function_description }
 *
 * @param      {<type>}  enable  The enable
 */
    this.switchSubtitles = function(enable){
        let signerMesh = _slMngr.getSigner();
        if (!enable){
            _stMngr.remove();
            //_rdr.hideRadar();
            if (stConfig.indicator.localeCompare(indicators.ARROW) === 0 && slConfig.isEnabled){
                if(!imsc1doc_SL) {
                    signerMesh.getObjectByName('sl-subtitles').visible = true;
                }
            }
        } else {
            if (stConfig.indicator.localeCompare(indicators.RADAR) === 0){
                _rdr.showRadar();
            }
            if (slConfig.isEnabled){
                if (!imsc1doc_SL){
                    signerMesh.getObjectByName('sl-subtitles').visible = false;
                }
            }
        }

        stConfig.isEnabled = enable;
    };

/**
 * Removes an overlap.
 *
 * @param      {number}  scaleFactor  The scale factor
 * @return     {number}  { description_of_the_return_value }
 */
    this.removeOverlap = function(scaleFactor){
        let signer = _slMngr.getSigner();
        let offset = 0;

        if(signer && !localStorage.getItem("slPosition")){
            let totalDif = 0;
            let arw = subController.getArrows();
            let stDif = (arw) ? scaleFactor*(stConfig.width/2 + arw.children[0].children[1].geometry.parameters.width) : scaleFactor*stConfig.width/2;
            let slDif = signer.position.x + (-slConfig.canvasPos.x)*slConfig.size/2 * (1+safeFactor);

            totalDif = -slConfig.canvasPos.x * slDif + stDif;
            if(totalDif>0 || Math.abs(totalDif) < 5){
                offset = -slConfig.canvasPos.x * totalDif
            }
        }
        return offset;
    };

/*****************************************************************************************************************************
*                                           P R I V A T E    F U N C T I O N S  
*****************************************************************************************************************************/


/*****************************************************************************************************************************
*                                          P U B L I C    G E T T E R S 
*****************************************************************************************************************************/

/**
 * Gets the subtitles.
 *
 * @return     {<type>}  The subtitles.
 */
    this.getSubtitles = function(){
        return subtitles;
    };

/**
 * Gets the st available language.
 *
 * @param      {<type>}  lang     The language
 * @param      {number}  [e2r=0]  The e 2 r
 * @return     {<type>}  The st available language.
 */
    this.getSTAvailableLang = function(lang, e2r=0){
        if (list_contents[demoId].subtitles[e2r][lang]) {
           return lang;
        } else if (list_contents[demoId].acces[0].ST && list_contents[demoId].subtitles[e2r][list_contents[demoId].acces[0].ST[0]]) {
           _iconf.stlanguage = list_contents[demoId].acces[0].ST[0];
           return list_contents[demoId].acces[0].ST[0];
        } else return;
    };

/*****************************************************************************************************************************
*                                          P U B L I C    S E T T E R S 
*****************************************************************************************************************************/

/**
 * Sets the subtitle.
 *
 * @param      {string}  xml            The path of the xml where the subtitles info is
 * @param      {<type>}  lang           The language of the subtitles
 * @param      {<type>}  accessService  The access service between st or sl
 */
    this.setSubtitle = function(xml, lang, accessService){
        stConfig.language = lang;
        let r = new XMLHttpRequest();
        r.open( "GET", xml );

        r.onreadystatechange = function (){
            if ( r.readyState === 4 && r.status === 200 ){
                switch (accessService){
                    case 'st':
                        imsc1doc = imsc.fromXML( r.responseText );
                        break;

                    case 'sl':
                        imsc1doc_SL = imsc.fromXML( r.responseText );
                        break;
                }
                subController.updateISD( VideoController.getMediaTime() );
            } else if ( r.readyState === 4 ){
                console.error('Status = ' + r.status + ' xml = ' + xml);
            }
        };
        r.send();
    };

/**
 * Sets the indicator.
 *
 * @param      {string}  value           The value
 * @param      {<type>}  childColumnOpt  The child column option
 */
    this.setIndicator = function(value, childColumnOpt){
        if(stConfig.indicator.localeCompare(value) != 0){
            stConfig.indicator = value;
            let signerMesh = _slMngr.getSigner();
            let arw = subController.getArrows();

            switch (stConfig.indicator){
                case indicators.NONE:
                    if (slConfig.isEnabled && !imsc1doc_SL){
                        signerMesh.getObjectByName('sl-subtitles').visible = false;
                    }
                    if (arw){
                        arw.visible = false;
                    }
                    _rdr.hideRadar();
                    break;

                case indicators.ARROW:
                    _rdr.hideRadar();
                    if (stConfig.isEnabled){
                        if (slConfig.isEnabled && !imsc1doc_SL){
                            signerMesh.getObjectByName('sl-subtitles').visible = false;
                        }
                    } else {
                        if (slConfig.isEnabled && !imsc1doc_SL){
                            signerMesh.getObjectByName('sl-subtitles').visible = true;
                        }
                    }
                    break;

                case indicators.RADAR:
                    _rdr.showRadar();
                    if( slConfig.isEnabled && !imsc1doc_SL){
                        signerMesh.getObjectByName('sl-subtitles').visible = false;
                    }
                    if(arw){
                        arw.visible = false;
                    }
                    _rdr.updateRadarPosition();
                    break;
            }
            _slMngr.updatePositionY();

            if (slConfig.isEnabled){
                if(stConfig.isEnabled){
                    if (subtitles) {
                        subtitles.position.x = _stMngr.removeOverlap(subtitles.scale.x);
                    }
                }
            } 
        }
    };

/**
 * Sets the size.
 *
 * @param      {number}  value   The value
 */
    this.setSize = function(value){
        stConfig.size = value;
        if(subtitles){
            let esaySizeAjust = stConfig.easy2read ? 1.25 : 1;
            scaleFactor = (stConfig.area/130) * stConfig.size * esaySizeAjust;
            subtitles.scale.set( scaleFactor, scaleFactor, 1 );
            subtitles.position.x = (slConfig.isEnabled ? _stMngr.removeOverlap(scaleFactor) : 0);
            subtitles.position.y = stConfig.canvasPos.y * (vHeight*(1-safeFactor) - scaleFactor*stConfig.height)/2;
        }
    };

/**
 * Sets the background.
 *
 * @param      {<type>}  value   The value
 */
    this.setBackground = function(value){
        stConfig.background = value;

        //FIND METHOD FOR DYNAMIC UPDATE (WITHOUT REMOVE/CREATE)
        subController.setTextListMemory( [] );
        subController.updateISD( VideoController.getMediaTime() );
    };

/**
 * Sets the easy 2 read.
 *
 * @param      {<type>}  value   The value
 * @param      {<type>}  xml     The new value
 */
    this.setEasy2Read = function(value, xml){
        stConfig.easy2read = value;
        subController.setTextListMemory( [] );
        _stMngr.setSubtitle( xml, stConfig.language, 'st');
    };

/**
 * Sets the position of the subtitles.
 *
 * @param      {<type>}  pos      The new value
 * @param      {<type>}  scFixed  The screen fixed
 * @param      {<type>}  spFixed  The speaker fixed
 */
    this.setPosition = function(pos, scFixed, spFixed){
        stConfig.canvasPos.y = (scFixed || spFixed) ? -1 : pos.y;
        if(subtitles){
            //Remove saved position in cookies so st can be placed in top/bottom/scene position
            if(localStorage.getItem("stPosition")){
                localStorage.removeItem("stPosition");
            }
            //Check if not fixed options and stConfig.initPos.y is initialized;
            //If stConfig.initPos.y is not initialized ST will have to be created
            if(!stConfig.fixedSpeaker && !stConfig.fixedScene && pos.y != 0 && stConfig.initPos.y != 0){
                subtitles.position.x = (slConfig.isEnabled ? _stMngr.removeOverlap(subtitles.scale.x) : 0);
                subtitles.position.y =  Math.abs(subtitles.position.y)*pos.y; 
                stConfig.fixedSpeaker = spFixed;
                stConfig.fixedScene = scFixed;
            } else{
                _stMngr.remove();
                stConfig.fixedSpeaker = spFixed;
                stConfig.fixedScene = scFixed;
                subController.updateISD( VideoController.getMediaTime() );
            }
            _rdr.updateRadarPosition();
        } else {
            stConfig.fixedSpeaker = spFixed;
            stConfig.fixedScene = scFixed;
        }

    };


/**
 * Sets the scene position.
 *
 * @param      {number}  lat     The new value
 * @param      {number}  lon     The new value
 */
//THIS NEEDS TO BE CHECKED
    this.setScenePos = function(lat, lon){
        stConfig.scenePos.lat = lat;
        stConfig.scenePos.lon = lon;

        let cosLat = Math.cos(lat * Math.PI / 180.0);
        let sinLat = Math.sin(lat * Math.PI / 180.0);
        let cosLon = Math.cos(lon * Math.PI / 180.0);
        let sinLon = Math.sin(lon * Math.PI / 180.0);
        let rad = 70.0;
        let x = rad * cosLat * cosLon;
        let y = rad * cosLat * sinLon;
        let z = rad * sinLat;

        //console.log('x: '+x+', y: '+y+', z: '+z);
    };

/**
 * Sets the languages array.
 *
 * @param      {<type>}  subList  The sub list
 */
    this.setLanguagesArray = function(subList){
        stConfig.availableLang = [];

        if (subList.en) {
            stConfig.availableLang.push({
                name: 'subtitlesEngButton',
                value: 'en',
                default: (slConfig.language.localeCompare('en') === 0)
            });
        }
        if (subList.de) {
            stConfig.availableLang.push({
                name: 'subtitlesGerButton',
                value: 'de',
                default: (slConfig.language.localeCompare('de') === 0)
            });
        }
        if (subList.es){
            stConfig.availableLang.push({
                name: 'subtitlesEspButton',
                value: 'es',
                default: (slConfig.language.localeCompare('es') === 0)
            } );
        }
        if (subList.ca){
            stConfig.availableLang.push({
                name: 'subtitlesCatButton',
                value: 'ca',
                default: (slConfig.language.localeCompare('ca') === 0)
            } );
        }
    };

/*****************************************************************************************************************************
*                                          P U B L I C    C H E C K E R S 
*****************************************************************************************************************************/

/**
 * { function_description }
 *
 * @param      {<type>}  lang    The language
 * @return     {<type>}  { description_of_the_return_value }
 */
    this.checkisSubAvailable = function(lang){
        if (!lang && list_contents[demoId].acces[0].ST){
            lang = list_contents[demoId].acces[0].ST[0];
        }
        return (list_contents[demoId].acces && list_contents[demoId].acces[0].ST && list_contents[demoId].acces[0].ST.includes((lang) ? lang : _iconf.stlanguage));
    };

/**
 * { function_description }
 *
 * @param      {<type>}  lang    The language
 * @return     {<type>}  { description_of_the_return_value }
 */
    this.checkSubEasyAvailable = function(lang){
        return (list_contents[demoId].subtitles && list_contents[demoId].subtitles[1] && list_contents[demoId].subtitles[1][lang]);
    };

/**
 * { function_description }
 *
 * @param      {string}  position  The position
 */
    this.checkSubtitleIdicator = function(position){
        if (stConfig.indicator != indicators.NONE) {
            let arw = subController.getArrows();
            if(arw){
                arw.getObjectByName("right").visible = (position == 'right') ? true : false;
                arw.getObjectByName("left").visible = (position == 'left')? true : false;
            }
        }
    };

};