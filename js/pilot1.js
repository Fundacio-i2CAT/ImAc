
function runDemo() 
{
    AudioManager.initializeAudio( moData.getListOfVideoContents()[0].vid, list_contents[demoId].audioChannels, camera.matrixWorld.elements );

    MenuManager.createMenu(true);

    /*var menuTrad = MenuManager.createMenuTrad();
    interController.addInteractiveObject(menuTrad);*/

    moData.createPointer();

    subController.enableSubtitles();
    subController.initSubtitle( 70, 0, -1, 'none' );
    subController.setSubtitle( list_contents[demoId].subtitles[0]['en'] );

    ppMMgr.playAll();
}
