
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

    this.getChangeMenuTypeFunction = function()
    {
		let newType = (menuMgr.getMenuType()%2)+1;
		menuMgr.ResetViews();
		menuMgr.removeMenuFromParent();
		menuMgr.Init(newType);
		menuMgr.initFirstMenuState();	
	}

	this.checkMenuType = function(menuType)
	{
		return menuType == menuMgr.getMenuType();
	}
};