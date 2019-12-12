
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
            st4sltext: '',
            isMoved: false,
            isEnabled: false,
            canvasPos: new THREE.Vector2(1, -1),
            scenePos: { lat: 0, lon: 0 },
            language: 'en',
            area: 60,
            size: 20,
            autoHide: true,
            availableLang: []
        };

        return config;
    };


/**
 * Creates a signer.
 */
    this.createSigner = function() {
        let slMesh;
        removeSigner();

        slMesh = _moData.getSignVideoMesh('signer');
        slMesh.visible = false;

        let SLTimeout = setTimeout( function() { slMesh.visible = true; },700);
        canvasMgr.addElement(slMesh);

        signer = canvas.getObjectByName('signer');
        if( imsc1doc_SL && slConfig.st4sltext){
            _slMngr.createSLSubtitle( slConfig.st4sltext );
        }

        if ( !VideoController.isPausedById( 0 ) ){
            VideoController.playAll();
        }
    };

    function removeSigner(){
        if( signer ){
            VideoController.removeContentById( signer.name );
            canvasMgr.removeElement(signer);
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

            if(signer){
                let w = vHeight * camera.aspect;
                if(pos.x > -(w- slConfig.size)/2 && pos.x < (w- slConfig.size)/2){
                    canvas.getObjectByName('signer').position.x = pos.x;
                }

                if(pos.y > -(vHeight - slConfig.size)/2 && pos.y < (vHeight - slConfig.size)/2){
                    canvas.getObjectByName('signer').position.y = pos.y;
                }
            }
        }
    };

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
    };


    function updateST4SLPosition(){
        if( signer ){
            let st4slMesh = signer.getObjectByName('sl-subtitles');
            let scaleFactor = (slConfig.size/st4slMesh.children[0].geometry.parameters.width);
            st4slMesh.scale.set(scaleFactor, scaleFactor, 1);
            st4slMesh.position.y = -(slConfig.size + st4slMesh.children[0].geometry.parameters.height*scaleFactor)/2;
        }
    }

    this.updateSignerPosition2 = function(){
        if (signer){
            let posX;
            let posY;
            if(localStorage.getItem("slPosition")){
                let savedPosition = JSON.parse(localStorage.getItem("slPosition"));
                posX = savedPosition.x;
                posY = savedPosition.y;
            } else {
                posX = _isHMD ? 0.6 * ( 1.48*slConfig.area/2 - slConfig.size/2 ) *slConfig.canvasPos.x : ( 1.48*slConfig.area/2 - slConfig.size/2 ) *slConfig.canvasPos.x;
                posY = _isHMD ? 0.6 * ( 0.82*slConfig.area/2 - slConfig.size/2) *slConfig.canvasPos.y : ( 0.82*slConfig.area/2 - slConfig.size/2 ) *slConfig.canvasPos.y;
            }
            let posZ = 0;

            signer.position.x = posX;
            signer.position.y = posY;

            setPos(posX, posY);

            if ( subtitleSLMesh ){
                subController.setSLtextListMemory( [] );

                //removeSLSubtitle();
            }
        }
    };

    // Subtitles fixed under SL video
    this.createSLSubtitle = function(textList){
        _slMngr.removeSLSubtitle();
        slConfig.st4sltext = textList;
        subtitleSLMesh = _moData.getSLSubtitleMesh(textList);
        canvas.getObjectByName('signer').add( subtitleSLMesh );
    };

//************************************************************************************
// Media Object Destructors
//************************************************************************************

    this.removeSLSubtitle = function(){
        subController.setSLtextListMemory( [] );
        canvas.getObjectByName('signer').remove( subtitleSLMesh );
        subtitleSLMesh = undefined;
    };

