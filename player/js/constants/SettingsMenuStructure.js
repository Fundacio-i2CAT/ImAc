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
 * ║ Subtitles (ST)                 (>)  ║
 * ║─────────────────────────────────────║
 * ║ Sign Language (SL)             (>)  ║
 * ║─────────────────────────────────────║
 * ║ Audio Description (AD)         (>)  ║
 * ║─────────────────────────────────────║
 * ║ Audio Subtitles (AST)          (>)  ║
 * ╚═════════════════════════════════════╝
*/
//MenuDictionary.translate('Settings')
const settingsDropdownOpt = {title: 'Settings', final: false, options: [
    {optId: 'settingsGeneral', text: 'General', function: function(){ return SettingsOptionCtrl.updateDropdownOptions(generalSettings)} },
    {optId: 'settingsST', text: 'Subtitles', function: function(){ return SettingsOptionCtrl.updateDropdownOptions(settingsSubtitles)} },
    {optId: 'settingsSL', text: 'Sign Language', function: function(){ return SettingsOptionCtrl.updateDropdownOptions(settingsSignLanguage)} },
    {optId: 'settingsAD', text: 'Audio Description', function: function(){ return SettingsOptionCtrl.updateDropdownOptions(settingsAudioDescription)} },
    {optId: 'settingsAST', text: 'Audio Subtitles', function: function(){ return SettingsOptionCtrl.updateDropdownOptions(settingsAudioSubtitles)} }
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
 * ║ Menu Type                      (>)  ║
 * ║─────────────────────────────────────║
 * ║ Pointer Size                   (>)  ║
 * ║─────────────────────────────────────║
 * ║ User Profile                   (>)  ║
 * ║─────────────────────────────────────║
 * ║ Acces Language                 (>)  ║
 * ║─────────────────────────────────────║
 * ║ Indicator                      (>)  ║
 * ║─────────────────────────────────────║
 * ║ Safe Area                      (>)  ║
 * ╚═════════════════════════════════════╝
  */
const generalSettings = { parent: settingsDropdownOpt, final: false, options: [
    {optId: 'settingsLanguages', text: 'UI Languages', function: function(){ return SettingsOptionCtrl.updateDropdownOptions(settingsUILanguages)} },
    {optId: 'settingsVoiceControl', text: 'Voice Control', function: function(){ return SettingsOptionCtrl.updateDropdownOptions(settigsVoiceControl)} },
    {optId: 'settingsMenuType', text: 'Menu Type', function: function(){ return SettingsOptionCtrl.updateDropdownOptions(settingsMenuType)} },
    {optId: 'settingsPointerSize', text: 'Pointer Size', function: function(){ return SettingsOptionCtrl.updateDropdownOptions(settingsPointerSize)} },
    {optId: 'settingsUserProfile', text: 'User Profile', function: function(){ return SettingsOptionCtrl.updateDropdownOptions(settingsUserProfile)} },
    {optId: 'settingsAccessLanguage', text: 'Acces Language', function: function(){ return SettingsOptionCtrl.updateDropdownOptions(settingsAccesLanguages)} }, //NEW LANG
    {optId: 'settingsIndicator', text: 'Indicator', function: function(){ return SettingsOptionCtrl.updateDropdownOptions(settingsIndicator)} }, //NEW INDIC
    {optId: 'settingsSafeArea', text: 'Safe Area', function: function(){ return SettingsOptionCtrl.updateDropdownOptions(settingsSafeArea)} }
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
const settingsUILanguages = { parent: generalSettings, final: true, options: [
    {optId: 'settingsUILanguageEngButton', text: 'English', function:  function(){ return console.log()} }, //default: MenuDictionary.checkMainLanguage( 'en' ) },
    {optId: 'settingsUILanguageEspButton', text: 'Español', function:  function(){ return console.log()} }, // default: MenuDictionary.checkMainLanguage( 'es' )},
    {optId: 'settingsUILanguageGerButton', text: 'Deutsch', function:  function(){ return console.log()} }, // default: MenuDictionary.checkMainLanguage( 'de' )},
    {optId: 'settingsUILanguageCatButton', text: 'Català', function:  function(){ return console.log()} } // default: MenuDictionary.checkMainLanguage( 'ca' )}];
  ]};

/**
 * VOICE CONTROL menu hierarchy structure
 * @level 2
 * ╔═════════════════════════════════════╗
 * ║ (<)       Voice Control             ║
 * ╠═════════════════════════════════════╣
 * ║ ON                            Final ║
 * ║─────────────────────────────────────║
 * ║ OFF                           Final ║
 * ╚═════════════════════════════════════╝
*/
const settigsVoiceControl = { parent: generalSettings, final: true, options: [
    {optId: 'voiceControlOnButton', text: 'On', function:  function(){ return console.log()} }, // default: false},
    {optId: 'voiceControlOffButton', text: 'Off', function:  function(){ return console.log()} } // default: true}];
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
const settingsMenuType = { parent: generalSettings, final: true, options: [
    {optId: 'settingsMenuTraditionalButton', text: 'Traditional', function:  function(){ return console.log()} }, //default: settingsMgr.checkMenuType(2)},
    {optId: 'settingsMenuLowSightedButton', text: 'Enhanced-Accessibility', function:  function(){ return console.log()} } //default: settingsMgr.checkMenuType(1)}];
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
const settingsPointerSize = { parent: generalSettings, final: true, options: [
    {optId: 'settingsMenuPointerLarge', text: 'Large', function:  function(){ return console.log()} }, // default: false},
    {optId: 'settingsMenuPointerMedium', text: 'Medium', function:  function(){ return console.log()} }, //default: true},
    {optId: 'settingsMenuPointerSmall', text: 'Small', function:  function(){ return console.log()} } //default: false}];
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
const settingsUserProfile = { parent: generalSettings, final: true, options: [
    {optId: 'saveUserProfileButton', text: 'Save', function:  function(){ return console.log()} } // default: false}];
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
const settingsAccesLanguages = { parent: generalSettings, final: true, options: [
    {optId: 'settingsAccesLanguageEngButton', text: 'English', function:  function(){ return console.log()} }, //default: MenuDictionary.checkMainLanguage( 'en' ) },
    {optId: 'settingsAccesLanguageEspButton', text: 'Español', function:  function(){ return console.log()} }, // default: MenuDictionary.checkMainLanguage( 'es' )},
    {optId: 'settingsAccesLanguageGerButton', text: 'Deutsch', function:  function(){ return console.log()} }, // default: MenuDictionary.checkMainLanguage( 'de' )},
    {optId: 'settingsAccesLanguageCatButton', text: 'Català', function:  function(){ return console.log()} } // default: MenuDictionary.checkMainLanguage( 'ca' )}];
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
const settingsIndicator = { parent: generalSettings, final: true, options: [
    {optId: 'settingsIndicatorNone', text: 'None', function:  function(){ return console.log()} }, // default: false},
    {optId: 'settingsIndicatorArrows', text: 'Arrows', function:  function(){ return console.log()} }, //default: true},
    {optId: 'settingsIndicatorRadar', text: 'Radar', function:  function(){ return console.log()} } //default: false}];ç
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
const settingsSafeArea = { parent: generalSettings, final: true, options: [
    {optId: 'settingsSafeAreaSmall', text: 'Small', function:  function(){ return console.log()} }, //default: false}];
    {optId: 'settingsSafeAreaLarge', text: 'Large', function:  function(){ return console.log()} } // default: false},
  ]};


  /*************************************************************************************************************************************
   *                                               S U B T I T L E S    (ST)
  **************************************************************************************************************************************/

/**
 * SUBTITLES (ST) menu hierarchy structure
 * @level 1
 *
 * ╔═════════════════════════════════════╗
 * ║ (<)        Subtitles (ST)           ║
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
const settingsSubtitles = { parent: settingsDropdownOpt, final: false, options: [
    { optId: 'subtitlesSizes', text: 'Size', function:  function(){ return SettingsOptionCtrl.updateDropdownOptions(settingsSubtitlesSize)} },
    { optId: 'subtitlesBackground', text: 'Background', function:  function(){ return SettingsOptionCtrl.updateDropdownOptions(settingsSubtitlesBackground)} },
    { optId: 'subtitlesShowPositions', text: 'Position', function:  function(){ return SettingsOptionCtrl.updateDropdownOptions(settingsSubtitlesPosition)} },
    { optId: 'subtitlesEasyRead', text: 'Easy to read', function:  function(){ return SettingsOptionCtrl.updateDropdownOptions(settingsSubtitlesEasyToRead)} }
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
const settingsSubtitlesSize = { parent: settingsSubtitles, final: true, options: [
    {optId: 'subtitlesSmallSizeButton', text: 'Small', function:  function(){ return console.log()} },
    {optId: 'subtitlesMediumSizeButton', text: 'Medium', function:  function(){ return console.log()} },
    {optId: 'subtitlesLargeSizeButton', text: 'Large', function:  function(){ return console.log()} }
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
  const settingsSubtitlesBackground = { parent: settingsSubtitles, final: true, options: [
    {optId: 'subtitlesSemitrans', text: 'Semitrans', function:  function(){ return console.log()} },
    {optId: 'subtitlesOutline', text: 'Outline', function:  function(){ return console.log()} }
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
  const settingsSubtitlesPosition = { parent: settingsSubtitles, final: true, options: [
    {optId: 'subtitlesTopButton', text: 'Top', function:  function(){ return console.log()} },
    {optId: 'subtitlesBottomButton', text: 'Bottom', function:  function(){ return console.log()} }
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
  const settingsSubtitlesEasyToRead = { parent: settingsSubtitles, final: true, options: [
    {optId: 'subtitlesEasyOn', text: 'On', function:  function(){ return console.log()} },
    {optId: 'subtitlesEasyOff', text: 'Off', function:  function(){ return console.log()} }
  ]};


  /*************************************************************************************************************************************
   *                                               S I G N    L A N G U A G E    (SL)
  **************************************************************************************************************************************/

  /**
  * SIGN LANGUAGE (SL) menu hierarchy structure
  * @level 1
  *
  * ╔═════════════════════════════════════╗
  * ║ (<)     Sign Language (SL)          ║
  * ╠═════════════════════════════════════╣
  * ║ Position                       (>)  ║
  * ║─────────────────────────────────────║
  * ║ Size                           (>)  ║
  * ╚═════════════════════════════════════╝
  */
  const settingsSignLanguage = { parent: settingsDropdownOpt, final: false, options: [
    { optId: 'signerPosition', text: 'Position', function:  function(){ return SettingsOptionCtrl.updateDropdownOptions(settingsSignLanguagePosition)} },
    { optId: 'signerSize', text: 'Size', function:  function(){ return SettingsOptionCtrl.updateDropdownOptions(settingsSignLanguageSize)} }
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
  const settingsSignLanguagePosition = { parent: settingsSignLanguage, final: true, options: [
    {optId: 'signerRightButton', text: 'Right', function:  function(){ return console.log()} },
    {optId: 'signerLeftButton', text: 'Left', function:  function(){ return console.log()} }
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
const settingsSignLanguageSize = { parent: settingsSignLanguage, final: true, options: [
    {optId: 'signerSmallSizeButton', text: 'Small', function:  function(){ return console.log()} },
    {optId: 'signerMediumSizeButton', text: 'Medium', function:  function(){ return console.log()} },
    {optId: 'signerLargeSizeButton', text: 'Large', function:  function(){ return console.log()} }
  ]};


/*************************************************************************************************************************************
 *                                        A U D I O   D E S C R I P T I O N   (AD)
**************************************************************************************************************************************/

  /**
  * AUDIO DESCRIPTION (AD) menu hierarchy structure
  * @level 1
  *
  * ╔═════════════════════════════════════╗
  * ║ (<)   Audio Description (AD)        ║
  * ╠═════════════════════════════════════╣
  * ║ Presentation Mode              (>)  ║
  * ║─────────────────────────────────────║
  * ║ Volume Level                   (>)  ║
  * ╚═════════════════════════════════════╝
  */
  const settingsAudioDescription = { parent: settingsDropdownOpt, final: false, options: [
    { optId: 'audioDescriptionPresentation', text: 'Presentation', function:  function(){ return SettingsOptionCtrl.updateDropdownOptions(settingsAudioDescriptionPresentation)} },
    { optId: 'audioDescriptionVolume', text: 'Volume', function:  function(){ return SettingsOptionCtrl.updateDropdownOptions(settingsAudioDescriptionVolume)} }
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
const settingsAudioDescriptionPresentation = { parent: settingsAudioDescription, final: true, options: [
    {optId: 'adPresentationVoGButton', text: 'Voice of God', function:  function(){ return console.log()} },
    {optId: 'adPresentationFoSButton', text: 'Friend of Sofa', function:  function(){ return console.log()} },
    {optId: 'adPresentationPoAButton', text: 'Placed on Action', function:  function(){ return console.log()} }
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
const settingsAudioDescriptionVolume = { parent: settingsAudioDescription, final: true, options: [
    {optId: 'adVolumeMinButton', text: 'Minimum', function:  function(){ return console.log()} },
    {optId: 'adVolumeMidButton', text: 'Medium', function:  function(){ return console.log()} },
    {optId: 'adVolumeMaxButton', text: 'Maximum', function:  function(){ return console.log()} }
  ]};


  /*************************************************************************************************************************************
   *                                            A U D I O   S U B T I T L E S    (AST)
  **************************************************************************************************************************************/

  /**
  * AUDIO SUBTITLES (AST) menu hierarchy structure
  * @level 1
  *
  * ╔═════════════════════════════════════╗
  * ║ (<)    Audio Subtitles (AST)        ║
  * ╠═════════════════════════════════════╣
  * ║ Easy-to-Read                   (>)  ║
  * ║─────────────────────────────────────║
  * ║ Presentation Mode              (>)  ║
  * ║─────────────────────────────────────║
  * ║ Volume Level                   (>)  ║
  * ╚═════════════════════════════════════╝
  */

  const settingsAudioSubtitles = { parent: settingsDropdownOpt, final: false, options: [
      { optId: 'audioSubtitlesEasy', text: 'Easy to read', function:  function(){ return SettingsOptionCtrl.updateDropdownOptions(settingsAudioSubtitlesEasyToRead)} },
      { optId: 'audioSubtitlesPresentation', text: 'Presentation Mode', function:  function(){ return SettingsOptionCtrl.updateDropdownOptions(settingsAudioSubtitlesPresentation)} },
      { optId: 'audioSubtitlesVolume', text: 'Volume Level', function:  function(){ return SettingsOptionCtrl.updateDropdownOptions(settingsAudioSubtitlesVolume)} }

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
  const settingsAudioSubtitlesEasyToRead = { parent: settingsAudioSubtitles, final: true, options: [
    {optId: 'astEasyOn', text: 'On', function:  function(){ return console.log()} },
    {optId: 'astEasyOff', text: 'Off', function:  function(){ return console.log()} }
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
const settingsAudioSubtitlesPresentation = { parent: settingsAudioSubtitles, final: true, options: [
    {optId: 'astPresentationVoGButton', text: 'Voice of God', function:  function(){ return console.log()} },
    {optId: 'astPresentationFoSButton', text: 'Friend of Sofa', function:  function(){ return console.log()} },
    {optId: 'astPresentationPoAButton', text: 'Placed on Action', function:  function(){ return console.log()} }
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
const settingsAudioSubtitlesVolume = { parent: settingsAudioSubtitles, final: true, options: [
    {optId: 'astVolumeMinButton', text: 'Minimum', function:  function(){ return console.log()} },
    {optId: 'astVolumeMidButton', text: 'Medium', function:  function(){ return console.log()} },
    {optId: 'astVolumeMaxButton', text: 'Maximum', function:  function(){ return console.log()} }
  ]};
