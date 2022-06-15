function injectHeadScript() {
	isBackgroundFrame(function(isBackgroundFrame) {
		if (isBackgroundFrame) return;
		isAutoBattleActive(function (isAutoBattle) {
			if (isAutoBattle) {
				_script = document.createElement('script');
				_script.setAttribute('src', chrome.runtime.getURL('ignoreAlert.js'));
				(document.head || document.documentElement).appendChild(_script);
				_script.parentNode.removeChild(_script);
			}
		});
	});
}
injectHeadScript();