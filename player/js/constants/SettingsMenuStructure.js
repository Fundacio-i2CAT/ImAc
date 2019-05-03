let optHeight;
let optWidth
/*************************************************************************************************************************************
  *                                                S E T T I N G S
**************************************************************************************************************************************/

/**
 * SETTINGS menu hierarchy structure
 * @level 0
 *
 * ╔═════════════════════════════════════╗
 * ║            Settings                 ║
 * ╠═════════════════════════════════════╣
 * ║ General                        (>)  ║
 * ║─────────────────────────────────────║
 * ║ Access Setings                 (>)  ║
 * ║─────────────────────────────────────║
 * ║ [=] ST Settings                (>)  ║
 * ║─────────────────────────────────────║
 * ║ [>] SL Settings                (>)  ║
 * ║─────────────────────────────────────║
 * ║ [o] AD Settings                (>)  ║
 * ║─────────────────────────────────────║
 * ║ [··] AST Settings              (>)  ║
 * ╚═════════════════════════════════════╝
*/
const settingsDropdownOpt = {title: 'Settings', final: false, options: [
    {optId: 'settingsGeneral', icon: './img/menu/settings_icon.png', text: 'General', function: function(){ SettingsOptionCtrl.updateDropdownOptions(generalSettings)} },
    {optId: 'settingsAccess', icon: './img/menu/accessibility_icon.png', text: 'Access', function: function(){ SettingsOptionCtrl.updateDropdownOptions(accessSettings)} },
    {optId: 'settingsST', icon: './img/acc_serv_icon/st_off.png', text: 'Subtitles', function: function(){ SettingsOptionCtrl.updateDropdownOptions(settingsSubtitles)} },
    {optId: 'settingsSL', icon: './img/acc_serv_icon/sl_off.png', text: 'Signlanguage', function: function(){ SettingsOptionCtrl.updateDropdownOptions(settingsSignLanguage)} },
    {optId: 'settingsAD', icon: './img/acc_serv_icon/ad_off.png', text: 'Audiodescription', function: function(){ SettingsOptionCtrl.updateDropdownOptions(settingsAudioDescription)} },
    {optId: 'settingsAST', icon: './img/acc_serv_icon/ast_off.png', text: 'Audiosubtitles', function: function(){ SettingsOptionCtrl.updateDropdownOptions(settingsAudioSubtitles)} }
  ]};

/*************************************************************************************************************************************
  *                                                G E N E R A L
**************************************************************************************************************************************/

/**
 * GENERAL SETTINGS menu hierarchy structure
 * @level 1
 *
 * ╔═════════════════════════════════════╗
 * ║ (<)        General                  ║
 * ╠═════════════════════════════════════╣
 * ║ UI Languages                   (>)  ║
 * ║─────────────────────────────────────║
 * ║ Voice Control                  (>)  ║
 * ║─────────────────────────────────────║
 * ║ Menu Type                      (>)  ║ X --> This option will be as an icon in the menu.
 * ║─────────────────────────────────────║
 * ║ Pointer Size                   (>)  ║
 * ║─────────────────────────────────────║
 * ║ User Profile                   (>)  ║
 * ╚═════════════════════════════════════╝
  */
const generalSettings = { title: 'General', icon: './img/menu/settings_icon.png', parent: settingsDropdownOpt, final: false, options: [
    {optId: 'settingsLanguages', icon: './img/menu/language.png', text: 'Language', function: function(){ SettingsOptionCtrl.updateDropdownOptions(settingsUILanguages)} },
    {optId: 'settingsVoiceControl', icon: './img/menu/voice_control.png', text: 'VoiceControl', function: function(){ SettingsOptionCtrl.updateDropdownOptions(settigsVoiceControl)} },
    //{optId: 'settingsMenuType', icon: './img/menu/menu_type.png', text: 'Menu Type', function: function(){ SettingsOptionCtrl.updateDropdownOptions(settingsMenuType)} },
    {optId: 'settingsPointerSize', icon: './img/menu/pointer_size.png', text: 'PointerSize', function: function(){ SettingsOptionCtrl.updateDropdownOptions(settingsPointerSize)} },
    {optId: 'settingsUserProfile', icon: './img/menu/user_profile.png', text: 'UserProfile', function: function(){ SettingsOptionCtrl.updateDropdownOptions(settingsUserProfile)} }
  ]};

