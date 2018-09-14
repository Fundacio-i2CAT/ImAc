
function PlayPauseLSMenuController() {

	var data;
	var view;
	var viewStructure;
	

	function init(){

		data = GetData();
		UpdateData(data);
		viewStructure = menu.getObjectByName(data.name);
		viewStructure.visible = true;
		view.UpdateData(data); 
	}

    function GetData()
	{
	    if (data == null)
	    {
	        data = new PlayPauseLSMenuModel();
	    }
	    return data;
	}


	function UpdateData(data)
    {
		data.name = "playpausemenu";
		data.playButton = new InteractiveElementModel(playButtonData());
		data.pauseButton = new InteractiveElementModel(pauseButtonData());
		data.seekForwardButton = new InteractiveElementModel(seekForwardButtonData());
		data.seekBackButton = new InteractiveElementModel(seekBackButtonData());
    }
}
