/**
 * This module lists all the different function related to the Radar eLement;
 *
 * @class      Radar (name)
 * @return     {THREE}  { description_of_the_return_value }
 */

THREE.Radar = function () {

	let radar;

/**
 * This function creates the radar which is composed of 3 different parts:
 * The radar outline, the radar area and the radar indicator;
 *
 * @return     {Group}  The radar mesh group.
 */
	this.getRadarMeshGroup = function(){

        radar =  new THREE.Group();
        radar.name = 'radar';

        let radarOutline = new InteractiveElementModel();
        radarOutline.width = 14;
        radarOutline.height = 14;
        radarOutline.name = 'radar-outline';
        radarOutline.type =  'icon';
        radarOutline.path = './img/area_7.png';
        radarOutline.color = 0xe6e6e6;
        radarOutline.visible = true;
        radarOutline.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(14, 14), new THREE.MeshBasicMaterial({visible: false}));
        radarOutline.position = new THREE.Vector3(0, 0, 0.01);
        //radarOutline.onexecute = function() { console.log("This is the %s button", seekLBtn.name) }

        let radarArea = new InteractiveElementModel();
        radarArea.width = 14;
        radarArea.height = 14;
        radarArea.name = 'radar-area';
        radarArea.type =  'icon';
        radarArea.path = './img/radar_7.png';
        radarArea.color = 0xe6e6e6;
        radarArea.visible = true;
        radarArea.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(14, 14), new THREE.MeshBasicMaterial({visible: false}));
        radarArea.position = new THREE.Vector3(0, 0, 0.01);

        let radarIndicator = new InteractiveElementModel();
        radarIndicator.width = 14;
        radarIndicator.height = 14;
        radarIndicator.name = 'radar-indicator';
        radarIndicator.type =  'icon';
        radarIndicator.path = './img/indicador_7.png';
        radarIndicator.color = 0xe6e6e6;
        radarIndicator.visible = false;
        radarIndicator.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(14, 14), new THREE.MeshBasicMaterial({visible: false}));
        radarIndicator.position = new THREE.Vector3(0, 0, 0.01);


        radar.add(radarOutline.create());
        radar.add(radarArea.create());
        radar.add(radarIndicator.create());

        subController.getSubArea()
        radar.position.set((_isHMD ? 0.8*( 1.48*subController.getSubArea()/2-14/2 ) : ( 1.48*subController.getSubArea()/2-14/2 )), 0, -76.001);
        radar.visible = false;

        return radar;
    } 

/**
 * Updates the position if the radar depending on the signer's visibility;
 */
    this.updateRadarPosition = function(){
        if (radar){
	        if(subController.getSignerEnabled()){
	            radar.position.y = 0;
	        } else {
	           	radar.position.y = _isHMD ? 0.09*( 0.82*subController.getSubArea()/2-14/2 ) * subController.getSubPosition().y : ( 0.82*subController.getSubArea()/2-14/2 ) * subController.getSubPosition().y; 
	        }
	    }
    }


/**
 * Updates the color and position of the radar indiocator which is the one in charge
 * of indicating the speakers location;
 *
 * @param      {hexadecimal}  color   The color
 * @param      {number}  pos     The position
 */
    this.updateRadarIndicator = function(color, pos){
        _rdr.showRadarIndicator();
        radar.getObjectByName('radar-indicator').material.color.set( color );
        radar.getObjectByName('radar-indicator').rotation.z = Math.radians( 360 - pos ); 
    }

/**
 * Updates the radar area rotation with the camera movement;
 */
    this.updateRadarRotation = function(){
    	let radarArea = radar.getObjectByName('radar-area');

    	if(radarArea && radarArea.visible){

    		let target = new THREE.Vector3();
            let camView = camera.getWorldDirection( target );
            let offset = camView.z >= 0 ? 180 : -0;
            let lon = Math.degrees( Math.atan( camView.x/camView.z ) ) + offset;

            radarArea.rotation.z = Math.radians( lon );

    	}
    }

/**
 * Shows the radar.
 */
    this.showRadar = function(){
    	if(radar) radar.visible = true;
    }

/**
 * Hides the radar.
 */
    this.hideRadar = function(){
    	if(radar) radar.visible = false;
    }

/**
 * Shows the radar indicator.
 */
	this.showRadarIndicator = function(){
    	if(radar.getObjectByName('radar-indicator')) radar.getObjectByName('radar-indicator').visible = true;
    }

/**
 * Hides the radar indicator.
 */
    this.hideRadarIndicator = function(){
    	if(radar.getObjectByName('radar-indicator')) radar.getObjectByName('radar-indicator').visible = false;
    }
}