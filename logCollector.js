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

function parseLogMessage(log) {
	const result = []
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
		
		currentLog.forEach(item => result.push(item));
	});
	
	return result;
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

function existsRefreshTimeLog(logs) {
	return logs.filter(item => item.type === '민생지원').length > 0
}

function getDarkMonsterStatus(callback) {
	chrome.storage.local.get(["darkMonsterStatus"], callback);
}
function setDarkMonsterStatus(darkMonsterStatus, callback) {
	chrome.storage.local.set({"darkMonsterStatus": darkMonsterStatus}, callback);
}

function processDarkMonsterLog(logs, isRefreshTime) {
	if (isRefreshTime) {
		setDarkMonsterStatus({})
		return;
	}
	
	getDarkMonsterStatus((data) => {
		const darkMonsterStatus = data.darkMonsterStatus || {};
		
		logs
			.filter(item => item.type.match(/^[0-9]+등급$/))
			.forEach(item => {
				
				const messageMatches = item.message.match(/(.*)州에 [0-9,]+골드의 가치를 가진 흑화된 (.*)\(이\)가 출현.*/)
				if (!messageMatches) {
					console.error("unknown darkMonsterMessage", item.message);
					return;
				}
				
				const typeMatches = item.type.match(/^([0-9]+)등급$/)
				if (!typeMatches) {
					return;
				}
				
				const city = messageMatches[1]
				const monsterName = messageMatches[2]
				const level = typeMatches[1]
				
				darkMonsterStatus[city] = {
					monsterName: monsterName,
					level: level
				}
			});
		
		logs
			.filter(item => item.type.match(/^[0-9]+등급보상$/))
			.forEach(item => {
				const matches = item.message.match(/누군가 흑화된 (.*) 몬스터를 때려잡은 후 .* 골드를 획득!.*/);
				if (!matches) {
					console.error("unknown darkMonsterMessage", item.message);
					return;
				}
				
				const monsterName = matches[1]
				const citys = Object.keys(darkMonsterStatus)
									.filter(city => darkMonsterStatus[city].monsterName === monsterName)
				
				citys.forEach(city => {
					delete darkMonsterStatus[city]
				});
			});
			
		setDarkMonsterStatus(darkMonsterStatus)
	});
}
function processUltraRaidLog(logs) {
	
}
function requestGameLog() {
	$.get("/logservice_xs.php", function(data) {
		updateLogMessage(data);
		const newLogs = parseLogMessage(data);
		
		const isRefreshTime = existsRefreshTimeLog(newLogs);
		
		processDarkMonsterLog(newLogs, isRefreshTime);
		processUltraRaidLog(newLogs);
		if (isRefreshTime) {
			processNewRefresh();
		}
	});
}

function updateLogMessage(message) {
	document.getElementById("dbstatus").innerHTML = message;
}

function registerLogRequest() {
	const worker = create10000msIntervalWorker(function() {
		requestGameLog();
	})
}

function injectHttpRequestScript() {
	const _script = document.createElement('script');
	_script.setAttribute('src', chrome.runtime.getURL('injectLogScript.js'));
	(document.body||document.documentElement).appendChild( _script);
}

$(document).ready(function() {
	if (window.location.pathname !== "/slog") {
		return;
	}
	
	injectHttpRequestScript();
	registerLogRequest();
	requestGameLog();
});