/**
 * UI LANGUAGES menu hierarchy structure
  * @level 2
  *
  * ╔═════════════════════════════════════╗
  * ║ (<)       UI Languages              ║
  * ╠═════════════════════════════════════╣
  * ║ English                       Final ║
  * ║─────────────────────────────────────║
  * ║ Español                       Final ║
  * ║─────────────────────────────────────║
  * ║ Deutsch                       Final ║
  * ║─────────────────────────────────────║
  * ║ Català                        Final ║
  * ╚═════════════════════════════════════╝
 */
const settingsUILanguages = { title: 'Languages', icon: './img/menu/language.png', parent: generalSettings, final: true, options: [
    {optId: 'settingsUILanguageEngButton', text: 'English', function:  function(){ MenuFunctionsManager.getMainLanguageFunc('en')} }, 
    {optId: 'settingsUILanguageEspButton', text: 'Español', function:  function(){ MenuFunctionsManager.getMainLanguageFunc('es')} }, 
    {optId: 'settingsUILanguageGerButton', text: 'Deutsch', function:  function(){ MenuFunctionsManager.getMainLanguageFunc('de')} }, 
    {optId: 'settingsUILanguageCatButton', text: 'Català', function:  function(){ MenuFunctionsManager.getMainLanguageFunc('ca')} } 
  ]};

/**
 * VOICE CONTROL menu hierarchy structure
 * @level 2
 * ╔═════════════════════════════════════╗
 * ║ (<)       Voice Control             ║4
 * ╠═════════════════════════════════════╣
 * ║ ON                            Final ║
 * ║─────────────────────────────────────║
 * ║ OFF                           Final ║
 * ╚═════════════════════════════════════╝
*/
const settigsVoiceControl = { title: 'VoiceControl', icon: './img/menu/voice_control.png', parent: generalSettings, final: true, options: [
    {optId: 'voiceControlOnButton', text: 'On', function:  function(){ console.log()} }, 
    {optId: 'voiceControlOffButton', text: 'Off', function:  function(){ console.log()} } 
  ]};

/**  MENU TYPE menu hierarchy structure
 * @level 2
 *
 * ╔═════════════════════════════════════╗
 * ║ (<)       Menu Type                 ║
 * ╠═════════════════════════════════════╣
 * ║ Traditional                   Final ║
 * ║─────────────────────────────────────║
 * ║ Enhanced-Accessibility        Final ║
 * ╚═════════════════════════════════════╝
*/
const settingsMenuType = { title: 'MenuType', icon: './img/menu/menu_type.png', parent: generalSettings, final: true, options: [
    {optId: 'settingsMenuTraditionalButton', text: 'Traditional', function:  function(){ console.log()} }, //TODO
    {optId: 'settingsMenuLowSightedButton', text: 'Enhanced-Accessibility', function:  function(){ console.log()} } //TOD 
  ]};

/**
 * POINTER SIZE menu hierarchy structure
 * @level 2
 *
 * ╔═════════════════════════════════════╗
 * ║ (<)       Pointer Size              ║
 * ╠═════════════════════════════════════╣
 * ║ Large                         Final ║
 * ║─────────────────────────────────────║
 * ║ Medium                        Final ║
 * ║─────────────────────────────────────║
 * ║ Small                         Final ║
 * ╚═════════════════════════════════════╝
*/
const settingsPointerSize = { title: 'PointerSize', icon: './img/menu/pointer_size.png', parent: generalSettings, final: true, options: [
    {optId: 'settingsMenuPointerLarge', text: 'Large', function:  function(){ MenuFunctionsManager.getChangePointerSizeFunc(2)} }, 
    {optId: 'settingsMenuPointerMedium', text: 'Medium', function:  function(){ MenuFunctionsManager.getChangePointerSizeFunc(1)} }, 
    {optId: 'settingsMenuPointerSmall', text: 'Small', function:  function(){ MenuFunctionsManager.getChangePointerSizeFunc(0.6)} } 
  ]};

