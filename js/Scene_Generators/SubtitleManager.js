
var auxcount = 0;


function addsubtitles()
{
  var r = new XMLHttpRequest();

  if (demoId < 6)
    var subtitleXML = language == "catala" ? "./resources/Rapzember_Cat.xml" : "./resources/Rapzember3.ebu-tt.xml";
  else
    var subtitleXML = language == "catala" ? "./resources/LICEU_CAST.xml" : "./resources/LICEU_ENG.xml";

  r.open("GET", subtitleXML);

    r.onreadystatechange = function () {
        if (r.readyState === 4 && r.status === 200) {
            displaySample(r.responseText);
        }
    };

    r.send();
}

function displaySample(contents) 
{
  imsc1doc = imsc.fromXML(contents);

  var listVideoContent = moData.getListOfVideoContents();
  listVideoContent[0].vid.ontimeupdate = function() 
  {
    updateISD(listVideoContent[0].vid.currentTime);
  };
}

function updateISD(offset) 
{
  var isd = imsc.generateISD(imsc1doc, offset);

  if (!isVRDisplay) 
  {
    var rdiv = document.getElementById('asd');
    var rdiv2 = document.getElementById('asd2');

    while (rdiv.firstChild) {
      rdiv.removeChild(rdiv.firstChild);
    }
      
    while (rdiv2.firstChild) {
      rdiv2.removeChild(rdiv2.firstChild);
    }
  }


  if (isd.contents.length > 0 ) 
  {
    if(autoPositioning == 'enable' && auxcount == 0) {
      auxcount++;
      var maxRotaion = isd.imac;
      var rotaionValue = 0;
      var rotationInterval = setInterval(function() {
        if (rotaionValue >= maxRotaion) clearInterval(rotationInterval);
        else {
          rotaionValue += 3;
          CameraPatherObject.rotation.y = (rotaionValue + 90) * (Math.PI / 180);
        }
      },30);
      //camera.rotation.y = (isd.imac + 90) * (Math.PI / 180);
    }

    if (isSubtitleEnabled) print3DText(isd.contents[0]);

    if (subtileIndicator != 'none') checkSubtitleIdicator(isd);
    if (signIndicator != 'none') checkSignIdicator(isd);

    if (!isVRDisplay) 
    {
      imsc.renderHTML(isd, rdiv, null);
      imsc.renderHTML(isd, rdiv2, null);
    }   
  }
}

function print3DText(isdContent) 
{
  if(isdContent.contents.length > 0)
  {
    var isdContentText = isdContent.contents[0].contents[0].contents[0].contents;
    var textList = [];

    for (var i = 0; i < isdContentText.length; ++i)
    {
      if (isdContentText[i].kind == 'span' && isdContentText[i].contents)
      {
        var isdTextObject = {
          text: isdContentText[i].contents[0].text,
          color: adaptRGBA(isdContentText[i].contents[0].styleAttrs['http://www.w3.org/ns/ttml#styling color']),
          backgroundColor: adaptRGBA(isdContentText[i].contents[0].styleAttrs['http://www.w3.org/ns/ttml#styling backgroundColor'])
        };

        textList.push(isdTextObject);
      }
    }
    if(textList.length > 0 && (textListMemory.length == 0 || textListMemory.length > 0 && textList[0].text != textListMemory[0].text)/*!objectsAreSame(textList, textListMemory)*/) 
    {
      moData.removeSubtitle();

      var latitud = forcedDisplayAlign == 'before' ? 30 * viewArea/100 : 30 * viewArea/ -100; 
      var planePosition = convertAngular_toCartesian (latitud, 0);

      var conf = {
        subtileIndicator: subtileIndicator,
        displayAlign: forcedDisplayAlign,
        textAlign: forcedTextAlign,
        size: 0.0001 * viewArea,
        x: planePosition.x,
        y: planePosition.y,
        z: planePosition.z
      };

      moData.createSubtitle(textList, conf);


      textListMemory = textList;     
    }   
  }
  else 
  {
    textListMemory = [];
    //camera.remove(subtitles3d);
    moData.removeSubtitle();
  }
}

