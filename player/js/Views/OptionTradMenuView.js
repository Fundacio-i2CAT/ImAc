function OptionTradMenuView() {
	let submenu;

	this.UpdateView = function(data) {

		submenu = scene.getObjectByName(data.name);

		submenu.getObjectByName('backMenuButton').visible = data.isFinalDrop || data.hasParentDropdown;
		submenu.getObjectByName('backMenuButton').children[0].onexecute = data.backMenuButtonFunc;

		if(data.title) submenu.getObjectByName('tradoptionmenutitle').add(CreateTraditionaOptionTitle(data));

		submenu.getObjectByName('tradoptionmenutitle').position.y = data.titleHeight;
	 	submenu.getObjectByName('parentcolumndropdown').children = [];


//TODO: CHECK FOREACH
		data.parentColumnDropdown.forEach(function(element){

			element.position.x = -optWidth/2+element.geometry.boundingBox.max.x+2;
	      	element.children[0].position.x = +optWidth/2-element.geometry.boundingBox.max.x-2;
	      	if(!data.isFinalDrop){
		        let next = AddArrowIcon();
		      	next.position.x = optWidth-element.geometry.boundingBox.max.x-4;
		      	element.add(next);
	  		}
  			submenu.getObjectByName('parentcolumndropdown').add(element)
		});

		if(data.childColumnActiveOpt && submenu.getObjectByName(data.childColumnActiveOpt)){
			data.parentColumnDropdown.forEach(function(element){
				element.material.color.set( 0xe6e6e6 );
			});
			submenu.getObjectByName(data.childColumnActiveOpt).material.color.set( 0xffff00 );
		}

//TODO: CREATE SEPARATE FUNCTION
		let menuShape = _moData.roundedRect( new THREE.Shape(), optWidth, (data.parentColumnDropdown.length+1)*optHeight, 3*menuWidth/100 );
        let material = new THREE.MeshBasicMaterial( { color: 0x111111});
        let geometry = new THREE.ShapeGeometry( menuShape );
        let mesh =  new THREE.Mesh( geometry, material);
        mesh.name = 'tradoptionmenubackground';

        submenu.remove(submenu.getObjectByName('tradoptionmenubackground')).add(mesh);
		submenu.getObjectByName('tradoptionmenubackground').position.set(0, data.parentColumnDropdown.length*(optHeight/2), 0);
	}

	function CreateTraditionaOptionTitle(data) {

		scene.getObjectByName("tradoptionmenutitle").remove(submenu.getObjectByName('opttitle'));

		let optTitle = new InteractiveElementModel();
		optTitle.width = 18*menuWidth/200;
		optTitle.height = optHeight;
		optTitle.name = 'opttitle';
		optTitle.type =  'text';
		optTitle.value = data.title;
		optTitle.textSize = 5*menuWidth/200;
		optTitle.color = 0xe6e6e6;
		optTitle.position = new THREE.Vector3(0, 0, 0.01);

		return optTitle.create();
	}

	function AddArrowIcon() {

		let next = new InteractiveElementModel();
        next.width = 1.5;
        next.height = 1.5;
        next.rotation = Math.PI;
        next.name = 'next';
        next.type =  'icon';
        next.value = './img/menu/less_than_icon.png';
        next.color = 0xe6e6e6;
        next.visible = true;
        next.position = new THREE.Vector3(0, 0, 0.01);

		return next.create();
	}

	this.pressButtonFeedback = function(data) {

        interController.removeInteractiveObject(data.clickedButtonName);

        let sceneElement = submenu.getObjectByName(data.clickedButtonName)
        let initScale = sceneElement.scale;

        sceneElement.material.color.set( menuButtonActiveColor );
        sceneElement.scale.set( initScale.x*0.8, initScale.y*0.8, 1 );

        // Set color 'menuDefaultColor' (white), size to initial and add interactivity within 300ms to sceneElement;
       setTimeout(function() {
            sceneElement.material.color.set( menuDefaultColor );
            sceneElement.scale.set( initScale.x*1.25, initScale.y*1.25, 1 );
            interController.addInteractiveObject( sceneElement );
        }, 300);
    }
}
