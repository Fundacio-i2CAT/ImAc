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
        radar.visible = false;

        let radarOutline = new InteractiveElementModel();
        radarOutline.width = 14;
        radarOutline.height = 14;
        radarOutline.name = 'radar-outline';
        radarOutline.type =  'icon';
        radarOutline.path = './img/area_7.png';
        radarOutline.color = 0xe6e6e6;
        radarOutline.visible = true;
        radarOutline.position = new THREE.Vector3(0, 0, 0.01);

        let radarArea = new InteractiveElementModel();
        radarArea.width = 14;
        radarArea.height = 14;
        radarArea.name = 'radar-area';
        radarArea.type =  'icon';
        radarArea.path = './img/radar_7.png';
        radarArea.color = 0xe6e6e6;
        radarArea.visible = true;
        radarArea.position = new THREE.Vector3(0, 0, 0.01);

        let radarIndicator = new InteractiveElementModel();
        radarIndicator.width = 14;
        radarIndicator.height = 14;
        radarIndicator.name = 'radar-indicator';
        radarIndicator.type =  'icon';
        radarIndicator.path = './img/indicador_7.png';
        radarIndicator.color = 0xe6e6e6;
        radarIndicator.visible = false;
        radarIndicator.position = new THREE.Vector3(0, 0, 0.01);

        let radarColorBorder = new THREE.Mesh( new THREE.RingGeometry( 6.5, 7, 64 ), new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.FrontSide }));
        radarColorBorder.position.set(0, 0, 0.01);
        radarColorBorder.visible = false;
        radarColorBorder.name = 'radar-color-boder';

        radar.add(radarColorBorder);
        radar.add(radarOutline.create());
        radar.add(radarArea.create());
        radar.add(radarIndicator.create());

        
        if(localStorage.getItem("radarPosition")){
            let savedPosition = JSON.parse(localStorage.getItem("radarPosition"))
            radar.position.set(savedPosition.x, savedPosition.y, savedPosition.z);
        } else {
            let x = (_isHMD ? 0.6*( 1.48*subController.getSignerArea()/2-20/2 ) : ( 1.48*subController.getSignerArea()/2-20/2 )) * subController.getSignerPosition().x;
            radar.position.set(x, 0, 0);
        }

        return radar;
    } 

/**
 * Updates the position if the radar depending on the signer's visibility;
 */
    this.updateRadarPosition = function(){
        if (radar && !localStorage.getItem("radarPosition")){
	        if(subController.getSignerEnabled()){
                let offset = -subController.getSubPosition().y * subController.getSignerSize();
	            radar.position.y = (_isHMD ? scene.getObjectByName('sign').position.y + offset : 0);
                radar.position.x = (_isHMD ? 0.6*( 1.48*subController.getSignerArea()/2-subController.getSignerSize()/2 ) : ( 1.48*subController.getSignerArea()/2-subController.getSignerSize()/2 )) * subController.getSignerPosition().x;
	        } else {
                radar.position.y = subController.getSubtitleConfig().y;
            }
	    }
    }

/**
 * Function that moves the radar inside the FoV boundings.
 *
 * @param      {<type>}  pos     The position
 */
    this.move = function(pos){
        if (elementSelection) {
            scene.getObjectByName('trad-main-menu').visible = false;
            scene.getObjectByName('trad-option-menu').visible = false;

            let w = 1.48*subController.getSignerArea()-14;
            let h = 0.82*subController.getSignerArea()-14;

            if(pos.x > -w/2 && pos.x < w/2){
                canvas.getObjectByName('radar').position.x = pos.x; 
            }

            if(pos.y > -h/2 && pos.y < h/2){
                canvas.getObjectByName('radar').position.y = pos.y;
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
    this.updateRadarAreaRotation = function(){
    	let radarArea = radar.getObjectByName('radar-area');

    	if(radarArea && radarArea.visible){
    		let target = new THREE.Vector3();
            let camView = camera.getWorldDirection( target );
            let offset = camView.z >= 0 ? 180 : -0;
            let lon = Math.degrees( Math.atan( camView.x/camView.z ) ) + offset;

            radarArea.rotation.z = Math.radians( lon );
    	}
    }

    this.updateRadarMeshRotation = function()
    {
        if ( radar.visible ) camera.getObjectByName('canvas').rotation.z = -camera.rotation.z;
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