function switchSubtitleIndicator(enable, position)
{
  if (enable)
  {
    if (position == 'left') 
    {
      if(isVRDisplay)
      {
        var mysub = getMeshByName ('subIndicatorR');
        if (mysub) mysub.visible = false;
        var mysub2 = getMeshByName ('subIndicatorL');
        if (mysub2) mysub2.visible = true;
      }
      else 
      {
        obj1.visibility = 'visible';
        obj2.visibility = 'visible';
        obj3.visibility = 'hidden';
        obj4.visibility = 'hidden';
      }
    }
    else 
    {
      if(isVRDisplay)
      {
        var mysub = getMeshByName ('subIndicatorR');
        if (mysub) mysub.visible = true;
        var mysub2 = getMeshByName ('subIndicatorL');
        if (mysub2) mysub2.visible = false;
      }
      else 
      {
        obj1.visibility = 'hidden';
        obj2.visibility = 'hidden';
        obj3.visibility = 'visible';
        obj4.visibility = 'visible';
      }
    }
  }
  else
  {
    if(isVRDisplay)
    {
      var mysub = getMeshByName ('subIndicatorR');
      if (mysub) mysub.visible = false;
      var mysub2 = getMeshByName ('subIndicatorL');
      if (mysub2) mysub2.visible = false;
    }
    else 
    {
      obj1.visibility = 'hidden';
      obj2.visibility = 'hidden';
      obj3.visibility = 'hidden';
      obj4.visibility = 'hidden';
    }
  }
}

function getMeshByName (name)
{
  var subtitles3d = moData.getSubtitleMesh();
  if(subtitles3d){
    for (var i = 0; i < subtitles3d.children.length; ++i) {
      for (var j = 0; j < subtitles3d.children[i].children.length; ++j){
        if (subtitles3d.children[i].children[j].name == name) return subtitles3d.children[i].children[j];
      }
    }
  }
  return;
}

function checkSubtitleIdicator (isd)
{
  var cameraView = camera.getWorldDirection();
  var position = cartesianToAngular(cameraView.x,cameraView.y,cameraView.z);

  var difPosition = isd.imac - position.longitude;

  if (difPosition < camera.fov && difPosition > -camera.fov) 
  {
    if (subtileIndicator == 'move') {
      forcedTextAlign = 'center';
      textListMemory = [];
    } 
    else {
      switchSubtitleIndicator(false);
    }
  }
  else 
  {
    var difPosition2 = difPosition < 0 ? difPosition + 360 : difPosition;
    if(difPosition2 > 0 && difPosition2 <= 180) 
    {
      if (subtileIndicator == 'move') {
        forcedTextAlign = 'start';
        textListMemory = [];
      }
      else {
        switchSubtitleIndicator(true, 'left');
      }
    }
    else {
      if (subtileIndicator == 'move') {
        forcedTextAlign = 'end';
        textListMemory = [];
      } 
      else {
        switchSubtitleIndicator(true, 'right');
      } 
    }
  }
}


function checkSignIdicator (isd)
{
  var cameraView = camera.getWorldDirection();
  var position = cartesianToAngular(cameraView.x,cameraView.y,cameraView.z);

  var difPosition = isd.imac - position.longitude;

  if (difPosition < camera.fov && difPosition > -camera.fov) 
  {
    if (signIndicator != 'move') 
    {
      switchSignIndicator(false);
    }
    else 
    {
      //changeSignPosition('center');
      (signArea == 'topLeft' || signArea == 'botLeft')  ? changeSignPosition('left') : changeSignPosition('right');
    }
  }
  else 
  {
    var difPosition2 = difPosition < 0 ? difPosition + 360 : difPosition;
    if(difPosition2 > 0 && difPosition2 <= 180) 
    {
      signIndicator == 'move' ? changeSignPosition('left') : switchSignIndicator(true, 'left');
    }
    else 
    {
      signIndicator == 'move' ? changeSignPosition('right') : switchSignIndicator(true, 'right');
    }
  }
}

function switchSignIndicator(enable, position)
{
  var signMesh = moData.getSignMesh();
  if(signMesh)
  {
    if (enable)
    {
      if (position == 'left') 
      {
        var mysign = getSignMeshByName ('right');
        if (mysign) mysign.visible = false;
        var mysign2 = getSignMeshByName ('left');
        if (mysign2) mysign2.visible = true;
      }
      else 
      {
        var mysign = getSignMeshByName ('right');
        if (mysign) mysign.visible = true;
        var mysign2 = getSignMeshByName ('left');
        if (mysign2) mysign2.visible = false;
      }
    }
    else
    {
      var mysign = getSignMeshByName ('right');
        if (mysign) mysign.visible = false;
        var mysign2 = getSignMeshByName ('left');
        if (mysign2) mysign2.visible = false;
    }
  }
}

function getSignMeshByName (name)
{
  var sign = moData.getSignMesh();
  if(sign){
    for (var i = 0; i < sign.children.length; ++i) {
        if (sign.children[i].name == name) return sign.children[i];
    }
  }
  return;
}

function changeSignPosition(position) 
{
  var signMesh = moData.getSignMesh();
  if(signMesh)
  {
    if ((position == 'left' && signMesh.position.x > 0) || (position == 'right' && signMesh.position.x < 0))
    {
      signMesh.position.x = signMesh.position.x * -1;
    }
  }
}