

var InteractiveElement =  function (data) {

	this.width = data.width;
	this.height = data.height;
	this.name = data.name;
	this.type = data.type;
	this.value = data.value;
	this.color = data.color;
	this.textSize = data.textSize;
	this.disabled = data.disabled;
	this.position = new THREE.Vector3(data.position);
	this.interactiveArea = new THREE.Mesh( new THREE.PlaneGeometry(data.width, data.height), new THREE.MeshBasicMaterial({visible: false}));
	this.onexecute = function(){ return data.function; }

}

InteractiveElement.prototype.create = function(){

	switch(this.type){

		case "icon":
		default:
			return createImageIE()

		case "text":
			return createTextIE();
	}
}

function createTextIE (){

    var shape = new THREE.BufferGeometry();
    var material = new THREE.MeshBasicMaterial( { color: this.color} );
    var shapes = moData.getFont().generateShapes( this.value, this.textSize);
    var geometry = new THREE.ShapeGeometry( shapes );

    geometry.computeBoundingBox();
    shape.fromGeometry( geometry );
    shape.center();
	var mesh = new THREE.Mesh(shape, material);

    return addColiderMesh(mesh);
}

function createImageIE(){

	var geometry = new THREE.PlaneGeometry(this.width, this.height);
    var loader = new THREE.TextureLoader();
    var texture = loader.load(this.value);
    texture.minFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;
    var material = new THREE.MeshBasicMaterial( { map: texture, transparent: true, side: THREE.FrontSide } );
    var mesh = new THREE.Mesh( geometry, material );

    return addColiderMesh(mesh);
}

function addColiderMesh(mesh){

	var coliderMesh = this.interactiveArea;
    coliderMesh.name = this.name;
    coliderMesh.position.z = this.position.z+0.01;
	coliderMesh.onexecute = this.onexecute;
    
    mesh.name = name;
    mesh.position = this.position;

	mesh.add(coliderMesh);

	return mesh;
}