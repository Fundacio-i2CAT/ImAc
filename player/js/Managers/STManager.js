
STManager = function() {

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

	// [ST] subtitle vars 
	var subtitleEnabled = false; // boolean
	var subPosX = 0; // start = left = -1, center = 0, end = right = 1 
	var subPosY = -1; // before = top = 1, center = 0, after = bottom = -1 
	var subtitleIndicator = 'none'; // none, arrow, radar, move
	var subSize = 1; // small = 0.6, medium = 0.8, large = 1
	var subLang = 'en'; // string (en, de, ca, es)
	var subBackground = 0.5; // semi-transparent = 0.5, outline = 0
	var subEasy = false; // boolean
	var subArea = 70; // small = 50, medium = 60, large = 70
	var subAvailableLang = []; // Array { name, value, default:bool }


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

	function arrowInteraction()
	{
		// cada 300 milis aprox
		if ( scene.getObjectByName("right") ) {

			scene.getObjectByName("right").material.opacity = scene.getObjectByName("right").material.opacity == 1 ? 0.4 : 1;
		}
		
		if ( scene.getObjectByName("left") ) {

			scene.getObjectByName("left").material.opacity = scene.getObjectByName("left").material.opacity == 1 ? 0.4 : 1;
		}
	}

	function generateSTConf(isdImac=0, isdImacY=0)
	{
		var offset = 0;
		var stsizeajust = 1;
		if ( !_SLsubtitles && signEnabled )
		{
			subArea = signArea;
			offset = -signPosX*0.8 * signerSize/2;
			stsizeajust = 0.8;
		}

		var latitud = subPosY == 1 ? 30 * subArea/100 : -30 * subArea/100; 
  		var posY = _isHMD && !isExperimental ? 80 * Math.sin( Math.radians( latitud ) ) : 135 * Math.sin( Math.radians( latitud ) );
  		var subAjust = _isHMD ? 1 : 0.97;
  		var posZ = 75;
  		var esaySizeAjust = subEasy ? 1.25 : 1;

  		subConfig = {
	        subtitleIndicator: subtitleIndicator,
	        size: subSize * subAjust * esaySizeAjust * stsizeajust,
	        area: subArea/130,
	        opacity: subBackground,
	        x: subPosX * subSize * subAjust * esaySizeAjust,
	        y: posY * 9/16,
	        z: posZ,
	        lon: -isdImac,
	        lat: isdImacY,
	        offset: offset
	    };
	}

	function print3DText(isdContent, isdImac, isdImacY) 
	{
		// This is called in updateISD function;	
		//generateSTConf( isdImac, isdImacY );

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

	    	if ( textList.length > 0 && ( textListMemory.length == 0 || textListMemory.length > 0 && textList[0].text != textListMemory[0].text || textList.length != textListMemory.length ) ) 
	    	{
	      		removeSubtitle();

			    isExperimental ? createExpSubtitle( textList, subConfig ) : createSubtitle( textList, subConfig );

	      		textListMemory = textList;     
	    	} 
	    	//if ( signAutoHide ) subController.swichtSL(true);  
		    setSubtitleConfig(subConfig);
	  	}
	  	else 
	  	{
	  		//if ( signAutoHide ) subController.swichtSL(false);
	    	textListMemory = [];
	    	removeSubtitle();
	    	_rdr.hideRadarIndicator();
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
		//AplicationManager.disableVR();
		radarAutoPositioning = false;

		var a = new THREE.Euler( 0, Math.radians(-isdImac), 0, 'XYZ' );
		camera.quaternion.setFromEuler( a );
	}	

    function createSubtitle(textList, config)
    {
        subtitleMesh = !_fixedST ? _moData.getEmojiSubtitleMesh( textList, config ) : _moData.getExpEmojiSubtitleMesh( textList, config );
        subtitleMesh.name = "subtitles";

        // check zoom
        if ( !_fixedST && camera.fov < 60 )
        {
        	subtitleMesh.scale.set( subtitleMesh.scale.x * 0.5, subtitleMesh.scale.y * 0.5, 1)

        	if ( camera.fov < 30 )
	        {
	        	subtitleMesh.scale.set( subtitleMesh.scale.x * 0.5, subtitleMesh.scale.y * 0.5, 1)
	        }
        }

        _fixedST ? scene.add( subtitleMesh ) : camera.add( subtitleMesh );
    }

    function createExpSubtitle(textList, config)
    {
    	subtitleMesh = _moData.getExpSubtitleMesh( textList, config );

        scene.add( subtitleMesh );
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

//************************************************************************************
// Media Object Position Controller 
//************************************************************************************

    function changeSubtitleIndicator(pos)
    {
        if ( subtitleMesh )
        {
        	if ( scene.getObjectByName("right") ) {

				scene.getObjectByName("right").visible = pos == 'right' ? true : false;
			}
			
			if ( scene.getObjectByName("left") ) {

				scene.getObjectByName("left").visible = pos == 'left' ? true : false;
			}
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
		if ( !subConfig ) generateSTConf( 0, 0 );
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
    	//subtitleEnabled = conf.enabled;
    	//subLang = getSTAvailableLang( conf.stlanguage );
    	subLang = conf.stlanguage;
    	subPosX = 0;
		subPosY = conf.stposition == 'down' ? -1 : 1;
    	subtitleIndicator = conf.indicator;
    	subArea	=conf.safearea == 'L' ? 70 : conf.safearea == 'M' ? 60 : 50;
    	subSize	= conf.stsize == 'L' ? 1 : conf.stsize == 'M' ? 0.8 : 0.6;
    	subEasy = conf.ste2r == 'on' ? true: false;
    	subBackground = conf.stbackground == 'box' ? 0.5 : 0;
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

			////////////////////////////////////////////////////////////////
			/*
				var lineCount = 2;
				var charWidth = 45;

				var RS = new responsiveSubs(imsc1doc);
				RS.IMSCtoWords();
				RS.blockSubsBySpeaker(" ");
				RS.splitSubsByLPL(charWidth); // numero de caracters per linea
				RS.blockSubsBySpeaker("\n",lineCount); // numero de linees
				
				imsc1doc = RS.toIMSC(fontSize=110);*/
			/////////////////////////////////////////////////////////////////////
		
	        }
	        else if ( r.readyState === 4 ) 
	        {
	        	console.error('Status = ' + r.status + ' xml = ' + xml);
	        }
	    };
	    r.send();
	};

	this.setSLSubtitle = function(xml, lang)
	{
		signLang = lang;
		var r = new XMLHttpRequest();

	  	r.open( "GET", xml );
	    r.onreadystatechange = function () 
	    {
	        if ( r.readyState === 4 && r.status === 200 ) 
	        {
	            imsc1doc_SL = imsc.fromXML( r.responseText );
	            console.log(imsc1doc_SL)	
	        }
	        else if ( r.readyState === 4 ) 
	        {
	        	console.error('Status = ' + r.status + ' xml = ' + xml);
	        }
	    };
	    r.send();
	};

	this.setSubIndicator = function(ind, childColumnOpt){
		if(subtitleIndicator.localeCompare(ind) != 0){
			subtitleIndicator = ind;
            SettingsOptionCtrl.setChildColumnActiveOpt(childColumnOpt);

			switch(ind){
				case 'none':
					if ( signEnabled) {
						if ( !imsc1doc_SL ) scene.getObjectByName("backgroundSL").visible = false;
						scene.getObjectByName("rightSL").visible = false;
						scene.getObjectByName("leftSL").visible = false;
					}
					_rdr.hideRadar();
					break;

				case 'arrow':
					_rdr.hideRadar();
					if(subtitleEnabled){
						if(scene.getObjectByName('backgroundSL')) scene.getObjectByName('backgroundSL').visible = false;
					} else {
						if ( signEnabled && !imsc1doc_SL){
							scene.getObjectByName('backgroundSL').visible = true;
						} 
					}
					
					break;

				case 'radar':
					_rdr.showRadar();
					if ( signEnabled) {
						if ( !imsc1doc_SL ) scene.getObjectByName("backgroundSL").visible = false;
						scene.getObjectByName("rightSL").visible = false;
						scene.getObjectByName("leftSL").visible = false;
					}
					
					break;
			}

			if(subtitleEnabled || signEnabled){
				textListMemory = [];
				updateISD( VideoController.getMediaTime() );
			}
		}	
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

		signArea = size;
		updateSignerPosition();

		createSubAreaHelper( size );

		updateISD( VideoController.getMediaTime() );
		//updateRadarPosition();
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
// Public Subtitle Checkers
//************************************************************************************

	this.checkSubtitleEnabled = function(x)
	{
		return x == subtitleEnabled;
	};

	this.checkSubPosition = function(x)
	{
		if ( _fixedST ) {
			if ( !isExperimental ) return x == 0 ? true : false;
			else return x == 3 ? true : false;
		}
		else return x == subPosY;
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
		//return x == subLang;
		return x == _iconf.stlanguage;
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

	this.checkisSubAvailable = function(lang){
		if ( !lang && list_contents[demoId].acces[0].ST ) lang = list_contents[demoId].acces[0].ST[0];
		return (list_contents[demoId].acces && list_contents[demoId].acces[0].ST && list_contents[demoId].acces[0].ST.includes((lang) ? lang : _iconf.stlanguage));
	};

	this.checkSubEasyAvailable = function(lang)
	{
		return (list_contents[demoId].subtitles && list_contents[demoId].subtitles[1] && list_contents[demoId].subtitles[1][lang]);
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

	this.enableSubtitles = function()
	{
		subtitleEnabled = true;
	};

	this.disableSubtiles = function()
	{
		removeSubtitle();
		_rdr.hideRadar();
		subtitleEnabled = false;
	};

	this.switchSubtitles = function(enable){
		if ( !enable ){
			removeSubtitle();
			//_rdr.hideRadar();
			if (subtitleIndicator.localeCompare('arrow') == 0 && signEnabled){
				if(scene.getObjectByName('backgroundSL')) scene.getObjectByName('backgroundSL').visible = true;
			}
		} else {
			if (subtitleIndicator.localeCompare('radar') == 0){
				_rdr.showRadar();
			}
			if(signEnabled){
				if(scene.getObjectByName('backgroundSL')) scene.getObjectByName('backgroundSL').visible = false;
			}
		}

		if (signEnabled && scene.getObjectByName("rightSL")){
			scene.getObjectByName("rightSL").visible = false;
			scene.getObjectByName("leftSL").visible = false;
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

	this.switchSigner = function(enable){
		signEnabled = enable;
		enable ? createSigner() : removeSignVideo();

		if(enable){
			if (subtitleIndicator.localeCompare('arrow') == 0){
				if(scene.getObjectByName('backgroundSL')) scene.getObjectByName('backgroundSL').visible = !subtitleEnabled;
			}
		}	
	};

    this.setExperimental = function(exp)
    {
    	isExperimental = exp;
    };
    
    this.updateSTRotation = function()
    {
    	if ( subtitleMesh && !isExperimental && !_fixedST ) subtitleMesh.rotation.z = -camera.rotation.z;
    }

///////////////////////////////////////////////////////////////////////////////////


    this.changeSTmode = function(mode)
    {
    	removeSubtitle();

    	if ( mode == 0 ) 
    	{
    		_fixedST = false;
    		isExperimental = false;
    	}
    	else if ( mode == 1 )
    	{
    		_fixedST = true;
    		isExperimental = false;
    	}
    	else {
    		_fixedST = true;
    		isExperimental = true;
    	}

    	textListMemory = [];

		updateISD( VideoController.getMediaTime() );
    }

    this.getSTAvailableLang = function(lang, e2r=0)
   	{
   		if ( list_contents[demoId].subtitles[e2r][lang] ) 
   		{
   			return lang;
   		}
   		else if ( list_contents[demoId].acces[0].ST && list_contents[demoId].subtitles[e2r][list_contents[demoId].acces[0].ST[0]] ) {
   			_iconf.stlanguage = list_contents[demoId].acces[0].ST[0];
   			return list_contents[demoId].acces[0].ST[0];
   		}
   		else return;
   	}

};