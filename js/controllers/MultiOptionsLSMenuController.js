function MultiOptionsLSMenuController(menuType) {

	var data;
	var view;
	var viewStructure;

    var STOptionCtrl = new STOptionMenuController(menuType);
    var SLOptionCtrl = new SLOptionMenuController(menuType);
    var ADOptionCtrl = new ADOptionMenuController(menuType);
    var ASTOptionCtrl = new ASTOptionMenuController(menuType);
	
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

	this.getMenuIndex = function()
    {
        return -1;
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

		data.closeMenuButtonFunc = function(){ AddVisualFeedbackOnClick('closeMenuButton', function(){ menumanager.ResetViews()} )};

        switch(menuType)
        {
            // LOW SIGHTED
            case 1: 
            default:
        		data.backMenuButtonFunc = function(){ AddVisualFeedbackOnClick('backMenuButton', function(){ menumanager.NavigateBackMenu()} )};
				data.forwardMenuButtonFunc = function(){ AddVisualFeedbackOnClick('forwardMenuButton', function(){menumanager.NavigateForwardMenu()} )};

				data.openSTMenuButtonFunc = function(){ AddVisualFeedbackOnClick( data.isSTenabled ? 'showSubtitlesMenuButton' : 'disabledSubtitlesMenuButton', function(){ menumanager.Load(STOptionCtrl) })};
				data.openSLMenuButtonFunc = function(){ AddVisualFeedbackOnClick( data.isSLenabled ? 'showSignLanguageMenuButton' : 'disabledSignLanguageMenuButton', function(){ menumanager.Load(SLOptionCtrl) })};
				data.openADMenuButtonFunc = function(){ AddVisualFeedbackOnClick( data.isADenabled ? 'showAudioDescriptionMenuButton' : 'disabledAudioDescriptionMenuButton', function(){ menumanager.Load(ADOptionCtrl) })};	
				data.openASTMenuButtonFunc = function(){ AddVisualFeedbackOnClick( data.isASTenabled ? 'showAudioSubtitlesMenuButton' : 'disabledAudioSubtitlesMenuButton', function(){ menumanager.Load(ASTOptionCtrl) })};
                break;

            // TRADITIONAL
            case 2: 
            	data.openSTMenuButtonFunc = function(){ AddVisualFeedbackOnClick( data.isSTenabled ? 'showSubtitlesMenuButton' : 'disabledSubtitlesMenuButton', function(){ changeOptionMenuOpenState(STOptionCtrl.getMenuIndex()); menumanager.Load(STOptionCtrl) })};
				data.openSLMenuButtonFunc = function(){ AddVisualFeedbackOnClick( data.isSLenabled ? 'showSignLanguageMenuButton' : 'disabledSignLanguageMenuButton', function(){ changeOptionMenuOpenState(SLOptionCtrl.getMenuIndex()); menumanager.Load(SLOptionCtrl) })};
				data.openADMenuButtonFunc = function(){ AddVisualFeedbackOnClick( data.isADenabled ? 'showAudioDescriptionMenuButton' : 'disabledAudioDescriptionMenuButton', function(){ changeOptionMenuOpenState(ADOptionCtrl.getMenuIndex()); menumanager.Load(ADOptionCtrl) })};	
				data.openASTMenuButtonFunc = function(){ AddVisualFeedbackOnClick( data.isASTenabled ? 'showAudioSubtitlesMenuButton' : 'disabledAudioSubtitlesMenuButton', function(){ changeOptionMenuOpenState(ASTOptionCtrl.getMenuIndex()); menumanager.Load(ASTOptionCtrl) })};

				data.closeSTMenuButtonFunc = function(){ AddVisualFeedbackOnClick( data.isSTenabled ? 'showSubtitlesMenuButton' : 'disabledSubtitlesMenuButton', function(){ changeOptionMenuOpenState(0); STOptionCtrl.Exit() })};
				data.closeSLMenuButtonFunc = function(){ AddVisualFeedbackOnClick( data.isSLenabled ? 'showSignLanguageMenuButton' : 'disabledSignLanguageMenuButton', function(){changeOptionMenuOpenState(0); SLOptionCtrl.Exit() })};
				data.closeADMenuButtonFunc = function(){ AddVisualFeedbackOnClick( data.isADenabled ? 'showAudioDescriptionMenuButton' : 'disabledAudioDescriptionMenuButton', function(){changeOptionMenuOpenState(0); ADOptionCtrl.Exit() })};	
				data.closeASTMenuButtonFunc = function(){ AddVisualFeedbackOnClick( data.isASTenabled ? 'showAudioSubtitlesMenuButton' : 'disabledAudioSubtitlesMenuButton', function(){changeOptionMenuOpenState(0); ASTOptionCtrl.Exit() })};
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
