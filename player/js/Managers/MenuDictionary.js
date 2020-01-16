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
        access:          {ca:'Serv. Accessibilitat', de:'Barrierefreie Dienste', en: 'Access Services', es: 'Serv. Accesibilidad'},
    //                   ||                        ||                        ||                        ||                        ||
        anchored:        { ca: 'Anchored'          , de: 'Anchored'          , en: 'Anchored'          , es: 'Anchored'          },
    //                   ||                        ||                        ||                        ||                        ||
        area:            { ca: 'Àrea'              , de: 'Bereich'           , en: 'Area'              , es: 'Area'              },
    //                   ||                        ||                        ||                        ||                        ||
        arrow:           { ca: 'Fletxa'            , de: 'Pfeil'             , en: 'Arrow'             , es: 'Flecha'            },
    //                   ||                        ||                        ||                        ||                        ||
        audiodescription:{ ca: 'Audio descripció'  , de: 'Audiodeskription'  , en: 'Audio description' , es: 'Audio descripción' },
    //                   ||                        ||                        ||                        ||                        ||
        audiosubtitles:  { ca: 'Audio subtitols'   , de: 'Voice over'        , en: 'Audio subtitles'   , es: 'Audio subtitulos'  },
    //                   ||                        ||                        ||                        ||                        ||
        auto:            { ca: 'Auto'              , de: 'Auto'              , en: 'Auto'              , es: 'Auto'              },
    //                   ||                        ||                        ||                        ||                        ||
        background:      { ca: 'Fons'              , de: 'Hintergrund'       , en: 'Background'        , es: 'Fondo'             },
    //                   ||                        ||                        ||                        ||                        ||
        bottom:          { ca: 'Inferior'          , de: 'Unten'             , en: 'Bottom'            , es: 'Abajo'             },
    //                   ||                        ||                        ||                        ||                        ||
        ca:              { ca: 'Català'            , de: 'Català'            , en: 'Català'            , es: 'Català'            },
    //                   ||                        ||                        ||                        ||                        ||
        classic:         { ca: 'Clàssic'           , de: 'Klassisch'         , en: 'Classic'           , es: 'Clásico'           },
    //                   ||                        ||                        ||                        ||                        ||
        de:              { ca: 'Deutsch'           , de: 'Deutsch'           , en: 'Deutsch'           , es: 'Deutsch'           },
    //                   ||                        ||                        ||                        ||                        ||
        dynamic:         { ca: 'Dinàmic'           , de: 'Dynamisch'         , en: 'Dynamic'           , es: 'Dinámico'          },
    //                   ||                        ||                        ||                        ||                        ||
        easytoread:      { ca: 'Lectura fàcil'     , de: 'Einfache Sprache'  , en: 'Easy to Read'      , es: 'Lectura fácil'     },
    //                   ||                        ||                        ||                        ||                        ||
        en:              { ca: 'English'           , de: 'English'           , en: 'English'           , es: 'English'           },
    //                   ||                        ||                        ||                        ||                        ||
        es:              { ca: 'Español'           , de: 'Español'           , en: 'Español'           , es: 'Español'           },
    //                   ||                        ||                        ||                        ||                        ||
        general:         { ca: 'General'           , de: 'Allgemein'         , en: 'General'           , es: 'General'           },
    //                   ||                        ||                        ||                        ||                        ||
        indicator:       { ca: 'Indicador'         , de: 'Indikator'         , en: 'Indicator'         , es: 'Indicador'         },
    //                   ||                        ||                        ||                        ||                        ||
        language:        { ca: 'Idioma'            , de: 'Sprache'           , en: 'Language'          , es: 'Idioma'            },
    //                   ||                        ||                        ||                        ||                        ||
        languagemenu:    { ca: 'Idioma del menú'   , de: 'Menüsprache'       , en: 'Menu language'     , es: 'Idioma del menú'   },
    //                   ||                        ||                        ||                        ||                        ||
        large:           { ca: 'Gran'              , de: 'Groß'              , en: 'Large'             , es: 'Grande'            },
    //                   ||                        ||                        ||                        ||                        ||
        left:            { ca: 'Esquerra'          , de: 'Links'             , en: 'Left'              , es: 'Izquierda'         },
    //                   ||                        ||                        ||                        ||                        ||
        medium:          { ca: 'Mitjana'           , de: 'Mittel'            , en: 'Medium'            , es: 'Mediano'           },
    //                   ||                        ||                        ||                        ||                        ||
        menutype:        { ca: 'Tipus menú'        , de: 'Menütyp'           , en: 'Menu type'         , es: 'Tipo menú'         },
    //                   ||                        ||                        ||                        ||                        ||
        none:            { ca: 'No'                , de: 'Kein'              , en: 'None'              , es: 'Ninguno'           },
    //                   ||                        ||                        ||                        ||                        ||
        off:             { ca: 'Desactiva'         , de: 'Aus'               , en: 'Off'               , es: 'Desactiva'         },
    //                   ||                        ||                        ||                        ||                        ||
        on:              { ca: 'Activa'            , de: 'An'                , en: 'On'                , es: 'Activa'            },
    //                   ||                        ||                        ||                        ||                        ||
        openmenu:        { ca: 'Open Menu'         , de: 'Open Menu'         , en: 'Open Menu'         , es: 'Open Menu'         },
    //                   ||                        ||                        ||                        ||                        ||
        outline:         { ca: 'Contorn'           , de: 'Umrandung'         , en: 'Outline'           , es: 'Contorno'          },
    //                   ||                        ||                        ||                        ||                        ||
        panorama:        { ca: 'Panorama'          , de: 'Panorama'          , en: 'Panorama'          , es: 'Panorama'          },
    //                   ||                        ||                        ||                        ||                        ||
        pointersize:     { ca: 'Mide Punter'       , de: 'Pointergröße'      , en: 'Pointer Size'      , es: 'Tamaño Puntero'    },
    //                   ||                        ||                        ||                        ||                        ||
        position:        { ca: 'Posició'           , de: 'Position'          , en: 'Position'          , es: 'Posición'          },
    //                   ||                        ||                        ||                        ||                        ||
        presentation:    { ca: 'Presentació'       , de: 'Präsentation'      , en: 'Presentation'      , es: 'Presentación'      },
    //                   ||                        ||                        ||                        ||                        ||
        prespective:     { ca: 'Prespectiva'       , de: 'Prespective'       , en: 'Prespective'       , es: 'Prespectiva'       },
    //                   ||                        ||                        ||                        ||                        ||
        radar:           { ca: 'Radar'             , de: 'Radar'             , en: 'Radar'             , es: 'Radar'             },
    //                   ||                        ||                        ||                        ||                        ||
        right:           { ca: 'Dreta'             , de: 'Rechts'            , en: 'Right'             , es: 'Derecha'           },
    //                   ||                        ||                        ||                        ||                        ||
        safearea:        { ca: 'Area Segura'       , de: 'Darstellungsbereich', en: 'Safe Area'        , es: 'Area Segura'       },
    //                   ||                        ||                        ||                        ||                        ||
        save:            { ca: 'Guardar'           , de: 'Speichern'         , en: 'Save'              , es: 'Guardar'           },
    //                   ||                        ||                        ||                        ||                        ||
        scene:           { ca: 'Escena'            , de: 'UT alle 120°'      , en: 'Scene'             , es: 'Escena'            },
    //                   ||                        ||                        ||                        ||                        || 
        semitrans:       { ca: 'Semi-Trans'        , de: 'Kasten'            , en: 'Semi-Trans'        , es: 'Semi-Trans'        },
    //                   ||                        ||                        ||                        ||                        ||
        settings:        { ca: 'Configuració'      , de: 'Einstellungen'     , en: 'Settings'          , es: 'Ajustes'           },
    //                   ||                        ||                        ||                        ||                        ||
        signlanguage:    { ca: 'Llengua de signes' , de: 'Gebärdensprache'   , en: 'Sign language'     , es: 'Lengua de signos'  },
    //                   ||                        ||                        ||                        ||                        ||
        size:            { ca: 'Mida'              , de: 'Größe'             , en: 'Size'              , es: 'Tamaño'            },
    //                   ||                        ||                        ||                        ||                        ||
        small:           { ca: 'Petita'            , de: 'Klein'             , en: 'Small'             , es: 'Pequeño'           },
    //                   ||                        ||                        ||                        ||                        ||
        speaker:         { ca: 'Orador'           , de: 'UT am Sprecher'    , en: 'Speaker'           , es: 'Orador'           },
    //                   ||                        ||                        ||                        ||                        ||
        static:          { ca: 'Estàtic'            , de: 'Statisch'         , en: 'Static'            , es: 'Estático'          },
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
        volume:          { ca: 'Volum'             , de: 'Lautstärke'        , en: 'Volume'            , es: 'Volumen'           },
    //                   ||                        ||                        ||                        ||                        ||
        st:              { ca: 'SUB'               , de: 'UT'                , en: 'ST'                , es: 'SUB'               },
    //                   ||                        ||                        ||                        ||                        ||
        sl:              { ca: 'SL'                , de: 'DGS'               , en: 'SL'                , es: 'SL'                },
    //                   ||                        ||                        ||                        ||                        ||
        ad:              { ca: 'AD'                , de: 'AD'                , en: 'AD'                , es: 'AD'                },
    //                   ||                        ||                        ||                        ||                        ||  
        ast:             { ca: 'AST'               , de: 'VO'                , en: 'AST'               , es: 'AST'               }, 
    //                   ||                        ||                        ||                        ||                        ||      
        
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    //                   ||                              ||                              ||                              ||                              ||
        st_strike:       { ca: imgURL + 'SUB_strike.png' , de: imgURL + 'UT_strike.png'  , en: imgURL + 'ST_strike.png'  , es: imgURL + 'SUB_strike.png' },
    //                   ||                              ||                              ||                              ||                              ||
        sl_strike:       { ca: imgURL + 'SL_strike.png'  , de: imgURL + 'DGS_strike.png' , en: imgURL + 'SL_strike.png'  , es: imgURL + 'SL_strike.png'  },
    //                   ||                              ||                              ||                              ||                              ||
        ad_strike:       { ca: imgURL + 'AD_strike.png'  , de: imgURL + 'AD_strike.png'  , en: imgURL + 'AD_strike.png'  , es: imgURL + 'AD_strike.png'  },
    //                   ||                              ||                              ||                              ||                              ||
        ast_strike:      { ca: imgURL + 'AST_strike.png' , de: imgURL + 'VO_strike.png'  , en: imgURL + 'AST_strike.png' , es: imgURL + 'AST_strike.png' },
    //                   ||                              ||                              ||                              ||                              ||
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        eng:             { ca: 'en'        , de: 'en'        , en: 'en'        , es: 'en'        },
        esp:             { ca: 'es'        , de: 'es'        , en: 'es'        , es: 'es'        },
        cat:             { ca: 'ca'        , de: 'ca'        , en: 'ca'        , es: 'ca'        },
        ger:             { ca: 'de'        , de: 'de'        , en: 'de'        , es: 'de'        },

        en_gb:           { ca: 'en'        , de: 'en'        , en: 'en'        , es: 'en'        },
        es_es:           { ca: 'es'        , de: 'es'        , en: 'es'        , es: 'es'        },
        ca_es:           { ca: 'ca'        , de: 'ca'        , en: 'ca'        , es: 'ca'        },
        de_de:           { ca: 'de'        , de: 'de'        , en: 'de'        , es: 'de'        },

        engb:            { ca: 'en'        , de: 'en'        , en: 'en'        , es: 'en'        },
        eses:            { ca: 'es'        , de: 'es'        , en: 'es'        , es: 'es'        },
        caes:            { ca: 'ca'        , de: 'ca'        , en: 'ca'        , es: 'ca'        },
        dede:            { ca: 'de'        , de: 'de'        , en: 'de'        , es: 'de'        }

    }
   

