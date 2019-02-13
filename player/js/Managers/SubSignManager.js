/**
 * @author isaac.fraile@i2cat.net
 */

/************************************************************************************
	
	SubSignManager.js  
		* Library used to manage Subtitle and Signer elements

	This library needs to use external libs:
		* MediaObjectData.js         -->  To create the subtilte, signer and radar meshs
		* AplicationManager.js       -->  To enable the VR when autopositioning ends
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
		* Getters of all subtitle [ST] and signer [SL] attributes
		* Setters of all subtitle [ST] and signer [SL] attributes
		* Checkers of all subtitle [ST] and signer [SL] attributes
		* enableSubtitles / disableSubtiles
		* enableAutoPositioning / disableAutoPositioning
		* updateSubtitleByTime = function( time )    --> Update the subtiltes using a 'time' in secongs such as currentTime
		* initSubtitle = function( fov, x, y, ind )  --> Initialize subtitle attr ( Area, position.x, position.y, indicator )
		* initSigner = function( fov, x, y, ind )    --> Initialize signer attr ( Area, position.x, position.y, indicator )
		* switchSubtitles = function( enable )       --> Enable or disable the subtitles using the boolean 'enable'
		* switchSigner = function( enable )          --> Enable or disable the signer using the boolean 'enable'
		* updateRadar = function()                   --> Update the radar orientation using the camera orientation

************************************************************************************/

