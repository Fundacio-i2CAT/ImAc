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

var subtitlesLanguage = 'subtitleEngButton';
var subtitlesPosition = 'subtitleBottomButton';
var subtitlesSize = 'subtitleSmallAreaButton';
var subtitlesIndicator = 'subtitleIndicatorArrowButton';



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
                'showSubtitleMenuButton',
                'showSignLanguageMenuButton', 
                'showAudioDescriptionMenuButton', 
                'showAudioSubtitleMenuButton',
                'disabledSubtitleMenuButton',
                'disabledSignLanguageMenuButton', 
                'disabledAudioDescriptionMenuButton', 
                'disabledAudioSubtitleMenuButton'
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
                        'settingsLanguageCatButton',
                        'settingsLanguageGerButton'
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
            name: 'subtitleMenu', isEnabled: true, firstmenuindex: 4,
            submenus:
            [
                { 
                    name: 'subtitleLanguages', 
                    buttons:
                    [
                        'subtitleEngButton', 
                        'subtitleEspButton',
                        'subtitleGerButton',
                        'subtitleCatButton'
                    ]
                },
                { 
                    name: 'subtitleShowPositions', 
                    buttons:
                    [
                        'subtitleTopButton',
                        'subtitleBottomButton'
                    ]
                },
                { 
                    name: 'subtitleAreas', 
                    buttons:
                    [
                        'subtitleSmallAreaButton', 
                        'subtitleMediumlAreaButton',
                        'subtitleLargeAreaButton'
                    ]
                },
                { 
                    name: 'subtitleIndicator', 
                    buttons:
                    [
                        'subtitleIndicatorNoneButton', 
                        'subtitleIndicatorArrowButton',
                        'subtitleIndicatorRadarButton'
                    ]
                }
            ],
            buttons: 
            [
                'subtitleOnButton', 
                'subtitleOffButton',
                'subtitleShowLanguagesDropdown',
                'subtitleShowPositionsDropdown',
                'subtitleShowAreasDropdown',
                'subtitleShowIndicatorDropdown'
            ]
        },                                   
/*7*/   { 
            name: 'signLanguageMenu', isEnabled: false, firstmenuindex: 4, 
            buttons: 
            [
                'signLanguageOnButton', 
                'signLanguageOffButton'
            ]
        },
/*8*/   { 
            name: 'audioDescriptionMenu', isEnabled: false, firstmenuindex: 4, 
            buttons: 
            [
                'audioDescriptionOnButton', 
                'audioDescriptionOffButton'
            ]
        },
/*9*/   { 
            name: 'audioSubtitleMenu', isEnabled: false, firstmenuindex: 4, 
            buttons: 
            [
                'audioSubtitleOnButton', 
                'audioSubtitleOffButton'
            ]
        }                                    
    ];