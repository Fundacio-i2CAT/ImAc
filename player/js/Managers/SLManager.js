
SLManager = function() {

	var imsc1doc;
	var imsc1doc_SL;

	var textListMemory = [];
	var SLtextListMemory = [];

	var autoPositioning = false;
	var radarAutoPositioning = false;

	var subtitleMesh;
	var signerMesh;
	var radarMesh;
	var radarMesh3;
	var speakerMesh;
	var subtitleSLMesh;

	var areaMesh;
	var isExperimental = false;
	var autoHMD = false;

	var subConfig;
	var subSLConfig;


	// [SL] signer vars
	var signerContent; // URL
	var signEnabled = false; // boolean
	var signPosX = 1; // left = -1, center = 0, right = 1
	var signPosY = -1; // bottom = -1, center = 0, top = 1
	//var signIndicator = 'none';	 // none, arrow, move
	var signArea = 60; // small = 50, medium = 60, large = 70
	var signLang = 'en'; // string (en, de, ca, es)
	var signAvailableLang = []; // Array { name, value, default:bool }
	var signerSize = 20;

	var signAutoHide = false;


//************************************************************************************
// Private Functions
//************************************************************************************

	function updateISD(offset)
	{
		if ( imsc1doc )
		{
			var isd = imsc.generateISD( imsc1doc, offset );

			if ( isd.contents.length > 0 ) 
		  	{
		  		generateSTConf( isd.imac, -isd.imacY );
		  		//if (_fixedST && !isd.imac ) isd.imac = 0;
		  		//if (_fixedST && !isd.imacY ) isd.imacY = 0;

		  		if ( autoPositioning ) changePositioning( isd.imac );
		  		if ( radarAutoPositioning ) changeSimplePositioning( isd.imac );
		    	if ( subtitleEnabled ) print3DText( isd.contents[0], isd.imac, -isd.imacY );

		    	if ( subtitleIndicator == 'arrow' ) {
		    		arrowInteraction();
		    		if (!subtitleEnabled) arrowSLInteraction();
		    	}

		    	if ( subtitleIndicator == 'radar' ){
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
		  	}
		  	else if ( textListMemory.length > 0 )
		  	{
		    	textListMemory = [];
		    	removeSubtitle();
		    	_rdr.hideRadarIndicator();
		  	}
		}
		if ( imsc1doc_SL )
		{
			var isd = imsc.generateISD( imsc1doc_SL, offset );

			if ( isd.contents.length > 0 ) 
		  	{
		    	if ( signEnabled ) print3DSLText( isd.contents[0], isd.imac, -isd.imacY );
		  	}
		  	else if ( SLtextListMemory.length > 0 )
		  	{
		    	SLtextListMemory = [];
		    	removeSLSubtitle();
		  	}
		}
	}


	function arrowSLInteraction()
	{
		// cada 300 milis aprox
		if ( scene.getObjectByName("rightSL") ) {

			scene.getObjectByName("rightSL").material.opacity = scene.getObjectByName("rightSL").material.opacity == 1 ? 0.4 : 1;
		}
		
		if ( scene.getObjectByName("leftSL") ) {

			scene.getObjectByName("leftSL").material.opacity = scene.getObjectByName("leftSL").material.opacity == 1 ? 0.4 : 1;
		}
	}


	function print3DSLText(isdContent, isdImac, isdImacY) 
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

	    	if ( textList.length > 0 && ( SLtextListMemory.length == 0 || SLtextListMemory.length > 0 && textList[0].text != SLtextListMemory[0].text || textList.length != SLtextListMemory.length ) ) 
	    	{
	      		removeSLSubtitle();

			    createSLSubtitle( textList );

	      		SLtextListMemory = textList;     
	    	} 
	    	if ( signAutoHide ) subController.swichtSL(true); 
	    	//subController.swichtSL(true); 

		    setSubtitleSLConfig(subSLConfig);
	  	}
	  	else 
	  	{
	  		if ( signAutoHide ) subController.swichtSL(false);
	  		//subController.swichtSL(false);

	    	SLtextListMemory = [];
	    	removeSLSubtitle();
	  	}

	}

	function checkSignIdicator(position)
	{
		if ( subtitleIndicator != 'none' ) 
		{
		  	if ( position == 'center' && subtitleIndicator == 'move' ) 
		  	{
		  		position = signPosX == -1 ? 'left' : 'right';
		  	}
			subtitleIndicator != 'move' ? changeSignIndicator( position ) : changeSignPosition( position );
		}
	}

	function checkSpeakerPosition(isdImac)
	{
		var difPosition = getViewDifPosition( isdImac, camera.fov );
	  	var position;

	  	if ( isdImac == undefined || difPosition == 0 )
	  	{
	  		position = 'center';
	  	}
	  	else
	  	{
	    	position = difPosition < 0 ? 'left' : 'right';
	  	}

	  	checkSubtitleIdicator( position );
	    checkSignIdicator( position );	
	}

	function changePositioning(isdImac)
	{
		//console.log(isdImac)
		if ( isdImac == undefined && _isHMD ) 
		{
			AplicationManager.enableVR();
        	autopositioning = false;
        	//CameraParentObject.rotation.set(0,0,0);
			autoHMD = true;
		}
		else 
		{
			if ( _isHMD && autoHMD ) 
			{
				camera.rotation.set( 0,0,0 );
            	//CameraParentObject.quaternion.set(0,0,0,0);
				autoHMD = false;
				autopositioning = true;
			}
			autoPositioning = false;
			var position = Math.round(getViewDifPosition( isdImac, 3 ));

	      	var rotaionValue = 0;
	      	//var initY = Math.round( CameraParentObject.rotation.y * (-180/Math.PI)%360 );
	      	var initY = Math.round( camera.rotation.y * (-180/Math.PI)%360 );

	      	var rotationInterval = setInterval(function() 
	      	{
	      		var difff = isdImac - initY;
	      		if ( difff > 180 ) difff -= 360;
	      		if ( difff < 0 ) difff = -1*difff;
	        	if ( position * rotaionValue >= difff || position == 0 || autopositioning == false) 
	        	{
	        		clearInterval( rotationInterval );
	        		if ( VideoController.getListOfVideoContents()[0].vid.currentTime < VideoController.getListOfVideoContents()[0].vid.duration - 10 ) autoPositioning = true;
	        		else {
	        			AplicationManager.enableVR();
	        			autopositioning = false;
	        			//if ( _isHMD ) CameraParentObject.rotation.set(0,0,0);
	        			if ( _isHMD ) camera.rotation.set(0,0,0);
	        		}
	        	}
	        	else 
	        	{
	          		rotaionValue += position*1.2; // 60 degrees by second
	          		//CameraParentObject.rotation.y = initY / ( -180 / Math.PI )%360 + rotaionValue * ( -Math.PI / 180 );
	          		camera.rotation.y = initY / ( -180 / Math.PI )%360 + rotaionValue * ( -Math.PI / 180 );
	        	}
	      	}, 20); 
	    }
	}

	function changeSimplePositioning(isdImac)
	{
		//AplicationManager.disableVR();
		radarAutoPositioning = false;

		var a = new THREE.Euler( 0, Math.radians(-isdImac), 0, 'XYZ' );
		camera.quaternion.setFromEuler( a );
	}	

	function createSigner()
	{
	   	var posX = _isHMD ? 0.6* ( 1.48*signArea/2-20/2 ) *signPosX : ( 1.48*signArea/2-20/2 ) *signPosX;
	    var posY = _isHMD ? 0.6* ( 0.82*signArea/2-20/2 ) *signPosY + 1.4 : ( 0.82*signArea/2-20/2 ) *signPosY +1.4;
	    var posZ = 75;

		var conf = {
			size: signerSize, // signArea/100
			signIndicator: subtitleIndicator,
			x: posX,
			y: posY,
			z: posZ
		};

      	createSignVideo( signerContent, 'sign', conf );
      	if ( !VideoController.isPausedById( 0 ) ) VideoController.playAll();
	}

	function updateSignerPosition()
	{
		if ( scene.getObjectByName("sign") )
		{
		   	var posX = _isHMD ? 0.6*( 1.48*signArea/2-20/2 )*signPosX : ( 1.48*signArea/2-20/2 )*signPosX;
		    var posY = _isHMD ? 0.6*( 0.82*signArea/2-20/2 )*signPosY + 1.4 : ( 0.82*signArea/2-20/2 )*signPosY + 1.4;
		    var posZ = 75;

		    scene.getObjectByName("sign").position.x = posX;
		    scene.getObjectByName("sign").position.y = posY;

		    if ( subtitleSLMesh )
		    {
		    	SLtextListMemory = [];
	    		removeSLSubtitle();
		    }
		}
	}


    // Subtitles fixed under SL video
    function createSLSubtitle(textList)
    {
    	var posX = _isHMD ? 0.6*( 1.48*signArea/2-20/2 ) *signPosX : ( 1.48*signArea/2-20/2 ) *signPosX;
	    var posY = _isHMD ? 0.6*( 0.82*signArea/2-20/2 ) *signPosY + 1.4 : ( 0.82*signArea/2-20/2 ) *signPosY + 1.4;
	    var posZ = 75;

		var slconfig = {
			size: signerSize, // signArea/100
			subtitleIndicator: subtitleIndicator,
			x: posX,
			y: posY,
			z: posZ
		};

    	subtitleSLMesh = _moData.getSLSubtitleMesh( textList, subBackground, slconfig );

    	// check zoom
        if ( camera.fov < 60 )
        {
        	subtitleSLMesh.scale.set( subtitleSLMesh.scale.x * 0.5, subtitleSLMesh.scale.y * 0.5, 1)

        	if ( camera.fov < 30 )
	        {
	        	subtitleSLMesh.scale.set( subtitleSLMesh.scale.x * 0.5, subtitleSLMesh.scale.y * 0.5, 1)
	        }
        }

        camera.add( subtitleSLMesh );
    }

    function createSignVideo(url, name, config)
    {
    	removeSignVideo();

    	var hasSLSubtitles = imsc1doc_SL ? true : false;

        signerMesh = _moData.getSignVideoMesh( url, name, config, hasSLSubtitles );
        signerMesh.visible = false;
        var SLTimeout = setTimeout( function() { signerMesh.visible = true },700);
        camera.add( signerMesh );
        subController.setSignerSize(signerSize)
    }

    function createSubAreaHelper(size)
    {
    	if ( areaMesh ) camera.remove( areaMesh );

		var mesh = _moData.getPlaneImageMesh( 1.48*size, 0.82*size, './img/rect5044.png', 'areamesh', 5 );
		mesh.position.z = -70;
		mesh.autoRemove = function() {
			var timer = setTimeout(function() {
	        	camera.remove( mesh );
	        }, 1000);
		}
		areaMesh = mesh;
        camera.add( mesh );

        mesh.autoRemove();
    }

