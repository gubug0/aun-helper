(function() {
	function clearBattleCount(callback) {
		chrome.storage.local.set({"battleCount": 0}, callback);
	}
	function getGuildWarAlarmConfig(callback) {
		chrome.storage.local.get(["guildWarAlarmLimit", "guildWarAlarmDuration", "alarmSound", "guildWarAlarmActivation", "guildWarNeedAlarm", "guildWarTime"], function(data) {
			if (data.guildWarAlarmLimit === undefined) {
				data.guildWarAlarmLimit = 300;
			} 
			if (data.guildWarAlarmDuration === undefined) {
				data.guildWarAlarmDuration = 30;
			}
			if (data.alarmSound === undefined) {
				data.alarmSound = false;
			}
			if (data.guildWarAlarmActivation === undefined) {
				data.guildWarAlarmActivation = true;
			}
			if (data.guildWarNeedAlarm === undefined) {
				data.guildWarNeedAlarm = false;
			}
			
			if (callback) {
				callback(data);
			}
		});
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

	function getCityRefreshNeed(callback) {
		chrome.storage.local.get(["cityRefresh"], function(data) {
			if (data.cityRefresh === undefined) {
				data.cityRefresh = false;
			}

			if (callback) {
				callback(data);
			}
		});
	}
	function getDarkLogConfig(callback) {
		chrome.storage.local.get(["darkLog"], function(data) {
			if (data.darkLog === undefined) {
				data.darkLog = true;
			}

			if (callback) {
				callback(data);
			}
		});
	}

	function setInventorySortConfig(value, callback) {
		chrome.storage.local.set({"inventorySort": value}, callback);
	}
	
	function getGuildMapConfig(callback) {
		chrome.storage.local.get(["guildMap"], function(data) {
			if (data.guildMap === undefined) {
				data.guildMap = false;
			}

			if (callback) {
				callback(data);
			}
		});
	}

	function setDarkLog(value, callback) {
		chrome.storage.local.set({"darkLog": value}, callback);
	}
	function setGuildMap(value, callback) {
		chrome.storage.local.set({"guildMap": value}, callback);
	}
	function setRefreshAlarmActivation(value, callback) {
		chrome.storage.local.set({"refreshAlarmActivation": value}, callback);
	}
	function setGuildWarAlarmDurationConfig(guildWarAlarmDuration, guildWarAlarmLimit, callback) {
		chrome.storage.local.set({"guildWarAlarmDuration": guildWarAlarmDuration, "guildWarAlarmLimit": guildWarAlarmLimit}, callback);
	}
	function setGuildWarAlarmActivation(value, callback) {
		chrome.storage.local.set({"guildWarAlarmActivation": value}, callback);
	}
	function setGuildWarNeedAlarm(value, callback) {
		chrome.storage.local.set({"guildWarNeedAlarm": value}, callback);
	}
	function setAlarmSound(value, callback) {
		chrome.storage.local.set({"alarmSound": value}, callback);
	}
	function getRefreshedTimeStatus(callback) {
		chrome.storage.local.get(["refreshedTime", "waterStatus"], callback);
	}
	
	function updateActiveButton() {
		chrome.storage.local.get(["isAutoBattle"], function(data) {
			const activateAutoButton = document.querySelector("#activateAuto")
			if (!data.isAutoBattle) {
				activateAutoButton.innerHTML = "자동사냥 시작";
				activateAutoButton.classList.remove("error");
			} else {
				document.querySelector("#activateAuto").innerHTML = "자동사냥 종료";
				activateAutoButton.classList.add("error");
			}
		});
	}
	
	function updateEtcButton() {
		getGuildWarAlarmConfig(function(data) {
			const alarmSoundButton = document.querySelector("#alarmSound");
			if (!data.alarmSound) {
				alarmSoundButton.innerHTML = "알람소리O";
				alarmSoundButton.classList.remove("error");
			} else {
				alarmSoundButton.innerHTML = "알람소리X";
				alarmSoundButton.classList.add("error");
			}
		})
		getGuildMapConfig(function(data) {
			const guildMapButton = document.querySelector("#guildMap");
			if (data.guildMap) {
				guildMapButton.innerHTML = "길드맵O";
				guildMapButton.classList.remove("error");
			} else {
				guildMapButton.innerHTML = "길드맵X";
				guildMapButton.classList.add("error");
			}
		})
		getRefreshAlarmConfig(function(data) {
			const activationButton = document.querySelector("#changeActivationRefreshAlarm");

			if (data.refreshAlarmActivation) {
				activationButton.innerHTML = "상생 알람 종료"
				activationButton.classList.add("error");
			} else {
				activationButton.innerHTML = "상생 알람 사용"
				activationButton.classList.remove("error");
			}
		})
		getInventorySortConfig(function(data) {
			const inventorySortButton = document.querySelector("#inventorySort");
			if (data.inventorySort) {
				inventorySortButton.innerHTML = "인벤O";
				inventorySortButton.classList.remove("error");
			} else {
				inventorySortButton.innerHTML = "인벤X";
				inventorySortButton.classList.add("error");
			}
		})
		getDarkLogConfig(function(data) {
			const darkLogButton = document.querySelector("#darkLog");
			if (data.darkLog) {
				darkLogButton.innerHTML = "다크몹O";
				darkLogButton.classList.remove("error");
			} else {
				darkLogButton.innerHTML = "다크몹X";
				darkLogButton.classList.add("error");
			}
		})
	}
	
	function updateGuildWarAlarmActivationButton() {
		getGuildWarAlarmConfig(function(data) {
			const activationButton = document.querySelector("#changeActivationGuildWarAlarm");
			const guildWarStatus = document.querySelector("#guildWarStatus");
			if (data.guildWarAlarmActivation) {
				activationButton.innerHTML = "길드전 알람 종료"
				activationButton.classList.add("error");
				guildWarStatus.classList.remove("config_hide");
			} else {
				activationButton.innerHTML = "길드전 알람 사용"
				activationButton.classList.remove("error");
				guildWarStatus.classList.add("config_hide");
			}
		})
	}
	
	function updateBattleDuration() {
		chrome.storage.local.get(["autoBattleDuration", "autoBattleFiveSecDuration"], function(data) {
			if (data.autoBattleDuration === undefined) {
				document.querySelector("#battleDuration").value = "9000";
			} else {
				document.querySelector("#battleDuration").value = data.autoBattleDuration;
			}
			if (data.autoBattleFiveSecDuration === undefined) {
				document.querySelector("#battleFiveSecDuration").value = "4000";
			} else {
				document.querySelector("#battleFiveSecDuration").value = data.autoBattleFiveSecDuration;
			}
		});
	}
	
	function updateAutoBattleLog() {
		chrome.storage.local.get(["autoBattleLog"], function(data) {
			if (data.autoBattleLog === undefined) {
				data.autoBattleLog = ""
			}
			const logDom = document.querySelector("#autoBattleLog")
			logDom.innerHTML = data.autoBattleLog
		});
	}
	
	function updateBattleLog() {
		chrome.storage.local.get(["battleLog"], function(data) {
			if (data.battleLog === undefined) {
				data.battleLog = ""
			}
			const logDom = document.querySelector("#log")
			logDom.innerHTML = data.battleLog
		});
	}

	function updateBossStatus() {
		chrome.storage.local.get(["bossTitle", "bossParticipant"], function(data) {
			const bossTitle = document.querySelector("#bossTitle");
			if (bossTitle) bossTitle.innerHTML = data.bossTitle;
			const bossParticipant = document.querySelector("#bossStatus");
			if (bossParticipant) bossParticipant.innerHTML = data.bossParticipant;
		});
	}
	
	function clearBattleLog() {
		chrome.storage.local.set({"battleLog": ""}, updateBattleLog);
	}
	
	function getCurrentDateString() { 
		function pad(n) { return n < 10 ? "0" + n : n } 
		const d = new Date() 
		return pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()) 
	}
	
	function getDateString(time) { 
		function pad(n) { return n < 10 ? "0" + n : n } 
		const d = new Date(time)
		return pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()) 
	}
	
	function addLog(str) {
		chrome.storage.local.get(["battleLog"], function(data) {
			const allLog = "[" + getCurrentDateString() + "] " + str + "\n" + data.battleLog
			var splitLogs = allLog.split("\n");
			
			if (splitLogs.length > 2000) {
				splitLogs = splitLogs.slice(0, 2000)
			}
			chrome.storage.local.set({"battleLog": splitLogs.join("\n")}, function() {
				
			})
		})
	}

	function checkChatNotification() {
		chrome.storage.local.get(["keywordNotificationTitle", "keywordNotificationContent", "alarmSound"], function(data) {
			if (data.keywordNotificationTitle && data.keywordNotificationContent) {
				chrome.storage.local.set({"keywordNotificationTitle": "", "keywordNotificationContent" : ""}, function() {

				});
				chrome.notifications.create({
					type: 'basic',
					iconUrl: 'logo.png',
					title: data.keywordNotificationTitle,
					message: data.keywordNotificationContent,
					silent: !!data.alarmSound,
					priority: 2
				});
			}
		});
	}
	
	function sendNotification(isAlarmSound) {
		chrome.notifications.create({
			type: 'basic',
			iconUrl: 'logo.png',
			title: "에타츠 헬퍼",
			message: '길드의 영토를 넓힐 때입니다.',
			silent: !!isAlarmSound,
			priority: 2
		});
	}
	
	function createWebWorker(workercode, action) {
		let code = workercode.toString();
		code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

		const blob = new Blob([code], { type: "application/javascript" });
		const worker_script = new Worker(URL.createObjectURL(blob));

		worker_script.onmessage = ({ data: { data } }) => {
			action();
		};
		
		return worker_script;
	}

	function create1000msIntervalWorker(action) {
		const workercode = () => {
		  setInterval(() => {
			self.postMessage({ done: "done" });
		  }, 1000);
		};
		
		return createWebWorker(workercode, action);
	}
	
	create1000msIntervalWorker(function() {
		getGuildWarAlarmConfig(function(data) {
			if (!data.guildWarTime || !data.guildWarAlarmActivation) {
				return;
			}
			
			updateGuildWarStatus(data);
			const currentTime = new Date().getTime()
			if (data.guildWarNeedAlarm && currentTime - data.guildWarTime >= 1000 * 60 * 10) {
				sendNotification(data.alarmSound);
				setGuildWarNeedAlarm(false);
			} else if (!data.guildWarNeedAlarm) {
				const delayedTimeSecond = Math.floor((currentTime - data.guildWarTime) / 1000) - 600
				if (delayedTimeSecond <= data.guildWarAlarmLimit && delayedTimeSecond % data.guildWarAlarmDuration === 0) {
					sendNotification(data.alarmSound);
				}
			}
		});
	});
	
	function updateGuildWarStatus() {
		getGuildWarAlarmConfig(function(data) {
			const guildWarStatusText = document.querySelector("#guildWarStatus");
			if (data.guildWarTime === undefined) {
				guildWarStatusText.innerHTML = "알수없음";
				guildWarStatusText.classList.add("guild_success");
				guildWarStatusText.classList.remove("guild_fail");
				return;
			} 
			
			const currentTime = new Date().getTime()
			if (currentTime - data.guildWarTime >= 1000 * 60 * 10) {
				guildWarStatusText.innerHTML = "길드전 수행가능";
				guildWarStatusText.classList.add("guild_success");
				guildWarStatusText.classList.remove("guild_fail");
			} else {
				guildWarStatusText.innerHTML = "길드전 수행불가(" + Math.floor(600 - ((currentTime - data.guildWarTime)) / 1000) + "s)";
				guildWarStatusText.classList.remove("guild_success");
				guildWarStatusText.classList.add("guild_fail");
			}
		});
	}
	
	function updateGuildWarAlarmDurationConfig() {
		getGuildWarAlarmConfig(function(data) {
			document.querySelector("#guildWarAlarmDuration").value = data.guildWarAlarmDuration
			document.querySelector("#guildWarAlarmLimit").value = data.guildWarAlarmLimit
		});
	}
	
	function updateRefreshedTime() {
		getRefreshedTimeStatus(function(data) {
			const refreshStatusDom = document.querySelector("#refreshStatus");
			if (refreshStatusDom) {
				const refreshedTime = data.refreshedTime
				const waterStatus = data.waterStatus
				
				if (refreshedTime === undefined) {
					refreshStatusDom.innerHTML = "상생 기록 없음";
					refreshStatusDom.classList.add("refresh_success");
					refreshStatusDom.classList.remove("refresh_fail");
				} else {
					var htmlText = `상생 ${getDateString(refreshedTime)}`;
					if (waterStatus !== undefined) {
						if (waterStatus) {
							htmlText += " (수분부족)";
							refreshStatusDom.classList.add("refresh_fail");
							refreshStatusDom.classList.remove("refresh_success");
						} else {
							refreshStatusDom.classList.add("refresh_success");
							refreshStatusDom.classList.remove("refresh_fail");
						}
					} else {
						refreshStatusDom.classList.add("refresh_success");
						refreshStatusDom.classList.remove("refresh_fail");
					}
					refreshStatusDom.innerHTML = htmlText;
					
				}
			}
		});
	}

	function updateGuildStatus() {
		try {
			var headers = new Headers();
			headers.append('Content-Type','text/html; charset=EUC-KR');
			fetch('https://aun.kr/guild', headers).then((response) => response.text()).then(html => {
				if (!html.startsWith("<!DOCTYPE")) html = html.substring(html.indexOf("<TABLE"), html.indexOf("</TABLE>") + 8);
				var parser = new DOMParser();
				var doc = parser.parseFromString(html, "text/html");
				var guildList = doc.querySelectorAll("tr");
				var guildDataArray = [];
				for (var index = 0; index < guildList.length; index ++) {
					if (index === 0) continue;
					var guildDataObject = {};
					var guildItem = guildList[index];
					var guildRank = guildItem.querySelector("nobr");
					if (guildRank != null && guildRank.textContent != null && guildRank.textContent.length > 0) {
						guildDataObject.rank = guildRank.textContent;
					} else {
						guildDataObject.rank = 0;
					}
					var guildName = guildItem.querySelector("h3 b");
					if (guildName != null && guildName.textContent != null && guildName.textContent.length > 0) {
						guildDataObject.title = guildName.textContent;
					} else {
						guildDataObject.title = "";
					}
					var guildImage = guildItem.querySelector("img");
					if (guildImage != null && guildImage.src != null && guildImage.src.length > 0) {
						guildDataObject.image = guildImage.src;
					} else {
						guildDataObject.image = "";
					}
					guildDataArray.push(guildDataObject);
				}
				if (guildDataArray.length > 0) {
					chrome.storage.local.set({"guildData": guildDataArray}, function() {

					});
				} else {
					console.log("guildDataArray is Empty")
				}
			});
		} catch (e) {
			console.log(e);
		}
	}

	function setCityRefreshNeed(value, callback) {
		chrome.storage.local.set({"cityRefresh": value}, callback);
	}

	function monitorCityUpdateNeeded() {
		getCityRefreshNeed(function(data) {
			if (data.cityRefresh) {
				setCityRefreshNeed(false, function() {
					updateCityStatus();
				})
			}
		})
	}

	function updateCityStatus() {
		try {
			const xhr = new XMLHttpRequest();
			xhr.responseType = "arraybuffer";
			xhr.onload = function() {
				const contenttype = xhr.getResponseHeader("content-type");
				var charset = contenttype.substring(contenttype.indexOf("charset=") + 8);
				charset = "euc-kr";
				const dataView = new DataView(xhr.response);
				const decoder = new TextDecoder(charset);
				var html = decoder.decode(dataView);
				if (!html.startsWith("<!DOCTYPE")) html = html.substring(html.indexOf("<TABLE"), html.indexOf("</TABLE>") + 8);
				var parser = new DOMParser();
				var doc = parser.parseFromString(html, "text/html");
				var cityList = doc.querySelectorAll("tr");
				var cityDataArray = [];
				for (var index = 0; index < cityList.length; index ++) {
					if (index === 0) continue;
					var cityDataObject = {};
					var cityItem = cityList[index];
					var cityDetails = cityItem.querySelectorAll("td");
					if (cityDetails == null || cityDetails.length <= 5) continue;
					var cityName = cityDetails[0];
					if (cityName != null && cityName.textContent != null && cityName.textContent.length > 0) {
						cityDataObject.title = cityName.textContent;
					} else {
						cityDataObject.title = "";
					}
					var cityOwner = cityDetails[1];
					if (cityOwner != null && cityOwner.textContent != null && cityOwner.textContent.length > 0) {
						cityDataObject.owner = cityOwner.textContent;
					} else {
						cityDataObject.owner = "";
					}
					var cityNation = cityDetails[2];
					if (cityNation != null && cityNation.textContent != null && cityNation.textContent.length > 0) {
						cityDataObject.nation = cityNation.textContent;
					} else {
						cityDataObject.nation = "";
					}
					var cityGuild = cityDetails[3];
					if (cityGuild != null && cityGuild.textContent != null && cityGuild.textContent.length > 0) {
						cityDataObject.guild = cityGuild.textContent;
					} else {
						cityDataObject.guild = "";
					}
					var cityTemp = cityDetails[7];
					if (cityTemp != null && cityTemp.textContent != null && cityTemp.textContent.length > 0) {
						cityDataObject.temperature = cityTemp.textContent.replace("℃","").trim();
					} else {
						cityDataObject.temperature = 0;
					}
					cityDataArray.push(cityDataObject);
				}
				if (cityDataArray.length > 0) {
					chrome.storage.local.set({"cityData": cityDataArray}, function() {

					});
				} else {
					console.log("cityDataArray is Empty")
				}
			}
			xhr.open("GET", "https://aun.kr/tprint");
			xhr.send(null);
		} catch (e) {
			console.log(e);
		}
	}
	
	document.querySelector("#activateAuto").addEventListener("click", function() {
		
		chrome.storage.local.get(["isAutoBattle"], function(data) {
			var isActivate = !data.isAutoBattle
			clearBattleCount(function() {
				chrome.storage.local.set({"isAutoBattle": isActivate}, function() {
					updateActiveButton();
				});
			});

		});
	});
	
	document.querySelector("#changeDuration").addEventListener("click", function() {
		const duration = document.querySelector("#battleDuration").value
		const fiveSecDuration = document.querySelector("#battleFiveSecDuration").value 
		//TODO 숫자 검증 범위 검증
		chrome.storage.local.set({"autoBattleDuration": duration, "autoBattleFiveSecDuration": fiveSecDuration}, function() {
			updateBattleDuration();
		});
	});
	
	document.querySelector("#changeGuildWarAlarm").addEventListener("click", function() {
		const guildWarAlarmDuration = document.querySelector("#guildWarAlarmDuration").value 
		const guildWarAlarmLimit = document.querySelector("#guildWarAlarmLimit").value
		
		setGuildWarAlarmDurationConfig(guildWarAlarmDuration, guildWarAlarmLimit);
	});
	
	document.querySelector("#clearBattleLog").addEventListener("click", function() {
		clearBattleLog();
	});
	
	document.querySelector("#alarmSound").addEventListener("click", function() {
		getGuildWarAlarmConfig(function(data) {
			const isAlarmSound = !data.alarmSound
			
			setAlarmSound(isAlarmSound, function() {
				updateEtcButton();
			});
		});
	});

	document.querySelector("#guildMap").addEventListener("click", function() {
		getGuildMapConfig(function(data) {
			const isGuildMap = !data.guildMap

			setGuildMap(isGuildMap, function() {
				updateEtcButton();
			});
		});
	});

	document.querySelector("#inventorySort").addEventListener("click", function() {
		getInventorySortConfig(function(data) {
			const isInventorySort = !data.inventorySort

			setInventorySortConfig(isInventorySort, function() {
				updateEtcButton();
			});
		});
	});
	
	document.querySelector("#changeActivationGuildWarAlarm").addEventListener("click", function() {
		getGuildWarAlarmConfig(function(data) {
			const guildWarAlarmActivation = !data.guildWarAlarmActivation
			setGuildWarAlarmActivation(guildWarAlarmActivation, function() {
				updateGuildWarAlarmActivationButton();
			})
		});
	});
	
	document.querySelector("#changeActivationRefreshAlarm").addEventListener("click", function() {
		getRefreshAlarmConfig(function(data) {
			const refreshAlarmActivation = !data.refreshAlarmActivation
			setRefreshAlarmActivation(refreshAlarmActivation, function() {
				updateEtcButton();
			})
		});
	});

	document.querySelector("#darkLog").addEventListener("click", function() {
		getDarkLogConfig(function(data) {
			const darkLogStatus = !data.darkLog
			setDarkLog(darkLogStatus, function() {
				updateEtcButton();
			})
		});
	});
	
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			if (request.action === "refreshDetected") {
				getRefreshAlarmConfig(function(data) {
					const isAlarmSound = data.alarmSound;
					if (data.refreshAlarmActivation) {
						chrome.notifications.create({
							type: 'basic',
							iconUrl: 'logo.png',
							title: "에타츠 헬퍼",
							message: '채광과 낚시의 시간입니다.',
							silent: !!isAlarmSound,
							priority: 2
						});
					}
				});
				sendResponse({"response": "done"});
			}
		}
	);

	chrome.storage.local.set({"bossParticipant": "-", "bossTitle": "-"});
	
	updateAutoBattleLog();
	updateActiveButton();
	updateEtcButton();
	updateGuildWarAlarmActivationButton();
	updateBattleDuration();
	updateBattleLog();
	updateGuildWarStatus();
	updateGuildWarAlarmDurationConfig();
	updateRefreshedTime();
	updateGuildStatus();
	updateCityStatus();

	setInterval(updateBattleLog, 3000);
	setInterval(updateAutoBattleLog, 1000);
	setInterval(updateBossStatus, 1500);
	setInterval(updateRefreshedTime, 5000);
	setInterval(checkChatNotification, 1000);
	setInterval(updateGuildStatus, 600000);
	setInterval(updateCityStatus, 10000);
	setInterval(monitorCityUpdateNeeded, 1000);

	chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
		console.log("CHROME onMessageExternal (config.js) : " + request.method);
		if (request.method === "uchatMessage") {
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				console.log("CHROME onMessageExternal PASSED uchatMessage (config.js) : " + request);
				chrome.tabs.sendMessage(tabs[0].id, request, function(response) {
					sendResponse(response);
					console.log("CHROME onMessageExternal PASSED uchatMessage (config.js) : RESPONSE" + response.message);
				});
			});
			return true;
		}
		if (request.method === "uchatGold") {
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				console.log("CHROME onMessageExternal PASSED uchatGold (config.js) : " + request);
				chrome.tabs.sendMessage(tabs[0].id, request, function(response) {
					sendResponse(response);
					console.log("CHROME onMessageExternal PASSED uchatGold (config.js) : RESPONSE" + response.message);
				});
			});
			return true;
		}
	});
	console.log("CHROME onMessageExternal (config.js) SET");
})();