/**
 * @author isaac.fraile@i2cat.net
 */

MenuFunctionsManager = function() {

    this.getSubShowDropdownFunc = function(index, name)
    {       
        return function() {
            MenuManager.openSubMenuDropdown( index, name );
        }
    };

	// On / Off 

	this.getSubOnOffFunc = function( isEnabled )
	{		
		return function() {
	        subController.switchSubtitles( isEnabled );
            menuList[6].isEnabled = isEnabled;
            secMMgr.showMultiOptionsButtons( multiOptionsMainSubMenuIndexes.slice(0,1) );
            MenuManager.showOnOffToggleButton( 6, 0, 1, 0, 4 );
		}
	};

	// Language

    this.getSubLanguageFunc = function(xml, name)
    {   
    console.error(xml)  
        return function() {
            subController.setSubtitle( xml );
            MenuManager.selectFinalDropdownOption( name );
            subtitlesLanguage = name;
        }
    };

    // Easy To Read

    this.getSubEasyOnOffFunc = function(enable, name)
    {       
        return function() {
            subController.setSubEasy( enable );
            MenuManager.selectFinalDropdownOption( name );
            subtitlesEasy = name;
        }
    };

    // Position

    this.getSubPositionFunc = function(position, name)
    {       
        return function() {
            subController.setSubPosition( 0, position );
            MenuManager.selectFinalDropdownOption( name );
            subtitlesPosition = name;
        }
    };

    // Background

    this.getSubBackgroundFunc = function(index, name)
    {       
        return function() {
            subController.setSubBackground( index );
            MenuManager.selectFinalDropdownOption( name );
            subtitlesBackground = name;
        }
    };

    // Size

    this.getSubSizeFunc = function(size, name)
    {       
        return function() {
            subController.setSubSize( size );
            MenuManager.selectFinalDropdownOption( name );
            subtitlesSize = name;
        }
    };

    // Indicator

    this.getSubIndicatorFunc = function(indicator, name)
    {       
        return function() {
            subController.setSubIndicator( indicator );
            MenuManager.selectFinalDropdownOption( name );
            subtitlesIndicator = name;
        }
    };

    // Area

    this.getSubAreaFunc = function(area, name)
    {       
        return function() {
            subController.setSubArea( area );
            MenuManager.selectFinalDropdownOption( name );
            subtitlesArea = name;
        }
    };

    // Up/Down

	this.getSubUpDownFunc = function(down)
	{
		return function() {
            MenuManager.changeMenuUpOrDown( down );
		}
	};
	
}