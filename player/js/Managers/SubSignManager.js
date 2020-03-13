

SubSignManager = function() 
{
	const TTMLColor = 'http://www.w3.org/ns/ttml#styling color';
	const TTMLBackgroundColor = 'http://www.w3.org/ns/ttml#styling backgroundColor';

	let speakerColor = 'rgb(255,255,255)';

	let _imsc1doc;
	let _imsc1docSL;

	let _textMem = [];
	let _textMemSL = [];

	this.setSubtitle = function( xml, lang, isSL=false )
    {
        let r = new XMLHttpRequest();
        r.open( "GET", xml );

        r.onreadystatechange = function()
        {
            if ( r.readyState === 4 && r.status === 200 )
            {
            	isSL ? _imsc1docSL = imsc.fromXML( r.responseText ) : _imsc1doc = imsc.fromXML( r.responseText );

            	_stMngr.setLanguage( lang );

                updateByTime( VideoController.getMediaTime() );
            } 
            else if ( r.readyState === 4 )
            {
                console.error( 'Status = ' + r.status + ' xml = ' + xml );
            }
        };
        r.send();
    }

    this.updateISD = function( offset )
	{
		updateByTime( offset );
	}

	this.printText = function( isdContent, isSL=false ) 
	{
		print3DText( isdContent, isSL )
	}

	this.hasImsc1doc = function()
	{
		return _imsc1doc ? true : false;
	}

	this.hasImsc1docSL = function()
	{
		return _imsc1docSL ? true : false;
	}

	this.getSpeakerColor = function()
	{
		return speakerColor;
	}

	this.resetSTMemory = function()
	{
		_textMem = [];
	}

	this.resetST4SLMenory = function()
	{
		_textMemSL = [];
	}

    function updateByTime( offset )
    {
    	let isd;

    	if ( _imsc1doc ) isd = updateST( offset );
    	if ( _imsc1docSL ) isd = updateST4SL( offset );
    	else updateSpeakerColor( isd );
    }

    function updateST( offset )
    {
    	let isd = imsc.generateISD( _imsc1doc, offset );

		if ( isd.contents.length > 0 )
		{
	    	_stMngr.generateST( isd )
	  	} 
	  	else if ( _textMem.length > 0 ) 
	  	{
	    	_stMngr.remove();
	    	_rdr.hideRadarIndicator();
	  	}

	  	return isd;
    }

    function updateST4SL( offset )
    {
    	let isd = imsc.generateISD( _imsc1docSL, offset );

		if ( isd.contents.length > 0 ) 
		{
			_slMngr.generateST4SL( isd.contents[0] )
	  	} 
	  	else if ( _textMemSL.length > 0 ) 
	  	{
	    	_slMngr.removeSLSubtitle();
	    	_rdr.hideRadarIndicator();
	  	}

	  	return isd;
    }

	function updateSpeakerColor( isd )
	{
		if ( isd && isd.contents[0].contents.length > 0 ) 
		{		
			let isdContentText = isd.contents[0].contents[0].contents[0].contents[0].contents;

			for ( let i = 0, l = isdContentText.length; i < l; ++i ) 
			{
	      		if ( isdContentText[i].kind == 'span' && isdContentText[i].contents ) 
	      		{
		    		speakerColor = adaptRGBA( isdContentText[i].contents[0].styleAttrs[ TTMLColor ] );
	      		}
		    }
		}
	}

	function adaptRGBA( rgb )
	{
	    return ( rgb && rgb.length === 4 ) ? "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")" : '';
	}

	function getTextList( isdContent )
	{
		let isdContentText = isdContent.contents[0].contents[0].contents[0].contents;
	    let textList = [];

		return new Promise( resolve => {

			isdContentText.forEach( function( elem ) 
			{ 
	      		if ( elem.kind == 'span' && elem.contents )
	      		{
	      			let textObj = elem.contents[0];
	        		let isdTextObject = {
	          			text: textObj.text, //'MMMMMWWWWWMMMMMWWWWWMMMMMWWWWWMMMMM',
	          			color: adaptRGBA( textObj.styleAttrs[ TTMLColor ] ),
	          			backgroundColor: adaptRGBA( textObj.styleAttrs[ TTMLBackgroundColor ] )
	        		};

	        		textList.push( isdTextObject );
	      		}
	    	});
	    	resolve( textList )
		});
	}

	function createST4SL( textList )
	{
		let tlength = _textMemSL.length;

		if ( tlength > 0 && textList[0].text.localeCompare( _textMemSL[0].text ) != 0 || textList.length != tlength ) 
		{
    		_slMngr.createSLSubtitle( textList );
			_textMemSL = textList;
		}
	}

	function createST( textList )
	{
		let tlength = _textMem.length;

		if ( tlength > 0 && textList[0].text.localeCompare( _textMem[0].text ) != 0 || textList.length != tlength ) 
		{
		    _stMngr.create( textList );
      		_textMem = textList;
		}
	}

	function print3DText( isdContent, isSL=false ) 
	{
	  	if ( isdContent.contents.length > 0 ) 
	  	{
	    	getTextList( isdContent ).then( ( textList ) => { 

	    		if ( textList.length > 0 ) 
	    		{
	    			speakerColor = textList[0].color;
	    			isSL ? createST4SL( textList ) : createST( textList );
	    		}
	    	});
    	}
    	else 
    	{
    		isSL ? _slMngr.removeSLSubtitle() : _stMngr.remove();
	    	_rdr.hideRadarIndicator();
	  	}
	}	
}