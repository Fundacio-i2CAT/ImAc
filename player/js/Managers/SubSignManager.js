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
		* enableSubtitles / disableSubtiles
		* updateSubtitleByTime = function( time )    --> Update the subtiltes using a 'time' in secongs such as currentTime
		* switchSubtitles = function( enable )       --> Enable or disable the subtitles using the boolean 'enable'
		* switchSigner = function( enable )          --> Enable or disable the signer using the boolean 'enable'
		* updateRadar = function()                   --> Update the radar orientation using the camera orientation

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
	      			_rdr.updateRadarIndicator(subController.getSpeakerColor(), isd.imac);
	      		}
	      		
  		    	if (stConfig.indicator.localeCompare('arrow') === 0) {
					arrowInteraction();
		    	}
		    	checkSpeakerPosition( isd.imac );
		  	} else if (textListMemory.length > 0) {
		    	_stMngr.removeSubtitle();
		    	_rdr.hideRadarIndicator();
		  	}
		}

		if (imsc1doc_SL) {
			isd = imsc.generateISD(imsc1doc_SL, offset);
			if (isd.contents.length > 0) {
		    	if (slConfig.isEnabled) {
    			  	if (isd.contents[0].contents.length > 0) { 
    			  		if (slConfig.autoHide) {
    			  			_slMngr.swichtSL(true);	
    			  		}
    			  		print3DText( isd.contents[0], 'sl' );
    			  	} else {
    			  		if (slConfig.autoHide) {
    			  			_slMngr.swichtSL(false);
    			  		}
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
			    		subController.setSpeakerColor(adaptRGBA(isdContentText[i].contents[0].styleAttrs['http://www.w3.org/ns/ttml#styling color']));
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

	this.setArrows = function(value){
		arrows = value;
	}

	this.getArrows = function(){
		return arrows;
	}

	this.setSpeakerColor = function(value){
		speakerColor = value;
	}

	this.getSpeakerColor = function(){
		return speakerColor;
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
    			subController.setSpeakerColor(textList[0].color);
    			if (accessService.localeCompare('st') === 0) {
    				if (textListMemory.length > 0 && textList[0].text.localeCompare(textListMemory[0].text) != 0 || textList.length != textListMemory.length) {
					    _stMngr.createSubtitle(textList);
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
	    		_stMngr.removeSubtitle();
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
	    	_slMngr.checkSignIdicator(position);
	    }
	}
	

	function arrowInteraction(){
		let slMesh = _slMngr.getSigner();
		let stMesh = _stMngr.getSubtitles();
		let width;

		//Depending on which access service is active the arrow group changes.
		if (slConfig.isEnabled && slMesh) {
			if (stConfig.isEnabled){
				slMesh.getObjectByName('sl-subtitles').visible = false;
				slMesh.getObjectByName('arrows').visible = false;
				if (stMesh) {
					subController.setArrows(stMesh.getObjectByName('arrows'));
					width = stConfig.width;
				} 
			} else {
				slMesh.getObjectByName('sl-subtitles').visible = true;
				slMesh.getObjectByName('arrows').visible = true;
				subController.setArrows(slMesh.getObjectByName('arrows'));
				width = slMesh.getObjectByName('emojitext').geometry.parameters.width;
			}
		} else if (stConfig.isEnabled) {
			if (stMesh) {
				subController.setArrows(stMesh.getObjectByName('arrows'));
				width = stConfig.width;
			} 
		} else {
			subController.setArrows(undefined);
		}

		let arw = subController.getArrows();
		// cada 300 milis aprox
    	if (arw) {
    		let positionFactor = (!imsc1doc_SL && !stConfig.isEnabled) ? -1 : 1;
    		let arwSize = arw.children[0].children[1].geometry.parameters.width/2;

    		arw.getObjectByName('right-img').material.color.set(subController.getSpeakerColor());
    		arw.getObjectByName('right').position.x = width/2 +positionFactor * arwSize;
			arw.getObjectByName('right-img').material.opacity = (arw.getObjectByName('right-img').material.opacity === 1) ? 0.4 : 1;
			arw.getObjectByName('left-img').material.color.set(subController.getSpeakerColor());
			arw.getObjectByName('left').position.x = -width/2 -positionFactor * arwSize;
			arw.getObjectByName('left-img').material.opacity = (arw.getObjectByName('left-img').material.opacity === 1) ? 0.4 : 1;
    	}
	}
};