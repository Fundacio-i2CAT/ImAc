/**
 * [InteractiveElement description]
 */
export default class InteractiveElement {
	constructor(width, height, rotation, name, type, value, color, textSize, visible, position, interactiveArea, onexecute) {
		this.width = width;
		this.height = height;
		this.rotation = rotation;
		this.name = name;
		this.type = type;
		this.value = value;
		this.color = color;
		this.textSize = textSize;
		this.visible = visible;
		this.position = position;
		this.interactiveArea = interactiveArea;
		this.onexecute = onexecute;
	}

	/**
	 * [description]
	 * @return {[type]} [description]
	 */
	create() {
		switch(this.type){

			case "icon":
			default:
				return createImageIE(this);

			case "text":
				return createTextIE(this);
		}
	}

	/**
	 * [createTextIE description]
	 * @param  {[type]} element [description]
	 * @return {[type]}         [description]
	 */
	createTextIE (){
	  var shape = new THREE.BufferGeometry();
	  var material = new THREE.MeshBasicMaterial( { color: this.color} );
	  var shapes = _moData.getFont().generateShapes( this.value, this.textSize);
	  var geometry = new THREE.ShapeGeometry( shapes );

	  geometry.computeBoundingBox();
	  shape.fromGeometry( geometry );
	  shape.center();

		var mesh = new THREE.Mesh(shape, material);

	  return addColiderMesh(this, mesh);
	}

	/**
	 * [createImageIE description]
	 * @param  {[type]} element [description]
	 * @return {[type]}         [description]
	 */
	createImageIE () {
		var geometry = new THREE.PlaneGeometry(this.width, this.height);
		var loader = new THREE.TextureLoader();
	  var texture = loader.load(this.value);

	  texture.minFilter = THREE.LinearFilter;
	  texture.format = THREE.RGBAFormat;

	  var material = new THREE.MeshBasicMaterial( { map: texture, transparent: true, side: THREE.FrontSide } );
	  var mesh = new THREE.Mesh( geometry, material );
	  if(this.rotation){
			mesh.rotation.z = this.rotation;
		}
		return addColiderMesh(this, mesh);
	}

	/**
	 * [addColiderMesh description]
	 * @param {[type]} element [description]
	 * @param {[type]} mesh    [description]
	 */
	addColiderMesh (mesh) {
		if(this.interactiveArea) {
			var coliderMesh = this.interactiveArea;
			if(element.rotation){
				coliderMesh.rotation.z = -this.rotation;
			}

			coliderMesh.name = this.name;
	    coliderMesh.position.z = 0.01
			coliderMesh.onexecute = this.onexecute;
			mesh.onexecute = this.onexecute;
			mesh.add(coliderMesh);
		}

		mesh.visible = this.visible;
		mesh.position.set( this.position.x, this.position.y, this.position.z );
		mesh.name = this.name;
		mesh.renderOrder = 5;

		return mesh;
	}
}
