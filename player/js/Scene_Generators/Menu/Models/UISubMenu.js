function UISubMenu()
{
    this.name;
    this.onActivate; 
    this.buttons; 

    function setButtons(obj)
    {
    	for ( var i = 0, l = obj.length; i < l; i++ )
        {
            var button = new UIButton();
            button.init( obj[i] );
            this.buttons.push( button );
        }
    }

    this.init = function(name, buttons, func)
    {
	 	this.name = name;
        this.onActivate = func;
        setButtons( buttons )
    };
}