

function VideoProgressBarView() 
{
    this.UpdateView = function( data )
    {
        let submenu = scene.getObjectByName( data.name );
        let vpb = submenu.getObjectByName('video-progress-bar');
       
        submenu.getObjectByName("play-progress").scale.set(data.playScaleX,1,1);
        submenu.getObjectByName("play-progress").position.x = data.playPositionX;
        submenu.getObjectByName("slider-progress").position.x = data.sliderPositionX;

        mainMenuCtrl.setSeekingProcess(false);

        vpb.remove(scene.getObjectByName('video-playout-time'));
        vpb.add(refreshPlayOutTime(data));
    }

    function refreshPlayOutTime( data )
    {
        let playouttime = new InteractiveElementModel();

        playouttime.width = 35;
        playouttime.height = 35;
        playouttime.name = 'video-playout-time';
        playouttime.type =  'text';
        playouttime.text = data.videoPlayOutTimeText;
        playouttime.textSize = menuWidth/50;
        playouttime.color = 0xe6e6e6;
        playouttime.position = new THREE.Vector3(-9*menuWidth/20 , -menuHeight/24, 0.01);

        return createIEMesh( playouttime )
    }
}