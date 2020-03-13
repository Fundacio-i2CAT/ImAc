
function SettingsOptionMenuView() 
{
	this.UpdateView = function( data ) 
    {
		let submenu = scene.getObjectByName( data.name );

        submenu.position.y = menuMgr.getMenuType() == 2 ? ( menuHeight/2 + optHeight/2 + menuWidth/100 + data.parentColumnDropdown.length*( optHeight/2 ) ) : 0;

		submenu.getObjectByName( 'back-button' ).visible = data.isFinalDrop || data.hasParentDropdown;
		submenu.getObjectByName( 'back-button' ).children[0].onexecute = data.backMenuButtonFunc;

        scene.getObjectByName( "tradoptionmenutitle" ).remove( submenu.getObjectByName( 'settings-opt-title' ) );

		submenu.getObjectByName( 'tradoptionmenutitle' ).add( updateTitle( data ) );
        submenu.getObjectByName( 'tradoptionmenutitle' ).position.y = optHeight/2 * data.parentColumnDropdown.length;
        submenu.getObjectByName( 'parentcolumndropdown' ).children = [];
        submenu.getObjectByName( 'checkmark' ).visible = data.isFinalDrop; 

        if ( data.default )
        {
            submenu.getObjectByName( 'checkmark' ).position.x = -1.5*menuWidth/8;
            submenu.getObjectByName( 'checkmark' ).position.y = data.default.position.y;
        } 
        else 
        {
            submenu.getObjectByName( 'checkmark' ).visible = false;
        }
       
        //TODO: CHECK FOREACH
		data.parentColumnDropdown.forEach( function( element, index )
        {
			element.position.x = element.width - 1.2*menuWidth/8;
            element.children[ element.children.length-1 ].position.x = -element.position.x;

  			submenu.getObjectByName( 'parentcolumndropdown' ).add( element );
		});

        if ( data.childColumnActiveOpt && submenu.getObjectByName( data.childColumnActiveOpt ) )
        {
            data.parentColumnDropdown.forEach( function( element )
            {
                element.children[0].material.color.set( 0xe6e6e6 );
            });
        }

		let mesh = _meshGen.getRoundedRectMesh( optWidth, ( data.parentColumnDropdown.length + 1 )*optHeight, 3*menuWidth/100, 0x111111 );

        mesh.name = 'tradoptionmenubackground';

        submenu.remove(submenu.getObjectByName('tradoptionmenubackground')).add( mesh );
	}

	function updateTitle( data ) 
    {
		var optTitle = new InteractiveElementModel();

        optTitle.width = 18*menuWidth/200;
        optTitle.height = optHeight;
        optTitle.name = 'settings-opt-title';
        optTitle.type =  'text';
        optTitle.text = MenuDictionary.translate( data.title );
        optTitle.path = data.icon;
        optTitle.textSize =  menuWidth/35;
        optTitle.color = 0xe6e6e6;
        optTitle.visible = true;
        optTitle.position = new THREE.Vector3( 0, 0, 0.01 );
        optTitle.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry( optTitle.width,  optHeight ), new THREE.MeshBasicMaterial({visible:  false}));

        return createIEMesh( optTitle )
	}
}
