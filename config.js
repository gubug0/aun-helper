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
	
	function updateAlarmSoundButton() {
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
	};
	
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
	
	function updateRefreshAlarmActivationButton() {
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
				updateAlarmSoundButton();
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
				updateRefreshAlarmActivationButton();
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
	
	updateAutoBattleLog();
	updateActiveButton();
	updateAlarmSoundButton();
	updateGuildWarAlarmActivationButton();
	updateBattleDuration();
	updateBattleLog();
	updateGuildWarStatus();
	updateGuildWarAlarmDurationConfig();
	updateRefreshedTime();
	updateRefreshAlarmActivationButton();

	setInterval(updateBattleLog, 3000);
	setInterval(updateAutoBattleLog, 1000);
	setInterval(updateRefreshedTime, 5000);
	setInterval(checkChatNotification, 1000);
})();