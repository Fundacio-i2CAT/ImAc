
// Page 2 Design Open Group Test (P2DOGT)

function runDemo() 
{
    _AudioManager.initializeAudio( VideoController.getListOfVideoContents()[0].vid, list_contents[demoId].audioChannels, camera.matrixWorld.elements );

    MenuDictionary.setSubtitleLanguagesArray( list_contents[demoId].subtitles[0] );
    MenuDictionary.setSignerLanguagesArray( list_contents[demoId].signer[0] );

    _moData.createPointer();

    var lang = MenuDictionary.getMainLanguage();

    subController.enableSubtitles();
    subController.initSubtitle( 70, 0, -1, 'none' );

    var xz = _moData.getPlaneImageMesh(16/2,9/2,'./img/open_menu_banner2.png', 'banner', 6);


    var sublang = list_contents[demoId].subtitles[0][lang] ? lang : Object.keys(list_contents[demoId].subtitles[0])[0];
    var siglang = list_contents[demoId].signer[0][lang] ? lang : Object.keys(list_contents[demoId].signer[0])[0];

    subController.setSubtitle( list_contents[demoId].subtitles[0][sublang], sublang );

    subController.setSignerContent( list_contents[demoId].signer[0][siglang], siglang );

    initLanguageButtons(lang, siglang, sublang);

    //VideoController.playAll();
    VideoController.init();

    if ( !document.cookie.includes('ImAcCookie') )
    {
        document.cookie = "ImAcCookie=opened; max-age=3600;"; // 1 hora

        var interval1 = setTimeout( function() { VideoController.pauseAll(); },1000);
        var xy = _moData.getSphericalColorMesh( 60, 0x000000, 'colorsphere' )
        //var xz = _moData.getPlaneImageMesh(16/2,9/2,'./img/tests/A1_B1.png', 'name', 6);

        xz.position.z = -10;
        scene.add(xy)
        camera.add(xz)

        var interval2 = setTimeout( function() {
            VideoController.playAll();
            scene.remove(xy)
            camera.remove(xz);
            (localStorage.ImAc_backgroundSub == "outline") ? subController.setSubBackground(0) : subController.setSubBackground(0.5);
        },6000);
    }
    else 
    {     
        (localStorage.ImAc_backgroundSub == "outline") ? subController.setSubBackground(0) : subController.setSubBackground(0.5);
    }
}

function initLanguageButtons(lang, siglang, sublang)
{
    if ( siglang == 'de' ) 
    {
        signerLanguage = 'signerGerButton';
    }
    else if ( siglang == 'ca' ) 
    {
        signerLanguage = 'signerCatButton';
    }
    else if ( siglang == 'es' ) 
    {
        signerLanguage = 'signerEspButton';
    }
    else if ( siglang == 'en' ) 
    {
        signerLanguage = 'signerEngButton';
    }

    if ( sublang == 'de' ) 
    {
        subtitlesLanguage = 'subtitlesGerButton';
    }
    else if ( sublang == 'ca' ) 
    {
        subtitlesLanguage = 'subtitlesCatButton';
    }
    else if ( sublang == 'es' ) 
    {
        subtitlesLanguage = 'subtitlesEspButton';
    }
    else if ( sublang == 'en' ) 
    {
        subtitlesLanguage = 'subtitlesEngButton';
    }
}
