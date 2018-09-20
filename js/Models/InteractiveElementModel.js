
function InteractiveElementModel() {

	this.width;
	this.height;
	this.rotation;
	this.name;
	this.type;
	this.value;
	this.color;
	this.textSize;
	this.visible;
	this.position;
	this.interactiveArea;
	this.onexecute;
}

InteractiveElementModel.prototype.create = function(){

	switch(this.type){

		case "icon":
		default:
			return createImageIE(this)

		case "text":
			return createTextIE(this);
	}
}

function createTextIE (element){

    var shape = new THREE.BufferGeometry();
    var material = new THREE.MeshBasicMaterial( { color: element.color} );
    var shapes = moData.getFont().generateShapes( element.value, element.textSize);
    var geometry = new THREE.ShapeGeometry( shapes );

    geometry.computeBoundingBox();
    shape.fromGeometry( geometry );
    shape.center();

	var mesh = new THREE.Mesh(shape, material);

    return addColiderMesh(element, mesh);
}

function createImageIE(element){

	var geometry = new THREE.PlaneGeometry(element.width, element.height);
    var loader = new THREE.TextureLoader();
    var texture = loader.load(element.value);

    texture.minFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;
    var material = new THREE.MeshBasicMaterial( { map: texture, transparent: true, side: THREE.FrontSide } );
    
    var mesh = new THREE.Mesh( geometry, material );
    if(element.rotation) mesh.rotation.z = element.rotation;

    return addColiderMesh(element, mesh);
}

function addColiderMesh(element, mesh){
	if(element.interactiveArea)
	{
		var coliderMesh = element.interactiveArea;
	    coliderMesh.name = element.name;
	    coliderMesh.position.z = 0.01
		coliderMesh.onexecute = element.onexecute;
		mesh.onexecute = element.onexecute;
		mesh.add(coliderMesh);
	}

	mesh.visible = element.visible;	
	mesh.position.set(element.position.x, element.position.y, element.position.z );
	mesh.name = element.name;
	mesh.renderOrder = 5;
	

	//if(element.visible) interController.addInteractiveObject(mesh);
	
	return mesh;
}
