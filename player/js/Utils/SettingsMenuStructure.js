/**
 * SettingsMenuStructure.js
 * 
 * This module has a list of object varibales that describe the different menu settings dropdowns.
 * Each object follows the same structure although you may find that some of them don't have all the possible attributes (config purpose). 
 */
 
/* *************************************** S E T T I N G S ***************************************
 * ╔═════════════════════════════════════╗
 * ║            Settings              X  ║
 * ╠═════════════════════════════════════╣
 * ║ General                             ║
 * ║─────────────────────────────────────║
 * ║ Access                              ║
 * ║─────────────────────────────────────║
 * ║ [=] Subtitles                       ║
 * ║─────────────────────────────────────║
 * ║ [>] Sign Language                   ║
 * ║─────────────────────────────────────║
 * ║ [o] Audio Description               ║
 * ║─────────────────────────────────────║
 * ║ [··] Audio Subtitles                ║
 * ╚═════════════════════════════════════╝
 * Visual example of dropdown
 *
 * @typedef  {Object}   settingsDropdownOpt    Level 0.
 * @property {string}   title                  The title shown in the dropdown menu.
 * @property {boolean}  final                  Is the dropdown in the last level.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].icon         Icon path.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].available    Function that returns a bool true if option os available, false if option has to be omitted.
 * @property {function} options[].function     Function executed when option is clicked. 
 */
const settingsDropdownOpt = {title: 'Settings', final: false, options: [
    { optId: 'settingsGeneral', icon: './img/menu/settings_icon.png', text: 'General', 
        function: function(){ 
            SettingsOptionCtrl.updateDropdownOptions(generalSettings); 
        }
    },
    { optId: 'settingsAccess', icon: './img/menu/accessibility_icon.png', text: 'Access', 
        function: function(){ 
            SettingsOptionCtrl.updateDropdownOptions(accessSettings);
        } 
    },
    { optId: 'settingsST', icon: './img/acc_serv_icon/st_off.png', text: 'Subtitles', 
        available: function() { return subController.checkisSubAvailable() },
        function: function(){
            SettingsOptionCtrl.updateDropdownOptions(settingsSubtitles);
        } 
    },
    { optId: 'settingsSL', icon: './img/acc_serv_icon/sl_off.png', text: 'Signlanguage', 
        available: function() { return subController.checkisSignAvailable() },
        function: function(){ 
            SettingsOptionCtrl.updateDropdownOptions(settingsSignLanguage);
        } 
    },
    { optId: 'settingsAD', icon: './img/acc_serv_icon/ad_off.png', text: 'Audiodescription', 
        available: function() { return _AudioManager.checkisADAvailable() },
        function: function(){ 
            SettingsOptionCtrl.updateDropdownOptions(settingsAudioDescription);
        } 
    },
    { optId: 'settingsAST', icon: './img/acc_serv_icon/ast_off.png', text: 'Audiosubtitles', 
        available: function() { return _AudioManager.checkisASTAvailable() },
        function: function(){ 
            SettingsOptionCtrl.updateDropdownOptions(settingsAudioSubtitles);
        } 
    }]
};

/* *************************************** G E N E R A L ***************************************                             
 * ╔═════════════════════════════════════╗
 * ║ (<)        General               X  ║
 * ╠═════════════════════════════════════╣
 * ║ UI Languages                        ║
 * ║─────────────────────────────────────║
 * ║ Voice Control                       ║
 * ║─────────────────────────────────────║
 * ║ Pointer Size                        ║
 * ║─────────────────────────────────────║
 * ║ User Profile                        ║
 * ╚═════════════════════════════════════╝
 * Visual example of dropdown
 *
 * @typedef  {Object}   generalSettings        Level 1.
 * @property {string}   title                  The title shown in the dropdown menu.
 * @property {string}   icon                   Icon path.
 * @property {Object}   parent                  Reference to previews dropdown menu for back navigation.
 * @property {boolean}  final                  Is the dropdown in the last level.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].icon         Icon path.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].function     Function executed when option is clicked.
 */
const generalSettings = { title: 'General', icon: './img/menu/settings_icon.png', parent: settingsDropdownOpt, final: false, options: [
    { optId: 'settingsLanguages', icon: './img/menu/language.png', text: 'Language', 
        function: function(){ 
            SettingsOptionCtrl.updateDropdownOptions(settingsUILanguages);
        } 
    },
    { optId: 'settingsVoiceControl', icon: './img/menu/voice_control.png', text: 'VoiceControl', 
        function: function(){ 
            SettingsOptionCtrl.updateDropdownOptions(settigsVoiceControl);
        } 
    },
    { optId: 'settingsPointerSize', icon: './img/menu/pointer_size.png', text: 'PointerSize', 
        function: function(){ 
            SettingsOptionCtrl.updateDropdownOptions(settingsPointerSize);
        } 
    },
    { optId: 'settingsUserProfile', icon: './img/menu/user_profile.png', text: 'UserProfile', 
        function: function(){ 
            SettingsOptionCtrl.updateDropdownOptions(settingsUserProfile);
        } 
    }]
};

/* *************************************** UI  L A N G U A G E S ***************************************
 * ╔═════════════════════════════════════╗
 * ║ (<)       UI Languages           X  ║
 * ╠═════════════════════════════════════╣
 * ║ English                       Final ║
 * ║─────────────────────────────────────║
 * ║ Español                       Final ║
 * ║─────────────────────────────────────║
 * ║ Deutsch                       Final ║
 * ║─────────────────────────────────────║
 * ║ Català                        Final ║
 * ╚═════════════════════════════════════╝
 * Visual example of dropdown
 *
 * @typedef  {Object}   settingsUILanguages    Level 2.
 * @property {string}   title                  The title shown in the dropdown menu.
 * @property {string}   icon                   Icon path.
 * @property {Object}   parent                  Reference to previews dropdown menu for back navigation.
 * @property {boolean}  final                  Is the dropdown in the last level.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].default      Function that returns a bool true if option is default and starts in yellow.
 * @property {function} options[].function     Function executed when option is clicked.
 */
