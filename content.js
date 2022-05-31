function findBattleButton() {
	if (document.querySelector("form[action=bt]")) {
		return document.querySelector("form[action=bt]");
		
	} else if(document.querySelector("form[action='./bt']")) {
		return document.querySelector("form[action='./bt']");
	}
}

function isAutoBattleActive(callback) {
	chrome.storage.local.get(["isAutoBattle"], function(data) {
		callback(data.isAutoBattle);
	});
}


function getBattleCount(callback) {
	chrome.storage.local.get(["battleCount"], function(data) {
		if (!data.battleCount) {
			data.battleCount = 0;
		}
		callback(data.battleCount);
	});
}

function increaseBattleCount(callback) {
	getBattleCount(function(battleCount) {
		const result = battleCount + 1;
		chrome.storage.local.set({battleCount: result}, function() {
			callback(result);
		});
	});
}

function setBattleDuration(battleDuration, callback) {
	chrome.storage.local.set({"autoBattleDuration": battleDuration}, callback);
}

function setBattleFiveSecDuration(battleDuration, callback) {
	chrome.storage.local.set({"autoBattleFiveSecDuration": battleDuration}, callback);
}

function getBattleDuration(callback) {
	chrome.storage.local.get(["autoBattleDuration", "autoBattleFiveSecDuration"], function(data) {
		
		if (is5SecondsBattleUser()) {
			var battleDuration = data.autoBattleFiveSecDuration
			if (battleDuration === undefined) {
				battleDuration = 4000;
				setBattleFiveSecDuration(battleDuration, function() {
					callback(battleDuration);
				});
			} else {
				callback(battleDuration);
			}
		} else {
			var battleDuration = data.autoBattleDuration
			if (battleDuration === undefined) {
				battleDuration = 9000;
				setBattleDuration(battleDuration, function() {
					callback(battleDuration);
				});
			} else {
				callback(battleDuration);
			}
		}
	});
}

function getInventorySortConfig(callback) {
	chrome.storage.local.get(["inventorySort"], function(data) {
		if (data.inventorySort === undefined) {
			data.inventorySort = true;
		}

		if (callback) {
			callback(data);
		}
	});
}

function addLog(str, callback) {
	chrome.storage.local.get(["battleLog"], function(data) {
		if (data.battleLog === undefined) {
			data.battleLog = "";
		}
		const allLog = "[" + getCurrentDateString() + "] " + str + "\n" + data.battleLog
		var splitLogs = allLog.split("\n");
		
		if (splitLogs.length > 2000) {
            splitLogs = splitLogs.slice(0, 2000)
		}
		chrome.storage.local.set({"battleLog": splitLogs.join("\n")}, callback)
	})
}

function addMultiLog(strList, callback) {
    chrome.storage.local.get(["battleLog"], function(data) {
        if (data.battleLog === undefined) {
            data.battleLog = "";
        }
        
        var allLog = data.battleLog;
        strList.forEach(str => {
            allLog = "[" + getCurrentDateString() + "] " + str + "\n" + allLog
        });
        
        var splitLogs = allLog.split("\n");
        if (splitLogs.length > 2000) {
            splitLogs = splitLogs.slice(0, 2000)
        }
        chrome.storage.local.set({"battleLog": splitLogs.join("\n")}, callback)
    })
}

function setAutoBattleLog(str) {
	chrome.storage.local.set({"autoBattleLog": "[" + getCurrentDateString() + "] " + str});
}

function is5SecondsBattleUser() {
	return Array.from(document.querySelectorAll(".offer.offer-radius.table font")).filter(item => item.textContent.match(/.*5초사냥 사용자, [0-9]+ 초 남음.*/)).length > 0
}

function injectConfigPage(srcFile) {
	if (!document.querySelector("frame[name=mainFrame]")) {
		return;
	}
	const configFrame = document.createElement("frame");
	configFrame.name = "configFrame"
	configFrame.src = srcFile
	configFrame.scrolling = "no"
	
	const frameset = document.createElement('frameset');
	frameset.cols =  "*,260"

	const topFrame = document.querySelector("frame[name=mainFrame]")
	const parentFrameset = topFrame.parentElement
	topFrame.remove()
	
	frameset.appendChild(topFrame);
	frameset.appendChild(configFrame);

	parentFrameset.insertBefore(frameset, parentFrameset.lastChild)
}


$(document).ready(function() {
	injectConfigPage(chrome.runtime.getURL('config.html'));
	
	const mainPageForm = document.querySelector("form[action=MainPage]")
	if (mainPageForm) {
		isAutoBattleActive(function(lastBattleStatus) {
			const worker = create300msIntervalWorker(function() {
				isAutoBattleActive(function(currentBattleStatus) {
					if (lastBattleStatus !== currentBattleStatus) {
						worker.terminate();
						mainPageForm.submit();
					}
				});
			});
		})
		
	}
});

