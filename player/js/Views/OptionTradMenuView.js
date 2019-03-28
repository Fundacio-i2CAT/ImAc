function OptionTradMenuView() {

	this.UpdateView = function(data){
		var submenu = scene.getObjectByName(data.name);

		submenu.getObjectByName('onoptbutton').visible = data.isOnOffButtonVisible ? data.isOptEnabled : false;
		submenu.getObjectByName('offoptbutton').visible = data.isOnOffButtonVisible ? !data.isOptEnabled : false;

		//submenu.getObjectByName('backMenuButton').visible = data.isFinalDrop ? !data.isOnOffButtonVisible : false;
		submenu.getObjectByName('backMenuButton').visible = data.isFinalDrop;
		submenu.getObjectByName('backMenuButton').visible = data.hasParentDropdown;
		submenu.getObjectByName('backMenuButton').children[0].onexecute = data.backMenuButtonFunc;

		submenu.getObjectByName('onoptbutton').children[0].onexecute = data.onOptButtonFunc;
		submenu.getObjectByName('offoptbutton').children[0].onexecute = data.offOptButtonFunc;

		//if(data.isLSOptEnabled) submenu.getObjectByName('lsOptEnabledLabel').material = UpdateImageIEMaterial(data.lsOptEnabledLabelValue);
		//else submenu.getObjectByName('lsOptDisabledLabel').material = UpdateImageIEMaterial(data.lsOptDisbledLabelValue);

		if(data.title) submenu.getObjectByName('tradoptionmenutitle').add(CreateTraditionaOptionTitle(data));

		submenu.getObjectByName('tradoptionmenutitle').position.y = data.titleHeight;

	 	submenu.getObjectByName('parentcolumndropdown').children = [];
		data.parentColumnDropdown.forEach(function(element){

		element.position.x = -30/2+element.geometry.boundingBox.max.x+2;
      element.children[0].position.x = +30/2-element.geometry.boundingBox.max.x-2;
      if(!data.isFinalDrop){
        var next = AddArrowIcon();
      	next.position.x = 30-element.geometry.boundingBox.max.x-4;
      	element.add(next);
      }
      submenu.getObjectByName('parentcolumndropdown').add(element)
		});
		if(data.childColumnActiveOpt && submenu.getObjectByName(data.childColumnActiveOpt))
		{
			data.parentColumnDropdown.forEach(function(element){
				element.material.color.set( 0xffffff );
			});
			submenu.getObjectByName(data.childColumnActiveOpt).material.color.set( 0xffff00 );
		}
		submenu.getObjectByName('tradoptionmenubackground').scale.set(1,data.parentColumnDropdown.length+1, 1);
		submenu.getObjectByName('tradoptionmenubackground').position.set(0, data.parentColumnDropdown.length*5/2, 0);
	}

	function CreateTraditionaOptionTitle(data){
		console.log(data.title)
		var submenu = scene.getObjectByName(data.name);
		scene.getObjectByName("tradoptionmenutitle").remove(submenu.getObjectByName('opttitle'));

		var optTitle = new InteractiveElementModel();
    optTitle.width = 4.5;
    optTitle.height = 2.5;
    optTitle.name = 'opttitle';
    optTitle.type =  'text';
    optTitle.value = data.title;
    optTitle.textSize = 1.5;
    optTitle.color = 0xffffff;
    optTitle.position = new THREE.Vector3(0, 0, 0.01);

		return optTitle.create();
	}

	function AddArrowIcon()
	{
		var next = new InteractiveElementModel();
        next.width = 1.5;
        next.height = 1.5;
        next.rotation = Math.PI;
        next.name = 'next';
        next.type =  'icon';
        next.value = './img/menu/less_than_icon.png';
        next.color = 0xffffff;
        next.visible = true;
        next.position = new THREE.Vector3(0, 0, 0.01);

		return next.create();
	}

	this.pressButtonFeedback = function(data)
    {
    	var submenu = scene.getObjectByName(data.name);
        interController.removeInteractiveObject(data.clickedButtonName);

        var sceneElement = submenu.getObjectByName(data.clickedButtonName)
        var initScale = sceneElement.scale;

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
