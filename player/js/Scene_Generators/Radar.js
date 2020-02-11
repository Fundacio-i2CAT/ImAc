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
	this.createRadarMeshGroup = function(){

        radar =  new THREE.Group();
        radar.name = 'radar';
        radar.visible = false;

        let radarOutline = new InteractiveElementModel();
        radarOutline.width = 14;
        radarOutline.height = 14;
        radarOutline.name = 'rdr-outline';
        radarOutline.type =  'icon';
        radarOutline.path = './img/area_7.png';
        radarOutline.color = 0xe6e6e6;
        radarOutline.visible = true;
        radarOutline.position = new THREE.Vector3(0, 0, 0.01);

        let radarArea = new InteractiveElementModel();
        radarArea.width = 14;
        radarArea.height = 14;
        radarArea.name = 'rdr-area';
        radarArea.type =  'icon';
        radarArea.path = './img/radar_7.png';
        radarArea.color = 0xe6e6e6;
        radarArea.visible = true;
        radarArea.position = new THREE.Vector3(0, 0, 0.01);

        let radarIndicator = new InteractiveElementModel();
        radarIndicator.width = 14;
        radarIndicator.height = 14;
        radarIndicator.name = 'rdr-indicator';
        radarIndicator.type =  'icon';
        radarIndicator.path = './img/indicador_7.png';
        radarIndicator.color = 0xe6e6e6;
        radarIndicator.visible = false;
        radarIndicator.position = new THREE.Vector3(0, 0, 0.01);

        let radarColorBorder = new THREE.Mesh( new THREE.RingGeometry( 6.5, 7, 64 ), new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.FrontSide }));
        radarColorBorder.position.set(0, 0, 0.01);
        radarColorBorder.visible = false;
        radarColorBorder.name = 'rdr-colorFrame';

        radar.add(radarColorBorder);
        radar.add(radarOutline.create());
        radar.add(radarArea.create());
        radar.add(radarIndicator.create());

        
        if(localStorage.getItem("rdrPosition")){
            let savedPosition = JSON.parse(localStorage.getItem("rdrPosition"))
            radar.position.set(savedPosition.x, savedPosition.y, savedPosition.z);
        } else {
            let slArea = slConfig.area;
            let x = (_isHMD ? 0.6*( 1.48*slArea/2 - 20/2) : ( 1.48*slArea/2 - 20/2 )) * slConfig.canvasPos.x;
            radar.position.set(x, 0, 0);
        }

        return radar;
    } 

/**
 * Updates the position if the radar depending on the signer's visibility;
 */
    this.updateRadarPosition = function(){
        if (radar && !localStorage.getItem("rdrPosition")){
            let slSize = slConfig.size;
            let offset = -stConfig.canvasPos.y * slSize;
            let slArea = slConfig.area;
	        if(slConfig.isEnabled){
	            radar.position.y = 0;
	        } else {
                radar.position.y = stConfig.canvasPos.y * (vHeight*(1-safeFactor) - 14)/2;
            }
            radar.position.x = (_isHMD ? 0.6*( 1.48*slArea/2 - slSize/2 ) : ( 1.48*slArea/2 - slSize/2 )) * slConfig.canvasPos.x;
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

            let w = vHeight * camera.aspect;
            
            if(pos.x > -(w-14)/2 && pos.x < (w-14)/2){
                canvas.getObjectByName('radar').position.x = pos.x; 
            }

            if(pos.y > -(vHeight-14)/2 && pos.y < (vHeight-14)/2){
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
        radar.getObjectByName('rdr-indicator').material.color.set( color );
        radar.getObjectByName('rdr-indicator').rotation.z = Math.radians( 360 - pos ); 
    }

/**
 * Updates the radar area rotation with the camera movement;
 */
    this.updateRadarAreaRotation = function(){
    	let radarArea = radar.getObjectByName('rdr-area');

    	if(radarArea && radarArea.visible){
    		let target = new THREE.Vector3();
            let camView = camera.getWorldDirection( target );
            let offset = camView.z >= 0 ? 180 : -0;
            let lon = Math.degrees( Math.atan( camView.x/camView.z ) ) + offset;

            radarArea.rotation.z = Math.radians( lon );
    	}
    }

    this.updateRadarMeshRotation = function(){
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
    	if(radar.getObjectByName('rdr-indicator')) radar.getObjectByName('rdr-indicator').visible = true;
    }

/**
 * Hides the radar indicator.
 */
    this.hideRadarIndicator = function(){
    	if(radar.getObjectByName('rdr-indicator')) radar.getObjectByName('rdr-indicator').visible = false;
    }
}