/**
 * @author isaac.fraile@i2cat.net
 */

MenuDictionary = function() {

	var _mainLanguage = 'en';
    var availableSubLanguages = [];
    var availableSignerLanguages = [];


    this.EnabledButtons = [];
    this.DisabledButtons = [];

    this.On_Off = [];

    this.ST_List = [];
    //this.ST_Languages = [];
    this.ST_Positions = [];
    this.ST_Sizes = [];
    this.ST_Indicators = [];
    this.ST_Backgrounds = [];

    this.SL_List = [];
    this.SL_Languages = [];
    this.SL_Positions = [];
    this.SL_Indicators = [];
    this.SL_Areas = [];

    this.AD_List = [];
    this.AD_Languages = [];
    this.AD_Presentations =[];

    this.AST_List = [];
    this.AST_Languages = [];

    this.Settings_List = [];
    this.Settings_Languages = [];
    this.Settings_UserProfiles = [];

    function getSubtitleLanguages()
    {
        var ST_Languages = [];
        availableSubLanguages.forEach(function(lang) {
            if ( _mainLanguage == 'de' )
            {
                if ( lang == 'de' ) ST_Languages.push('Deutsch');
                else if ( lang == 'es' ) ST_Languages.push('Spanisch');
                else if ( lang == 'en' ) ST_Languages.push('Englisch');
                else if ( lang == 'ca' ) ST_Languages.push('katalanisch');
            }
            else if ( _mainLanguage == 'es' )
            {
                if ( lang == 'de' ) ST_Languages.push('Alemán');
                else if ( lang == 'es' ) ST_Languages.push('Español');
                else if ( lang == 'en' ) ST_Languages.push('Ingles');
                else if ( lang == 'ca' ) ST_Languages.push('Catalán');
            }
            else if ( _mainLanguage == 'en' )
            {
                if ( lang == 'de' ) ST_Languages.push('German');
                else if ( lang == 'es' ) ST_Languages.push('Spanish');
                else if ( lang == 'en' ) ST_Languages.push('English');
                else if ( lang == 'ca' ) ST_Languages.push('Catalan');
            }
            else if ( _mainLanguage == 'ca' )
            {
                if ( lang == 'de' ) ST_Languages.push('Alemany');
                else if ( lang == 'es' ) ST_Languages.push('Espanyol');
                else if ( lang == 'en' ) ST_Languages.push('Angles');
                else if ( lang == 'ca' ) ST_Languages.push('Català');
            }
        });

        return ST_Languages;
    }

    function getSignerLanguages()
    {
        var ST_Languages = [];
        availableSignerLanguages.forEach(function(lang) {
            if ( _mainLanguage == 'de' )
            {
                if ( lang == 'de' ) ST_Languages.push('Deutsch');
                else if ( lang == 'es' ) ST_Languages.push('Spanisch');
                else if ( lang == 'en' ) ST_Languages.push('Englisch');
                else if ( lang == 'ca' ) ST_Languages.push('katalanisch');
            }
            else if ( _mainLanguage == 'es' )
            {
                if ( lang == 'de' ) ST_Languages.push('Alemán');
                else if ( lang == 'es' ) ST_Languages.push('Español');
                else if ( lang == 'en' ) ST_Languages.push('Ingles');
                else if ( lang == 'ca' ) ST_Languages.push('Catalán');
            }
            else if ( _mainLanguage == 'en' )
            {
                if ( lang == 'de' ) ST_Languages.push('German');
                else if ( lang == 'es' ) ST_Languages.push('Spanish');
                else if ( lang == 'en' ) ST_Languages.push('English');
                else if ( lang == 'ca' ) ST_Languages.push('Catalan');
            }
            else if ( _mainLanguage == 'ca' )
            {
                if ( lang == 'de' ) ST_Languages.push('Alemany');
                else if ( lang == 'es' ) ST_Languages.push('Espanyol');
                else if ( lang == 'en' ) ST_Languages.push('Angles');
                else if ( lang == 'ca' ) ST_Languages.push('Català');
            }
        });

        return ST_Languages;
    }

	this.getMainLanguage = function()
	{
		return _mainLanguage;
	};

	this.setMainLanguage = function(language)
	{
		_mainLanguage = language;
	};

    this.setSubtitleLanguagesArray = function(subList)
    {
        menuList[6].submenus[0].buttons = [];

        if ( subList['en'] ) 
        {
            menuList[6].submenus[0].buttons.push( 'subtitlesEngButton' );
            availableSubLanguages.push('en');
        }
        if ( subList['de'] ) 
        {
            menuList[6].submenus[0].buttons.push( 'subtitlesGerButton' );
            availableSubLanguages.push('de');
        }
        if ( subList['es'] ) 
        {
            menuList[6].submenus[0].buttons.push( 'subtitlesEspButton' );
            availableSubLanguages.push('es');
        }
        if ( subList['ca'] ) 
        {
            menuList[6].submenus[0].buttons.push( 'subtitlesCatButton' );
            availableSubLanguages.push('ca');
        }

        //console.error(availableSubLanguages)
    };

    this.getSubtitleLanguagesList = function()
    {
        return getSubtitleLanguages();
    }

    this.getSignerLanguagesList = function()
    {
        return getSignerLanguages();
    }

    this.setSignerLanguagesArray = function(subList)
    {
        menuList[7].submenus[0].buttons = [];

        if ( subList['en'] ) 
        {
            menuList[7].submenus[0].buttons.push( 'signerEngButton' );
            availableSignerLanguages.push('en');
        }
        if ( subList['de'] ) 
        {
            menuList[7].submenus[0].buttons.push( 'signerGerButton' );
            availableSignerLanguages.push('de');
        }
        if ( subList['es'] ) 
        {
            menuList[7].submenus[0].buttons.push( 'signerEspButton' );
            availableSignerLanguages.push('es');
        }
        if ( subList['ca'] ) 
        {
            menuList[7].submenus[0].buttons.push( 'signerCatButton' );
            availableSignerLanguages.push('ca');
        }

        //console.error(availableSignerLanguages)
    };

	this.initGlobalArraysByLanguage = function(language)
    {
    	if ( language ) _mainLanguage = language;

        if ( _mainLanguage == 'de' )
        {
            subtitlesLanguagesArray = getSubtitleLanguages(); //['Englisch', 'Spanisch', 'Deutsch', 'katalanisch'];
            subtitlesPositionArray = ['Oben', 'Unten'];
            subtitlesSizeArray = ['Klein', 'Mittel', 'Groß'];
            subtitlesIndicatorArray = ['Keine', 'Pfeil', 'Radar', 'Auto'];
            subtitlesBackgroundArray = ['Kasten', 'Umrandung'];
            subtitlesEasyArray = ['An', 'Aus'];

            settingsLanguagesArray = ['Englisch', 'Spanisch', 'Deutsch', 'katalanisch'];
            settingsVoiceControlArray = ['option 1'];
            settingsUserProfileArray = ['option 1', 'option 2'];

            signerLanguagesArray = getSignerLanguages();
            signerIndicatorArray = ['Keine', 'Pfeil', 'Forced'];

            ADLanguagesArray = ['Englisch', 'Spanisch', 'Deutsche', 'Catalan'];
            ADPresentationArray = ['Prespective', 'Anchored', 'Classic', 'Panorama'];

            ASTLanguagesArray = ['Englisch', 'Spanisch', 'Deutsch', 'katalanisch'];
            ASTEasyArray = ['An', 'Aus'];

            STMenuList = ['Sprache', 'Einfache', 'Position', 'Hintergrund', 'Größe', 'Indikator', 'Bereich'];
            SLMenuList = ['Sprache', 'Position', 'Indikator', 'Bereich'];
            ADMenuList = ['Sprache', 'Präsentation'];
            ASTMenuList = ['Sprache', 'Einfache'];
            SettingsMenuList = ['Sprache', 'Sprachsteuerung', 'Profil'];

            MOMenuButtonsArray = ['./img/menu_ai_icons/UT.png', './img/menu_ai_icons/DGS.png', './img/menu_ai_icons/AD.png', './img/menu_ai_icons/VO.png'];
            MOMenuDisabledButtonsArray = ['./img/menu_ai_icons/UT_strike.png', './img/menu_ai_icons/DGS_strike.png', './img/menu_ai_icons/AD_strike.png', './img/menu_ai_icons/VO_strike.png'];
        }
        else if ( _mainLanguage == 'es' )
        {
            subtitlesLanguagesArray = getSubtitleLanguages(); //['Ingles', 'Español', 'Aleman', 'Catalán'];
            subtitlesPositionArray = ['Arriba', 'Abajo'];
            subtitlesSizeArray = ['Pequeño', 'Mediano', 'Grande'];
            subtitlesIndicatorArray = ['Ninguno', 'Flecha', 'Radar', 'Auto'];
            subtitlesBackgroundArray = ['Semi-Trans', 'Borde'];
            subtitlesEasyArray = ['Activa', 'Desactiva'];

            settingsLanguagesArray = ['Ingles', 'Español', 'Aleman', 'Catalán'];
            settingsVoiceControlArray = ['option 1'];
            settingsUserProfileArray = ['option 1', 'option 2'];

            signerLanguagesArray = getSignerLanguages();
            signerIndicatorArray = ['Ninguno', 'Flecha', 'Forzado'];

            ADLanguagesArray = ['Ingles', 'Español', 'Aleman', 'Catalán'];
            ADPresentationArray = ['Prespectiva', 'Anchored', 'Clásico', 'Panorama'];

            ASTLanguagesArray = ['Ingles', 'Español', 'Aleman', 'Catalán'];
            ASTEasyArray = ['Activa', 'Desactiva'];

            STMenuList = ['Idiomas', 'Lectura', 'Posición', 'Fondo', 'Tamaño', 'Indicador', 'Area'];
            SLMenuList = ['Idiomas', 'Posición', 'Indicador', 'Area'];
            ADMenuList = ['Idiomas', 'Presentation'];
            ASTMenuList = ['Idiomas', 'Lectura'];
            SettingsMenuList = ['Idiomas', 'Control voz', 'Perfil'];

            MOMenuButtonsArray = ['./img/menu_ai_icons/SUB.png', './img/menu_ai_icons/SL.png', './img/menu_ai_icons/AD.png', './img/menu_ai_icons/AST.png'];
            MOMenuDisabledButtonsArray = ['./img/menu_ai_icons/SUB_strike.png', './img/menu_ai_icons/SL_strike.png', './img/menu_ai_icons/AD_strike.png', './img/menu_ai_icons/AST_strike.png'];
        }
        else if ( _mainLanguage == 'ca' )
        {
            subtitlesLanguagesArray = getSubtitleLanguages(); //['Angles', 'Espanyol', 'Alemany', 'Català'];
            subtitlesPositionArray = ['Superior', 'Inferior'];
            subtitlesSizeArray = ['Petita', 'Mitjana', 'Gran'];
            subtitlesIndicatorArray = ['No', 'Fletxa', 'Radar', 'Auto'];
            subtitlesBackgroundArray = ['Semi-Trans', 'Borde'];
            subtitlesEasyArray = ['Activa', 'Desactiva'];

            settingsLanguagesArray = ['Angles', 'Espanyol', 'Alemany', 'Català'];
            settingsVoiceControlArray = ['option 1'];
            settingsUserProfileArray = ['option 1', 'option 2'];

            signerLanguagesArray = getSignerLanguages();
            signerIndicatorArray = ['No', 'Fletxa', 'Forçat'];

            ADLanguagesArray = ['Angles', 'Espanyol', 'Alemany', 'Català'];
            ADPresentationArray = ['Prespectiva', 'Anclay', 'Classic', 'Panorama'];

            ASTLanguagesArray = ['Angles', 'Espanyol', 'Alemany', 'Català'];
            ASTEasyArray = ['Activa', 'Desactiva'];

            STMenuList = ['Idioma', 'Lectura', 'Posició', 'Fons', 'Mida', 'Indicador', 'Àrea'];
            SLMenuList = ['Idioma', 'Posició', 'Indicador', 'Àrea'];
            ADMenuList = ['Idioma', 'Presentatió'];
            ASTMenuList = ['Idioma', 'Lectura'];
            SettingsMenuList = ['Idioma', 'Control veu', 'Perfil'];

            MOMenuButtonsArray = ['./img/menu_ai_icons/SUB.png', './img/menu_ai_icons/SL.png', './img/menu_ai_icons/AD.png', './img/menu_ai_icons/AST.png'];
            MOMenuDisabledButtonsArray = ['./img/menu_ai_icons/SUB_strike.png', './img/menu_ai_icons/SL_strike.png', './img/menu_ai_icons/AD_strike.png', './img/menu_ai_icons/AST_strike.png'];
        }
        else
        {
            _mainLanguage = 'en';

            subtitlesLanguagesArray = getSubtitleLanguages(); //['English', 'Spanish', 'German', 'Catalan'];
            subtitlesPositionArray = ['Top', 'Bottom'];
            subtitlesSizeArray = ['Small', 'Medium', 'Large'];
            subtitlesIndicatorArray = ['None', 'Arrow', 'Radar', 'Auto'];
            subtitlesBackgroundArray = ['Semi-Trans', 'Outline'];
            subtitlesEasyArray = ['On', 'Off'];

            settingsLanguagesArray = ['English', 'Spanish', 'German', 'Catalan'];
            settingsVoiceControlArray = ['option 1'];
            settingsUserProfileArray = ['option 1', 'option 2'];

            signerLanguagesArray = getSignerLanguages();
            signerIndicatorArray = ['None', 'Arrow', 'Forced'];

            ADLanguagesArray = ['English', 'Spanish', 'German', 'Catalan'];
            ADPresentationArray = ['Prespective', 'Anchored', 'Classic', 'Panorama'];

            ASTLanguagesArray = ['English', 'Spanish', 'German', 'Catalan'];
            ASTEasyArray = ['On', 'Off'];

            STMenuList = ['Languages', 'Easy read', 'Position', 'Background', 'Size', 'Indicator', 'Area'];
            SLMenuList = ['Languages', 'Position', 'Indicator', 'Area'];
            ADMenuList = ['Languages', 'Presentation'];
            ASTMenuList = ['Languages', 'Easy read'];
            SettingsMenuList = ['Languages', 'Voice control', 'User Profile'];

            MOMenuButtonsArray = ['./img/menu_ai_icons/ST.png', './img/menu_ai_icons/SL.png', './img/menu_ai_icons/AD.png', './img/menu_ai_icons/AST.png'];
            MOMenuDisabledButtonsArray = ['./img/menu_ai_icons/ST_strike.png', './img/menu_ai_icons/SL_strike.png', './img/menu_ai_icons/AD_strike.png', './img/menu_ai_icons/AST_strike.png'];
        }
    };

    var wordList = {

        Top: { ca: 'Superior', de: 'Oben', en: 'Top', es: 'Arriba' },

        Bottom: { ca: 'Inferior', de: 'Unten', en: 'Bottom', es: 'Abajo' },

        Small: {
            ca: '',
            de: '',
            en: '',
            es: ''
        },

        Medium: {
            ca: '',
            de: '',
            en: '',
            es: ''
        },

        Large: {
            ca: '',
            de: '',
            en: '',
            es: ''
        },

        None: {
            ca: '',
            de: '',
            en: '',
            es: ''
        },

        Arrow: {
            ca: '',
            de: '',
            en: '',
            es: ''
        },

        Radar: {
            ca: '',
            de: '',
            en: '',
            es: ''
        },

        Auto: {
            ca: '',
            de: '',
            en: '',
            es: ''
        },

        SemiTrans: {
            ca: '',
            de: '',
            en: '',
            es: ''
        },

        Outline: {
            ca: '',
            de: '',
            en: '',
            es: ''
        },

        On: {
            ca: '',
            de: '',
            en: '',
            es: ''
        },

        Off: {
            ca: '',
            de: '',
            en: '',
            es: ''
        },

        English: {
            ca: '',
            de: '',
            en: '',
            es: ''
        },

        Spanish: {
            ca: '',
            de: '',
            en: '',
            es: ''
        },

        Catalan: {
            ca: '',
            de: '',
            en: '',
            es: ''
        },

        German: {
            ca: '',
            de: '',
            en: '',
            es: ''
        },

        Prespective: {
            ca: '',
            de: '',
            en: '',
            es: ''
        },

        Anchored: {
            ca: '',
            de: '',
            en: '',
            es: ''
        },

        Classic: {
            ca: '',
            de: '',
            en: '',
            es: ''
        },

        Panorama: {
            ca: '',
            de: '',
            en: '',
            es: ''
        }

    }

    this.translate = function(word)
    {
        return wordList[word] ? wordList[word][_mainLanguage] : undefined;
    };
}

