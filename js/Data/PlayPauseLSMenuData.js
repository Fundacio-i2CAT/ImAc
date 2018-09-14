
function playButtonData() {

	this.width = 75;
	this.height = 75;
	this.name = 'playButton';
	this.type=  'icon';
	this.value = './img/menu/play_icon.png';
	this.color = 0xffffff;
	this.textSize=  null;
	this.visible = true;
	this.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(this.width, this.height), new THREE.MeshBasicMaterial({visible:  false}));
	this.onexecute=  function(){ return console.log("This is the play button"); };
}

function pauseButtonData () {

	this.width = 75;
	this.height = 75;
	this.name =  'pauseButton';
	this.type=  'icon';
	this.value = './img/menu/pause_icon.png';
	this.color = 0xffffff;
	this.textSize=  null;
	this.visible = true;
	this.interactiveArea=  new THREE.Mesh( new THREE.PlaneGeometry(10, 10), new THREE.MeshBasicMaterial({visible:  false}));
	this.onexecute=  function(){ return console.log("This is the pause button"); }
}


function seekForwardButtonData () {

	this.width = 40;
	this.height = 20;
	this.name =  'forwardSeekButton';
	this.type=  'icon';
	this.value = './img/menu/seek_icon.png';
	this.color = 0xffffff;
	this.textSize=  15;
	this.visible = false;
	this.interactiveArea=  new THREE.Mesh( new THREE.PlaneGeometry(10, 10), new THREE.MeshBasicMaterial({visible: false}));
	this.onexecute=  function(){ return console.log("This is a test button"); }
}

function seekBackButtonData (){

	this.width = 40;
	this.height = 20;
	this.name =  'backSeekButton';
	this.type=  'icon';
	this.value = './img/menu/seek_icon.png';
	this.color = 0xffffff;
	this.textSize=  15;
	this.visible = false;
	this.interactiveArea=  new THREE.Mesh( new THREE.PlaneGeometry(10, 10), new THREE.MeshBasicMaterial({visible:  false}));
	this.onexecute=  function(){ return console.log("This is a test button"); }
}
