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

	var textListMemory = [];
	var SLtextListMemory = [];

	var speakerMesh;
	var subtitleSLMesh;

	var areaMesh;
	var autoHMD = false;

	let arrows;

	let isdContentTextMemory; //TEST
	let speakerColor = "rgb(255,255,255)";


//************************************************************************************
// Private Functions
//************************************************************************************

	this.updateISD = function(offset){
		if ( imsc1doc ){
			var isd = imsc.generateISD( imsc1doc, offset );
			if ( isd.contents.length > 0 ){
				if ( isd.contents[0].contents.length > 0 ){		
	    			let isdContentText = isd.contents[0].contents[0].contents[0].contents[0].contents;		    	
					for ( var i = 0, l = isdContentText.length; i < l; ++i ){
			      		if ( isdContentText[i].kind == 'span' && isdContentText[i].contents ){
				    		subController.setSpeakerColor(adaptRGBA( isdContentText[i].contents[0].styleAttrs['http://www.w3.org/ns/ttml#styling color']));
			      		}
			    	}
			    }
				
		    	if ( stConfig.isEnabled ){
			  		_stMngr.setScenePos(-isd.imacY, isd.imac); //latitude, longitude
		    		print3DText( isd.contents[0], isd.imac, -isd.imacY );
		    	} 

		    	if ( stConfig.indicator == 'arrow' ) {
		    		arrowInteraction();
		    	}
		    	if ( stConfig.indicator == 'radar' ){
	      			_rdr.updateRadarIndicator(subController.getSpeakerColor(), isd.imac);
	      		}
		    	checkSpeakerPosition( isd.imac );
		  	} else if ( textListMemory.length > 0 ){
		    	//textListMemory = [];
		    	subController.setTextListMemory( [] );
		    	_stMngr.removeSubtitle();
		    	_rdr.hideRadarIndicator();
		  	}
		}
		
		if ( imsc1doc_SL ){
			var isd = imsc.generateISD( imsc1doc_SL, offset );

			if ( isd.contents.length > 0 ){
		    	if ( slConfig.isEnabled ) print3DSLText( isd.contents[0], isd.imac, -isd.imacY );
		  	} else if ( SLtextListMemory.length > 0 ){
		    	SLtextListMemory = [];
		    	//removeSLSubtitle();
		  	}
		}
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

	function arrowInteraction(){
		let slMesh = _slMngr.getSigner();
		let stMesh = _stMngr.getSubtitles();

		//Depending on which access service is active the arrow group changes.
		if(slConfig.isEnabled && slMesh){
			if(stConfig.isEnabled && stMesh){
				slMesh.getObjectByName("arrows").visible = false;
				subController.setArrows(stMesh.getObjectByName("arrows"));
			} else{
				slMesh.getObjectByName("arrows").visible = true;
				subController.setArrows(slMesh.getObjectByName("arrows"));

			}
		} else if(stConfig.isEnabled && stMesh){
			subController.setArrows(stMesh.getObjectByName("arrows"))
		} else {
			subController.setArrows(undefined)
		}

		let arw = subController.getArrows();
		// cada 300 milis aprox
    	if(arw){
    		let slVideoScale = _slMngr.getSigner().getObjectByName('sl-video').scale.x;
    		let positionFactor = (!imsc1doc_SL && !stConfig.isEnabled) ? -1 : 1;
    		let arwSize = (!imsc1doc_SL && !stConfig.isEnabled) ? 6.5/2 : 6.5;
    		let width = (!imsc1doc_SL && !stConfig.isEnabled) ? (slConfig.size / slVideoScale) : stConfig.width;

    		arw.getObjectByName("right-img").material.color.set( subController.getSpeakerColor());
    		arw.getObjectByName("right").position.x = width/2 +positionFactor * arwSize * 0.75;
			arw.getObjectByName("right-img").material.opacity = arw.getObjectByName("right-img").material.opacity == 1 ? 0.4 : 1;
			arw.getObjectByName("left-img").material.color.set( subController.getSpeakerColor());
			arw.getObjectByName("left").position.x = -width/2 -positionFactor * arwSize * 0.75;
			arw.getObjectByName("left-img").material.opacity = arw.getObjectByName("left-img").material.opacity == 1 ? 0.4 : 1;
    	}
	}


	function print3DText(isdContent, isdImac, isdImacY) {
	  	if ( isdContent.contents.length > 0 ){
	  		var isdContentText = isdContent.contents[0].contents[0].contents[0].contents;
	    	if(JSON.stringify(isdContentText) !== JSON.stringify(isdContentTextMemory) ){
	    		subController.setisdContentTextMemory(isdContentText);
		    	var textList = [];
		    	for ( var i = 0, l = isdContentText.length; i < l; ++i ){
		      		if ( isdContentText[i].kind == 'span' && isdContentText[i].contents ){
		        		var isdTextObject = {
		          			text: isdContentText[i].contents[0].text, //'MMMMMWWWWWMMMMMWWWWWMMMMMWWWWWMMMMM',
		          			color: adaptRGBA( isdContentText[i].contents[0].styleAttrs['http://www.w3.org/ns/ttml#styling color'] ),
		          			backgroundColor: adaptRGBA( isdContentText[i].contents[0].styleAttrs['http://www.w3.org/ns/ttml#styling backgroundColor'] )
		        		};
		        		textList.push( isdTextObject );
		        		subController.setSpeakerColor(isdTextObject.color);
		      		}
		    	}
	    		if ( textList.length > 0){
	    			if(textListMemory.length > 0 && textList[0].text.localeCompare(textListMemory[0].text) != 0 || textList.length != textListMemory.length){
					    _stMngr.createSubtitle( textList );
			      		subController.setTextListMemory(textList);
	    			}
	    		}
	    	}
    	 } else{
	    	subController.setTextListMemory( [] );
	    	_stMngr.removeSubtitle();
	    	_rdr.hideRadarIndicator();
	  	}
	}

	function print3DSLText(isdContent, isdImac, isdImacY) {
	  	if ( isdContent.contents.length > 0 ){
	    	var isdContentText = isdContent.contents[0].contents[0].contents[0].contents;
	    	var textList = [];

	    	for ( var i = 0, l = isdContentText.length; i < l; ++i ){
	      		if ( isdContentText[i].kind == 'span' && isdContentText[i].contents ){
	        		var isdTextObject = {
	          			text: isdContentText[i].contents[0].text, //'MMMMMWWWWWMMMMMWWWWWMMMMMWWWWWMMMMM',
	          			color: adaptRGBA( isdContentText[i].contents[0].styleAttrs['http://www.w3.org/ns/ttml#styling color'] ),
	          			backgroundColor: adaptRGBA( isdContentText[i].contents[0].styleAttrs['http://www.w3.org/ns/ttml#styling backgroundColor'] )
	        		};
	        		subController.setSpeakerColor(isdTextObject.color);
	        		textList.push( isdTextObject );
	      		}
	    	}
	    	//if ( textList.length > 0 && ( SLtextListMemory.length == 0 || SLtextListMemory.length > 0 && textList[0].text != SLtextListMemory[0].text || textList.length != SLtextListMemory.length ) ) {
	    	if ( textList.length > 0){
    			if(SLtextListMemory.length > 0 && textList[0].text.localeCompare(SLtextListMemory[0].text) != 0 || textList.length != SLtextListMemory.length){
					_slMngr.removeSLSubtitle();
		    		_slMngr.createSLSubtitle( textList );

      				SLtextListMemory = textList;
    			}
    		}
	    	if ( slConfig.autoHide ) _slMngr.swichtSL(true); 
		    //_slMngr.setSubtitleSLConfig(subSLConfig);
	  	} else {
	  		if( slConfig.autoHide ) _slMngr.swichtSL(false);
	  	}

	}

	function checkSpeakerPosition(isdImac){
		let difPosition = getViewDifPosition( isdImac, camera.fov );
	  	let position;

	  	if ( isdImac == undefined || difPosition == 0 ){
	  		position = 'center';
	  	} else {
	    	position = difPosition < 0 ? 'left' : 'right';
	  	}
	  	if(stConfig.isEnabled) _stMngr.checkSubtitleIdicator( position );
	    if(slConfig.isEnabled) _slMngr.checkSignIdicator( position );	
	}


	this.setTextListMemory = function(value){
		textListMemory = value;
	}

	this.setisdContentTextMemory = function(value){
		isdContentTextMemory = value;
	}
	
}
