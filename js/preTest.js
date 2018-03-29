

function runDemo() 
{
  console.log("Running demo " + demoId)
  //moData.Create_RectangleImage_Mesh();
  var imgUrl = language == "catala" ? './resources/feedback_.png' : './resources/feedback_ger.png';
  var conf = {
    w: 1,
    h: 1
  };
  moData.createImageInCamera( imgUrl, 'pauseimg', config)

  // demo on es canvia dinamicament el tamany dels subtitols del 30% al 80% cada 30 segons
  // adicionalment tambe es posicionen els subtitols abaix al (centre, esquerre) o adalt (centre) cada 10 segons 
  if (demoId == 1)
  {
    timerCounter = 0;

    isSubtitleEnabled = true;
    viewArea = 30;
    forcedDisplayAlign = 'after';
    forcedTextAlign = 'center';

    //myVar = setInterval(runDemo1, 10000);
    runDemo1(10000);
  }

  // demo on es testegen els indicadors de subtitols
  // canvia entre fletxes, compass i posicionament dels subtitols
  else if (demoId == 2)
  {
    timerCounter = 0;

    subtileIndicator = 'arrow';
    isSubtitleEnabled = true;
    viewArea = 60;
    forcedDisplayAlign = 'after';
    forcedTextAlign = 'center';

    //myVar = setInterval(runDemo2, 30000);
    runDemo2(30000);
  }

  // demo on es canvia dinamicament el tamany del video de signes del 30% al 80% cada 30 segons
  // es fa una pausa entre video i video de N segons 
  else if (demoId == 3)
  {
    timerCounter = 0;

    //moData.Create_RectangleVideo_Mesh();
    var signPosition = getPlanePosition();
    var conf = {
      size: 0.3,
      x: signPosition.x,
      y: signPosition.y,
      z: signPosition.z
    };
    moData.createSignVideo('./resources/signer_rbb_1.mp4', 'name', conf);

    viewArea = 30;

    //myVar = setInterval(runDemo3, 30000);
    runDemo3(30000);
  }

  // demo on es testegen els indicadors del video de llenguatge de signes
  // canvia entre fletxes i posicionament del video
  else if (demoId == 4)
  {
    timerCounter = 0;

    viewArea = 60;
    signIndicator = 'arrow';

    //moData.Create_RectangleVideo_Mesh();
    var signPosition = getPlanePosition();
    var conf = {
      size: 0.3,
      x: signPosition.x,
      y: signPosition.y,
      z: signPosition.z
    };
    moData.createSignVideo('./resources/signer_rbb_1.mp4', 'name', conf);

    //myVar = setInterval(runDemo4, 30000);
    runDemo4(30000);
  }

  // demo on es testegen els indicadors del video de llenguatge de signes
  // poscicionar la camera al començament del video
  else if (demoId == 5)
  {
    timerCounter = 0;

    viewArea = 60;
    autoPositioning = 'enable';

    //moData.Create_RectangleVideo_Mesh();
    var signPosition = getPlanePosition();
    var conf = {
      size: 0.3,
      x: signPosition.x,
      y: signPosition.y,
      z: signPosition.z
    };
    moData.createSignVideo('./resources/signer_rbb_1.mp4', 'name', conf);

  }

  else
  {
  	_isAmbisonics = true;
  	initializeAudio();
    viewArea = 80;
    subtileIndicator = 'arrow';
    isSubtitleEnabled = true;

  }
}