SubSignManager = function() {

	var imsc1doc;

	var textListMemory = [];
	var autoPositioning = false;
	var radarAutoPositioning = false;

	var subtitleMesh;
	var signerMesh;
	var radarMesh;
	var speakerMesh;

	var areaMesh;
	var isExperimental = false;
	var autoHMD = false;

	var subConfig;

	// [ST] subtitle vars 
	var subtitleEnabled = false; // boolean
	var subPosX = 0; // start = left = -1, center = 0, end = right = 1 
	var subPosY = -1; // before = top = 1, center = 0, after = bottom = -1 
	var subtitleIndicator = 'none'; // none, arrow, radar, move
	var subSize = 1; // small = 0.6, medium = 0.8, large = 1
	var subLang; // string (en, de, ca, es)
	var subBackground = 0.5; // semi-transparent = 0.5, outline = 0
	var subEasy = false; // boolean
	var subArea = 70; // small = 50, medium = 60, large = 70
	var subAvailableLang = []; // Array { name, value, default:bool }

	// [SL] signer vars
	var signerContent; // URL
	var signEnabled = false; // boolean
	var signPosX = 1; // left = -1, center = 0, right = 1
	var signPosY = -1; // bottom = -1, center = 0, top = 1
	var signIndicator = 'none';	 // none, arrow, move
	var signArea = 60; // small = 50, medium = 60, large = 70
	var signLang; // string (en, de, ca, es)
	var signAvailableLang = []; // Array { name, value, default:bool }
	var signerSize = 20;


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
		  		if ( autoPositioning ) changePositioning( isd.imac );
		  		if ( radarAutoPositioning ) changeSimplePositioning( isd.imac );
		    	if ( subtitleEnabled ) print3DText( isd.contents[0], isd.imac );

		    	checkSpeakerPosition( isd.imac );
		  	}
		  	else if ( textListMemory.length > 0 )
		  	{
		    	textListMemory = [];
		    	removeSubtitle();
		    	removeSpeakerRadar();
		  	}
		}
	}

	function print3DText(isdContent, isdImac) 
	{
		var latitud = subPosY == 1 ? 30 * subArea/100 : -30 * subArea/100; 
  		var posY = _isHMD && !isExperimental ? 80 * Math.sin( Math.radians( latitud ) ) : 135 * Math.sin( Math.radians( latitud ) );
  		var subAjust = _isHMD ? 1 : 0.97;
  		var posZ = 75;
  		var esaySizeAjust = subEasy ? 1.25 : 1;

  		subConfig = {
	        subtitleIndicator: subtitleIndicator,
	        displayAlign: subPosY,
	        textAlign: subPosX,
	        size: subSize * subAjust * esaySizeAjust,
	        area: subArea/130,
	        opacity: subBackground,
	        x: 0,
	        y: posY * 9/16,
	        z: posZ
	    };

	  	if ( isdContent.contents.length > 0 )
	  	{
	    	var isdContentText = isdContent.contents[0].contents[0].contents[0].contents;
	    	var textList = [];

	    	for ( var i = 0, l = isdContentText.length; i < l; ++i )
	    	{
	      		if ( isdContentText[i].kind == 'span' && isdContentText[i].contents )
	      		{
	        		var isdTextObject = {
	          			text: isdContentText[i].contents[0].text,
	          			color: adaptRGBA( isdContentText[i].contents[0].styleAttrs['http://www.w3.org/ns/ttml#styling color'] ),
	          			backgroundColor: adaptRGBA( isdContentText[i].contents[0].styleAttrs['http://www.w3.org/ns/ttml#styling backgroundColor'] )
	        		};

	        		textList.push( isdTextObject );
	      		}
	    	}

	    	if ( textList.length > 0 && ( textListMemory.length == 0 || textListMemory.length > 0 && textList[0].text != textListMemory[0].text ) ) 
	    	{
	      		removeSubtitle();

			    //Save subtitle configuration for preview visualitzation. 

	      		//createSubtitle( textList, conf );
	      		isExperimental ? createExpSubtitle( textList, subConfig ) : createSubtitle( textList, subConfig );

	      		if ( subtitleIndicator == 'radar' ) createSpeakerRadar( textList[0].color, isdImac );

	      		textListMemory = textList;     
	    	}   
		    //setSubtitleConfig(subConfig);
	  	}
	  	else 
	  	{
	    	textListMemory = [];
	    	removeSubtitle();
	    	removeSpeakerRadar();
	  	}

	}

	function checkSignIdicator(position)
	{
		if ( signIndicator != 'none' ) 
		{
		  	if ( position == 'center' && signIndicator == 'move' ) 
		  	{
		  		position = signPosX == -1 ? 'left' : 'right';
		  	}
			signIndicator != 'move' ? changeSignIndicator( position ) : changeSignPosition( position );
		}
	}

	function checkSubtitleIdicator(position)
	{
		if ( subtitleIndicator != 'none' ) 
		{
			subtitleIndicator != 'move' ? changeSubtitleIndicator( position ) : textListMemory = [];
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
		radarAutoPositioning = false;

		var a = new THREE.Euler( 0, Math.radians(isdImac), 0, 'XYZ' );

		//CameraParentObject.quaternion.setFromEuler( a );
		camera.quaternion.setFromEuler( a );

		AplicationManager.enableVR();

		//setTimeout(function() {radarautopositioning = false;},500);
	}	

	function createSigner()
	{
	   	var posX = ( 1.48*signArea/2-signerSize/2 ) *signPosX;
	    var posY = ( 0.82*signArea/2-signerSize/2 ) *signPosY;
	    var posZ = 70;

		var conf = {
			size: signerSize, // signArea/100
			signIndicator: signIndicator,
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
		   	var posX = ( 1.48*signArea/2-signerSize/2 )*signPosX;
		    var posY = ( 0.82*signArea/2-signerSize/2 )*signPosY;
		    var posZ = 70;

		    scene.getObjectByName("sign").position.x = posX;
		    scene.getObjectByName("sign").position.y = posY;
		}
	}

    function createSubtitle(textList, config)
    {
        subtitleMesh = _moData.getSubtitleMesh( textList, config );
        subtitleMesh.name = "subtitles";

        camera.add( subtitleMesh );
    }

    function createExpSubtitle(textList, config)
    {
    	subtitleMesh = _moData.getExpSubtitleMesh( textList, config );

        scene.add( subtitleMesh );
    }

    function createSignVideo(url, name, config)
    {
    	removeSignVideo();

        signerMesh = _moData.getSignVideoMesh( url, name, config );
        camera.add( signerMesh );
    }

    function createRadar()
    {
    	if ( radarMesh ) removeRadar();
    	radarMesh = _moData.getRadarMesh();

    	radarMesh.onexecute = function() {
console.error('radar auto positioning')
			if ( !_isHMD ) radarAutoPositioning = true;
    	}

    	interController.addInteractiveRadar( radarMesh )
    	camera.add( radarMesh );
    }

    function createSpeakerRadar(color, pos)
    {
    	if ( !radarMesh ) createRadar();

    	if ( pos != undefined && speakerMesh )
        {
            speakerMesh.rotation.z = Math.radians( 360-pos );
            speakerMesh.material.color.set( color ); 
        }
        else if ( pos != undefined ) 
        {
            speakerMesh = _moData.getSpeakerRadarMesh( color, pos );
            camera.add( speakerMesh );
        }
        else removeSpeakerRadar();
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
        isExperimental ? scene.remove( subtitleMesh ) : camera.remove( subtitleMesh );
        subtitleMesh = undefined;
    }

    function removeSignVideo()
    {
        if ( signerMesh ) 
        {
            VideoController.removeContentById( signerMesh.name );
            camera.remove( signerMesh );
            signerMesh = undefined;
        }

    }

    function removeRadar()
    {
    	interController.removeInteractiveRadar( radarMesh )
    	removeSpeakerRadar();
    	camera.remove( radarMesh );
    	radarMesh = undefined;
    }

    function removeSpeakerRadar()
    {
    	camera.remove( speakerMesh );
    	speakerMesh = undefined;
    }

//************************************************************************************
// Media Object Position Controller 
//************************************************************************************

    function changeSubtitleIndicator(pos)
    {
        if ( subtitleMesh )
        {
        	subtitleMesh.children.forEach( function( elem ) 
        	{ 
        		elem.children.forEach( function( e ) 
        		{
        			if ( e.name == 'left' ) e.visible = pos == 'left' ? true : false;
                    else if ( e.name == 'right' ) e.visible = pos == 'right' ? true : false;
                }); 
        	}); 
        }
    }

    function changeSignIndicator(pos)
    {
        if ( signerMesh )
        {
        	signerMesh.children.forEach( function( e ) 
        	{
        		if ( e.name == 'left' ) e.visible = pos == 'left' ? true : false;
                else if ( e.name == 'right' ) e.visible = pos == 'right' ? true : false;
            }); 
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
// Public Subtitle Getters
//************************************************************************************
	this.getSubtitleConfig = function()
	{
		return subConfig;
	}

	this.getSubtitleEnabled = function()
	{
		return subtitleEnabled;
	};

	this.getSubPosition = function()
	{
		var position = {
			x: subPosX,
			y: subPosY
		};

		return position;
	};

	this.getSubIndicator = function()
	{
		return subtitleIndicator;
	};

	this.getSubSize = function()
	{
		return subSize;
	};

	this.getSubLanguage = function()
	{
		return subLang;
	};

	this.getSubBackground = function()
	{
		return subBackground;
	};

	this.getSubEasy = function()
	{
		return subEasy;
	};

	this.getSubArea = function()
	{
		return subArea;
	};	

	this.getSubtitlesLanguagesArray = function()
    {
        return subAvailableLang;
    };

    this.getSTConfig = function()
    {
    	return {
    		enabled: subtitleEnabled,
    		lang: subLang,
    		position: this.getSubPosition(),
    		indicator: subtitleIndicator,
    		area: subArea,
    		size: subSize,
    		easy: subEasy,
    		background: subBackground
    	};
    };

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
		return signIndicator;
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
    		indicator: signIndicator,
    		area: signArea
    	};
    };

//************************************************************************************
// Private Subtitle Setters
//************************************************************************************
	function setSubtitleConfig(newConfig)
	{
		subConfig = newConfig;
	}

//************************************************************************************
// Public Subtitle Setters
//************************************************************************************

	this.setSTConfig = function(conf)
    {
    	subtitleEnabled = conf.enabled;
    	subLang = conf.lang;
    	subPosX = conf.position.x;
		subPosY = conf.position.y;
    	subtitleIndicator = conf.indicator;
    	subArea	= conf.area;
    	subSize	= conf.size;
    	subEasy = conf.easy;
    	subBackground = conf.background;
    };

	this.setSubtitle = function(xml, lang)
	{
		subLang = lang;
		var r = new XMLHttpRequest();

	  	r.open( "GET", xml );
	    r.onreadystatechange = function () 
	    {
	        if ( r.readyState === 4 && r.status === 200 ) 
	        {
	            imsc1doc = imsc.fromXML( r.responseText );
	        }
	        else if ( r.readyState === 4 ) 
	        {
	        	console.error('Status = ' + r.status + ' xml = ' + xml);
	        }
	    };
	    r.send();
	};

	this.setSubIndicator = function(ind)
	{
		subtitleIndicator = ind;
		textListMemory = [];

		if ( ind != 'radar' ) removeRadar(); 

		updateISD( VideoController.getMediaTime() );
	};

	this.setSubSize = function(size)
	{
		subSize = size;
		textListMemory = [];

		updateISD( VideoController.getMediaTime() );
	};

	this.setSubBackground = function(background)
	{
		subBackground = background;
		textListMemory = [];

		updateISD( VideoController.getMediaTime() );
	};

	this.setSubEasy = function(easy, xml)
	{
		subEasy = easy;
		this.setSubtitle( xml, subLang );
		textListMemory = [];

		updateISD( VideoController.getMediaTime() );
	};

	this.setSubPosition = function(x, y)
	{
		subPosX = x;
		subPosY = y;
		textListMemory = [];

		updateISD( VideoController.getMediaTime() );
	};

	this.setSubArea = function(size)
	{
		subArea = size;
		textListMemory = [];

		createSubAreaHelper( size );

		updateISD( VideoController.getMediaTime() );
	};

	this.setSubtitleLanguagesArray = function(subList)
    {
        subAvailableLang = [];

        if ( subList['en'] ) 
        {
            subAvailableLang.push( 
            { 
                name: 'subtitlesEngButton', 
                value: 'en', 
                default: ( 'en' == subLang ) 
            } );
        }
        if ( subList['de'] ) 
        {
            subAvailableLang.push( 
            { 
                name: 'subtitlesGerButton', 
                value: 'de', 
                default: ( 'de' == subLang ) 
            } );
        }
        if ( subList['es'] ) 
        {
            subAvailableLang.push( 
            { 
                name: 'subtitlesEspButton', 
                value: 'es', 
                default: ( 'es' == subLang ) 
            } );
        }
        if ( subList['ca'] ) 
        {
            subAvailableLang.push( 
            { 
                name: 'subtitlesCatButton', 
                value: 'ca', 
                default: ( 'ca' == subLang ) 
            } );
        }
    };

//************************************************************************************
// Public Signer Setters
//************************************************************************************

	this.setSLConfig = function(conf)
    {
    	signEnabled = conf.enabled;
    	signLang = conf.lang;
    	signPosX = conf.position.x;
		signPosY = conf.position.y;
    	signIndicator = conf.indicator;
    	signArea = conf.area;
    };

	this.setSignerPosition = function(x, y)
	{
		signPosX = x;
		signPosY = y;
		updateSignerPosition();
	};	

	this.setSignerArea = function(size)
	{
		signArea = size;
		updateSignerPosition();
		createSubAreaHelper( size );
	};

	this.setSignerIndicator = function(ind)
	{
		signIndicator = ind;
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

//************************************************************************************
// Public Subtitle Checkers
//************************************************************************************

	this.checkSubtitleEnabled = function(x)
	{
		return x == subtitleEnabled;
	};

	this.checkSubPosition = function(x)
	{
		return x == subPosY;
	};

	this.checkSubIndicator = function(x)
	{
		return x == subtitleIndicator;
	};

	this.checkSubSize = function(x)
	{
		return x == subSize;
	};

	this.checkSubLanguage = function(x)
	{
		return x == subLang;
	};

	this.checkSubBackground = function(x)
	{
		return x == subBackground;
	};

	this.checkSubEasy = function(x)
	{
		return x == subEasy;
	};

	this.checkSubArea = function(x)
	{
		return x == subArea;
	};	

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

	this.checkSignIndicator = function(x)
	{
		return x == signIndicator;
	};

	this.checkSignLanguage = function(x)
	{
		return x == signLang;
	};

	this.checkSignArea = function(x)
	{
		return x == signArea;
	};	

//************************************************************************************
// Public functions
//************************************************************************************

	this.updateSubtitleByTime = function(time)
	{
		if ( imsc1doc ) updateISD( time );
	};

    this.initSubtitle = function(fov, x, y, ind)
	{
		subArea = fov;
		subPosX = x;
		subPosY = y;
		subtitleIndicator = ind;
		textListMemory = [];
	};

	this.initSigner = function(fov, x, y, ind)
	{
		signArea = fov;
		signPosX = x;
		signPosY = y;
		signIndicator = ind;
	};

	this.enableSubtitles = function()
	{
		subtitleEnabled = true;
	};

	this.disableSubtiles = function()
	{
		removeSubtitle();
		removeRadar();
		subtitleEnabled = false;
	};

	this.switchSubtitles = function(enable)
	{
		if ( !enable ) 
		{
			removeSubtitle();
			removeRadar();
		}
		subtitleEnabled = enable;
	}

	this.enableAutoPositioning = function()
	{
		autoPositioning = true;
	};

	this.disableAutoPositioning = function()
	{
		autoPositioning = false;
	};

	this.switchSigner = function(enable)
	{
		if ( signAvailableLang.length > 0 )
		{
			signEnabled = enable;
			enable ? createSigner() : removeSignVideo();
		}		
	};

	this.updateRadar = function()
    {
        if ( radarMesh ) 
        {
        	radarMesh.position.x = _isHMD ? 35 : 40
        	radarMesh.position.y = _isHMD ? -2 : -22

            var target = new THREE.Vector3();
            var camView = camera.getWorldDirection( target );
            var offset = camView.z >= 0 ? 180 : -0;

            var lon = Math.degrees( Math.atan( camView.x/camView.z ) ) + offset;

            radarMesh.rotation.z = Math.radians( lon );
        }
    };

    this.setExperimental = function(exp)
    {
    	isExperimental = exp;
    };

    this.removeSignVideoByPeriod = function()
    {
    	removeSignVideo();
    }

    this.updateSTRotation = function()
    {
    	if ( subtitleMesh ) subtitleMesh.rotation.z = -camera.rotation.z;
    }

}