const settingsUILanguages = { title: 'Language', icon: './img/menu/language.png', parent: generalSettings, final: true, options: [
    { optId: 'settingsUILanguageEngButton', text: 'English',
        default: function(){ return MenuDictionary.checkMainLanguage('en') },
        function:  function(){ 
            MenuFunctionsManager.getMainLanguageFunc('en');
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsUILanguages.options[0].optId);
        }
    }, 
    { optId: 'settingsUILanguageEspButton', text: 'Español', 
        default: function(){ return MenuDictionary.checkMainLanguage('es') },
        function:  function(){ 
            MenuFunctionsManager.getMainLanguageFunc('es');
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsUILanguages.options[1].optId);
        }
    }, 
    { optId: 'settingsUILanguageGerButton', text: 'Deutsch', 
        default: function(){ return MenuDictionary.checkMainLanguage('de') },
        function:  function(){ 
            MenuFunctionsManager.getMainLanguageFunc('de');
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsUILanguages.options[2].optId);
        } 
    }, 
    { optId: 'settingsUILanguageCatButton', text: 'Català', 
        default: function(){ return MenuDictionary.checkMainLanguage('ca') },
        function:  function(){ 
            MenuFunctionsManager.getMainLanguageFunc('ca');
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsUILanguages.options[3].optId);
        } 
    }]
};

/* *************************************** V O I C E  C O N T R O L ***************************************
 * ╔═════════════════════════════════════╗
 * ║ (<)       Voice Control          X  ║
 * ╠═════════════════════════════════════╣
 * ║ ON                            Final ║
 * ║─────────────────────────────────────║
 * ║ OFF                           Final ║
 * ╚═════════════════════════════════════╝
 * Visual example of dropdown
 *
 * @typedef  {Object}   settigsVoiceControl    Level 2.
 * @property {string}   title                  The title shown in the dropdown menu.
 * @property {string}   icon                   Icon path.
 * @property {Object}   parent                  Reference to previews dropdown menu for back navigation.
 * @property {boolean}  final                  Is the dropdown in the last level.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].default      Function that returns a bool true if option is default and starts in yellow.
 * @property {function} options[].function     Function executed when option is clicked.
 */
const settigsVoiceControl = { title: 'VoiceControl', icon: './img/menu/voice_control.png', parent: generalSettings, final: true, options: [
    { optId: 'voiceControlOnButton', text: 'On', 
        default: function(){ return _ws_vc != undefined },
        function:  function(){ 
            connectVoiceControl( localStorage.ImAc_voiceControlId, "http://51.89.138.157:3000/" );
            SettingsOptionCtrl.setChildColumnActiveOpt(settigsVoiceControl.options[0].optId);
        } 
    }, 
    { optId: 'voiceControlOffButton', text: 'Off', 
        default: function(){ return _ws_vc == undefined },
        function:  function(){ 
            console.log();
            SettingsOptionCtrl.setChildColumnActiveOpt(settigsVoiceControl.options[1].optId);
        } 
    }]
};

/* *************************************** P O I N T E R   S I Z E ***************************************
 * ╔═════════════════════════════════════╗
 * ║ (<)       Pointer Size           X  ║
 * ╠═════════════════════════════════════╣
 * ║ Large                         Final ║
 * ║─────────────────────────────────────║
 * ║ Medium                        Final ║
 * ║─────────────────────────────────────║
 * ║ Small                         Final ║
 * ╚═════════════════════════════════════╝
 * Visual example of dropdown
 *
 * @typedef  {Object}   settingsPointerSize    Level 2.
 * @property {string}   title                  The title shown in the dropdown menu.
 * @property {string}   icon                   Icon path.
 * @property {Object}   parent                  Reference to previews dropdown menu for back navigation.
 * @property {boolean}  final                  Is the dropdown in the last level.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].default      Function that returns a bool true if option is default and starts in yellow.
 * @property {function} options[].function     Function executed when option is clicked.
 */
const settingsPointerSize = { title: 'PointerSize', icon: './img/menu/pointer_size.png', parent: generalSettings, final: true, options: [
    { optId: 'settingsMenuPointerSmall', text: 'Small', 
        default: function(){ return _pointerSize == 0.6 },
        function:  function(){ 
            MenuFunctionsManager.getChangePointerSizeFunc(0.6);
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsPointerSize.options[0].optId);
        }
    },
    { optId: 'settingsMenuPointerMedium', text: 'Medium', 
        default: function(){ return _pointerSize == 1 },
        function:  function(){ 
            MenuFunctionsManager.getChangePointerSizeFunc(1);
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsPointerSize.options[1].optId);
        } 
    }, 
    { optId: 'settingsMenuPointerLarge', text: 'Large', 
        default: function(){ return _pointerSize == 2 },
        function:  function(){ 
            MenuFunctionsManager.getChangePointerSizeFunc(2);
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsPointerSize.options[2].optId);
        } 
    }]
};

/* *************************************** U S E R   P R O F I L E ***************************************
 * ╔═════════════════════════════════════╗
 * ║ (<)       User Profile           X  ║
 * ╠═════════════════════════════════════╣
 * ║ Save                          Final ║
 * ╚═════════════════════════════════════╝
 * Visual example of dropdown
 *
 * @typedef  {Object}   settingsUserProfile    Level 2.
 * @property {string}   title                  The title shown in the dropdown menu.
 * @property {string}   icon                   Icon path.
 * @property {Object}   parent                  Reference to previews dropdown menu for back navigation.
 * @property {boolean}  final                  Is the dropdown in the last level.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].function     Function executed when option is clicked.
 */
const settingsUserProfile = { title: 'UserProfile', icon: './img/menu/user_profile.png', parent: generalSettings, final: true, options: [
    { optId: 'saveUserProfileButton', text: 'Save', 
        function:  function(){ 
            saveConfig();
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsUserProfile.options[0].optId);
        } 
    }]
};


