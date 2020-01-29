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
        * _slMngr
        * _stMngr
        * _AudioManager
	
	FUNCTIONALITIES:
		* init = function( mpd )                    --> Initialize the library and generate the metadata used in the player list_contents
		* updateSignerVideo = function( periodId )  --> Update the signer metadata when a period changes

************************************************************************************/

ManifestParser = function() {
	
	var _mpd;

    var extraAD_list = [];
    var last_time = -1;

	this.init = function(mpd) {
		_mpd = mpd;

        var adaptationSetArray = _mpd.manifest.Period_asArray[0].AdaptationSet_asArray;

        var st_list;
        var st_list_e2r;
        var sl_list;
        var ad_list;
        var ast_list;
        var ast_list_e2r;

        adaptationSetArray.forEach( function( elem ) { 
            if ( elem.Role && elem.Role.value == 'subtitle' ) {
                var representationArray = elem.Representation_asArray;
                if ( !st_list ) st_list = {};
                if ( !st_list_e2r ) st_list_e2r = {};
                representationArray.forEach( function( representation ) { 
                    if ( representation.e2r == "true" ) st_list_e2r[ MenuDictionary.translate( elem.lang ) ] = _mpd.manifest.baseUri + representation.BaseURL; 
                    else st_list[ MenuDictionary.translate( elem.lang ) ] = _mpd.manifest.baseUri + representation.BaseURL; 
                });
            } else if ( elem.Role && elem.Role.value == 'sign'){
                var representationArray = elem.Representation_asArray;
                if ( !sl_list ) sl_list = {};
                representationArray.forEach( function( representation ) { 
                    sl_list[ MenuDictionary.translate( elem.lang ) ] = _mpd.manifest.baseUri + representation.SegmentList.SegmentURL.media; 
                });
            } else if ( elem.Role && elem.Role.value == 'ad') {
                var representationArray = elem.Representation_asArray;
                if ( !ad_list ) ad_list = {};
                var ad_modeList = {};
                representationArray.forEach( function( representation ) {  
                    //if ( representation.mode ) ad_modeList[ representation.mode ] = _mpd.manifest.baseUri + representation.BaseURL;
                    if ( representation.mode ){
                        if ( !ad_modeList[ representation.mode ] ) ad_modeList[ representation.mode ] = {};
                        //console.log(representation)
                        ad_modeList[ representation.mode ][representation.gain] = _mpd.manifest.baseUri + representation.BaseURL;
                    }else if ( representation.parent_group_id ) {
                        var extraAD = {};
                        extraAD.init = representation.init;
                        extraAD.parentId = representation.parent_group_id;
                        extraAD.url = _mpd.manifest.baseUri + representation.BaseURL;
                        extraAD.lang = MenuDictionary.translate( elem.lang );

                        extraAD_list.push( extraAD );
                    }
                 	//ad_modeList[ representation.mode ] = _mpd.manifest.baseUri + representation.BaseURL;
                });
                ad_list[ MenuDictionary.translate( elem.lang ) ] = ad_modeList;
            } else if ( elem.Role && elem.Role.value == 'ast') {
                var representationArray = elem.Representation_asArray;
                if ( !ast_list ) ast_list = {};
                if ( !ast_list_e2r ) ast_list_e2r = {};
                var ast_modeList = {};
                var ast_modeList2 = {};

                representationArray.forEach( function( representation ) {
                    if ( representation.e2r == "false" ) ast_modeList[ representation.mode ] = _mpd.manifest.baseUri + representation.BaseURL;
                    else ast_modeList2[ representation.mode ] = _mpd.manifest.baseUri + representation.BaseURL;
                });

                ast_list[ MenuDictionary.translate( elem.lang ) ] = ast_modeList; 
                ast_list_e2r[ MenuDictionary.translate( elem.lang ) ] = ast_modeList2;

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

	this.updateSignerVideo = function(periodId){
        var adaptationList = _mpd.manifest.Period[periodId].AdaptationSet;
        var lang = MenuDictionary.getMainLanguage();
        var langlist;

        adaptationList.forEach( function( elem ) {
            if ( elem.Role.value == 'sign'){
                if ( langlist == undefined ){
                    langlist = {};
                } 
                langlist[ MenuDictionary.translate( elem.lang ) ] = _mpd.manifest.baseUri + elem.Representation.SegmentList.SegmentURL.media;
            }
        });

        if ( langlist ){  
            restartSTContent( langlist );
            setSLContent( lang );
        }

        else _stMngr.removeSignVideo();    
    };

    var extraURL;

    this.checkExtraAD = function(time, lang){
        extraAD_list.forEach( function( elem ) {
            if ( elem.init != last_time && elem.init >= time-0.2 && elem.init <= time+0.2 && elem.lang == lang ) {
                last_time = elem.init;
                extraURL = elem.url;

                // init beep! + delay 1 seg to start de beep + low volumen
                _AudioManager.startBeep(1000);
                
                // disable all user interactions
                _blockControls = true;

                // start setTimeout of 6 seconds
                setTimeout( () => {
                    if ( !extraADenabled ) _blockControls = false;
                    extraURL = undefined;
                }, 6000); 
            }
        });
    }

    this.getExtraAD = function(){
        return extraURL;
    };

    this.getExtraADTime = function(){
        return last_time;
    };

    this.hasExtraADLlist = function(){
        return extraAD_list.length > 0;
    }

//************************************************************************************
// Private Functions
//************************************************************************************

    function restartSTContent(object, e2r){
        list_contents[demoId].subtitles = [];
        list_contents[demoId].subtitles.push( object );
        list_contents[demoId].subtitles.push( e2r );
    }

    function restartSLContent(object){
        list_contents[demoId].signer = [];
        list_contents[demoId].signer.push( object );
    }

    function restartADContent(object){
        list_contents[demoId].ad = [];
        list_contents[demoId].ad.push( object );
    }

    function restartASTContent(object, e2r){
        list_contents[demoId].ast = [];
        list_contents[demoId].ast.push( object );
        list_contents[demoId].ast.push( e2r );
    }

    function setSTContent(lang){
        if ( list_contents[demoId].subtitles && list_contents[demoId].subtitles[0] && Object.entries(list_contents[demoId].subtitles[0]).length > 0 ) {
            var cookielang = _stMngr.getSTAvailableLang( _iconf.stlanguage, 0 ); //_stMngr.getSubLanguage();
            var sublang = cookielang ? cookielang : list_contents[demoId].subtitles[0][lang] ? lang : Object.keys(list_contents[demoId].subtitles[0])[0];
            _stMngr.setSubtitle( list_contents[demoId].subtitles[0][sublang], sublang, 'st');
            _stMngr.setLanguagesArray( list_contents[demoId].subtitles[0] );
        }
    }

    function setSLContent(lang){
        if ( list_contents[demoId].signer && list_contents[demoId].signer[0] ){
            var cookielang = _slMngr.getSLAvailableLang( _iconf.sllanguage ); //_slMngr.getSignerLanguage();
            var siglang = cookielang ? cookielang : list_contents[demoId].signer[0][lang] ? lang : Object.keys(list_contents[demoId].signer[0])[0];
            _slMngr.setContent( list_contents[demoId].signer[0][siglang], siglang );
            _slMngr.setLanguagesArray( list_contents[demoId].signer[0] );

            if ( list_contents[ demoId ].st4sl && list_contents[ demoId ].st4sl[ 0 ] ) {
                var sigSTlang = list_contents[ demoId ].st4sl[ 0 ][ lang ] ? lang : Object.keys( list_contents[ demoId ].st4sl[ 0 ] )[ 0 ];
                _stMngr.setSubtitle( list_contents[demoId].st4sl[0][sigSTlang], sigSTlang, 'sl' ); 
            }
        }
    }

    function setADContent(lang){
        if ( list_contents[demoId].ad && list_contents[demoId].ad[0] ){
            var cookielang = _AudioManager.getADAvailableLang( _iconf.adlanguage ); //_AudioManager.getADLanguage();
            var adlang = cookielang ? cookielang : list_contents[demoId].ad[0][lang] ? lang : Object.keys(list_contents[demoId].ad[0])[0];
            _AudioManager.setADContent( list_contents[demoId].ad[0][adlang], adlang );
            _AudioManager.setADLanguagesArray( list_contents[demoId].ad[0] );
            _AudioManager.setADPresentationArray( list_contents[demoId].ad[0][adlang] );
        }
    }

    function setASTContent(lang){
    	if ( list_contents[demoId].ast && list_contents[demoId].ast[0] ){
            var cookielang = _AudioManager.getADLanguage();
	        var astlang = cookielang ? cookielang : list_contents[demoId].ast[0][lang] ? lang : Object.keys(list_contents[demoId].ast[0])[0];
	        _AudioManager.setASTContent( list_contents[demoId].ast[0][astlang], astlang );
	        _AudioManager.setASTLanguagesArray( list_contents[demoId].ast[0] );
	    }
    }
}
