/**
 * @author isaac.fraile@i2cat.net
 */

/************************************************************************************
	
	ManifestParser.js  
		* Library used to parse the MPEG-DASH manifest with IMAC AdaptationSets

	This library needs to use external libs:
		* MenuDictionary.js         -->  To translate words
        * SubSignManager.js         -->  To initilize and set the ST and SL parameters
        * AudioManager.js           -->  To initilize and set the AD and AST parameters

	This library needs to use the global vars:
		* list_contents
        * subController
        * _AudioManager
	
	FUNCTIONALITIES:
		* init = function( mpd )                    --> Initialize the library and generate the metadata used in the player list_contents
		* updateSignerVideo = function( periodId )  --> Update the signer metadata when a period changes

************************************************************************************/

ManifestParser = function() {
	
	var _mpd;

	this.init = function(mpd) 
	{
		_mpd = mpd;

        var adaptationSetArray = _mpd.manifest.Period_asArray[0].AdaptationSet_asArray;

        var st_list;
        var st_list_e2r;
        var sl_list;
        var ad_list;
        var ast_list;
        var ast_list_e2r;

        adaptationSetArray.forEach( function( elem ) { 
            if ( elem.Role && elem.Role.value == 'subtitle' ) 
            {
                var representationArray = elem.Representation_asArray;
                if ( !st_list ) st_list = {};
                if ( !st_list_e2r ) st_list_e2r = {};
                representationArray.forEach( function( representation ) { 
                    if ( representation.e2r == "true" ) st_list_e2r[ MenuDictionary.translate( elem.lang ) ] = _mpd.manifest.baseUri + representation.BaseURL; 
                    else st_list[ MenuDictionary.translate( elem.lang ) ] = _mpd.manifest.baseUri + representation.BaseURL; 
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
            else if ( elem.Role && elem.Role.value == 'ast') 
            {
                var representationArray = elem.Representation_asArray;
                if ( !ast_list ) ast_list = {};
                if ( !ast_list_e2r ) ast_list_e2r = {};
                representationArray.forEach( function( representation ) {        
                    if ( representation.e2r == "false" ) ast_list[ MenuDictionary.translate( elem.lang ) ] = _mpd.manifest.baseUri + representation.BaseURL; 
                    else ast_list_e2r[ MenuDictionary.translate( elem.lang ) ] = _mpd.manifest.baseUri + representation.BaseURL; 
                });
            }
        });

        if ( st_list ) restartSTContent( st_list, st_list_e2r );
        if ( sl_list ) restartSLContent( sl_list );
        if ( ad_list ) restartADContent( ad_list );
        if ( ast_list ) restartASTContent( ast_list, ast_list_e2r );

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

//************************************************************************************
// Private Functions
//************************************************************************************

    function restartSTContent(object, e2r)
    {
        list_contents[demoId].subtitles = [];
        list_contents[demoId].subtitles.push( object );
        list_contents[demoId].subtitles.push( e2r );
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

    function restartASTContent(object, e2r)
    {
        list_contents[demoId].ast = [];
        list_contents[demoId].ast.push( object );
        list_contents[demoId].ast.push( e2r );
    }

    function setSTContent(lang)
    {
        var cookielang = subController.getSubLanguage();
        var sublang = cookielang ? cookielang : list_contents[demoId].subtitles[0][lang] ? lang : Object.keys(list_contents[demoId].subtitles[0])[0];
        subController.setSubtitle( list_contents[demoId].subtitles[0][sublang], sublang );
        subController.setSubtitleLanguagesArray( list_contents[demoId].subtitles[0] );
    }

    function setSLContent(lang)
    {
        if ( list_contents[demoId].signer && list_contents[demoId].signer[0] ) 
        {
            var cookielang = subController.getSignerLanguage();
            var siglang = cookielang ? cookielang : list_contents[demoId].signer[0][lang] ? lang : Object.keys(list_contents[demoId].signer[0])[0];
            subController.setSignerContent( list_contents[demoId].signer[0][siglang], siglang );
            subController.setSignerLanguagesArray( list_contents[demoId].signer[0] );
        }
    }

    function setADContent(lang)
    {
        if ( list_contents[demoId].ad && list_contents[demoId].ad[0] ) 
        {
            var cookielang = _AudioManager.getADLanguage();
            var adlang = cookielang ? cookielang : list_contents[demoId].ad[0][lang] ? lang : Object.keys(list_contents[demoId].ad[0])[0];
            _AudioManager.setADContent( list_contents[demoId].ad[0][adlang], adlang );
            _AudioManager.setADLanguagesArray( list_contents[demoId].ad[0] );
            _AudioManager.setADPresentationArray( list_contents[demoId].ad[0][adlang] );
        }
    }

    function setASTContent(lang)
    {
    	if ( list_contents[demoId].ast && list_contents[demoId].ast[0] ) 
        {
            var cookielang = _AudioManager.getADLanguage();
	        var astlang = cookielang ? cookielang : list_contents[demoId].ast[0][lang] ? lang : Object.keys(list_contents[demoId].ast[0])[0];
	        _AudioManager.setASTContent( list_contents[demoId].ast[0][astlang], astlang );
	        _AudioManager.setASTLanguagesArray( list_contents[demoId].ast[0] );
	    }
    }
}
