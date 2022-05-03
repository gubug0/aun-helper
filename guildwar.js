function setGuildWarTimeAndResetAlarm(callback) {
	chrome.storage.sync.set({
		"guildwarTime": new Date().getTime(),
		"guildwarAlarm": true,
	}, callback);
}
function monitorGuildWar() {
	if (window.location.pathname !== '/etc.cgi') {
		return;
	}
	
	const guildwarDom = document.querySelector(".glyphicon.glyphicon-tower");
	if (!guildwarDom) {
		return;
	}
	
	setGuildWarTimeAndResetAlarm();
	addLog("길드전 수행");
}
$(document).ready(function() {
	monitorGuildWar();
});