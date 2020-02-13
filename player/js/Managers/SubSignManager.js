/**
 * @author isaac.fraile@i2cat.net
 */

/************************************************************************************
	
	SubSignManager.js  
		* Library used to manage Subtitle and Signer elements

	This library needs to use external libs:
		* MediaObjectData.js         -->  To create the subtilte, signer and radar meshs
		* imsc_i2cat.js              -->  To parse the xml subtiles
		* THREE.js                   -->  To modify the mesh attributes such as visiblity
		* VideoController.js         -->  To get the video current time
		* InteractionsController.js  -->  To add interactivity to a mesh object

	This library needs to use the global vars:
		* camera
		* scene
		* CameraParentObject
		* _isHMD
		* _moData
		* AplicationManager
		* VideoController
		* interController
	
	FUNCTIONALITIES:
		* updateISD

	PRIVATE: 
		* print3DText
		* checkSpeakerPosition
		* arrowInteraction


************************************************************************************/

SubSignManager = function() {

	let textListMemory = [];
	let SLtextListMemory = [];
	let arrows;
	let speakerColor = 'rgb(255,255,255)';


//************************************************************************************
// Private Functions
//************************************************************************************

	this.updateISD = function(offset){
		let isd;
		if (imsc1doc) {
			isd = imsc.generateISD(imsc1doc, offset);
			if (isd.contents.length > 0) {
		    	if (stConfig.isEnabled) {
			  		_stMngr.setScenePos(-isd.imacY, isd.imac); //latitude, longitude
		    		print3DText(isd.contents[0], 'st');
		    	} 

		    	if (stConfig.indicator.localeCompare('radar') === 0) {
	      			_rdr.updateRadarIndicator(speakerColor, isd.imac);
	      		}
	      		
  		    	if (stConfig.indicator.localeCompare('arrow') === 0) {
					arrowInteraction();
		    	}
		    	checkSpeakerPosition( isd.imac );
		  	} else if (textListMemory.length > 0) {
		    	_stMngr.remove();
		    	_rdr.hideRadarIndicator();
		  	}
		}

		if (imsc1doc_SL) {
			isd = imsc.generateISD(imsc1doc_SL, offset);
			if (isd.contents.length > 0) {
		    	if (slConfig.isEnabled) {
    			  	if (isd.contents[0].contents.length > 0) { 
    			  		if (slConfig.autoHide) {
    			  			_slMngr.getSigner().visible = true;	
    			  		}
    			  		print3DText( isd.contents[0], 'sl' );
    			  	} else {
    			  		if (slConfig.autoHide) {
    			  			_slMngr.getSigner().visible = false;
    			  		}
    			  		else _slMngr.removeSLSubtitle();
    			  	}
		    	} 
		  	} else if (SLtextListMemory.length > 0) {
		    	_slMngr.removeSLSubtitle();
		    	_rdr.hideRadarIndicator();
		  	}
		} else {
			if (isd.contents[0].contents.length > 0) {		
    			let isdContentText = isd.contents[0].contents[0].contents[0].contents[0].contents;		    	
				for (let i = 0, l = isdContentText.length; i < l; ++i) {
		      		if (isdContentText[i].kind == 'span' && isdContentText[i].contents) {
			    		speakerColor = adaptRGBA(isdContentText[i].contents[0].styleAttrs['http://www.w3.org/ns/ttml#styling color']);
		      		}
			    }
			}
		}
	}


	this.setTextListMemory = function(value){
		textListMemory = value;
	}

	this.setSLtextListMemory = function(value){
		SLtextListMemory = value;
	}

	this.getArrows = function(){
		return arrows;
	}

	function print3DText(isdContent, accessService) {
	  	if (isdContent.contents.length > 0) {
	  		let isdContentText = isdContent.contents[0].contents[0].contents[0].contents;
	    	let textList = [];
	    	for (let i = 0; i < isdContentText.length; ++i) {
	      		if(isdContentText[i].kind == 'span' && isdContentText[i].contents){
	        		let isdTextObject = {
	          			text: isdContentText[i].contents[0].text, //'MMMMMWWWWWMMMMMWWWWWMMMMMWWWWWMMMMM',
	          			color: adaptRGBA( isdContentText[i].contents[0].styleAttrs['http://www.w3.org/ns/ttml#styling color'] ),
	          			backgroundColor: adaptRGBA( isdContentText[i].contents[0].styleAttrs['http://www.w3.org/ns/ttml#styling backgroundColor'] )
	        		};
	        		textList.push( isdTextObject );
	      		}
	    	}
    		if (textList.length > 0) {
    			speakerColor = textList[0].color;
    			if (accessService.localeCompare('st') === 0) {
    				if (textListMemory.length > 0 && textList[0].text.localeCompare(textListMemory[0].text) != 0 || textList.length != textListMemory.length) {
					    _stMngr.create(textList);
			      		subController.setTextListMemory(textList);
	    			}
	    		}

    			if (accessService.localeCompare('sl') === 0) {
    				if (SLtextListMemory.length > 0 && textList[0].text.localeCompare(SLtextListMemory[0].text) != 0 || textList.length != SLtextListMemory.length) {
			    		_slMngr.createSLSubtitle(textList);
	      				subController.setSLtextListMemory(textList);
	    			}
    			}
    		}
    	}else {
	    	if(accessService.localeCompare('st') === 0) {
	    		_stMngr.remove();
	    	}
	    	if(accessService.localeCompare('sl') === 0) {
	    		_slMngr.removeSLSubtitle();
	    	}
	    	_rdr.hideRadarIndicator();
	  	}
	}


	function checkSpeakerPosition(isdImac){
		let difPosition = getViewDifPosition( isdImac, camera.fov );
	  	let position;

	  	if (isdImac == undefined || difPosition == 0) {
	  		position = 'center';
	  	} else {
	    	position = difPosition < 0 ? 'left' : 'right';
	  	}
	  	if (stConfig.isEnabled) {
	  		_stMngr.checkSubtitleIdicator(position);
	  	}
	    if(slConfig.isEnabled){
	        if (stConfig.indicator != 'none') {
		        _stMngr.checkSubtitleIdicator( position );
		    }
	    }
	}
	

	function arrowInteraction(){
		let slMesh = _slMngr.getSigner();
		let stMesh = _stMngr.getSubtitles();
		let width = stConfig.width;

		//Depending on which access service is active the arrow group changes.
		if (slConfig.isEnabled && slMesh) {
			if (stConfig.isEnabled){
				if(!imsc1doc_SL){
					slMesh.getObjectByName('sl-subtitles').visible = false;	
				} 
				if (stMesh) {
					arrows = stMesh.getObjectByName('arrows');
					width = stMesh.getObjectByName('emojitext').geometry.parameters.width;
	            	stMesh.position.x = _stMngr.removeOverlap(stMesh.scale.x);
				} 
				slMesh.getObjectByName('arrows').visible = false;
			} else {
				if(!imsc1doc_SL){
					slMesh.getObjectByName('sl-subtitles').visible = true;	
				} 
				if (slMesh.getObjectByName('arrows')) {
					slMesh.getObjectByName('arrows').visible = true;
					arrows = slMesh.getObjectByName('arrows');
				}
				if (slMesh.getObjectByName('emojitext'))  width = slMesh.getObjectByName('emojitext').geometry.parameters.width;
			}
		} else if (stConfig.isEnabled) {
			if (stMesh) {
				arrows = stMesh.getObjectByName('arrows');
				width = stMesh.getObjectByName('emojitext').geometry.parameters.width;
			} 
		} else {
			arrows = undefined;
		}

		// cada 300 milis aprox
    	if (arrows) {
    		let positionFactor = (!imsc1doc_SL && !stConfig.isEnabled) ? -1 : 1;
    		let arwSize = arrows.children[0].children[1].geometry.parameters.width/2;

    		arrows.getObjectByName('right-img').material.color.set(speakerColor);
    		arrows.getObjectByName('right').position.x = width/2 +positionFactor * arwSize;
			arrows.getObjectByName('right-img').material.opacity = (arrows.getObjectByName('right-img').material.opacity === 1) ? 0.4 : 1;

			arrows.getObjectByName('left-img').material.color.set(speakerColor);
			arrows.getObjectByName('left').position.x = -width/2 -positionFactor * arwSize;
			arrows.getObjectByName('left-img').material.opacity = (arrows.getObjectByName('left-img').material.opacity === 1) ? 0.4 : 1;
    	}
	}
};