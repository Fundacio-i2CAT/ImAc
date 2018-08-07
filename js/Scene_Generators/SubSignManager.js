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
	var subSize; // TODO - string (small, medium, large)
	var subLang; // TODO - string (Eng, De, Cat, Esp)
	var subBackground; // TODO - (semi-transparent, outline)
	var subEasy; // TODO - boolean
	var subArea; // TODO - viewArea (small, medium, large)

	// [SL] signer vars
	var signEnabled = false;
	var signPosX = 1; // left = -1, center = 0, right = 1
	var signPosY = -1; // bottom = -1, center = 0, top = 1
	var signIndicator = 'none';	 // none, arrow, move (forced prespective)
	var signArea; // TODO - viewArea (small, medium, large)


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

	      		var latitud = subPosY == 1 ? 30 * viewArea/100 : -30 * viewArea/100; 
	      		var posY = Math.sin( Math.radians( latitud ) );

	      		var conf = {
			        subtitleIndicator: subtitleIndicator,
			        displayAlign: subPosY,
			        textAlign: subPosX,
			        size: 0.008 * viewArea, //modificar si se quiere cambiar el tamaño de los subtitulos (siempre conservar la relacion con el viewArea)
			        x: 0,
			        y: posY * 80 * 9/16,
			        z: 1 * 80
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
      	var rotaionValue = 0;
      	var rotationInterval = setInterval(function() 
      	{
        	if ( rotaionValue >= isdImac ) 
        	{
        		clearInterval( rotationInterval );
        	}
        	else 
        	{
          		rotaionValue += 3;
          		CameraPatherObject.rotation.y = rotaionValue * ( Math.PI / 180 );
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

	this.getSize = function()
	{
		return viewArea;
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
				};
	        }
	    };
	    r.send();
	};

	this.setSize = function(size)
	{
		viewArea = size;
		textListMemory = [];
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
		viewArea = fov;
		subPosX = x;
		subPosY = y;
		subtitleIndicator = ind;
		textListMemory = [];
	};

	this.initSigner = function(fov, x, y, ind)
	{
		viewArea = fov;
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

	this.enableAutoPositioning = function()
	{
		autoPositioning = true;
	};

	this.disableAutoPositioning = function()
	{
		autoPositioning = false;
	};
}