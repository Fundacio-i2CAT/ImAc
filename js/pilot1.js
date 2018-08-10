
function runDemo() 
{
  	console.log("Running demo " + demoId)

  	var listVideoContent = moData.getListOfVideoContents();
    var _videoElement = listVideoContent[0].vid;
    var audioChannels =  list_contents[demoId].audioChannels;
    
    AudioManager.initializeAudio( _videoElement, audioChannels, camera.matrixWorld.elements );

    var menu = MenuManager.createMenu();
    interController.addInteractiveObject(menu);

    subController.enableSubtitles();
    subController.initSubtitle( 70, 0, -1, 'arrow' );

    /*if ( demoId == 1 ) subController.setSubtitle( "./resources/Rapzember3.ebu-tt.xml" );
    else if ( demoId == 2 ) subController.setSubtitle( "./resources/LICEU_ENG.xml" ); 
    else subController.setSubtitle( "./resources/rbb/RBB_Abendschau_short_subtitles_angles.xml" ); */

    subController.setSubtitle( list_contents[demoId].subtitles[0]['en'] );

    //moData.createPointer();


    ppMMgr.playAll();
}
