

function VolumeMenuView() 
{
	this.UpdateView = function( data )
    {
    	let submenu = scene.getObjectByName(data.name );

		submenu.getObjectByName( 'unmute-volume-button' ).visible = data.isVolumeLevelVisible ? false : data.isMuted;
        submenu.getObjectByName( 'unmute-volume-button' ).children[0].onexecute = data.muteUnmuteMenuButtonFunc;
		submenu.getObjectByName( 'mute-volume-button' ).visible = data.isVolumeLevelVisible ? false : !data.isMuted;
        submenu.getObjectByName( 'mute-volume-button' ).children[0].onexecute = data.muteUnmuteMenuButtonFunc;

        if ( submenu.getObjectByName( 'volume-level-text' ) ) {
            submenu.getObjectByName('volume-level-text').visible = data.isVolumeLevelVisible;
        }

		if ( submenu.getObjectByName( 'plus-volume-button' ) ) {
            submenu.getObjectByName( 'plus-volume-button' ).children[0].onexecute = data.plusVolumeMenuButtonFunc;
        }
        
		if ( submenu.getObjectByName( 'minus-volume-button' ) ) {
            submenu.getObjectByName( 'minus-volume-button' ).children[0].onexecute = data.minusVolumeMenuButtonFunc;
        }

        if ( data.isVolumeLevelVisible ) 
        {
            submenu.remove( submenu.getObjectByName( 'volume-level-text' ) );
            submenu.add( changeVolumeLevelText( data ) );
        }
	}

    function changeVolumeLevelText( data, submenu )
    { 
        let volumeLevel = new InteractiveElementModel();

        volumeLevel.width = 0;
        volumeLevel.height = 0;
        volumeLevel.name = 'volume-level-text';
        volumeLevel.type =  'text';
        volumeLevel.text = data.volumeLevel*100+'%';
        volumeLevel.textSize = menuWidth/50;
        volumeLevel.color = 0xffffff; 
        volumeLevel.position = submenu.getObjectByName( 'unmute-volume-button' ).position;

        return createIEMesh( volumeLevel )
    }
}