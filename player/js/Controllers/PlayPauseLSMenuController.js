
function PlayPauseLSMenuController() {

	var data;
	var view;
	var viewStructure;

    var PlayPauseMemory = false;

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
        data.playOutTimeText = VideoController.getPlayoutTime(VideoController.getListOfVideoContents()[0].vid.currentTime);
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
    		if(intrElement.visible && intrElement.children.length > 0 )
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

    this.pauseAllFunc = function()
    {
        PlayPauseMemory = true;
        VideoController.pauseAll();
        UpdateData();
        view.UpdateView(data);
        AddInteractivityToMenuElements();
    }

    this.playAllFunc = function()
    {
        if ( PlayPauseMemory )
        {
            PlayPauseMemory = false;
            VideoController.playAll();
            UpdateData();
            view.UpdateView(data);
            //AddInteractivityToMenuElements();
        }
    }
    
	function PlayPauseFunc()
    {
        VideoController.isPausedById(0) ? VideoController.playAll() : VideoController.pauseAll();
		UpdateData();
		view.UpdateView(data);
    	AddInteractivityToMenuElements();

        playoutTimeDisplayLogic();
    }

    function SeekFunc(plus)
    {
        var sign = plus ? 1 : -1;
        VideoController.seekAll( 5*sign );
        UpdateData();
		view.UpdateView(data);

        playoutTimeDisplayLogic();
    }

    function playoutTimeDisplayLogic()
    {
        if(menuMgr.getMenuType() == 1)
        {
            data.isPlayOutTimeVisible = true;
            view.UpdateView(data);

            setTimeout(function(){ 
                data.isPlayOutTimeVisible = false;
                view.UpdateView(data);
            }, 500);    
        }
        
    };
}
