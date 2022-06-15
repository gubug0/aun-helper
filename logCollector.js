var beforeLog = [];

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

		if (currentLog.filter(item => item.type.match(/^[0-9]+등급$/)).length > 0) {
			currentLog
			.filter(item => item.type.match(/^[0-9]+등급$/))
			.forEach(item => {
				const city = item.message.replace(/(.*)州에 [0-9,]+골드의 가치를 가진 흑화된 (.*)\(이\)가 출현.*/, "$1");
				const name = item.message.replace(/(.*)州에 [0-9,]+골드의 가치를 가진 흑화된 (.*)\(이\)가 출현.*/, "$2");
				logItems.push(`[닼몹] ${city}州 ${item.type} ${name} 출현`);
			});
		}
		if (currentLog.filter(item => item.type.match(/^[0-9]+등급보상$/)).length > 0) {
			currentLog
			.filter(item => item.type.match(/^[0-9]+등급보상$/))
			.forEach(item => {
				const name = item.message.replace(/누군가 흑화된 (.*) 몬스터를 때려잡은 후 .*/, "$1");
                logItems.push(`[닼몹] ${name} 사망`);
			});
		}

		if (logConfig.logKeywords) {
			const logKeywordList = logConfig.logKeywords.split(",");
			if (!logKeywordList || logKeywordList.length === 0) {
				console.log("no log keyword list");
				return;
			}
			currentLog
				.forEach(item => {
					for (var keywordIndex = 0; keywordIndex < logKeywordList.length; keywordIndex ++) {
						var listeningKeyword = logKeywordList[keywordIndex];
						if (!listeningKeyword) {
							continue;
						}
						var logItemConditions = listeningKeyword.split("&");
						if (!logItemConditions || logItemConditions.length === 0) {
							continue;
						}
						var isMatchEveryConditions = true;
						for (var conIndex = 0; conIndex < logItemConditions.length; conIndex ++) {
							var conditionItem = logItemConditions[conIndex];
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
			var keywords = prompt("알림을 받을 키워드를 입력하세요 (다중조건은 &로 / 여러개는 , 로 구분) 예시) 탈취&2000만골드수표,불여우(firefox)님에게 전보를 보냈습니다", data.logKeywords);
			if (keywords !== undefined && keywords !== null) {
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