/**  USER PROFILE menu hierarchy structure
 * @level 2
 *
 * ╔═════════════════════════════════════╗
 * ║ (<)       User Profile              ║
 * ╠═════════════════════════════════════╣
 * ║ Save                          Final ║
 * ╚═════════════════════════════════════╝
*/
const settingsUserProfile = { title: 'UserProfile', icon: './img/menu/user_profile.png', parent: generalSettings, final: true, options: [
    {optId: 'saveUserProfileButton', text: 'Save', function:  function(){ saveConfig();} } 
  ]};


/*************************************************************************************************************************************
   *                                               A C C E S S 
  **************************************************************************************************************************************/

/**
 *  ACCESS SETTINGS menu hierarchy structure
 * @level 1
 *
 * ╔═════════════════════════════════════╗
 * ║ (<)        Access Settings          ║
 * ╠═════════════════════════════════════╣
 * ║ Acces Language                 (>)  ║
 * ║─────────────────────────────────────║
 * ║ Indicator                      (>)  ║
 * ║─────────────────────────────────────║
 * ║ Safe Area                      (>)  ║
 * ╚═════════════════════════════════════╝
  */
const accessSettings = { title: 'Access', icon: './img/menu/accessibility_icon.png', parent: settingsDropdownOpt, final: false, options: [
    {optId: 'settingsAccessLanguage', icon: './img/menu/language.png', text: 'Language', function: function(){ SettingsOptionCtrl.updateDropdownOptions(settingsAccesLanguages)} }, //NEW LANG
    {optId: 'settingsIndicator', icon: './img/menu/indicator.png', text: 'Indicator', function: function(){ SettingsOptionCtrl.updateDropdownOptions(settingsIndicator)} }, //NEW INDIC
    {optId: 'settingsSafeArea', icon: './img/menu/safe_area.png', text: 'SafeArea', function: function(){ SettingsOptionCtrl.updateDropdownOptions(settingsSafeArea)} }
  ]};

/**
 * ACCESS LANGUAGES menu hierarchy structure
 * @level 2
 *
 * ╔═════════════════════════════════════╗
 * ║ (<)    Access Languages             ║
 * ╠═════════════════════════════════════╣
 * ║ English                       Final ║
 * ║─────────────────────────────────────║
 * ║ Español                       Final ║
 * ║─────────────────────────────────────║
 * ║ Deutsch                       Final ║
 * ║─────────────────────────────────────║
 * ║ Català                        Final ║
 * ╚═════════════════════════════════════╝
*/
const settingsAccesLanguages = { title: 'Languages', icon: './img/menu/language.png', parent: accessSettings, final: true, options: [
    {optId: 'settingsAccesLanguageEngButton', text: 'English', function:  function(){ console.log()} }, 
    {optId: 'settingsAccesLanguageEspButton', text: 'Español', function:  function(){ console.log()} }, 
    {optId: 'settingsAccesLanguageGerButton', text: 'Deutsch', function:  function(){ console.log()} }, 
    {optId: 'settingsAccesLanguageCatButton', text: 'Català', function:  function(){ console.log()} } 
  ]};

/**
 * INDICATOR menu hierarchy structure
 * @level 2
 *
 * ╔═════════════════════════════════════╗
 * ║ (<)        Indicator                ║
 * ╠═════════════════════════════════════╣
 * ║ None                          Final ║
 * ║─────────────────────────────────────║
 * ║ Arrows                        Final ║
 * ║─────────────────────────────────────║
 * ║ Radar                         Final ║
 * ╚═════════════════════════════════════╝
  */
const settingsIndicator = { title: 'Indicator', icon: './img/menu/indicator.png', parent: accessSettings, final: true, options: [
    {optId: 'settingsIndicatorNone', text: 'None', function:  function(){ subController.setSubIndicator( "none" )} }, 
    {optId: 'settingsIndicatorArrows', text: 'Arrows', function:  function(){ subController.setSubIndicator( "arrow" )} },
    {optId: 'settingsIndicatorRadar', text: 'Radar', function:  function(){ subController.setSubIndicator( "radar" )} } 
  ]};


