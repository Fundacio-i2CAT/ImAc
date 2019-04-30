
// GLOBAL VARS

var _PlayerVersion = 'v0.07.0';

/**
 * Initializes the web player.
 */	

function init_webplayer() 
{
	console.log('Version: ' + _PlayerVersion);

    localStorage.removeItem('dashjs_video_settings');
    localStorage.removeItem('dashjs_video_bitrate');
    localStorage.removeItem('dashjs_text_settings');

//setBrowserLanguage()
    $.getJSON('./content.json', function(json)
    {
        var list_contents = json.contents;

        for (var i = 0; i < list_contents.length; i++) 
        {
            var id = i;
            var dataText = list_contents[i].name;

            createListGroup(id, list_contents[i].thumbnail, dataText);
        }
    });
}

function setBrowserLanguage()
{
    var radios2 = document.getElementsByName('lang');
    var lang =  navigator.language.substring(0,2);

    for (var i = 0, length = radios2.length; i < length; i++)
    {
        if (radios2[i].value == lang)
        {
            radios2[i].checked = true;
            break;
        }
    }
}

function selectXML(id)
{  
    var radios = document.getElementsByName('gender');

    for (var i = 0, length = radios.length; i < length; i++)
    {
        if (radios[i].checked)
        {
            localStorage.ImAc_menuType = radios[i].value;
            break;
        }
    }

    var radios2 = document.getElementsByName('lang');

    for (var i = 0, length = radios2.length; i < length; i++)
    {
        if (radios2[i].checked)
        {
            localStorage.ImAc_language = radios2[i].value;
            break;
        }
    }

    //localStorage.ImAc_server = document.getElementById('server_id').value;

    /*var radios3 = document.getElementsByName('subform');

    for (var i = 0, length = radios3.length; i < length; i++)
    {
        if (radios3[i].checked)
        {
            localStorage.ImAc_backgroundSub = radios3[i].value;
            break;
        }
    }*/


    localStorage.ImAc_init = id;

    window.location = window.location.href + 'player/#' + id;

}
   

function createListGroup(i, imagePath, dataName) 
{
    $("#list_group")
    .append(
        $('<div class="img-container-4">')
        .attr('id','content'+i)
        .append(
            $('<img>')
            .attr('id', i)
            .attr('src', imagePath)
            .attr('alt', 'ImAc')
            .attr('onclick', 'selectXML(this.id)')
            .append('</img>')
        )
        .append(
            $('<p>')
            .append(dataName)
            .append('</p>')
        )
        .append('</div>')
    )
}    


function dot2num(dot) 
{
    var d = dot.split('.');
    if ( d[0] == 192 ) return (((+d[2])*256)+(+d[3])).toString(16) + '0';
    else if ( d[0] == 172 ) return (((((+d[1])*256)+(+d[2]))*256)+(+d[3])).toString(16) + '1';
    else if ( d[0] == 10 ) return (((((+d[1])*256)+(+d[2]))*256)+(+d[3])).toString(16) + '2';
    else return (((((((+d[0])*256)+(+d[1]))*256)+(+d[2]))*256)+(+d[3])).toString(16) + '3';
}

function num2dot(numhex) 
{
    var lastChar = numhex.substr(numhex.length - 1);
    var n = 3;
    var out = '';

    numhex = numhex.slice(0, -1);

    if ( lastChar == '0' ) 
    {
        out = '192.168.';
        n = 1;
    }
    else if (lastChar == '1' ) 
    {
        out = '172.';
        n = 2;
    }
    else if (lastChar == '2' ) 
    {
        out = '10.';
        n = 2;
    }

    var num = parseInt(numhex, 16);
    var d = num%256;
    for (var i = n; i > 0; i--) 
    { 
        num = Math.floor(num/256);
        d = num%256 + '.' + d;
    }
    return out + d;
}