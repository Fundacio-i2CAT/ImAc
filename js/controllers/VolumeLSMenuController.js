
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

	this.getLSMenuName = function()
    {
    	return data.name;
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
		data.isMuted = AudioManager.isAudioMuted();
		data.muteUnmuteMenuButtonfunc = function(){ MuteUnmuteVolumeFunc() };
		data.plusVolumeMenuButtonfunc = function(){ ChangeVolumeFunc(true) };
		data.minusVolumeMenuButtonfunc = function(){ ChangeVolumeFunc(false) };
		data.backMenuButtonfunc = function(){ menumanager.NavigateBackMenu()};
		data.forwardMenuButtonFunc = function(){ menumanager.NavigateForwardMenu()};
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

	function ChangeVolumeFunc(plus)
    {
    	var sign = plus ? 1 : -1;
        //MenuManager.pressButtonFeedback( name );
        AudioManager.changeVolume( sign*volumeChangeStep );
        //MenuController.volumeLevelDisplayLogic();
    };

    function MuteUnmuteVolumeFunc()
    {
        //MenuManager.pressButtonFeedback( name );

		AudioManager.isAudioMuted() ? AudioManager.setunmute() : AudioManager.setmute();
        
		UpdateData();
		view.UpdateView(data);
    	AddInteractivityToMenuElements();

       /* setTimeout(function() { 
            MenuController.showMuteUnmuteButton(); 
        }, clickInteractionTimeout); */
    };
}