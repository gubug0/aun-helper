function updateBossTitle(bossName) {
	chrome.storage.local.set({"bossTitle": bossName}, function() {

	});
}

function exitBossParticipants(bossParticipant, nickname, type) {
	var participantString = bossParticipant;
	if (!type || type.length <= 0) type = "-";
	if (!participantString || participantString === "-") {
		// NOTHING TO DO
	} else {
		var participantList = participantString.split("|");
		var deletingString = "";
		for (var index = 0; index < participantList.length; index ++) {
			var participantItem = participantList[index];
			if (participantItem.includes(nickname)) deletingString = participantItem;
		}
		if (deletingString.length > 0) {
			participantString = participantString.replace(deletingString, "").replace("||", "|").replace("| |", "|").replace("|  |", "|");
		}
	}

	if (participantString.length <= 1) participantString = "-";
	chrome.storage.local.set({"bossParticipant": participantString}, function() {

	});
	return participantString;
}

function enterBossParticipants(bossParticipant, nickname, type) {
	var participantString = bossParticipant;
	if (!type || type.length <= 0) type = "-";
	if (!participantString || participantString === "-") {
		if (participantString && participantString.length >= 1) participantString += " | ";
		participantString += "[" + type + "]" + nickname;
	} else {
		var participantList = participantString.split("|");
		var isExistingParticipant = false;
		for (var index = 0; index < participantList.length; index ++) {
			var participantItem = participantList[index];
			if (participantItem.includes(nickname)) isExistingParticipant = true;
		}
		if (!isExistingParticipant) {
			if (participantString && participantString.length >= 1) participantString += " | ";
			participantString += "[" + type + "]" + nickname;
		}
	}

	if (participantString.length <= 1) participantString = "-";
	chrome.storage.local.set({"bossParticipant": participantString}, function() {

	});
	return participantString;
}

function monitorLogBoss() {
	var topFrame = document.querySelector("frame[name='topFrame']");
	var logFrame = null;
	var systemLogArea = null;
	if (topFrame) logFrame = topFrame.contentWindow.document.querySelector("frame[name='logFrame']");
	if (!logFrame) logFrame = document.querySelector("frame[name='logFrame']");
	if (logFrame) systemLogArea = logFrame.contentWindow.document.querySelector("span[id='dbstatus']");
	if (!systemLogArea) systemLogArea = document.querySelector("span[id='dbstatus']");
	if (!systemLogArea) return;
	var systemLogText = systemLogArea.querySelector("small");
	if (!systemLogText) return;
	var systemLogList = systemLogText.textContent.split(/\r?\n/);

	chrome.storage.local.get(["bossParticipant"], function(data) {
		try {
			for (var index = systemLogList.length - 1; index >= 0; index --) {
				if (index > 25) index = 25;
				var systemLogItem = systemLogList[index];
				var systemLogContent = systemLogItem.substring(systemLogItem.indexOf("]") + 1, systemLogItem.length);
				if (systemLogItem.includes("[등록]") && systemLogItem.includes("에비안츠")) {
					const participantName = systemLogContent.substring(0, systemLogContent.indexOf("님은 "));
					const participantType = systemLogContent.substring(systemLogContent.indexOf("레이드에 ") + 5, systemLogContent.indexOf("속성 "));
					data.bossParticipant = enterBossParticipants(data.bossParticipant, participantName, participantType);
					const bossName = systemLogContent.substring(systemLogContent.indexOf("님은 ") + 3, systemLogContent.indexOf("에터널스 그룹"));
					updateBossTitle(bossName);
				}
				if (systemLogItem.includes("[실종]") && systemLogItem.includes("에비안츠")) {
					const participantName = systemLogContent.substring(systemLogContent.indexOf("멤버 ") + 3, systemLogContent.indexOf("님은 "));
					data.bossParticipant = exitBossParticipants(data.bossParticipant, participantName, null);
				}
				if (systemLogItem.includes("[탈취]") && systemLogItem.includes("에비안츠")) {
					const participantName = systemLogContent.substring(systemLogContent.indexOf(" ") + 1, systemLogContent.indexOf("님이 "));
					data.bossParticipant = enterBossParticipants(data.bossParticipant, participantName, null);
					const bossName = systemLogContent.substring(systemLogContent.indexOf("州") + 1, systemLogContent.indexOf("의 뒷주머니"));
					updateBossTitle(bossName);
				}
				if (systemLogItem.includes("[울트라레이드]") && systemLogItem.includes("출현")) {
					chrome.storage.local.set({"bossParticipant": "", "bossTitle": "-"}, function() {

					});
				}
				if (systemLogItem.includes("[울트라레이드]") && systemLogItem.includes("때려잡았습니다")) {
					chrome.storage.local.set({"bossParticipant": "", "bossTitle": "-"}, function() {

					});
				}
			}
		} catch (e) {
			console.log(e);
		}
	});
}

function monitorLogBasic() {
	var topFrame = document.querySelector("frame[name='topFrame']");
	var logFrame = null;
	var systemLogArea = null;
	if (topFrame) logFrame = topFrame.contentWindow.document.querySelector("frame[name='logFrame']");
	if (!logFrame) logFrame = document.querySelector("frame[name='logFrame']");
	if (logFrame) systemLogArea = logFrame.contentWindow.document.querySelector("span[id='dbstatus']");
	if (!systemLogArea) systemLogArea = document.querySelector("span[id='dbstatus']");
	if (!systemLogArea) return;
	var systemLogText = systemLogArea.querySelector("small");
	if (!systemLogText) return;
	var systemLogList = systemLogText.textContent.split(/\r?\n/);

	try {
		for (var index = systemLogList.length - 1; index >= 0; index --) {
			if (index > 25) index = 25;
			var systemLogItem = systemLogList[index];
			var systemLogContent = systemLogItem.substring(systemLogItem.indexOf("]") + 1, systemLogItem.length);
			if (systemLogItem.includes("[민생지원]")) {
				chrome.storage.local.set({"refreshedTime": ("상생: " + getCurrentDateString())}, function() {});
			}
		}
	} catch (e) {
		console.log(e);
	}
}

$(document).ready(function() {

	// 접속시 최초 1회만 setinterval 돌리면 되는데 일단 아래처럼 했습니다
	// 새로고침 or 접속시 topframe-logframe 찾을수 있는 document는 최초 1회 로딩된다
	// 고로 해당 frame들을 찾을 수 있다면 새로고침or접속으로 판단하여 모니터링시작

	var topFrame = document.querySelector("frame[name='topFrame']");
	var logFrame = null;
	var systemLogArea = null;
	if (topFrame) logFrame = topFrame.contentWindow.document.querySelector("frame[name='logFrame']");
	if (!logFrame) logFrame = document.querySelector("frame[name='logFrame']");
	if (logFrame) systemLogArea = logFrame.contentWindow.document.querySelector("span[id='dbstatus']");
	if (!systemLogArea) systemLogArea = document.querySelector("span[id='dbstatus']");
	if (!systemLogArea) return;

	setInterval(monitorLogBasic, 6000);
	chrome.storage.local.set({"bossParticipant": "", "bossTitle": "-"}, function() {
		setInterval(monitorLogBoss, 6000);
	});

});

