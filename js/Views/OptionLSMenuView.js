function OptionLSMenuView() {

	this.UpdateView = function(data){
		var submenu = scene.getObjectByName(data.name);

		submenu.getObjectByName('lsOptEnabledLabel').visible = data.isLSOptEnabled;
		submenu.getObjectByName('lsOptDisabledLabel').visible = !data.isLSOptEnabled;

		submenu.getObjectByName('onlsoptbutton').visible = data.isLSOptEnabled;
		submenu.getObjectByName('offlsoptbutton').visible = !data.isLSOptEnabled;

		
		submenu.getObjectByName('onlsoptbutton').children[0].onexecute = data.onLSOptButtonfunc;
		submenu.getObjectByName('offlsoptbutton').children[0].onexecute = data.offLSOptButtonfunc;

		if(data.isLSOptEnabled) submenu.getObjectByName('lsOptEnabledLabel').material = UpdateImageIEMaterial(data.lsOptEnabledLabelValue);
		else submenu.getObjectByName('lsOptDisabledLabel').material = UpdateImageIEMaterial(data.lsOptDisbledLabelValue);

		submenu.getObjectByName('forwardMenuButton').visible = false;
		submenu.getObjectByName('backMenuButton').children[0].onexecute = data.backMenuButtonfunc;

		if(submenu.getObjectByName('closeMenuButton')) submenu.getObjectByName('closeMenuButton').children[0].onexecute = data.closeMenuButtonFunc;

		submenu.getObjectByName('upDropdownButton').children[0].onexecute = data.upDropdownButtonfunc;
		submenu.getObjectByName('downDropdownButton').children[0].onexecute = data.downDropdownButtonfunc;


		data.firstColumnDropdown.forEach(function(element){
			element.material.color.set( 0xffffff );
			submenu.getObjectByName('firstcolumndropdown').add(element)		
		});

		submenu.getObjectByName('upDropdownButton').visible = data.isUpDownArrowsVisible;
		submenu.getObjectByName('downDropdownButton').visible = data.isUpDownArrowsVisible;

		if(data.firstColumnHoritzontalLineDivisions)
		{
			data.firstColumnHoritzontalLineDivisions.forEach(function(element){
				submenu.getObjectByName('firstcolumnhoritzontallines').add(element)		
			});
		}
		
		
		if(data.secondColumnDropdown)
		{
			submenu.getObjectByName(data.firstColumnActiveOpt).material.color.set( 0xffff00 ); 
			submenu.getObjectByName('secondcolumndropdown').children = [];
			data.secondColumnDropdown.forEach(function(element){
				submenu.getObjectByName('secondcolumndropdown').add(element)		
			});

			if(data.secondColumnActiveOpt)
			{
				data.secondColumnDropdown.forEach(function(element){
					element.material.color.set( 0xffffff );
				});
				submenu.getObjectByName(data.secondColumnActiveOpt).material.color.set( 0xffff00 ); 
			} 
			submenu.getObjectByName('secondcolumnhoritzontallines').children = [];
			data.secondColumnHoritzontalLineDivisions.forEach(function(element){
				submenu.getObjectByName('secondcolumnhoritzontallines').add(element)		
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