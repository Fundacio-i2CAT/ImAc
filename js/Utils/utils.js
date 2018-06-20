

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

function getPlanePosition ()
{
  var fov = camera.fov;

  if (signArea == 'topLeft')
  {
    var userLatitud = 0;
    var userLongitud = 0;
  }
  else if (signArea == 'topRight')
  {
    var userLatitud = 0;
    var userLongitud = 100;
  }
  else if (signArea == 'botLeft')
  {
    var userLatitud = 100;
    var userLongitud = 0;
  }
  else if (signArea == 'botRight')
  {
    var userLatitud = 100;
    var userLongitud = 100;
  }
  else 
  {  
    var userLatitud = 50;
    var userLongitud = 50;
  }
  var size = 0.45 * viewArea/100;

  latitud = (((fov/2) * (viewArea/100)) - fov* (viewArea/100)*(userLatitud/100)) * (1 - size) * (1 + size/(2*(2-size))) * (1 - Math.pow(((userLongitud-50)/105), 2));
  longitud = ((fov) * (viewArea/100)) *((userLongitud/100) - 0.5) * (1 - size) * (1 + size/(1*(2-size))) * (0.88 - Math.pow(((userLatitud-50)/500), 2));

  return convertAngular_toCartesian (latitud, longitud);
}



// Converts from degrees to radians.
Math.radians = function(degrees) {
    return degrees * (Math.PI / 180);
};
 
// Converts from radians to degrees.
Math.degrees = function(radians) {
    return radians * (180 / Math.PI);
};