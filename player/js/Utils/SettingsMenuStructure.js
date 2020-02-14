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
const settingsDropdownOpt = {title: 'Settings', final: false, 
    options: [
        { optId: 'settingsGeneral', icon: './img/menu/settings_icon.png', text: 'General', 
            function: function(){ 
                SettingsOptionCtrl.updateDropdownOptions(generalSettings); 
            }
        },
        { optId: 'settingsST', icon: './img/acc_serv_icon/st_off.png', text: 'Subtitles', 
            available: function() { return _stMngr.checkisSubAvailable() },
            function: function(){
                SettingsOptionCtrl.updateDropdownOptions(settingsSubtitles);
            } 
        },
        { optId: 'settingsSL', icon: './img/acc_serv_icon/sl_off.png', text: 'Signlanguage', 
            available: function() { return _slMngr.checkisSignAvailable() },
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
const generalSettings = { title: 'General', icon: './img/menu/settings_icon.png', parent: settingsDropdownOpt, final: false, 
    options: [
        { optId: 'settingsLanguages', icon: './img/menu/language.png', text: 'LanguageMenu', 
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
        { optId: 'settingsIndicator', icon: './img/menu/indicator.png', text: 'Indicator', 
            function: function(){ 
                SettingsOptionCtrl.updateDropdownOptions(settingsIndicator);
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
const settingsUILanguages = { title: 'LanguageMenu', icon: './img/menu/language.png', parent: generalSettings, final: true, 
    options: [
        { optId: 'settingsUILanguageEngButton', text: 'English',
            default: function(){ return MenuDictionary.checkMainLanguage('en') },
            function:  function(){ 
                if(!settingsUILanguages.options[0].default()){
                    MenuFunctionsManager.getMainLanguageFunc('en');
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsUILanguages.options[0].optId);
                }
            }
        }, 
        { optId: 'settingsUILanguageEspButton', text: 'Español', 
            default: function(){ return MenuDictionary.checkMainLanguage('es') },
            function:  function(){ 
                if(!settingsUILanguages.options[1].default()){
                    MenuFunctionsManager.getMainLanguageFunc('es');
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsUILanguages.options[1].optId);
                }
            }
        }, 
        { optId: 'settingsUILanguageGerButton', text: 'Deutsch', 
            default: function(){ return MenuDictionary.checkMainLanguage('de') },
            function:  function(){ 
                if(!settingsUILanguages.options[2].default()){
                    MenuFunctionsManager.getMainLanguageFunc('de');
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsUILanguages.options[2].optId);
                }
            } 
        }, 
        { optId: 'settingsUILanguageCatButton', text: 'Català', 
            default: function(){ return MenuDictionary.checkMainLanguage('ca') },
            function:  function(){ 
                if(!settingsUILanguages.options[3].default()){
                    MenuFunctionsManager.getMainLanguageFunc('ca');
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsUILanguages.options[3].optId);
                }
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
const settigsVoiceControl = { title: 'VoiceControl', icon: './img/menu/voice_control.png', parent: generalSettings, final: true, 
    options: [
        { optId: 'voiceControlOnButton', text: 'On', 
            default: function(){ return _ws_vc != undefined },
            function:  function(){ 
                if(!settigsVoiceControl.options[0].default()) {
                    connectVoiceControl( localStorage.ImAc_voiceControlId, "http://51.89.138.157:3000/" );
                    SettingsOptionCtrl.setChildColumnActiveOpt(settigsVoiceControl.options[0].optId);
                }
            } 
        }, 
        { optId: 'voiceControlOffButton', text: 'Off', 
            default: function(){ return _ws_vc == undefined },
            function:  function(){ 
                if(!settigsVoiceControl.options[1].default()){
                    SettingsOptionCtrl.setChildColumnActiveOpt(settigsVoiceControl.options[1].optId);
                }
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
const settingsPointerSize = { title: 'PointerSize', icon: './img/menu/pointer_size.png', parent: generalSettings, final: true, 
    options: [
        { optId: 'settingsMenuPointerSmall', text: 'Small', 
            default: function(){ return _pointerSize == 0.6 },
            function:  function(){ 
                if(!settingsPointerSize.options[0].default()){
                    MenuFunctionsManager.getChangePointerSizeFunc(0.6);
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsPointerSize.options[0].optId);
                }
            }
        },
        { optId: 'settingsMenuPointerMedium', text: 'Medium', 
            default: function(){ return _pointerSize == 1 },
            function:  function(){ 
                if(!settingsPointerSize.options[1].default()){
                    MenuFunctionsManager.getChangePointerSizeFunc(1);
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsPointerSize.options[1].optId);
                }
            } 
        }, 
        { optId: 'settingsMenuPointerLarge', text: 'Large', 
            default: function(){ return _pointerSize == 2 },
            function:  function(){ 
                if(!settingsPointerSize.options[2].default()){
                    MenuFunctionsManager.getChangePointerSizeFunc(2);
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsPointerSize.options[2].optId);
                }
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
const settingsIndicator = { title: 'Indicator', icon: './img/menu/indicator.png', parent: generalSettings, final: true, preview: true, 
    options: [
        { optId: 'settingsIndicatorNone', text: 'None', 
            default: function(){ return (stConfig.indicator.localeCompare('none') == 0)},
            function: function(){ 
                if(!settingsIndicator.options[0].default()){
                    _stMngr.setIndicator("none");
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsIndicator.options[0].optId);
                }
            } 
        }, 
        { optId: 'settingsIndicatorArrows', text: 'Arrow', 
            default: function(){ return (stConfig.indicator.localeCompare('arrow') == 0) },
            function: function(){ 
                if(!settingsIndicator.options[1].default()){
                    _stMngr.setIndicator("arrow");
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsIndicator.options[1].optId);
                }
            } 
        },
        { optId: 'settingsIndicatorRadar', text: 'Radar', 
            default: function(){ return (stConfig.indicator.localeCompare('radar') == 0) },
            function: function(){ 
                if(!settingsIndicator.options[2].default()){
                    _stMngr.setIndicator("radar");
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsIndicator.options[2].optId);
                }
            } 
        }]
};

/* *************************************** U S E R   P R O F I L E ***************************************
 * ╔═════════════════════════════════════╗
 * ║ (<)       User Profile           X  ║
 * ╠═════════════════════════════════════╣
 * ║ Reset                         Final ║
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
const settingsUserProfile = { title: 'UserProfile', icon: './img/menu/user_profile.png', parent: generalSettings, final: true, 
    options: [
        { optId: 'resetUserProfileButton', text: 'Reset', 
            function:  function(){ 
                resetConfig();
                SettingsOptionCtrl.setChildColumnActiveOpt(settingsUserProfile.options[0].optId);
            } 
        },
        { optId: 'saveUserProfileButton', text: 'Save', 
            function:  function(){ 
                saveConfig();
                SettingsOptionCtrl.setChildColumnActiveOpt(settingsUserProfile.options[1].optId);
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
const settingsSubtitles = { title: 'Subtitles', icon: './img/acc_serv_icon/st_off.png', parent: settingsDropdownOpt, final: false, 
    options: [
        { optId: 'subtitlesLanguage', icon: './img/menu/language.png', text: 'Language', 
            available: function(){ return MenuDictionary.getAvailableLanguage()},
            function: function(){ 
                SettingsOptionCtrl.updateDropdownOptions(settingsSubtitlesLanguage);
            } 
        },
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
            available: function() { return  _stMngr.checkSubEasyAvailable(stConfig.language) },
            function:  function(){ 
                SettingsOptionCtrl.updateDropdownOptions(settingsSubtitlesEasyToRead);
            } 
        }]
};

/* *************************************** S U B T I T L E S   L A N G U A G E S ***************************************
 * ╔═════════════════════════════════════╗
 * ║ (<)    Subtitles Languages       X  ║
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
 * @typedef  {Object}   settingsSubtitlesLanguage      Level 2.
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
const settingsSubtitlesLanguage = { title: 'Language', icon: './img/menu/language.png', parent: settingsSubtitles, final: true, 
    options: [
        { optId: 'subtitlesLanguageEngButton', text: 'English', 
            available: function() { return _stMngr.checkisSubAvailable('en') }, 
            default: function(){ return ('en'.localeCompare(_iconf.stlanguage) == 0) },
            function: function(){ 
                if(!settingsSubtitlesLanguage.options[0].default()){
                    MenuFunctionsManager.changeAccesLanguage('en', 'st')(); 
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsSubtitlesLanguage.options[0].optId);
                    mainMenuCtrl.updateAccessOptionsView();
                }
            } 
        }, 
        { optId: 'subtitlesLanguageEspButton', text: 'Español', 
            available: function() { return _stMngr.checkisSubAvailable('es') },
            default: function(){ return ('es'.localeCompare(_iconf.stlanguage) == 0) },
            function: function(){ 
                if(!settingsSubtitlesLanguage.options[1].default()){
                    MenuFunctionsManager.changeAccesLanguage('es','st')(); 
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsSubtitlesLanguage.options[1].optId);
                    mainMenuCtrl.updateAccessOptionsView();
                }
            } 
        }, 
        { optId: 'subtitlesLanguageGerButton', text: 'Deutsch', 
            available: function() { return _stMngr.checkisSubAvailable('de') },
            default: function(){ return ('de'.localeCompare(_iconf.stlanguage) == 0) },
            function: function(){ 
                if(!settingsSubtitlesLanguage.options[2].default()){
                    MenuFunctionsManager.changeAccesLanguage('de', 'st')(); 
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsSubtitlesLanguage.options[2].optId);
                    mainMenuCtrl.updateAccessOptionsView();
                }
            } 
        }, 
        { optId: 'subtitlesLanguageCatButton', text: 'Català', 
            available: function() { return _stMngr.checkisSubAvailable('ca') },
            default: function(){ return ('ca'.localeCompare(_iconf.stlanguage) == 0) },
            function: function(){ 
                if(!settingsSubtitlesLanguage.options[3].default()){
                    MenuFunctionsManager.changeAccesLanguage('ca', 'st')(); 
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsSubtitlesLanguage.options[3].optId);
                    mainMenuCtrl.updateAccessOptionsView();
                }            
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
 * @property {boolean}  preview                Is the preview available for this option.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].default      Function that returns a bool true if option is default and starts in yellow.
 * @property {function} options[].function     Function executed when option is clicked.
 */
const settingsSubtitlesSize = { title: 'Size', icon: './img/menu/st_font_size.png', parent: settingsSubtitles, final: true, preview: true,
    options: [
        { optId: 'subtitlesSmallSizeButton', text: 'Small', 
            default: function(){ return (0.6 == stConfig.size) },
            function:  function(){
                if(!settingsSubtitlesSize.options[0].default()){
                    _stMngr.setSize(0.6);
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsSubtitlesSize.options[0].optId);
                } 
            } 
        },
        { optId: 'subtitlesMediumSizeButton', text: 'Medium', 
            default: function(){ return (0.8 == stConfig.size) },
            function:  function(){ 
                if(!settingsSubtitlesSize.options[1].default()){
                    _stMngr.setSize(0.8);
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsSubtitlesSize.options[1].optId);
                } 
            } 
        },
        { optId: 'subtitlesLargeSizeButton', text: 'Large', 
            default: function(){ return (1 == stConfig.size) },
            function:  function(){ 
                if(!settingsSubtitlesSize.options[2].default()){
                    _stMngr.setSize(1);
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsSubtitlesSize.options[2].optId);
                } 
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
 * @property {boolean}  preview                Is the preview available for this option.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].default      Function that returns a bool true if option is default and starts in yellow.
 * @property {function} options[].function     Function executed when option is clicked.
 */
const settingsSubtitlesBackground = { title: 'Background', icon: './img/menu/st_background.png', parent: settingsSubtitles, final: true, preview: true,
    options: [
        { optId: 'subtitlesSemitrans', text: 'Semitrans', 
            default: function(){ return (0.75 == stConfig.background) },
            function:  function(){ 
                if(!settingsSubtitlesBackground.options[0].default()){
                    _stMngr.setBackground(0.75);
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsSubtitlesBackground.options[0].optId);
                }
            } 
        },
        { optId: 'subtitlesOutline', text: 'Outline', 
            default: function(){ return (0 == stConfig.background) },
            function:  function(){ 
                if(!settingsSubtitlesBackground.options[1].default()){
                    _stMngr.setBackground(0);
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsSubtitlesBackground.options[1].optId);
                }
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
 * ║─────────────────────────────────────║
 * ║ Speaker                       Final ║
 * ║─────────────────────────────────────║
 * ║ Scene                         Final ║
 * ╚═════════════════════════════════════╝
 * Visual example of dropdown
 *
 * @typedef  {Object}   settingsSubtitlesPosition  Level 2.
 * @property {string}   title                  The title shown in the dropdown menu.
 * @property {string}   icon                   Icon path.
 * @property {Object}   parent                 Reference to previews dropdown menu for back navigation.
 * @property {boolean}  final                  Is the dropdown in the last level.
 * @property {boolean}  preview                Is the preview available for this option.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].default      Function that returns a bool true if option is default and starts in yellow.
 * @property {function} options[].function     Function executed when option is clicked.
 */
const settingsSubtitlesPosition = { title: 'Position', icon: './img/menu/st_position.png', parent: settingsSubtitles, final: true, preview: true,
    options: [
        { optId: 'subtitlesTopButton', text: 'Top', 
            default: function(){ return (stConfig.canvasPos.y == 1 && !localStorage.getItem("stPosition"))},
            function:  function(){
                if(!settingsSubtitlesPosition.options[0].default()){
                    _stMngr.setPosition(new THREE.Vector2(0, 1), false, false);
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsSubtitlesPosition.options[0].optId);
                    if( slConfig.isEnabled && !localStorage.getItem("slPosition")){
                        _slMngr.setPosition( _slMngr.getSigner().position.x, Math.abs(_slMngr.getSigner().position.y ) );
                    } 
                    _rdr.updateRadarPosition();
                }
            } 
        },
        { optId: 'subtitlesBottomButton', text: 'Bottom', 
            default: function(){ return (stConfig.canvasPos.y == -1 && !localStorage.getItem("stPosition") && !stConfig.fixedScene && !stConfig.fixedSpeaker)},
            function:  function(){ 
                if(!settingsSubtitlesPosition.options[1].default()){
                    _stMngr.setPosition(new THREE.Vector2(0, -1), false, false);
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsSubtitlesPosition.options[1].optId);
                    if( slConfig.isEnabled && !localStorage.getItem("slPosition")) {
                        _slMngr.setPosition( _slMngr.getSigner().position.x, -1 * Math.abs(_slMngr.getSigner().position.y) ); 
                    }
                    _rdr.updateRadarPosition();
                }
            } 
        },
        { optId: 'subtitlesSpeakerButton', text: 'Speaker', 
            default: function(){ return stConfig.fixedSpeaker},
            function:  function(){
                if(!settingsSubtitlesPosition.options[2].default()){
                    _stMngr.setPosition(new THREE.Vector2(0, 0), false, true);
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsSubtitlesPosition.options[2].optId);
                    _rdr.updateRadarPosition();
                }
            } 
        },
        { optId: 'subtitlesSceneButton', text: 'Scene', 
            default: function(){ return stConfig.fixedScene},
            function:  function(){
                if(!settingsSubtitlesPosition.options[3].default()){
                    _stMngr.setPosition(new THREE.Vector2(0, 0), true, false);
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsSubtitlesPosition.options[3].optId);
                    _rdr.updateRadarPosition();
                }
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
const settingsSubtitlesEasyToRead = { title: 'EasytoRead', icon: './img/menu/easy_to_read.png', parent: settingsSubtitles, final: true, 
    options: [
        { optId: 'subtitlesEasyOn', text: 'On', 
            default: function(){ return stConfig.easy2read },
            function:  function(){
                if(!settingsSubtitlesEasyToRead.options[0].default()){
                    _stMngr.setEasy2Read( true, list_contents[demoId].subtitles[1][stConfig.language] );
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsSubtitlesEasyToRead.options[0].optId);
                }
            } 
        },
        { optId: 'subtitlesEasyOff', text: 'Off', 
            default: function(){ return !stConfig.easy2read },
            function:  function(){ 
                if(!settingsSubtitlesEasyToRead.options[1].default()){
                    _stMngr.setEasy2Read( false, list_contents[demoId].subtitles[0][stConfig.language] );
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsSubtitlesEasyToRead.options[1].optId);
                }
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
const settingsSignLanguage = { title: 'Signlanguage', icon: './img/acc_serv_icon/sl_off.png', parent: settingsDropdownOpt, final: false, 
    options: [
        { optId: 'signerLanguage', icon: './img/menu/language.png', text: 'Language', 
            available: function(){ return MenuDictionary.getAvailableLanguage()},
            function: function(){ 
                SettingsOptionCtrl.updateDropdownOptions(settingsSignerLanguage);
            } 
        },
        { optId: 'signerPosition', icon: './img/menu/sl_position.png', text: 'Position', 
            function:  function(){ 
                SettingsOptionCtrl.updateDropdownOptions(settingsSignLanguagePosition);
            } 
        },
        { optId: 'signerSize', icon: './img/menu/sl_size.png', text: 'Size', 
            function:  function(){ 
                SettingsOptionCtrl.updateDropdownOptions(settingsSignLanguageSize);
            } 
        },
        { optId: 'signerDynamic', icon: './img/menu/st_background.png', text: 'Dynamic', 
            available: function(){ return (imsc1doc_SL) ? true : false },
            function:  function(){ 
                SettingsOptionCtrl.updateDropdownOptions(settingsSignLanguageDynamic);
            } 
        }]
};

/* *************************************** S I G N   L A N G U A G E   L A N G U A G E S ***************************************
 * ╔═════════════════════════════════════╗
 * ║ (<)        SL Languages          X  ║
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
 * @typedef  {Object}   settingsSignerLanguage Level 2.
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
const settingsSignerLanguage = { title: 'Language', icon: './img/menu/language.png', parent: settingsSignLanguage, final: true, 
    options: [
        { optId: 'signerLanguageEngButton', text: 'English', 
            available: function() { return _slMngr.checkisSignAvailable('en') }, 
            default: function(){ return ('en'.localeCompare(_iconf.sllanguage) == 0)},
            function: function(){
                if(!settingsSignerLanguage.options[0].default()){
                    MenuFunctionsManager.changeAccesLanguage('en', 'sl')(); 
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsSignerLanguage.options[0].optId);
                    mainMenuCtrl.updateAccessOptionsView();                
                }
            } 
        }, 
        { optId: 'signerLanguageEspButton', text: 'Español', 
            available: function() { return _slMngr.checkisSignAvailable('es') },
            default: function(){ return ('es'.localeCompare(_iconf.sllanguage) == 0) },
            function: function(){ 
                if(!settingsSignerLanguage.options[1].default()){
                    MenuFunctionsManager.changeAccesLanguage('es', 'sl')(); 
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsSignerLanguage.options[1].optId);
                    mainMenuCtrl.updateAccessOptionsView();
                }
            } 
        }, 
        { optId: 'signerLanguageGerButton', text: 'Deutsch', 
            available: function() { return _slMngr.checkisSignAvailable('de') },
            default: function(){ return ('de'.localeCompare(_iconf.sllanguage) == 0) },
            function: function(){
                if(!settingsSignerLanguage.options[2].default()){
                    MenuFunctionsManager.changeAccesLanguage('de', 'sl')(); 
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsSignerLanguage.options[2].optId);
                    mainMenuCtrl.updateAccessOptionsView();
                }
            } 
        }, 
        { optId: 'signerLanguageCatButton', text: 'Català', 
            available: function() { return _slMngr.checkisSignAvailable('ca') },
            default: function(){ return ('ca'.localeCompare(_iconf.sllanguage) == 0) },
            function: function(){ 
                if(!settingsSignerLanguage.options[3].default()){
                    MenuFunctionsManager.changeAccesLanguage('ca', 'sl')(); 
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsSignerLanguage.options[3].optId);
                    mainMenuCtrl.updateAccessOptionsView();
                }
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
 * @property {boolean}  preview                Is the preview available for this option.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].default      Function that returns a bool true if option is default and starts in yellow.
 * @property {function} options[].function     Function executed when option is clicked.
 */
const settingsSignLanguagePosition = { title: 'Position', icon: './img/menu/sl_position.png', parent: settingsSignLanguage, final: true, preview: true,
    options: [
        { optId: 'signerRightButton', text: 'Right', 
            default: function(){ return (slConfig.canvasPos.x == 1 && !localStorage.getItem("slPosition"))},
            function:  function(){ 
                if(!settingsSignLanguagePosition.options[0].default()){
                    localStorage.removeItem("slPosition");
                    _slMngr.setPosition( slConfig.initPos.x, stConfig.canvasPos.y*Math.abs(slConfig.initPos.y) );
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsSignLanguagePosition.options[0].optId);
                    if(stConfig.isEnabled && !localStorage.getItem("stPosition")){
                        _stMngr.setPosition(stConfig.canvasPos, stConfig.fixedScene, stConfig.fixedSpeaker);
                    }
                }
            }
        },
        { optId: 'signerLeftButton', text: 'Left', 
            default: function(){ return (slConfig.canvasPos.x == -1 && !localStorage.getItem("slPosition")) },
            function:  function(){ 
                if(!settingsSignLanguagePosition.options[1].default()){
                    localStorage.removeItem("slPosition");
                    _slMngr.setPosition( -1 * slConfig.initPos.x, stConfig.canvasPos.y*Math.abs(slConfig.initPos.y) );
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsSignLanguagePosition.options[1].optId);
                    if(stConfig.isEnabled && !localStorage.getItem("stPosition")){
                        _stMngr.setPosition(stConfig.canvasPos, stConfig.fixedScene, stConfig.fixedSpeaker);
                    }
                }
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
 * @property {boolean}  preview                Is the preview available for this option.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].default      Function that returns a bool true if option is default and starts in yellow.
 * @property {function} options[].function     Function executed when option is clicked.
 */
const settingsSignLanguageSize = { title: 'Size', icon: './img/menu/sl_size.png', parent: settingsSignLanguage, final: true, preview: true, 
    options: [
        { optId: 'signerSmallSizeButton', text: 'Small', 
            default: function(){ return (slConfig.size == 16) },
            function:  function(){ 
                if(!settingsSignLanguageSize.options[0].default()){
                    _slMngr.setSize(16);
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsSignLanguageSize.options[0].optId);
                }
            } 
        }, 
        { optId: 'signerMediumSizeButton', text: 'Medium', 
            default: function(){ return (slConfig.size == 18) },
            function:  function(){ 
                if(!settingsSignLanguageSize.options[1].default()){
                    _slMngr.setSize(18);
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsSignLanguageSize.options[1].optId);
                }
            } 
        },
        { optId: 'signerLargeSizeButton', text: 'Large', 
            default: function(){ return (slConfig.size == 20) },
            function:  function(){ 
                if(!settingsSignLanguageSize.options[2].default()){
                    _slMngr.setSize(20);
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsSignLanguageSize.options[2].optId);
                }
            } 
        }]
};

/* *************************************** S I G N   L A N G U A G E   D Y N A M I C ***************************************
 * ╔═════════════════════════════════════╗
 * ║ (<)          Dynamic             X  ║
 * ╠═════════════════════════════════════╣
 * ║ On                            Final ║
 * ║─────────────────────────────────────║
 * ║ Off                           Final ║
 * ╚═════════════════════════════════════╝
 * Visual example of dropdown
 *
 * @typedef  {Object}   settingsSignLanguagePosition  Level 2.
 * @property {string}   title                  The title shown in the dropdown menu.
 * @property {string}   icon                   Icon path.
 * @property {Object}   parent                 Reference to previews dropdown menu for back navigation.
 * @property {boolean}  final                  Is the dropdown in the last level.
 * @property {boolean}  preview                Is the preview available for this option.
 * @property {array}    options                Array of the different dropdown options
 * @property {string}   options[].optId        Id reference for the next dropdown level.
 * @property {string}   options[].text         Title of the dropdown option.
 * @property {function} options[].default      Function that returns a bool true if option is default and starts in yellow.
 * @property {function} options[].function     Function executed when option is clicked.
 */
const settingsSignLanguageDynamic = { title: 'Dynamic', icon: './img/menu/st_background.png', parent: settingsSignLanguage, final: true, preview: true,
    options: [
        { optId: 'signerDynamicOn', text: 'On', 
            default: function(){ return slConfig.autoHide },
            function:  function(){ 
                if(!settingsSignLanguageDynamic.options[0].default()){
                    slConfig.autoHide = true;
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsSignLanguageDynamic.options[0].optId);
                }
            } 
        },
        { optId: 'signerDynamicOff', text: 'Off', 
            default: function(){ return !slConfig.autoHide },
            function:  function(){
                if(!settingsSignLanguageDynamic.options[1].default()){
                    slConfig.autoHide = false;
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsSignLanguageDynamic.options[1].optId);
                }
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
const settingsAudioDescription = { title: 'Audiodescription', icon: './img/acc_serv_icon/ad_off.png', parent: settingsDropdownOpt, final: false, 
    options: [
        { optId: 'audioDescriptionLanguage', icon: './img/menu/language.png', text: 'Language', 
            available: function(){ return MenuDictionary.getAvailableLanguage()},
            function: function(){ 
                SettingsOptionCtrl.updateDropdownOptions(settingsAudioDescriptionLanguage);
            } 
        },    
        { optId: 'audioDescriptionPresentation', icon: './img/menu/ad_presentation_mode.png', text: 'Presentation', 
            available: function() { return _AudioManager.checkADPresentationAvailable(); },
            function:  function(){ 
                SettingsOptionCtrl.updateDropdownOptions(settingsAudioDescriptionPresentation);
            } 
        },
        { optId: 'audioDescriptionVolume', icon: './img/menu/volume_mute_icon.png', text: 'Volume', 
            available: function() { return _AudioManager.checkADGainAvailable(); },
            function:  function(){ 
                SettingsOptionCtrl.updateDropdownOptions(settingsAudioDescriptionVolume);
            } 
        },
        { optId: 'audioDescriptionSpeed', icon: './img/menu/volume_mute_icon.png', text: 'Extended AD Rate',
            available: function() { return _ManifestParser.hasExtraADLlist(); }, 
            function:  function(){ 
                SettingsOptionCtrl.updateDropdownOptions(settingsAudioDescriptionSpeed);
            } 
        }]
};


/* *************************************** A U D I O   D E S C R I P T I O N   L A N G U A G E S ***************************************
 * ╔═════════════════════════════════════╗
 * ║ (<)        AD Languages          X  ║
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
 * @typedef  {Object}   settingsAudioDescriptionLanguage      Level 2.
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
const settingsAudioDescriptionLanguage = { title: 'Language', icon: './img/menu/language.png', parent: settingsAudioDescription, final: true, 
    options: [
        { optId: 'audioDescriptionLanguageEngButton', text: 'English', 
            available: function() { return  _AudioManager.checkisADAvailable('en') }, 
            default: function(){ return _AudioManager.checkADLang('en') },
            function: function(){ 
                if(!settingsAudioDescriptionLanguage.options[0].default()){
                    MenuFunctionsManager.changeAccesLanguage('en', 'ad')(); 
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioDescriptionLanguage.options[0].optId);
                    mainMenuCtrl.updateAccessOptionsView();
                }
            } 
        }, 
        { optId: 'audioDescriptionLanguageEspButton', text: 'Español', 
            available: function() { return  _AudioManager.checkisADAvailable('es') },
            default: function(){ return _AudioManager.checkADLang('es') },
            function: function(){ 
                if(!settingsAudioDescriptionLanguage.options[1].default()){
                    MenuFunctionsManager.changeAccesLanguage('es', 'ad')(); 
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioDescriptionLanguage.options[1].optId);
                    mainMenuCtrl.updateAccessOptionsView();
                }
            } 
        }, 
        { optId: 'audioDescriptionLanguageGerButton', text: 'Deutsch', 
            available: function() { return  _AudioManager.checkisADAvailable('de') },
            default: function(){ return _AudioManager.checkADLang('de') },
            function: function(){ 
                if(!settingsAudioDescriptionLanguage.options[2].default()){
                    MenuFunctionsManager.changeAccesLanguage('de', 'ad')(); 
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioDescriptionLanguage.options[2].optId);
                    mainMenuCtrl.updateAccessOptionsView();
                }
            } 
        }, 
        { optId: 'audioDescriptionLanguageCatButton', text: 'Català', 
            available: function() { return  _AudioManager.checkisADAvailable('ca') },
            default: function(){ return _AudioManager.checkADLang('ca') },
            function: function(){ 
                if(!settingsAudioDescriptionLanguage.options[3].default()){
                    MenuFunctionsManager.changeAccesLanguage('ca', 'ad')(); 
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioDescriptionLanguage.options[3].optId);
                    mainMenuCtrl.updateAccessOptionsView();
                }
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
const settingsAudioDescriptionPresentation = { title: 'Presentation', icon: './img/menu/ad_presentation_mode.png', parent: settingsAudioDescription, final: true, 
    options: [
        { optId: 'adPresentationVoGButton', text: 'Classic', 
            available: function() { return _AudioManager.checkADPresentationAvailable('VoiceOfGod'); },
            default: function(){ return _AudioManager.checkADPresentationDefault('VoiceOfGod'); },
            function:  function(){ 
                if(!settingsAudioDescriptionPresentation.options[0].default()){
                    _AudioManager.setADPresentation( 'VoiceOfGod' );
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioDescriptionPresentation.options[0].optId);
                }
            } 
        },
        { optId: 'adPresentationFoSButton', text: 'Static', 
            available: function() { return _AudioManager.checkADPresentationAvailable('Friend'); },
            default: function(){ return _AudioManager.checkADPresentationDefault('Friend'); }, 
            function:  function(){ 
                if(!settingsAudioDescriptionPresentation.options[1].default()){
                    _AudioManager.setADPresentation( 'Friend' );
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioDescriptionPresentation.options[1].optId);
                }
            } 
        },
        { optId: 'adPresentationPoAButton', text: 'Dynamic', 
            available: function() { return _AudioManager.checkADPresentationAvailable('Dynamic'); },
            default: function(){ return _AudioManager.checkADPresentationDefault('Dynamic'); },
            function:  function(){ 
                if(!settingsAudioDescriptionPresentation.options[2].default()){
                    _AudioManager.setADPresentation( 'Dynamic' );
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioDescriptionPresentation.options[2].optId);
                }
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
const settingsAudioDescriptionVolume = { title: 'Volume', icon: './img/menu/volume_mute_icon.png', parent: settingsAudioDescription, final: true, 
    options: [
        { optId: 'adVolumeMinButton', text: 'Minimum', 
            available: function() { return _AudioManager.checkADGainAvailable('low'); },
            default: function(){ return _AudioManager.checkADGain('low'); },
            function:  function(){ 
                if(!settingsAudioDescriptionVolume.options[0].default()){
                    _AudioManager.setADGain( 'low' );
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioDescriptionVolume.options[0].optId);
                }
            } 
        },
        { optId: 'adVolumeMidButton', text: 'Medium', 
            available: function() { return _AudioManager.checkADGainAvailable('medium'); },
            default: function(){ return _AudioManager.checkADGain('medium'); },
            function:  function(){
                if(!settingsAudioDescriptionVolume.options[1].default()){
                    _AudioManager.setADGain( 'medium' );
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioDescriptionVolume.options[1].optId);
                }
            } 
        },
        { optId: 'adVolumeMaxButton', text: 'Maximum', 
            available: function() { return _AudioManager.checkADGainAvailable('high'); },
            default: function(){ return _AudioManager.checkADGain('high'); },
            function:  function(){ 
                if(!settingsAudioDescriptionVolume.options[2].default()){
                    _AudioManager.setADGain( 'high' );
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioDescriptionVolume.options[2].optId);
                }

            } 
        }]
};


/* *************************************** A U D I O   D E S C R I P T I O N   S P E E D ***************************************
 * ╔═════════════════════════════════════╗
 * ║ (<)      Extra AD speed          X  ║
 * ╠═════════════════════════════════════╣
 * ║ x1                            Final ║
 * ║─────────────────────────────────────║
 * ║ x1.25                         Final ║
 * ║─────────────────────────────────────║
 * ║ x1.5                          Final ║
 * ╚═════════════════════════════════════╝
 * Visual example of dropdown
 *
 * @typedef  {Object}   settingsAudioDescriptionSpeed  Level 2.
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
const settingsAudioDescriptionSpeed = { title: 'Speed', icon: './img/menu/indicator.png', parent: settingsAudioDescription, final: true, 
    options: [
        { optId: 'adSpeed100Button', text: 'x1', 
            default: function(){ return _AudioManager.checkExtraADSpeed( 1 ); },
            function:  function(){ 
                if(!settingsAudioDescriptionSpeed.options[0].default()){
                    _AudioManager.setExtraADSpeed( 1 );
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioDescriptionSpeed.options[0].optId);
                }
            } 
        },
        { optId: 'adSpeed125Button', text: 'x1.25', 
            default: function(){ return _AudioManager.checkExtraADSpeed( 1.25 ); },
            function:  function(){
                if(!settingsAudioDescriptionSpeed.options[1].default()){
                    _AudioManager.setExtraADSpeed( 1.25 );
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioDescriptionSpeed.options[1].optId);
                }
            } 
        },
        { optId: 'adSpeed150Button', text: 'x1.5', 
            default: function(){ return _AudioManager.checkExtraADSpeed( 1.5 ); },
            function:  function(){ 
                if(!settingsAudioDescriptionSpeed.options[2].default()){
                    _AudioManager.setExtraADSpeed( 1.5 );
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioDescriptionSpeed.options[2].optId);
                }
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
const settingsAudioSubtitles = { title: 'Audiosubtitles', icon: './img/acc_serv_icon/ast_off.png', parent: settingsDropdownOpt, final: false, 
    options: [
        { optId: 'audioSubtitlesLanguage', icon: './img/menu/language.png', text: 'Language', 
            available: function(){ return MenuDictionary.getAvailableLanguage()},
            function: function(){ 
                SettingsOptionCtrl.updateDropdownOptions(settingsAudioSubtitlesLanguages);
            } 
        },       
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

/* *************************************** A U D I O   S U B T I T L E S   L A N G U A G E S ***************************************
 * ╔═════════════════════════════════════╗
 * ║ (<)        AST Languages         X  ║
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
 * @typedef  {Object}   settingsAudioSubtitlesLanguages  Level 2.
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
const settingsAudioSubtitlesLanguages = { title: 'Language', icon: './img/menu/language.png', parent: settingsAudioSubtitles, final: true, 
    options: [
        { optId: 'audioSubtitlesLanguageEngButton', text: 'English', 
            available: function() { return _AudioManager.checkisASTAvailable('en') }, 
            default: function(){ return _AudioManager.checkASTLang('en') },
            function: function(){ 
                if(!settingsAudioSubtitlesLanguages.options[0].default()){
                    MenuFunctionsManager.changeAccesLanguage('en', 'ast')(); 
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioSubtitlesLanguages.options[0].optId);
                    mainMenuCtrl.updateAccessOptionsView();
                }
            } 
        }, 
        { optId: 'audioSubtitlesLanguageEspButton', text: 'Español', 
            available: function() { return _AudioManager.checkisASTAvailable('es') },
            default: function(){ return _AudioManager.checkASTLang('es') },
            function: function(){ 
                if(!settingsAudioSubtitlesLanguages.options[1].default()){
                    MenuFunctionsManager.changeAccesLanguage('es', 'ast')(); 
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioSubtitlesLanguages.options[1].optId);
                    mainMenuCtrl.updateAccessOptionsView();
                }
            } 
        }, 
        { optId: 'audioSubtitlesLanguageGerButton', text: 'Deutsch', 
            available: function() { return _AudioManager.checkisASTAvailable('de') },
            default: function(){ return _AudioManager.checkASTLang('de') },
            function: function(){ 
                if(!settingsAudioSubtitlesLanguages.options[2].default()){
                    MenuFunctionsManager.changeAccesLanguage('de', 'ast')(); 
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioSubtitlesLanguages.options[2].optId);
                    mainMenuCtrl.updateAccessOptionsView();
                }
            } 
        }, 
        { optId: 'audioSubtitlesLanguageCatButton', text: 'Català', 
            available: function() { return _AudioManager.checkisASTAvailable('ca') },
            default: function(){ return _AudioManager.checkASTLang('ca') },
            function: function(){ 
                if(!settingsAudioSubtitlesLanguages.options[3].default()){
                    MenuFunctionsManager.changeAccesLanguage('ca', 'ast')(); 
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioSubtitlesLanguages.options[3].optId);
                    mainMenuCtrl.updateAccessOptionsView();
                }
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
const settingsAudioSubtitlesEasyToRead = { title: 'EasytoRead', icon: './img/menu/easy_to_read.png', parent: settingsAudioSubtitles, final: true, 
    options: [
        { optId: 'astEasyOn', text: 'On', 
            default: function(){ return _AudioManager.checkASTEasy(true); },
            function:  function(){ 
                if(!settingsAudioSubtitlesEasyToRead.options[0].default()){
                    _AudioManager.setSubEasy(  true, list_contents[demoId].ast[1][_AudioManager.getASTLanguage()] );
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioSubtitlesEasyToRead.options[0].optId);
                }
            } 
        },
        { optId: 'astEasyOff', text: 'Off', 
            default: function(){ return _AudioManager.checkASTEasy(false); },
            function:  function(){ 
                if(!settingsAudioSubtitlesEasyToRead.options[1].default()){
                   _AudioManager.setSubEasy( false, list_contents[demoId].ast[0][_AudioManager.getASTLanguage()] );
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioSubtitlesEasyToRead.options[1].optId); 
                }
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
const settingsAudioSubtitlesPresentation = { title: 'Presentation', icon: './img/menu/ad_presentation_mode.png', parent: settingsAudioSubtitles, final: true, 
    options: [
        { optId: 'astPresentationVoGButton', text: 'Classic', 
            available: function() { return _AudioManager.checkASTPresentationAvailable('VoiceOfGod'); },
            default: function(){ return _AudioManager.checkASTPresentationDefault('VoiceOfGod'); },
            function:  function(){ 
                if(!settingsAudioSubtitlesPresentation.options[0].default()){
                    _AudioManager.setASTPresentation( 'VoiceOfGod' );
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioSubtitlesPresentation.options[0].optId);
                }
            } 
        }, 
        { optId: 'astPresentationPoAButton', text: 'Dynamic', 
            available: function() { return  _AudioManager.checkASTPresentationAvailable('Dynamic'); },
            default: function(){ return _AudioManager.checkASTPresentationDefault('Dynamic'); },
            function:  function(){ 
                if(!settingsAudioSubtitlesPresentation.options[1].default()){
                    _AudioManager.setASTPresentation( 'Dynamic' );
                    SettingsOptionCtrl.setChildColumnActiveOpt(settingsAudioSubtitlesPresentation.options[1].optId);
                }
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
const settingsAudioSubtitlesVolume = { title: 'Volume', icon: './img/menu/volume_mute_icon.png', parent: settingsAudioSubtitles, final: true, 
    options: [
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
