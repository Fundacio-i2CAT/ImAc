
function runDemo() 
{
    AudioManager.initializeAudio( moData.getListOfVideoContents()[0].vid, list_contents[demoId].audioChannels, camera.matrixWorld.elements );

    /*switch ( menuType )
    {
        case 1:
        default:
            MenuManager.createMenu(true);
            break;
        case 2:
            MenuManager.createMenu(false);
            break;
        case 3:
            var menuTrad = MenuManager.createMenuTrad();
            interController.addInteractiveObject(menuTrad);
            break;
    }*/

    var menuTrad = MenuManager.createMenuTrad();
    interController.addInteractiveObject(menuTrad);

    MenuDictionary.setSubtitleLanguagesArray( list_contents[demoId].subtitles[0] );
    MenuDictionary.setSignerLanguagesArray( list_contents[demoId].signer[0] );

    moData.createPointer();

    subController.enableSubtitles();
    subController.initSubtitle( 70, 0, -1, 'arrow' );
    subController.setSubtitle( list_contents[demoId].subtitles[0]['en'] );

    subController.setSignerContent( list_contents[demoId].signer[0]['en'] );

    ppMMgr.playAll();
}
