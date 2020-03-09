/**
 * [InteractiveElementModel description]
 * @constructor
 */
function InteractiveElementModel()
{
	this.width;
	this.height;
	this.rotation;
	this.name;
	this.type;
	this.text;
	this.path;
	this.color;
	this.textSize;
	this.visible;
	this.position;
	this.interactiveArea;
	this.onexecute;
}

/**
 * [description]
 * @return {[type]} [description]
 */
InteractiveElementModel.prototype.create = function()
{
	let mesh;

	switch( this.type ) {

		case "icon":
		default:
			mesh = _meshGen.getImageIEMesh( this.width, this.height, this.path, this.color, this.name, this.rotation );
			break

		case "text":
			mesh = _meshGen.getTextMesh( this.text, this.textSize, this.color, this.name );
			break

		case "mix":
			mesh = createMixIE(this);
			break
	}

	return addColiderMesh( this, mesh );
}

function createMixIE(element){
	
	let mix =  new THREE.Group();
	let text = _meshGen.getTextMesh( element.text, element.textSize, element.color, element.name );
	const w = text.geometry.boundingBox.max.x;
	
	mix.name = element.name;
	mix.width = w;
	
	if(element.path) {
		element.width = element.textSize*2;
		element.height = element.textSize*2;
		let image = _meshGen.getImageIEMesh( element.width, element.height, element.path, element.color, element.name, element.rotation );
		mix.width = w + image.geometry.parameters.width;
		image.position.x = -mix.width;
		mix.add(image);
	}
	mix.add(text);
	
	return mix;
}

/**
 * [addColiderMesh description]
 * @param {[type]} element [description]
 * @param {[type]} mesh    [description]
 */
function addColiderMesh(element, mesh){
	if(element.interactiveArea){
		let coliderMesh = element.interactiveArea;
		if(element.rotation) {
			coliderMesh.rotation.z = -element.rotation;
		}

		coliderMesh.name = element.name;
    	coliderMesh.position.z = 0.01
		coliderMesh.onexecute = element.onexecute;
		mesh.onexecute = element.onexecute;
		mesh.add(coliderMesh);
	}

	mesh.visible = element.visible;
 	mesh.position.set(element.position.x, element.position.y, element.position.z );
	mesh.name = element.name;

	return mesh;
}