/* ***************************************  A C C E S S ***************************************                
 * ╔═════════════════════════════════════╗
 * ║ (<)        Access Settings       X  ║
 * ╠═════════════════════════════════════╣
 * ║ Acces Language                      ║
 * ║─────────────────────────────────────║
 * ║ Indicator                           ║
 * ║─────────────────────────────────────║
 * ║ Safe Area                           ║
 * ╚═════════════════════════════════════╝
 * Visual example of dropdown
 *
 * @typedef  {Object}   accessSettings         Level 1.
 * @property {string}   title                  The title shown in the dropdown menu.
 * @property {string}   icon                   Icon path.
 * @property {Object}   parent                 Reference to previews dropdown menu for back navigation.
 * @property {boolean}  final                  Is the dropdown in the last level.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].icon         Icon path.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].available    Function that returns a bool true if option os available, false if option has to be omitted.
 * @property {function} options[].function     Function executed when option is clicked.
 */
const accessSettings = { title: 'Access', icon: './img/menu/accessibility_icon.png', parent: settingsDropdownOpt, final: false, options: [
    { optId: 'settingsAccessLanguage', icon: './img/menu/language.png', text: 'Language', 
        available: function(){ return MenuDictionary.getAvailableLanguage()},
        function: function(){ 
            SettingsOptionCtrl.updateDropdownOptions(settingsAccesLanguages);
        } 
    },
    { optId: 'settingsIndicator', icon: './img/menu/indicator.png', text: 'Indicator', 
        function: function(){ 
            SettingsOptionCtrl.updateDropdownOptions(settingsIndicator);
        } 
    }, 
    { optId: 'settingsSafeArea', icon: './img/menu/safe_area.png', text: 'SafeArea', 
        function: function(){ 
            SettingsOptionCtrl.updateDropdownOptions(settingsSafeArea);
        } 
    }]
};

/* *************************************** A C C E S S   L A N G U A G E S ***************************************
 * ╔═════════════════════════════════════╗
 * ║ (<)    Access Languages          X  ║
 * ╠═════════════════════════════════════╣
 * ║ English                       Final ║
 * ║─────────────────────────────────────║
 * ║ Español                       Final ║
 * ║─────────────────────────────────────║
 * ║ Deutsch                       Final ║
 * ║─────────────────────────────────────║
 * ║ Català                        Final ║
 * ╚═════════════════════════════════════╝
 * Visual example of dropdown
 *
 * @typedef  {Object}   settingsAccesLanguages Level 2.
 * @property {string}   title                  The title shown in the dropdown menu.
 * @property {string}   icon                   Icon path.
 * @property {Object}   parent                 Reference to previews dropdown menu for back navigation.
 * @property {boolean}  final                  Is the dropdown in the last level.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].available    Function that returns a bool true if option os available, false if option has to be omitted.
 * @property {function} options[].default      Function that returns a bool true if option is default and starts in yellow.
 * @property {function} options[].function     Function executed when option is clicked.
 */
const settingsAccesLanguages = { title: 'Language', icon: './img/menu/language.png', parent: accessSettings, final: true, options: [
    { optId: 'settingsAccesLanguageEngButton', text: 'English', 
        available: function() { return MenuDictionary.isMainLanguageAvailable('en') }, 
        default: function(){ return subController.checkSubLanguage('en') },
        function: function(){ 
            MenuFunctionsManager.changeAccesLanguage('en')(); 
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsAccesLanguages.options[0].optId);
            mainMenuCtrl.updateAccessOptionsView();
        } 
    }, 
    { optId: 'settingsAccesLanguageEspButton', text: 'Español', 
        available: function() { return MenuDictionary.isMainLanguageAvailable('es') },
        default: function(){ return subController.checkSubLanguage('es') },
        function: function(){ 
            MenuFunctionsManager.changeAccesLanguage('es')(); 
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsAccesLanguages.options[1].optId);
            mainMenuCtrl.updateAccessOptionsView();
        } 
    }, 
    { optId: 'settingsAccesLanguageGerButton', text: 'Deutsch', 
        available: function() { return MenuDictionary.isMainLanguageAvailable('de') },
        default: function(){ return subController.checkSubLanguage('de') },
        function: function(){ 
            MenuFunctionsManager.changeAccesLanguage('de')(); 
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsAccesLanguages.options[2].optId);
            mainMenuCtrl.updateAccessOptionsView();
        } 
    }, 
    { optId: 'settingsAccesLanguageCatButton', text: 'Català', 
        available: function() { return MenuDictionary.isMainLanguageAvailable('ca') },
        default: function(){ return subController.checkSubLanguage('ca') },
        function: function(){ 
            MenuFunctionsManager.changeAccesLanguage('ca')(); 
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsAccesLanguages.options[3].optId);
            mainMenuCtrl.updateAccessOptionsView();
        } 
    }]
};

/* *************************************** I N D I C A T O R ***************************************
 * ╔═════════════════════════════════════╗
 * ║ (<)        Indicator             X  ║
 * ╠═════════════════════════════════════╣
 * ║ None                          Final ║
 * ║─────────────────────────────────────║
 * ║ Arrows                        Final ║
 * ║─────────────────────────────────────║
 * ║ Radar                         Final ║
 * ╚═════════════════════════════════════╝
 * Visual example of dropdown
 *
 * @typedef  {Object}   settingsIndicator      Level 2.
 * @property {string}   title                  The title shown in the dropdown menu.
 * @property {string}   icon                   Icon path.
 * @property {Object}   parent                 Reference to previews dropdown menu for back navigation.
 * @property {boolean}  final                  Is the dropdown in the last level.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].default      Function that returns a bool true if option is default and starts in yellow.
 * @property {function} options[].function     Function executed when option is clicked.
 */
