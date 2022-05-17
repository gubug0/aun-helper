function setGuildWarTimeAndResetAlarm(time, callback) {
	chrome.storage.local.set({
		"guildWarTime": time,
		"guildWarNeedAlarm": true,
	}, callback);
}
function monitorGuildWar() {
	if (window.location.pathname !== '/etc.cgi') {
		return;
	}
	
	const guildwarDom = document.querySelector(".glyphicon.glyphicon-tower");
	
	if (guildwarDom) {
		setGuildWarTimeAndResetAlarm(new Date().getTime());
		return;
	} else {
		const errorMessageDom = document.querySelector(".msg.msg-warning.msg-danger-text");
		if (!errorMessageDom) {
			return;
		}
		const errorMessage = errorMessageDom.textContent.replaceAll("\n", "");
		console.log(errorMessage);
		const remainSecond = errorMessage.replace(/.*도시 공격까지 ([0-9]+) 초 기다려 주세요..*/, "$1")
		if (!remainSecond) {
			return;
		}
		
		console.log(remainSecond);
		setGuildWarTimeAndResetAlarm(new Date().getTime() - (1000 * 60 * 10 - (parseInt(remainSecond, 10) * 1000) - 1000));
		
	}
	
	
}
$(document).ready(function() {
	monitorGuildWar();
});