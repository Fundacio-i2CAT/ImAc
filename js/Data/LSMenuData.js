function closeMenuButtonData() {

	this.width = 20;
	this.height = 20;
	this.rotation = Math.PI/4;
	this.name = 'closeMenuButton';
	this.type=  'icon';
	this.value = './img/menu/plus_icon.png';
	this.color = 0xffffff;
	this.textSize =  null;
	this.visible = true;
	this.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(this.width, this.height), new THREE.MeshBasicMaterial({visible:  false}));
	this.onexecute =  function(){ return console.log("This is the close menu button"); };
}