const settingsIndicator = { title: 'Indicator', icon: './img/menu/indicator.png', parent: accessSettings, final: true, options: [
    { optId: 'settingsIndicatorNone', text: 'None', 
        default: function(){ return subController.checkSubIndicator('none') },
        function: function(){ 
            subController.setSubIndicator( "none" );
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsIndicator.options[0].optId);
        } 
    }, 
    { optId: 'settingsIndicatorArrows', text: 'Arrow', 
        default: function(){ return subController.checkSubIndicator('arrow') },
        function: function(){ 
            subController.setSubIndicator( "arrow" );
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsIndicator.options[1].optId);
        } 
    },
    { optId: 'settingsIndicatorRadar', text: 'Radar', 
        default: function(){ return subController.checkSubIndicator('radar') },
        function: function(){ 
            subController.setSubIndicator( "radar" );
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsIndicator.options[2].optId);
        } 
    }]
};


/* *************************************** S A F E   A R E A ***************************************
 * ╔═════════════════════════════════════╗
 * ║ (<)        Safe Area             X  ║
 * ╠═════════════════════════════════════╣
 * ║ Small                         Final ║
 * ║─────────────────────────────────────║
 * ║ Large                         Final ║
 * ╚═════════════════════════════════════╝
 * Visual example of dropdown
 *
 * @typedef  {Object}   settingsSafeArea       Level 2.
 * @property {string}   title                  The title shown in the dropdown menu.
 * @property {string}   icon                   Icon path.
 * @property {Object}   parent                 Reference to previews dropdown menu for back navigation.
 * @property {boolean}  final                  Is the dropdown in the last level.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].default      Function that returns a bool true if option is default and starts in yellow.
 * @property {function} options[].function     Function executed when option is clicked.
 */
const settingsSafeArea = { title: 'SafeArea', icon: './img/menu/safe_area.png', parent: accessSettings, final: true, options: [
    { optId: 'settingsSafeAreaSmall', text: 'Small', 
        default: function(){ return subController.checkSubArea(50) },
        function:  function(){ 
            subController.setSubArea( 50 );
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsSafeArea.options[0].optId);
        } 
    }, 
    { optId: 'settingsSafeAreaLarge', text: 'Large', 
        default: function(){ return subController.checkSubArea(70) },
        function:  function(){ 
            subController.setSubArea( 70 );
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsSafeArea.options[1].optId);
        } 
    }]
};


/* *************************************** S U B T I T L E S    (ST) ***************************************
 * ╔═════════════════════════════════════╗
 * ║ (<)        ST Settings           X  ║
 * ╠═════════════════════════════════════╣
 * ║ Size                                ║
 * ║─────────────────────────────────────║
 * ║ Background                          ║
 * ║─────────────────────────────────────║
 * ║ Position                            ║
 * ║─────────────────────────────────────║
 * ║ Easy-to-Read                        ║
 * ╚═════════════════════════════════════╝
 * Visual example of dropdown
 *
 * @typedef  {Object}   settingsSubtitles      Level 1.
 * @property {string}   title                  The title shown in the dropdown menu.
 * @property {string}   icon                   Icon path.
 * @property {Object}   parent                 Reference to previews dropdown menu for back navigation.
 * @property {boolean}  final                  Is the dropdown in the last level.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].icon         Icon path.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].function     Function executed when option is clicked.
 */
const settingsSubtitles = { title: 'Subtitles', icon: './img/acc_serv_icon/st_off.png', parent: settingsDropdownOpt, final: false, options: [
    { optId: 'subtitlesSizes', icon: './img/menu/st_font_size.png', text: 'Size', 
        function:  function(){ 
            SettingsOptionCtrl.updateDropdownOptions(settingsSubtitlesSize);
        } 
    },
    { optId: 'subtitlesBackground', icon: './img/menu/st_background.png', text: 'Background', 
        function:  function(){ 
            SettingsOptionCtrl.updateDropdownOptions(settingsSubtitlesBackground);
            } 
        },
    { optId: 'subtitlesShowPositions', icon: './img/menu/st_position.png', text: 'Position', 
        function:  function(){ 
            SettingsOptionCtrl.updateDropdownOptions(settingsSubtitlesPosition);
        } 
    },
    { optId: 'subtitlesEasyRead', icon: './img/menu/easy_to_read.png', text: 'Easytoread', 
        function:  function(){ 
            SettingsOptionCtrl.updateDropdownOptions(settingsSubtitlesEasyToRead);
        } 
    }]
};

/* *************************************** S U B T I T L E S   S I Z E ***************************************
 * ╔═════════════════════════════════════╗
 * ║ (<)            Size              X  ║
 * ╠═════════════════════════════════════╣
 * ║ Small                         Final ║
 * ║─────────────────────────────────────║
 * ║ Medium                        Final ║
 * ║─────────────────────────────────────║
 * ║ Large                         Final ║
 * ╚═════════════════════════════════════╝
 * Visual example of dropdown
 *
 * @typedef  {Object}   settingsSubtitlesSize  Level 2.
 * @property {string}   title                  The title shown in the dropdown menu.
 * @property {string}   icon                   Icon path.
 * @property {Object}   parent                 Reference to previews dropdown menu for back navigation.
 * @property {boolean}  final                  Is the dropdown in the last level.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].default      Function that returns a bool true if option is default and starts in yellow.
 * @property {function} options[].function     Function executed when option is clicked.
 */
const settingsSubtitlesSize = { title: 'Size', icon: './img/menu/st_font_size.png', parent: settingsSubtitles, final: true, options: [
    { optId: 'subtitlesSmallSizeButton', text: 'Small', 
        default: function(){ return subController.checkSubSize(0.6) },
        function:  function(){ 
            subController.setSubSize( 0.6 );
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsSubtitlesSize.options[0].optId);
        } 
    },
    { optId: 'subtitlesMediumSizeButton', text: 'Medium', 
        default: function(){ return subController.checkSubSize(0.8) },
        function:  function(){ 
            subController.setSubSize( 0.8 );
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsSubtitlesSize.options[1].optId);
        } 
    },
    { optId: 'subtitlesLargeSizeButton', text: 'Large', 
        default: function(){ return subController.checkSubSize(1) },
        function:  function(){ 
            subController.setSubSize( 1 );
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsSubtitlesSize.options[2].optId);
        } 
    }]
};

