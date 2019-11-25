
STManager = function() {

    let subtitleMesh;

    const indicators = {
        NONE: 'none',
        ARROW: 'arrow',
        RADAR: 'radar',
        MOVE: 'move'
    }

    this.initConfig = function(conf){

        let config = {
            isMoved: false,
            fixedSpeaker: false,
            fixedScene: false,
            isEnabled: false,
            canvasPos: new THREE.Vector2(0, -1),
            scenePos: { lat: 0, lon: 0 },
            language: 'en',
            indicator:  indicators.NONE,
            area: 70,
            size: 1,
            easy2read: false,
            background: 0.75,
            availableLang: []
        }

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
    }

    this.createSubtitle = function(textList){
        if ( !stConfig.fixedSpeaker ){
            subtitleMesh = _moData.getSubtitleMesh(textList, "500 40px Roboto, Arial", false, 'subtitles');
            canvasMgr.addElement(subtitleMesh);
        } else{
            subtitleMesh = !stConfig.fixedScene ? _moData.getExpEmojiSubtitleMesh(textList) : _moData.getSceneFixedSubtitles(textList, 3);
            console.log(subtitleMesh)
            scene.add( subtitleMesh )
        }
    }

    this.removeSubtitle = function(){
        textListMemory = [];
        (stConfig.fixedScene || stConfig.fixedSpeaker) ? scene.remove( subtitleMesh ) : canvasMgr.removeElement( subtitleMesh );
        subtitleMesh = undefined;
    }

/**
 * Function that moves the subtitles.
 *
 * @param      {<type>}  pos     The position
 */
    this.move = function(pos){
        if (elementSelection) {
            scene.getObjectByName('trad-main-menu').visible = false;
            scene.getObjectByName('trad-option-menu').visible = false;

            const vFOV = THREE.Math.degToRad( camera.fov ); // convert vertical fov to radians
            const h = 2 * Math.tan( vFOV / 2 ) * 70; // visible height
            const w = h * camera.aspect;

            //let w = 1.48*_slMngr.getSignerArea()-14;
            //let h = 0.82*_slMngr.getSignerArea()-14;

            if(pos.x > -w/2 && pos.x < w/2){
                canvas.getObjectByName('subtitles').position.x = pos.x; 
            }

            if(pos.y > -h/2 && pos.y < h/2){
                canvas.getObjectByName('subtitles').position.y = pos.y;
            } 
        }
    }


//************************************************************************************
// Public Subtitle Setters
//************************************************************************************

    this.setSubtitle = function(xml, value){
        stConfig.language = value;
        var r = new XMLHttpRequest();

        r.open( "GET", xml );
        r.onreadystatechange = function () {
            if ( r.readyState === 4 && r.status === 200 ) {
                imsc1doc = imsc.fromXML( r.responseText );
        
            } else if ( r.readyState === 4 ) {
                console.error('Status = ' + r.status + ' xml = ' + xml);
            }
        };
        r.send();
    };

    this.setSLSubtitle = function(xml, lang){
        stConfig.language = lang;
        var r = new XMLHttpRequest();

        r.open( "GET", xml );
        r.onreadystatechange = function () 
        {
            if ( r.readyState === 4 && r.status === 200 ) 
            {
                imsc1doc_SL = imsc.fromXML( r.responseText );
            }
            else if ( r.readyState === 4 ) 
            {
                console.error('Status = ' + r.status + ' xml = ' + xml);
            }
        };
        r.send();
    };

    this.setIndicator = function(value, childColumnOpt){
        if(stConfig.indicator.localeCompare(value) != 0){
            stConfig.indicator = value;
            SettingsOptionCtrl.setChildColumnActiveOpt(childColumnOpt);

            switch(stConfig.indicator){
                case 'none':
                    if ( slConfig.isEnabled ) {
                        if ( !imsc1doc_SL ) scene.getObjectByName("backgroundSL").visible = false;
                        signerMesh.getObjectByName("right").visible = false;
                        signerMesh.getObjectByName("left").visible = false;
                    }
                    _rdr.hideRadar();
                    break;

                case 'arrow':
                    _rdr.hideRadar();
                    if(stConfig.isEnabled){
                        if(scene.getObjectByName('backgroundSL')) scene.getObjectByName('backgroundSL').visible = false;
                    } else {
                        if ( slConfig.isEnabled && !imsc1doc_SL){
                            scene.getObjectByName('backgroundSL').visible = true;
                        } 
                    }
                    
                    break;

                case 'radar':
                    _rdr.showRadar();
                    if (slConfig.isEnabled) {
                        if ( !imsc1doc_SL ) scene.getObjectByName("backgroundSL").visible = false;
                            signerMesh.getObjectByName("right").visible = false;
                            signerMesh.getObjectByName("left").visible = false;
                    }
                    _rdr.updateRadarPosition();
                    break;
            }

            if(stConfig.isEnabled || slConfig.isEnabled){
                textListMemory = [];
                subController.updateISD( VideoController.getMediaTime() );
            }
        }    
    };

    this.setSize = function(value){
        stConfig.size = value;
        textListMemory = [];

        subController.updateISD( VideoController.getMediaTime() );
    };

    this.setBackground = function(value){
        stConfig.background = value;
        textListMemory = [];

        subController.updateISD( VideoController.getMediaTime() );
    };

    this.setEasy2Read = function(value, xml){
        stConfig.easy2read = value;
        this.setSubtitle( xml, stConfig.language );
        textListMemory = [];

        subController.updateISD( VideoController.getMediaTime() );
    };

    this.setCanvasPos = function(x, y){
        stConfig.canvasPos = new THREE.Vector2(x, y);
        textListMemory = [];
        subController.updateISD( VideoController.getMediaTime() );
    };


//THIS NEEDS TO BE CHECKED
    this.setScenePos = function(lat, lon){
        stConfig.scenePos.lat = lat;
        stConfig.scenePos.lon = lon;

        var cosLat = Math.cos(lat * Math.PI / 180.0);
        var sinLat = Math.sin(lat * Math.PI / 180.0);
        var cosLon = Math.cos(lon * Math.PI / 180.0);
        var sinLon = Math.sin(lon * Math.PI / 180.0);
        var rad = 70.0;
        let x = rad * cosLat * cosLon;
        let y = rad * cosLat * sinLon;
        let z = rad * sinLat;

        console.log('x: '+x+', y: '+y+', z: '+z);  
    }

    this.setArea = function(value){
        stConfig.area = value;
        textListMemory = [];

        slConfig.area = value;
        _slMngr.updateSignerPosition();
        _stMngr.createSubAreaHelper( value );
        subController.updateISD( VideoController.getMediaTime() );
    };

    this.setLanguagesArray = function(subList){
        stConfig.availableLang = [];

        if ( subList['en'] ) 
        {
            stConfig.availableLang.push( 
            { 
                name: 'subtitlesEngButton', 
                value: 'en', 
                default: ( 'en' == stConfig.language ) 
            } );
        }
        if ( subList['de'] ) 
        {
            stConfig.availableLang.push( 
            { 
                name: 'subtitlesGerButton', 
                value: 'de', 
                default: ( 'de' == stConfig.language ) 
            } );
        }
        if ( subList['es'] ) 
        {
            stConfig.availableLang.push( 
            { 
                name: 'subtitlesEspButton', 
                value: 'es', 
                default: ( 'es' == stConfig.language ) 
            } );
        }
        if ( subList['ca'] ) 
        {
            stConfig.availableLang.push( 
            { 
                name: 'subtitlesCatButton', 
                value: 'ca', 
                default: ( 'ca' == stConfig.language ) 
            } );
        }
    };

//************************************************************************************
// Public Subtitle Checkers
//************************************************************************************

    this.checkSubPosition = function(value){
        if ( stConfig.fixedSpeaker ) {
            if ( !stConfig.fixedScene ) return value == 0 ? true : false;
            else return value == 3 ? true : false;
        }
        else return value == stConfig.canvasPos.y;
    };

    this.checkisSubAvailable = function(lang){
        if ( !lang && list_contents[demoId].acces[0].ST ) lang = list_contents[demoId].acces[0].ST[0];
        return (list_contents[demoId].acces && list_contents[demoId].acces[0].ST && list_contents[demoId].acces[0].ST.includes((lang) ? lang : _iconf.stlanguage));
    };

    this.checkSubEasyAvailable = function(lang){
        return (list_contents[demoId].subtitles && list_contents[demoId].subtitles[1] && list_contents[demoId].subtitles[1][lang]);
    };  


//************************************************************************************
// Public functions
//************************************************************************************

    this.updateSubtitleByTime = function(time){
        if ( imsc1doc ) subController.updateISD( time );
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
        if ( !enable ){
            _stMngr.removeSubtitle();
            //_rdr.hideRadar();
            if (stConfig.indicator.localeCompare(indicators.ARROW) == 0 && slConfig.isEnabled){
                if(scene.getObjectByName('backgroundSL')) scene.getObjectByName('backgroundSL').visible = true;
            }
        } else {
            if (stConfig.indicator.localeCompare(indicators.RADAR) == 0){
                _rdr.showRadar();
            }
            if(slConfig.isEnabled){
                if(scene.getObjectByName('backgroundSL')) scene.getObjectByName('backgroundSL').visible = false;
            }
        }

        if (slConfig.isEnabled && scene.getObjectByName("rightSL")){
            scene.getObjectByName("rightSL").visible = false;
            scene.getObjectByName("leftSL").visible = false;
        }

        stConfig.isEnabled = enable;
    }

    this.changeSTmode = function(mode){
        _stMngr.removeSubtitle();

        if ( mode == 0 ) 
        {
            stConfig.fixedSpeaker = false;
            stConfig.fixedScene = false;
        }
        else if ( mode == 1 )
        {
            stConfig.fixedSpeaker = true;
            stConfig.fixedScene = false;
        }
        else {
            stConfig.fixedSpeaker = true;
            stConfig.fixedScene = true;
        }

        textListMemory = [];

        subController.updateISD( VideoController.getMediaTime() );
    }

    this.getSTAvailableLang = function(lang, e2r=0){
        if ( list_contents[demoId].subtitles[e2r][lang] ) {
           return lang;
        }
        else if ( list_contents[demoId].acces[0].ST && list_contents[demoId].subtitles[e2r][list_contents[demoId].acces[0].ST[0]] ) {
           _iconf.stlanguage = list_contents[demoId].acces[0].ST[0];
           return list_contents[demoId].acces[0].ST[0];
        }
        else return;
    }




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
            stConfig.indicator != indicators.MOVE ? changeSubtitleIndicator( position ) : textListMemory = [];
        }      
    }

    


    function createSubAreaHelper(size){
        if ( areaMesh ) canvas.remove( areaMesh );

        var mesh = _moData.getPlaneImageMesh( 1.48*size, 0.82*size, './img/rect5044.png', 'areamesh', 5 );

        /*canvas.remove(canvas.getObjectByName('cnv-fov'));
        const fov = _moData.getPlaneImageMesh(1.48*subController.getSubArea() *((_isHMD) ? 0.6 : 1) , 0.82*subController.getSubArea()*((_isHMD) ? 0.6 : 1), './img/rect5044.png', 'areamesh', 5);
        fov.name = 'cnv-fov';
        canvas.add(fov);*/

//        mesh.position.z = -70;
        mesh.position.z = 0;
        mesh.autoRemove = function() {
            var timer = setTimeout(function() {
                canvas.remove( mesh );
            }, 1000);
        }
        areaMesh = mesh;
        canvas.add( mesh );

        mesh.autoRemove();
    }

};