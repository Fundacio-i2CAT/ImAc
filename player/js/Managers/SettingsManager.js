
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


	this.getMainLanguageFunc = function (name, language)
    {      
        return function() {
            //MenuManager.selectFinalDropdownOption( name );
            //mainLanguage = name;
            MenuDictionary.setMainLanguage( language );

            //menumanager.ResetViews();



            /*setTimeout(function() {

                if( menuType == 'Traditional') 
                {

                    var activeSecondaryMenuTrad = secMMgr.getActiveSecondaryMenuTrad();
                    if(activeSecondaryMenuTrad)
                    {
                        activeSecondaryMenuTrad.buttons.forEach(function(elem){
                            interController.removeInteractiveObject(elem);
                        }); 
                      camera.remove(camera.getObjectByName(activeSecondaryMenuTrad.name));
                      //subController.switchSigner( interController.getSignerActive() );
                        
                    } 

                    interController.clearInteractiveObjectList();

                    if ( _isHMD ) {
                        scene.remove(scene.getObjectByName( "traditionalMenu" ))
                    }
                    else {
                        camera.remove(scene.getObjectByName( "traditionalMenu" ))
                    }

                    MenuFunctionsManager.getOpenTradMenuFunc();
                }
                else
                {
                    MenuManager.closeMenu(); 
                    MenuManager.openMenu();
                }

                
                //scene.getObjectByName( "openMenu" ).visible = true;
                //scene.getObjectByName( "openMenuTrad" ).visible = true; //EXPERIMENTAL
            }, 300);*/
        }
    }

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