//************************************************************************************
// Media Object Destructors
//************************************************************************************

    function removeSubtitle()
    {
    	textListMemory = [];

        (isExperimental || _fixedST) ? scene.remove( subtitleMesh ) : camera.remove( subtitleMesh );

        subtitleMesh = undefined;
    }

    function removeSLSubtitle()
    {
    	SLtextListMemory = [];

        camera.remove( subtitleSLMesh );

        subtitleSLMesh = undefined;
    }

    function removeSignVideo()
    {
        if ( signerMesh ) 
        {
            VideoController.removeContentById( signerMesh.name );
            camera.remove( signerMesh );
            signerMesh = undefined;
        }
        if ( subtitleSLMesh ) removeSLSubtitle()

    }

//************************************************************************************
// Media Object Position Controller 
//************************************************************************************

  
    function changeSignIndicator(pos)
    {
        if ( signerMesh && !subtitleEnabled )
        {
            if ( scene.getObjectByName("rightSL") ) {

				scene.getObjectByName("rightSL").visible = pos == 'right' ? true : false;
			}
			
			if ( scene.getObjectByName("leftSL") ) {

				scene.getObjectByName("leftSL").visible = pos == 'left' ? true : false;
			}
        }
    }

    function changeSignPosition(pos) 
    {
        if ( signerMesh && ( ( pos == 'left' && signerMesh.position.x > 0 ) || ( pos == 'right' && signerMesh.position.x < 0 ) ) )
        {
            signerMesh.position.x = signerMesh.position.x * -1;
        }
    }

