/**
 * @author isaac.fraile@i2cat.net
 */

 // This library needs to use the THREE.MediaObject functions

SubSignManager = function() {

	var imsc1doc;

	var textListMemory = [];

	var viewArea = 30;
	var autoPositioning = false;

	// subtitle vars
	var subtitleEnabled = false;
	var subtitleAlign = "after"; // before, center, after
	var subtitleTextAlign = "center"; // start, center, end
	var subtitleIndicator = 'none'; // none, arrow, compass, move

	// sign vars
	var signEnabled = false;
	var signPosition= 'botRight'; // botRight, botLeft, topRight, topLeft
	var signIndicator = 'none';	 // none, arrow, move


	function checkSignIdicator(isdImac)
	{
	  	var difPosition = getViewDifPosition( isdImac );

	  	if (difPosition < camera.fov && difPosition > -camera.fov) 
	  	{
	  		signIndicator != 'move' ? changeSignIndicator( signMesh, 'center' ) : (signArea == 'topLeft' || signArea == 'botLeft') ? changeSignPosition( signMesh, 'left' ) : changeSignPosition( signMesh, 'right' );
	  	}
	  	else 
	  	{
		   	difPosition = difPosition < 0 ? difPosition + 360 : difPosition;

		   	if (difPosition > 0 && difPosition <= 180) 
		   	{
		   		signIndicator != 'move' ? changeSignIndicator( signMesh, 'left' ) : changeSignPosition( signMesh, 'left' );
		   	}
		   	else 
		   	{
		   		signIndicator != 'move' ? changeSignIndicator( 'right' ) : changeSignPosition( signMesh, 'right' );
		   	}
		}
	}

	function checkSubtitleIdicator(isdImac)
	{
	  	var difPosition = getViewDifPosition( isdImac );

	  	if (difPosition < camera.fov && difPosition > -camera.fov) 
	  	{
	    	if (subtitleIndicator == 'move') 
	    	{
	      			subtitleTextAlign = 'center';
	      			textListMemory = [];
	    		} 
	    		else 
	    		{
	      			moData.changeSubtitleIndicator( 'center' );
	    		}
	  		}
	  		else 
	  		{
	    		var difPosition2 = difPosition < 0 ? difPosition + 360 : difPosition;
	    		if(difPosition2 > 0 && difPosition2 <= 180) 
	    		{
	      			if (subtitleIndicator == 'move') 
	      			{
				        subtitleTextAlign = 'start';
				        textListMemory = [];
	      			}
	      			else 
	      			{
	        			moData.changeSubtitleIndicator( 'left' );
	      			}
	    		}
	    		else 
	    		{
	      			if (subtitleIndicator == 'move') 
	      			{
			        	subtitleTextAlign = 'end';
			        	textListMemory = [];
	      			} 
	      			else 
	      			{
	        			moData.changeSubtitleIndicator( 'right' );
	      			} 
	      		}
	    	}
	  	}
	}

	function changePositioning(sp)
	{
		autoPositioning = false;
      	var rotaionValue = 0;
      	var rotationInterval = setInterval(function() {
        	if (rotaionValue >= sp) clearInterval(rotationInterval);
        	else {
          		rotaionValue += 3;
          		CameraPatherObject.rotation.y = (rotaionValue + 90) * (Math.PI / 180);
        	}
      	},30);
	}


	function update(offset)
	{
		var isd = imsc.generateISD(imsc1doc, offset);

		if (isd.contents.length > 0) 
	  	{
	  		if (autoPositioning) changePositioning( isd.imac );
	    	if (subtitleEnabled) print3DText( isd.contents[0] );
	    	if (subtileIndicator != 'none') checkSubtitleIdicator( isd.imac );
	    	if (signIndicator != 'none') checkSignIdicator( isd.imac );
	  	}
	}

	function print3DText(isdContent) 
	{
	  	if (isdContent.contents.length > 0)
	  	{
	    	var isdContentText = isdContent.contents[0].contents[0].contents[0].contents;
	    	var textList = [];

	    	for (var i = 0, l = isdContentText.length; i < l; ++i)
	    	{
	      		if (isdContentText[i].kind == 'span' && isdContentText[i].contents)
	      		{
	        		var isdTextObject = {
	          			text: isdContentText[i].contents[0].text,
	          			color: adaptRGBA( isdContentText[i].contents[0].styleAttrs['http://www.w3.org/ns/ttml#styling color'] ),
	          			backgroundColor: adaptRGBA( isdContentText[i].contents[0].styleAttrs['http://www.w3.org/ns/ttml#styling backgroundColor'] )
	        		};

	        		textList.push( isdTextObject );
	      		}
	    	}

	    	if (textList.length > 0 && (textListMemory.length == 0 || textListMemory.length > 0 && textList[0].text != textListMemory[0].text)) 
	    	{
	      		moData.removeSubtitle();

	      		var latitud = subtitleAlign == 'before' ? 30 * viewArea/100 : -30 * viewArea/100; 
	      		var planePosition = getCartesianPosition( latitud, 0 );

	      		var conf = {
	        		subtitleIndicator: subtitleIndicator,
	        		displayAlign: subtitleAlign,
	        		textAlign: subtitleTextAlign,
	        		size: 0.0001 * viewArea,
	        		x: planePosition.x,
	        		y: planePosition.y *9/16,
	        		z: planePosition.z
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

	//************************************************************************************
    // Utils
    //************************************************************************************

    function getCartesianPosition(lat, lon)
    {
    	var elevation = Math.radians( lat );
    	var polar = Math.radians( lon );
    	var position = new Array(3);

    	position.x = Math.cos( elevation ) * Math.sin( polar ); // 0
    	position.y = Math.sin( elevation );
    	position.z = Math.cos( elevation ) * Math.cos( polar ); 

    	return position;  	
    }

    function getViewDifPosition(sp)
    {
    	var camView = camera.getWorldDirection();
	  	var offset = camView.z >= 0 ? 90 : -90;

    	var lon = Math.degrees( Math.atan( camView.x/camView.z ) ) + offset;

    	return lon >= 0 ? sp - lon : sp - (lon + 360);	
    }

    function adaptRGBA(rgb)
    {
    	return (rgb && rgb.length === 4) ? "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")" : '';
	}

    //************************************************************************************
    // Public functions
    //************************************************************************************

    this.initSubtitle = function(fov, da, ta, ind)
	{
		viewArea = fov;
		subtitleAlign = da;
		subtitleTextAlign = ta;
		subtitleIndicator = ind;
	};

	this.initSign = function(fov, sa, ind)
	{
		viewArea = fov;
		signAlign = sa;
		signIndicator = ind
	};

	this.enableAutoPositioning = function()
	{
		autoPositioning = true;
	};

	this.disableAutoPositioning = function()
	{
		autoPositioning = false;
	};





	this.addsubtitles = function(xml)
	{
	  	var r = new XMLHttpRequest();

	  	r.open("GET", xml);
	    r.onreadystatechange = function () {
	        if (r.readyState === 4 && r.status === 200) {
	            imsc1doc = imsc.fromXML( r.responseText );
	        }
	    };
	    r.send();
	};

	this.startSubtitles = function()
	{
	  var listVideoContent = moData.getListOfVideoContents();
	  
	  listVideoContent[0].vid.ontimeupdate = function() 
	  {
	    update(listVideoContent[0].vid.currentTime);
	  };
	};

}