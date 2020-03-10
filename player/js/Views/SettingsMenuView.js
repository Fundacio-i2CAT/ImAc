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
    }


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

        submenu.add( createIEMesh( zoomLevel ) )
    }

}