/**
 *  SAFE AREA menu hierarchy structure
 * @level 2
 *
 * ╔═════════════════════════════════════╗
 * ║ (<)        Safe Area                ║
 * ╠═════════════════════════════════════╣
 * ║ Small                         Final ║
 * ║─────────────────────────────────────║
 * ║ Large                         Final ║
 * ╚═════════════════════════════════════╝
*/
const settingsSafeArea = { title: 'SafeArea', icon: './img/menu/safe_area.png', parent: accessSettings, final: true, options: [
    {optId: 'settingsSafeAreaSmall', text: 'Small', function:  function(){ subController.setSubArea( 50 )} }, 
    {optId: 'settingsSafeAreaLarge', text: 'Large', function:  function(){ subController.setSubArea( 70 )} } 
  ]};


  /*************************************************************************************************************************************
   *                                               S U B T I T L E S    (ST)
  **************************************************************************************************************************************/

/**
 * SUBTITLES (ST) menu hierarchy structure
 * @level 1
 *
 * ╔═════════════════════════════════════╗
 * ║ (<)        ST Settings              ║
 * ╠═════════════════════════════════════╣
 * ║ Size                           (>)  ║
 * ║─────────────────────────────────────║
 * ║ Background                     (>)  ║
 * ║─────────────────────────────────────║
 * ║ Position                       (>)  ║
 * ║─────────────────────────────────────║
 * ║ Easy-to-Read                   (>)  ║
 * ╚═════════════════════════════════════╝
*/
const settingsSubtitles = { title: 'Subtitles', icon: './img/acc_serv_icon/st_off.png', parent: settingsDropdownOpt, final: false, options: [
    { optId: 'subtitlesSizes', icon: './img/menu/st_font_size.png', text: 'Size', function:  function(){ SettingsOptionCtrl.updateDropdownOptions(settingsSubtitlesSize)} },
    { optId: 'subtitlesBackground', icon: './img/menu/st_background.png', text: 'Background', function:  function(){ SettingsOptionCtrl.updateDropdownOptions(settingsSubtitlesBackground)} },
    { optId: 'subtitlesShowPositions', icon: './img/menu/st_position.png', text: 'Position', function:  function(){ SettingsOptionCtrl.updateDropdownOptions(settingsSubtitlesPosition)} },
    { optId: 'subtitlesEasyRead', icon: './img/menu/easy_to_read.png', text: 'Easytoread', function:  function(){ SettingsOptionCtrl.updateDropdownOptions(settingsSubtitlesEasyToRead)} }
  ]};

  /**
   * SUBTITLES SIZE menu hierarchy structure
   * @level 2
   *
   * ╔═════════════════════════════════════╗
   * ║ (<)            Size                 ║
   * ╠═════════════════════════════════════╣
   * ║ Small                         Final ║
   * ║─────────────────────────────────────║
   * ║ Medium                        Final ║
   * ║─────────────────────────────────────║
   * ║ Large                         Final ║
   * ╚═════════════════════════════════════╝
  */
