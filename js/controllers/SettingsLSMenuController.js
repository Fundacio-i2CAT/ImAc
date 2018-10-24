function SettingsLSMenuController(menuType) {

	var data;
	var view;
	var viewStructure;

	var SettingsOptionCtrl = new SettingsOptionMenuController(menuType)

	this.Init = function(){

		data = GetData();
		UpdateData();
		viewStructure = scene.getObjectByName(data.name);
		viewStructure.visible = true;

		view = new SettingsLSMenuView();
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
	        data = new SettingsLSMenuModel();
	    }
	    return data;
	}


	function UpdateData()
    {
    	
		data.closeMenuButtonFunc = function(){ AddVisualFeedbackOnClick('closeMenuButton', function(){ menumanager.ResetViews()} )};


		switch(menuType)
        {
            // LOW SIGHTED
            case 1: 
            default:
            	data.openSettingsMenuButtonFunc = function(){ AddVisualFeedbackOnClick('settingsButton', function(){menumanager.Load(SettingsOptionCtrl)} )}; 	
				data.backMenuButtonFunc = function(){ AddVisualFeedbackOnClick('backMenuButton', function(){ menumanager.NavigateBackMenu()} )};
				data.forwardMenuButtonFunc = function(){ AddVisualFeedbackOnClick('forwardMenuButton', function(){menumanager.NavigateForwardMenu()} )};
				break;

            // TRADITIONAL
            case 2: 
            	data.openSettingsMenuButtonFunc = function(){ AddVisualFeedbackOnClick('settingsButton', function(){ changeOptionMenuOpenState(SettingsOptionCtrl.getMenuIndex()); menumanager.Load(SettingsOptionCtrl) })};
				data.closeSettingsMenuButtonFunc = function(){ AddVisualFeedbackOnClick('settingsButton', function(){ changeOptionMenuOpenState(0); SettingsOptionCtrl.Exit() })};
				
            	break;
        }
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

	function changeOptionMenuOpenState(index)
    {
		data.activeOptionIndex = index;
        view.UpdateView(data); 
    }
}