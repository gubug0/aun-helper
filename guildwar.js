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
	var guildTargetSelector = document.querySelector("select[name='tid']");
	if (!guildTargetSelector && document.querySelector("frame[name='mainFrame']")) guildTargetSelector = document.querySelector("frame[name='mainFrame']").contentWindow.document.querySelector("select[name='tid']");

	if (guildwarDom) {
		setGuildWarTimeAndResetAlarm(new Date().getTime());
		return;
	} else if (guildTargetSelector) { // ATTACK READY PAGE
		var currentMoneyHolder = document.querySelector("font[color='#DAA520']");
		if (!currentMoneyHolder) return;
		var contentHolder = document.querySelector("td[colspan='2']");
		if (!contentHolder) return;
		var currentMoney = 0;
		try {
			currentMoney = parseInt(currentMoneyHolder.textContent.substring(5, currentMoneyHolder.textContent.indexOf("골드")).replaceAll(",",""));
			if (currentMoney > 100000) {
				var warningTextHolder = document.createElement("p");
				warningTextHolder.style = 'font-style: italic;color: #ff0000;font-weight: bold;font-size: large';
				warningTextHolder.innerText = "주머니에 골드가 좀 있는데 정말 괜찮으시겠어요?";
				contentHolder.prepend(warningTextHolder);
			}
		} catch (e) {
			console.log(e);
		}
	} else {
		const errorMessageDom = document.querySelector(".msg.msg-warning.msg-danger-text");
		if (!errorMessageDom) {
			return;
		}
		const errorMessage = errorMessageDom.textContent.replaceAll("\n", "");
		if (errorMessage.match(/.*도시 공격까지 ([0-9]+) 초 기다려 주세요..*/)) {
			const remainSecond = errorMessage.replace(/.*도시 공격까지 ([0-9]+) 초 기다려 주세요..*/, "$1")
			if (!remainSecond) {
				return;
			}
			
			console.log(remainSecond);
			setGuildWarTimeAndResetAlarm(new Date().getTime() - (1000 * 60 * 10 - (parseInt(remainSecond, 10) * 1000) - 1000));
		} else if (errorMessage.match(/.*공격할 수 있는 몸상태가 아닙니다. 여인숙에 가서 건강도를 회복하십시오.*/)) {
			addLog("HP부족으로 길드전실패");
			setGuildWarTimeAndResetAlarm(new Date().getTime());
		}
		
		
		
	}
	
	
}
$(document).ready(function() {
	monitorGuildWar();
});