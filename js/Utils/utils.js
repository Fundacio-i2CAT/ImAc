

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

function cartesianToAngular (x, y, z)
{
    var dist = Math.round(Math.sqrt(Math.pow(x,2) + Math.pow(y,2) + Math.pow(z,2))*100)/100;
    var lat = Math.round(Math.degrees(Math.asin(y/-dist))*10)/10;
    var lon = z >= 0 ? Math.round(Math.degrees(Math.atan(x/z))*10)/10 + 90 : Math.round(Math.degrees(Math.atan(x/z))*10)/10 - 90;

    lon = lon >= 0 ? lon : lon + 360;

    var outAng = {
        latitude : lat,
        longitude : lon,
        distance : dist
    };
    return outAng;
}

function adaptSize (size) 
{
    var width_Defecto = 1;
    var height_Defecto = 1;
    var newSize = new Array(2);

    var factor = 2 * Math.PI; 
    var output_size = Math.tan(size * Math.PI / 2);

    newSize.width = width_Defecto * output_size * factor;
    newSize.height = height_Defecto * output_size * factor;

    return newSize;
}

function adaptUserSize (size) 
{
    var newSize = new Array(2);

    var output_size = Math.tan(size * Math.PI / 4);

    var factor = 1.6; //1.2

    newSize.width = output_size * factor;
    newSize.height = output_size * factor;

    return newSize;
}

function rgb2hex(rgb){
 return (rgb && rgb.length === 4) ? "0x" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

function adaptRGBA(rgb){
    return (rgb && rgb.length === 4) ? "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")" : '';
}

function objectsAreSame(x, y) {
   var objectsAreSame = true;
   for(var propertyName in x) {
      if(x[propertyName] !== y[propertyName]) {
         objectsAreSame = false;
         break;
      }
   }
   return objectsAreSame;
}

// Converts from degrees to radians.
Math.radians = function(degrees) {
    return degrees * (Math.PI / 180);
};
 
// Converts from radians to degrees.
Math.degrees = function(radians) {
    return radians * (180 / Math.PI);
};

Math.inv = function(number) {
    return -1 * number;
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