function PlayPauseLSMenuView() {

	

	function UpdateView(data){
		var name;
		var submenu = menu.getObjectByName(data.name);
		var playButton = submenu.getObjectByName(data.playButton.name);
		var pauseButton;
		var seekForwardButton;
		var seekBackButton;

		

		playButton = data.playButton;
		submenu.getObjectByName(data.pauseButton.name) = data.pauseButton;
		submenu.getObjectByName(data.seekForwardButton.name) = data.seekForwardButton;
		submenu.getObjectByName(data.seekBackButton.name) = data.seekBackButton;       
	}
}