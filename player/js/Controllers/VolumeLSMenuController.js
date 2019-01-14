
function VolumeLSMenuController() {

	var data;
	var view;
	var viewStructure;
	
	this.Init = function(){

		data = GetData();
		UpdateData();
		viewStructure = scene.getObjectByName(data.name);
		viewStructure.visible = true;

		view = new VolumeLSMenuView();
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
	        data = new VolumeLSMenuModel();
	    }
	    return data;
	}

	function UpdateData()
    {
    	data.volumeLevel = _AudioManager.getVolume()*100+'%';
    	data.isVolumeLevelVisible = false;
		data.isMuted = _AudioManager.isAudioMuted();

		data.muteUnmuteMenuButtonFunc = function(){ AddVisualFeedbackOnClick(_AudioManager.isAudioMuted() ? 'unmuteVolumeButton' : 'muteVolumeButton', function(){ MuteUnmuteVolumeFunc()} )}; 
		data.plusVolumeMenuButtonFunc = function(){ AddVisualFeedbackOnClick('plusVolumeButton', function(){ ChangeVolumeFunc(true)} )};
		data.minusVolumeMenuButtonFunc = function(){ AddVisualFeedbackOnClick('minusVolumeButton', function(){ ChangeVolumeFunc(false)} )};
		data.backMenuButtonFunc = function(){ AddVisualFeedbackOnClick('backMenuButton', function(){ menuMgr.NavigateBackMenu()} )};
		data.forwardMenuButtonFunc = function(){ AddVisualFeedbackOnClick('forwardMenuButton', function(){ menuMgr.NavigateForwardMenu()} )};
		data.closeMenuButtonFunc = function(){ AddVisualFeedbackOnClick('closeMenuButton', function(){ menuMgr.ResetViews()} )};
        data.previewButtonFunc = function(){ AddVisualFeedbackOnClick('previewMenuButton', function(){menuMgr.OpenPreview()} )};
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

	function ChangeVolumeFunc(plus)
    {
    	var sign = plus ? 1 : -1;
        _AudioManager.changeVolume( 0.1*sign );
        volumeLevelDisplayLogic();
    };

    function MuteUnmuteVolumeFunc()
    {
		_AudioManager.isAudioMuted() ? _AudioManager.setunmute() : _AudioManager.setmute();
        
		UpdateData();
		view.UpdateView(data);
    	AddInteractivityToMenuElements();
    };

    function volumeLevelDisplayLogic()
    {
		data.volumeLevel = _AudioManager.getVolume();
        data.isVolumeLevelVisible =  true;
        view.UpdateView(data);

        setTimeout(function(){ 
        	(_AudioManager.getVolume()>0) ? _AudioManager.setunmute() : _AudioManager.setmute();
        	data.isMuted = _AudioManager.isAudioMuted();
			data.isVolumeLevelVisible =  false;
			view.UpdateView(data);
        }, 500);
    };
}