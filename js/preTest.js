
var myVar;
var timerCounter = 0; // per al pretest

function runDemo() 
{
  console.log("Running demo " + demoId)

////////////////
//   Demo 1   //
////////////////
  if (demoId == 0)
  {
    var imgUrl = language == "catala" ? './resources/preTest/cat/1.png' : './resources/preTest/ger/1.png';
    moData.createImageInCamera( imgUrl, 'pauseimg', { w: 1, h: 1, visible: true } );

    myVar = setTimeout(function() 
    {  
      showInfoImages( 2 );

      timerCounter = 0;

      var listVideoContent = moData.getListOfVideoContents();
      var _videoElement = listVideoContent[0].vid;
      AudioManager.initializeAudio( _videoElement, 1, camera.matrixWorld.elements );

      isSubtitleEnabled = true;
      viewArea = 30;
      forcedDisplayAlign = 'after';
      forcedTextAlign = 'center';

      //initSubtitle( viewArea, forcedDisplayAlign, forcedTextAlign, subtileIndicator );

    }, 3000);
  }

////////////////
//   Demo 2   //
////////////////
  else if (demoId == 2)
  {
    var imgUrl = language == "catala" ? './resources/preTest/cat/21.png' : './resources/preTest/ger/21.png';
    moData.createImageInCamera( imgUrl, 'pauseimg', { w: 1, h: 1, visible: true } );

    myVar = setTimeout(function() 
    {  
      showInfoImages( 22 );

      timerCounter = 0;

      var listVideoContent = moData.getListOfVideoContents();
      var _videoElement = listVideoContent[0].vid;
      AudioManager.initializeAudio( _videoElement, 1, camera.matrixWorld.elements );

      subtitleIndicator = 'arrow';
      isSubtitleEnabled = true;
      viewArea = 70;
      forcedDisplayAlign = 'after';
      forcedTextAlign = 'center';

      //initSubtitle( viewArea, forcedDisplayAlign, forcedTextAlign, subtileIndicator );
    }, 3000);

    //runDemo2(30000);
  }

////////////////
//   Demo 3   //
////////////////
  else if (demoId == 3)
  {
    var imgUrl = language == "catala" ? './resources/preTest/cat/32.png' : './resources/preTest/ger/32.png';
    moData.createImageInCamera( imgUrl, 'pauseimg', { w: 1, h: 1, visible: true } );

    myVar = setTimeout(function() 
    {  
      showInfoImages( 33 );

      timerCounter = 0;

      var listVideoContent = moData.getListOfVideoContents();
      var _videoElement = listVideoContent[0].vid;
      AudioManager.initializeAudio( _videoElement, 1, camera.matrixWorld.elements );

      //initSign( viewArea, signArea, signIndicator )

      var signPosition = getPlanePosition();
      var conf = {
        size: 0.3,
        x: signPosition.x,
        y: signPosition.y,
        z: signPosition.z
      };
      moData.createSignVideo('./resources/signer_rbb_new.mp4', 'mp4', 'sign', conf);

      viewArea = 30;
    }, 3000);

    //runDemo3(30000);
  }

////////////////
//   Demo 4   //
////////////////
  else if (demoId == 4)
  {
    var imgUrl = language == "catala" ? './resources/preTest/cat/52.png' : './resources/preTest/ger/52.png';
    moData.createImageInCamera( imgUrl, 'pauseimg', { w: 1, h: 1, visible: true } );

    myVar = setTimeout(function() 
    {  
      showInfoImages( 53 );

      timerCounter = 0;

      var listVideoContent = moData.getListOfVideoContents();
      var _videoElement = listVideoContent[0].vid;
      AudioManager.initializeAudio( _videoElement, 1, camera.matrixWorld.elements );

      viewArea = 70;
      signIndicator = 'arrow';

      //initSign( viewArea, signArea, signIndicator )

      var signPosition = getPlanePosition();
      var conf = {
        size: 0.3,
        x: signPosition.x,
        y: signPosition.y,
        z: signPosition.z
      };
      moData.createSignVideo('./resources/signer_rbb_new.mp4', 'mp4', 'sign', conf);

    }, 3000);

    //runDemo4(30000);
  }

////////////////
//   Demo 5   //
////////////////
  else if (demoId == 5)
  {
    var imgUrl = language == "catala" ? './resources/preTest/cat/60.png' : './resources/preTest/ger/60.png';
    moData.createImageInCamera( imgUrl, 'pauseimg', { w: 1, h: 1, visible: true } );

    myVar = setTimeout(function() 
    {  
      showInfoImages( 61 );

      timerCounter = 0;
      
      var listVideoContent = moData.getListOfVideoContents();
      var _videoElement = listVideoContent[0].vid;
      AudioManager.initializeAudio( _videoElement, 1, camera.matrixWorld.elements );

      viewArea = 70;
      autoPositioning = 'enable';

      //initSign( viewArea, signArea, signIndicator )
      //enableAutoPositioning()

      var signPosition = getPlanePosition();
      var conf = {
        size: 0.3,
        x: signPosition.x,
        y: signPosition.y,
        z: signPosition.z
      };
      moData.createSignVideo('./resources/signer_rbb_new.mp4', 'mp4', 'sign', conf);

    }, 3000);

  }

////////////////
//   Demo 6   //
////////////////
  else
  {
    var listVideoContent = moData.getListOfVideoContents();
    var _videoElement = listVideoContent[0].vid;
    AudioManager.initializeAudio( _videoElement, 2, camera.matrixWorld.elements );

    var controlBar = moData.createControlBar();
    console.log(controlBar);
    interController.addInteractiveObject(controlBar);

    subController.enableSubtitles();
    subController.initSubtitle( 60, 0, -1, 'arrow' );
    subController.setSubtitle( "./resources/Rapzember_Cat.xml" );  

    //subController.enableAutoPositioning();

    moData.playAll();
  }
}


