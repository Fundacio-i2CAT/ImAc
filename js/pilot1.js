
function runDemo() 
{
    _AudioManager.initializeAudio( VideoController.getListOfVideoContents()[0].vid, list_contents[demoId].audioChannels, camera.matrixWorld.elements );

    MenuDictionary.setSubtitleLanguagesArray( list_contents[demoId].subtitles[0] );
    MenuDictionary.setSignerLanguagesArray( list_contents[demoId].signer[0] );

    _moData.createPointer();

    var lang = MenuDictionary.getMainLanguage();

    subController.enableSubtitles();
    if ( demoId != 4 && demoId != 6 ) subController.initSubtitle( 70, 0, -1, 'arrow' );
    else subController.initSubtitle( 70, 0, -1, 'radar' );

    subController.setSubtitle( list_contents[demoId].subtitles[0][lang], lang );

    subController.setSignerContent( list_contents[demoId].signer[0][lang], lang );

    initLanguageButtons(lang);

    VideoController.playAll();
    VideoController.init();

    if ( demoId == 3 ) VideoController.seekAll( 389 );
    else if ( demoId == 2 ) VideoController.seekAll( 30 );
}

function initLanguageButtons(lang)
{
    if ( lang == 'de' ) 
    {
        subtitlesLanguage = 'subtitlesGerButton';
        signerLanguage = 'signerGerButton';
    }
    else if ( lang == 'ca' ) 
    {
        subtitlesLanguage = 'subtitlesCatButton';
        signerLanguage = 'signerCatButton';
    }
    else if ( lang == 'es' ) 
    {
        subtitlesLanguage = 'subtitlesEspButton';
        signerLanguage = 'signerEspButton';
    }
    else if ( lang == 'en' ) 
    {
        subtitlesLanguage = 'subtitlesEngButton';
        signerLanguage = 'signerEngButton';
    }
}
