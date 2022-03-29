function injectJs(srcFile) {
    var scr = document.createElement('script');
    scr.src = srcFile;
	scr.type = "text/javascript";
    document.getElementsByTagName('head')[0].appendChild(scr);
}

$(document).ready(function() {
	injectJs(chrome.runtime.getURL('inject.js'));
});