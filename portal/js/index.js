
// GLOBAL VARS

var list_contents;
var _ws_vc;
var _confMemory;
var UUID;

//************************************************************************************
// Main Functions
//************************************************************************************

    /**
     * Initializes the web player.
     */	
    function init_webplayer() 
    {
        UUID = localStorage.ImAc_UUID ? localStorage.ImAc_UUID : uuidv4();
        gtag('set', {'user_id': UUID});
        localStorage.ImAc_UUID = UUID;

        localStorage.removeItem('dashjs_video_settings');
        localStorage.removeItem('dashjs_video_bitrate');
        localStorage.removeItem('dashjs_text_settings');

        localStorage.ImAc_roomID = undefined;

        checkCookies();
        
        $.getJSON('./content.json', function(json)
        {
            list_contents = json.contents;

            if ( localStorage.ImAc_voiceControl == 'on' ) connectVoiceControl( localStorage.ImAc_voiceControlId, "http://51.89.138.157:3000/" );

            for (var i = 0; i < list_contents.length; i++) 
            {
                createListGroup( i, list_contents[i].thumbnail, list_contents[i].name, list_contents[i].duration );
            }

            translateAll( _ImAc_default.mainlanguage )
            translateContentDesc( _ImAc_default.mainlanguage )
        });
    }

    function uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    /*
    * Init the player with the content ID = id
    */
    function launchPlayer(id)
    { 
        gtag('event', 'ContentId', {
            'event_category' : 'LaunchPlayer',
            'event_label' : id
        });

        localStorage.ImAc_init = id;
        localStorage.ImAc_server = "";
        localStorage.ImAc_language = document.getElementById('langSelector').value;
        _ImAc_default.mainlanguage = document.getElementById('langSelector').value;

        if ( _ImAc_default.userprofile == 'save' )
            document.cookie = "ImAcProfileConfig=" + encodeURIComponent( JSON.stringify( _ImAc_default ) ) + "; max-age=2592000;";

        window.location = window.location.href + 'player/#' + id;
    }

    function playContent()
    {
        launchPlayer( localStorage.ImAc_init );
    }

//************************************************************************************
// Functions to control second screen sessions
//************************************************************************************

    function createSessionByID()
    {
        var uuid = document.getElementById('sessionUUID').value;
        //connection_NEW( '195.81.194.222' );
        connection_NEW( '192.168.10.128', uuid );
    }

    function joinSessionByID()
    {
        var uuid = document.getElementById('sessionUUID').value;

        connection_JOIN( '192.168.10.128', uuid );
    }

    function connection_NEW(ip, uuid)
    {
        var new_ws = new WebSocket( 'ws://' + ip + ':4649/' + uuid + '/new' );

        new_ws.onmessage = function(message) 
        {
            if ( message.data == 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx-exist' ) alert('ID used');
            else 
            {
                document.getElementById('roomIDdiv').style.display = 'inherit';
                document.getElementById('ss_container').style.display = 'none';

                document.getElementById( 'span_s0' ).innerHTML = "Session ID: " + message.data;
                localStorage.ImAc_roomID = message.data;
                console.log( localStorage.ImAc_roomID );
            } 
        }
    }

    function connection_JOIN(ip, uuid)
    {
        var new_ws = new WebSocket( 'ws://' + ip + ':4649/' + uuid + '/join' );

        new_ws.onmessage = function(message) 
        {
            if ( message.data == 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx-nonexist' ) alert('La sesion no existe');
            else if ( message.data == 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx-noncontent' ) alert('Aun no hay contenido');
            else 
            {
                //localStorage.ImAc_roomID = uuid;
                launchPlayer( message.data );
            } 
        }
    }


//************************************************************************************
// Functions to control cookies
//************************************************************************************

    function checkCookies()
    {
        var cookieconf = readCookie("ImAcProfileConfig");

        if ( cookieconf && cookieconf != null )
        {
            _confMemory = _ImAc_default;
            _ImAc_default = JSON.parse( cookieconf );
        }
    }

    function readCookie(name)
    {
        var nameEQ = name + "="; 
        var ca = document.cookie.split(';');

        for(var i=0;i < ca.length;i++) 
        {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) {
              return decodeURIComponent( c.substring(nameEQ.length,c.length) );
            }
        }

        return null;
    }

//************************************************************************************
// Functions to filter and search contents
//************************************************************************************

    function filterFunc()
    {
        var optionslist = document.getElementsByName('is_name');
        var checkedlist = [];

        for (var i = 0; i < optionslist.length; i++) 
        {
            if ( optionslist[i].checked ) checkedlist.push( optionslist[i] );
        }

        if ( checkedlist.length > 0 )
        {
            var myNode = document.getElementById( "list_group" );
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }

            for (var i = 0; i < list_contents.length; i++) 
            {
                if ( list_contents[i].acces && checkAcces( list_contents[i].acces[0], checkedlist ) ) createListGroup( i, list_contents[i].thumbnail, list_contents[i].name, list_contents[i].duration );
            }
        }
        else searchFuncByName();
    }

    function checkAccesLang(obj, lang)
    {
        var haslang = false;

        if ( obj.ST )
        {
            for (var i = 0; i < obj.ST.length; i++) 
            {
                if ( obj.ST[i] == lang ) haslang = true;
            }
        }
        if ( obj.SL )
        {
            for (var i = 0; i < obj.SL.length; i++) 
            {
                if ( obj.SL[i] == lang ) haslang = true;
            }
        }
        if ( obj.AD )
        {
            for (var i = 0; i < obj.AD.length; i++) 
            {
                if ( obj.AD[i] == lang ) haslang = true;
            }
        }
        if ( obj.AST )
        {
            for (var i = 0; i < obj.AST.length; i++) 
            {
                if ( obj.AST[i] == lang ) haslang = true;
            }
        }

        return haslang;
    }

    function checkAcces(obj, checkedlist)
    {
        var hasacces = false;
        for (var i = 0; i < checkedlist.length; i++) 
        {
            if ( checkedlist[i].id == 'st_check' && obj.ST ) hasacces = true;
            else if ( checkedlist[i].id == 'st_check' )  { hasacces = false; break; }

            if ( checkedlist[i].id == 'sl_check' && obj.SL ) hasacces = true;
            else if ( checkedlist[i].id == 'sl_check' )  { hasacces = false; break; }

            if ( checkedlist[i].id == 'ad_check' && obj.AD ) hasacces = true;
            else if ( checkedlist[i].id == 'ad_check' )  { hasacces = false; break; }

            if ( checkedlist[i].id == 'ast_check' && obj.AST ) hasacces = true;
            else if ( checkedlist[i].id == 'ast_check' )  { hasacces = false; break; }


            if ( checkedlist[i].id == 'en_check' && checkAccesLang(obj, 'en') ) hasacces = true;
            else if ( checkedlist[i].id == 'en_check' )  { hasacces = false; break; }

            if ( checkedlist[i].id == 'es_check' && checkAccesLang(obj, 'es') ) hasacces = true;
            else if ( checkedlist[i].id == 'es_check' )  { hasacces = false; break; }

            if ( checkedlist[i].id == 'de_check' && checkAccesLang(obj, 'de') ) hasacces = true;
            else if ( checkedlist[i].id == 'de_check' )  { hasacces = false; break; }

            if ( checkedlist[i].id == 'ca_check' && checkAccesLang(obj, 'ca') ) hasacces = true;
            else if ( checkedlist[i].id == 'ca_check' )  { hasacces = false; break; }

        }

        return hasacces;
    }

    function searchFuncByName()
    {
        var name = document.getElementById('search').value;
        var myNode = document.getElementById( "list_group" );
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }

        for (var i = 0; i < list_contents.length; i++) 
        {
            if ( list_contents[i].name.toLowerCase().includes( name.toLowerCase() ) ) createListGroup( i, list_contents[i].thumbnail, list_contents[i].name, list_contents[i].duration );
        }
    }

//************************************************************************************
// Function to show or hide the content description
//************************************************************************************

    function toggleInfo()
    {
        var input = document.getElementById('togglebutton');
        if(input.checked == false) {
            //input.checked = true; 
            document.getElementById('poster_container').style.display = 'none';
        }
        else {
            document.getElementById('poster_container').style.display = 'inherit';
            /*if(input.checked == true) {
                input.checked = false; 
             }   */
        }
    }

//************************************************************************************
// Function to create the content list
//************************************************************************************

    // Funcio per a crear la llista de continguts
    function createListGroup(i, imagePath, dataName, dataTime) 
    {
        $("#list_group")
        .append(
            $('<div class="Content-padding container-3">')
            .append(
                $('<div class="Content-imgDiv">')
                .attr('id','content'+i)
                .attr('onclick', 'selectContent('+i+')')
                .append(
                    $('<img class="Content-img">')
                    .attr('id', i)
                    .attr('src', imagePath)
                    .attr('alt', 'ImAc')
                    //.attr('onclick', 'selectXML(this.id)')
                    .append('</img>')
                )
                .append(
                    $('<h3>')
                    .append(dataName)
                    .append('</h3>')
                )
                .append('</div>')
                .append(
                    $('<img class="Play-img">')
                    .attr('id', 'contentplay'+i)
                    .attr('src', "./portal/img/play_4_u79_c.png")
                    .attr('alt', 'Play')
                    .attr('onclick', 'launchPlayer(this.id)')
                    .append('</img>')
                )
                .append(
                    $('<div class="Content-duration">')
                    .attr('id', 'contentduration'+i)
                    .append( $('<p>'+ dataTime +'</p>') )
                    .append('</div>')
                )
                .append('</div>')
            )
            .append('</div>')
        )
    } 