//************************************************************************************
// Utils
//************************************************************************************

	function adaptRGBA(rgb)
    {
    	return ( rgb && rgb.length === 4 ) ? "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")" : '';
	}

    function getViewDifPosition(sp, fov)
    {
    	var target = new THREE.Vector3();
    	var camView = camera.getWorldDirection( target );
	  	var offset = camView.z >= 0 ? 180 : -0;

    	var lon = Math.degrees( Math.atan( camView.x/camView.z ) ) + offset;

    	lon = lon > 0 ? 360 - lon : - lon;

    	if ( ( lon - sp + 360 )%360 > fov && ( lon - sp + 360 )%360 <= 180 ) return -1; 
    	else if ( ( lon - sp + 360 )%360 > 180 && ( lon - sp + 360 )%360 <= 360 - fov ) return 1;
    	else return 0;
    }

//************************************************************************************
// Public Signer Getters
//************************************************************************************
	this.getSignerSize = function()
	{
		return signerSize;
	}

	this.getSignerEnabled = function()
	{
		return signEnabled;
	};

	this.getSignerPosition = function()
	{
		var position = {
			x: signPosX,
			y: signPosY
		};

		return position;
	};

	this.getSignerIndicator = function()
	{
		return subtitleIndicator;
	};

	this.getSignerArea = function()
	{
		return signArea;
	};

	this.getSignerLanguage = function()
	{
		return signLang;
	};

    this.getSignerLanguagesArray = function()
    {
        return signAvailableLang;
    }; 

    this.getSLConfig = function()
    {
    	return {
    		enabled: signEnabled,
    		lang: signLang,
    		position: this.getSignerPosition(),
    		indicator: subtitleIndicator,
    		area: signArea
    	};
    };