const settingsSubtitlesSize = { title: 'Size', icon: './img/menu/st_font_size.png', parent: settingsSubtitles, final: true, options: [
    {optId: 'subtitlesSmallSizeButton', text: 'Small', function:  function(){ subController.setSubSize( 0.6 )} },
    {optId: 'subtitlesMediumSizeButton', text: 'Medium', function:  function(){ subController.setSubSize( 0.8 )} },
    {optId: 'subtitlesLargeSizeButton', text: 'Large', function:  function(){ subController.setSubSize( 1 )} }
  ]};

  /**
   * SUBTITLES BACKGROUND menu hierarchy structure
   * @level 2
   *
   * ╔═════════════════════════════════════╗
   * ║ (<)         Background              ║
   * ╠═════════════════════════════════════╣
   * ║ Semitrans                     Final ║
   * ║─────────────────────────────────────║
   * ║ Outline                       Final ║
   * ╚═════════════════════════════════════╝
  */
  const settingsSubtitlesBackground = { title: 'Background', icon: './img/menu/st_background.png', parent: settingsSubtitles, final: true, options: [
    {optId: 'subtitlesSemitrans', text: 'Semitrans', function:  function(){ subController.setSubBackground( 0.5 )} },
    {optId: 'subtitlesOutline', text: 'Outline', function:  function(){ subController.setSubBackground( 0 )} }
  ]};

  /**
   * SUBTITLES POSITION menu hierarchy structure
   * @level 2
   *
   * ╔═════════════════════════════════════╗
   * ║ (<)         Position                ║
   * ╠═════════════════════════════════════╣
   * ║ Top                           Final ║
   * ║─────────────────────────────────────║
   * ║ Bottom                        Final ║
   * ╚═════════════════════════════════════╝
  */
  const settingsSubtitlesPosition = { title: 'Position', icon: './img/menu/st_position.png', parent: settingsSubtitles, final: true, options: [
    {optId: 'subtitlesTopButton', text: 'Top', function:  function(){
            subController.setSubPosition( 0, 1 );
            subController.setSignerPosition( subController.getSignerPosition().x, 1 )} },
    {optId: 'subtitlesBottomButton', text: 'Bottom', function:  function(){ 
            subController.setSubPosition( 0, -1 );
            subController.setSignerPosition( subController.getSignerPosition().x, -1 )} }
  ]};

  /**
   * SUBTITLES EASY-TO-READ menu hierarchy structure
   * @level 2
   *
   * ╔═════════════════════════════════════╗
   * ║ (<)         Easy to Read            ║
   * ╠═════════════════════════════════════╣
   * ║ On                            Final ║
   * ║─────────────────────────────────────║
   * ║ Off                           Final ║
   * ╚═════════════════════════════════════╝
  */
  const settingsSubtitlesEasyToRead = { title: 'EasytoRead', icon: './img/menu/easy_to_read.png', parent: settingsSubtitles, final: true, options: [
    {optId: 'subtitlesEasyOn', text: 'On', function:  function(){ subController.setSubEasy( true, getE2RURL() )} },
    {optId: 'subtitlesEasyOff', text: 'Off', function:  function(){ subController.setSubEasy( false, list_contents[demoId].subtitles[0][subController.getSubLanguage()] );} }
  ]};


  /*************************************************************************************************************************************
   *                                               S I G N    L A N G U A G E    (SL)
  **************************************************************************************************************************************/

  /**
  * SIGN LANGUAGE (SL) menu hierarchy structure
  * @level 1
  *
  * ╔═════════════════════════════════════╗
  * ║ (<)     SL Settings                 ║
  * ╠═════════════════════════════════════╣
  * ║ Position                       (>)  ║
  * ║─────────────────────────────────────║
  * ║ Size                           (>)  ║
  * ╚═════════════════════════════════════╝
  */
  const settingsSignLanguage = { title: 'Signlanguage', icon: './img/acc_serv_icon/sl_off.png', parent: settingsDropdownOpt, final: false, options: [
    { optId: 'signerPosition', icon: './img/menu/sl_position.png', text: 'Position', function:  function(){ SettingsOptionCtrl.updateDropdownOptions(settingsSignLanguagePosition)} },
    { optId: 'signerSize', icon: './img/menu/sl_size.png', text: 'Size', function:  function(){ SettingsOptionCtrl.updateDropdownOptions(settingsSignLanguageSize)} }
  ]};

  /**
   * SIGN LANGUAGE POSITION menu hierarchy structure
   * @level 2
   *
   * ╔═════════════════════════════════════╗
   * ║ (<)         Position                ║
   * ╠═════════════════════════════════════╣
   * ║ Right                         Final ║
   * ║─────────────────────────────────────║
   * ║ Left                          Final ║
   * ╚═════════════════════════════════════╝
  */
  const settingsSignLanguagePosition = { title: 'Position', icon: './img/menu/sl_position.png', parent: settingsSignLanguage, final: true, options: [
    {optId: 'signerRightButton', text: 'Right', function:  function(){ subController.setSignerPosition( 1, subController.getSubPosition().y);} },
    {optId: 'signerLeftButton', text: 'Left', function:  function(){ subController.setSignerPosition( -1, subController.getSubPosition().y);} }
  ]};

  /**
   * SIGN LANGUAGE SIZE menu hierarchy structure
   * @level 2
   *
   * ╔═════════════════════════════════════╗
   * ║ (<)            Size                 ║
   * ╠═════════════════════════════════════╣
   * ║ Small                         Final ║
   * ║─────────────────────────────────────║
   * ║ Medium                        Final ║
   * ║─────────────────────────────────────║
   * ║ Large                         Final ║
   * ╚═════════════════════════════════════╝
  */
const settingsSignLanguageSize = { title: 'Size', icon: './img/menu/sl_size.png', parent: settingsSignLanguage, final: true, options: [
    {optId: 'signerSmallSizeButton', text: 'Small', function:  function(){ console.log()} }, //TODO
    {optId: 'signerMediumSizeButton', text: 'Medium', function:  function(){ console.log()} }, //TODO
    {optId: 'signerLargeSizeButton', text: 'Large', function:  function(){ console.log()} } //TODO
  ]};


