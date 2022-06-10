var beforeLog = [];

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
			participantString = participantString.replaceAll(deletingString, "").replaceAll("||", "|");
		}
	}

	if (participantString.length <= 1) participantString = "-";
	chrome.storage.local.set({"bossParticipant": participantString}, function() {

	});
	return participantString;
}

function enterBossParticipants(bossParticipant, nickname, type) {
	var participantString = bossParticipant;
	if (!type || type.length <= 0) type = "?";
	if (!participantString || participantString === "-") {
		if (participantString === "-") participantString = "";
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

function getRefreshAlarmConfig(callback) {
	chrome.storage.local.get(["alarmSound", "refreshAlarmActivation"], function(data) {
		if (data.alarmSound === undefined) {
			data.alarmSound = false;
		}
		if (data.refreshAlarmActivation === undefined) {
			data.refreshAlarmActivation = true;
		}
		
		if (callback) {
			callback(data);
		}
	});
}
function processNewRefresh() {
	chrome.storage.local.set({
		"refreshedTime": new Date().getTime(),
		"waterStatus": false,
	}, function() {
		chrome.runtime.sendMessage({'action': 'refreshDetected', 'message': ""}, function(response) {
			// nothing to do 
		});
	});
}

function parseLogMessage(log, logConfig) {
	$('small', log).each((index, item) => {
		if (!item.textContent) {
			return;
		}
		
		const row = item.textContent
						.split("\n")
                        .map(item => item.trim())
                        .filter(item => item !== '');
		
		const newLogs = [];
		var lastIndex = -1;
        for (var iter = 0; iter < row.length; iter += 1) {
            if (beforeLog.filter(item => item === row[iter]).length <= 0) {
				newLogs.push(row[iter]);
			}
        }
        
        beforeLog = newLogs.concat(beforeLog).slice(0, 100)

        const currentLog = newLogs.map(item => {
            const reg1 = /^\[(.+)\](.+)$/g
            const reg2 = /^【(.+)】(.+)$/g
            if (item.match(reg1)) {
                return {
                    "type": item.replace(reg1, "$1").trim(),
                    "message": item.replace(reg1, "$2").trim()
                }
            } else if (item.match(reg2)) {
                return {
                    "type": item.replace(reg2, "$1").trim(),
                    "message": item.replace(reg2, "$2").trim()
                }
            } else {
                return {
                    "type": "unknown",
                    "message": item
                }
            }
        })

        if (currentLog.filter(item => item.type === '민생지원').length > 0) {
			processNewRefresh();
        }
		
		const logItems = []

		if (logConfig.darkLog && currentLog.filter(item => item.type.match(/^[0-9]+등급$/)).length > 0) {
			currentLog
			.filter(item => item.type.match(/^[0-9]+등급$/))
			.forEach(item => {
				const city = item.message.replace(/(.*)州에 [0-9,]+골드의 가치를 가진 흑화된 (.*)\(이\)가 출현.*/, "$1");
				const name = item.message.replace(/(.*)州에 [0-9,]+골드의 가치를 가진 흑화된 (.*)\(이\)가 출현.*/, "$2");
				logItems.push(`[닼몹] ${city}州 ${item.type} ${name} 출현`);
			});
		}
		if (logConfig.darkLog && currentLog.filter(item => item.type.match(/^[0-9]+등급보상$/)).length > 0) {
			currentLog
			.filter(item => item.type.match(/^[0-9]+등급보상$/))
			.forEach(item => {
				const name = item.message.replace(/누군가 흑화된 (.*) 몬스터를 때려잡은 후 .*/, "$1");
                logItems.push(`[닼몹] ${name} 사망`);
			});
		}
		if (currentLog.filter(item => item.type.match(/^등록$/)).length > 0) {
			currentLog
				.filter(item => item.type.match(/^등록$/))
				.forEach(item => {
					if (!item.message.includes("에비안츠")) return;
					const participantName = item.message.substring(0, item.message.indexOf("님은 "));
					const participantType = item.message.substring(item.message.indexOf("레이드에 ") + 5, item.message.indexOf("속성 "));
					logConfig.bossParticipant = enterBossParticipants(logConfig.bossParticipant, participantName, participantType);
					const bossName = item.message.substring(item.message.indexOf("님은 ") + 3, item.message.indexOf("에터널스 그룹"));
					console.log(`${bossName} NEW USER : ${participantName} (${participantType})`);
					updateBossTitle(bossName);
				});
		}
		if (currentLog.filter(item => item.type.match(/^실종$/)).length > 0) {
			currentLog
				.filter(item => item.type.match(/^실종$/))
				.forEach(item => {
					const participantName = item.message.substring(item.message.indexOf("멤버 ") + 3, item.message.indexOf("님은 "));
					logConfig.bossParticipant = exitBossParticipants(logConfig.bossParticipant, participantName, null);
					console.log(`boss EXIT USER : ${participantName}`);
				});
		}
		if (currentLog.filter(item => item.type.match(/^탈취$/)).length > 0) {
			currentLog
				.filter(item => item.type.match(/^탈취$/))
				.forEach(item => {
					if (!item.message.includes("에비안츠")) return;
					const participantName = item.message.substring(item.message.indexOf(" ") + 1, item.message.indexOf("님이 "));
					logConfig.bossParticipant = enterBossParticipants(logConfig.bossParticipant, participantName, null);
					const bossName = item.message.substring(item.message.indexOf("州") + 1, item.message.indexOf("의 뒷주머니"));
					updateBossTitle(bossName);
				});
		}
		if (currentLog.filter(item => item.type.match(/^울트라레이드$/)).length > 0) {
			currentLog
				.filter(item => item.type.match(/^울트라레이드$/))
				.forEach(item => {
					if (item.message.includes("출현")) {
						const bossName = item.message.substring(item.message.indexOf("등급 ") + 3, item.message.indexOf("출현!")).trim();
						updateBossTitle(bossName);
						chrome.storage.local.set({"bossParticipant": "-", "bossTitle": bossName});
					}
					if (item.message.includes("때려잡았습니다")) {
						chrome.storage.local.set({"bossParticipant": "-", "bossTitle": "-"});
					}
				});
		}

		if (logConfig.logKeywords) {
			var logKeywordList = logConfig.logKeywords.split(",");
			if (!logKeywordList || logKeywordList.length === 0) {
				console.log("no log keyword list");
				return;
			}
			currentLog
				.forEach(item => {
					for (var keywordIndex = 0; keywordIndex < logKeywordList.length; keywordIndex ++) {
						var listeningKeyword = logKeywordList[keywordIndex];
						//console.log("listeningKeyword : " + listeningKeyword);
						if (!listeningKeyword) {
							console.log("empty log keyword");
							continue;
						}
						var logItemConditions = listeningKeyword.split("&");
						if (!logItemConditions || logItemConditions.length === 0) {
							console.log("no log condition list");
							continue;
						}
						var isMatchEveryConditions = true;
						for (var conIndex = 0; conIndex < logItemConditions.length; conIndex ++) {
							var conditionItem = logItemConditions[conIndex];
							//console.log("conditionItem : " + conditionItem);
							if ((item.type && !item.type.includes(conditionItem.replaceAll("[","").replaceAll("]", "")))
								&& !item.message.includes(conditionItem)) {
								isMatchEveryConditions = false;
								break;
							}
						}
						if (!isMatchEveryConditions) continue;
						chrome.storage.local.set({"keywordNotificationTitle": ("에타츠/" + item.type), "keywordNotificationContent" : item.message}, function() {
							console.log("log notification made : " + item.type + ":" + item.message);
						});
					}
				});
		}

		if (logItems.length > 0) {
            addMultiLog(logItems);
        }
	});
}

function isDulicatedLogs(total, current, index) {
    var totalIndex = 0;
    var iter = index;
    for (; iter < current.length && totalIndex < total.length; iter += 1) {
        if (total[totalIndex] !== current[iter]) {
            break;
        }
        totalIndex += 1;
    }
    return iter === current.length || totalIndex == total.length
}


function injectHttpRequestScript() {
	const _script = document.createElement('script');
	_script.setAttribute('src', chrome.runtime.getURL('injectLogScript.js'));
	(document.body||document.documentElement).appendChild( _script);
}

function requestGameLog() {
	$.get("/logservice_xs.php", function(data) {
		sendLogMessage(data);
		getLoggingConfig(function(logConfig) {
			parseLogMessage(data, logConfig);
		});
	});
}
function sendLogMessage(message) {
	document.getElementById("dbstatus").innerHTML = message;
	makeLogControls();
}

function registerLogRequest() {
	const worker = create10000msIntervalWorker(function() {
		requestGameLog();
	})
}

function makeLogControls() {
	let titleDiv = document.querySelector("span#dbstatus td");
	var logDocument = document;
	if (!titleDiv) {
		console.log("logCollector : no log title div");
		return;
	}
	if (!titleDiv.querySelector("img")) {
		console.log("logCollector : no log title div inner content");
		return;
	}

	while (titleDiv.querySelector("div#logkeyword")) {
		titleDiv.removeChild(titleDiv.querySelector("div#logkeyword"));
	}

	chrome.storage.local.get(["logKeywords"], function(data) {
		var imageItem = titleDiv.querySelector("img");
		var tdItem = titleDiv.querySelector("td");
		var keywordDiv = logDocument.createElement("div");
		keywordDiv.id = "logkeyword";
		keywordDiv.style.display = "flex";
		keywordDiv.style.justifyContent = "space-between";
		keywordDiv.style.textAlign = "end";
		keywordDiv.style.width = "100%";
		var keywordText =  logDocument.createElement("button");
		keywordText.innerHTML = "<b>키워드</b>";
		keywordText.style = "color: rgb(255, 255, 255);margin: 4px;border-radius: 4px;background: rgb(124 143 52);";
		keywordText.style.alignSelf = "flex-end";
		keywordText.onclick = function () {
			var keywords = prompt("알림을 받을 키워드를 입력하세요 (다중조건은 &로 / 여러개는 , 로 구분) 예시) 불여우님&2000만골드수표,탄생&호구국", data.logKeywords);
			if (keywords !== undefined && keywords !== null && keywords.length > 0) {
				chrome.storage.local.set({"logKeywords": keywords}, function() {
					makeLogControls();
				});
			}
		};
		if (titleDiv) {
			titleDiv.height = "48";
			titleDiv.removeAttribute("height");
			titleDiv.setAttribute("height", "48");
		}
		if (imageItem) {
			imageItem.parentElement.removeChild(imageItem);
			imageItem.style.height = "40px";
			imageItem.style.margin = "4px";
			keywordDiv.append(imageItem);
			var blankDiv = logDocument.createElement("div");
			blankDiv.style.flex = "1";
			keywordDiv.append(blankDiv);
		}
		keywordDiv.append(keywordText);
		titleDiv.append(keywordDiv);

	});
}

$(document).ready(function() {
	if (window.location.pathname !== "/slog") {
		return;
	}
	
	injectHttpRequestScript();
	registerLogRequest();
	requestGameLog();
});
