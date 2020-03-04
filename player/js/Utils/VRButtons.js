
var VRButton_1;
var VRButton_2;

function disableVRButtons()
{
	VRButton_1.style.display = 'none';
	VRButton_2.style.display = 'none';
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

function stylizeTextElement( element ) 
{
    element.style.display = '';

    element.style.position = 'absolute';
    element.style.padding = '12px 6px';
    element.style.color = '#e6e6e6';
    element.style.font = 'bold 24px sans-serif';
    element.style.textAlign = 'center';
    element.style.outline = 'none';
    element.style.zIndex = '999';
    //element.textContent = 'Did you like the video?';

    element.style.width = '100%';
}

function stylizeBackElement( element ) 
{
    element.style.display = '';

    element.style.position = 'absolute';
    element.style.top = '0';
    element.style.background = '#000';
    element.style.opacity = '0.8';
    element.style.outline = 'none';
    element.style.zIndex = '998';

    element.style.width = '100%';
    element.style.height = window.innerHeight + 'px';
}

function createVRButton_1(renderer)
{
    function showEnterVR(display) 
    {
        button.style.display = '';
        button.style.left = 'calc(50% - 110px)';
        button.textContent = 'VR';
        button.id ='button_1';

        button.onclick = function() {

            disableVRButtons();
            VideoController.playAll();

            display.isPresenting ? display.exitPresent() : display.requestPresent( [ { source: renderer.domElement } ] ).then(
                function () { 
                    _isHMD = true;  
                    safeFactor = 0.4;
                    createMenus();                 
                });
            renderer.vr.setDevice( display );
        };
    }

    var button = document.createElement( 'button' );

    stylizeElement( button );

    navigator.getVRDisplays().then( function ( displays ) 
    {
        displays.length > 0 && !_isTV ? showEnterVR( displays[ 0 ] ) : createMenus();
    });

    VRButton_1 = button;

    return button;
}

function createVRButton_2(renderer)
{
    function showEnterVR() 
    {
        button.style.display = '';
        button.style.left = 'calc(50% + 10px)';
        button.textContent = 'NO VR';
        button.id ='button_2';
        button.onclick = function () {

            enterfullscreen();

            disableVRButtons();
            VideoController.playAll();     
            _isHMD = false; 
            createMenus();
        };
    }

    var button = document.createElement( 'button' );

    stylizeElement( button );

    navigator.getVRDisplays().then( function ( displays ) 
    {
        if ( displays.length > 0 && !_isTV ) showEnterVR();
    });

    VRButton_2 = button;

    return button;
}


function createVRButton_3()
{
    function showEnterVR() 
    {
        button.style.display = '';
        button.style.width = '250px';
        button.style.left = 'calc(50% - 125px)';
        button.style.top = 2*window.innerHeight/6 + 55 + 'px';
        button.style.bottom = '';
        button.textContent = MenuDictionary.getOption1Button();
        button.id ='button_3';

        button.onclick = function() {

            window.location.reload();
        };
    } 

    var button = document.createElement( 'button' );

    stylizeElement( button );

    navigator.getVRDisplays().then( function ( displays ) 
    {
        if ( displays.length > 0 ) displays[0].exitPresent()
    });

    showEnterVR();

    return button;
}

function createVRButton_4(renderer)
{
    function showEnterVR() 
    {
        button.style.display = '';
        button.style.width = '250px';
        button.style.left = 'calc(50% - 125px)';
        button.style.top = 2*window.innerHeight/6 + 205 +'px';
        button.style.bottom = '';
        button.textContent = MenuDictionary.getOption2Button();
        button.id ='button_4';
        button.onclick = function () {

            window.location.href = 'https://www.i2cat.net/#home';
        };
    }

    var button = document.createElement( 'button' );

    stylizeElement( button );
    showEnterVR();

    return button;
}
