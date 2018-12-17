/**
 * @author isaac.fraile@i2cat.net
 */

/************************************************************************************
    
    MenuDictionary.js  
        * Library used to translate words
    
    FUNCTIONALITIES:
        * Getters of _mainLanguage attribute
        * Setters of _mainLanguage attribute
        * Translate function
        * Checker of the _mainLanguage attribute

************************************************************************************/

MenuDictionary = function() {

	var _mainLanguage = 'en';
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
        left:            { ca: 'Esquerra'          , de: 'Links'             , en: 'Left'              , es: 'Izquierda'         },
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
        right:           { ca: 'Dreta'             , de: 'Richtig'           , en: 'Right'             , es: 'Derecha'           },
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
        ast_strike:      { ca: imgURL + 'AST_strike.png' , de: imgURL + 'VO_strike.png'  , en: imgURL + 'AST_strike.png' , es: imgURL + 'AST_strike.png' },
    //                   ||                              ||                              ||                              ||                              ||
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        eng:             { ca: 'en'        , de: 'en'        , en: 'en'        , es: 'en'        },
        esp:             { ca: 'es'        , de: 'es'        , en: 'es'        , es: 'es'        },
        cat:             { ca: 'ca'        , de: 'ca'        , en: 'ca'        , es: 'ca'        },
        ger:             { ca: 'de'        , de: 'de'        , en: 'de'        , es: 'de'        },

        en_gb:             { ca: 'en'        , de: 'en'        , en: 'en'        , es: 'en'        },
        es_es:             { ca: 'es'        , de: 'es'        , en: 'es'        , es: 'es'        },
        ca_es:             { ca: 'ca'        , de: 'ca'        , en: 'ca'        , es: 'ca'        },
        de_de:             { ca: 'de'        , de: 'de'        , en: 'de'        , es: 'de'        },

        engb:             { ca: 'en'        , de: 'en'        , en: 'en'        , es: 'en'        },
        eses:             { ca: 'es'        , de: 'es'        , en: 'es'        , es: 'es'        },
        caes:             { ca: 'ca'        , de: 'ca'        , en: 'ca'        , es: 'ca'        },
        dede:             { ca: 'de'        , de: 'de'        , en: 'de'        , es: 'de'        }

    }
   

//************************************************************************************
// Public Functions
//************************************************************************************

    this.translate = function(word)
    {
        var res = word.toLowerCase();
        return wordList[ res ] ? wordList[ res ][ _mainLanguage ] : word;
    };

    this.checkMainLanguage = function(lang)
    {
        return _mainLanguage == lang;
    };

//************************************************************************************
// Public Getters
//************************************************************************************

    this.getMainLanguage = function()
    {
        return _mainLanguage;
    };

//************************************************************************************
// Public Setters
//************************************************************************************

    this.setMainLanguage = function(language)
    {
        if ( language ) _mainLanguage = language;
    };

}