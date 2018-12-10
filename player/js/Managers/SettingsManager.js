
/************************************************************************************
	
	SettingsManager.js  
		* Library used to manage the menu settings different options.

	Need of external libs:
		* 

	Need of global vars:
		* 
	
	FUNCTIONALITIES:
		* Getters of all settings attributes

************************************************************************************/

SettingsManager = function() {


	/*this.getMainLanguageFunc = function (name, language)
    {      
        return function() {
            MenuDictionary.setMainLanguage( language );
        }
    }*/

    this.getChangeMenuTypeFunction = function(newMenuType)
    {
    	return function() {
			var currentMenuType = menuMgr.getMenuType();
			
			if(currentMenuType == newMenuType)
			{
				 console.log("Same Menu");
			}
			else
			{
                menuMgr.ResetViews();
				menuMgr.removeMenuFromParent();
				menuMgr.Init(newMenuType);
				menuMgr.initFirstMenuState();
			}	
    	}
	}

	this.checkMenuType = function(menuType)
	{
		return menuType == menuMgr.getMenuType();
	}
};