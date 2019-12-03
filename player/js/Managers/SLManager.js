
SLManager = function() {

    let signer;
    let subtitleSLMesh;

/**
 * Initializes the configuration.
 *
 * @param      {<type>}  conf    The conf
 * @return     {<type>}  { description_of_the_return_value }
 */
    this.initConfig = function(conf){

        let config = {
            url: '',
            isMoved: false,
            isEnabled: false,
            canvasPos: new THREE.Vector2(1, -1),
            scenePos: { lat: 0, lon: 0 },
            language: 'en',
            area: 60,
            size: 20,
            autoHide: false,
            availableLang: []
        }

        return config;
    }


/**
 * Creates a signer.
 */
    this.createSigner = function() {
        let slMesh;
        removeSigner();

        var hasSLSubtitles = imsc1doc_SL ? true : false;
        slMesh = _moData.getSignVideoMesh('signer', hasSLSubtitles );
        slMesh.visible = false;

        var SLTimeout = setTimeout( function() { slMesh.visible = true },700);
        canvasMgr.addElement(slMesh);

        signer = canvas.getObjectByName('signer');

        if ( !VideoController.isPausedById( 0 ) ) VideoController.playAll();
    }

    function removeSigner(){
        if( signer ){
            VideoController.removeContentById( signer.name );
            canvasMgr.removeElement(signer)
        }
    }


//************************************************************************************
// Media Object Position Controller 
//************************************************************************************
//
/**
 * Function that moves the sign video inside the FoV boundings.
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

            if(pos.x > -(w- slConfig.size)/2 && pos.x < (w- slConfig.size)/2){
                canvas.getObjectByName('signer').position.x = pos.x; 
            }

            if(pos.y > -(h - slConfig.size)/2 && pos.y < (h - slConfig.size)/2){
                canvas.getObjectByName('signer').position.y = pos.y;
            } 
        }
    }

    function changeSignPosition(pos) {
        if ( signer && ( ( pos == 'left' && signer.position.x > 0 ) || ( pos == 'right' && signer.position.x < 0 ) ) ){
            signer.position.x = signer.position.x * -1;
        }
    }
    
    this.checkSignIdicator = function(position){
        if ( stConfig.indicator != 'none' ){
            if ( position == 'center' && stConfig.indicator == 'move' ){
                position = slConfig.canvasPos.x == -1 ? 'left' : 'right';
            }
            //stConfig.indicator != 'move' ? changeSubtitleIndicator( position ) : changeSignPosition( position );
            stConfig.indicator != 'move' ? _stMngr.checkSubtitleIdicator( position ) : changeSignPosition( position );
        }
    }


    function updateSignerPosition(){
        if ( scene.getObjectByName('signer') ){
            if(localStorage.getItem("slPosition")){
                let savedPosition = JSON.parse(localStorage.getItem("slPosition"))
                var posX = savedPosition.x
                var posY = savedPosition.y;
            } else {
                var posX = _isHMD ? 0.6 * ( 1.48*slConfig.area/2 - slConfig.size/2 ) *slConfig.canvasPos.x : ( 1.48*slConfig.area/2 - slConfig.size/2 ) *slConfig.canvasPos.x;
                var posY = _isHMD ? 0.6 * ( 0.82*slConfig.area/2 - slConfig.size/2) *slConfig.canvasPos.y : ( 0.82*slConfig.area/2 - slConfig.size/2 ) *slConfig.canvasPos.y;
            }
            var posZ = 0;

            scene.getObjectByName('signer').position.x = posX;
            scene.getObjectByName('signer').position.y = posY;

            if ( subtitleSLMesh ){
                SLtextListMemory = [];
                //removeSLSubtitle();
            }
        }
    }

    this.updateSignerPosition2 = function(){
        if ( scene.getObjectByName('signer')){
            if(localStorage.getItem("slPosition")){
                const savedPosition = JSON.parse(localStorage.getItem("slPosition"))
                const posX = savedPosition.x
                const posY = savedPosition.y;
            } else {
                var posX = _isHMD ? 0.6 * ( 1.48*slConfig.area/2 - slConfig.size/2 ) *slConfig.canvasPos.x : ( 1.48*slConfig.area/2 - slConfig.size/2 ) *slConfig.canvasPos.x;
                var posY = _isHMD ? 0.6 * ( 0.82*slConfig.area/2 - slConfig.size/2) *slConfig.canvasPos.y : ( 0.82*slConfig.area/2 - slConfig.size/2 ) *slConfig.canvasPos.y;
            }
            var posZ = 0;

            scene.getObjectByName('signer').position.x = posX;
            scene.getObjectByName('signer').position.y = posY;

            setPos(posX, posY);

            if ( subtitleSLMesh ){
                SLtextListMemory = [];
                //removeSLSubtitle();
            }
        }
    }

    // Subtitles fixed under SL video
    this.createSLSubtitle = function(textList){
        var posX = _isHMD ? 0.6*( 1.48*slConfig.area/2-slConfig.size/2 ) *slConfig.canvasPos.x : ( 1.48*slConfig.area/2-slConfig.size/2 ) *slConfig.canvasPos.x;
        var posY = _isHMD ? 0.6*( 0.82*slConfig.area/2-slConfig.size/2 ) *slConfig.canvasPos.y : ( 0.82*slConfig.area/2-slConfig.size/2 ) *slConfig.canvasPos.y;
//        var posZ = 70;
        var posZ = 0;

        subtitleSLMesh = _moData.getSLSubtitleMesh( textList);

        canvas.getObjectByName('signer').add( subtitleSLMesh );
    }

//************************************************************************************
// Media Object Destructors
//************************************************************************************

    this.removeSLSubtitle = function(){
        SLtextListMemory = [];
        canvas.getObjectByName('signer').remove( subtitleSLMesh );
        subtitleSLMesh = undefined;
    }

//************************************************************************************
// Public Signer Setters
//************************************************************************************

    this.setSignerPosition = function(x, y){
        slConfig.canvasPos.x = x;
        if(stConfig.isEnabled){
            slConfig.canvasPos.y = y;
        } else{
            slConfig.canvasPos.y = -1;
        }         
        updateSignerPosition();
    };    

    this.setSignerSize = function(size){
        slConfig.size = size;
        if ( scene.getObjectByName('signer')){
            scene.getObjectByName('signer').scale.set(slConfig.size/20, slConfig.size/20, 1);
        }
        updateSignerPosition();
    };    

/*  this.setSignerIndicator = function(ind){
        subtitleIndicator = ind;
        if ( subtitleIndicator == 'arrow' && scene.getObjectByName("backgroundSL") ) scene.getObjectByName("backgroundSL").visible = true;
        else if ( scene.getObjectByName("backgroundSL") ) {
            scene.getObjectByName("backgroundSL").visible = false;
            scene.getObjectByName("rightSL").visible = false;
            scene.getObjectByName("leftSL").visible = false;
        }
        updateSignerPosition();
    };*/


    this.setSignerContent = function(url, lang) {
        slConfig.url = url;
        slConfig.language = lang;
        if ( slConfig.isEnabled ) this.createSigner();
    };    

    this.setSignerLanguagesArray = function(subList){
        slConfig.availableLang = [];

        if ( subList['en'] ) {
            slConfig.availableLang.push({
                name: 'signerEngButton', 
                value: 'en', 
                default: ( 'en' == slConfig.language )
            });
        }

        if ( subList['de'] ) {
            slConfig.availableLang.push({
                name: 'signerGerButton', 
                value: 'de', 
                default: ( 'de' == slConfig.language )
            });
        }

        if ( subList['es'] ) {
            slConfig.availableLang.push({
                name: 'signerEspButton', 
                value: 'es', 
                default: ( 'es' == slConfig.language )
            });
        }

        if ( subList['ca'] ) {
            slConfig.availableLang.push({
                name: 'signerCatButton', 
                value: 'ca', 
                default: ( 'ca' == slConfig.language )
            });
        }
    };

    this.setSubtitleSLConfig = function(newConfig){
        subSLConfig = newConfig;
    }


    this.getSigner = function(){
        return signer;
    }

//************************************************************************************
// Public Signer Checkers
//************************************************************************************

    this.checkisSignAvailable = function(lang){
        if ( !lang && list_contents[demoId].acces[0].SL ) lang = list_contents[demoId].acces[0].SL[0];
        return (list_contents[demoId].acces && list_contents[demoId].acces[0].SL && list_contents[demoId].acces[0].SL.includes((lang) ? lang : _iconf.sllanguage));
    };

    this.checkAvailableDynamic = function()
    {
        return imsc1doc_SL ? true : false;
    }

//************************************************************************************
// Public functions
//************************************************************************************

    this.switchSigner = function(enable){
        slConfig.isEnabled = enable;
        enable ? _slMngr.createSigner() : removeSigner();

        if(enable){
            if (stConfig.indicator.localeCompare('arrow') == 0){
                if(scene.getObjectByName('backgroundSL')) scene.getObjectByName('backgroundSL').visible = !stConfig.isEnabled;
            }
        }    
    };

    this.disableSigner = function(){
        removeSigner();
        slConfig.isEnabled = false;
    }


    this.swichtSL = function(enable){
        if ( signer ){
            signer.visible = enable;
        }
    }

    function getNonContSLMeta(time){
        var SLstate = false;
        SLTImes.forEach( function( elem ) {
            if ( elem.time >= time ) return SLstate;
            else SLstate = (elem.state == 'on') ? true : false;
        });
        return SLstate;
    }

   this.getSLAvailableLang = function(lang){
       if ( list_contents[demoId].signer[0][lang] ) return lang;
       else if ( list_contents[demoId].acces[0].SL && list_contents[demoId].signer[0][list_contents[demoId].acces[0].SL[0]] ) {
           _iconf.sllanguage = list_contents[demoId].acces[0].SL[0];
           return list_contents[demoId].acces[0].SL[0];
       }
       else return;
   }
};