function OptionLSMenuView() {

	this.UpdateView = function(data){
		var submenu = scene.getObjectByName(data.name);

		submenu.getObjectByName('lsOptEnabledLabel').visible = data.isLSOptEnabled;
		submenu.getObjectByName('lsOptDisabledLabel').visible = !data.isLSOptEnabled;

		submenu.getObjectByName('onlsoptbutton').visible = data.isLSOptEnabled;
		submenu.getObjectByName('offlsoptbutton').visible = !data.isLSOptEnabled;

		if(data.isLSOptEnabled) submenu.getObjectByName('lsOptEnabledLabel').material = UpdateImageIEMaterial(data.lsOptEnabledLabelValue);
		else submenu.getObjectByName('lsOptDisabledLabel').material = UpdateImageIEMaterial(data.lsOptDisbledLabelValue);

		submenu.getObjectByName('forwardMenuButton').visible = false;
		submenu.getObjectByName('backMenuButton').children[0].onexecute = data.backMenuButtonfunc;

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