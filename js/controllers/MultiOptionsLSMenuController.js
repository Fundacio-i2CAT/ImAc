function MultiOptionsLSMenuController(menuType) {

	var data;
	var view;
	var viewStructure;
	

	this.Init = function(){

		data = GetData();
		UpdateData();
		viewStructure = scene.getObjectByName(data.name);
		viewStructure.visible = true;

		view = new MultiOptionsLSMenuView();
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
	        data = new MultiOptionsLSMenuModel();
	    }
	    return data;
	}


	function UpdateData()
    {
		data.isSTenabled = true; //NEED FUNCTIONS THAT RETURNS IF THE OPTION IS ENABLED OR DISABLED
		data.isSLenabled = true;
		data.isADenabled = false;
		data.isASTenabled = false;

		data.openSTMenuButtonFunc = function(){ AddVisualFeedbackOnClick( data.isSTenabled ? 'showSubtitlesMenuButton' : 'disabledSubtitlesMenuButton', function(){ menumanager.Load(new STOptionMenuController(menuType)) })};
		data.openSLMenuButtonFunc = function(){ AddVisualFeedbackOnClick( data.isSLenabled ? 'showSignLanguageMenuButton' : 'disabledSignLanguageMenuButton', function(){ menumanager.Load(new SLOptionMenuController(menuType)) })};
		data.openADMenuButtonFunc = function(){ AddVisualFeedbackOnClick( data.isADenabled ? 'showAudioDescriptionMenuButton' : 'disabledAudioDescriptionMenuButton', function(){ menumanager.Load(new ADOptionMenuController(menuType)) })};	
		data.openASTMenuButtonFunc = function(){ AddVisualFeedbackOnClick( data.isASTenabled ? 'showAudioSubtitlesMenuButton' : 'disabledAudioSubtitlesMenuButton', function(){ menumanager.Load(new ASTOptionMenuController(menuType)) })};

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
}
