
function CanvasManager() {

    this.Init = function() {
    	//Init canvas and add the base elements (help grid and radar);
        _canvasObj = createCanvas(100,100);
    	canvasMgr.addElement(_rdr.createRadarMeshGroup());
        camera.add(_canvasObj);  
    };


    function createCanvas(w, h){
    	let cnv =  new THREE.Group();
    	cnv.name = 'canvas';
        cnv.position.z = -70;

		let width = vHeight * camera.aspect;

        const cnvBackground =  new THREE.Mesh( new THREE.PlaneGeometry(width, vHeight), new THREE.MeshBasicMaterial({visible: false}));
        cnvBackground.name = 'cnv-background';

        const cnvElements =  new THREE.Group();
    	cnvElements.name = 'cnv-elements';

        cnv.add(cnvBackground);
        //cnv.add(cnvFov);
        cnv.add(cnvElements);

        return cnv;
    }

    this.addElement = function(element){
    	let cnvElmts = _canvasObj.getObjectByName('cnv-elements');

    	//Needs check for duplicates
    	cnvElmts.add(element);
    }

    this.removeElement = function(element){
    	let cnvElmts = _canvasObj.getObjectByName('cnv-elements');
    	cnvElmts.remove(element);
    }
};