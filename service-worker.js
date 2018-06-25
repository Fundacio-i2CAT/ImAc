const preCacheName = "pre-cache-pac",
  // llistat d'arxius estàtics per afegir al cache (css, scripts, imatges,....)
    preCacheFiles = [
        "./",
        './index.html',
        "./css/index.css",
        "./css/bootstrap.min.css",
        "./css/fonts/TiresiasScreenfont_Regular.json",
        "./img/compass_l.png",
        "./img/compass_r.png",
        "./img/LOGO-IMAC.png",
        "./img/icon-setup.png",
        "./js/controllers/DeviceOrientationAndTouchController.js",
        "./js/controllers/FullScreenController.js",
        "./js/controllers/VREffect.js",
        "./js/lib/jquery-3.2.1.min.js",
        "./js/lib/bootstrap.min.js",
        "./js/lib/hls.js",
        "./js/lib/three.js",
        "./js/lib/StereoEffect.js",
        "./js/lib/omnitone_i2cat.js",
        "./js/lib/webvr-polyfill.js",
        "./js/lib/bogJS-latest.js",
        "./js/lib/sax.js",
        "./js/lib/imsc_i2cat.js",
        "./js/lib/dash.all.min.js",
        "./js/Scene_Generators/AplicationManager.js",
        "./js/Scene_Generators/MediaObject.js",
        "./js/Scene_Generators/AudioManager.js",
        "./js/Scene_Generators/SubSignManager.js",
        "./js/Scene_Generators/InteractionsController.js",
        "./js/vr/WebVR.js",
        "./js/vr/DaydreamController.js",
        "./js/Utils/elementsGenerator.js",
        "./js/Utils/utils.js",
        "./js/index.js",
        "./js/pilot1.js",
        "./resources/cam_2_2k.mp4",
        "./resources/omnitone-toa-1.wav",
        "./resources/omnitone-toa-2.wav",
        "./resources/omnitone-toa-3.wav",
        "./resources/omnitone-toa-4.wav",
        "./resources/omnitone-toa-5.wav",
        "./resources/omnitone-toa-6.wav",
        "./resources/omnitone-toa-7.wav",
        "./resources/omnitone-toa-8.wav",
        "./resources/omnitone-foa-1.wav",
        "./resources/omnitone-foa-2.wav",
        "./resources/LICEU_ENG.xml"
    ];


self.addEventListener("install", event => {
    console.log("installing precached files");
    caches.open(preCacheName).then(function (cache) {
        return cache.addAll(preCacheFiles);
    });
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (!response) {
                //fall back to the network fetch
                return fetch(event.request);
            }
            return response;
        })
    )
});
