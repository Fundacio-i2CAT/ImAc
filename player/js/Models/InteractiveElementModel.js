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
	switch(this.type){

		case "icon":
		default:
			return createImageIE(this);

		case "text":
			return createTextIE(this);

		case "mix":
			return createMixIE(this);
	}
}

/**
 * [createTextIE description]
 * @param  {[type]} element [description]
 * @return {[type]}         [description]
 */
function createTextIE (element){
	let shape = new THREE.BufferGeometry();
	const material = new THREE.MeshBasicMaterial( { color: element.color} );
	const shapes = _moData.getFont().generateShapes( element.text, element.textSize);
	let geometry = new THREE.ShapeGeometry( shapes );

	geometry.computeBoundingBox();
	shape.fromGeometry( geometry );
	shape.center();

	const mesh = new THREE.Mesh(shape, material);

  	return addColiderMesh(element, mesh);
}

/**
 * [createImageIE description]
 * @param  {[type]} element [description]
 * @return {[type]}         [description]
 */
function createImageIE(element){
	const geometry = new THREE.PlaneGeometry(element.width, element.height);
	const loader = new THREE.TextureLoader();
  	const texture = loader.load(element.path);

	texture.minFilter = THREE.LinearFilter;
	texture.format = THREE.RGBAFormat;

	const material = new THREE.MeshBasicMaterial( { color: element.color, map: texture, transparent: true, side: THREE.FrontSide} );
	let mesh = new THREE.Mesh( geometry, material );

	if(element.rotation) {
		mesh.rotation.z = element.rotation;
	}
	return addColiderMesh(element, mesh);
}

/**
 * 
 * Creates a mix ie.
 *
 * @param      {<type>}  element  The element
 * @return     {THREE}   { description_of_the_return_value }
 */
function createMixIE(element){
	
	let mix =  new THREE.Group();
	let text = createTextIE(element);
	const w = text.geometry.boundingBox.max.x;
	
	mix.name = element.name;
	mix.width = w;
	
	if(element.path) {
		element.width = element.textSize*2;
		element.height = element.textSize*2;
		let image = createImageIE(element);
		image.position.x = -w - element.width*1.25;
		mix.width += image.geometry.parameters.width;
		mix.add(image);
		mix.position.x = element.width/2;
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