//************************************************************************************
// Private Subtitle Setters
//************************************************************************************

	function setSubtitleSLConfig(newConfig)
	{
		subSLConfig = newConfig;
	}

//************************************************************************************
// Public Signer Setters
//************************************************************************************

    this.setSLConfig = function(conf)
    {
    	//signEnabled = conf.enabled;

    	//signLang = getSLAvailableLang( conf.sllanguage );
    	signLang = conf.sllanguage;
    	signPosX = conf.stposition == 'left' ? -1 : 1;
		signPosY = -1;
    	subtitleIndicator = conf.indicator;
    	signArea = conf.safearea == 'L' ? 70 : conf.safearea == 'M' ? 60 : 50;
    	signerSize	= conf.slsize == 'L' ? 20 : conf.slsize == 'M' ? 18 : 16;
    };

	this.setSignerPosition = function(x, y)
	{
		signPosX = x;
		signPosY = y;
		updateSignerPosition();
	};	

	this.setSignerSize = function(size)
	{
		signerSize = size;
		if ( scene.getObjectByName("sign") )
		{
			scene.getObjectByName("sign").scale.set(signerSize/20, signerSize/20, 1);
		}
		if ( subtitleSLMesh ) removeSLSubtitle();
		//updateSignerPosition();
	};	

	this.setSignerArea = function(size)
	{
		signArea = size;
		updateSignerPosition();
		createSubAreaHelper( size );
	};

	this.setSignerIndicator = function(ind)
	{
		subtitleIndicator = ind;
		if ( subtitleIndicator == 'arrow' && scene.getObjectByName("backgroundSL") ) scene.getObjectByName("backgroundSL").visible = true;
		else if ( scene.getObjectByName("backgroundSL") ) 
		{
			scene.getObjectByName("backgroundSL").visible = false;
			scene.getObjectByName("rightSL").visible = false;
			scene.getObjectByName("leftSL").visible = false;
		}
		updateSignerPosition();
	};


	this.setSignerContent = function(url, lang)
	{
		signerContent = url;
		signLang = lang;
		if ( signEnabled ) createSigner();
	};	

	this.setSignerLanguagesArray = function(subList)
    {
        signAvailableLang = [];

        if ( subList['en'] ) 
        {
            signAvailableLang.push(
            {
                name: 'signerEngButton', 
                value: 'en', 
                default: ( 'en' == signLang )
            } );
        }
        if ( subList['de'] ) 
        {
            signAvailableLang.push(
            {
                name: 'signerGerButton', 
                value: 'de', 
                default: ( 'de' == signLang )
            } );
        }
        if ( subList['es'] ) 
        {
            signAvailableLang.push(
            {
                name: 'signerEspButton', 
                value: 'es', 
                default: ( 'es' == signLang )
            } );
        }
        if ( subList['ca'] ) 
        {
            signAvailableLang.push(
            {
                name: 'signerCatButton', 
                value: 'ca', 
                default: ( 'ca' == signLang )
            } );
        }
    };


    this.setSignerAutoHide = function(enabled)
    {
    	signAutoHide = enabled;
    }

