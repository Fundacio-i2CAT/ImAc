

function SphericalToCartesian (polar ,elevation) 
{
    //Vector3 outCart = new Vector3();
    var outCart = new Array(3);

    outCart.x = Math.cos(elevation) * Math.sin(polar);
    outCart.y = Math.sin(elevation);
    outCart.z = Math.cos(elevation) * Math.cos(polar);

    return outCart;
}

function convertAngular_toCartesian(latitud, longitud)
{
    var elevation = Math.radians(latitud);
    var polar = Math.radians(longitud);
    var position = SphericalToCartesian(polar, elevation);

    return position;
}

function stylizeElement( element ) 
{
    element.style.display = 'none';

    element.style.position = 'absolute';
    element.style.bottom = '200px';
    element.style.padding = '12px 6px';
    element.style.border = '2px solid #fff';
    element.style.borderRadius = '4px';
    element.style.background = '#000';
    element.style.color = '#fff';
    element.style.font = 'bold 24px sans-serif';
    element.style.textAlign = 'center';
    element.style.opacity = '0.8';
    element.style.outline = 'none';
    element.style.zIndex = '999';

    element.style.cursor = 'pointer';
    element.style.width = '100px';

    element.onmouseenter = function () 
    {   
        element.style.opacity = '1.0'; 
        element.style.color = '#ff0'; 
        element.style.border = '2px solid #ff0'; 
    };

    element.onmouseleave = function () 
    { 
        element.style.opacity = '0.8'; 
        element.style.color = '#fff'; 
        element.style.border = '2px solid #fff'; 
    };
}

function initReticulum(cam)
{
    Reticulum.init(cam, {
        proximity: false,
        clickevents: true,
        reticle: {
            visible: false,
            restPoint: 50, //Defines the reticle's resting point when no object has been targeted
            color: 0xffff00,
            innerRadius: 0.0004,
            outerRadius: 0.003,
            hover: {
                color: 0x13ec56,
                innerRadius: 0.02,
                outerRadius: 0.024,
                speed: 5,
                vibrate: 50 //Set to 0 or [] to disable
            }
        },
        fuse: {
            visible: false,
            duration: 3,
            color: 0x4669a7,
            innerRadius: 0.045,
            outerRadius: 0.06,
            vibrate: 100, //Set to 0 or [] to disable
            clickCancelFuse: false //If users clicks on targeted object fuse is canceled
        }
    });
}

// Converts from degrees to radians.
Math.radians = function(degrees) {
    return degrees * (Math.PI / 180);
};
 
// Converts from radians to degrees.
Math.degrees = function(radians) {
    return radians * (180 / Math.PI);
};