/*************************************************************************************************************************************
 *                                        A U D I O   D E S C R I P T I O N   (AD)
**************************************************************************************************************************************/

  /**
  * AUDIO DESCRIPTION (AD) menu hierarchy structure
  * @level 1
  *
  * ╔═════════════════════════════════════╗
  * ║ (<)   AD Settings                   ║
  * ╠═════════════════════════════════════╣
  * ║ Presentation Mode              (>)  ║
  * ║─────────────────────────────────────║
  * ║ Volume Level                   (>)  ║
  * ╚═════════════════════════════════════╝
  */
  const settingsAudioDescription = { title: 'Audiodescription', icon: './img/acc_serv_icon/ad_off.png', parent: settingsDropdownOpt, final: false, options: [
    { optId: 'audioDescriptionPresentation', icon: './img/menu/ad_presentation_mode.png', text: 'Presentation', function:  function(){ SettingsOptionCtrl.updateDropdownOptions(settingsAudioDescriptionPresentation)} },
    { optId: 'audioDescriptionVolume', icon: './img/menu/volume_mute_icon.png', text: 'Volume', function:  function(){ SettingsOptionCtrl.updateDropdownOptions(settingsAudioDescriptionVolume)} }
  ]};

  /**
   * AUDIO DESCRIPTION PRESENTATION menu hierarchy structure
   * @level 2
   *
   * ╔═════════════════════════════════════╗
   * ║ (<)        Presetation              ║
   * ╠═════════════════════════════════════╣
   * ║ Voice of God                  Final ║
   * ║─────────────────────────────────────║
   * ║ Friend of Sofa                Final ║
   * ║─────────────────────────────────────║
   * ║ Placed on Action              Final ║
   * ╚═════════════════════════════════════╝
  */
const settingsAudioDescriptionPresentation = { title: 'Presetation', icon: './img/menu/ad_presentation_mode.png', parent: settingsAudioDescription, final: true, options: [
    {optId: 'adPresentationVoGButton', text: 'Classic', function:  function(){ _AudioManager.setADPresentation( 'VoiceOfGod' )} },
    {optId: 'adPresentationFoSButton', text: 'Static', function:  function(){ _AudioManager.setADPresentation( 'Friend' )} },
    {optId: 'adPresentationPoAButton', text: 'Dynamic', function:  function(){ _AudioManager.setADPresentation( 'Dynamic' )} }
  ]};

  /**
   * AUDIO DESCRIPTION VOLUME menu hierarchy structure
   * @level 2
   *
   * ╔═════════════════════════════════════╗
   * ║ (<)          Volume                 ║
   * ╠═════════════════════════════════════╣
   * ║ Minimum                       Final ║
   * ║─────────────────────────────────────║
   * ║ Medium                        Final ║
   * ║─────────────────────────────────────║
   * ║ Maximum                       Final ║
   * ╚═════════════════════════════════════╝
  */
