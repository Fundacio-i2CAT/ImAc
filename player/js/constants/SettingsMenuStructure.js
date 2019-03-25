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
const settingsDropdownOpt = { parent: -1, options: [
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
const generalSettings = { parent: settingsDropdownOpt, options: [
    {optId: 'settingsLanguages', text: 'UI Languages', function: 'open settingsUILanguages'},
    {optId: 'settingsVoiceControl', text: 'Voice Control', function: 'open settigsVoiceControl'},
    {optId: 'settingsMenuType', text: 'Menu Type', function: 'open settingsMenuType'},
    {optId: 'settingsPointerSize', text: 'Pointer Size', function: 'open settingsPointerSize'},
    {optId: 'settingsUserProfile', text: 'User Profile', function: 'open settingsUserProfile'},
    {optId: 'settingsAccessLanguage', text: 'Acces Language', function: 'open settingsAccesLanguages'}, //NEW LANG
    {optId: 'settingsIndicator', text: 'Indicator', function: 'open settingsIndicator'}, //NEW INDIC
    {optId: 'settingsSafeArea', text: 'Safe Area', function: ''}
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
const settingsUILanguages = { parent: generalSettings, options: [
    {optId: 'settingsUILanguageEngButton', text: 'English', function: ''}, //default: MenuDictionary.checkMainLanguage( 'en' ) },
    {optId: 'settingsUILanguageEspButton', text: 'Español', function: ''}, // default: MenuDictionary.checkMainLanguage( 'es' )},
    {optId: 'settingsUILanguageGerButton', text: 'Deutsch', function: ''}, // default: MenuDictionary.checkMainLanguage( 'de' )},
    {optId: 'settingsUILanguageCatButton', text: 'Català', function: ''} // default: MenuDictionary.checkMainLanguage( 'ca' )}];
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
const settigsVoiceControl = { parent: generalSettings, options: [
    {optId: 'voiceControlOnButton', text: 'On', function: ''}, // default: false},
    {optId: 'voiceControlOffButton', text: 'Off', function: ''} // default: true}];
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
const settingsMenuType = { parent: generalSettings, options: [
    {optId: 'settingsMenuTraditionalButton', text: 'Traditional', function: ''}, //default: settingsMgr.checkMenuType(2)},
    {optId: 'settingsMenuLowSightedButton', text: 'Enhanced-Accessibility', function: ''} //default: settingsMgr.checkMenuType(1)}];
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
const settingsPointerSize = { parent: generalSettings, options: [
    {optId: 'settingsMenuPointerLarge', text: 'Large', function: ''}, // default: false},
    {optId: 'settingsMenuPointerMedium', text: 'Medium', function: ''}, //default: true},
    {optId: 'settingsMenuPointerSmall', text: 'Small', function: ''} //default: false}];
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
const settingsUserProfile = { parent: generalSettings, options: [
    {optId: 'saveUserProfileButton', text: 'Save', function: ''} // default: false}];
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
const settingsAccesLanguages = { parent: generalSettings, options: [
    {optId: 'settingsAccesLanguageEngButton', text: 'English', function: ''}, //default: MenuDictionary.checkMainLanguage( 'en' ) },
    {optId: 'settingsAccesLanguageEspButton', text: 'Español', function: ''}, // default: MenuDictionary.checkMainLanguage( 'es' )},
    {optId: 'settingsAccesLanguageGerButton', text: 'Deutsch', function: ''}, // default: MenuDictionary.checkMainLanguage( 'de' )},
    {optId: 'settingsAccesLanguageCatButton', text: 'Català', function: ''} // default: MenuDictionary.checkMainLanguage( 'ca' )}];
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
const settingsIndicator = { parent: generalSettings, options: [
    {optId: 'settingsIndicatorNone', text: 'None', function: ''}, // default: false},
    {optId: 'settingsIndicatorArrows', text: 'Arrows', function: ''}, //default: true},
    {optId: 'settingsIndicatorRadar', text: 'Radar', function: ''} //default: false}];ç
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
const settingsSafeArea = { parent: generalSettings, options: [
    {optId: 'settingsSafeAreaSmall', text: 'Small', function: ''}, //default: false}];
    {optId: 'settingsSafeAreaLarge', text: 'Large', function: ''} // default: false},
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
const settingsSubtitles = { parent: settingsDropdownOpt, options: [
    { optId: 'subtitlesSizes', text: 'Size', function: ''},
    { optId: 'subtitlesBackground', text: 'Background', function: ''},
    { optId: 'subtitlesShowPositions', text: 'Position', function: ''},
    { optId: 'subtitlesEasyRead', text: 'Easy to read', function: ''}
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
const settingsSubtitlesSize = { parent: settingsSubtitles, options: [
    {optId: 'subtitlesSmallSizeButton', text: 'Small', function: ''},
    {optId: 'subtitlesMediumSizeButton', text: 'Medium', function: ''},
    {optId: 'subtitlesLargeSizeButton', text: 'Large', function: ''}
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
  const settingsSubtitlesBackground = { parent: settingsSubtitles, options: [
    {optId: 'subtitlesSemitrans', text: 'Semitrans', function: ''},
    {optId: 'subtitlesOutline', text: 'Outline', function: ''}
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
  const settingsSubtitlesPosition = { parent: settingsSubtitles, options: [
    {optId: 'subtitlesTopButton', text: 'Top', function: ''},
    {optId: 'subtitlesBottomButton', text: 'Bottom', function: ''}
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
  const settingsSubtitlesEasyToRead = { parent: settingsSubtitles, options: [
    {optId: 'subtitlesEasyOn', text: 'On', function: ''},
    {optId: 'subtitlesEasyOff', text: 'Off', function: ''}
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
  const settingsSignLanguage = { parent: settingsDropdownOpt, options: [
    { optId: 'signerPosition', text: 'Position', function: ''},
    { optId: 'signerSize', text: 'Size', function: ''}
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
  const settingsSignLanguagePosition = { parent: settingsSignLanguage, options: [
    {optId: 'signerRightButton', text: 'Right', function: ''},
    {optId: 'signerLeftButton', text: 'Left', function: ''}
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
const settingsSignLanguageSize = { parent: settingsSignLanguage, options: [
    {optId: 'signerSmallSizeButton', text: 'Small', function: ''},
    {optId: 'signerMediumSizeButton', text: 'Medium', function: ''},
    {optId: 'signerLargeSizeButton', text: 'Large', function: ''}
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
  const settingsAudioDescription = { parent: settingsDropdownOpt, options: [
    { optId: 'audioDescriptionPresentation', text: 'Presentation', function: ''},
    { optId: 'audioDescriptionVolume', text: 'Volume', function: ''}
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
const settingsAudioDescriptionPresentation = { parent: settingsAudioDescription, options: [
    {optId: 'adPresentationVoGButton', text: 'Voice of God', function: ''},
    {optId: 'adPresentationFoSButton', text: 'Friend of Sofa', function: ''},
    {optId: 'adPresentationPoAButton', text: 'Placed on Action', function: ''}
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
const settingsAudioDescriptionVolume = { parent: settingsAudioDescription, options: [
    {optId: 'adVolumeMinButton', text: 'Minimum', function: ''},
    {optId: 'adVolumeMidButton', text: 'Medium', function: ''},
    {optId: 'adVolumeMaxButton', text: 'Maximum', function: ''}
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

  const settingsAudioSubtitles = { parent: settingsDropdownOpt, options: [
      { optId: 'audioSubtitlesEasy', text: 'Easy to read', function: ''},
      { optId: 'audioSubtitlesPresentation', text: 'Presentation Mode', function: ''},
      { optId: 'audioSubtitlesVolume', text: 'Volume Level', function: ''}

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
  const settingsAudioSubtitlesEasyToRead = { parent: settingsAudioSubtitles, options: [
    {optId: 'astEasyOn', text: 'On', function: ''},
    {optId: 'astEasyOff', text: 'Off', function: ''}
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
const settingsAudioSubtitlesPresentation = { parent: settingsAudioSubtitles, options: [
    {optId: 'astPresentationVoGButton', text: 'Voice of God', function: ''},
    {optId: 'astPresentationFoSButton', text: 'Friend of Sofa', function: ''},
    {optId: 'astPresentationPoAButton', text: 'Placed on Action', function: ''}
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
const settingsAudioSubtitlesVolume = { parent: settingsAudioSubtitles, options: [
    {optId: 'astVolumeMinButton', text: 'Minimum', function: ''},
    {optId: 'astVolumeMidButton', text: 'Medium', function: ''},
    {optId: 'astVolumeMaxButton', text: 'Maximum', function: ''}
  ]};
