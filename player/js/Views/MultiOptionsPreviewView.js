function MultiOptionsPreviewView() {

    var submenu;

	this.UpdateView = function(data){
		submenu = scene.getObjectByName(data.name);

		submenu.add(refreshSubtitlesPreview(data));
		submenu.add(refreshAreaSTPreview(data));
        if(scene.getObjectByName("sign")) submenu.add(refreshSignerPreview(data));
        if(scene.getObjectByName("sign")) submenu.add(refreshAreaSLPreview(data));

        submenu.getObjectByName('signerpreview').visible = subController.getSignerEnabled();

        if(scene.getObjectByName('right')) scene.getObjectByName('right').visible = data.isArrowsVisible;
        if(scene.getObjectByName('left')) scene.getObjectByName('left').visible = data.isArrowsVisible;

        submenu.getObjectByName('radarPreview').visible = data.isRadarVisible;
        submenu.getObjectByName('radarPreview').position.x = ( 1.48*subController.getSubArea()/2-14/2 );
        submenu.getObjectByName('radarPreview').position.y = ( 0.82*subController.getSubArea()/2-14/2 ) * subController.getSubPosition().y;
        submenu.getObjectByName('radarPreview').position.z = -76;
	}
	
	function refreshSubtitlesPreview(data)
    {
        var submenu = scene.getObjectByName(data.name);
        submenu.remove(scene.getObjectByName('subtitlespreview'));

        return data.subtitlesPreview;
    }

	function refreshAreaSTPreview(data)
    {
        var submenu = scene.getObjectByName(data.name);
        submenu.remove(scene.getObjectByName('areaSTpreview'));

        return data.areaSTPreview;
    }

    function refreshAreaSLPreview(data)
    {
        var submenu = scene.getObjectByName(data.name);
        submenu.remove(scene.getObjectByName('areaSLpreview'));

        return data.areaSLPreview;
    }

    function refreshSignerPreview(data)
    {
        var submenu = scene.getObjectByName(data.name);
        submenu.remove(scene.getObjectByName('signerpreview'));

        return data.signerPreview;
    }
}