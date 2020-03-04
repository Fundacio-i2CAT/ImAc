
//var QoE_URL = 'http://' + window.location.hostname + ':4000/api/create';
var QoE_URL = 'http://' + window.location.hostname + ':8083/qoe';
//var QoE_URL = 'http://195.81.194.222:8083/qoe';

var _targetVector = new THREE.Vector3();

var StatObject = function ()
{

	this.add = function (element) {

		//console.log(element);
    	/*$.post( QoE_URL, element, function(data, status){
			if (status == 'success' && firstQoEmsg ){
				firstQoEmsg = false;
			}
        	//Debug.log("Data: " + data + "\nStatus: " + status);
    	});*/
    	$.post( QoE_URL, {
    		data: element
    	},
    	function(data,status){
    		if (status == 'success' && firstQoEmsg ) firstQoEmsg = false;
        	//Debug.log("Data: " + data + "\nStatus: " + status);
    	});
    };
};

var StatElements = function (userAction) 
{
	var videoElement = VideoController.getListOfVideoContents()[0];
	var player = videoElement.dash;

	if ( player )
	{
	    var averageThroughput = player.getAverageThroughput('video');
	    var currentBufferLevel = player.getBufferLength('video');
	    var quality = player.getQualityFor('video');

	    this.url = player.getSource();
	    this.averageThroughput = averageThroughput;
		this.currentBufferLevel = currentBufferLevel;
		this.quality = quality;
	}

	this.messageType = firstQoEmsg ? "START" : userAction ? userAction : "INFO";
	this.date = Date.now();
	//this.deviceId = 1;
	this.sessionId = sessionId;
	this.contentId = demoId;
	this.msId = localStorage.ImAc_roomID;
	this.calculatedDiff = globalDiff;

	this.mediaTime = videoElement.vid.currentTime;

	//if (startupDelay > 0) this.startupDelay = startupDelay;
	
	this.vr = _isHMD;

	//this.videoElements = undefined;
	var view = camera.getWorldDirection( _targetVector );

	var position = cartesianToAngular( view.x,view.y,view.z );
	//console.log(position);

	this.viewLon = position.longitud;
	this.viewLat = position.latitud;
	
	this.viewX = view.x;
	this.viewY = view.y;
	this.viewZ = view.z;	

	this.playerUrl = window.location.href;
};
