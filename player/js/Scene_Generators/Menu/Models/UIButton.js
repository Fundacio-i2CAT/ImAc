
function UIButton()
{
    this.name;
    this.label;
    this.onActivate;  

    this.init = function(name, label, func)
    {
	 	this.name = name;
	 	this.label = label;
        this.onActivate = func;
    };
}