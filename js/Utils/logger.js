

var QoE_URL = 'http://192.168.10.248:8083/qoe';

var StatObject = function ()
{

	this.add = function (element) {
		console.log(element);

    	/*$.post( QoE_URL, {
    		data: element
    	},
    	function(data,status){
        	//Debug.log("Data: " + data + "\nStatus: " + status);
    	});*/
    };

};

var StatElements = function () 
{
	/*this.messageType = "INFO";
	this.date = Date.now();
	this.deviceId = 1;
	this.sessionId = 2;
	this.contentId = 3;

	this.videoElements = undefined;*/
	var view = camera.getWorldDirection();

	this.viewX = view.x;
	this.viewY = view.y;
	this.viewZ = view.z;	
};
