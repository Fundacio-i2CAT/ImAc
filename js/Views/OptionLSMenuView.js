function OptionLSMenuView() {

	this.UpdateView = function(data){
		var submenu = scene.getObjectByName(data.name);

		submenu.getObjectByName('lsOptEnabledLabel').visible = data.isOptEnabled;
		submenu.getObjectByName('lsOptDisabledLabel').visible = !data.isOptEnabled;

		submenu.getObjectByName('onlsoptbutton').visible = data.isOptEnabled;
		submenu.getObjectByName('offlsoptbutton').visible = !data.isOptEnabled;

		
		submenu.getObjectByName('onlsoptbutton').children[0].onexecute = data.onOptButtonFunc;
		submenu.getObjectByName('offlsoptbutton').children[0].onexecute = data.offOptButtonFunc;

		if(data.isLSOptEnabled) submenu.getObjectByName('lsOptEnabledLabel').material = UpdateImageIEMaterial(data.lsOptEnabledLabelValue);
		else submenu.getObjectByName('lsOptDisabledLabel').material = UpdateImageIEMaterial(data.lsOptDisbledLabelValue);

		submenu.getObjectByName('forwardMenuButton').visible = false;
		submenu.getObjectByName('backMenuButton').children[0].onexecute = data.backMenuButtonFunc;

		if(submenu.getObjectByName('closeMenuButton')) submenu.getObjectByName('closeMenuButton').children[0].onexecute = data.closeMenuButtonFunc;

		submenu.getObjectByName('upDropdownButton').children[0].onexecute = data.upDropdownButtonFunc;
		submenu.getObjectByName('downDropdownButton').children[0].onexecute = data.downDropdownButtonFunc;

		data.parentColumnDropdown.forEach(function(element){
			element.material.color.set( 0xffffff );
			submenu.getObjectByName('parentcolumndropdown').add(element)		
		});

		submenu.getObjectByName('upDropdownButton').visible = data.isUpDownArrowsVisible;
		submenu.getObjectByName('downDropdownButton').visible = data.isUpDownArrowsVisible;

		if(data.parentColumnHoritzontalLineDivisions)
		{
			data.parentColumnHoritzontalLineDivisions.forEach(function(element){
				submenu.getObjectByName('parentcolumnhoritzontallines').add(element)		
			});
		}
		
		
		if(data.childColumnDropdown)
		{
			submenu.getObjectByName(data.parentColumnActiveOpt).material.color.set( 0xffff00 ); 
			submenu.getObjectByName('childcolumndropdown').children = [];
			data.childColumnDropdown.forEach(function(element){
				submenu.getObjectByName('childcolumndropdown').add(element)		
			});

			if(data.childColumnActiveOpt)
			{
				data.childColumnDropdown.forEach(function(element){
					element.material.color.set( 0xffffff );
				});
				submenu.getObjectByName(data.childColumnActiveOpt).material.color.set( 0xffff00 ); 
			} 
			submenu.getObjectByName('childcolumnhoritzontallines').children = [];
			data.childColumnHoritzontalLineDivisions.forEach(function(element){
				submenu.getObjectByName('childcolumnhoritzontallines').add(element)		
			});
		}
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
    };

	function UpdateImageIEMaterial(newData)
	{
		var loader = new THREE.TextureLoader();
		var texture = loader.load(newData);

		texture.minFilter = THREE.LinearFilter;
		texture.format = THREE.RGBAFormat;
		var material = new THREE.MeshBasicMaterial( { map: texture, transparent: true, side: THREE.FrontSide } );

		return material;
	}
}