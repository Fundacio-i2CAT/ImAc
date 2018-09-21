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

		data.firstColumnDropdown.forEach(function(element){
			submenu.getObjectByName('firstcolumndropdown').add(element)		
		});
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