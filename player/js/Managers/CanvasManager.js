
function CanvasManager() {

    this.Init = function() {
    	//Init canvas and add the base elements (help grid and radar);
        canvas = createCanvas(100,100);
    	canvasMgr.addElement(_rdr.createRadarMeshGroup());
        camera.add(canvas);  
    };


    function createCanvas(w, h){
    	let cnv =  new THREE.Group();
    	cnv.name = 'canvas';
        cnv.position.z = -70;

		let width = vHeight * camera.aspect;

        const cnvBackground =  new THREE.Mesh( new THREE.PlaneGeometry(width, vHeight), new THREE.MeshBasicMaterial({visible: false}));
        cnvBackground.name = 'cnv-background';

        /*const cnvFov = _moData.getPlaneImageMesh(1.48*subController.getSubArea() *((_isHMD) ? 0.6 : 1) , 0.82*subController.getSubArea()*((_isHMD) ? 0.6 : 1), './img/rect5044.png', 'areamesh', 5);
        cnvFov.material.opacity = 0.25;
        cnvFov.name = 'cnv-fov';
        cnvFov.visible = false;*/

        const cnvElements =  new THREE.Group();
    	cnvElements.name = 'cnv-elements';

        cnv.add(cnvBackground);
        //cnv.add(cnvFov);
        cnv.add(cnvElements);

        return cnv;
    }

    this.addElement = function(element){
    	let cnvElmts = canvas.getObjectByName('cnv-elements');

    	//Needs check for duplicates
    	cnvElmts.add(element);
    }

    this.removeElement = function(element){
    	let cnvElmts = canvas.getObjectByName('cnv-elements');
    	cnvElmts.remove(element);
    }
};