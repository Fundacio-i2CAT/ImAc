
function runDemo() 
{
  	console.log("Running demo " + demoId)

  	var listVideoContent = moData.getListOfVideoContents();
    var _videoElement = listVideoContent[0].vid;
    AudioManager.initializeAudio( _videoElement, 2, camera.matrixWorld.elements );

    /*var controlBar = moData.createControlBar();
    console.log(controlBar);
    interController.addInteractiveObject(controlBar);*/

    subController.enableSubtitles();
    subController.initSubtitle( 60, 0, -1, 'arrow' );

    if ( demoId == 1 ) subController.setSubtitle( "./resources/Rapzember3.ebu-tt.xml" );
    else subController.setSubtitle( "./resources/LICEU_ENG.xml" ); 

    moData.playAll();
}
