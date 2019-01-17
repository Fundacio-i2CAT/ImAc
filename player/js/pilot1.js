
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