//************************************************************************************
// Public Signer Setters
//************************************************************************************


    this.setSignerAutoHide = function(value){
        slConfig.autoHide = value;
    };

    this.setSignerPosition = function(x, y){
        slConfig.canvasPos.x = x;
        if(stConfig.isEnabled){
            slConfig.canvasPos.y = y;
        } else{
            slConfig.canvasPos.y = -1;
        }
        updateST4SLPosition();
    };

    this.setSignerSize = function(size){
        slConfig.size = size;
        if ( scene.getObjectByName('signer')){
            scene.getObjectByName('sl-video').scale.set(slConfig.size/20, slConfig.size/20, 1);
        }
        updateST4SLPosition();
    };

    this.setSignerContent = function(url, lang) {
        slConfig.url = url;
        slConfig.language = lang;
        if ( slConfig.isEnabled ){
            this.createSigner();
        }
    };

    this.setSignerLanguagesArray = function(subList){
        slConfig.availableLang = [];

        if( subList.en ) {
            slConfig.availableLang.push({
                name: 'signerEngButton',
                value: 'en',
                default: ( slConfig.language.localeCompare('en') == 0 )
            });
        }

        if( subList.de ) {
            slConfig.availableLang.push({
                name: 'signerGerButton',
                value: 'de',
                default: ( slConfig.language.localeCompare('de') == 0 )
            });
        }

        if ( subList.es ) {
            slConfig.availableLang.push({
                name: 'signerEspButton',
                value: 'es',
                default: ( slConfig.language.localeCompare('es') == 0 )
            });
        }

        if ( subList.ca ) {
            slConfig.availableLang.push({
                name: 'signerCatButton',
                value: 'ca',
                default: ( slConfig.language.localeCompare('ca') == 0 )
            });
        }
    };

    this.setSubtitleSLConfig = function(newConfig){
        subSLConfig = newConfig;
    };


    this.getSigner = function(){
        return signer;
    };

//************************************************************************************
// Public Signer Checkers
//************************************************************************************

    this.checkisSignAvailable = function(lang){
        if ( !lang && list_contents[demoId].acces[0].SL ){
            lang = list_contents[demoId].acces[0].SL[0];
        }
        return (list_contents[demoId].acces && list_contents[demoId].acces[0].SL && list_contents[demoId].acces[0].SL.includes((lang) ? lang : _iconf.sllanguage));
    };

    this.checkAvailableDynamic = function(){
        return imsc1doc_SL ? true : false;
    };

//************************************************************************************
// Public functions
//************************************************************************************

    this.switchSigner = function(enable){
        slConfig.isEnabled = enable;
        enable ? _slMngr.createSigner() : removeSigner();

        if(enable){
            if (stConfig.indicator.localeCompare('arrow') == 0){
                if(scene.getObjectByName('backgroundSL')){
                    scene.getObjectByName('backgroundSL').visible = !stConfig.isEnabled;
                }
            }
        }
    };

    this.disableSigner = function(){
        removeSigner();
        slConfig.isEnabled = false;
    };


    this.swichtSL = function(enable){
        if( signer ){
            signer.visible = enable;
        }
    };

   this.getSLAvailableLang = function(lang){
       if( list_contents[demoId].signer[0][lang] ){
           return lang;
       } else if( list_contents[demoId].acces[0].SL && list_contents[demoId].signer[0][list_contents[demoId].acces[0].SL[0]] ) {
           _iconf.sllanguage = list_contents[demoId].acces[0].SL[0];
           return list_contents[demoId].acces[0].SL[0];
       } else{
           return;
       }
       
   };


   this.scaleColorBorder = function(element){
       let slSTscale = signer.getObjectByName('sl-subtitles').scale.x;
       let slSTHeight = signer.getObjectByName('sl-subtitles').children[0].geometry.parameters.height*slSTscale;
       let newScale = 1;
       if (signer.getObjectByName('sl-subtitles').visible){
           newScale = ((slConfig.size+slSTHeight)/slConfig.size);
           element.position.y = -((slSTHeight)/2);
       } else {
           element.position.y = 0;
       }
       element.scale.y = newScale * (slConfig.size+1)/20;
       element.scale.x = (slConfig.size+1)/20;
   };
};