//************************************************************************************
// Public Signer Checkers
//************************************************************************************

	this.checkSignEnabled = function(x)
	{
		return x == signEnabled;
	};

	this.checkSignPosition = function(x)
	{
		return x == signPosX;
	};

	this.checkSignSize = function(x)
	{
		return x == signerSize;
	};

	this.checkSignIndicator = function(x)
	{
		return x == subtitleIndicator;
	};

	this.checkSignLanguage = function(x)
	{
		//return x == signLang;
		return x == _iconf.sllanguage;
	};

	this.checkSignArea = function(x)
	{
		return x == signArea;
	};	

	this.checkisSignAvailable = function(lang){
		if ( !lang && list_contents[demoId].acces[0].SL ) lang = list_contents[demoId].acces[0].SL[0];
		return (list_contents[demoId].acces && list_contents[demoId].acces[0].SL && list_contents[demoId].acces[0].SL.includes((lang) ? lang : _iconf.sllanguage));
	};

	this.checksignAutoHide = function(x)
	{
		return x == signAutoHide;
	};

	this.checkAvailableDynamic = function()
	{
		return imsc1doc_SL ? true : false;
	}

//************************************************************************************
// Public functions
//************************************************************************************


	this.updateSLByTime = function(time)
	{
		this.swichtSL( getNonContSLMeta(time) );
	};

	this.initSigner = function(fov, x, y, ind)
	{
		signArea = fov;
		signPosX = x;
		signPosY = y;
		subtitleIndicator = ind;
	};

	
	this.enableAutoPositioning = function()
	{
		autoPositioning = true;
	};

	this.disableAutoPositioning = function()
	{
		autoPositioning = false;
	};

	this.switchSigner = function(enable){
		signEnabled = enable;
		enable ? createSigner() : removeSignVideo();

		if(enable){
			if (subtitleIndicator.localeCompare('arrow') == 0){
				if(scene.getObjectByName('backgroundSL')) scene.getObjectByName('backgroundSL').visible = !subtitleEnabled;
			}
		}	
	};

	this.disableSigner = function(){
		removeSignVideo();
		signEnabled = false;
	}

    this.setExperimental = function(exp)
    {
    	isExperimental = exp;
    };

    this.removeSignVideoByPeriod = function()
    {
    	removeSignVideo();
    }

    this.updateSLRotation = function()
    {
    	if ( signerMesh ) signerMesh.rotation.z = -camera.rotation.z;
    	if ( signerMesh && subtitleSLMesh ) subtitleSLMesh.rotation.z = -camera.rotation.z;
    }


///////////////////////////////////////////////////////////////////////////////////

    this.swichtSL = function(enable)
    {
    	if ( signerMesh )
    	{
    		signerMesh.visible = enable;
    	}
    }

    function getNonContSLMeta(time)
    {
    	var SLstate = false;
    	SLTImes.forEach( function( elem ) {
    		if ( elem.time >= time ) return SLstate;
    		else SLstate = (elem.state == 'on') ? true : false;
    	});
    	return SLstate;
    }

   	this.getSLAvailableLang = function(lang)
   	{
   		if ( list_contents[demoId].signer[0][lang] ) return lang;
   		else if ( list_contents[demoId].acces[0].SL && list_contents[demoId].signer[0][list_contents[demoId].acces[0].SL[0]] ) {
   			_iconf.sllanguage = list_contents[demoId].acces[0].SL[0];
   			return list_contents[demoId].acces[0].SL[0];
   		}
   		else return;
   	}

};