
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
            initPos: null,
            canvasPos: new THREE.Vector2(1, -1),
            scenePos: { lat: 0, lon: 0 },
            language: 'en',
            area: 60,
            size: 18, //Default medium size
            maxSize: 20,
            autoHide: false,
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

        let SLTimeout = setTimeout( function() { slMesh.visible = true; }, 700);
        canvasMgr.addElement(slMesh);

        signer = canvas.getObjectByName('signer');
        if (imsc1doc_SL) {
            if (slConfig.st4sltext){
                _slMngr.createSLSubtitle(slConfig.st4sltext);  
            } 
        }

        if (!VideoController.isPausedById(0)) {
            VideoController.playAll();
        }
    };

/**
 * Removes a signer.
 */
    function removeSigner(){
        if (signer) {
            VideoController.removeContentById(signer.name);
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

            if (signer) {
                let st4slHeight = (subtitleSLMesh) ? subtitleSLMesh.children[0].geometry.parameters.height : 0;
                let w = vHeight * camera.aspect;
                if (pos.x > -(w - slConfig.size)/2 && pos.x < (w- slConfig.size)/2) {
                    canvas.getObjectByName('signer').position.x = pos.x;
                }

                if (pos.y > -(vHeight - (slConfig.size + st4slHeight))/2 && pos.y < (vHeight - slConfig.size)/2) {
                    canvas.getObjectByName('signer').position.y = pos.y;
                }
            }
        }
    };

/**
 * { function_description }
 *
 * @param      {string}  pos     The position
 */
    function changeSignPosition(pos) {
        if (signer && ((pos == 'left' && signer.position.x > 0) || (pos == 'right' && signer.position.x < 0))) {
            signer.position.x = signer.position.x * -1;
        }
    }

/**
 * { function_description }
 *
 * @param      {string}  position  The position
 */
    this.checkSignIdicator = function(position){
        if (stConfig.indicator != 'none') {
            if (position == 'center' && stConfig.indicator == 'move'){
                position = slConfig.canvasPos.x == -1 ? 'left' : 'right';
            }
            stConfig.indicator != 'move' ? _stMngr.checkSubtitleIdicator( position ) : changeSignPosition( position );
        }
    };

/**
 * { function_description }
 */
    function updateST4SLPosition(){
        if (signer) {
            let st4slMesh = signer.getObjectByName('sl-subtitles');
            let scaleFactor = (slConfig.size/st4slMesh.children[0].geometry.parameters.width);
            st4slMesh.scale.set(scaleFactor, scaleFactor, 1);
            st4slMesh.position.y = -(slConfig.size + st4slMesh.children[0].geometry.parameters.height*scaleFactor)/2;
        }
    }

    this.updatePositionY = function(){
        console.log('updatePositionY')
        if (signer && !localStorage.getItem("slPosition")) {
            let y;
            let safeFactor = 0.1; //10%       
            if(imsc1doc_SL || (stConfig.indicator.localeCompare('arrow') === 0 && !stConfig.isEnabled)){ 
                if (slConfig.canvasPos.y < 0 && slConfig.isEnabled){
                    let st4slMesh = signer.getObjectByName('sl-subtitles').children[0].geometry.parameters.height;
                    y = slConfig.initPos.y + st4slMesh * signer.getObjectByName('sl-subtitles').scale.x;
                } else {
                    y = (vHeight*(1-safeFactor) - slConfig.size)/2;
                }
            }
             else{
                //y = slConfig.initPos.y;
                y = (vHeight*(1-safeFactor) - slConfig.size)/2;
            }
            signer.position.y = slConfig.canvasPos.y * Math.abs(y);
        }
    }

/**
 * Creates a sl subtitle.
 *
 * @param      {<type>}  textList  The text list
 */
    this.createSLSubtitle = function(textList){
        if( imsc1doc_SL ){
            _slMngr.removeSLSubtitle(); 

        } 
        slConfig.st4sltext = textList;
        subtitleSLMesh = _moData.getSLSubtitleMesh(textList);
        canvas.getObjectByName('signer').add(subtitleSLMesh);
        updateST4SLPosition();
       _slMngr.updatePositionY();
    };

//************************************************************************************
// Media Object Destructors
//************************************************************************************

/**
 * Removes a sl subtitle.
 */
    this.removeSLSubtitle = function(){
        subController.setSLtextListMemory([]);
        canvas.getObjectByName('signer').remove(subtitleSLMesh);
        subtitleSLMesh = undefined;
    };

//************************************************************************************
// Public Signer Setters
//************************************************************************************