//************************************************************************************
// Functions to control the accessibility services available
//************************************************************************************

    function addAccesIcon(id, title, imgsrc) 
    {
        $("#content_access")
        .append(
            $('<img>')
            .attr('title', title)
            .attr('src', imgsrc)
            .attr('alt', id)
            .append('</img>')
        )
    } 

    function createAccesIcons(id)
    {
        if ( list_contents[id].acces ) {
            if ( list_contents[id].acces[0].ST ) addAccesIcon( 'ST', 'Subtitles', './portal/img/150ppp/st_off.png' );
            if ( list_contents[id].acces[0].SL ) addAccesIcon( 'SL', 'Sign language', './portal/img/150ppp/sl_off.png' ); 
            if ( list_contents[id].acces[0].AD ) addAccesIcon( 'AD', 'Audio description', './portal/img/150ppp/ad_off.png' );
            if ( list_contents[id].acces[0].AST ) addAccesIcon( 'AST', 'Audio subtitles', './portal/img/150ppp/ast_off.png' ); 
        }
    }

//************************************************************************************
// Functions to control the settings menus
//************************************************************************************

    // Funtion to show the poster and the selected content description
    function selectContent(id)
    {
        localStorage.ImAc_init = id;

        if ( document.getElementById( 'content' + id ).children[0].classList.contains('enabled') ) 
        {
            launchPlayer( id );
        }
        else 
        {
            document.getElementById( 'content_title' ).innerHTML = list_contents[id].name;
            document.getElementById( 'content_access' ).innerHTML = "";

            createAccesIcons( id );

            document.getElementById( 'content_desc' ).innerHTML = list_contents[id].descriptionArray[0][ _ImAc_default.mainlanguage ] || "";
            document.getElementById( 'content_lang' ).innerHTML = "Audio: " + list_contents[id].language || "";
            document.getElementById( 'content_poster' ).src = list_contents[id].poster || "./portal/img/u25_c.png";

            clearBorders();

            document.getElementById( 'content' + id ).children[0].className += " enabled";
            document.getElementById( 'contentplay' + id ).className += " enabled";
            document.getElementById( 'contentduration' + id ).className += " enabled";
            document.getElementById( 'play_poster_btn' ).className += " enabled";

            window.scrollTo( 0, 0 );
        }
    }

    function clearBorders()
    {
        document.getElementById( 'play_poster_btn' ).classList.remove("enabled");

        for (var i = 0; i < list_contents.length; i++) 
        {
            if(document.getElementById( 'content' + i )) document.getElementById( 'content' + i ).children[0].classList.remove("enabled");
            if(document.getElementById( 'contentplay' + i )) document.getElementById( 'contentplay' + i ).classList.remove("enabled");
            if(document.getElementById( 'contentduration' + i )) document.getElementById( 'contentduration' + i ).classList.remove("enabled");
        }
    }

    function clearSelectedLvl2(id, n, l)
    {
        for (var i = 0; i < l; i++) 
        {
            if ( n != i && document.getElementById( 'lvl2option' + id + i )) document.getElementById( 'lvl2option' + id + i ).classList.remove("enabled");
        }
    }

    function backSettingsMenu2(id)
    {
        clearMenuLvl3( id );
        clearSelectedLvl2( id, 6, 5 );
        document.getElementById( 'u113' ).style.visibility = 'hidden';
        document.getElementById( 'u113_options' + id ).style.visibility = 'hidden'; 
        document.getElementById( 'u112' ).style.visibility = '';
        document.getElementById( 'u112_options' ).style.visibility = ''; 
    }

    function openSettingsMenu2(id) 
    {
        document.getElementById( 'u113' ).style.visibility = '';
        document.getElementById( 'u113_options' + id ).style.visibility = ''; 
        document.getElementById( 'u112' ).style.visibility = 'hidden';
        document.getElementById( 'u112_options' ).style.visibility = 'hidden';  

        openFirstOption( id );  
    }

    function closeSettingsMenu2(id)
    {
        clearMenuLvl3( id );
        clearSelectedLvl2( id, 6, 5 );
        closeSettingsMenus();
        document.getElementById( 'u113' ).style.visibility = 'hidden';
        document.getElementById( 'u113_options' + id ).style.visibility = 'hidden'; 
    }

    function settingsFunc()
    {
        closeSettingsMenus();
        window.scrollTo( 0, 0 );

        if ( document.getElementById( 'u110' ).style.visibility == 'hidden' ) 
        {
            document.getElementById( 'u110' ).style.visibility = '';
            document.getElementById( 'u112' ).style.visibility = '';
            document.getElementById( 'u112_options' ).style.visibility = ''; 
        }
    }

    function searchFunc()
    {
        closeSettingsMenus();
        window.scrollTo( 0, 0 );

        if ( document.getElementById( 'u110' ).style.visibility == 'hidden' ) 
        {
            document.getElementById( 'u110' ).style.visibility = '';
            document.getElementById( 'u109' ).style.visibility = '';
            document.getElementById( 'u109_options' ).style.visibility = ''; 
        }
    }

    function closeSettingsMenus()
    {
        document.getElementById( 'u110' ).style.visibility = 'hidden';
        document.getElementById( 'u109' ).style.visibility = 'hidden';
        document.getElementById( 'u109_options' ).style.visibility = 'hidden'; 
        document.getElementById( 'u112' ).style.visibility = 'hidden';
        document.getElementById( 'u112_options' ).style.visibility = 'hidden'; 
        document.getElementById( 'u113' ).style.visibility = 'hidden';
        document.getElementById( 'u113_options0' ).style.visibility = 'hidden';  
        document.getElementById( 'u113_options1' ).style.visibility = 'hidden'; 
        document.getElementById( 'u113_options2' ).style.visibility = 'hidden'; 
        document.getElementById( 'u113_options3' ).style.visibility = 'hidden'; 
        document.getElementById( 'u113_options4' ).style.visibility = 'hidden';  
        document.getElementById( 'u113_options5' ).style.visibility = 'hidden'; 
    }

    function openFirstOption(id)
    {
        if ( id == 0 ) createMenuType();
        else if ( id == 1 ) createAccesLang();
        else if ( id == 2 ) createSTSize();
        else if ( id == 3 ) createSLSize();
        else if ( id == 4 ) createASTE2r();
        else if ( id == 5 ) createADMode();
    }