function showInfoImages(id1)
{
  moData.pauseAll();
  var imgUrl = language == "catala" ? './resources/preTest/cat/' + id1 + '.png' : './resources/preTest/ger/' + id1 + '.png';
  moData.createImageInCamera( imgUrl, 'pauseimg', { w: 1, h: 1, visible: true } );

  myVar = setTimeout(function() 
  {
    moData.removeInfoImage();

    if (demoId == 1) runDemo1( 10000 );
    else if (demoId == 2) runDemo2( 30000 );
    else if (demoId == 3) runDemo3( 30000 );
    else if (demoId == 4) runDemo4( 30000 );
    else if (demoId == 5) runDemo5( 60000 );

  }, 3000);
}

function showEndImage(id1)
{
  moData.pauseAll();
  var imgUrl = language == "catala" ? './resources/preTest/cat/' + id1 + '.png' : './resources/preTest/ger/' + id1 + '.png';
  moData.createImageInCamera( imgUrl, 'pauseimg', { w: 0.8, h: 0.8, visible: true } );

  myVar = setTimeout(function() 
  {
    location.reload();
  }, 3000);
}

function waitResponse(id)
{
  if ( moData.isPausedById(0) ) 
  {
    var imgUrl = language == "catala" ? './resources/preTest/cat/' + id + '.png' : './resources/preTest/ger/' + id + '.png';
    moData.createImageInCamera( imgUrl, 'pauseimg', { w: 1, h: 1, visible: true } );

    myVar2 = setInterval(function() {
      timerCounter++;
      if(timerCounter == 20) {
        moData.playAll();
      }
      if (!moData.isPausedById(0)) 
      {
        clearInterval(myVar2);
        moData.removeInfoImage(); 
        if (demoId == 1) 
        {
          if (viewArea == 40) showInfoImages( 5 );
          else if (viewArea == 50) showInfoImages( 8 );
          else if (viewArea == 60) showInfoImages( 11 );
          else if (viewArea == 70) showInfoImages( 14 );
          else if (viewArea == 80) showInfoImages( 17 );
          else showEndImage( 20 );
        }   
        else if(demoId == 2)
        {
          if (subtitleIndicator == 'compass') showInfoImages( 25 );
          else if (subtitleIndicator == 'move') showInfoImages( 28 );
          else showEndImage( 31 );
        }  
        else if (demoId == 3) 
        {
          if (viewArea == 40) showInfoImages( 36 );
          else if (viewArea == 50) showInfoImages( 39 );
          else if (viewArea == 60) showInfoImages( 42 );
          else if (viewArea == 70) showInfoImages( 45 );
          else if (viewArea == 80) showInfoImages( 48 );
          else showEndImage( 51 );
        } 
        else if(demoId == 4)
        {
          if (signIndicator == 'move') 
          {
            showInfoImages( 56 );
            var signPosition = getPlanePosition();
            var conf = {
              size: 0.3,
              x: signPosition.x,
              y: signPosition.y,
              z: signPosition.z
            };
            moData.createSignVideo('./resources/signer_rbb_new.mp4', 'mp4', 'sign', conf);
          }
          else showEndImage( 59 );
        }  
        else if(demoId == 5)
        {
          showEndImage( 64 );
        }
      }
    }, 500);
  }
}

