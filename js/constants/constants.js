var clickInteractionTimeout = 300;
var visualFeedbackTimeout = 1000;

var menuMargin = 25;
var menuDefaultColor = 0xffffff;
var menuButtonActiveColor = 0xffff00;
var factorScale = 9/16; 
var menuElementsZ = 0.05;

/* MENU BACKGROUND */
var backgroundMenuColor = 0x000000;
var menuAspectRatioWidth = 16;
var menuAspectRatioHeigth = 9;
var backgroundMenuCloseButtonWidth = 20;
var backgroundMenuCloseButtonHeight = 20;
var backgroundChangeMenuButtonWidth = 15;
var backgroundChangeMenuButtonHeight = 15;

var closeButtonMarginX = 10;
var closeButtonMarginY = 10;
var nextButtonMarginX = 10;
var nextButtonMarginY = 10;

/* MENU PLAY/PAUSE */
var playPauseButtonWidth = 75;
var playPauseButtonHeight = 75;
var seekButtonWidth = 40;
var seekButtonHeigth = 20;
var seekButtonMarginX = 30;
var playoutFeedbackMenuTextSize = 15;

var seekTime = 5;

/* MENU VOLUME */
var volumeLevelButtonWidth = 40;
var volumeLevelButtonHeight = 40;
var muteUnmuteButtonWidth = 100;
var muteUnmuteButtonHeight = 100;
var volumeLevelMarginX = 25;
var volFeedbackMenuTextSize = 18;

var volumeChangeStep = 0.1;

/* MENU SETTINGS/CARDBOARD */
var settingsButtonWidth = 80;
var settingsButtonHeight = 80;
var cardboardButtonWidth = 80;
var cardboardButtonHeight = 50;
var settingsCardboardMarginX = 60;

/* MENU MULTIOPTIONS */
var multioptionsMenuTextSize = 11;

var subMenuTextSize = 5;

/* SUB MENU SIBTITLES */

var subtitlesLanguagesArray = ['English', 'Spanish', 'German', 'Catalan'];
var subtitlesPositionArray = ['Top', 'Bottom'];
var subtitlesSizeArray = ['Small', 'Medium', 'Large'];
var subtitlesIndicatorArray = ['None', 'Arrow', 'Radar', 'Auto'];
var subtitlesBackgroundArray = ['Semi-Trans', 'Outline'];
var subtitlesEasyArray = ['On', 'Off'];

var signerIndicatorArray = ['None', 'Arrow', 'Forced'];
var signerLanguagesArray = ['English', 'Spanish', 'German', 'Catalan'];

var settingsLanguagesArray = ['English', 'Spanish', 'German', 'Catalan'];
var settingsVoiceControlArray = ['option 1'];
var settingsUserProfileArray = ['option 1', 'option 2'];

var ADLanguagesArray = ['English', 'Spanish', 'German', 'Catalan'];
var ADPresentationArray = ['Prespective', 'Anchored', 'Classic', 'Panorama'];

var ASTLanguagesArray = ['English', 'Spanish', 'German', 'Catalan'];
var ASTEasyArray = ['On', 'Off'];

var STMenuList = ['Languages', 'Easy read', 'Position', 'Background', 'Size', 'Indicator', 'Area'];
var SLMenuList = ['Languages', 'Position', 'Indicator', 'Area'];
var ADMenuList = ['Languages', 'Presentation'];
var ASTMenuList = ['Languages', 'Easy read'];
var SettingsMenuList = ['Languages', 'Voice control', 'User Profile'];

var MOMenuButtonsArray = ['./img/menu_ai_icons/ST.png', './img/menu_ai_icons/SL.png', './img/menu_ai_icons/AD.png', './img/menu_ai_icons/AST.png'];
var MOMenuDisabledButtonsArray = ['./img/menu_ai_icons/ST_strike.png', './img/menu_ai_icons/SL_strike.png', './img/menu_ai_icons/AD_strike.png', './img/menu_ai_icons/AST_strike.png'];

var secondarySubIndex = 0;

var _isHMD = false;
var autopositioning = false;


/* TRADITIONAL MENU */

var tradMenuMargin = 10;
var tradmenuDivisions = 24;
var heigthDropdownOption = 3;
