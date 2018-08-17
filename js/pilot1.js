
function runDemo() 
{
  	console.log("Running demo " + demoId)

  	var listVideoContent = moData.getListOfVideoContents();
    var _videoElement = listVideoContent[0].vid;
    var audioChannels =  list_contents[demoId].audioChannels;
    
    AudioManager.initializeAudio( _videoElement, audioChannels, camera.matrixWorld.elements );

    var menu = MenuManager.createMenu();
    interController.addInteractiveObject(menu);

    /*var menuTrad = MenuManager.createMenuTrad();
    interController.addInteractiveObject(menuTrad);*/

    subController.enableSubtitles();
    subController.initSubtitle( 70, 0, -1, 'none' );

    subController.setSubtitle( list_contents[demoId].subtitles[0]['en'] );

    //subController.enableAutoPositioning()

    //moData.createPointer();


    ppMMgr.playAll();
}
