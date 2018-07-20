
function runDemo() 
{
  	console.log("Running demo " + demoId)

  	var listVideoContent = moData.getListOfVideoContents();
    var _videoElement = listVideoContent[0].vid;
    AudioManager.initializeAudio( _videoElement, 2, camera.matrixWorld.elements );

    var menu = MenuManager.createMenu();
    interController.addInteractiveObject(menu);

    subController.enableSubtitles();
    subController.initSubtitle( 60, 0, -1, 'arrow' );

    if ( demoId == 1 ) subController.setSubtitle( "./resources/Rapzember3.ebu-tt.xml" );
    else subController.setSubtitle( "./resources/LICEU_ENG.xml" ); 

    moData.createPointer();


    PlayPauseMenuManager.playAll();
}