/* *************************************** S U B T I T L E S   B A C K G R O U N D ***************************************
 * ╔═════════════════════════════════════╗
 * ║ (<)         Background           X  ║
 * ╠═════════════════════════════════════╣
 * ║ Semitrans                     Final ║
 * ║─────────────────────────────────────║
 * ║ Outline                       Final ║
 * ╚═════════════════════════════════════╝
 * Visual example of dropdown
 *
 * @typedef  {Object}   settingsSubtitlesBackground  Level 2.
 * @property {string}   title                  The title shown in the dropdown menu.
 * @property {string}   icon                   Icon path.
 * @property {Object}   parent                 Reference to previews dropdown menu for back navigation.
 * @property {boolean}  final                  Is the dropdown in the last level.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].default      Function that returns a bool true if option is default and starts in yellow.
 * @property {function} options[].function     Function executed when option is clicked.
 */
const settingsSubtitlesBackground = { title: 'Background', icon: './img/menu/st_background.png', parent: settingsSubtitles, final: true, options: [
    { optId: 'subtitlesSemitrans', text: 'Semitrans', 
        default: function(){ return subController.checkSubBackground(0.5) },
        function:  function(){ 
            subController.setSubBackground( 0.5 );
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsSubtitlesBackground.options[0].optId);
        } 
    },
    { optId: 'subtitlesOutline', text: 'Outline', 
        default: function(){ return subController.checkSubBackground(0) },
        function:  function(){ 
            subController.setSubBackground( 0 );
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsSubtitlesBackground.options[1].optId);
        } 
    }]
};


/* *************************************** S U B T I T L E S   P O S I T I O N ***************************************
 * ╔═════════════════════════════════════╗
 * ║ (<)         Position             X  ║
 * ╠═════════════════════════════════════╣
 * ║ Top                           Final ║
 * ║─────────────────────────────────────║
 * ║ Bottom                        Final ║
 * ╚═════════════════════════════════════╝
 * Visual example of dropdown
 *
 * @typedef  {Object}   settingsSubtitlesPosition  Level 2.
 * @property {string}   title                  The title shown in the dropdown menu.
 * @property {string}   icon                   Icon path.
 * @property {Object}   parent                 Reference to previews dropdown menu for back navigation.
 * @property {boolean}  final                  Is the dropdown in the last level.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].default      Function that returns a bool true if option is default and starts in yellow.
 * @property {function} options[].function     Function executed when option is clicked.
 */
const settingsSubtitlesPosition = { title: 'Position', icon: './img/menu/st_position.png', parent: settingsSubtitles, final: true, options: [
    { optId: 'subtitlesTopButton', text: 'Top', 
        default: function(){ return subController.checkSubPosition(1)},
        function:  function(){
            subController.setSubPosition( 0, 1 );
            if ( subController.getSubtitleEnabled() ) subController.setSignerPosition( subController.getSignerPosition().x, 1 );
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsSubtitlesPosition.options[0].optId);
        } 
    },
    { optId: 'subtitlesBottomButton', text: 'Bottom', 
        default: function(){ return subController.checkSubPosition(-1) },
        function:  function(){ 
            subController.setSubPosition( 0, -1 );
            if ( subController.getSubtitleEnabled() ) subController.setSignerPosition( subController.getSignerPosition().x, -1 );
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsSubtitlesPosition.options[1].optId);
        } 
    }]
};

/* *************************************** S U B T I T L E S   E A S Y - T O - R E A D  ***************************************
 * ╔═════════════════════════════════════╗
 * ║ (<)         Easy to Read         X  ║
 * ╠═════════════════════════════════════╣
 * ║ On                            Final ║
 * ║─────────────────────────────────────║
 * ║ Off                           Final ║
 * ╚═════════════════════════════════════╝
 * Visual example of dropdown
 *
 * @typedef  {Object}   settingsSubtitlesEasyToRead  Level 2.
 * @property {string}   title                  The title shown in the dropdown menu.
 * @property {string}   icon                   Icon path.
 * @property {Object}   parent                 Reference to previews dropdown menu for back navigation.
 * @property {boolean}  final                  Is the dropdown in the last level.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].default      Function that returns a bool true if option is default and starts in yellow.
 * @property {function} options[].function     Function executed when option is clicked.
 */
const settingsSubtitlesEasyToRead = { title: 'EasytoRead', icon: './img/menu/easy_to_read.png', parent: settingsSubtitles, final: true, options: [
    { optId: 'subtitlesEasyOn', text: 'On', 
        default: function(){ return subController.checkSubEasy(true) },
        function:  function(){ 
            subController.setSubEasy( true, getE2RURL() );
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsSubtitlesEasyToRead.options[0].optId)
        } 
    },
    { optId: 'subtitlesEasyOff', text: 'Off', 
        default: function(){ return subController.checkSubEasy(false) },
        function:  function(){ 
            subController.setSubEasy( false, list_contents[demoId].subtitles[0][subController.getSubLanguage()] );
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsSubtitlesEasyToRead.options[1].optId);
        } 
    }]
};


/* *************************************** S I G N    L A N G U A G E    (SL) ***************************************
 * ╔═════════════════════════════════════╗
 * ║ (<)     SL Settings              X  ║
 * ╠═════════════════════════════════════╣
 * ║ Position                            ║
 * ║─────────────────────────────────────║
 * ║ Size                                ║
 * ╚═════════════════════════════════════╝
 * Visual example of dropdown
 *
 * @typedef  {Object}   settingsSignLanguage   Level 1.
 * @property {string}   title                  The title shown in the dropdown menu.
 * @property {string}   icon                   Icon path.
 * @property {Object}   parent                 Reference to previews dropdown menu for back navigation.
 * @property {boolean}  final                  Is the dropdown in the last level.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].icon         Icon path.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].function     Function executed when option is clicked.
 */
