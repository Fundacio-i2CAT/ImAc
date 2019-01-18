

ManifestParser = function() {
	
	var _mpd;

	this.init = function(mpd) 
	{
		_mpd = mpd;

        var adaptationSetArray = _mpd.manifest.Period_asArray[0].AdaptationSet_asArray;

        var st_list;
        var sl_list;
        var ad_list;

        adaptationSetArray.forEach( function( elem ) { 
            if ( elem.Role && elem.Role.value == 'subtitle' ) 
            {
                var representationArray = elem.Representation_asArray;
                if ( !st_list ) st_list = {};
                representationArray.forEach( function( representation ) { 
                    st_list[ MenuDictionary.translate( elem.lang ) ] = _mpd.manifest.baseUri + representation.BaseURL; 
                });
            }
            else if ( elem.Role && elem.Role.value == 'sign') 
            {
                var representationArray = elem.Representation_asArray;
                if ( !sl_list ) sl_list = {};
                representationArray.forEach( function( representation ) { 
                    sl_list[ MenuDictionary.translate( elem.lang ) ] = _mpd.manifest.baseUri + representation.SegmentList.SegmentURL.media; 
                });
            }
            else if ( elem.Role && elem.Role.value == 'ad') 
            {
                var representationArray = elem.Representation_asArray;
                if ( !ad_list ) ad_list = {};
                var ad_modeList = {};
                representationArray.forEach( function( representation ) {        
                 	ad_modeList[ representation.mode ] = _mpd.manifest.baseUri + representation.BaseURL;
                });
                ad_list[ MenuDictionary.translate( elem.lang ) ] = ad_modeList;
            }
        });

        if ( st_list ) restartSTContent( st_list );
        if ( sl_list ) restartSLContent( sl_list );
        if ( ad_list ) restartADContent( ad_list );

        var lang = MenuDictionary.getMainLanguage();
        
        setSTContent( lang );
        setSLContent( lang ); 
        setADContent( lang ); 
        setASTContent( lang );  

	};

	this.updateSignerVideo = function(periodId)
    {
        var adaptationList = _mpd.manifest.Period[periodId].AdaptationSet;
        var lang = MenuDictionary.getMainLanguage();
        var langlist;

        adaptationList.forEach( function( elem ) {
            if ( elem.Role.value == 'sign') 
            {
                if ( langlist == undefined ) langlist = {};
                langlist[ MenuDictionary.translate( elem.lang ) ] = _mpd.manifest.baseUri + elem.Representation.SegmentList.SegmentURL.media;
            }
        });

        if ( langlist )
        {
            restartSTContent( langlist );
            setSLContent( lang );
        }

        else subController.removeSignVideoByPeriod();    
    };


    function restartSTContent(object)
    {
        list_contents[demoId].subtitles = [];
        list_contents[demoId].subtitles.push( object );
    }

    function restartSLContent(object)
    {
        list_contents[demoId].signer = [];
        list_contents[demoId].signer.push( object );
    }

    function restartADContent(object)
    {
        list_contents[demoId].ad = [];
        list_contents[demoId].ad.push( object );
    }

    function restartASTContent(object)
    {
        list_contents[demoId].ast = [];
        list_contents[demoId].ast.push( object );
    }

    function setSTContent(lang)
    {
        var sublang = list_contents[demoId].subtitles[0][lang] ? lang : Object.keys(list_contents[demoId].subtitles[0])[0];
        subController.setSubtitle( list_contents[demoId].subtitles[0][sublang], sublang );
        subController.setSubtitleLanguagesArray( list_contents[demoId].subtitles[0] );
    }

    function setSLContent(lang)
    {
        if ( list_contents[demoId].signer && list_contents[demoId].signer[0] ) 
        {
            var siglang = list_contents[demoId].signer[0][lang] ? lang : Object.keys(list_contents[demoId].signer[0])[0];
            subController.setSignerContent( list_contents[demoId].signer[0][siglang], siglang );
            subController.setSignerLanguagesArray( list_contents[demoId].signer[0] );
        }
    }

    function setADContent(lang)
    {
        var adlang = list_contents[demoId].ad[0][lang] ? lang : Object.keys(list_contents[demoId].ad[0])[0];
        _AudioManager.setADContent( list_contents[demoId].ad[0][adlang], adlang );
        _AudioManager.setADLanguagesArray( list_contents[demoId].ad[0] );
        _AudioManager.setADPresentationArray( list_contents[demoId].ad[0][adlang] );
    }

    function setASTContent(lang)
    {
    	if ( list_contents[demoId].ast && list_contents[demoId].ast[0] ) 
        {
	        var astlang = list_contents[demoId].ast[0][lang] ? lang : Object.keys(list_contents[demoId].ast[0])[0];
	        _AudioManager.setASTContent( list_contents[demoId].ast[0][astlang], astlang );
	        _AudioManager.setASTLanguagesArray( list_contents[demoId].ast[0] );
	    }
    }
}