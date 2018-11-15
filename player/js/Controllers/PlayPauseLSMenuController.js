
function PlayPauseLSMenuController() {

	var data;
	var view;
	var viewStructure;

	this.Init = function(){

		data = GetData();
		UpdateData();
		viewStructure = scene.getObjectByName(data.name);
		viewStructure.visible = true;

		view = new PlayPauseLSMenuView();
		view.UpdateView(data); 

		AddInteractivityToMenuElements();
	}

	this.Exit = function()
    {
    	if(viewStructure)
    	{
	    	viewStructure.visible = false;
	    	viewStructure.children.forEach(function(intrElement){
	    		interController.removeInteractiveObject(intrElement.name);
	    	})
    	}
    }

    this.getMenuName = function()
    {
    	return data.name;
    }

    this.getMenuIndex = function()
    {
        return -1;
    }

    function GetData()
	{
	    if (data == null)
	    {
	        data = new PlayPauseLSMenuModel();
	    }
	    return data;
	}


	function UpdateData()
    {
		data.isPaused = VideoController.isPausedById(0);
        data.playOutTimeText = updatePlayOutTime();
        data.isPlayOutTimeVisible = (menuMgr.getMenuType() == 1) ? false : true;

		data.playpauseMenuButtonFunc = function(){ AddVisualFeedbackOnClick(VideoController.isPausedById(0) ? 'playButton' : 'pauseButton', function(){ PlayPauseFunc()} )};
		data.seekForwardMenuButtonFunc = function(){ AddVisualFeedbackOnClick('forwardSeekButton',  function(){ SeekFunc(true)} )};
		data.seekBackMenuButtonFunc = function(){ AddVisualFeedbackOnClick('backSeekButton',  function(){ SeekFunc(false)} )};
        data.backMenuButtonFunc = function(){ AddVisualFeedbackOnClick('backMenuButton', function(){ menuMgr.NavigateBackMenu()} )};
        data.forwardMenuButtonFunc = function(){ AddVisualFeedbackOnClick('forwardMenuButton', function(){menuMgr.NavigateForwardMenu()} )};
        data.closeMenuButtonFunc = function(){ AddVisualFeedbackOnClick('closeMenuButton', function(){ menuMgr.ResetViews()} )};
    }


    function AddInteractivityToMenuElements()
    {
    	viewStructure.children.forEach(function(intrElement){
    		if(intrElement.visible)
    		{
    			interController.addInteractiveObject(intrElement);
    		}
    	})
    }

    this.updatePlayOutTime = function()
    {
        UpdateData();
        view.UpdateView(data);
    }

    function AddVisualFeedbackOnClick(buttonName, callback)
    {
        data.clickedButtonName = buttonName;
        view.pressButtonFeedback(data);
        setTimeout(callback, 300);
    }
    

	function PlayPauseFunc()
    {
        VideoController.isPausedById(0) ? VideoController.playAll() : VideoController.pauseAll();
		UpdateData();
		view.UpdateView(data);
    	AddInteractivityToMenuElements();

    	//TODO

        /*setTimeout(function() { 
            ppMMgr.playoutTimeDisplayLogic( ppMMgr.isPausedById(0) ); 
        }, clickInteractionTimeout);*/
    }

    function SeekFunc(plus)
    {
        var sign = plus ? 1 : -1;
        VideoController.seekAll( 5*sign );
        UpdateData();
		view.UpdateView(data);

		//TODO

        //ppMMgr.playoutTimeDisplayLogic( true );
    }

    function updatePlayOutTime()
    {
        let current = VideoController.getPlayoutTime(VideoController.getListOfVideoContents()[0].vid.currentTime);
        const total = VideoController.getPlayoutTime(VideoController.getListOfVideoContents()[0].vid.duration);

        return current+" / "+total;
    }
}