const settingsSignLanguage = { title: 'Signlanguage', icon: './img/acc_serv_icon/sl_off.png', parent: settingsDropdownOpt, final: false, options: [
    { optId: 'signerPosition', icon: './img/menu/sl_position.png', text: 'Position', 
        function:  function(){ 
            SettingsOptionCtrl.updateDropdownOptions(settingsSignLanguagePosition);
        } 
    },
    { optId: 'signerSize', icon: './img/menu/sl_size.png', text: 'Size', 
        function:  function(){ 
            SettingsOptionCtrl.updateDropdownOptions(settingsSignLanguageSize);
        } 
    }]
};

/* *************************************** S I G N   L A N G U A G E   P O S I T I O N ***************************************
 * ╔═════════════════════════════════════╗
 * ║ (<)         Position             X  ║
 * ╠═════════════════════════════════════╣
 * ║ Right                         Final ║
 * ║─────────────────────────────────────║
 * ║ Left                          Final ║
 * ╚═════════════════════════════════════╝
 * Visual example of dropdown
 *
 * @typedef  {Object}   settingsSignLanguagePosition  Level 2.
 * @property {string}   title                  The title shown in the dropdown menu.
 * @property {string}   icon                   Icon path.
 * @property {Object}   parent                 Reference to previews dropdown menu for back navigation.
 * @property {boolean}  final                  Is the dropdown in the last level.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].default      Function that returns a bool true if option is default and starts in yellow.
 * @property {function} options[].function     Function executed when option is clicked.
 */
const settingsSignLanguagePosition = { title: 'Position', icon: './img/menu/sl_position.png', parent: settingsSignLanguage, final: true, options: [
    { optId: 'signerRightButton', text: 'Right', 
        default: function(){ return subController.checkSignPosition(1) },
        function:  function(){ 
            subController.setSignerPosition( 1, subController.getSubPosition().y);
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsSignLanguagePosition.options[0].optId);
        } 
    },
    { optId: 'signerLeftButton', text: 'Left', 
        default: function(){ return subController.checkSignPosition(-1) },
        function:  function(){ 
            subController.setSignerPosition( -1, subController.getSubPosition().y);
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsSignLanguagePosition.options[1].optId);
        } 
    }]
};

/* *************************************** S I G N   L A N G U A G E   S I Z E ***************************************
 * ╔═════════════════════════════════════╗
 * ║ (<)            Size              X  ║
 * ╠═════════════════════════════════════╣
 * ║ Small                         Final ║
 * ║─────────────────────────────────────║
 * ║ Medium                        Final ║
 * ║─────────────────────────────────────║
 * ║ Large                         Final ║
 * ╚═════════════════════════════════════╝
 * Visual example of dropdown
 *
 * @typedef  {Object}   settingsSignLanguageSize  Level 2.
 * @property {string}   title                  The title shown in the dropdown menu.
 * @property {string}   icon                   Icon path.
 * @property {Object}   parent                 Reference to previews dropdown menu for back navigation.
 * @property {boolean}  final                  Is the dropdown in the last level.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].default      Function that returns a bool true if option is default and starts in yellow.
 * @property {function} options[].function     Function executed when option is clicked.
 */
const settingsSignLanguageSize = { title: 'Size', icon: './img/menu/sl_size.png', parent: settingsSignLanguage, final: true, options: [
    { optId: 'signerSmallSizeButton', text: 'Small', 
        default: function(){ return subController.checkSignSize(16) },
        function:  function(){ 
            subController.setSignerSize(16);
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsSignLanguageSize.options[0].optId);
        } 
    }, 
    { optId: 'signerMediumSizeButton', text: 'Medium', 
        default: function(){ return subController.checkSignSize(18) },
        function:  function(){ 
            subController.setSignerSize(18);
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsSignLanguageSize.options[1].optId);
        } 
    },
    { optId: 'signerLargeSizeButton', text: 'Large', 
        default: function(){ return subController.checkSignSize(20) },
        function:  function(){ 
            subController.setSignerSize(20);
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsSignLanguageSize.options[2].optId);
        } 
    }]
};


/* *************************************** A U D I O   D E S C R I P T I O N   (AD) ***************************************
 * ╔═════════════════════════════════════╗
 * ║ (<)   AD Settings                X  ║
 * ╠═════════════════════════════════════╣
 * ║ Presentation Mode                   ║
 * ║─────────────────────────────────────║
 * ║ Volume Level                        ║
 * ╚═════════════════════════════════════╝
 * Visual example of dropdown
 *
 * @typedef  {Object}   settingsAudioDescription   Level 1.
 * @property {string}   title                  The title shown in the dropdown menu.
 * @property {string}   icon                   Icon path.
 * @property {Object}   parent                 Reference to previews dropdown menu for back navigation.
 * @property {boolean}  final                  Is the dropdown in the last level.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].icon         Icon path.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].available    Function that returns a bool true if option os available, false if option has to be omitted.
 * @property {function} options[].function     Function executed when option is clicked.
 */
const settingsAudioDescription = { title: 'Audiodescription', icon: './img/acc_serv_icon/ad_off.png', parent: settingsDropdownOpt, final: false, options: [
    { optId: 'audioDescriptionPresentation', icon: './img/menu/ad_presentation_mode.png', text: 'Presentation', 
        available: function() { return _AudioManager.checkADPresentationAvailable(); },
        function:  function(){ 
            SettingsOptionCtrl.updateDropdownOptions(settingsAudioDescriptionPresentation);
        } 
    },
    { optId: 'audioDescriptionVolume', icon: './img/menu/volume_mute_icon.png', text: 'Volume', 
        function:  function(){ 
            SettingsOptionCtrl.updateDropdownOptions(settingsAudioDescriptionVolume);
        } 
    }]
};


