
STManager = function() {
    
    const indicators = {
        NONE: 'none',
        ARROW: 'arrow',
        RADAR: 'radar',
        MOVE: 'move'
    };

    let subtitles;

    this.initConfig = function(conf){

        let config = {
            initialY: 0,
            width: 0,
            height: 0,
            fixedSpeaker: false,
            fixedScene: false,
            isEnabled: false,
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

    this.createSubtitle = function(textList){
        let stMesh;
        _stMngr.removeSubtitle();
        if ( !stConfig.fixedSpeaker && !stConfig.fixedScene ){
            stMesh = _moData.getSubtitleMesh(textList, "500 40px Roboto, Arial", false, 'subtitles');
            canvasMgr.addElement(stMesh);
            subtitles = canvas.getObjectByName('subtitles');
        } else{
            stMesh = !stConfig.fixedScene ? _moData.getSpeakerSubtitleMesh(textList) : _moData.getSceneFixedSubtitles(textList, 3);
            scene.add( stMesh );
            subtitles = scene.getObjectByName('subtitles');
        }
    };

    this.removeSubtitle = function(){
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
            let safeFactor = 0.1; //10%
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


//************************************************************************************
// Public Subtitle Setters
//************************************************************************************

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

            if(stConfig.isEnabled || slConfig.isEnabled){
                textListMemory = [];
                //subController.updateISD( VideoController.getMediaTime() );
            }
        }
    };

    this.setSize = function(value){
        stConfig.size = value;
        if(subtitles){
            let esaySizeAjust = stConfig.easy2read ? 1.25 : 1;
            scaleFactor = (stConfig.area/130) * stConfig.size * esaySizeAjust;
            subtitles.scale.set( scaleFactor, scaleFactor, 1 );
        }
    };

    this.setBackground = function(value){
        stConfig.background = value;

        //FIND METHOD FOR DYNAMIC UPDATE (WITHOUT REMOVE/CREATE)
        subController.setTextListMemory( [] );
        subController.updateISD( VideoController.getMediaTime() );
    };

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
        stConfig.canvasPos.y = pos.y;
        if(subtitles){
            //Remove saved position in cookies so st can be placed in top/bottom/scene position
            if(localStorage.getItem("stPosition")){
                localStorage.removeItem("stPosition");
            }
            //Check if not fixed options and initialY is initialized;
            //If initialY is not initialized ST will have to be created
            if(!stConfig.fixedSpeaker && !stConfig.fixedScene && pos.y != 0 && stConfig.initialY != 0){
                subtitles.position.x = _stMngr.checkOverlap(subtitles.scale.x);
                
                subtitles.position.y =  Math.abs(stConfig.initialY)*pos.y;
                stConfig.fixedSpeaker = spFixed;
                stConfig.fixedScene = scFixed;
            } else{
                _stMngr.removeSubtitle();
                stConfig.fixedSpeaker = spFixed;
                stConfig.fixedScene = scFixed;
                subController.updateISD( VideoController.getMediaTime() );
            }
        }
    };


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


    this.getSubtitles = function(){
        return subtitles;
    };

//************************************************************************************
// Public Subtitle Checkers
//************************************************************************************

    this.checkisSubAvailable = function(lang){
        if (!lang && list_contents[demoId].acces[0].ST){
            lang = list_contents[demoId].acces[0].ST[0];
        }
        return (list_contents[demoId].acces && list_contents[demoId].acces[0].ST && list_contents[demoId].acces[0].ST.includes((lang) ? lang : _iconf.stlanguage));
    };

    this.checkSubEasyAvailable = function(lang){
        return (list_contents[demoId].subtitles && list_contents[demoId].subtitles[1] && list_contents[demoId].subtitles[1][lang]);
    };


//************************************************************************************
// Public functions
//************************************************************************************

    this.updateSubtitleByTime = function(time){
        if (imsc1doc) {
            subController.updateISD(time);
        }
    };

    this.enableSubtitles = function(){
        stConfig.isEnabled = true;
    };

    this.disableSubtiles = function(){
        _stMngr.removeSubtitle();
        _rdr.hideRadar();
        stConfig.isEnabled = false;
    };

    this.switchSubtitles = function(enable){
        let signerMesh = _slMngr.getSigner();
        if (!enable){
            _stMngr.removeSubtitle();
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

    this.getSTAvailableLang = function(lang, e2r=0){
        if (list_contents[demoId].subtitles[e2r][lang]) {
           return lang;
        } else if (list_contents[demoId].acces[0].ST && list_contents[demoId].subtitles[e2r][list_contents[demoId].acces[0].ST[0]]) {
           _iconf.stlanguage = list_contents[demoId].acces[0].ST[0];
           return list_contents[demoId].acces[0].ST[0];
        } else return;
    };

//************************************************************************************
// Media Object Position Controller 
//************************************************************************************

    function changeSubtitleIndicator(pos){
        let arw = subController.getArrows();
        if(arw){
            arw.getObjectByName("right").visible = (pos == 'right') ? true : false;
            arw.getObjectByName("left").visible = (pos == 'left')? true : false;
        }
    }

    this.checkSubtitleIdicator = function(position){
        if ( stConfig.indicator != indicators.NONE ) {
            stConfig.indicator != indicators.MOVE ? changeSubtitleIndicator( position ) : subController.setTextListMemory( [] );
        }
    };


    this.checkOverlap = function(scaleFactor){
        let safeFactor = 0.2;
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
};