function MultiOptionsPreviewView() {

    var submenu;

	this.UpdateView = function(data){
		submenu = scene.getObjectByName(data.name);

		submenu.add(refreshSubtitlesPreview(data))
		submenu.add(refreshAreaPreview(data))
        if(scene.getObjectByName("sign")) submenu.add(refreshSignerPreview(data));
	}
	
	function refreshSubtitlesPreview(data)
    {
        var submenu = scene.getObjectByName(data.name);
        submenu.remove(scene.getObjectByName('subtitlespreview'));

        return data.subtitlesPreview;
    }

	function refreshAreaPreview(data)
    {
        var submenu = scene.getObjectByName(data.name);
        submenu.remove(scene.getObjectByName('areapreview'));

        return data.areaPreview;
    }

    function refreshSignerPreview(data)
    {
        var submenu = scene.getObjectByName(data.name);
        submenu.remove(scene.getObjectByName('signerpreview'));

        return data.signerPreview;
    }
}