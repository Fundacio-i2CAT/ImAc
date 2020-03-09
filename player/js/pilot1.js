
// Page 2 Design Open Group Test (P2DOGT)

function runDemo() 
{
    _AudioManager.initializeAudio( VideoController.getListOfVideoContents()[0].vid, list_contents[demoId].audioChannels, camera.matrixWorld.elements );

    camera.add( _meshGen.getPointerMesh() );

    var xz = _meshGen.getImageMesh( './img/banner_menu/' + localStorage.ImAc_language + '_72pp.png', "16:9", 0.5 )

    if ( !document.cookie.includes('ImAcCookie') )
    {
        document.cookie = "ImAcCookie=opened; max-age=3600;"; // 1 hora

        var interval1 = setTimeout( function() { VideoController.pauseAll(); },1000);
        var xy = _meshGen.getColor360Mesh( 0x000000, 1, 60 );

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