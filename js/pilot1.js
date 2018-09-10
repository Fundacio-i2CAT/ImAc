
function runDemo() 
{
    AudioManager.initializeAudio( moData.getListOfVideoContents()[0].vid, list_contents[demoId].audioChannels, camera.matrixWorld.elements );


    MenuDictionary.setSubtitleLanguagesArray( list_contents[demoId].subtitles[0] );
    MenuDictionary.setSignerLanguagesArray( list_contents[demoId].signer[0] );

    moData.createPointer();

    subController.enableSubtitles();
    subController.initSubtitle( 70, 0, -1, 'arrow' );
    subController.setSubtitle( list_contents[demoId].subtitles[0]['en'] );

    subController.setSignerContent( list_contents[demoId].signer[0]['en'] );

    ppMMgr.playAll();
}
