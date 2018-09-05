/**
 * @author isaac.fraile@i2cat.net
 */

 // This library needs to use the THREE.MediaObject and imsc_i2cat.js functions

SubSignManager = function() {

	var imsc1doc;

	var textListMemory = [];

	var viewArea = 50;
	var autoPositioning = false;

	// [ST] subtitle vars 
	var subtitleEnabled = false;
	var subPosX = 0; // start = left = -1, center = 0, end = right = 1 
	var subPosY = -1; // before = top = 1, center = 0, after = bottom = -1 
	var subtitleIndicator = 'none'; // none, arrow, compass, move
	var subSize = 1; // small = 0.6, medium = 0.8, large = 1
	var subLang; // TODO - string (Eng, De, Cat, Esp)
	var subBackground = 0.8; // TODO - (semi-transparent, outline)
	var subEasy = false; // TODO - boolean
	var subArea = 50; // small = 50, medium = 60, large = 70

	// [SL] signer vars
	var signEnabled = false;
	var signPosX = 1; // left = -1, center = 0, right = 1
	var signPosY = -1; // bottom = -1, center = 0, top = 1
	var signIndicator = 'none';	 // none, arrow, move (forced prespective)
	var signArea; // small = 50, medium = 60, large = 70


//************************************************************************************
// Private Functions
//************************************************************************************

	function updateISD(offset)
	{
		var isd = imsc.generateISD( imsc1doc, offset );

		if ( isd.contents.length > 0 ) 
	  	{
	  		if ( autoPositioning ) changePositioning( isd.imac );
	    	if ( subtitleEnabled ) print3DText( isd.contents[0] );

	    	checkSpeakerPosition( isd.imac );
	  	}
	}

	function print3DText(isdContent) 
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
	          			text: isdContentText[i].contents[0].text,
	          			color: adaptRGBA( isdContentText[i].contents[0].styleAttrs['http://www.w3.org/ns/ttml#styling color'] ),
	          			backgroundColor: adaptRGBA( isdContentText[i].contents[0].styleAttrs['http://www.w3.org/ns/ttml#styling backgroundColor'] )
	        		};

	        		textList.push( isdTextObject );
	      		}
	    	}

	    	if ( textList.length > 0 && ( textListMemory.length == 0 || textListMemory.length > 0 && textList[0].text != textListMemory[0].text ) ) 
	    	{
	      		moData.removeSubtitle();

	      		var latitud = subPosY == 1 ? 30 * subArea/100 : -30 * subArea/100; 
	      		var posY = _isHMD ? 80 * Math.sin( Math.radians( latitud ) ) : 69 * Math.sin( Math.radians( latitud ) );
	      		var subAjust = _isHMD ? 1 : 0.45;
	      		var posZ = _isHMD ? 75 : 38;

	      		var conf = {
			        subtitleIndicator: subtitleIndicator,
			        displayAlign: subPosY,
			        textAlign: subPosX,
			        size: subSize * subAjust,
			        area: subArea/130,
			        opacity: subBackground,
			        x: 0,
			        y: posY * 9/16,
			        z: posZ
			    };

	      		moData.createSubtitle( textList, conf );

	      		textListMemory = textList;     
	    	}   
	  	}
	  	else 
	  	{
	    	textListMemory = [];
	    	moData.removeSubtitle();
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

			signIndicator != 'move' ? moData.changeSignIndicator( position ) : moData.changeSignPosition( position );
		}
	}

	function checkSubtitleIdicator(position)
	{
		if ( subtitleIndicator != 'none' ) 
		{
			subtitleIndicator != 'move' ? moData.changeSubtitleIndicator( position ) : textListMemory = [];
		}  	
	}

	function checkSpeakerPosition(isdImac)
	{
		var difPosition = getViewDifPosition( isdImac );
	  	var position;

	  	if ( difPosition < camera.fov && difPosition > -camera.fov ) 
	  	{
	  		position = 'center';
	  	}
	  	else
	  	{
	  		difPosition = difPosition < 0 ? difPosition + 360 : difPosition;

	    	position = ( difPosition > 0 && difPosition <= 180 ) ? 'left' : 'right';
	  	}

	  	checkSubtitleIdicator( position );
	    checkSignIdicator( position );	
	}

	function changePositioning(isdImac)
	{
		autoPositioning = false;
		var difPosition = Math.round(getViewDifPosition( isdImac ));
		var position;

	  	if ( difPosition <= 3  && difPosition >= -3 ) 
	  	{
	  		position = 0;
	  	}
	  	else
	  	{
	  		difPosition = difPosition < 0 ? difPosition + 360 : difPosition;

	    	position = ( difPosition > 0 && difPosition <= 180 ) ? -1 : 1;
	  	}
      	var rotaionValue = 0;
      	var initY = Math.round( CameraParentObject.rotation.y * (-180/Math.PI)%360 );

      	var rotationInterval = setInterval(function() 
      	{
      		var difff = isdImac - initY;
      		if ( difff > 180 ) difff -= 360;
      		if ( difff < 0 ) difff = -1*difff;
        	if ( position * rotaionValue >= difff || position == 0 ) 
        	{
        		clearInterval( rotationInterval );
        		autoPositioning = true;
        	}
        	else 
        	{
          		rotaionValue += position*3;
          		CameraParentObject.rotation.y = initY / ( -180 / Math.PI )%360 + rotaionValue * ( -Math.PI / 180 );
        	}
      	}, 30);
	}	