const settingsAudioDescriptionVolume = { title: 'Volume', icon: './img/menu/volume_mute_icon.png', parent: settingsAudioDescription, final: true, options: [
    {optId: 'adVolumeMinButton', text: 'Minimum', function:  function(){ _AudioManager.setVolume( 'AD', 10 );} },
    {optId: 'adVolumeMidButton', text: 'Medium', function:  function(){ _AudioManager.setVolume( 'AD', 50 );} },
    {optId: 'adVolumeMaxButton', text: 'Maximum', function:  function(){ _AudioManager.setVolume( 'AD', 100 );} }
  ]};


  /*************************************************************************************************************************************
   *                                            A U D I O   S U B T I T L E S    (AST)
  **************************************************************************************************************************************/

  /**
  * AUDIO SUBTITLES (AST) menu hierarchy structure
  * @level 1
  *
  * ╔═════════════════════════════════════╗
  * ║ (<)    AST Settings                 ║
  * ╠═════════════════════════════════════╣
  * ║ Easy-to-Read                   (>)  ║
  * ║─────────────────────────────────────║
  * ║ Presentation Mode              (>)  ║
  * ║─────────────────────────────────────║
  * ║ Volume Level                   (>)  ║
  * ╚═════════════════════════════════════╝
  */

  const settingsAudioSubtitles = { title: 'Audiosubtitles', icon: './img/acc_serv_icon/ast_off.png', parent: settingsDropdownOpt, final: false, options: [
      { optId: 'audioSubtitlesEasy', icon: './img/menu/easy_to_read.png', text: 'Easy to read', function:  function(){ SettingsOptionCtrl.updateDropdownOptions(settingsAudioSubtitlesEasyToRead)} },
      { optId: 'audioSubtitlesPresentation', icon: './img/menu/ad_presentation_mode.png', text: 'Presentation', function:  function(){ SettingsOptionCtrl.updateDropdownOptions(settingsAudioSubtitlesPresentation)} },
      { optId: 'audioSubtitlesVolume', icon: './img/menu/volume_mute_icon.png', text: 'Volume', function:  function(){ SettingsOptionCtrl.updateDropdownOptions(settingsAudioSubtitlesVolume)} }

    ]};

  /**
   * AUDIO SUBTITLES EASY-TO-READ menu hierarchy structure
   * @level 2
   *
   * ╔═════════════════════════════════════╗
   * ║ (<)         Easy to Read            ║
   * ╠═════════════════════════════════════╣
   * ║ On                            Final ║
   * ║─────────────────────────────────────║
   * ║ Off                           Final ║
   * ╚═════════════════════════════════════╝
  */
  const settingsAudioSubtitlesEasyToRead = { title: 'EasytoRead', icon: './img/menu/easy_to_read.png', parent: settingsAudioSubtitles, final: true, options: [
    {optId: 'astEasyOn', text: 'On', function:  function(){ _AudioManager.setSubEasy(  true, getASTe2rURL() )} },
    {optId: 'astEasyOff', text: 'Off', function:  function(){ _AudioManager.setSubEasy( false, list_contents[demoId].ast[0][_AudioManager.getASTLanguage()] );} }
  ]};

  /**
   * AUDIO SUBTITLES PRESENTATION menu hierarchy structure
   * @level 2
   *
   * ╔═════════════════════════════════════╗
   * ║ (<)        Presetation              ║
   * ╠═════════════════════════════════════╣
   * ║ Voice of God                  Final ║
   * ║─────────────────────────────────────║
   * ║ Friend of Sofa                Final ║
   * ║─────────────────────────────────────║
   * ║ Placed on Action              Final ║
   * ╚═════════════════════════════════════╝
  */
const settingsAudioSubtitlesPresentation = { title: 'Presetation', icon: './img/menu/ad_presentation_mode.png', parent: settingsAudioSubtitles, final: true, options: [
    {optId: 'astPresentationVoGButton', text: 'Classic', function:  function(){ _AudioManager.setASTPresentation( 'VoiceOfGod' )} }, //TODO
    //{optId: 'astPresentationFoSButton', text: 'FriendofSofa', function:  function(){ _AudioManager.setASTPresentation( 'Friend' )} }, //TODO
    {optId: 'astPresentationPoAButton', text: 'Dynamic', function:  function(){ _AudioManager.setASTPresentation( 'Dynamic' )} } //TODO
  ]};

  /**
   * AUDIO SUBTITLES VOLUME menu hierarchy structure
   * @level 2
   *
   * ╔═════════════════════════════════════╗
   * ║ (<)          Volume                 ║
   * ╠═════════════════════════════════════╣
   * ║ Minimum                       Final ║
   * ║─────────────────────────────────────║
   * ║ Medium                        Final ║
   * ║─────────────────────────────────────║
   * ║ Maximum                       Final ║
   * ╚═════════════════════════════════════╝
  */
const settingsAudioSubtitlesVolume = { title: 'Volume', icon: './img/menu/volume_mute_icon.png', parent: settingsAudioSubtitles, final: true, options: [
    {optId: 'astVolumeMinButton', text: 'Minimum', function:  function(){ _AudioManager.setVolume( 'AST', 10 )} },
    {optId: 'astVolumeMidButton', text: 'Medium', function:  function(){ _AudioManager.setVolume( 'AST', 50 )} },
    {optId: 'astVolumeMaxButton', text: 'Maximum', function:  function(){ _AudioManager.setVolume( 'AST', 100 )} }
  ]};
