function SettingsMenuView() {

	this.UpdateView = function(data){
		var submenu = scene.getObjectByName(data.name);
        
        submenu.getObjectByName('settings-button').children[0].onexecute = data.openSettingsMenuButtonFunc;
        

        submenu.getObjectByName('traditional-menu-button').visible = (menuMgr.getMenuType() == 1) ? true : false;
        submenu.getObjectByName('traditional-menu-button').children[0].onexecute = data.menuTypeButtonFunc;

        submenu.getObjectByName('enhanced-menu-button').visible = (menuMgr.getMenuType() == 2) ? true : false;
        submenu.getObjectByName('enhanced-menu-button').children[0].onexecute = data.menuTypeButtonFunc; 

        if(_isHMD){
            submenu.getObjectByName('zoom-button').material.color.set( 0x3a3a3a );
            submenu.getObjectByName('zoom-level-text').material.color.set( 0x3a3a3a );
        }else{
            submenu.getObjectByName('zoom-button').children[0].onexecute = data.zoomButtonFunc; 
        }
        

//        submenu.getObjectByName('preview-button').material.color.set( 0xe6e6e6 );
//        submenu.getObjectByName('preview-button').children[0].onexecute = data.previewButtonFunc;
            
        /*if( menuMgr.getMenuType() == 1 ){
            submenu.getObjectByName('preview-button').material.color.set( 0xe6e6e6 );
            submenu.getObjectByName('preview-button').children[0].onexecute = data.previewButtonFunc;

        } else{
            submenu.getObjectByName('preview-button').material.color.set( 0x3a3a3a );
            submenu.getObjectByName('preview-button').children[0].onexecute = function() { console.log("This is the disable preview button") };

        } */  
    }

    this.pressButtonFeedback = function(data)
    {   
    	var submenu = scene.getObjectByName(data.name);
        interController.removeInteractiveObject(data.clickedButtonName);

        var sceneElement = submenu.getObjectByName(data.clickedButtonName);
        var initScale = sceneElement.scale;

        sceneElement.material.color.set( menuButtonActiveColor );
        sceneElement.scale.set( initScale.x*0.8, initScale.y*0.8, 1 );

        // Set color 'menuDefaultColor' (white), size to initial and add interactivity within 300ms to sceneElement;
       setTimeout(function() { 
            sceneElement.material.color.set( menuDefaultColor );
            sceneElement.scale.set( initScale.x*1.25, initScale.y*1.25, 1 ); 
            interController.addInteractiveObject( sceneElement );
        }, 300);
    };

    this.changeZoomLevelText = function(data){
        var submenu = scene.getObjectByName(data.name);
        var zoomLevel = new InteractiveElementModel();
        zoomLevel.width = 0;
        zoomLevel.height = 0;
        zoomLevel.name = 'zoom-level-text';
        zoomLevel.type = 'text';
        zoomLevel.text = 'x'+data.zoomLevel;
        zoomLevel.color = 0xffffff;
        zoomLevel.textSize = menuWidth/35;
        zoomLevel.position = submenu.getObjectByName('zoom-level-text').position;

        submenu.remove(submenu.getObjectByName('zoom-level-text'));
        submenu.add(zoomLevel.create());
    }

}