/* *************************************** A U D I O   D E S C R I P T I O N   P R E S E N T A T I O N ***************************************
 * ╔═════════════════════════════════════╗
 * ║ (<)        Presentation          X  ║
 * ╠═════════════════════════════════════╣
 * ║ Classic                       Final ║
 * ║─────────────────────────────────────║
 * ║ Static                        Final ║
 * ║─────────────────────────────────────║
 * ║ Dynamic                       Final ║
 * ╚═════════════════════════════════════╝
 * Visual example of dropdown
 *
 * @typedef  {Object}   settingsAudioDescriptionPresentation  Level 2.
 * @property {string}   title                  The title shown in the dropdown menu.
 * @property {string}   icon                   Icon path.
 * @property {Object}   parent                 Reference to previews dropdown menu for back navigation.
 * @property {boolean}  final                  Is the dropdown in the last level.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].available    Function that returns a bool true if option os available, false if option has to be omitted.
 * @property {function} options[].default      Function that returns a bool true if option is default and starts in yellow.
 * @property {function} options[].function     Function executed when option is clicked.
 */
const settingsAudioDescriptionPresentation = { title: 'Presentation', icon: './img/menu/ad_presentation_mode.png', parent: settingsAudioDescription, final: true, options: [
    { optId: 'adPresentationVoGButton', text: 'Classic', 
        available: function() { return _AudioManager.checkADPresentationAvailable('VoiceOfGod'); },
        default: function(){ return _AudioManager.checkADPresentationDefault('VoiceOfGod'); },
        function:  function(){ 
            _AudioManager.setADPresentation( 'VoiceOfGod' );
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioDescriptionPresentation.options[0].optId);
        } 
    },
    { optId: 'adPresentationFoSButton', text: 'Static', 
        available: function() { return _AudioManager.checkADPresentationAvailable('Friend'); },
        default: function(){ return _AudioManager.checkADPresentationDefault('Friend'); }, 
        function:  function(){ 
            _AudioManager.setADPresentation( 'Friend' );
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioDescriptionPresentation.options[1].optId);
        } 
    },
    { optId: 'adPresentationPoAButton', text: 'Dynamic', 
        available: function() { return _AudioManager.checkADPresentationAvailable('Dynamic'); },
        default: function(){ return _AudioManager.checkADPresentationDefault('Dynamic'); },
        function:  function(){ 
            _AudioManager.setADPresentation( 'Dynamic' );
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioDescriptionPresentation.options[2].optId);
        } 
    }]
};


/* *************************************** A U D I O   D E S C R I P T I O N   V O L U M E ***************************************
 * ╔═════════════════════════════════════╗
 * ║ (<)          Volume              X  ║
 * ╠═════════════════════════════════════╣
 * ║ Minimum                       Final ║
 * ║─────────────────────────────────────║
 * ║ Medium                        Final ║
 * ║─────────────────────────────────────║
 * ║ Maximum                       Final ║
 * ╚═════════════════════════════════════╝
 * Visual example of dropdown
 *
 * @typedef  {Object}   settingsAudioDescriptionVolume  Level 2.
 * @property {string}   title                  The title shown in the dropdown menu.
 * @property {string}   icon                   Icon path.
 * @property {Object}   parent                 Reference to previews dropdown menu for back navigation.
 * @property {boolean}  final                  Is the dropdown in the last level.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].available    Function that returns a bool true if option os available, false if option has to be omitted.
 * @property {function} options[].default      Function that returns a bool true if option is default and starts in yellow.
 * @property {function} options[].function     Function executed when option is clicked.
 */
const settingsAudioDescriptionVolume = { title: 'Volume', icon: './img/menu/volume_mute_icon.png', parent: settingsAudioDescription, final: true, options: [
    { optId: 'adVolumeMinButton', text: 'Minimum', 
        default: function(){ return _AudioManager.checkADVolume(10); },
        function:  function(){ 
            _AudioManager.setVolume( 'AD', 10 );
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioDescriptionVolume.options[0].optId);
        } 
    },
    { optId: 'adVolumeMidButton', text: 'Medium', 
        default: function(){ return _AudioManager.checkADVolume(50); },
        function:  function(){
            _AudioManager.setVolume( 'AD', 50 );
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioDescriptionVolume.options[1].optId);
        } 
    },
    { optId: 'adVolumeMaxButton', text: 'Maximum', 
        default: function(){ return _AudioManager.checkADVolume(100); },
        function:  function(){ 
            _AudioManager.setVolume( 'AD', 100 );
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioDescriptionVolume.options[2].optId);
        } 
    }]
};
    


/* *************************************** A U D I O   S U B T I T L E S    (AST) ***************************************                     
 * ╔═════════════════════════════════════╗
 * ║ (<)    AST Settings              X  ║
 * ╠═════════════════════════════════════╣
 * ║ Easy-to-Read                        ║
 * ║─────────────────────────────────────║
 * ║ Presentation Mode                   ║
 * ║─────────────────────────────────────║
 * ║ Volume Level                        ║
 * ╚═════════════════════════════════════╝
 * Visual example of dropdown
 *
 * @typedef  {Object}   settingsAudioSubtitles Level 1.
 * @property {string}   title                  The title shown in the dropdown menu.
 * @property {string}   icon                   Icon path.
 * @property {Object}   parent                 Reference to previews dropdown menu for back navigation.
 * @property {boolean}  final                  Is the dropdown in the last level.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].icon         Icon path.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].available    Function that returns a bool true if option os available, false if option has to be omitted.
 * @property {function} options[].function     Function executed when option is clicked.
 */
const settingsAudioSubtitles = { title: 'Audiosubtitles', icon: './img/acc_serv_icon/ast_off.png', parent: settingsDropdownOpt, final: false, options: [
    { optId: 'audioSubtitlesEasy', icon: './img/menu/easy_to_read.png', text: 'easytoread', 
        //available: function() { return },
        function:  function(){ 
            SettingsOptionCtrl.updateDropdownOptions(settingsAudioSubtitlesEasyToRead);
        } 
    },
    { optId: 'audioSubtitlesPresentation', icon: './img/menu/ad_presentation_mode.png', text: 'Presentation', 
        available: function() { return _AudioManager.checkASTPresentationAvailable(); },
        function:  function(){ 
            SettingsOptionCtrl.updateDropdownOptions(settingsAudioSubtitlesPresentation);
        } 
    },
    { optId: 'audioSubtitlesVolume', icon: './img/menu/volume_mute_icon.png', text: 'Volume', 
        function:  function(){ 
            SettingsOptionCtrl.updateDropdownOptions(settingsAudioSubtitlesVolume);
        } 
    }]
};

