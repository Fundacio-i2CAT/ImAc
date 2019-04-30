
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

    this.getChangeMenuTypeFunction = function(){

    	// TYPE 1 => Enhanced; TYPE 2 => Trdaitional;
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