/**
 * { function_description }
 *
 * @class      SLManager (name)
 * @return     {<type>}  { description_of_the_return_value }
 * 
 *         * switchSigner = function( enable )          --> Enable or disable the signer using the boolean 'enable'

 */

SLManager = function() {

    let signer;            // Signer video object saved state;
    let subtitleSLMesh;    // ST4SL mesh object saved state;

/*****************************************************************************************************************************
*                                           M A I N     F U N C T I O N S  
******************************************************************************************************************************/    

/**
 * This function initializes the parameters in order to create the signer video.
 *
 * @param      {Object}  conf    The pre selected parameters from the web.
 * @return     {Object}  The final configuration parameters in order to created the signer video.
 */
    this.initConfig = function(conf){

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
    };

/**
 * Creates the signer video and adds it to the canvas element. 
 * Adds subtitles if they exist in the metadata. 
 */
    this.create = function() {
        if(signer){
            // Remove existing SLs if there is one in the scene already.
            _slMngr.remove(); 
        } 
        // Add signer element to the canvas.
        canvasMgr.addElement(_moData.getSignVideoMesh('signer'));
        // Save the signer element in a global class variable.
        signer = canvas.getObjectByName('signer');
        slConfig.isEnabled = true;

        if(stConfig.isEnabled){
            signer.position.y = Math.abs(signer.position.y) * stConfig.canvasPos.y;
            //Not working as it should (CHECK)
            let subtitles = _stMngr.getSubtitles();
            if(subtitles){
                //subtitles.position.x = _stMngr.removeOverlap(subtitles.scale.x);
            }
        }

        if (imsc1doc_SL) {
            // If the metadata has ST (imsc1doc_SL) for SL, 
            // create and add the ST mesh under the SL video.
            if (slConfig.st4sltext){
                _slMngr.createSLSubtitle(slConfig.st4sltext);  
            } 
        }
        // Play the SL video.
        VideoController.play(1, slConfig.url, signer);
        if (VideoController.getListOfVideoContents()[0].vid.paused) VideoController.pauseAll()
    };

/**
 * Removes a signer.
 */
    this.remove = function() {
        if (signer) {
            // Remove video from the list.
            VideoController.removeContentById(signer.name);
            // Remove element from canvas.
            canvasMgr.removeElement(signer);
            // Set signer = undefined, isEnabled = false in order to create a new one next time.
            signer = undefined;
            slConfig.isEnabled = false;
        }
    }

/**
 * Function that moves the signer video inside delimeted area.
 *
 * @param      {Vector2}  pos     The position of the SL video element.
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
       _slMngr.updatePositionY();
    };

/**
 * Removes a sl subtitle.
 */
    this.removeSLSubtitle = function(){
        subController.setSLtextListMemory([]);
        canvas.getObjectByName('signer').remove(subtitleSLMesh);
        subtitleSLMesh = undefined;
    };


/*****************************************************************************************************************************
*                                           P U B L I C    F U N C T I O N S  
******************************************************************************************************************************/

/**
 * { function_description }
 *
 * @param      {<type>}  enable  The enable
 */
    this.switchSigner = function(enable){
        slConfig.isEnabled = enable;
        enable ? _slMngr.create() : _slMngr.remove();

        if (enable) {
            if (stConfig.indicator.localeCompare('arrow') === 0) {
                if (scene.getObjectByName('backgroundSL')) {
                    scene.getObjectByName('backgroundSL').visible = !stConfig.isEnabled;
                }
            }
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

/**
 * { function_description }
 */
    this.updatePositionY = function(){
        if (signer && !localStorage.getItem("slPosition")) {
            let st4slMesh = signer.getObjectByName('sl-subtitles');
            let y = (vHeight*(1-safeFactor) - slConfig.size)/2;                
            let offsetY = 0;
            if((imsc1doc_SL && st4slMesh) || (stConfig.indicator.localeCompare('arrow') === 0 && !stConfig.isEnabled)){
                //Update the position of the signer subtitles.
                let scaleFactor = (slConfig.size/st4slMesh.children[0].geometry.parameters.width);
                st4slMesh.scale.set(scaleFactor, scaleFactor, 1);
                st4slMesh.position.y = -(slConfig.size + st4slMesh.children[0].geometry.parameters.height*scaleFactor)/2;

                // Add offset to the signer 'y' if the signer is on bottom position.
                if (slConfig.canvasPos.y < 0 && slConfig.isEnabled){
                    offsetY = slConfig.canvasPos.y * st4slMesh.children[0].geometry.parameters.height * st4slMesh.scale.x;
                }
            }
            signer.position.y = slConfig.canvasPos.y * Math.abs(y + offsetY);
        }
    }


/*****************************************************************************************************************************
*                                           P R I V A T E    F U N C T I O N S  
*****************************************************************************************************************************/


/*****************************************************************************************************************************
*                                          P U B L I C    G E T T E R S 
*****************************************************************************************************************************/

/**
 * Gets the signer.
 *
 * @return     {<type>}  The signer.
 */
    this.getSigner = function(){
        return signer;
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

/*****************************************************************************************************************************
*                                          P U B L I C    S E T T E R S 
*****************************************************************************************************************************/

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
        _slMngr.updatePositionY();
        _rdr.updateRadarPosition();
    };

/**
 * Sets the signer size.
 *
 * @param      {number}  size    The size
 */
    this.setSize = function(size){
        let scaleFactor = size/slConfig.maxSize;
        if (signer) {
            signer.getObjectByName('sl-video').scale.set(scaleFactor, scaleFactor, 1);
            slConfig.size = size;
            if(signer.getObjectByName('sl-subtitles').visible){
                _slMngr.updatePositionY();
            } else {
                signer.position.y = slConfig.canvasPos.y * (vHeight*(1-safeFactor) - slConfig.size)/2;
            } 
        }
        let subtitles = _stMngr.getSubtitles();
        if(slConfig.isEnabled && subtitles){
            subtitles.position.x = _stMngr.removeOverlap(subtitles.scale.x);
        }
    };

/**
 * Sets the signer content.
 *
 * @param      {<type>}  url     The new value
 * @param      {<type>}  lang    The language
 */
    this.setContent = function(url, lang) {
        slConfig.url = url;
        slConfig.language = lang;
        if (slConfig.isEnabled) {
            _slMngr.create();
        }
    };

/**
 * Sets the signer languages array.
 *
 * @param      {<type>}  subList  The sub list
 */
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

/*****************************************************************************************************************************
*                                          P U B L I C    C H E C K E R S 
*****************************************************************************************************************************/

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

};