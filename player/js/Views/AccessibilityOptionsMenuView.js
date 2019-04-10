function AccessibilityOptionsMenuView() {

    var submenu;

	this.UpdateView = function(data){
		submenu = scene.getObjectByName(data.name);
    //Update the Accesibility icon initial status depending if they are enabled or not.
    this.UpdateAccessibilityOptionsIconStatusView(data);
    //Adding the functions to the corresponding menu elements.
    submenu.getObjectByName('showSubtitlesMenuButton').children[0].onexecute = data.subtitlesButtonFunc;
    submenu.getObjectByName('disabledSubtitlesMenuButton').children[0].onexecute = data.subtitlesButtonFunc;
    submenu.getObjectByName('showSignLanguageMenuButton').children[0].onexecute =  data.signlanguageButtonFunc;
    submenu.getObjectByName('disabledSignLanguageMenuButton').children[0].onexecute = data.signlanguageButtonFunc;
    submenu.getObjectByName('showAudioDescriptionMenuButton').children[0].onexecute = data.audioDescriptionButtonFunc;
    submenu.getObjectByName('disabledAudioDescriptionMenuButton').children[0].onexecute = data.audioDescriptionButtonFunc;
    submenu.getObjectByName('showAudioSubtitlesMenuButton').children[0].onexecute = data.audioSubtitlesButtonFunc;
    submenu.getObjectByName('disabledAudioSubtitlesMenuButton').children[0].onexecute = data.audioSubtitlesButtonFunc;

    //If this elements are visible add the function.
    if(submenu.getObjectByName('previewMenuButton')) submenu.getObjectByName('previewMenuButton').children[0].onexecute = data.previewButtonFunc;
		if(submenu.getObjectByName('forwardMenuButton')) submenu.getObjectByName('forwardMenuButton').children[0].onexecute = data.forwardMenuButtonFunc;
		if(submenu.getObjectByName('backMenuButton')) submenu.getObjectByName('backMenuButton').children[0].onexecute = data.backMenuButtonFunc;
    if(submenu.getObjectByName('closeMenuButton')) submenu.getObjectByName('closeMenuButton').children[0].onexecute = data.closeMenuButtonFunc;
	}

/**
 * [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
  this.pressButtonFeedback = function(data){

    //The interactivity is removed from the list so the user cannot click during the animation.
    interController.removeInteractiveObject(data.clickedButtonName);

    let sceneElement = submenu.getObjectByName(data.clickedButtonName);
    let initScale = sceneElement.scale;
    // The material is cloned in order to set the same color to the element after the animation
    let initialMaterial = sceneElement.material.clone();

    //sceneElement.material.color.set( menuButtonActiveColor );
    sceneElement.scale.set( initScale.x*0.8, initScale.y*0.8, 1 );

   setTimeout(function() {
        //Set the material color to the initial after the animation
        sceneElement.material.color.set( initialMaterial.color );
        sceneElement.scale.set( initScale.x*1.25, initScale.y*1.25, 1 );
        //Add the interactivity to the list after the animation ends.
        interController.addInteractiveObject( sceneElement );
    }, 300);
  };

/**
 * [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
  this.UpdateAccessibilityOptionsIconStatusView = function(data){

    submenu.getObjectByName('showSubtitlesMenuButton').visible = data.isSTenabled;
    submenu.getObjectByName('disabledSubtitlesMenuButton').visible = !data.isSTenabled;

    submenu.getObjectByName('showSignLanguageMenuButton').visible = data.isSLenabled;
    submenu.getObjectByName('disabledSignLanguageMenuButton').visible = !data.isSLenabled;

    submenu.getObjectByName('showAudioDescriptionMenuButton').visible = data.isADenabled;
    submenu.getObjectByName('disabledAudioDescriptionMenuButton').visible = !data.isADenabled;

    submenu.getObjectByName('showAudioSubtitlesMenuButton').visible = data.isASTenabled;
    submenu.getObjectByName('disabledAudioSubtitlesMenuButton').visible = !data.isASTenabled;
  }
}
