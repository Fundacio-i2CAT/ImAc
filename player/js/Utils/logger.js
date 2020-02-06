
var QoE_URL = 'http://' + window.location.hostname + ':8083/qoe';
//var QoE_URL = 'http://195.81.194.222:8083/qoe';

var _targetVector = new THREE.Vector3();

var StatObject = function ()
{

	this.add = function (element) {
		//console.log(element);

    	$.post( QoE_URL, {
    		data: element
    	},
    	function(data,status){
    		if (status == 'success' && firstQoEmsg ) firstQoEmsg = false;
        	//Debug.log("Data: " + data + "\nStatus: " + status);
    	});
    };

};

var StatElements = function () 
{
	var videoElement = VideoController.getListOfVideoContents()[0];
	var player = videoElement.dash;
	//var metrics = player.getMetricsFor('video');
    var averageThroughput = player.getAverageThroughput('video');
    //var dashMetrics = player.getDashMetrics();
    //var currentBufferLevel = dashMetrics.getCurrentBufferLevel(metrics) ? dashMetrics.getCurrentBufferLevel(metrics) : 0;
    var currentBufferLevel = player.getBufferLength('video');
    var quality = player.getQualityFor('video');

	this.messageType = firstQoEmsg ? "START" : "INFO";
	this.date = Date.now();
	//this.deviceId = 1;
	this.sessionId = sessionId;
	this.contentId = demoId;
	this.msId = localStorage.ImAc_roomID;

	this.mediaTime = videoElement.vid.currentTime;

	//if (startupDelay > 0) this.startupDelay = startupDelay;

	this.url = player.getSource();

	this.quality = quality;

	this.averageThroughput = averageThroughput;
	this.currentBufferLevel = currentBufferLevel;


	//this.videoElements = undefined;
	var view = camera.getWorldDirection( _targetVector );

	var position = cartesianToAngular( view.x,view.y,view.z );
	//console.log(position);

	this.viewLon = position.longitud;
	this.viewLat = position.latitud;
	
	this.viewX = view.x;
	this.viewY = view.y;
	this.viewZ = view.z;	
};
