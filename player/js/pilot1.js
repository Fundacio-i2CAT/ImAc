
// Page 2 Design Open Group Test (P2DOGT)

function runDemo() 
{
    _AudioManager.initializeAudio( VideoController.getListOfVideoContents()[0].vid, list_contents[demoId].audioChannels, camera.matrixWorld.elements );

    _moData.createPointer();

    // Test conditions

    // Modificar button VR ??

    // AD pilot -> HL 1, 2, 3 + extra AD (9 contents + AI)
    if ( window.location.pathname.indexOf('adtest/') > 0 ) 
    {
        var interval11 = setTimeout( function() { _AudioManager.switchAD( true ); },1000);
    }
    // AST pilot -> Opera amb nous AST (4 contents + AI)
    else if ( window.location.pathname.indexOf('asttest/') > 0 )
    {
        var interval11 = setTimeout( function() { _AudioManager.switchAD( true ); },1000);

        var interval1 = setTimeout( function() { VideoController.pauseAll(); },1000);
        var xy = _moData.getSphericalColorMesh( 60, 0x000000, 'colorsphere' )

        scene.add(xy)
        //camera.add(xz)

        var interval2 = setTimeout( function() {
            VideoController.playAll();
            scene.remove(xy)
            //camera.remove(xz);
        },3000);

        if ( demoId == 3 || demoId == 4 ) VideoController.seekAll( 224 );

        else if ( demoId == 1 || demoId == 2 )
        {
            var interval5 = setTimeout( function() { window.location.reload() }, 254000);
        }
    }
    // AD pilot -> HL 4 + voice control + menu gran (1 content + AI ? )
    else if ( window.location.pathname.indexOf('voicetest/') > 0 )
    {
        // activar menu gran per defecte
        _iconf.menutype= 'ls';
        var interval11 = setTimeout( function() {
            menuMgr.removeMenuFromParent();
            menuMgr.Init( 1 );
        },2000);
        
        // activar voice control (activar del del portal)
    }
    else 
    {
        var xz = _moData.getPlaneImageMesh(16/2,9/2,'./img/banner_menu/' + localStorage.ImAc_language + '_72pp.png', 'banner', 6);

        if ( !document.cookie.includes('ImAcCookie') )
        {
            document.cookie = "ImAcCookie=opened; max-age=3600;"; // 1 hora

            var interval1 = setTimeout( function() { VideoController.pauseAll(); },1000);
            var xy = _moData.getSphericalColorMesh( 60, 0x000000, 'colorsphere' );

            xz.position.z = -8;
            scene.add(xy)
            camera.add(xz)

            var interval2 = setTimeout( function() {
                VideoController.playAll();
                scene.remove(xy)
                camera.remove(xz);
            },8000);
        }
    }

}