
var auxcount = 0;


function addsubtitles()
{
  var r = new XMLHttpRequest();

  if (_selected_content == 'Radio')
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

      var forcedSpeakerPosition = document.getElementById('speaker').value;

      if(forcedSpeakerPosition && forcedSpeakerPosition != '') {
        maxRotaion = parseInt(forcedSpeakerPosition);
      }

      var rotationInterval = setInterval(function() {
        if (rotaionValue >= maxRotaion) clearInterval(rotationInterval);
        else {
          rotaionValue += 3;
          CameraPatherObject.rotation.y = (rotaionValue + 0) * (Math.PI / 180);
        }
      },30);
      //camera.rotation.y = (isd.imac + 90) * (Math.PI / 180);
    }

    if (isSubtitleEnabled) print3DText(isd.contents[0]);

    if (subtitleIndicator != 'none') checkSubtitleIdicator(isd);
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

      var latitud = forcedDisplayAlign == 'before' ? 30 * viewArea/100 : -30 * viewArea/100; 
      var planePosition = convertAngular_toCartesian (latitud, 0);

      var posY = Math.sin( Math.radians(latitud) );

      var conf = {
        subtitleIndicator: subtitleIndicator,
        displayAlign: forcedDisplayAlign,
        textAlign: forcedTextAlign,
        size: 0.008 * viewArea,
        x: 0,
        y: posY * 80 * 9/16,
        z: 1 * 80
      };

      //console.log(conf)

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

        var mysub = getMeshByName ('right');
        if (mysub) mysub.visible = false;
        var mysub2 = getMeshByName ('left');
        if (mysub2) mysub2.visible = true;
     
    }
    else 
    {

        var mysub = getMeshByName ('right');
        if (mysub) mysub.visible = true;
        var mysub2 = getMeshByName ('left');
        if (mysub2) mysub2.visible = false;
     
    }
  }
  else
  {

      var mysub = getMeshByName ('right');
      if (mysub) mysub.visible = false;
      var mysub2 = getMeshByName ('left');
      if (mysub2) mysub2.visible = false;
   
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
  var cameraView = camera.getWorldDirection(new THREE.Vector3( ));
  var position = cartesianToAngular(cameraView.x,cameraView.y,cameraView.z);

  var difPosition = isd.imac - position.longitude;

  if (difPosition < camera.fov && difPosition > -camera.fov) 
  {
    if (subtitleIndicator == 'move') {
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
      if (subtitleIndicator == 'move') {
        forcedTextAlign = 'start';
        textListMemory = [];
      }
      else {
        switchSubtitleIndicator(true, 'left');
      }
    }
    else {
      if (subtitleIndicator == 'move') {
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
  var cameraView = camera.getWorldDirection(new THREE.Vector3( ));
  var position = cartesianToAngular(cameraView.x,cameraView.y,cameraView.z);
  var difPosition = isd.imac - position.longitude;

  var signMesh = moData.getSignMesh();
  if(signMesh)
  {
    if (difPosition < camera.fov && difPosition > -camera.fov) 
    {
      if (signIndicator != 'move') 
      {
        changeSignIndicator( signMesh, 'center' );
      }
      else 
      {
        (signArea == 'topLeft' || signArea == 'botLeft')  ? changeSignPosition( signMesh, 'left' ) : changeSignPosition( signMesh, 'right' );
      }
    }
    else 
    {
      var difPosition2 = difPosition < 0 ? difPosition + 360 : difPosition;
      if(difPosition2 > 0 && difPosition2 <= 180) 
      {
        signIndicator == 'move' ? changeSignPosition( signMesh, 'left' ) : changeSignIndicator( signMesh, 'left' );
      }
      else 
      {
        signIndicator == 'move' ? changeSignPosition( signMesh, 'right' ) : changeSignIndicator( signMesh, 'right' );
      }
    }
  }
}

function changeSignIndicator(mesh, position)
{
  for (var i = 0, l = mesh.children.length; i < l; ++i) 
  {
    if (mesh.children[i].name == 'left') mesh.children[i].visible = position == 'left' ? true : false;
    else if (mesh.children[i].name == 'right') mesh.children[i].visible = position == 'right' ? true : false;
  }
}

function changeSignPosition(mesh, position) 
{
  if ((position == 'left' && mesh.position.x > 0) || (position == 'right' && mesh.position.x < 0))
  {
    mesh.position.x = mesh.position.x * -1;
  }
}