function runDemo1(time) 
{
  var myVar2;
  if (moData.isPausedById(0)) 
  {
    myVar2 = setInterval(function() {
      timerCounter++;
      if(timerCounter == 10) {
        moData.playAll();
      }
      if (!moData.isPausedById(0)) 
      {
        clearInterval(myVar2);
        imageMesh.visible = false;       
        viewArea > 80 ? location.reload() : runDemo1(10000);
      }
    }, 1000);
  }
  else 
  {
    myVar = setTimeout(function() {
      timerCounter = 0;
      if (forcedTextAlign == 'center') 
      {
        if (forcedDisplayAlign == 'before') 
        {         
          moData.pauseAll();
          imageMesh.visible = true;
          forcedDisplayAlign = 'after';
          viewArea += 10;
          textListMemory = [];
          runDemo1(1000);
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
}

function runDemo2(time) 
{
  var myVar2;
  if (moData.isPausedById(0)) 
  {
    myVar2 = setInterval(function() {
      timerCounter++;
      if(timerCounter == 10) {
        moData.playAll();
      }
      if (!moData.isPausedById(0)) 
      {
        clearInterval(myVar2);
        imageMesh.visible = false;       
        subtileIndicator == 'none' ? location.reload() : runDemo2(30000);
      }
    }, 1000);
  }
  else {
    myVar = setTimeout(function() {
      timerCounter = 0;
      moData.pauseAll();
      imageMesh.visible = true;
      if (subtileIndicator == 'arrow') 
      {
        subtileIndicator = 'compass';
        textListMemory = [];
        runDemo2(1000);
      }
      else if (subtileIndicator == 'compass')
      {
        subtileIndicator = 'move';
        textListMemory = [];
        runDemo2(1000);
      }
      else if (subtileIndicator == 'move')
      {
        subtileIndicator = 'none';
        textListMemory = [];
        runDemo2(1000);
      }
      else {
        location.reload();
      }
    }, time); 
  }
}

function runDemo3(time) 
{
  var myVar2;
  if (moData.isPausedById(0)) 
  {
    myVar2 = setInterval(function() {
      timerCounter++;
      if(timerCounter == 10) {
        moData.playAll();
      }
      if (!moData.isPausedById(0)) 
      {
        clearInterval(myVar2);
        imageMesh.visible = false;       
        viewArea > 80 ? location.reload() : runDemo3(30000);
      }
    }, 1000);
  }
  else 
  {
    myVar = setTimeout(function() {
      timerCounter = 0;
      moData.pauseAll();
      imageMesh.visible = true;
      //camera.remove(signMesh);
      moData.removeSignVideo();
      viewArea += 10;
      //moData.Create_RectangleVideo_Mesh();
      var signPosition = getPlanePosition();
	    var conf = {
	      size: 0.3,
	      x: signPosition.x,
	      y: signPosition.y,
	      z: signPosition.z
	    };
	    moData.createSignVideo('./resources/signer_rbb_1.mp4', 'name', conf);
      runDemo3(1000);
    }, time); 
  }
}


function runDemo4(time) 
{
  var myVar2;
  if (moData.isPausedById(0)) 
  {
    myVar2 = setInterval(function() {
      timerCounter++;
      if(timerCounter == 10) {
        moData.playAll();
      }
      if (!moData.isPausedById(0)) 
      {
        clearInterval(myVar2);
        //moData.Create_RectangleVideo_Mesh();

        var signPosition = getPlanePosition();
    var conf = {
      size: 0.3,
      x: signPosition.x,
      y: signPosition.y,
      z: signPosition.z
    };
    moData.createSignVideo('./resources/signer_rbb_1.mp4', 'name', conf);
        imageMesh.visible = false;       
        signIndicator == 'none' ? location.reload() : runDemo4(30000);
      }
    }, 1000);
  }
  else 
  {
    myVar = setTimeout(function() {
      timerCounter = 0;
      moData.pauseAll();
      imageMesh.visible = true;
      //camera.remove(signMesh);
      moData.removeSignVideo();
      if (signIndicator == 'arrow') 
      {
        signIndicator = 'move';
        runDemo4(1000);
      }
      else if (signIndicator == 'move')
      {
        signIndicator = 'none';
        runDemo4(1000);
      }
      else {
        location.reload();
      }
    }, time); 
  }
}