/* *************************************** A U D I O   S U B T I T L E S   E A S Y - T O - R E A D ***************************************
 * ╔═════════════════════════════════════╗
 * ║ (<)         Easy to Read         X  ║
 * ╠═════════════════════════════════════╣
 * ║ On                            Final ║
 * ║─────────────────────────────────────║
 * ║ Off                           Final ║
 * ╚═════════════════════════════════════╝
 * Visual example of dropdown
 *
 * @typedef  {Object}   settingsAudioSubtitlesEasyToRead  Level 2.
 * @property {string}   title                  The title shown in the dropdown menu.
 * @property {string}   icon                   Icon path.
 * @property {Object}   parent                 Reference to previews dropdown menu for back navigation.
 * @property {boolean}  final                  Is the dropdown in the last level.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].default      Function that returns a bool true if option is default and starts in yellow.
 * @property {function} options[].function     Function executed when option is clicked.
 */
const settingsAudioSubtitlesEasyToRead = { title: 'EasytoRead', icon: './img/menu/easy_to_read.png', parent: settingsAudioSubtitles, final: true, options: [
    { optId: 'astEasyOn', text: 'On', 
        default: function(){ return _AudioManager.checkASTEasy(true); },
        function:  function(){ 
            _AudioManager.setSubEasy(  true, getASTe2rURL() );
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioSubtitlesEasyToRead.options[0].optId);
        } 
    },
    { optId: 'astEasyOff', text: 'Off', 
        default: function(){ return _AudioManager.checkASTEasy(false); },
        function:  function(){ 
            _AudioManager.setSubEasy( false, list_contents[demoId].ast[0][_AudioManager.getASTLanguage()] );
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioSubtitlesEasyToRead.options[1].optId);
        } 
    }]
};

/* *************************************** A U D I O   S U B T I T L E S   P R E S E N T A T I O N ***************************************
 * ╔═════════════════════════════════════╗
 * ║ (<)        Presentation          X  ║
 * ╠═════════════════════════════════════╣
 * ║ Classic                       Final ║
 * ║─────────────────────────────────────║
 * ║ Dynamic                       Final ║
 * ╚═════════════════════════════════════╝
 * Visual example of dropdown
 *
 * @typedef  {Object}   settingsAudioSubtitlesPresentation  Level 2.
 * @property {string}   title                  The title shown in the dropdown menu.
 * @property {string}   icon                   Icon path.
 * @property {Object}   parent                 Reference to previews dropdown menu for back navigation.
 * @property {boolean}  final                  Is the dropdown in the last level.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].available    Function that returns a bool true if option os available, false if option has to be omitted.
 * @property {function} options[].default      Function that returns a bool true if option is default and starts in yellow.
 * @property {function} options[].function     Function executed when option is clicked.
 */
const settingsAudioSubtitlesPresentation = { title: 'Presentation', icon: './img/menu/ad_presentation_mode.png', parent: settingsAudioSubtitles, final: true, options: [
    { optId: 'astPresentationVoGButton', text: 'Classic', 
        available: function() { return _AudioManager.checkASTPresentationAvailable('VoiceOfGod'); },
        default: function(){ return _AudioManager.checkASTPresentationDefault('VoiceOfGod'); },
        function:  function(){ 
            _AudioManager.setASTPresentation( 'VoiceOfGod' );
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioSubtitlesPresentation.options[0].optId);
        } 
    }, 
    { optId: 'astPresentationPoAButton', text: 'Dynamic', 
        available: function() { return  _AudioManager.checkASTPresentationAvailable('Dynamic'); },
        default: function(){ return _AudioManager.checkASTPresentationDefault('Dynamic'); },
        function:  function(){ 
            _AudioManager.setASTPresentation( 'Dynamic' );
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioSubtitlesPresentation.options[1].optId);
        } 
    }]
};

/* *************************************** A U D I O   S U B T I T L E S   V O L U M E ***************************************
 * ╔═════════════════════════════════════╗
 * ║ (<)          Volume              X  ║
 * ╠═════════════════════════════════════╣
 * ║ Minimum                       Final ║
 * ║─────────────────────────────────────║
 * ║ Medium                        Final ║
 * ║─────────────────────────────────────║
 * ║ Maximum                       Final ║
 * ╚═════════════════════════════════════╝
 * Visual example of dropdown
 *
 * @typedef  {Object}   settingsAudioSubtitlesVolume  Level 2.
 * @property {string}   title                  The title shown in the dropdown menu.
 * @property {string}   icon                   Icon path.
 * @property {Object}   parent                 Reference to previews dropdown menu for back navigation.
 * @property {boolean}  final                  Is the dropdown in the last level.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].function     Function executed when option is clicked.
 */
const settingsAudioSubtitlesVolume = { title: 'Volume', icon: './img/menu/volume_mute_icon.png', parent: settingsAudioSubtitles, final: true, options: [
    { optId: 'astVolumeMinButton', text: 'Minimum', default: function(){ return _AudioManager.checkASTVolume(10); },
        function:  function(){ 
            _AudioManager.setVolume( 'AST', 10 );
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioSubtitlesVolume.options[0].optId);
        } 
    },
    { optId: 'astVolumeMidButton', text: 'Medium', default: function(){ return _AudioManager.checkASTVolume(50); },
        function:  function(){ 
            _AudioManager.setVolume( 'AST', 50 );
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioSubtitlesVolume.options[1].optId);
        } 
    },
    { optId: 'astVolumeMaxButton', text: 'Maximum', default: function(){ return _AudioManager.checkASTVolume(100); },
        function:  function(){
            _AudioManager.setVolume( 'AST', 100 );
            SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioSubtitlesVolume.options[2].optId);
        } 
    }]
};
