/**
 * @author isaac.fraile@i2cat.net
 */

MenuDictionary = function() {

	var _mainLanguage = 'en';

	this.getMainLanguage = function()
	{
		return _mainLanguage;
	};

	this.setMainLanguage = function(language)
	{
		_mainLanguage = language;
	};

	this.initGlobalArraysByLanguage = function(language)
    {
    	if ( language ) _mainLanguage = language;

        if ( _mainLanguage == 'en' )
        {
            subtitlesLanguagesArray = ['English', 'Spanish', 'German', 'Catalan'];
            subtitlesPositionArray = ['Top', 'Bottom'];
            subtitlesSizeArray = ['Small', 'Medium', 'Large'];
            subtitlesIndicatorArray = ['None', 'Arrow', 'Radar', 'Auto'];
            subtitlesBackgroundArray = ['Semi-Trans', 'Outline'];
            subtitlesEasyArray = ['On', 'Off'];

            settingsLanguagesArray = ['English', 'Spanish', 'German', 'Catalan'];
            settingsVoiceControlArray = ['option 1'];
            settingsUserProfileArray = ['option 1', 'option 2'];

            ADLanguagesArray = ['English', 'Spanish', 'German', 'Catalan'];
            ADPresentationArray = ['Prespective', 'Anchored', 'Classic', 'Panorama'];

            ASTLanguagesArray = ['English', 'Spanish', 'German', 'Catalan'];
            ASTEasyArray = ['On', 'Off'];

            STMenuList = ['Languages', 'Easy read', 'Position', 'Background', 'Size', 'Indicator', 'Area'];
            SLMenuList = ['Position', 'Indicator', 'Area'];
            ADMenuList = ['Languages', 'Presentation'];
            ASTMenuList = ['Languages', 'Easy read'];
            SettingsMenuList = ['Languages', 'Voice control', 'User Profile'];
        }
        else if ( _mainLanguage == 'de' )
        {
            subtitlesLanguagesArray = ['Englisch', 'Spanisch', 'Deutsch', 'katalanisch'];
            subtitlesPositionArray = ['Oben', 'Unten'];
            subtitlesSizeArray = ['Klein', 'Mittel', 'Groß'];
            subtitlesIndicatorArray = ['Keine', 'Pfeil', 'Radar', 'Auto'];
            subtitlesBackgroundArray = ['Kasten', 'Umrandung'];
            subtitlesEasyArray = ['An', 'Aus'];

            settingsLanguagesArray = ['Englisch', 'Spanisch', 'Deutsch', 'katalanisch'];
            settingsVoiceControlArray = ['option 1'];
            settingsUserProfileArray = ['option 1', 'option 2'];

            ADLanguagesArray = ['Englisch', 'Spanisch', 'Deutsche', 'Catalan'];
            ADPresentationArray = ['Prespective', 'Anchored', 'Classic', 'Panorama'];

            ASTLanguagesArray = ['Englisch', 'Spanisch', 'Deutsch', 'katalanisch'];
            ASTEasyArray = ['An', 'Aus'];

            STMenuList = ['Sprache', 'Einfache', 'Position', 'Hintergrund', 'Größe', 'Indikator', 'Bereich'];
            SLMenuList = ['Position', 'Indikator', 'Bereich'];
            ADMenuList = ['Sprache', 'Präsentation'];
            ASTMenuList = ['Sprache', 'Einfache'];
            SettingsMenuList = ['Sprache', 'Sprachsteuerung', 'Profil'];
        }
        else if ( _mainLanguage == 'es' )
        {
            subtitlesLanguagesArray = ['Ingles', 'Español', 'Aleman', 'Catalán'];
            subtitlesPositionArray = ['Arriba', 'Abajo'];
            subtitlesSizeArray = ['Pequeño', 'Mediano', 'Grande'];
            subtitlesIndicatorArray = ['Ninguno', 'Flecha', 'Radar', 'Auto'];
            subtitlesBackgroundArray = ['Semi-Trans', 'Borde'];
            subtitlesEasyArray = ['Activa', 'Desactiva'];

            settingsLanguagesArray = ['Ingles', 'Español', 'Aleman', 'Catalán'];
            settingsVoiceControlArray = ['option 1'];
            settingsUserProfileArray = ['option 1', 'option 2'];

            ADLanguagesArray = ['Ingles', 'Español', 'Aleman', 'Catalán'];
            ADPresentationArray = ['Prespectiva', 'Anchored', 'Clásico', 'Panorama'];

            ASTLanguagesArray = ['Ingles', 'Español', 'Aleman', 'Catalán'];
            ASTEasyArray = ['Activa', 'Desactiva'];

            STMenuList = ['Idiomas', 'Lectura', 'Posición', 'Fondo', 'Tamaño', 'Indicador', 'Area'];
            SLMenuList = ['Posición', 'Indicador', 'Area'];
            ADMenuList = ['Idiomas', 'Presentation'];
            ASTMenuList = ['Idiomas', 'Lectura'];
            SettingsMenuList = ['Idiomas', 'Control voz', 'Perfil'];
        }
        else
        {
            subtitlesLanguagesArray = ['Angles', 'Espanyol', 'Alemany', 'Català'];
            subtitlesPositionArray = ['Superior', 'Inferior'];
            subtitlesSizeArray = ['Petita', 'Mitjana', 'Gran'];
            subtitlesIndicatorArray = ['No', 'Fletxa', 'Radar', 'Auto'];
            subtitlesBackgroundArray = ['Semi-Trans', 'Borde'];
            subtitlesEasyArray = ['Activa', 'Desactiva'];

            settingsLanguagesArray = ['Angles', 'Espanyol', 'Alemany', 'Català'];
            settingsVoiceControlArray = ['option 1'];
            settingsUserProfileArray = ['option 1', 'option 2'];

            ADLanguagesArray = ['Angles', 'Espanyol', 'Alemany', 'Català'];
            ADPresentationArray = ['Prespectiva', 'Anclay', 'Classic', 'Panorama'];

            ASTLanguagesArray = ['Angles', 'Espanyol', 'Alemany', 'Català'];
            ASTEasyArray = ['Activa', 'Desactiva'];

            STMenuList = ['Idioma', 'Lectura', 'Posició', 'Fons', 'Mida', 'Indicador', 'Àrea'];
            SLMenuList = ['Posició', 'Indicador', 'Àrea'];
            ADMenuList = ['Idioma', 'Presentatió'];
            ASTMenuList = ['Idioma', 'Lectura'];
            SettingsMenuList = ['Idioma', 'Control veu', 'Perfil'];
        }
    };
}