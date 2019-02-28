
// Page 2 Design Open Group Test (P2DOGT)

function runDemo() 
{
    _AudioManager.initializeAudio( VideoController.getListOfVideoContents()[0].vid, list_contents[demoId].audioChannels, camera.matrixWorld.elements );

    _moData.createPointer();

    var xz = _moData.getPlaneImageMesh(16/2,9/2,'./img/open_menu_banner2.png', 'banner', 6);

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
        },6000);
    }
}


function runUABDemo() 
{
    _AudioManager.initializeAudio( VideoController.getListOfVideoContents()[0].vid, list_contents[demoId].audioChannels, camera.matrixWorld.elements );

    if ( demoId > 0 )
    {
        _moData.createPointer();

        var lang = MenuDictionary.getMainLanguage();
        var bannerTime = 10000;


        if ( demoId == 1 )
        {
            subController.setExperimental(true);
            isLookAt = true;

            subController.enableSubtitles();
            subController.initSubtitle( 70, 0, -1, 'none' );

            var xz = _moData.getPlaneImageMesh(16*2,9*2,'./img/tests/prueba_holy_fixed_gradient.png', 'name', 6);
        }
        else if ( demoId == 2 )
        {
            subController.enableSubtitles();
            subController.initSubtitle( 70, 0, -1, 'none' ); 

            var xz = _moData.getPlaneImageMesh(16/2,9/2,'./img/tests/holy_always_black_2.png', 'name', 6);      
        }
        else if ( demoId == 3 )
        {
            subController.setExperimental(true);
            isLookAt = true;
          
            subController.enableSubtitles();
            subController.initSubtitle( 70, 0, -1, 'none' );  

            var xz = _moData.getPlaneImageMesh(16/2,9/2,'./img/tests/holy_fixed_black_2.png', 'name', 6);
        }
        else if ( demoId == 4 )
        {
            subController.enableSubtitles();
            subController.initSubtitle( 70, 0, -1, 'none' ); 

            var xz = _moData.getPlaneImageMesh(16/2,9/2,'./img/tests/holy_always_black_2.png', 'name', 6);   
        }
        else if ( demoId == 5 )
        {
            subController.enableSubtitles();
            subController.initSubtitle( 70, 0, -1, 'arrow' ); 

            bannerTime += 10000;  

            var xzz = _moData.getPlaneImageMesh(16/2,9/2,'./img/tests/philip_arrow_black.png', 'name2', 6); 
            xzz.position.z = -10;
            camera.add(xzz)

            var interval3 = setTimeout( function() { camera.remove(xzz); camera.add(xz);},10000);

            var interval5 = setTimeout( function() { window.location.reload() },389000);

            var xz = _moData.getPlaneImageMesh(16/2,9/2,'./img/tests/philip_info_black.png', 'name', 6); 
        }
        else if ( demoId == 6 )
        {
            subController.enableSubtitles();
            subController.initSubtitle( 70, 0, -1, 'radar' );

            bannerTime += 10000;

            var xzz = _moData.getPlaneImageMesh(16/2,9/2,'./img/tests/philip_radar_black.png', 'name2', 6); 
            xzz.position.z = -10;
            camera.add(xzz)

            var interval3 = setTimeout( function() { camera.remove(xzz); camera.add(xz);},10000);

            var interval5 = setTimeout( function() { window.location.reload() },389000);

            var xz = _moData.getPlaneImageMesh(16/2,9/2,'./img/tests/philip_info_black.png', 'name', 6);
        }
        else if ( demoId == 7 )
        {
            subController.enableSubtitles();
            subController.initSubtitle( 70, 0, -1, 'arrow' );    

            var xz = _moData.getPlaneImageMesh(16/2,9/2,'./img/tests/philip_arrow_black.png', 'name', 6); 
        }
        else if ( demoId == 8 )
        {
            subController.enableSubtitles();
            subController.initSubtitle( 70, 0, -1, 'radar' );

            var xz = _moData.getPlaneImageMesh(16/2,9/2,'./img/tests/philip_radar_black.png', 'name', 6);
        }


        var interval1 = setTimeout( function() { VideoController.pauseAll(); },1000);
        var xy = _moData.getSphericalColorMesh( 60, 0x000000, 'colorsphere' )

        xz.position.z = -10;
        scene.add(xy)
        if ( demoId != 5 && demoId != 6 ) camera.add(xz)

        var interval2 = setTimeout( function() {
            VideoController.playAll();
            scene.remove(xy)
            camera.remove(xz);
            if ( demoId == 7 || demoId == 8 ) VideoController.seekAll( 389 );
            else if ( demoId == 5 || demoId == 6 ) VideoController.seekAll( 30 );

           (localStorage.ImAc_backgroundSub == "outline") ? subController.setSubBackground(0) : subController.setSubBackground(0.5);
        },bannerTime);



    }
}
