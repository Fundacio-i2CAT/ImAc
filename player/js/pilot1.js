
// Page 2 Design Open Group Test (P2DOGT)

function runDemo() 
{
    _AudioManager.initializeAudio( VideoController.getListOfVideoContents()[0].vid, list_contents[demoId].audioChannels, camera.matrixWorld.elements );

    MenuDictionary.setSubtitleLanguagesArray( list_contents[demoId].subtitles[0] );
    MenuDictionary.setSignerLanguagesArray( list_contents[demoId].signer[0] );

    _moData.createPointer();

    var lang = MenuDictionary.getMainLanguage();

    subController.enableSubtitles();
    subController.initSubtitle( 70, 0, -1, 'none' );

    var sublang = list_contents[demoId].subtitles[0][lang] ? lang : Object.keys(list_contents[demoId].subtitles[0])[0];
    var siglang = list_contents[demoId].signer[0][lang] ? lang : Object.keys(list_contents[demoId].signer[0])[0];

    subController.setSubtitle( list_contents[demoId].subtitles[0][sublang], sublang );

    subController.setSignerContent( list_contents[demoId].signer[0][siglang], siglang );

    initLanguageButtons(lang, siglang, sublang);

    //VideoController.playAll();
    VideoController.init();
}

function initLanguageButtons(lang, siglang, sublang)
{
    if ( siglang == 'de' ) 
    {
        signerLanguage = 'signerGerButton';
    }
    else if ( siglang == 'ca' ) 
    {
        signerLanguage = 'signerCatButton';
    }
    else if ( siglang == 'es' ) 
    {
        signerLanguage = 'signerEspButton';
    }
    else if ( siglang == 'en' ) 
    {
        signerLanguage = 'signerEngButton';
    }

    if ( sublang == 'de' ) 
    {
        subtitlesLanguage = 'subtitlesGerButton';
    }
    else if ( sublang == 'ca' ) 
    {
        subtitlesLanguage = 'subtitlesCatButton';
    }
    else if ( sublang == 'es' ) 
    {
        subtitlesLanguage = 'subtitlesEspButton';
    }
    else if ( sublang == 'en' ) 
    {
        subtitlesLanguage = 'subtitlesEngButton';
    }
}
