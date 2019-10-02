/**
 * @author isaac.fraile@i2cat.net
 */

AudioManager = function() {

    var audioResources = Array();
    var audioResources_order_1 = Array();
    var volume; // Variable for volume level state saving;
    var isMuted = false;
    var foaRenderer,
        isAmbisonics,
        activeVideoElement;  // Video element been reproduced.

    var foaRendererList = [];  // [0] ==> AD foaRenderer,  [1] ==> AST foaRenderer
    
    // [AD] audio description vars 
    var _AD;  // AD audio element
    var adContent; // URL
    var adContentArray; // URL
    var adVolume = 100; // Integer: Volume percentage
    var adGain = 1;
    var adEnabled = false; // boolean
    var adLang = 'en'; // string (en, de, ca, es)
    var adAvailableLang = []; // Array { name, value, default:bool }
    var adAvailablePresentation = [];
    var adPresentation = 'VoiceOfGod'; // string (VoiceOfGod (classic), Friend (static), Dynamic)

    // [AST] audio subtitles vars 
    var _AST;  
    var astContent; // URL
    var astContentArray; // URL
    var astVolume = 50; // Integer: Volume percentage
    var astEnabled = false; // boolean
    var astLang = 'en'; // string (en, de, ca, es)
    var astAvailableLang = []; // Array { name, value, default:bool }
    var astEasy = false; // boolean
    var astAvailablePresentation = [];
    var astPresentation = 'VoiceOfGod'; // string (VoiceOfGod (classic), Dynamic)

    var extraADSpeed = 1;

//************************************************************************************
// Private Functions
//************************************************************************************

    function getFOARenderer(audioContext)
    {
        return Omnitone.createFOARenderer( audioContext, { hrirPathList: audioResources_order_1 } );
    }

    function getHOARenderer(audioContext)
    {
        return Omnitone.createHOARenderer( audioContext, { hrirPathList: audioResources } );
    }

    function updateMatrix4(m)
    {
        if ( foaRenderer ) foaRenderer.setRotationMatrix4( m );

        if ( foaRendererList.length > 0 ) {
            foaRendererList.forEach( function( elem ) { 
                if (elem) elem.setRotationMatrix4( m );
            });
        }
    }

    function initAdditionAudio(id, object)
    {
        // Create AudioContext, MediaElementSourceNode and FOARenderer.
        var audioContext = new AudioContext();
        var audioElementSource = audioContext.createMediaElementSource( object );
        var foaRenderer_ = getFOARenderer( audioContext );

        foaRendererList[id] = foaRenderer_;

        // Make connection and start play.
        foaRenderer_.initialize().then(function() {
            audioElementSource.connect(foaRenderer_.input);
            foaRenderer_.output.connect(audioContext.destination);
            if ( !VideoController.isPausedById(0) ) object.play();
            updateMatrix4( camera.matrixWorld.elements )
        });
    }

    function addAudio(type)
    {
        if ( type == 'AD' )
        {       
            if ( foaRendererList[0] ) removeAudio( type );

            _AD = document.createElement('audio');
            _AD.crossOrigin = "anonymous";
            _AD.src = adContent;
            _AD.volume = adVolume/100;

            initAdditionAudio( 0, _AD );
            VideoController.addAudioContent( _AD );
        }
        else if ( type == 'AST' )
        {          
            if ( foaRendererList[1] ) removeAudio( type );

            _AST = document.createElement('audio');
            _AST.crossOrigin = "anonymous";
            _AST.src = astContent;
            _AST.volume = astVolume/100;

            initAdditionAudio( 1, _AST );
            VideoController.addAudioContent( _AST );
        }
    }

    function removeAudio(type)
    {
        if ( type == 'AD' )
        {
            VideoController.removeAudioContent( _AD );
            foaRendererList[0] = undefined;
            _AD.setAttribute('src', ''); 
        }
        else if ( type == 'AST' )
        {
            VideoController.removeAudioContent( _AST );
            foaRendererList[1] = undefined;
            _AST.setAttribute('src', ''); 
        }     
    }

//************************************************************************************
// Public Functions
//************************************************************************************

    this.initAmbisonicResources = function()
    {
        console.log( '[AudioManager] Initialized audio resources' );

        isAmbisonics = false;

        audioResources.push( 'resources/omnitone-toa-1.wav' );
        audioResources.push( 'resources/omnitone-toa-2.wav' );
        audioResources.push( 'resources/omnitone-toa-3.wav' );
        audioResources.push( 'resources/omnitone-toa-4.wav' );
        audioResources.push( 'resources/omnitone-toa-5.wav' );
        audioResources.push( 'resources/omnitone-toa-6.wav' );
        audioResources.push( 'resources/omnitone-toa-7.wav' );
        audioResources.push( 'resources/omnitone-toa-8.wav' );

        audioResources_order_1.push( 'resources/omnitone-foa-1.wav' );
        audioResources_order_1.push( 'resources/omnitone-foa-2.wav' );
    };

    this.initializeAudio = function(videoElement, n, m)
    {
        var audioContext = new AudioContext();

        activeVideoElement = videoElement;
        activeVideoElement.volume = 1.0; // Start volume level in 0.5 
        videoElement.muted = false;

        var videoElementSource = audioContext.createMediaElementSource( videoElement );

        foaRenderer = n < 16 ? getFOARenderer( audioContext ) : getHOARenderer( audioContext );

        foaRenderer.initialize().then(function() 
        {
            isAmbisonics = n > 2 ? true : false;
            videoElementSource.connect( foaRenderer.input );
            foaRenderer.output.connect( audioContext.destination );

            isAmbisonics ? updateMatrix4( m ) : foaRenderer.setRenderingMode( 'bypass' );

        }, function () 
        {
            console.error( '[AudioManager] Error to init Ambisonics' );
        });
    };

    this.getFoaRenderer = function()
    {
        return foaRenderer;
    };

    this.setmute = function()
    {
        if ( adEnabled )
        {
            //isMuted = true;
            //_AudioManager.setVolume( 'AD', 0 );
            volume = activeVideoElement.volume;
            activeVideoElement.volume = 0;
        }
        else {
            isMuted = true;
            volume = activeVideoElement.volume;
            activeVideoElement.volume = 0;
        }
    };

    this.setunmute = function()
    {
        if ( adEnabled )
        {
            //isMuted = false;
            //_AudioManager.setVolume( 'AD', 50 );
            volume = activeVideoElement.volume;
            activeVideoElement.volume = 0;
        }
        else {
            isMuted = false;
            activeVideoElement.volume = volume > 0 ? volume : 0.5;
        }
    };

    this.changeVolume = function(value)
    {
        if ( adEnabled )
        {
            /*var level = adVolume + (value*100)
            _AudioManager.setVolume( 'AD', level);*/

            var newVolume = _AD.volume + value;

            if ( newVolume < 0 )
            {
                newVolume = 0;
            }
            else if ( newVolume > 1 )
            {
                newVolume = 1;
            }
            
            _AD.volume = newVolume;
            volume = _AD.volume;
        }
        else {
            var newVolume = activeVideoElement.volume + value;

            if ( newVolume < 0 )
            {
                newVolume = 0;
            }
            else if ( newVolume > 1 )
            {
                newVolume = 1;
            }
            
            activeVideoElement.volume = newVolume;
            volume = activeVideoElement.volume;
        }
    };

    this.isAmbisonics = function()
    {
        return isAmbisonics;
    };

    this.updateRotationMatrix = function(m)
    {
        if ( isAmbisonics ) updateMatrix4( m );
    };

    this.getVolume = function()
    {
        if ( adEnabled ) return Math.round(_AD.volume * 100) / 100;
        else return Math.round(activeVideoElement.volume * 100) / 100
    };

    this.getAudiContext = function()
    {
        return foaRenderer._context;
    };

    this.removeAudio = function()
    {
        foaRenderer = undefined;
    };

    this.isAudioMuted = function()
    {
        return isMuted;
    };

    this.switchAD = function(enable)
    {
        // protection condition ???
            adEnabled = enable;
            //enable ? addAudio( 'AD' ) : removeAudio( 'AD' );
            if ( enable )
            {
                addAudio( 'AD' ); 
                this.setmute();
            }
            else 
            {
                removeAudio( 'AD' ); 
                this.setunmute();
            }      
    };

    this.switchAST = function(enable)
    {
        // protection condition ???
            astEnabled = enable;
            enable ? addAudio( 'AST' ) : removeAudio( 'AST' );       
    };

    this.setVolume = function( type, level )
    {
        if ( type == 'AD' )
        {
            adVolume = level > 100 ? 100 : level < 0 ? 0 : level;
            if ( _AD ) _AD.volume = adVolume/100;
        }
        else if ( type == 'AST' )
        {
            astVolume = level;
            if ( _AST ) _AST.volume = astVolume/100;
        }
    };  

    this.startBeep = function(time)
    {
        if ( adEnabled ) _AD.volume = _AD.volume /2;

        setTimeout( () => {

            var audio = new Audio('./resources/beep.mp3' );
            audio.play();

            audio.onended = function() {
                if ( adEnabled ) _AD.volume = _AD.volume *2;
            }

        }, time);
    } 

//************************************************************************************
// Public AD Getters
//************************************************************************************

    this.getADPresentationArray = function()
    {
        return adAvailablePresentation;
    };

    this.getADLanguagesArray = function()
    {
        return adAvailableLang;
    };

    this.getADEnabled = function() 
    {
        return adEnabled;
    };

    this.getADLanguage = function()
    {
        return adLang;
    };

    this.getADPresentation = function()
    {
        return adPresentation;
    };

    this.getADVolume = function()
    {
        return adVolume;
    };

    this.getADConfig = function()
    {
        return {
            enabled: adEnabled,
            lang: adLang,
            volume: adVolume,
            mode: adPresentation
        };
    };

    this.getExtraADSpeed = function()
    {
        return extraADSpeed;
    };

    this.getADAvailableLang = function(lang)
   {
       if ( list_contents[demoId].ad[0][lang] ) return lang;
       else if ( list_contents[demoId].acces[0].AD && list_contents[demoId].ad[0][list_contents[demoId].acces[0].AD[0]] ) {
           _iconf.adlanguage = list_contents[demoId].acces[0].AD[0];
           return list_contents[demoId].acces[0].AD[0];
       }
       else return;
   }

//************************************************************************************
// Public AST Getters
//************************************************************************************

    this.getASTLanguagesArray = function()
    {
        return astAvailableLang;
    };

    this.getASTEnabled = function() 
    {
        return astEnabled;
    };

    this.getASTLanguage = function()
    {
        return astLang;
    };

    this.getSubEasy = function()
    {
        return astEasy;
    };

    this.getASTLanguage = function()
    {
        return astLang;
    };

    this.getASTPresentation = function()
    {
        return astPresentation;
    }

    this.getASTVolume = function()
    {
        return astVolume;
    }

    this.getASTConfig = function()
    {
        return {
            enabled: astEnabled,
            lang: astLang,
            volume: astVolume,
            easy: astEasy
        };
    };

//************************************************************************************
// Public AD Setters
//************************************************************************************

    // Need modify conf.advolume to conf.adGain
    this.setADConfig = function(conf)
    {
        //adEnabled = conf.enabled;
        adLang = conf.adlanguage;
        adVolume = 100;
        adGain = conf.advolume == 'max' ? 3 : conf.advolume == 'mid' ? 2 : 1;
        adPresentation = conf.admode == 'god' ? 'VoiceOfGod' : conf.admode == 'friend' ? 'Friend' : 'Dynamic';
        extraADSpeed = conf.adspeed == 'x100' ? 1 : conf.adspeed == 'x125' ? 1.25 : 1.5;
    };

    this.setADContent = function(content, lang)
    {
        adLang = lang;
        if ( content )
        {
            if ( !content[adPresentation] ) adPresentation = Object.keys( content );
            if ( !content[adPresentation][adGain] ) adGain = Object.keys( content[adPresentation] );

            adContent = content[adPresentation][adGain];
            
            if ( adEnabled ) addAudio( 'AD' );
        }
    }; 

    this.setADPresentation = function(value)
    {
        adPresentation = value;
        adContent = adContentArray[adLang][adPresentation][adGain];
        if ( adEnabled ) addAudio( 'AD' );
    };

    this.setADLanguagesArray = function(subList)
    {
        adAvailableLang = [];
        adContentArray = subList;

        if ( subList['en'] ) 
        {
            adAvailableLang.push(
            {
                name: 'adEngButton', 
                value: 'en', 
                default: ( 'en' == adLang )
            } );
        }
        if ( subList['de'] ) 
        {
            adAvailableLang.push(
            {
                name: 'adGerButton', 
                value: 'de', 
                default: ( 'de' == adLang )
            } );
        }
        if ( subList['es'] ) 
        {
            adAvailableLang.push(
            {
                name: 'adEspButton', 
                value: 'es', 
                default: ( 'es' == adLang )
            } );
        }
        if ( subList['ca'] ) 
        {
            adAvailableLang.push(
            {
                name: 'adCatButton', 
                value: 'ca', 
                default: ( 'ca' == adLang )
            } );
        }
    };

    this.setADPresentationArray = function(subList)
    {
        adAvailablePresentation = [];

        if (subList) 
        {

            if ( subList['VoiceOfGod'] ) 
            {
                adAvailablePresentation.push(
                {
                    name: 'adVOGButton', 
                    value: 'VoiceOfGod', 
                    default: ( 'VoiceOfGod' == adPresentation )
                } );
            }
            if ( subList['Friend'] ) 
            {
                adAvailablePresentation.push(
                {
                    name: 'adFriendButton', 
                    value: 'Friend', 
                    default: ( 'Friend' == adPresentation )
                } );
            }
            if ( subList['Dynamic'] ) 
            {
                adAvailablePresentation.push(
                {
                    name: 'adDynamicButton', 
                    value: 'Dynamic', 
                    default: ( 'Dynamic' == adPresentation )
                } );
            }
        }
    };

    this.setExtraADSpeed = function(speed)
    {
        extraADSpeed = speed;
    }

    this.setADGain = function(gain)
    {
        adGain = gain;
        adContent = adContentArray[adLang][adPresentation][adGain];
        if ( adEnabled ) addAudio( 'AD' );
    }

//************************************************************************************
// Public AD Checkers
//************************************************************************************

    this.checkADPresentationDefault = function(x){
        return x == adPresentation;
    };

    this.checkADPresentationAvailable = function(val){
        if(val){
            return list_contents[demoId].ad[0][_iconf.adlanguage].hasOwnProperty(val)
        } else {
            return list_contents[demoId].ad[0].hasOwnProperty(_iconf.adlanguage)
        }
    };

    this.checkADVolume = function(x){
        return x == adVolume;
    };   

    this.checkisADAvailable = function(lang){
        return (list_contents[demoId].acces && list_contents[demoId].acces[0].AD && list_contents[demoId].acces[0].AD.includes((lang) ? lang : _iconf.adlanguage) );
    };

    this.checkExtraADSpeed = function(speed)
    {
        return extraADSpeed == speed;
    };

    this.checkADGain = function(gain)
    {
        return adGain == gain;
    }

    

//************************************************************************************
// Public AST Setters
//************************************************************************************

    this.setASTConfig = function(conf)
    {
        //astEnabled = conf.enabled;
        astLang = conf.astlanguage;
        astVolume = conf.astvolume == 'max' ? 100 : conf.astvolume == 'mid' ? 50 : 10;
        astEasy = conf.aste2r == 'true' ? true : false;
        astPresentation = conf.astmode == 'god' ? 'VoiceOfGod' : 'Dynamic';
    };

    this.setASTContent = function(url, lang)
    {
        if ( url ) {
            astContent = url[astPresentation] || url[Object.keys(url)[0]];
            astLang = lang;
            if ( astEnabled ) addAudio( 'AST' );
        }
    }; 

    this.setASTPresentation = function(value)
    {
        astPresentation = value;
        astContent = astContentArray[astLang][astPresentation];
        if ( astEnabled ) addAudio( 'AST' );
    };

    this.setASTPresentationArray = function(subList)
    {
        astAvailablePresentation = [];

        if ( subList['VoiceOfGod'] ) 
        {
            astAvailablePresentation.push(
            {
                name: 'adVOGButton', 
                value: 'VoiceOfGod', 
                default: ( 'VoiceOfGod' == astPresentation )
            } );
        }
        if ( subList['Dynamic'] ) 
        {
            astAvailablePresentation.push(
            {
                name: 'adDynamicButton', 
                value: 'Dynamic', 
                default: ( 'Dynamic' == astPresentation )
            } );
        }
    };

    this.setASTLanguagesArray = function(subList)
    {
        astAvailableLang = [];
        astContentArray = subList;

        if ( subList['en'] ) 
        {
            astAvailableLang.push(
            {
                name: 'astEngButton', 
                value: 'en', 
                default: ( 'en' == astLang )
            } );
        }
        if ( subList['de'] ) 
        {
            astAvailableLang.push(
            {
                name: 'astGerButton', 
                value: 'de', 
                default: ( 'de' == astLang )
            } );
        }
        if ( subList['es'] ) 
        {
            astAvailableLang.push(
            {
                name: 'astEspButton', 
                value: 'es', 
                default: ( 'es' == astLang )
            } );
        }
        if ( subList['ca'] ) 
        {
            astAvailableLang.push(
            {
                name: 'astCatButton', 
                value: 'ca', 
                default: ( 'ca' == astLang )
            } );
        }
    };

    this.setSubEasy = function(easy, xml)
    {
        astEasy = easy;
        this.setASTContent( xml, astLang );
    };   

//************************************************************************************
// Public AST Checkers
//************************************************************************************

    this.checkASTPresentationDefault = function(x){
        return x == astPresentation;
    };


    this.checkASTPresentationAvailable = function(val){
        if(val){
            return list_contents[demoId].ast[0][_iconf.astlanguage].hasOwnProperty(val)
        } else {
            return list_contents[demoId].ast[0].hasOwnProperty(_iconf.astlanguage)
        }
    };

    this.checkASTVolume = function(x)
    {
        return x == astVolume;
    }; 

    this.checkASTEasy = function(x)
    {
        return x == astEasy;
    }; 

    this.checkisASTAvailable = function(lang){
        return (list_contents[demoId].acces && list_contents[demoId].acces[0].AST && list_contents[demoId].acces[0].AST.includes((lang) ? lang : _iconf.astlanguage));
    } 
}