/**
 * Sets the signer automatic hide.
 *
 * @param      {<type>}  value   The value
 */
    this.setSignerAutoHide = function(value){
        slConfig.autoHide = value;
    };

/**
 * Sets the signer position.
 *
 * @param      {<type>}  x       The new value
 * @param      {<type>}  y       The new value
 */
    this.setPosition = function(x, y){
        if(signer){
            signer.position.x = x;
            signer.position.y = y;
        }

        slConfig.canvasPos.x = Math.sign(x);
        if (stConfig.isEnabled) {
            slConfig.canvasPos.y = Math.sign(y);
        } else {
            slConfig.canvasPos.y = -1;
        }
        //updateST4SLPosition();
        _slMngr.updatePositionY();
    };

/**
 * Sets the signer size.
 *
 * @param      {number}  size    The size
 */
    this.setSignerSize = function(size){
        let scaleFactor = size/slConfig.maxSize;
        if (scene.getObjectByName('signer')) {
            scene.getObjectByName('sl-video').scale.set(scaleFactor, scaleFactor, 1);
            slConfig.size = size;
            if(scene.getObjectByName('sl-subtitles')){
                updateST4SLPosition();
            }
            signer.position.y = slConfig.canvasPos.y * (vHeight*(1-0.1) - slConfig.size)/2;
        }
    };

/**
 * Sets the signer content.
 *
 * @param      {<type>}  url     The new value
 * @param      {<type>}  lang    The language
 */
    this.setSignerContent = function(url, lang) {
        slConfig.url = url;
        slConfig.language = lang;
        if (slConfig.isEnabled) {
            this.createSigner();
        }
    };

/**
 * Sets the signer languages array.
 *
 * @param      {<type>}  subList  The sub list
 */
    this.setSignerLanguagesArray = function(subList){
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

/**
 * Sets the subtitle sl configuration.
 *
 * @param      {<type>}  newConfig  The new configuration
 */
    this.setSubtitleSLConfig = function(newConfig){
        subSLConfig = newConfig;
    };

/**
 * Gets the signer.
 *
 * @return     {<type>}  The signer.
 */

    this.getSigner = function(){
        return signer;
    };

//************************************************************************************
// Public Signer Checkers
//************************************************************************************

/**
 * { function_description }
 *
 * @param      {<type>}  lang    The language
 * @return     {<type>}  { description_of_the_return_value }
 */
    this.checkisSignAvailable = function(lang){
        if (!lang && list_contents[demoId].acces[0].SL) {
            lang = list_contents[demoId].acces[0].SL[0];
        }
        return (list_contents[demoId].acces && list_contents[demoId].acces[0].SL && list_contents[demoId].acces[0].SL.includes((lang) ? lang : _iconf.sllanguage));
    };

/**
 * { function_description }
 *
 * @return     {boolean}  { description_of_the_return_value }
 */
    this.checkAvailableDynamic = function(){
        return imsc1doc_SL ? true : false;
    };

//************************************************************************************
// Public functions
//************************************************************************************

/**
 * { function_description }
 *
 * @param      {<type>}  enable  The enable
 */
    this.switchSigner = function(enable){
        slConfig.isEnabled = enable;
        enable ? _slMngr.createSigner() : removeSigner();

        if (enable) {
            if (stConfig.indicator.localeCompare('arrow') === 0) {
                if (scene.getObjectByName('backgroundSL')) {
                    scene.getObjectByName('backgroundSL').visible = !stConfig.isEnabled;
                }
            }
        }
    };

/**
 * Disables the signer.
 */
    this.disableSigner = function(){
        removeSigner();
        slConfig.isEnabled = false;
    };

/**
 * { function_description }
 *
 * @param      {<type>}  enable  The enable
 */
    this.swichtSL = function(enable){
        if (signer) {
            signer.visible = enable;
        }
    };

/**
 * Gets the sl available language.
 *
 * @param      {<type>}  lang    The language
 * @return     {<type>}  The sl available language.
 */
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

/**
 * { function_description }
 *
 * @param      {<type>}  element  The element
 */
   this.scaleColorBorder = function(element){
       let slSTscale = signer.getObjectByName('sl-subtitles').scale.x;
       let slSTHeight = signer.getObjectByName('sl-subtitles').children[0].geometry.parameters.height*slSTscale;
       let newScale = 1;
       if (signer.getObjectByName('sl-subtitles').visible) {
           newScale = ((slConfig.size+slSTHeight)/slConfig.size);
           element.position.y = -((slSTHeight)/2);
       } else {
           element.position.y = 0;
       }
       element.scale.y = newScale * (slConfig.size+1)/slConfig.maxSize;
       element.scale.x = (slConfig.size+1)/slConfig.maxSize;
   };
};