//************************************************************************************
// Utils
//************************************************************************************

	function adaptRGBA(rgb)
    {
    	return ( rgb && rgb.length === 4 ) ? "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")" : '';
	}

    function getViewDifPosition(sp)
    {
    	var target = new THREE.Vector3();
    	var camView = camera.getWorldDirection( target );
	  	var offset = camView.z >= 0 ? 180 : -0;

    	var lon = Math.degrees( Math.atan( camView.x/camView.z ) ) + offset;

    	//return lon >= 0 ? sp - lon : sp - ( lon + 360 );
    	return lon >= 0 ? 360 - sp - lon : - sp - lon;	
    }

//************************************************************************************
// Public Getters
//************************************************************************************

	this.getSubArea = function()
	{
		return subArea;
	};

	this.getSubPosition = function()
	{
		var position = {
			x: signPosX,
			y: signPosY
		};

		return position;
	};

	this.getSignerPosition = function()
	{
		var position = {
			x: signPosX,
			y: signPosX
		};

		return position;
	};

	this.getSubIndicator = function()
	{
		return subtitleIndicator;
	};

	this.getSignerIndicator = function()
	{
		return signIndicator;
	};

	this.getSubtitleEnabled = function()
	{
		return subtitleEnabled;
	};


//************************************************************************************
// Public Setters
//************************************************************************************

	this.setSubtitle = function(xml)
	{
		var r = new XMLHttpRequest();

	  	r.open( "GET", xml );
	    r.onreadystatechange = function () 
	    {
	        if ( r.readyState === 4 && r.status === 200 ) 
	        {
	            imsc1doc = imsc.fromXML( r.responseText );

	            var listVideoContent = moData.getListOfVideoContents();
	  
				listVideoContent[0].vid.ontimeupdate = function() 
				{
				    updateISD( listVideoContent[0].vid.currentTime );

		    		if(scene.getObjectByName("timeline"))
					{
						var total = moData.getListOfVideoContents()[0].vid.duration;
						var current  = moData.getListOfVideoContents()[0].vid.currentTime;
						var w = scene.getObjectByName("bgTimeline").geometry.parameters.width;
						secMMgr.scaleTimeLine(total,current, w, scene.getObjectByName("currentTimeline"), scene.getObjectByName("bgTimeline"));
						scene.getObjectByName("timeline").visible = true;
						scene.getObjectByName("playoutTime").remove(scene.getObjectByName("currentTime"));		
					}
				};
	        }
	    };
	    r.send();
	};

	this.setSubArea = function(size)
	{
		subArea = size;
		textListMemory = [];
	};

	this.setSubSize = function(size)
	{
		subSize = size;
		textListMemory = [];
	};

	this.setSubBackground = function(background)
	{
		subBackground = background;
		textListMemory = [];
	};

	this.setSubEasy = function(easy)
	{
		subEasy = easy;
	};

	this.setSubPosition = function(x, y)
	{
		subPosX = x;
		subPosY = y;
		textListMemory = [];
	};

	this.setSignerPosition = function(x, y)
	{
		signPosX = x;
		signPosY = y;
	};

	this.setSubIndicator = function(ind)
	{
		subtitleIndicator = ind;
		textListMemory = [];
	};


//************************************************************************************
// Public functions
//************************************************************************************

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
		moData.removeSubtitle();
		subtitleEnabled = false;
	};

	this.switchSubtitles = function(enable)
	{
		if ( !enable ) moData.removeSubtitle();
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
}