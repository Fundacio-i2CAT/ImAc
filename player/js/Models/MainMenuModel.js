
function MainMenuModel() {
	this.name = 'trad-main-menu';

	//PlayPause
	this.isPaused;
	this.playpauseMenuButtonFunc;
	this.seekForwardMenuButtonFunc;
	this.seekBackMenuButtonFunc;
	this.backMenuButtonFunc;
	this.forwardMenuButtonFunc;
	this.isPlayOutTimeVisible;
	this.closeMenuButtonFunc;
	this.clickedButtonName;

	//Volume
	this.isMuted;
	this.muteUnmuteMenuButtonFunc;
	this.plusVolumeMenuButtonFunc;
	this.minusVolumeMenuButtonFunc;
	this.backMenuButtonFunc;
	this.forwardMenuButtonFunc;
	this.closeMenuButtonFunc;
	this.clickedButtonName;
	this.volumeLevel;
	this.isVolumeLevelVisible;

	//Settings
	this.openSettingsMenuButtonFunc;
	this.menuTypeButtonFunc;
	this.previewButtonFunc;
	this.zoomButtonFunc;
	this.zoomLevel;
	this.isPreviewVisible;
	this.clickedButtonName;

	//Access options
	this.backMenuButtonfunc;
	this.forwardMenuButtonFunc;
	this.closeMenuButtonFunc;
	this.clickedButtonName;
	this.isSTenabled;
	this.isSLenabled;
	this.isADenabled;
	this.isASTenabled;
	this.isSTavailable;
	this.isSLavailable;
	this.isADavailable;
	this.isASTavailable;
	this.subtitlesButtonFunc;
	this.signlanguageButtonFunc;
	this.audioDescriptionButtonFunc;
	this.audioSubtitlesButtonFunc;

	//Video progress bar
	this.playScaleX;
	this.seekScaleX;
	this.playPositionX;
	this.sliderPositionX;
	this.videoPlayOutTimeText;
}