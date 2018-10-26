
// GLOBAL VARS

var _PlayerVersion = 'v0.05.0';

/**
 * Initializes the web player.
 */	

function init_webplayer() 
{
	console.log('Version: ' + _PlayerVersion);

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