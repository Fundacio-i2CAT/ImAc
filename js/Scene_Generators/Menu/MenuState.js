var _isTradMenuOpen = false;
var menuAngle = 0;
var isUserInSecondLevelMenus = false;
var submenuNameActive;
var firstColumnActiveButton;
var secondColumnActiveButton;

var initialVolumeLevel = 0.5;

var settingsLanguage = 'settingsLanguageEngButton';

var isSubtitlesActive = true;
var isSignLanguageActive = false;
var isAudioDescriptionActive = false;
var isAudioSubtitleActive = false;

var subtitlesLanguage = 'subtitlesEngButton';
var subtitlesPosition = 'subtitlesBottomButton';
var subtitlesSize = 'subtitlesLargeSizeButton';
var subtitlesIndicator = 'subtitlesIndicatorArrowButton';
var subtitlesEasy = 'subtitlesEasyOff';
var subtitlesBackground = 'subtitlesSemitrans';
var subtitlesArea = 'subtitlesLargeAreaButton'; 
var mainLanguage = 'settingsLanguageEngButton';

var signerPosition = 'signerBottomButton';
var signerIndicator = 'signerIndicatorNoneButton';
var signerArea = 'signerLargeAreaButton';
var signerLanguage = 'signerEngButton';



//*******************************************************************************************************
//
//                              M E N U       S T R U C T U R E 
// 
//*******************************************************************************************************

var multiOptionsMainSubMenuIndexes = [[6,0,4],[7,1,5],[8,2,6],[9,3,7]];

