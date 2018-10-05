
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
		data.isPaused = ppMMgr.isPausedById(0);
		data.playpauseMenuButtonFunc = function(){ AddVisualFeedbackOnClick(ppMMgr.isPausedById(0) ? 'playButton' : 'pauseButton', function(){ PlayPauseFunc()} )};
		data.seekForwardMenuButtonFunc = function(){ AddVisualFeedbackOnClick('forwardSeekButton',  function(){ SeekFunc(true)} )};
		data.seekBackMenuButtonFunc = function(){ AddVisualFeedbackOnClick('backSeekButton',  function(){ SeekFunc(false)} )};
        data.backMenuButtonFunc = function(){ AddVisualFeedbackOnClick('backMenuButton', function(){ menumanager.NavigateBackMenu()} )};
        data.forwardMenuButtonFunc = function(){ AddVisualFeedbackOnClick('forwardMenuButton', function(){menumanager.NavigateForwardMenu()} )};
        data.closeMenuButtonFunc = function(){ AddVisualFeedbackOnClick('closeMenuButton', function(){ menumanager.ResetViews()} )};
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

    function AddVisualFeedbackOnClick(buttonName, callback)
    {
        data.clickedButtonName = buttonName;
        view.pressButtonFeedback(data);
        setTimeout(callback, 300);
    }
    

	function PlayPauseFunc()
    {
        ppMMgr.isPausedById(0) ? ppMMgr.playAll() : ppMMgr.pauseAll();
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
        ppMMgr.seekAll( sign*seekTime );
        UpdateData();
		view.UpdateView(data);

		//TODO

        //ppMMgr.playoutTimeDisplayLogic( true );
    }
}