//************************************************************************************
// Functions to create the settings options
//************************************************************************************

    function clearMenuLvl3(id)
    {
        var myNode = document.getElementById( "settingslvl3_" + id );
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
    }

    function selectOption(id)
    {
        gtag('event', 'SelectOption', {
            'event_category' : 'PortalConfig',
            'event_label' : id
        });

        // Menu Type
        if ( id == 'btn_trad' )
        {
            _ImAc_default.menutype = 'traditional';

            document.getElementById( 'btn_trad' ).className += " enabled";
            document.getElementById( 'btn_ls' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.menutype.trad.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.menutype.trad[ _ImAc_default.mainlanguage ];     
        }
        else if ( id == 'btn_ls' )
        {
            _ImAc_default.menutype = 'ls';

            document.getElementById( 'btn_ls' ).className += " enabled";
            document.getElementById( 'btn_trad' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.menutype.ls.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.menutype.ls[ _ImAc_default.mainlanguage ];
        }
        // Pointer size
        else if ( id == 'btn_pointer_S' )
        {
            _ImAc_default.pointersize = 'S';

            document.getElementById( 'btn_pointer_S' ).className += " enabled";
            document.getElementById( 'btn_pointer_M' ).classList.remove("enabled");
            document.getElementById( 'btn_pointer_L' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.pointersize.S.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.pointersize.S[ _ImAc_default.mainlanguage ];    
        }
        else if ( id == 'btn_pointer_M' )
        {
            _ImAc_default.pointersize = 'M';

            document.getElementById( 'btn_pointer_M' ).className += " enabled";
            document.getElementById( 'btn_pointer_S' ).classList.remove("enabled");
            document.getElementById( 'btn_pointer_L' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.pointersize.M.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.pointersize.M[ _ImAc_default.mainlanguage ];
        }
        else if ( id == 'btn_pointer_L' )
        {
            _ImAc_default.pointersize = 'L';

            document.getElementById( 'btn_pointer_L' ).className += " enabled";
            document.getElementById( 'btn_pointer_S' ).classList.remove("enabled");
            document.getElementById( 'btn_pointer_M' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.pointersize.L.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.pointersize.L[ _ImAc_default.mainlanguage ];
        }
        // Voice control
        else if ( id == 'btn_voice_on' )
        {
            _ImAc_default.voicecontrol = 'on';
            localStorage.ImAc_voiceControl = 'on';

            showUserProfileBox();

            document.getElementById( 'btn_voice_on' ).className += " enabled";
            document.getElementById( 'btn_voice_off' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.voicecontrol.on.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.voicecontrol.on[ _ImAc_default.mainlanguage ];
        }
        else if ( id == 'btn_voice_off' )
        {
            _ImAc_default.voicecontrol = 'off';
            localStorage.ImAc_voiceControl = 'off';

            disconnectVoiceControl();

            document.getElementById( 'btn_voice_off' ).className += " enabled";
            document.getElementById( 'btn_voice_on' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.voicecontrol.off.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.voicecontrol.off[ _ImAc_default.mainlanguage ];
        }
        // User profile
        else if ( id == 'btn_user_save' )
        {
            _ImAc_default.userprofile = 'save';

            document.cookie = "ImAcProfileConfig=" + encodeURIComponent( JSON.stringify( _ImAc_default ) ) + "; max-age=2592000;";

            document.getElementById( 'btn_user_save' ).className += " enabled";
            document.getElementById( 'btn_user_del' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.userprofile.save.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.userprofile.save[ _ImAc_default.mainlanguage ];
        }
        else if ( id == 'btn_user_del' )
        {
            _ImAc_default.userprofile = 'del';

            document.cookie = "ImAcProfileConfig" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            if ( _confMemory ) _ImAc_default = _confMemory;

            document.getElementById( 'btn_user_del' ).className += " enabled";
            document.getElementById( 'btn_user_save' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.userprofile.del.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.userprofile.del[ _ImAc_default.mainlanguage ];
        }
        // Accessibility language
        else if ( id == 'btn_lang_en' )
        {
            _ImAc_default.accesslanguage = 'en';

            document.getElementById( 'btn_lang_en' ).className += " enabled";
            document.getElementById( 'btn_lang_es' ).classList.remove("enabled");
            document.getElementById( 'btn_lang_de' ).classList.remove("enabled");
            document.getElementById( 'btn_lang_ca' ).classList.remove("enabled");
        }
        else if ( id == 'btn_lang_es' )
        {
            _ImAc_default.accesslanguage = 'es';

            document.getElementById( 'btn_lang_es' ).className += " enabled";
            document.getElementById( 'btn_lang_en' ).classList.remove("enabled");
            document.getElementById( 'btn_lang_de' ).classList.remove("enabled");
            document.getElementById( 'btn_lang_ca' ).classList.remove("enabled");
        }
        else if ( id == 'btn_lang_de' )
        {
            _ImAc_default.accesslanguage = 'de';

            document.getElementById( 'btn_lang_de' ).className += " enabled";
            document.getElementById( 'btn_lang_en' ).classList.remove("enabled");
            document.getElementById( 'btn_lang_es' ).classList.remove("enabled");
            document.getElementById( 'btn_lang_ca' ).classList.remove("enabled");
        }
        else if ( id == 'btn_lang_ca' )
        {
            _ImAc_default.accesslanguage = 'ca';

            document.getElementById( 'btn_lang_ca' ).className += " enabled";
            document.getElementById( 'btn_lang_en' ).classList.remove("enabled");
            document.getElementById( 'btn_lang_es' ).classList.remove("enabled");
            document.getElementById( 'btn_lang_de' ).classList.remove("enabled");
        }
        // Indicator
        else if ( id == 'btn_ind_radar' )
        {
            _ImAc_default.indicator = 'radar';

            document.getElementById( 'btn_ind_radar' ).className += " enabled";
            document.getElementById( 'btn_ind_arrow' ).classList.remove("enabled");
            document.getElementById( 'btn_ind_none' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.indicator.radar.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.indicator.radar[ _ImAc_default.mainlanguage ];
        }
        else if ( id == 'btn_ind_arrow' )
        {
            _ImAc_default.indicator = 'arrow';

            document.getElementById( 'btn_ind_arrow' ).className += " enabled";
            document.getElementById( 'btn_ind_radar' ).classList.remove("enabled");
            document.getElementById( 'btn_ind_none' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.indicator.arrow.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.indicator.arrow[ _ImAc_default.mainlanguage ];
        }
        else if ( id == 'btn_ind_none' )
        {
            _ImAc_default.indicator = 'none';

            document.getElementById( 'btn_ind_none' ).className += " enabled";
            document.getElementById( 'btn_ind_radar' ).classList.remove("enabled");
            document.getElementById( 'btn_ind_arrow' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.indicator.none.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.indicator.none[ _ImAc_default.mainlanguage ];
        }
        // Safe Area
        else if ( id == 'btn_safearea_S' )
        {
            _ImAc_default.safearea = 'S';

            document.getElementById( 'btn_safearea_S' ).className += " enabled";
            document.getElementById( 'btn_safearea_M' ).classList.remove("enabled");
            document.getElementById( 'btn_safearea_L' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.safearea.S.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.safearea.S[ _ImAc_default.mainlanguage ];
        }
        else if ( id == 'btn_safearea_M' )
        {
            _ImAc_default.safearea = 'M';

            document.getElementById( 'btn_safearea_M' ).className += " enabled";
            document.getElementById( 'btn_safearea_S' ).classList.remove("enabled");
            document.getElementById( 'btn_safearea_L' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.safearea.M.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.safearea.M[ _ImAc_default.mainlanguage ];
        }
        else if ( id == 'btn_safearea_L' )
        {
            _ImAc_default.safearea = 'L';

            document.getElementById( 'btn_safearea_L' ).className += " enabled";
            document.getElementById( 'btn_safearea_S' ).classList.remove("enabled");
            document.getElementById( 'btn_safearea_M' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.safearea.L.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.safearea.L[ _ImAc_default.mainlanguage ];
        }
        // ST Size
        else if ( id == 'btn_stsize_S' )
        {
            _ImAc_default.stsize = 'S';

            document.getElementById( 'btn_stsize_S' ).className += " enabled";
            document.getElementById( 'btn_stsize_M' ).classList.remove("enabled");
            document.getElementById( 'btn_stsize_L' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.stsize.S.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.stsize.S[ _ImAc_default.mainlanguage ];
        }
        else if ( id == 'btn_stsize_M' )
        {
            _ImAc_default.stsize = 'M';

            document.getElementById( 'btn_stsize_M' ).className += " enabled";
            document.getElementById( 'btn_stsize_S' ).classList.remove("enabled");
            document.getElementById( 'btn_stsize_L' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.stsize.M.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.stsize.M[ _ImAc_default.mainlanguage ];
        }
        else if ( id == 'btn_stsize_L' )
        {
            _ImAc_default.stsize = 'L';

            document.getElementById( 'btn_stsize_L' ).className += " enabled";
            document.getElementById( 'btn_stsize_M' ).classList.remove("enabled");
            document.getElementById( 'btn_stsize_S' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.stsize.L.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.stsize.L[ _ImAc_default.mainlanguage ];
        }
        // ST Background
        else if ( id == 'btn_st_outline' )
        {
            _ImAc_default.stbackground = 'outline';

            document.getElementById( 'btn_st_outline' ).className += " enabled";
            document.getElementById( 'btn_st_box' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.stbackground.outline.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.stbackground.outline[ _ImAc_default.mainlanguage ];
        }
        else if ( id == 'btn_st_box' )
        {
            _ImAc_default.stbackground = 'box';

            document.getElementById( 'btn_st_box' ).className += " enabled";
            document.getElementById( 'btn_st_outline' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.stbackground.box.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.stbackground.box[ _ImAc_default.mainlanguage ];
        }
        // ST Position
        else if ( id == 'btn_stpos_up' )
        {
            _ImAc_default.stposition = 'up';

            document.getElementById( 'btn_stpos_up' ).className += " enabled";
            document.getElementById( 'btn_stpos_down' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.stposition.up.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.stposition.up[ _ImAc_default.mainlanguage ];
        }
        else if ( id == 'btn_stpos_down' )
        {
            _ImAc_default.stposition = 'down';

            document.getElementById( 'btn_stpos_down' ).className += " enabled";
            document.getElementById( 'btn_stpos_up' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.stposition.down.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.stposition.down[ _ImAc_default.mainlanguage ];
        }
        // ST Easy to Read
        else if ( id == 'btn_ste2r_on' )
        {
            _ImAc_default.ste2r = 'on';

            document.getElementById( 'btn_ste2r_on' ).className += " enabled";
            document.getElementById( 'btn_ste2r_off' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.ste2r.on.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.ste2r.on[ _ImAc_default.mainlanguage ];
        }
        else if ( id == 'btn_ste2r_off' )
        {
            _ImAc_default.ste2r = 'off';

            document.getElementById( 'btn_ste2r_off' ).className += " enabled";
            document.getElementById( 'btn_ste2r_on' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.ste2r.off.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.ste2r.off[ _ImAc_default.mainlanguage ];
        }
        // SL Size
        else if ( id == 'btn_slsize_S' )
        {
            _ImAc_default.slsize = 'S';

            document.getElementById( 'btn_slsize_S' ).className += " enabled";
            document.getElementById( 'btn_slsize_M' ).classList.remove("enabled");
            document.getElementById( 'btn_slsize_L' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.slsize.S.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.slsize.S[ _ImAc_default.mainlanguage ];
        }
        else if ( id == 'btn_slsize_M' )
        {
            _ImAc_default.slsize = 'M';

            document.getElementById( 'btn_slsize_M' ).className += " enabled";
            document.getElementById( 'btn_slsize_S' ).classList.remove("enabled");
            document.getElementById( 'btn_slsize_L' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.slsize.M.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.slsize.M[ _ImAc_default.mainlanguage ];
        }
        else if ( id == 'btn_slsize_L' )
        {
            _ImAc_default.slsize = 'L';

            document.getElementById( 'btn_slsize_L' ).className += " enabled";
            document.getElementById( 'btn_slsize_M' ).classList.remove("enabled");
            document.getElementById( 'btn_slsize_S' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.slsize.L.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.slsize.L[ _ImAc_default.mainlanguage ];
        }
        // SL Position
        else if ( id == 'btn_slpos_left' )
        {
            _ImAc_default.slposition = 'left';

            document.getElementById( 'btn_slpos_left' ).className += " enabled";
            document.getElementById( 'btn_slpos_right' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.slposition.left.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.slposition.left[ _ImAc_default.mainlanguage ];
        }
        else if ( id == 'btn_slpos_right' )
        {
            _ImAc_default.slposition = 'right';

            document.getElementById( 'btn_slpos_right' ).className += " enabled";
            document.getElementById( 'btn_slpos_left' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.slposition.right.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.slposition.right[ _ImAc_default.mainlanguage ];
        }
        // AST Easy to Read
        else if ( id == 'btn_aste2r_on' )
        {
            _ImAc_default.aste2r = 'on';

            document.getElementById( 'btn_aste2r_on' ).className += " enabled";
            document.getElementById( 'btn_aste2r_off' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.aste2r.on.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.aste2r.on[ _ImAc_default.mainlanguage ];
        }
        else if ( id == 'btn_aste2r_off' )
        {
            _ImAc_default.aste2r = 'off';

            document.getElementById( 'btn_aste2r_off' ).className += " enabled";
            document.getElementById( 'btn_aste2r_on' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.aste2r.off.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.aste2r.off[ _ImAc_default.mainlanguage ];
        }
        // AST Presentation Mode
        else if ( id == 'btn_ast_god' )
        {
            _ImAc_default.astmode = 'god';

            document.getElementById( 'btn_ast_god' ).className += " enabled";
            document.getElementById( 'btn_ast_dynamic' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.astmode.god.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.astmode.god[ _ImAc_default.mainlanguage ];
        }
        else if ( id == 'btn_ast_dynamic' )
        {
            _ImAc_default.astmode = 'dynamic';

            document.getElementById( 'btn_ast_dynamic' ).className += " enabled";
            document.getElementById( 'btn_ast_god' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.astmode.dynamic.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.astmode.dynamic[ _ImAc_default.mainlanguage ];
        }
        // AST Volume
        else if ( id == 'btn_ast_min' )
        {
            _ImAc_default.astvolume = 'min';

            document.getElementById( 'btn_ast_min' ).className += " enabled";
            document.getElementById( 'btn_ast_mid' ).classList.remove("enabled");
            document.getElementById( 'btn_ast_max' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.astvolume.min.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.astvolume.min[ _ImAc_default.mainlanguage ];
        }
        else if ( id == 'btn_ast_mid' )
        {
            _ImAc_default.astvolume = 'mid';

            document.getElementById( 'btn_ast_mid' ).className += " enabled";
            document.getElementById( 'btn_ast_min' ).classList.remove("enabled");
            document.getElementById( 'btn_ast_max' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.astvolume.mid.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.astvolume.mid[ _ImAc_default.mainlanguage ];
        }
        else if ( id == 'btn_ast_max' )
        {
            _ImAc_default.astvolume = 'max';

            document.getElementById( 'btn_ast_max' ).className += " enabled";
            document.getElementById( 'btn_ast_min' ).classList.remove("enabled");
            document.getElementById( 'btn_ast_mid' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.astvolume.max.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.astvolume.max[ _ImAc_default.mainlanguage ];
        }
        // AD Presentation Mode
        else if ( id == 'btn_ad_god' )
        {
            _ImAc_default.admode = 'god';

            document.getElementById( 'btn_ad_god' ).className += " enabled";
            document.getElementById( 'btn_ad_friend' ).classList.remove("enabled");
            document.getElementById( 'btn_ad_dynamic' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.admode.god.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.admode.god[ _ImAc_default.mainlanguage ];
        }
        else if ( id == 'btn_ad_friend' )
        {
            _ImAc_default.admode = 'friend';

            document.getElementById( 'btn_ad_friend' ).className += " enabled";
            document.getElementById( 'btn_ad_god' ).classList.remove("enabled");
            document.getElementById( 'btn_ad_dynamic' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.admode.friend.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.admode.friend[ _ImAc_default.mainlanguage ];
        }
        else if ( id == 'btn_ad_dynamic' )
        {
            _ImAc_default.admode = 'dynamic';

            document.getElementById( 'btn_ad_dynamic' ).className += " enabled";
            document.getElementById( 'btn_ad_god' ).classList.remove("enabled");
            document.getElementById( 'btn_ad_friend' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.admode.dynamic.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.admode.dynamic[ _ImAc_default.mainlanguage ];
        }
        // AD Volume
        else if ( id == 'btn_ad_min' )
        {
            _ImAc_default.advolume = 'min';

            document.getElementById( 'btn_ad_min' ).className += " enabled";
            document.getElementById( 'btn_ad_mid' ).classList.remove("enabled");
            document.getElementById( 'btn_ad_max' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.advolume.min.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.advolume.min[ _ImAc_default.mainlanguage ];
        }
        else if ( id == 'btn_ad_mid' )
        {
            _ImAc_default.advolume = 'mid';

            document.getElementById( 'btn_ad_mid' ).className += " enabled";
            document.getElementById( 'btn_ad_min' ).classList.remove("enabled");
            document.getElementById( 'btn_ad_max' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.advolume.mid.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.advolume.mid[ _ImAc_default.mainlanguage ];
        }
        else if ( id == 'btn_ad_max' )
        {
            _ImAc_default.advolume = 'max';

            document.getElementById( 'btn_ad_max' ).className += " enabled";
            document.getElementById( 'btn_ad_min' ).classList.remove("enabled");
            document.getElementById( 'btn_ad_mid' ).classList.remove("enabled");
            document.getElementById( 'img_MenuDesc' ).src = _ImAcMeta.advolume.max.img;
            document.getElementById( 'text_Desc' ).innerHTML = _ImAcMeta.advolume.max[ _ImAc_default.mainlanguage ];
        }
    }

//************************************************************************************
// General Settings Options
//************************************************************************************

    function createMenuType()
    {
        clearMenuLvl3(0);
        clearSelectedLvl2(0,0,4);
        document.getElementById( 'lvl2option00' ).className += " enabled";

        var index = ( _ImAc_default.menutype == 'traditional' ) ? 'trad' : 'ls';

        var img = _ImAcMeta.menutype[index].img;
        var text = _ImAcMeta.menutype[index][ _ImAc_default.mainlanguage ];


        $("#settingslvl3_0")
        .append(
            $('<div class="container-12 Settings-detail">')
            .append(
                $('<img id="img_MenuDesc" src="' + img + '" tabindex="0" alt="">')
            )
            .append('</div>')
        )
        .append(
            $('<div class="container-12">')
            .append(
                $('<div id="btn_trad" class="container-6 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.traditional[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append(
                $('<div id="btn_ls" class="container-6 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.ls[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append('</div>')
        )
        .append(
            $('<div class="container-12 Settings-desc">')
            .append(
                $('<p id="text_Desc">')
                .append( text )
                .append('</p>')
            )
            .append('</div>')
        )

        if ( _ImAc_default.menutype == 'traditional' )
        {
            document.getElementById( 'btn_trad' ).className += " enabled";
        }
        else 
        {
            document.getElementById( 'btn_ls' ).className += " enabled";
        }
    }

    function createPointerSize()
    {
        clearMenuLvl3(0);
        clearSelectedLvl2(0,1,4);
        document.getElementById( 'lvl2option01' ).className += " enabled";

        var img = _ImAcMeta.pointersize[ _ImAc_default.pointersize ].img;
        var text = _ImAcMeta.pointersize[ _ImAc_default.pointersize ][ _ImAc_default.mainlanguage ];


        $("#settingslvl3_0")
        .append(
            $('<div class="container-12 Settings-detail">')
            .append(
                $('<img id="img_MenuDesc" src="' + img + '" tabindex="0" alt="">')
            )
            .append('</div>')
        )
        .append(
            $('<div class="container-12">')
            .append(
                $('<div id="btn_pointer_S" class="container-4 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.small2[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append(
                $('<div id="btn_pointer_M" class="container-4 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.medium2[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append(
                $('<div id="btn_pointer_L" class="container-4 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.big[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append('</div>')
        )
        .append(
            $('<div class="container-12 Settings-desc">')
            .append(
                $('<p id="text_Desc">')
                .append( text )
                .append('</p>')
            )
            .append('</div>')
        )

        if ( _ImAc_default.pointersize == 'S' )
        {
            document.getElementById( 'btn_pointer_S' ).className += " enabled";
        }
        else if ( _ImAc_default.pointersize == 'M' )
        {
            document.getElementById( 'btn_pointer_M' ).className += " enabled";
        }
        else 
        {
            document.getElementById( 'btn_pointer_L' ).className += " enabled";
        }
    }

    function createVoiceControl()
    {
        clearMenuLvl3(0);
        clearSelectedLvl2(0,2,4);
        document.getElementById( 'lvl2option02' ).className += " enabled";

        var img = _ImAcMeta.voicecontrol[ _ImAc_default.voicecontrol ].img;
        var text = _ImAcMeta.voicecontrol[ _ImAc_default.voicecontrol ][ _ImAc_default.mainlanguage ];

        $("#settingslvl3_0")
        .append(
            $('<div class="container-12 Settings-detail">')
            .append(
                $('<img id="img_MenuDesc" src="' + img + '" tabindex="0" alt="">')
            )
            .append('</div>')
        )
        .append(
            $('<div class="container-12">')
            .append(
                $('<div id="btn_voice_on" class="container-6 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.on[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append(
                $('<div id="btn_voice_off" class="container-6 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.off[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append('</div>')
        )
        .append(
            $('<div class="container-12 Settings-desc">')
            .append(
                $('<p id="text_Desc">')
                .append( text )
                .append('</p>')
            )
            .append('</div>')
        )

        if ( _ImAc_default.voicecontrol == 'on' )
        {
            document.getElementById( 'btn_voice_on' ).className += " enabled";
        }
        else 
        {
            document.getElementById( 'btn_voice_off' ).className += " enabled";
        }
    }

    function createUserProfile()
    {
        clearMenuLvl3(0);
        clearSelectedLvl2(0,3,4);
        document.getElementById( 'lvl2option03' ).className += " enabled";

        var img = _ImAcMeta.userprofile[ _ImAc_default.userprofile ].img;
        var text = _ImAcMeta.userprofile[ _ImAc_default.userprofile ][ _ImAc_default.mainlanguage ];

        $("#settingslvl3_0")
        .append(
            $('<div class="container-12 Settings-detail">')
            .append(
                $('<img id="img_MenuDesc" src="' + img + '" tabindex="0" alt="">')
            )
            .append('</div>')
        )
        .append(
            $('<div class="container-12">')
            .append(
                $('<div id="btn_user_save" class="container-6 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.save[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append(
                $('<div id="btn_user_del" class="container-6 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.del[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append('</div>')
        )
        .append(
            $('<div class="container-12 Settings-desc">')
            .append(
                $('<p id="text_Desc">')
                .append( text )
                .append('</p>')
            )
            .append('</div>')
        )

        if ( _ImAc_default.userprofile == 'save' )
        {
            document.getElementById( 'btn_user_save' ).className += " enabled";
        }
        else 
        {
            document.getElementById( 'btn_user_del' ).className += " enabled";
        }
    }

//************************************************************************************
// Access Settings Options
//************************************************************************************

    function createAccesLang()
    {
        clearMenuLvl3(1);
        clearSelectedLvl2(1,0,3);
        document.getElementById( 'lvl2option10' ).className += " enabled";

        var text = _ImAcMeta.accesslanguage[ _ImAc_default.mainlanguage ];


        $("#settingslvl3_1")
        .append(
            $('<div class="container-12">')
            .append(
                $('<div id="btn_lang_en" class="container-12 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>English</p>') )
                .append('</div>')
            )
            .append(
                $('<div id="btn_lang_es" class="container-12 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>Español</p>') )
                .append('</div>')
            )
            .append(
                $('<div id="btn_lang_de" class="container-12 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>Deutsch</p>') )
                .append('</div>')
            )
            .append(
                $('<div id="btn_lang_ca" class="container-12 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>Català</p>') )
                .append('</div>')
            )
            .append('</div>')
        )
        .append(
            $('<div class="container-12 Settings-desc">')
            .append(
                $('</br><p id="text_Desc">')
                .append( text )
                .append('</p>')
            )
            .append('</div>')
        )

        if ( _ImAc_default.accesslanguage == 'en' )
        {
            document.getElementById( 'btn_lang_en' ).className += " enabled";
        }
        else if ( _ImAc_default.accesslanguage == 'es' )
        {
            document.getElementById( 'btn_lang_es' ).className += " enabled";
        }
        else if ( _ImAc_default.accesslanguage == 'de' )
        {
            document.getElementById( 'btn_lang_de' ).className += " enabled";
        }
        else 
        {
            document.getElementById( 'btn_lang_ca' ).className += " enabled";
        }

    }

    function createIndicator()
    {
        clearMenuLvl3(1);
        clearSelectedLvl2(1,1,3);
        document.getElementById( 'lvl2option11' ).className += " enabled";

        var img = _ImAcMeta.indicator[ _ImAc_default.indicator ].img;
        var text = _ImAcMeta.indicator[ _ImAc_default.indicator ][ _ImAc_default.mainlanguage ];


        $("#settingslvl3_1")
        .append(
            $('<div class="container-12 Settings-detail">')
            .append(
                $('<img id="img_MenuDesc" src="' + img + '" tabindex="0" alt="">')
            )
            .append('</div>')
        )
        .append(
            $('<div class="container-12">')
            .append(
                $('<div id="btn_ind_radar" class="container-4 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.radar[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append(
                $('<div id="btn_ind_arrow" class="container-4 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.arrow[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append(
                $('<div id="btn_ind_none" class="container-4 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.none[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append('</div>')
        )
        .append(
            $('<div class="container-12 Settings-desc">')
            .append(
                $('<p id="text_Desc">')
                .append( text )
                .append('</p>')
            )
            .append('</div>')
        )

        if ( _ImAc_default.indicator == 'radar' )
        {
            document.getElementById( 'btn_ind_radar' ).className += " enabled";
        }
        else if ( _ImAc_default.indicator == 'arror' )
        {
            document.getElementById( 'btn_ind_arrow' ).className += " enabled";
        }
        else 
        {
            document.getElementById( 'btn_ind_none' ).className += " enabled";
        }
    }

    function createSafeArea()
    {
        clearMenuLvl3(1);
        clearSelectedLvl2(1,2,3);
        document.getElementById( 'lvl2option12' ).className += " enabled";

        var img = _ImAcMeta.safearea[ _ImAc_default.safearea ].img;
        var text = _ImAcMeta.safearea[ _ImAc_default.safearea ][ _ImAc_default.mainlanguage ];


        $("#settingslvl3_1")
        .append(
            $('<div class="container-12 Settings-detail">')
            .append(
                $('<img id="img_MenuDesc" src="' + img + '" tabindex="0" alt="">')
            )
            .append('</div>')
        )
        .append(
            $('<div class="container-12">')
            .append(
                $('<div id="btn_safearea_S" class="container-4 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.small2[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append(
                $('<div id="btn_safearea_M" class="container-4 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.medium2[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append(
                $('<div id="btn_safearea_L" class="container-4 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.large[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append('</div>')
        )
        .append(
            $('<div class="container-12 Settings-desc">')
            .append(
                $('<p id="text_Desc">')
                .append( text )
                .append('</p>')
            )
            .append('</div>')
        )

        if ( _ImAc_default.safearea == 'S' )
        {
            document.getElementById( 'btn_safearea_S' ).className += " enabled";
        }
        else if ( _ImAc_default.safearea == 'M' )
        {
            document.getElementById( 'btn_safearea_M' ).className += " enabled";
        }
        else 
        {
            document.getElementById( 'btn_safearea_L' ).className += " enabled";
        }
    }

//************************************************************************************
// ST Settings Options
//************************************************************************************

    function createSTSize()
    {
        clearMenuLvl3(2);
        clearSelectedLvl2(2,0,4);
        document.getElementById( 'lvl2option20' ).className += " enabled";

        var img = _ImAcMeta.stsize[ _ImAc_default.stsize ].img;
        var text = _ImAcMeta.stsize[ _ImAc_default.stsize ][ _ImAc_default.mainlanguage ];


        $("#settingslvl3_2")
        .append(
            $('<div class="container-12 Settings-detail">')
            .append(
                $('<img id="img_MenuDesc" src="' + img + '" tabindex="0" alt="">')
            )
            .append('</div>')
        )
        .append(
            $('<div class="container-12">')
            .append(
                $('<div id="btn_stsize_S" class="container-4 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.small2[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append(
                $('<div id="btn_stsize_M" class="container-4 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.medium2[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append(
                $('<div id="btn_stsize_L" class="container-4 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.large[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append('</div>')
        )
        .append(
            $('<div class="container-12 Settings-desc">')
            .append(
                $('<p id="text_Desc">')
                .append( text )
                .append('</p>')
            )
            .append('</div>')
        )

        if ( _ImAc_default.stsize == 'S' )
        {
            document.getElementById( 'btn_stsize_S' ).className += " enabled";
        }
        else if ( _ImAc_default.stsize == 'M' )
        {
            document.getElementById( 'btn_stsize_M' ).className += " enabled";
        }
        else 
        {
            document.getElementById( 'btn_stsize_L' ).className += " enabled";
        }
    }

    function createSTBackground()
    {
        clearMenuLvl3(2);
        clearSelectedLvl2(2,1,4);
        document.getElementById( 'lvl2option21' ).className += " enabled";

        var img = _ImAcMeta.stbackground[ _ImAc_default.stbackground ].img;
        var text = _ImAcMeta.stbackground[ _ImAc_default.stbackground ][ _ImAc_default.mainlanguage ];

        $("#settingslvl3_2")
        .append(
            $('<div class="container-12 Settings-detail">')
            .append(
                $('<img id="img_MenuDesc" src="' + img + '" tabindex="0" alt="">')
            )
            .append('</div>')
        )
        .append(
            $('<div class="container-12">')
            .append(
                $('<div id="btn_st_outline" class="container-6 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.outline[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append(
                $('<div id="btn_st_box" class="container-6 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.box[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
        )
        .append(
            $('<div class="container-12 Settings-desc">')
            .append(
                $('<p id="text_Desc">')
                .append( text )
                .append('</p>')
            )
            .append('</div>')
        )

        if ( _ImAc_default.stbackground == 'outline' )
        {
            document.getElementById( 'btn_st_outline' ).className += " enabled";
        }
        else 
        {
            document.getElementById( 'btn_st_box' ).className += " enabled";
        }
    }

    function createSTPosition()
    {
        clearMenuLvl3(2);
        clearSelectedLvl2(2,2,4);
        document.getElementById( 'lvl2option22' ).className += " enabled";

        var img = _ImAcMeta.stposition[ _ImAc_default.stposition ].img;
        var text = _ImAcMeta.stposition[ _ImAc_default.stposition ][ _ImAc_default.mainlanguage ];

        $("#settingslvl3_2")
        .append(
            $('<div class="container-12 Settings-detail">')
            .append(
                $('<img id="img_MenuDesc" src="' + img + '" tabindex="0" alt="">')
            )
            .append('</div>')
        )
        .append(
            $('<div class="container-12">')
            .append(
                $('<div id="btn_stpos_up" class="container-6 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.top[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append(
                $('<div id="btn_stpos_down" class="container-6 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.bottom[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
        )
        .append(
            $('<div class="container-12 Settings-desc">')
            .append(
                $('<p id="text_Desc">')
                .append( text )
                .append('</p>')
            )
            .append('</div>')
        )

        if ( _ImAc_default.stposition == 'up' )
        {
            document.getElementById( 'btn_stpos_up' ).className += " enabled";
        }
        else 
        {
            document.getElementById( 'btn_stpos_down' ).className += " enabled";
        }
    }

    function createSTE2r()
    {
        clearMenuLvl3(2);
        clearSelectedLvl2(2,3,4);
        document.getElementById( 'lvl2option23' ).className += " enabled";

        var img = _ImAcMeta.ste2r[ _ImAc_default.ste2r ].img;
        var text = _ImAcMeta.ste2r[ _ImAc_default.ste2r ][ _ImAc_default.mainlanguage ];

        $("#settingslvl3_2")
        .append(
            $('<div class="container-12 Settings-detail">')
            .append(
                $('<img id="img_MenuDesc" src="' + img + '" tabindex="0" alt="">')
            )
            .append('</div>')
        )
        .append(
            $('<div class="container-12">')
            .append(
                $('<div id="btn_ste2r_on" class="container-6 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.on[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append(
                $('<div id="btn_ste2r_off" class="container-6 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.off[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
        )
        .append(
            $('<div class="container-12 Settings-desc">')
            .append(
                $('<p id="text_Desc">')
                .append( text )
                .append('</p>')
            )
            .append('</div>')
        )

        if ( _ImAc_default.ste2r == 'on' )
        {
            document.getElementById( 'btn_ste2r_on' ).className += " enabled";
        }
        else 
        {
            document.getElementById( 'btn_ste2r_off' ).className += " enabled";
        }
    }

//************************************************************************************
// SL Settings Options
//************************************************************************************

    function createSLSize()
    {
        clearMenuLvl3(3);
        clearSelectedLvl2(3,0,2);
        document.getElementById( 'lvl2option30' ).className += " enabled";

        var img = _ImAcMeta.slsize[ _ImAc_default.slsize ].img;
        var text = _ImAcMeta.slsize[ _ImAc_default.slsize ][ _ImAc_default.mainlanguage ];

        $("#settingslvl3_3")
        .append(
            $('<div class="container-12 Settings-detail">')
            .append(
                $('<img id="img_MenuDesc" src="' + img + '" tabindex="0" alt="">')
            )
            .append('</div>')
        )
        .append(
            $('<div class="container-12">')
            .append(
                $('<div id="btn_slsize_S" class="container-4 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.small2[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append(
                $('<div id="btn_slsize_M" class="container-4 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.medium2[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append(
                $('<div id="btn_slsize_L" class="container-4 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.large[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
        )
        .append(
            $('<div class="container-12 Settings-desc">')
            .append(
                $('<p id="text_Desc">')
                .append( text )
                .append('</p>')
            )
            .append('</div>')
        )

        if ( _ImAc_default.slsize == 'S' )
        {
            document.getElementById( 'btn_slsize_S' ).className += " enabled";
        }
        else if ( _ImAc_default.slsize == 'M' )
        {
            document.getElementById( 'btn_slsize_M' ).className += " enabled";
        }
        else 
        {
            document.getElementById( 'btn_slsize_L' ).className += " enabled";
        }
    }

    function createSLPosition()
    {
        clearMenuLvl3(3);
        clearSelectedLvl2(3,1,2);
        document.getElementById( 'lvl2option31' ).className += " enabled";

        var img = _ImAcMeta.slposition[ _ImAc_default.slposition ].img;
        var text = _ImAcMeta.slposition[ _ImAc_default.slposition ][ _ImAc_default.mainlanguage ];

        $("#settingslvl3_3")
        .append(
            $('<div class="container-12 Settings-detail">')
            .append(
                $('<img id="img_MenuDesc" src="' + img + '" tabindex="0" alt="">')
            )
            .append('</div>')
        )
        .append(
            $('<div class="container-12">')
            .append(
                $('<div id="btn_slpos_left" class="container-6 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.left[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append(
                $('<div id="btn_slpos_right" class="container-6 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.right[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
        )
        .append(
            $('<div class="container-12 Settings-desc">')
            .append(
                $('<p id="text_Desc">')
                .append( text )
                .append('</p>')
            )
            .append('</div>')
        )

        if ( _ImAc_default.slposition == 'left' )
        {
            document.getElementById( 'btn_slpos_left' ).className += " enabled";
        }
        else 
        {
            document.getElementById( 'btn_slpos_right' ).className += " enabled";
        }
    }

//************************************************************************************
// AST Settings Options
//************************************************************************************

    function createASTE2r()
    {
        clearMenuLvl3(4);
        clearSelectedLvl2(4,0,3);
        document.getElementById( 'lvl2option40' ).className += " enabled";

        var img = _ImAcMeta.aste2r[ _ImAc_default.aste2r ].img;
        var text = _ImAcMeta.aste2r[ _ImAc_default.aste2r ][ _ImAc_default.mainlanguage ];

        $("#settingslvl3_4")
        .append(
            $('<div class="container-12 Settings-detail">')
            .append(
                $('<img id="img_MenuDesc" src="' + img + '" tabindex="0" alt="">')
            )
            .append('</div>')
        )
        .append(
            $('<div class="container-12">')
            .append(
                $('<div id="btn_aste2r_on" class="container-6 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.on[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append(
                $('<div id="btn_aste2r_off" class="container-6 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.off[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
        )
        .append(
            $('<div class="container-12 Settings-desc">')
            .append(
                $('<p id="text_Desc">')
                .append( text )
                .append('</p>')
            )
            .append('</div>')
        )

        if ( _ImAc_default.aste2r == 'on' )
        {
            document.getElementById( 'btn_aste2r_on' ).className += " enabled";
        }
        else 
        {
            document.getElementById( 'btn_aste2r_off' ).className += " enabled";
        }
    }

    function createASTMode()
    {
        clearMenuLvl3(4);
        clearSelectedLvl2(4,1,3);
        document.getElementById( 'lvl2option41' ).className += " enabled";

        var img = _ImAcMeta.astmode[ _ImAc_default.astmode ].img;
        var text = _ImAcMeta.astmode[ _ImAc_default.astmode ][ _ImAc_default.mainlanguage ];

        $("#settingslvl3_4")
        .append(
            $('<div class="container-12 Settings-detail">')
            .append(
                $('<img id="img_MenuDesc" src="' + img + '" tabindex="0" alt="">')
            )
            .append('</div>')
        )
        .append(
            $('<div class="container-12">')
            .append(
                $('<div id="btn_ast_god" class="container-6 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.classic[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append(
                $('<div id="btn_ast_dynamic" class="container-6 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.dynamic[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
        )
        .append(
            $('<div class="container-12 Settings-desc">')
            .append(
                $('<p id="text_Desc">')
                .append( text )
                .append('</p>')
            )
            .append('</div>')
        )

        if ( _ImAc_default.astmode == 'god' )
        {
            document.getElementById( 'btn_ast_god' ).className += " enabled";
        }
        else 
        {
            document.getElementById( 'btn_ast_dynamic' ).className += " enabled";
        }
    }

    function createASTVolume()
    {
        clearMenuLvl3(4);
        clearSelectedLvl2(4,2,3);
        document.getElementById( 'lvl2option42' ).className += " enabled";

        var img = _ImAcMeta.astvolume[ _ImAc_default.astvolume ].img;
        var text = _ImAcMeta.astvolume[ _ImAc_default.astvolume ][ _ImAc_default.mainlanguage ];

        $("#settingslvl3_4")
        .append(
            $('<div class="container-12 Settings-detail">')
            .append(
                $('<img id="img_MenuDesc" src="' + img + '" tabindex="0" alt="">')
            )
            .append('</div>')
        )
        .append(
            $('<div class="container-12">')
            .append(
                $('<div id="btn_ast_min" class="container-4 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.minimum[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append(
                $('<div id="btn_ast_mid" class="container-4 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.middle[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append(
                $('<div id="btn_ast_max" class="container-4 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.maximum[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
        )
        .append(
            $('<div class="container-12 Settings-desc">')
            .append(
                $('<p id="text_Desc">')
                .append( text )
                .append('</p>')
            )
            .append('</div>')
        )

        if ( _ImAc_default.astvolume == 'min' )
        {
            document.getElementById( 'btn_ast_min' ).className += " enabled";
        }
        else if ( _ImAc_default.astvolume == 'mid' )
        {
            document.getElementById( 'btn_ast_mid' ).className += " enabled";
        }
        else 
        {
            document.getElementById( 'btn_ast_max' ).className += " enabled";
        }
    }

//************************************************************************************
// AD Settings Options
//************************************************************************************

    function createADMode()
    {
        clearMenuLvl3(5);
        clearSelectedLvl2(5,0,2);
        document.getElementById( 'lvl2option50' ).className += " enabled";

        var img = _ImAcMeta.admode[ _ImAc_default.admode ].img;
        var text = _ImAcMeta.admode[ _ImAc_default.admode ][ _ImAc_default.mainlanguage ];

        $("#settingslvl3_5")
        .append(
            $('<div class="container-12 Settings-detail">')
            .append(
                $('<img id="img_MenuDesc" src="' + img + '" tabindex="0" alt="">')
            )
            .append('</div>')
        )
        .append(
            $('<div class="container-12">')
            .append(
                $('<div id="btn_ad_god" class="container-4 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.classic[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append(
                $('<div id="btn_ad_friend" class="container-4 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.statics[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append(
                $('<div id="btn_ad_dynamic" class="container-4 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.dynamic[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
        )
        .append(
            $('<div class="container-12 Settings-desc">')
            .append(
                $('<p id="text_Desc">')
                .append( text )
                .append('</p>')
            )
            .append('</div>')
        )

        if ( _ImAc_default.admode == 'god' )
        {
            document.getElementById( 'btn_ad_god' ).className += " enabled";
        }
        else if ( _ImAc_default.admode == 'friend' )
        {
            document.getElementById( 'btn_ad_friend' ).className += " enabled";
        }
        else 
        {
            document.getElementById( 'btn_ad_dynamic' ).className += " enabled";
        }
    }

    function createADVolume()
    {
        clearMenuLvl3(5);
        clearSelectedLvl2(5,1,2);
        document.getElementById( 'lvl2option51' ).className += " enabled";

        var img = _ImAcMeta.advolume[ _ImAc_default.advolume ].img;
        var text = _ImAcMeta.advolume[ _ImAc_default.advolume ][ _ImAc_default.mainlanguage ];

        $("#settingslvl3_5")
        .append(
            $('<div class="container-12 Settings-detail">')
            .append(
                $('<img id="img_MenuDesc" src="' + img + '" tabindex="0" alt="">')
            )
            .append('</div>')
        )
        .append(
            $('<div class="container-12">')
            .append(
                $('<div id="btn_ad_min" class="container-4 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.minimum[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append(
                $('<div id="btn_ad_mid" class="container-4 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.middle[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
            .append(
                $('<div id="btn_ad_max" class="container-4 Settings-option2">')
                .attr('onclick', 'selectOption(this.id)')
                .append( $('<p>' + _ImAc_Buttons.maximum[ _ImAc_default.mainlanguage ] + '</p>') )
                .append('</div>')
            )
        )
        .append(
            $('<div class="container-12 Settings-desc">')
            .append(
                $('<p id="text_Desc">')
                .append( text )
                .append('</p>')
            )
            .append('</div>')
        )

        if ( _ImAc_default.advolume == 'min' )
        {
            document.getElementById( 'btn_ad_min' ).className += " enabled";
        }
        else if ( _ImAc_default.advolume == 'mid' )
        {
            document.getElementById( 'btn_ad_mid' ).className += " enabled";
        }
        else 
        {
            document.getElementById( 'btn_ad_max' ).className += " enabled";
        }
    }

//************************************************************************************
// Voice Control Functions (experimental)
//************************************************************************************

    function showUserProfileBox()
    {
        var deviceId = prompt("Please enter your device ID:", "i2CAT");
        if (deviceId == null || deviceId == "") {
            connectVoiceControl();
        } else {
            connectVoiceControl( deviceId, "http://51.89.138.157:3000/" )
        }
    }

    function connectVoiceControl( deviceId="i2CAT", ws_url="http://51.89.138.157:3000/" )
    {
        _ws_vc = io( ws_url );

        localStorage.ImAc_voiceControlId = deviceId;

        _ws_vc.on('connect', function(){
          _ws_vc.emit('setClientID', { customId:deviceId, type:'player', description:'ImAc Player' });
        });

        _ws_vc.on('command', function(msg){

            if ( msg.includes("play_") ) launchPlayer( msg.substr(5, 2) );
          
            console.log( msg );
        });
    }

    function disconnectVoiceControl()
    {
        _ws_vc.disconnect();
        _ws_vc = undefined;
    }

//************************************************************************************
// Functions to translate the web page
//************************************************************************************


    $(document).on('change','#langSelector',function(){

        _ImAc_default.mainlanguage = $(this).find("option:selected").attr('value');

        closeSettingsMenus();
        translateAll( _ImAc_default.mainlanguage )
        translateContentDesc( _ImAc_default.mainlanguage )
        

        console.log( _ImAc_default.mainlanguage );

    });

    function translateContentDesc(lang)
    {
        var id = localStorage.ImAc_init;
        if ( id && document.getElementById( 'content' + id ).children[0].classList.contains('enabled') ) 
        {
            document.getElementById( 'content_desc' ).innerHTML = list_contents[id].descriptionArray[0][ _ImAc_default.mainlanguage ] || "";
        }
        else 
        {
            if ( lang == 'ca')
            {
                document.getElementById('content_desc').innerHTML = "Gaudeix de continguts immersius amb serveis d'accessibilitat seleccionant el vídeo que vulguis visualitzar. Pots personalitzar la teva experiència mitjançant el menú Configuració, o més endavant mitjançant el menú del reproductor.";
            }
            else if ( lang == 'es')
            {
                document.getElementById('content_desc').innerHTML = 'Disfruta de contenidos inmersivos con servicios de accesibilidad seleccionando el vídeo que quieras visualizar. Puedes personalizar tu experiencia mediante el menú Ajustes, o más adelante mediante el menú del reproductor.';
            }
            else if ( lang == 'de')
            {
                document.getElementById('content_desc').innerHTML = 'Wählen Sie ein Videos aus und genießen Sie 360° Inhalte mit barrierefreien Diensten. Über die Einstellungen können Sie die Dienste anpassen bevor Sie das Video starten. Natürlich ist es auch möglich die Einstellung später direkt im Player-Menü zu verändern.';
            }
            else
            {
                document.getElementById('content_desc').innerHTML = 'Enjoy immersive contents with access services by selecting the video you want to watch. To customise your experience, go into settings or select a video and then go to the player menu.';
            }
        }
    }

    function translateAll(lang)
    {
        gtag('event', 'ChangeLanguage', {
            'event_category' : 'PortalConfig',
            'event_label' : lang
        });

        if ( lang == 'ca' )
        {
            document.getElementById('span_1').innerHTML = 'Configuració';
            document.getElementById('span_2').innerHTML = 'Cerca';
            document.getElementById('span_3').innerHTML = "Mostra/Oculta la informació &nbsp;";
            document.getElementById('span_4').innerHTML = '&nbsp;  Cerca';
            document.getElementById('span_5').innerHTML = '&nbsp;  Configuració';
            document.getElementById('span_6').innerHTML = '&nbsp;  Conf. general';
            document.getElementById('span_7').innerHTML = "&nbsp;Conf. d'accessibilitat";
            document.getElementById('span_8').innerHTML = '&nbsp;  Subtítols';
            document.getElementById('span_9').innerHTML = '&nbsp;  Llengua de signes';
            document.getElementById('span_10').innerHTML = '&nbsp;   Audiodescripció';
            document.getElementById('span_11').innerHTML = '&nbsp;   Audiosubtítols';
            document.getElementById('span_12').innerHTML = '&nbsp;  Configuració general';
            document.getElementById('span_13').innerHTML = '&nbsp;   Tipus de menú';
            document.getElementById('span_14').innerHTML = '&nbsp;   Mida del punter';
            document.getElementById('span_15').innerHTML = '&nbsp;   Control de veu';
            document.getElementById('span_16').innerHTML = "&nbsp;   Perfil d'usuari";
            document.getElementById('span_17').innerHTML = 'Tornar';
            document.getElementById('span_18').innerHTML = "&nbsp;  Configuració d'accessibilitat";
            document.getElementById('span_19').innerHTML = '&nbsp;   Idioma';
            document.getElementById('span_20').innerHTML = '&nbsp;   Indicador';
            document.getElementById('span_21').innerHTML = '&nbsp;   Àrea de visió';
            document.getElementById('span_22').innerHTML = 'Tornar';
            document.getElementById('span_23').innerHTML = '&nbsp;  Configuració de subtítols';
            document.getElementById('span_24').innerHTML = '&nbsp;   Mida';
            document.getElementById('span_25').innerHTML = '&nbsp;   Fons';
            document.getElementById('span_26').innerHTML = '&nbsp;   Posició';
            document.getElementById('span_27').innerHTML = '&nbsp;   Lectura fàcil';
            document.getElementById('span_28').innerHTML = 'Tornar';
            document.getElementById('span_29').innerHTML = '&nbsp;  Configuració de llengua de signes';
            document.getElementById('span_30').innerHTML = '&nbsp;   Mida';
            document.getElementById('span_31').innerHTML = '&nbsp;   Posició';
            document.getElementById('span_32').innerHTML = 'Tornar';
            document.getElementById('span_33').innerHTML = '&nbsp;  Configuració d’audiosubtítols';
            document.getElementById('span_34').innerHTML = '&nbsp;   Lectura fàcil';
            document.getElementById('span_35').innerHTML = '&nbsp;   Mode presentació';
            document.getElementById('span_36').innerHTML = '&nbsp;   Volum';
            document.getElementById('span_37').innerHTML = 'Tornar';
            document.getElementById('span_38').innerHTML = '&nbsp;  Configuració d’audiodescripció';
            document.getElementById('span_39').innerHTML = '&nbsp;   Mode presentació';
            document.getElementById('span_40').innerHTML = '&nbsp;   Volum';
            document.getElementById('span_41').innerHTML = 'Tornar';
            document.getElementById('span_42').innerHTML = 'Socis:';
            document.getElementById('span_43').innerHTML = "Filtra per servei d'accessibilitat o idioma:";
            document.getElementById('span_44').innerHTML = 'Subtítols';
            document.getElementById('span_45').innerHTML = 'Llengua de signes';
            document.getElementById('span_46').innerHTML = 'Audio- subtítols';
            document.getElementById('span_47').innerHTML = 'Audio- descripció';
            document.getElementById('span_48').innerHTML = 'Aquest projecte ha rebut finançament del Programa de Recerca i Innovació Horizon 2020 de la Unió Europea sota el contracte de subvenció núm. 761974';
            document.getElementById('span_49').innerHTML = 'Aplicar';
        }
        else if ( lang == 'es' )
        {
            document.getElementById('span_1').innerHTML = 'Ajustes';
            document.getElementById('span_2').innerHTML = 'Buscar';
            document.getElementById('span_3').innerHTML = 'Muestra/Oculta la información &nbsp;';
            document.getElementById('span_4').innerHTML = '&nbsp;  Buscar';
            document.getElementById('span_5').innerHTML = '&nbsp;  Ajustes';
            document.getElementById('span_6').innerHTML = '&nbsp;   Ajustes generales';
            document.getElementById('span_7').innerHTML = '&nbsp;Ajustes accesibilidad';
            document.getElementById('span_8').innerHTML = '&nbsp; Subtítulos';
            document.getElementById('span_9').innerHTML = '&nbsp; Lengua de signos';
            document.getElementById('span_10').innerHTML = '&nbsp; Audiodescripción';
            document.getElementById('span_11').innerHTML = '&nbsp; Audiosubtítulos';
            document.getElementById('span_12').innerHTML = '&nbsp;  Ajustes general';
            document.getElementById('span_13').innerHTML = '&nbsp;   Tipo de menú';
            document.getElementById('span_14').innerHTML = '&nbsp;   Tamaño del puntero';
            document.getElementById('span_15').innerHTML = '&nbsp;   Control de voz';
            document.getElementById('span_16').innerHTML = '&nbsp;   Perfil de usuario';
            document.getElementById('span_17').innerHTML = 'Atrás';
            document.getElementById('span_18').innerHTML = '&nbsp;  Ajustes de accesibilidad';
            document.getElementById('span_19').innerHTML = '&nbsp;   Idioma';
            document.getElementById('span_20').innerHTML = '&nbsp;   Indicador';
            document.getElementById('span_21').innerHTML = '&nbsp;   Área de visión';
            document.getElementById('span_22').innerHTML = 'Atrás';
            document.getElementById('span_23').innerHTML = '&nbsp;  Ajustes de subtítulos';
            document.getElementById('span_24').innerHTML = '&nbsp;   Tamaño';
            document.getElementById('span_25').innerHTML = '&nbsp;   Fondo';
            document.getElementById('span_26').innerHTML = '&nbsp;   Posición';
            document.getElementById('span_27').innerHTML = '&nbsp;   Lectura fácil';
            document.getElementById('span_28').innerHTML = 'Atrás';
            document.getElementById('span_29').innerHTML = '&nbsp;  Ajustes de lengua de signos';
            document.getElementById('span_30').innerHTML = '&nbsp;   Tamaño';
            document.getElementById('span_31').innerHTML = '&nbsp;   Posición';
            document.getElementById('span_32').innerHTML = 'Atras';
            document.getElementById('span_33').innerHTML = '&nbsp;  Ajustes de audiosubtítulos';
            document.getElementById('span_34').innerHTML = '&nbsp;   Lectura fácil';
            document.getElementById('span_35').innerHTML = '&nbsp;   Modo presentación';
            document.getElementById('span_36').innerHTML = '&nbsp;   Volumen';
            document.getElementById('span_37').innerHTML = 'Atrás';
            document.getElementById('span_38').innerHTML = '&nbsp;  Ajustes de audiodescripción';
            document.getElementById('span_39').innerHTML = '&nbsp;   Modo presentación';
            document.getElementById('span_40').innerHTML = '&nbsp;   Volumen';
            document.getElementById('span_41').innerHTML = 'Atrás';
            document.getElementById('span_42').innerHTML = 'Socios:';
            document.getElementById('span_43').innerHTML = 'Filtra por servicio de accesibilidad o idioma:';
            document.getElementById('span_44').innerHTML = 'Subtítulos';
            document.getElementById('span_45').innerHTML = 'Lengua de signos';
            document.getElementById('span_46').innerHTML = 'Audio- subtítulos';
            document.getElementById('span_47').innerHTML = 'Audio- descripción';
            document.getElementById('span_48').innerHTML = 'Este proyecto ha recibido financiación del Programa de Investigación e Innovación Horizon 2020 de la Unión Europea en virtud del acuerdo de subvención nº 761974.';
            document.getElementById('span_49').innerHTML = 'Aplicar';
        }
        else if ( lang == 'de' )
        {
            document.getElementById('span_1').innerHTML = 'Einstellungen';
            document.getElementById('span_2').innerHTML = 'Finden';
            document.getElementById('span_3').innerHTML = 'Inhaltsinfo ein / ausblenden &nbsp;';
            document.getElementById('span_4').innerHTML = '&nbsp;  Suche';
            document.getElementById('span_5').innerHTML = '&nbsp;  Einstellungen';
            document.getElementById('span_6').innerHTML = '&nbsp;   Allgemeine Einstellungen';
            document.getElementById('span_7').innerHTML = '&nbsp;   Barrierefreie Dienste';
            document.getElementById('span_8').innerHTML = '&nbsp;   Untertitel';
            document.getElementById('span_9').innerHTML = '&nbsp;   Gebärdensprache';
            document.getElementById('span_10').innerHTML = '&nbsp;   Audio Deskription';
            document.getElementById('span_11').innerHTML = '&nbsp;   Voice over';
            document.getElementById('span_12').innerHTML = '&nbsp;  Allgemeine Einstellungen';
            document.getElementById('span_13').innerHTML = '&nbsp;   Art des Menüs';
            document.getElementById('span_14').innerHTML = '&nbsp;   Pointergröße';
            document.getElementById('span_15').innerHTML = '&nbsp;   Sprachsteuerung';
            document.getElementById('span_16').innerHTML = '&nbsp;   Nutzerprofil';
            document.getElementById('span_17').innerHTML = 'Back';
            document.getElementById('span_18').innerHTML = '&nbsp;  Barrierefreie Dienste Einstellungen';
            document.getElementById('span_19').innerHTML = '&nbsp;   Sprache';
            document.getElementById('span_20').innerHTML = '&nbsp;   Indikator';
            document.getElementById('span_21').innerHTML = '&nbsp;   Darstellungsbereich';
            document.getElementById('span_22').innerHTML = 'Back';
            document.getElementById('span_23').innerHTML = '&nbsp;  Untertitel Einstellungen';
            document.getElementById('span_24').innerHTML = '&nbsp;   Größe';
            document.getElementById('span_25').innerHTML = '&nbsp;   Hintergrund';
            document.getElementById('span_26').innerHTML = '&nbsp;   Position';
            document.getElementById('span_27').innerHTML = '&nbsp;   Einfache Sprache';
            document.getElementById('span_28').innerHTML = 'Back';
            document.getElementById('span_29').innerHTML = '&nbsp;  Gebärdensprache Einstellungen';
            document.getElementById('span_30').innerHTML = '&nbsp;   Größe';
            document.getElementById('span_31').innerHTML = '&nbsp;   Position';
            document.getElementById('span_32').innerHTML = 'Back';
            document.getElementById('span_33').innerHTML = '&nbsp;  Voice over Einstellungen';
            document.getElementById('span_34').innerHTML = '&nbsp;   Einfache Sprache';
            document.getElementById('span_35').innerHTML = '&nbsp;   Präsentationsmodus';
            document.getElementById('span_36').innerHTML = '&nbsp;   Lautstärke';
            document.getElementById('span_37').innerHTML = 'Back';
            document.getElementById('span_38').innerHTML = '&nbsp;  Audio Deskription Einstellungen';
            document.getElementById('span_39').innerHTML = '&nbsp;   Präsentationsmodus';
            document.getElementById('span_40').innerHTML = '&nbsp;   Lautstärke';
            document.getElementById('span_41').innerHTML = 'Back';
            document.getElementById('span_42').innerHTML = 'Partners:';
            document.getElementById('span_43').innerHTML = 'Filtern Sie nach Eingabehilfen und Sprache:';
            document.getElementById('span_44').innerHTML = 'Untertitel';
            document.getElementById('span_45').innerHTML = 'Gebärden- sprache';
            document.getElementById('span_46').innerHTML = 'Voice &nbsp; over';
            document.getElementById('span_47').innerHTML = 'Audio Deskription';
            document.getElementById('span_48').innerHTML = 'Dieses Projekt wurde aus Mitteln des Forschungs- und Innovationsprogramms „Horizont 2020“ der Europäischen Union im Rahmen der Finanzhilfevereinbarung Nr. 761974 finanziert';
            document.getElementById('span_49').innerHTML = 'Los!';
        }
        else
        {
            document.getElementById('span_1').innerHTML = 'Settings';
            document.getElementById('span_2').innerHTML = 'Search';
            document.getElementById('span_3').innerHTML = 'Show/Hide content info &nbsp;';
            document.getElementById('span_4').innerHTML = '&nbsp;  Search';
            document.getElementById('span_5').innerHTML = '&nbsp;  Settings';
            document.getElementById('span_6').innerHTML = '&nbsp;   General Settings';
            document.getElementById('span_7').innerHTML = '&nbsp;   Access Settings';
            document.getElementById('span_8').innerHTML = '&nbsp;   ST Settings';
            document.getElementById('span_9').innerHTML = '&nbsp;   SL Settings';
            document.getElementById('span_10').innerHTML = '&nbsp;   AD Settings';
            document.getElementById('span_11').innerHTML = '&nbsp;   AST Settings';
            document.getElementById('span_12').innerHTML = '&nbsp;  General Settings';
            document.getElementById('span_13').innerHTML = '&nbsp;   Menu Type';
            document.getElementById('span_14').innerHTML = '&nbsp;   Pointer Size';
            document.getElementById('span_15').innerHTML = '&nbsp;   Voice Control';
            document.getElementById('span_16').innerHTML = '&nbsp;   User Profile';
            document.getElementById('span_17').innerHTML = 'Back';
            document.getElementById('span_18').innerHTML = '&nbsp;  Access Settings';
            document.getElementById('span_19').innerHTML = '&nbsp;   Access Language';
            document.getElementById('span_20').innerHTML = '&nbsp;   Indicator';
            document.getElementById('span_21').innerHTML = '&nbsp;   Safe Area';
            document.getElementById('span_22').innerHTML = 'Back';
            document.getElementById('span_23').innerHTML = '&nbsp;  ST Settings';
            document.getElementById('span_24').innerHTML = '&nbsp;   Size';
            document.getElementById('span_25').innerHTML = '&nbsp;   Background';
            document.getElementById('span_26').innerHTML = '&nbsp;   Position';
            document.getElementById('span_27').innerHTML = '&nbsp;   Easy to Read';
            document.getElementById('span_28').innerHTML = 'Back';
            document.getElementById('span_29').innerHTML = '&nbsp;  SL Settings';
            document.getElementById('span_30').innerHTML = '&nbsp;   Size';
            document.getElementById('span_31').innerHTML = '&nbsp;   Position';
            document.getElementById('span_32').innerHTML = 'Back';
            document.getElementById('span_33').innerHTML = '&nbsp;  AST Settings';
            document.getElementById('span_34').innerHTML = '&nbsp;   Easy to Read';
            document.getElementById('span_35').innerHTML = '&nbsp;   Presentation Mode';
            document.getElementById('span_36').innerHTML = '&nbsp;   Volume';
            document.getElementById('span_37').innerHTML = 'Back';
            document.getElementById('span_38').innerHTML = '&nbsp;  AD Settings';
            document.getElementById('span_39').innerHTML = '&nbsp;   Presentation Mode';
            document.getElementById('span_40').innerHTML = '&nbsp;   Volume';
            document.getElementById('span_41').innerHTML = 'Back';
            document.getElementById('span_42').innerHTML = 'Partners:';
            document.getElementById('span_43').innerHTML = 'Filter by accessibility service and language:';
            document.getElementById('span_44').innerHTML = 'Subtitles';
            document.getElementById('span_45').innerHTML = 'Sign Language';
            document.getElementById('span_46').innerHTML = 'Audio Subtitles';
            document.getElementById('span_47').innerHTML = 'Audio Description';
            document.getElementById('span_48').innerHTML = 'This project has received funding from the European Union’s Horizon 2020 Research and Innovation Programme under grant agreement No 761974';
            document.getElementById('span_49').innerHTML = 'Go!';
        }
        
    }