var numberFirstLevelMenus = 5;
var menuList = 
    [
/*0*/   { 
            name: 'backgroudMenu', 
            buttons: 
            [
                'closeMenuButton', 
                'forwardMenuButton', 
                'backMenuButton'
            ]
        },                                     
/*1*/   { 
            name: 'playSeekMenu', 
            buttons: 
            [
                'playButton', 
                'pauseButton', 
                'backSeekButton', 
                'forwardSeekButton'
            ]
        },                            
/*2*/   { 
            name: 'volumeChangeMenu', 
            buttons: 
            [
                'minusVolumeButton', 
                'plusVolumeButton', 
                'unmuteVolumeButton', 
                'muteVolumeButton'
            ]
        },         
/*3*/   { 
            name: 'settingsCardboardMenu', 
            buttons: 
            [
                'settingsButton', 
                'cardboardButton'
            ]
        }, 
/*4*/   { 
            name: 'multiOptionsMenu', 
            buttons: 
            [
                'showSubtitlesMenuButton',
                'showSignLanguageMenuButton', 
                'showAudioDescriptionMenuButton', 
                'showAudioSubtitlesMenuButton',
                'disabledSubtitlesMenuButton',
                'disabledSignLanguageMenuButton', 
                'disabledAudioDescriptionMenuButton', 
                'disabledAudioSubtitlesMenuButton'
            ]
        }, 

// SECOND LEVEL MENUS

/*5*/   { 
            name: 'settingsMenu', isEnabled: true, firstmenuindex: 3, 
            submenus:
            [
                { 
                    name:'settingsLanguages', 
                    buttons:
                    [
                        'settingsLanguageEngButton',
                        'settingsLanguageEspButton',
                        'settingsLanguageGerButton',
                        'settingsLanguageCatButton'
                    ]
                },
                { 
                    name:'settingsVoiceControl', 
                    buttons:['vc1']
                },
                { 
                    name:'settingsUserProfile', 
                    buttons:['up1', 'up2']
                }
            ],
            buttons: 
            [
                'settingsLanguageButton',
                'settingsVoiceControlButton',
                'settingsUserProfileButton'
            ]
        },                                                       
/*6*/   { 
            name: 'subtitlesMenu', isEnabled: true, firstmenuindex: 4,
            submenus:
            [
                { 
                    name: 'subtitlesLanguages', 
                    buttons:
                    [
                        'subtitlesEngButton', 
                        'subtitlesEspButton',
                        'subtitlesGerButton',
                        'subtitlesCatButton'
                    ]
                },
                { 
                    name: 'subtitlesEasyRead', 
                    buttons:
                    [
                        'subtitlesEasyOn',
                        'subtitlesEasyOff'
                    ]
                },
                { 
                    name: 'subtitlesShowPositions', 
                    buttons:
                    [
                        'subtitlesTopButton',
                        'subtitlesBottomButton'
                    ]
                },
                { 
                    name: 'subtitlesBackground', 
                    buttons:
                    [
                        'subtitlesSemitrans',
                        'subtitlesOutline'
                    ]
                },
                { 
                    name: 'subtitlesSizes', 
                    buttons:
                    [
                        'subtitlesSmallSizeButton', 
                        'subtitlesMediumSizeButton',
                        'subtitlesLargeSizeButton'
                    ]
                },
                { 
                    name: 'subtitlesIndicator', 
                    buttons:
                    [
                        'subtitlesIndicatorNoneButton', 
                        'subtitlesIndicatorArrowButton',
                        'subtitlesIndicatorRadarButton',
                        'subtitlesIndicatorAutoButton'
                    ]
                },
                { 
                    name: 'subtitlesAreas', 
                    buttons:
                    [
                        'subtitlesSmallAreaButton', 
                        'subtitlesMediumAreaButton',
                        'subtitlesLargeAreaButton'
                    ]
                }
            ],
            buttons: 
            [
                'subtitlesOnButton', 
                'subtitlesOffButton',
                'subtitlesShowLanguagesDropdown',
                'subtitlesShowEasyReadDropdown',
                'subtitlesShowPositionsDropdown',
                'subtitlesShowBackgroundDropdown',
                'subtitlesShowSizesDropdown',
                'subtitlesShowIndicatorDropdown',
                'subtitlesShowAreasDropdown',
                'subtitlesUpButton', 
                'subtitlesDownButton',
            ]
        },                                   
/*7*/   { 
            name: 'signLanguageMenu', isEnabled: false, firstmenuindex: 4, 
            submenus:[
                { 
                    name: 'signerLanguages', 
                    buttons:
                    [
                        'signerEngButton', 
                        'signerEspButton',
                        'signerGerButton',
                        'signerCatButton'
                    ]
                },
                { 
                    name: 'signerShowPositions', 
                    buttons:
                    [
                        'signerTopButton',
                        'signerBottomButton'
                    ]
                },
                { 
                    name: 'signerIndicator', 
                    buttons:
                    [
                        'signerIndicatorNoneButton', 
                        'signerIndicatorArrowButton',
                        'signerIndicatorRadarButton'
                    ]
                },
                { 
                    name: 'signerAreas', 
                    buttons:
                    [
                        'signerSmallAreaButton', 
                        'signerMediumlAreaButton',
                        'signerLargeAreaButton'
                    ]
                }
            ],
            buttons: 
            [
                'signLanguageOnButton', 
                'signLanguageOffButton',
                'signShowLanguagesDropdown',
                'signShowPositionsDropdown',
                'signShowIndicatorDropdown',
                'signShowAreasDropdown'
            ]
        },
/*8*/   { 
            name: 'audioDescriptionMenu', isEnabled: false, firstmenuindex: 4, 
            submenus:[
                { 
                    name: 'audioDescriptionLanguages', 
                    buttons:
                    [
                        'adEngButton', 
                        'adEspButton',
                        'adGerButton',
                        'adCatButton'
                    ]
                },
                { 
                    name: 'audioDescriptionPresentation', 
                    buttons:
                    [
                        'adPrespectiveButton', 
                        'adAnchoredButton',
                        'adClassicButton',
                        'adPanoramaButton'
                    ]
                },
                { 
                    name: 'audioDescriptionVolume', 
                    buttons:
                    [
                        'adPlusButton',
                        'adMinusButton'
                    ]
                }
            ],
            buttons: 
            [
                'audioDescriptionOnButton', 
                'audioDescriptionOffButton',
                'audioDescriptionShowLanguagesDropdown',
                'audioDescriptionShowPrespectiveDropdown'
            ]
        },
/*9*/   { 
            name: 'audioSubtitlesMenu', isEnabled: false, firstmenuindex: 4, 
            submenus:[
                { 
                    name: 'audioSubtitlesLanguages', 
                    buttons:
                    [
                        'astEngButton', 
                        'astEspButton',
                        'astGerButton',
                        'astCatButton'
                    ]
                },
                { 
                    name: 'audioSubtitlesEasy', 
                    buttons:
                    [
                        'astEasyOn',
                        'astEasyOff'
                    ]
                },
                { 
                    name: 'audioSubtitlesVolume', 
                    buttons:
                    [
                        'astPlusButton',
                        'astMinusButton'
                    ]
                }
            ],
            buttons: 
            [
                'audioSubtitlesOnButton', 
                'audioSubtitlesOffButton',
                'audioSubtitlesShowLanguagesDropdown',
                'audioSubtitlesShowEasyDropdown'
            ]
        }                                    
    ];


