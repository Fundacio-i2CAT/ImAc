
function runDemo() 
{
  	console.log("Running demo " + demoId)

  	/*var listVideoContent = moData.getListOfVideoContents();
    var _videoElement = listVideoContent[0].vid;
    AudioManager.initializeAudio( _videoElement, 2, camera.matrixWorld.elements );

    var controlBar = moData.createButton1();
    interController.addInteractiveObject(controlBar);

    var controlBar2 = moData.createButton2();
    interController.addInteractiveObject(controlBar2);

    var controlBar3 = moData.createButton3();
    interController.addInteractiveObject(controlBar3);

    var controlBar4 = moData.createButton4();
    interController.addInteractiveObject(controlBar4);

    var controlBar5 = moData.createButton5();
    interController.addInteractiveObject(controlBar5);

    var controlBar6 = moData.createButton6();
    interController.addInteractiveObject(controlBar6);*/

    subController.enableSubtitles();
    subController.initSubtitle( 60, 0, -1, 'arrow' );

    if ( demoId == 1 ) subController.setSubtitle( "./resources/Rapzember3.ebu-tt.xml" );
    else subController.setSubtitle( "./resources/LICEU_ENG.xml" ); 

    moData.playAll();
}