//************************************************************************************
// Public Functions
//************************************************************************************

    this.translate = function(word){
        var res = word.toLowerCase();
        return wordList[ res ] ? wordList[ res ][ _mainLanguage ] : word;
    };

    this.checkMainLanguage = function(lang){
        return _mainLanguage == lang;
    };

    this.isMainLanguageAvailable = function(lang){
        return (_stMngr.checkisSubAvailable(lang) || _slMngr.checkisSignAvailable(lang) || 
                 _AudioManager.checkisADAvailable(lang) || _AudioManager.checkisASTAvailable(lang));
    };

//************************************************************************************
// Public Getters
//************************************************************************************

    this.getMainLanguage = function(){
        return _mainLanguage;
    };

/**
 * 
 * If the pre selected language is not available in any of the access options,
 * the next available language is returned.
 * If any languages are available the Access Language option will not be shown.
 *
 * @return     {boolean}  The next available language.
 */
    this.getAvailableLanguage = function(){

        if(list_contents[demoId].acces[0].ST){
            return list_contents[demoId].acces[0].ST[0]
        }else if(list_contents[demoId].acces[0].SL){
            return list_contents[demoId].acces[0].SL[0] 
        } else if(list_contents[demoId].acces[0].AD){
            return list_contents[demoId].acces[0].AD[0]
        } else if(list_contents[demoId].acces[0].AST){
            return list_contents[demoId].acces[0].AST[0]
        } else{
            return false;
        }

    }

