
function runDemo() 
{
  	console.log("Running demo " + demoId)

  	var listVideoContent = moData.getListOfVideoContents();
    var _videoElement = listVideoContent[0].vid;
    var audioChannels =  demoId == 2 ? 4 : 2;
    
    AudioManager.initializeAudio( _videoElement, audioChannels, camera.matrixWorld.elements );

    var menu = MenuManager.createMenu();
    interController.addInteractiveObject(menu);

    subController.enableSubtitles();
    subController.initSubtitle( 60, 0, -1, 'none' );

    if ( demoId == 1 ) subController.setSubtitle( "./resources/Rapzember3.ebu-tt.xml" );
    else if ( demoId == 2 ) subController.setSubtitle( "./resources/LICEU_ENG.xml" ); 
    else subController.setSubtitle( "./resources/rbb/RBB_Abendschau_short_subtitles_angles.xml" ); 

    //moData.createPointer();


    ppMMgr.playAll();
}
