/**
 * @author isaac.fraile@i2cat.net
 */

MenuDictionary = function() {

	var _mainLanguage = 'en';
    var availableSubLanguages = [];
    var availableSignerLanguages = [];
    var availableSettingsLanguages = [];

    var subtitlesLanguagesArray = [];
    var signerLanguagesArray =  [];

    function getSubtitleLanguages()
    {
        var ST_Languages = [];
        availableSubLanguages.forEach(function( lang ) {
            ST_Languages.push( wordList[ lang ][ lang ] );
        });

        return ST_Languages;
    }

    function getSignerLanguages()
    {
        var SL_Languages = [];

        availableSignerLanguages.forEach(function( lang ) {
            SL_Languages.push( wordList[ lang ][ lang ] );
        });

        return SL_Languages;
    }

    function getSettingsLanguages()
    {
        var _Languages = [];

        _Languages.push( wordList[ 'en' ][ 'en' ] );
        _Languages.push( wordList[ 'es' ][ 'es' ] );
        _Languages.push( wordList[ 'de' ][ 'de' ] );
        _Languages.push( wordList[ 'ca' ][ 'ca' ] );

        return _Languages;
    }

	this.getMainLanguage = function()
	{
		return _mainLanguage;
	};

    this.checkMainLanguage = function(lang)
    {
        return _mainLanguage == lang;
    };

	this.setMainLanguage = function(language)
	{
		_mainLanguage = language;

        /*if ( language == 'en') 
        {
            mainLanguage = 'settingsLanguageEngButton';
        }
        else if ( language == 'de') 
        {
            mainLanguage = 'settingsLanguageGerButton';
        }
        else if ( language == 'es') 
        {
            mainLanguage = 'settingsLanguageEspButton';
        }
        else if ( language == 'ca') 
        {
            mainLanguage = 'settingsLanguageCatButton';
        }*/
	};

    this.setSubtitleLanguagesArray = function(subList)
    {
        subtitlesLanguagesArray = [];

        if ( subList['en'] ) 
        {
            subtitlesLanguagesArray.push({name: 'subtitlesEngButton', value: 'en', default: subController.checkSubLanguage('en')});

            availableSubLanguages.push('en');
        }
        if ( subList['de'] ) 
        {
            subtitlesLanguagesArray.push({name: 'subtitlesGerButton', value: 'de', default: subController.checkSubLanguage('de') });

            availableSubLanguages.push('de');
        }
        if ( subList['es'] ) 
        {
            subtitlesLanguagesArray.push({name: 'subtitlesEspButton', value: 'es', default: subController.checkSubLanguage('es') });

            availableSubLanguages.push('es');
        }
        if ( subList['ca'] ) 
        {
            subtitlesLanguagesArray.push({name: 'subtitlesCatButton', value: 'ca', default: subController.checkSubLanguage('ca') });

            availableSubLanguages.push('ca');
        }
    };

    this.getSubtitlesLanguagesArray = function()
    {
        return subtitlesLanguagesArray;
    }

    this.getSignerLanguagesArray = function()
    {
        return signerLanguagesArray;
    }

    this.getSubtitleLanguagesList = function()
    {
        return getSubtitleLanguages();
    }

    this.getSignerLanguagesList = function()
    {
        return getSignerLanguages();
    }

    this.getSettingsLanguagesList = function()
    {
        return getSettingsLanguages();
    }

    this.setSignerLanguagesArray = function(subList)
    {
        signerLanguagesArray = [];

        if ( subList['en'] ) 
        {
            signerLanguagesArray.push({name: 'signerEngButton', value: 'en', default: subController.checkSignLanguage( 'en' ) });

            availableSignerLanguages.push('en');
        }
        if ( subList['de'] ) 
        {
            signerLanguagesArray.push({name: 'signerGerButton', value: 'de', default: subController.checkSignLanguage( 'de' )});

            availableSignerLanguages.push('de');
        }
        if ( subList['es'] ) 
        {
            signerLanguagesArray.push({name: 'signerEspButton', value: 'es', default: subController.checkSignLanguage( 'es' )});

            availableSignerLanguages.push('es');
        }
        if ( subList['ca'] ) 
        {
            signerLanguagesArray.push({name: 'signerCatButton', value: 'ca', default: subController.checkSignLanguage( 'ca' )});

            availableSignerLanguages.push('ca');
        }
    };

    this.setMainLanguage = function(language)
    {
        if ( language ) _mainLanguage = language;
    };

	this.initGlobalArraysByLanguage = function(language)
    {
        console.warn('Future deprecated function!')
    	if ( language ) _mainLanguage = language;
    };

    var imgURL = './img/menu_ai_icons/';

    var wordList = {

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                   ||                        ||                        ||                        ||                        ||
    //     KEY WORDS     ||         Català         ||        Deutsch         ||        English         ||        Español         ||
    //                   ||                        ||                        ||                        ||                        ||
    //-------------------||------------------------||------------------------||------------------------||------------------------||
    //                   ||                        ||                        ||                        ||                        ||
        anchored:        { ca: 'Anchored'          , de: 'Anchored'          , en: 'Anchored'          , es: 'Anchored'          },
    //                   ||                        ||                        ||                        ||                        ||
        area:            { ca: 'Àrea'              , de: 'Bereich'           , en: 'Area'              , es: 'Area'              },
    //                   ||                        ||                        ||                        ||                        ||
        arrow:           { ca: 'Fletxa'            , de: 'Pfeil'             , en: 'Arrow'             , es: 'Flecha'            },
    //                   ||                        ||                        ||                        ||                        ||
        audiodescription:{ ca: 'Audio descripció'  , de: 'Audiodeskription'  , en: 'Audio description' , es: 'Audio descripción' },
    //                   ||                        ||                        ||                        ||                        ||
        audiosubtitles:  { ca: 'Audio subtitols'   , de: 'Audiountertitel'   , en: 'Audio subtitles'   , es: 'Audio subtitulos'  },
    //                   ||                        ||                        ||                        ||                        ||
        auto:            { ca: 'Auto'              , de: 'Auto'              , en: 'Auto'              , es: 'Auto'              },
    //                   ||                        ||                        ||                        ||                        ||
        background:      { ca: 'Fons'              , de: 'Hintergrund'       , en: 'Background'        , es: 'Fondo'             },
    //                   ||                        ||                        ||                        ||                        ||
        bottom:          { ca: 'Inferior'          , de: 'Unten'             , en: 'Bottom'            , es: 'Abajo'             },
    //                   ||                        ||                        ||                        ||                        ||
        ca:              { ca: 'Català'            , de: 'Català'            , en: 'Català'            , es: 'Català'            },
    //                   ||                        ||                        ||                        ||                        ||
        catalan:         { ca: 'Català'            , de: 'katalanisch'       , en: 'Catalan'           , es: 'Catalán'           },
    //                   ||                        ||                        ||                        ||                        ||
        classic:         { ca: 'Clàssic'           , de: 'Classic'           , en: 'Classic'           , es: 'Clásico'           },
    //                   ||                        ||                        ||                        ||                        ||
        de:              { ca: 'Deutsch'           , de: 'Deutsch'           , en: 'Deutsch'           , es: 'Deutsch'           },
    //                   ||                        ||                        ||                        ||                        ||
        easytoread:      { ca: 'Lectura fàcil'     , de: 'Einfache Sprache'  , en: 'Easy to Read'      , es: 'Lectura fácil'     },
    //                   ||                        ||                        ||                        ||                        ||
        en:              { ca: 'English'           , de: 'English'           , en: 'English'           , es: 'English'           },
    //                   ||                        ||                        ||                        ||                        ||
        english:         { ca: 'English'           , de: 'English'           , en: 'English'           , es: 'English'           },
    //                   ||                        ||                        ||                        ||                        ||
        es:              { ca: 'Español'           , de: 'Español'           , en: 'Español'           , es: 'Español'           },
    //                   ||                        ||                        ||                        ||                        ||
        german:          { ca: 'Alemany'           , de: 'Deutsch'           , en: 'German'            , es: 'Alemán'            },
    //                   ||                        ||                        ||                        ||                        ||
        indicator:       { ca: 'Indicador'         , de: 'Indikator'         , en: 'Indicator'         , es: 'Indicador'         },
    //                   ||                        ||                        ||                        ||                        ||
        language:        { ca: 'Idioma'            , de: 'Sprache'           , en: 'Language'          , es: 'Idioma'            },
    //                   ||                        ||                        ||                        ||                        ||
        large:           { ca: 'Gran'              , de: 'Groß'              , en: 'Large'             , es: 'Grande'            },
    //                   ||                        ||                        ||                        ||                        ||
        medium:          { ca: 'Mitjana'           , de: 'Mittel'            , en: 'Medium'            , es: 'Mediana'           },
    //                   ||                        ||                        ||                        ||                        ||
        menutype:        { ca: 'Tipus menú'        , de: 'Menütyp'           , en: 'Menu type'         , es: 'Tipo menú'         },
    //                   ||                        ||                        ||                        ||                        ||
        none:            { ca: 'No'                , de: 'Kein'              , en: 'None'              , es: 'Ninguno'           },
    //                   ||                        ||                        ||                        ||                        ||
        off:             { ca: 'Desactiva'         , de: 'Aus'               , en: 'Off'               , es: 'Desactiva'         },
    //                   ||                        ||                        ||                        ||                        ||
        on:              { ca: 'Activa'            , de: 'An'                , en: 'On'                , es: 'Activa'            },
    //                   ||                        ||                        ||                        ||                        ||
        outline:         { ca: 'Contorn'           , de: 'Umrandung'         , en: 'Outline'           , es: 'Contorno'          },
    //                   ||                        ||                        ||                        ||                        ||
        panorama:        { ca: 'Panorama'          , de: 'Panorama'          , en: 'Panorama'          , es: 'Panorama'          },
    //                   ||                        ||                        ||                        ||                        ||
        position:        { ca: 'Posició'           , de: 'Position'          , en: 'Position'          , es: 'Posición'          },
    //                   ||                        ||                        ||                        ||                        ||
        presentation:    { ca: 'Presentació'       , de: 'Präsentation'      , en: 'Presentation'      , es: 'Presentación'      },
    //                   ||                        ||                        ||                        ||                        ||
        prespective:     { ca: 'Prespectiva'       , de: 'Prespective'       , en: 'Prespective'       , es: 'Prespectiva'       },
    //                   ||                        ||                        ||                        ||                        ||
        radar:           { ca: 'Radar'             , de: 'Radar'             , en: 'Radar'             , es: 'Radar'             },
    //                   ||                        ||                        ||                        ||                        ||
        semitrans:       { ca: 'Semi-Trans'        , de: 'Kasten'            , en: 'Semi-Trans'        , es: 'Semi-Trans'        },
    //                   ||                        ||                        ||                        ||                        ||
        settings:        { ca: 'Configuració'      , de: 'Einstellungen'     , en: 'Settings'          , es: 'Ajustes'           },
    //                   ||                        ||                        ||                        ||                        ||
        signlanguage:    { ca: 'Llenguatge signes' , de: 'Gebärdensprache'   , en: 'Sign language'     , es: 'Lenguage signos'   },
    //                   ||                        ||                        ||                        ||                        ||
        size:            { ca: 'Mida'              , de: 'Größe'             , en: 'Size'              , es: 'Tamaño'            },
    //                   ||                        ||                        ||                        ||                        ||
        small:           { ca: 'Petita'            , de: 'Klein'             , en: 'Small'             , es: 'Pequeña'           },
    //                   ||                        ||                        ||                        ||                        ||
        spanish:         { ca: 'Espanyol'          , de: 'Spanisch'          , en: 'Spanish'           , es: 'Español'           },
    //                   ||                        ||                        ||                        ||                        ||
        subtitles:       { ca: 'Subtitols'         , de: 'Untertitel'        , en: 'Subtitles'         , es: 'Subtítulos'        },
    //                   ||                        ||                        ||                        ||                        ||
        traditional:     { ca: 'Tradicional'       , de: 'Traditional'       , en: 'Traditional'       , es: 'Tradicional'       },
    //                   ||                        ||                        ||                        ||                        ||
        top:             { ca: 'Superior'          , de: 'Oben'              , en: 'Top'               , es: 'Arriba'            },
    //                   ||                        ||                        ||                        ||                        ||
        userprofile:     { ca: 'Perfil usuari'     , de: 'Benutzerprofil'    , en: 'User profile'      , es: 'Perfil usuario'    },
    //                   ||                        ||                        ||                        ||                        ||
        voicecontrol:    { ca: 'Audio control'     , de: 'Sprachsteuerung'   , en: 'Voice control'     , es: 'Audio control'     },
    //                   ||                        ||                        ||                        ||                        ||
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                   ||                              ||                              ||                              ||                              ||
        st:              { ca: imgURL + 'SUB.png'        , de: imgURL + 'UT.png'         , en: imgURL + 'ST.png'         , es: imgURL + 'SUB.png'        },
    //                   ||                              ||                              ||                              ||                              ||
        st_strike:       { ca: imgURL + 'SUB_strike.png' , de: imgURL + 'UT_strike.png'  , en: imgURL + 'ST_strike.png'  , es: imgURL + 'SUB_strike.png' },
    //                   ||                              ||                              ||                              ||                              ||
        sl:              { ca: imgURL + 'SL.png'         , de: imgURL + 'DGS.png'        , en: imgURL + 'SL.png'         , es: imgURL + 'SL.png'         },
    //                   ||                              ||                              ||                              ||                              ||
        sl_strike:       { ca: imgURL + 'SL_strike.png'  , de: imgURL + 'DGS_strike.png' , en: imgURL + 'SL_strike.png'  , es: imgURL + 'SL_strike.png'  },
    //                   ||                              ||                              ||                              ||                              ||
        ad:              { ca: imgURL + 'AD.png'         , de: imgURL + 'AD.png'         , en: imgURL + 'AD.png'         , es: imgURL + 'AD.png'         },
    //                   ||                              ||                              ||                              ||                              ||
        ad_strike:       { ca: imgURL + 'AD_strike.png'  , de: imgURL + 'AD_strike.png'  , en: imgURL + 'AD_strike.png'  , es: imgURL + 'AD_strike.png'  },
    //                   ||                              ||                              ||                              ||                              ||
        ast:             { ca: imgURL + 'AST.png'        , de: imgURL + 'VO.png'         , en: imgURL + 'AST.png'        , es: imgURL + 'AST.png'        },
    //                   ||                              ||                              ||                              ||                              ||
        ast_strike:      { ca: imgURL + 'AST_strike.png' , de: imgURL + 'VO_strike.png'  , en: imgURL + 'AST_strike.png' , es: imgURL + 'AST_strike.png' }
    //                   ||                              ||                              ||                              ||                              ||
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    }

    this.translate = function(word)
    {
        var res = word.toLowerCase();
        return wordList[ res ] ? wordList[ res ][ _mainLanguage ] : word;
    };
}