//************************************************************************************
// Public Setters
//************************************************************************************

    this.setMainLanguage = function(language){
        if ( language ) _mainLanguage = language;
    };


//************************************************************************************
// Public Ending Getters
//************************************************************************************


    this.getOption1Text = function()
    {
        var option1 = { 
            ca: "T'ha agradat el vídeo?", 
            de: 'Hat Ihnen das Video gefallen?', 
            en: 'Did you like the video?', 
            es: 'Te ha gustado el video?' };
        
        return option1[ _mainLanguage ];
    }

    this.getOption1Button = function()
    {
        var option1 = { 
            ca: "Més vídeos", 
            de: 'Mehr Videos', 
            en: 'More videos', 
            es: 'Mas videos' };
        
        return option1[ _mainLanguage ];
    }

    this.getOption2Text = function()
    {
        var option2 = { 
            ca: "Necessitem els vostres comentaris per millorar els nostres serveis.", 
            de: 'Um unsere Dienste weiter zu verbessern brauchen wir ihr Feedback.', 
            en: 'We need your feedback to improve our services.', 
            es: 'Necesitamos sus comentarios para mejorar nuestros servicios.' };
        
        return option2[ _mainLanguage ];
    }

    this.getOption2Button = function()
    {
        var option2 = { 
            ca: "Qüestionari", 
            de: 'Fragebogen', 
            en: 'Questionnaire', 
            es: 'Cuestionario' };
        
        return option2[ _mainLanguage ];
    }

}