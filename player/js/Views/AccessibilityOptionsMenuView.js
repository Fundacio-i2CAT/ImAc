function AccessibilityOptionsMenuView() {

    var submenu;

	this.UpdateView = function(data){
		submenu = scene.getObjectByName(data.name);
        //Update the Accesibility icon initial status depending if they are enabled or not.
        this.UpdateAccessibilityOptionsIconStatusView(data);
        //Adding the functions to the corresponding menu elements.
        if( data.isSTavailable ){
            submenu.getObjectByName('show-st-button').children[0].onexecute = data.subtitlesButtonFunc;
            submenu.getObjectByName('disable-st-button').children[0].onexecute = data.subtitlesButtonFunc;
        } else{
            submenu.getObjectByName('disable-st-button').children[0].onexecute = function() { console.log("This is the disable-st-button button") };
        }
        
        if( data.isSLavailable ){
            submenu.getObjectByName('show-sl-button').children[0].onexecute =  data.signlanguageButtonFunc;
            submenu.getObjectByName('disable-sl-button').children[0].onexecute = data.signlanguageButtonFunc;
        } else{
            submenu.getObjectByName('disable-sl-button').children[0].onexecute = function() { console.log("This is the disable-sl-button button") };
        }
        
        if( data.isADavailable ){
            submenu.getObjectByName('show-ad-button').children[0].onexecute = data.audioDescriptionButtonFunc;
            submenu.getObjectByName('disable-ad-button').children[0].onexecute = data.audioDescriptionButtonFunc;
        } else{
            submenu.getObjectByName('disable-ad-button').children[0].onexecute = function() { console.log("This is the disable-ad-button button") };
        }
        
        if( data.isASTavailable ){
            submenu.getObjectByName('show-ast-button').children[0].onexecute = data.audioSubtitlesButtonFunc;
            submenu.getObjectByName('disable-ast-button').children[0].onexecute = data.audioSubtitlesButtonFunc;
        } else{
            submenu.getObjectByName('disable-ast-button').children[0].onexecute = function() { console.log("This is the disable-ast-button button") };
        }
    }


/**
 * [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
    this.UpdateAccessibilityOptionsIconStatusView = function(data){

        if( data.isSTavailable ){
            submenu.getObjectByName('show-st-button').visible = data.isSTenabled;
            submenu.getObjectByName('disable-st-button').visible = !data.isSTenabled;
            submenu.getObjectByName('disable-st-button').material.color.set( 0xe6e6e6 );
        } else{
            submenu.getObjectByName('show-st-button').visible = data.isSTenabled;
            submenu.getObjectByName('disable-st-button').visible = !data.isSTenabled;
            submenu.getObjectByName('disable-st-button').material.color.set( 0x3a3a3a );
        }

        if( data.isSLavailable ){
            submenu.getObjectByName('show-sl-button').visible = data.isSLenabled;
            submenu.getObjectByName('disable-sl-button').visible = !data.isSLenabled;
            submenu.getObjectByName('disable-sl-button').material.color.set( 0xe6e6e6 );
        } else{
            submenu.getObjectByName('show-sl-button').visible = data.isSLenabled;
            submenu.getObjectByName('disable-sl-button').visible = !data.isSLenabled;
            submenu.getObjectByName('disable-sl-button').material.color.set( 0x3a3a3a );
        }

        if( data.isADavailable ){
            submenu.getObjectByName('show-ad-button').visible = data.isADenabled;
            submenu.getObjectByName('disable-ad-button').visible = !data.isADenabled;
            submenu.getObjectByName('disable-ad-button').material.color.set( 0xe6e6e6 );
        } else{
            submenu.getObjectByName('show-ad-button').visible = data.isADenabled;
            submenu.getObjectByName('disable-ad-button').visible = !data.isADenabled;
            submenu.getObjectByName('disable-ad-button').material.color.set( 0x3a3a3a );
        }

        if( data.isASTavailable ){
            submenu.getObjectByName('show-ast-button').visible = data.isASTenabled;
            submenu.getObjectByName('disable-ast-button').visible = !data.isASTenabled;
            submenu.getObjectByName('disable-ast-button').material.color.set( 0xe6e6e6 );
        } else{
            submenu.getObjectByName('show-ast-button').visible = data.isASTenabled;
            submenu.getObjectByName('disable-ast-button').visible = !data.isASTenabled;
            submenu.getObjectByName('disable-ast-button').material.color.set( 0x3a3a3a );
        } 
    }
}