function runDemo1(time) 
{ 
  moData.playAll();
  myVar = setTimeout(function() 
  {
    timerCounter = 0;
    if (forcedTextAlign == 'center') 
    {
      if (forcedDisplayAlign == 'before') 
      {         
        moData.pauseAll();
        forcedDisplayAlign = 'after';
        viewArea += 10;
        textListMemory = [];
        var idDiapo = 4 + 3*(viewArea-40)/10;
        waitResponse(idDiapo);
      } 
      else 
      {
        forcedTextAlign = 'start';
        textListMemory = [];
        runDemo1(10000);
      }
    }
    else 
    {
      forcedDisplayAlign = 'before';
      forcedTextAlign = 'center';
      textListMemory = [];
      runDemo1(10000);
    }
  }, time);  
}

function runDemo2(time) 
{
  moData.playAll();
  myVar = setTimeout(function() 
  {
    timerCounter = 0;
    moData.pauseAll();
    if (subtitleIndicator == 'arrow') 
    {
      subtitleIndicator = 'compass';
      textListMemory = [];
      waitResponse(24);
    }
    else if (subtitleIndicator == 'compass')
    {
      subtitleIndicator = 'move';
      textListMemory = [];
      waitResponse(27);
    }
    else if (subtitleIndicator == 'move')
    {
      subtitleIndicator = 'none';
      textListMemory = [];
      waitResponse(30);
    }
    else 
    {
      location.reload();
    }
  }, time); 
}

function runDemo3(time) 
{
  moData.playAll();
  myVar = setTimeout(function() 
  {
    timerCounter = 0;
    moData.pauseAll();
    moData.removeSignVideo();
    viewArea += 10;
    var signPosition = getPlanePosition();
	  var conf = {
	    size: 0.3,
	    x: signPosition.x,
	    y: signPosition.y,
	    z: signPosition.z
	  };
	  moData.createSignVideo('./resources/signer_rbb_new.mp4', 'mp4', 'sign', conf);
    waitResponse(35);
  }, time); 
}


function runDemo4(time) 
{
  moData.playAll();
  myVar = setTimeout(function() 
  {
    timerCounter = 0;
    moData.pauseAll();
    moData.removeSignVideo();
    if (signIndicator == 'arrow') 
    {
      signIndicator = 'move';
      waitResponse(55);;
    }
    else if (signIndicator == 'move')
    {
      signIndicator = 'none';
      waitResponse(58);
    }
    else {
      location.reload();
    }
  }, time); 
}

function runDemo5(time) 
{
  moData.playAll();
  myVar = setTimeout(function() 
  {
    timerCounter = 0;
    moData.pauseAll();
    moData.removeSignVideo();
    waitResponse(63);

  }, time); 
}


function runADDemo(id)
{
  enterfullscreen();
  //showLoader();
  //myVar = setTimeout(function() {
    //clearLoader();
    //enterfullscreen();
    document.getElementById("ad1").style.display = "block";
    if (id == 0) document.getElementById("ad2").src = "https://www.youtube.com/embed/lyd4HDUA4JY?autoplay=1";//window.location = 'https://youtu.be/SqIrXu0NkVU';
    else if (id == 1) document.getElementById("ad2").src = "https://www.youtube.com/embed/KSyvf5R0Se0?autoplay=1";//window.location = 'https://youtu.be/cMeLWQsU27Y';
    else if (id == 2) document.getElementById("ad2").src = "https://www.youtube.com/embed/akfVIe5NGzk?autoplay=1";//window.location = 'https://youtu.be/x0HAOLUjn1Y';

  //}, 10000); 
}

