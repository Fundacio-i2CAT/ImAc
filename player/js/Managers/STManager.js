
STManager = function() {

/**
 * Function that moves the subtitles inside the FoV boundings.
 *
 * @param      {<type>}  pos     The position
 */

    this.move = function(pos){
        if (elementSelection) {
            scene.getObjectByName('trad-main-menu').visible = false;

            let w = 1.48*subController.getSignerArea()-subController.getSignerSize();
            let h = 0.82*subController.getSignerArea()-subController.getSignerSize();

            if(pos.x > -w/2 && pos.x < w/2){
                canvas.getObjectByName('subtitles').position.x = pos.x; 
            }

            if(pos.y > -h/2 && pos.y < h/2){
                canvas.getObjectByName('subtitles').position.y = pos.y;
            } 
            //localStorage.radar_position = camera.getObjectByName('radar').position;
        }
    }
	

};