function PlayPauseLSMenuView() {

	

	function UpdateView(data){

		var submenu = menu.getObjectByName(data.name);

		var playButton = submenu.getObjectByName(data.playButton.name);
		var pauseButton = submenu.getObjectByName(data.pauseButton.name)
		var seekForwardButton = submenu.getObjectByName(data.seekForwardButton.name);
		var seekBackButton = submenu.getObjectByName(data.seekBackButton.name);
		
		playButton = data.playButton;
		pauseButton = data.pauseButton;
		seekForwardButton = data.seekForwardButton;
		seekBackButton = data.seekBackButton;       
	}


// WOULD IT BE A GOOD IDEA TO HAVE EACH STRUTURE IN EACH VIEW LIB
	function CreateViewStructure function(){

		var menu =  new THREE.Group();
		menu.name = 'playpausemenu';

        // Create the playbutton by loading a new InteractiveElement model and ijecting the playButtonData
		var playButton = new InteractiveElementModel(new playButtonData());
		playButton.position = new THREE.Vector3(0,0,0);
		menu.add(playButton.create());

        // Create the pauseButton by loading a new InteractiveElement model and ijecting the pauseButtonData
		var pauseButton = new InteractiveElementModel(new pauseButtonData());
		pauseButton.position = new THREE.Vector3(0,0,0);
		menu.add(pauseButton.create());

        // Create the seekBackButton by loading a new InteractiveElement model and ijecting the seekBackButtonData
		var seekBackButton = new InteractiveElementModel(new seekBackButtonData());
		seekBackButton.position = new THREE.Vector3(0,0,0);
		menu.add(seekBackButton.create());

        // Create the seekForwardButton by loading a new InteractiveElement model and ijecting the seekForwardButtonData
		var seekForwardButton = new InteractiveElementModel(new seekForwardButtonData());
		seekForwardButton.position = new THREE.Vector3(0,0,0);
		menu.add(seekForwardButton.create());

		return menu;
	}
}