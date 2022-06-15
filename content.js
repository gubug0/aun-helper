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

function isBackgroundFrame(callback) {
	chrome.storage.local.get(["isBackgroundFrame"], function(data) {
		callback(data.isBackgroundFrame);
	});
}

function setBackgroundFrame(value, callback) {
	chrome.storage.local.set({"isBackgroundFrame": value}, callback);
}

function sendUserMessage(credential, targetId, message) {

}

function sendUserGold(credential, targetId, gold) {

}

function getGuildCityData(callback) {
	chrome.storage.local.get(["guildMap", "lastCity", "guildData", "cityData"], function(data) {
		if (data.guildMap === undefined) {
			data.guildMap = false;
		}
		if (data.lastCity === undefined) {
			data.lastCity = "";
		}
		if (data.guildData === undefined) {
			data.guildData = "";
		}
		if (data.cityData === undefined) {
			data.cityData = "";
		}

		if (callback) {
			callback(data);
		}
	});
}

function getCityData(cityDataArray, cityName) {
	if (cityDataArray == null) return null;
	try {
		for (var index = 0; index < cityDataArray.length; index ++) {
			var cityDataItem = cityDataArray[index];
			if (cityDataItem == null || cityDataItem.title == null) continue;
			if (cityDataItem.title != null && cityDataItem.title.trim() === cityName.trim()) {
				return cityDataItem;
			}
		}
	} catch (e) {
		console.log(e);
		return null;
	}
	return null;
}

function getGuildDataByName(guildDataArray, guildName) {
	if (guildDataArray == null) return null;
	try {
		for (var index = 0; index < guildDataArray.length; index ++) {
			var guildDataItem = guildDataArray[index];
			if (guildDataItem == null || guildDataItem.title == null) continue;
			if (guildDataItem.title.replace("길드", "").trim() === guildName.replace("길드", "").trim()) {
				return guildDataItem;
			}
		}
	} catch (e) {
		console.log(e);
		return null;
	}
	return null;
}

function getGuildDataByIndex(guildDataArray, guildIndex) {
	if (guildDataArray == null) return null;
	try {
		for (var index = 0; index < guildDataArray.length; index ++) {
			var guildDataItem = guildDataArray[index];
			if (guildDataItem == null || guildDataItem.title == null) continue;
			if (guildDataItem.guildIndex > 0 && guildDataItem.guildIndex === guildIndex) {
				return guildDataItem;
			}
		}
	} catch (e) {
		console.log(e);
		return null;
	}
	return null;
}

function setLastCity(value, callback) {
	chrome.storage.local.set({"lastCity": value}, callback);
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
	chrome.storage.local.get(["inventorySort", "inventoryFavorite"], function(data) {
		if (data.inventorySort === undefined) {
			data.inventorySort = true;
		}
		if (data.inventoryFavorite === undefined) {
			data.inventoryFavorite = [];
		}

		if (callback) {
			callback(data);
		}
	});
}

function setInventoryFavoriteConfig(value, callback) {
	chrome.storage.local.set({"inventoryFavorite": value}, callback);
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
	isBackgroundFrame(function(isBackgroundFrame) {
		if (isBackgroundFrame) return;
		injectConfigPage(chrome.runtime.getURL('config.html'));
	})

	/*
	if (document.querySelector("frame[name=mainFrame]")) {
		chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
			console.log("CHROME onMessage (content.js) : " + request.method);
			if (request.method === "uchatMessage") {
				chrome.storage.local.get(["userId", "userPass"], function(data) {
					if (!data.userId || !data.userPass) {
						console.log("no user credential");
						sendResponse({success: false, message: "사용자 정보가 없습니다..!"});
						return;
					}

					var credential = {};
					credential.userId = data.userId;
					credential.userPass = data.userPass;

					sendUserMessage(credential, request.uchatTargetId, request.uchatValue);
					console.log("uchat REQUEST : message : " + credential + ":" + request.uchatTargetId + ":" + request.uchatValue);
					sendResponse({success: false, message: `${request.uchatTargetNick}에게 전보 전송중`});
				});
				return true;
			}
			if (request.method === "uchatGold") {
				chrome.storage.local.get(["userId", "userPass"], function(data) {
					if (!data.userId || !data.userPass) {
						console.log("no user credential");
						sendResponse({success: false, message: "사용자 정보가 없습니다..!"});
						return;
					}

					var credential = {};
					credential.userId = data.userId;
					credential.userPass = data.userPass;

					sendUserGold(credential, request.uchatTargetId, request.uchatValue);
					console.log("uchat REQUEST : gold : " + credential + ":" + request.uchatTargetId + ":" + request.uchatValue);
					sendResponse({success: false, message: `${request.uchatTargetNick}에게 골드 ${request.uchatValue} 송금중`});
				});
				return true;
			}
		});
		console.log("CHROME onMessage (content.js) SET");
	}
	 */
	
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

