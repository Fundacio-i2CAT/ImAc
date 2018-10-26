
function UIMenu()
{
    this.name;
    this.subMenus = []; 
    this.buttons = []; 

    this.init = function(name)
    {
	 	this.name = name;
    };

    this.addSubMenu = function(subMenu)
    {
        this.subMenus.push( subMenu );
    };

    this.addButton = function(button)
    {
        this.buttons.push( button );
    };
}