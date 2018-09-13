
var PlayPauseLSMenu = function (data) {

	this.width = data.width;
	this.height = data.height;
	this.name = data.name;
	this.playButton = new InteractiveElement(data.playButton)
	this.pauseButton = new InteractiveElement(data.pauseButton)
	this.seekForwardButton = new InteractiveElement(data.seekForwardButton)
	this.seekBackButton = new InteractiveElement(data.seekBackButton)

}