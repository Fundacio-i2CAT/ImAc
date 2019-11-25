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


//************************************************************************************
// Private Functions
//************************************************************************************

	this.updateISD = function(offset){
		if ( imsc1doc ){
			var isd = imsc.generateISD( imsc1doc, offset );

			if ( isd.contents.length > 0 ){


		    	if ( stConfig.isEnabled ){
		    		
			  		_stMngr.setScenePos(-isd.imacY, isd.imac); //latitude, longitude
		    		print3DText( isd.contents[0], isd.imac, -isd.imacY );
		    	} 

		    	if ( stConfig.indicator == 'arrow' ) {

		    		//Depending on which access service is active the arrow group changes.
			    	if( stConfig.isEnabled ){
			    		this.setArrows(subtitleMesh.getObjectByName("arrows"));
			    	} else if(_slMngr.getSignerEnabled() && !stConfig.isEnabled){
			    		this.setArrows(signerMesh.getObjectByName("arrows"));
			    	} else{
			    		this.setArrows(undefined)
			    	}
		    		arrowInteraction();
		    	}

		    	if ( stConfig.indicator == 'radar' ){
		    		if ( isd.contents[0].contents.length > 0 ){
		    			let isdContentText = isd.contents[0].contents[0].contents[0].contents[0].contents;
				    	let color;
						for ( var i = 0, l = isdContentText.length; i < l; ++i ){
				      		if ( isdContentText[i].kind == 'span' && isdContentText[i].contents ){
					    		color = adaptRGBA( isdContentText[i].contents[0].styleAttrs['http://www.w3.org/ns/ttml#styling color'] );
				      		}
				    	}
		      			 _rdr.updateRadarIndicator(color, isd.imac);
		    		}
	      		}

		    	checkSpeakerPosition( isd.imac );
		  	} else if ( textListMemory.length > 0 ){
		    	textListMemory = [];
		    	_stMngr.removeSubtitle();
		    	_rdr.hideRadarIndicator();
		  	}
		}
		
		if ( imsc1doc_SL ){
			var isd = imsc.generateISD( imsc1doc_SL, offset );

			if ( isd.contents.length > 0 ){
		    	if ( _slMngr.getSignerEnabled() ) print3DSLText( isd.contents[0], isd.imac, -isd.imacY );
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


	function arrowInteraction(){

		let arw = this.getArrows();

		// cada 300 milis aprox
    	if(arw){
			arw.getObjectByName("right").material.opacity = arw.getObjectByName("right").material.opacity == 1 ? 0.4 : 1;
			arw.getObjectByName("left").material.opacity = arw.getObjectByName("left").material.opacity == 1 ? 0.4 : 1;
    	}
	}


	function print3DText(isdContent, isdImac, isdImacY) 
	{
	  	if ( isdContent.contents.length > 0 )
	  	{
	    	var isdContentText = isdContent.contents[0].contents[0].contents[0].contents;
	    	var textList = [];

	    	for ( var i = 0, l = isdContentText.length; i < l; ++i )
	    	{
	      		if ( isdContentText[i].kind == 'span' && isdContentText[i].contents )
	      		{
	        		var isdTextObject = {
	          			text: isdContentText[i].contents[0].text, //'MMMMMWWWWWMMMMMWWWWWMMMMMWWWWWMMMMM',
	          			color: adaptRGBA( isdContentText[i].contents[0].styleAttrs['http://www.w3.org/ns/ttml#styling color'] ),
	          			backgroundColor: adaptRGBA( isdContentText[i].contents[0].styleAttrs['http://www.w3.org/ns/ttml#styling backgroundColor'] )
	        		};

	        		textList.push( isdTextObject );
	      		}
	    	}

	    	if ( textList.length > 0 && ( textListMemory.length == 0 || textListMemory.length > 0 && textList[0].text != textListMemory[0].text || textList.length != textListMemory.length ) ) {
	      		_stMngr.removeSubtitle();
			    _stMngr.createSubtitle( textList, stConfig );
			    
	      		textListMemory = textList;     
	    	} 
	  	} else {
	    	textListMemory = [];
	    	_stMngr.removeSubtitle();
	    	_rdr.hideRadarIndicator();
	  	}

	}

	function print3DSLText(isdContent, isdImac, isdImacY) 
	{
	  	if ( isdContent.contents.length > 0 )
	  	{
	    	var isdContentText = isdContent.contents[0].contents[0].contents[0].contents;
	    	var textList = [];

	    	for ( var i = 0, l = isdContentText.length; i < l; ++i ){
	      		if ( isdContentText[i].kind == 'span' && isdContentText[i].contents ){
	        		var isdTextObject = {
	          			text: isdContentText[i].contents[0].text, //'MMMMMWWWWWMMMMMWWWWWMMMMMWWWWWMMMMM',
	          			color: adaptRGBA( isdContentText[i].contents[0].styleAttrs['http://www.w3.org/ns/ttml#styling color'] ),
	          			backgroundColor: adaptRGBA( isdContentText[i].contents[0].styleAttrs['http://www.w3.org/ns/ttml#styling backgroundColor'] )
	        		};

	        		textList.push( isdTextObject );
	      		}
	    	}

	    	if ( textList.length > 0 && ( SLtextListMemory.length == 0 || SLtextListMemory.length > 0 && textList[0].text != SLtextListMemory[0].text || textList.length != SLtextListMemory.length ) ) {
	      		_slMngr.removeSLSubtitle();

			    _slMngr.createSLSubtitle( textList );

	      		SLtextListMemory = textList;     
	    	} 
	    	if ( _slMngr.getSignerAutoHide() ) _slMngr.swichtSL(true); 
		    _slMngr.setSubtitleSLConfig(subSLConfig);
	  	} else {
	  		if( _slMngr.getSignerAutoHide() ) _slMngr.swichtSL(false);
	  	}

	}

	function checkSpeakerPosition(isdImac)
	{
		var difPosition = getViewDifPosition( isdImac, camera.fov );
	  	var position;

	  	if ( isdImac == undefined || difPosition == 0 ){
	  		position = 'center';
	  	} else {
	    	position = difPosition < 0 ? 'left' : 'right';
	  	}

	  	_stMngr.checkSubtitleIdicator( position );
	    _slMngr.checkSignIdicator( position );	
	}
}
