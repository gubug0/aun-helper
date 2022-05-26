(function() {
	function clearBattleCount(callback) {
		chrome.storage.local.set({"battleCount": 0}, callback);
	}
	function getGuildWarAlarmConfig(callback) {
		chrome.storage.local.get(["guildWarAlarmLimit", "guildWarAlarmDuration", "guildWarAlarmSound", "guildWarAlarmActivation", "guildWarNeedAlarm", "guildWarTime"], function(data) {
			if (data.guildWarAlarmLimit === undefined) {
				data.guildWarAlarmLimit = 300;
			} 
			if (data.guildWarAlarmDuration === undefined) {
				data.guildWarAlarmDuration = 30;
			}
			if (data.guildWarAlarmSound === undefined) {
				data.guildWarAlarmSound = false;
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
	function setGuildWarAlarmDurationConfig(guildWarAlarmDuration, guildWarAlarmLimit, callback) {
		chrome.storage.local.set({"guildWarAlarmDuration": guildWarAlarmDuration, "guildWarAlarmLimit": guildWarAlarmLimit}, callback);
	}
	function setGuildWarAlarmActivation(value, callback) {
		chrome.storage.local.set({"guildWarAlarmActivation": value}, callback);
	}
	function setGuildWarNeedAlarm(value, callback) {
		chrome.storage.local.set({"guildWarNeedAlarm": value}, callback);
	}
	function setGuildWarAlarmSound(value, callback) {
		chrome.storage.local.set({"guildWarAlarmSound": value}, callback);
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
			const alarmSoundButton = document.querySelector("#guildWarAlarmSound");
			if (!data.guildWarAlarmSound) {
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
		function pad(n) { return n<10 ? "0"+n : n } 
		const d=new Date() 
		return pad(d.getMonth()+1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()) 
	}
	
	function addLog(str) {
		chrome.storage.local.get(["battleLog"], function(data) {
			const allLog = "[" + getCurrentDateString() + "] " + str + "\n" + data.battleLog
			var splitLogs = allLog.split("\n");
			
			if (splitLogs.length > 200) {
				splitLogs = splitLogs.slice(0, 200)
			}
			chrome.storage.local.set({"battleLog": splitLogs.join("\n")}, function() {
				
			})
		})
	}

	function updateBossStatus() {
		chrome.storage.local.get(["bossTitle", "bossParticipant"], function(data) {
			const bossTitle = document.querySelector("#bossTitle");
			if (bossTitle) bossTitle.innerHTML = data.bossTitle;
			const bossParticipant = document.querySelector("#bossStatus");
			if (bossParticipant) bossParticipant.innerHTML = data.bossParticipant;
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
				sendNotification(data.guildWarAlarmSound);
				setGuildWarNeedAlarm(false);
			} else if (!data.guildWarNeedAlarm) {
				const delayedTimeSecond = Math.floor((currentTime - data.guildWarTime) / 1000) - 600
				if (delayedTimeSecond <= data.guildWarAlarmLimit && delayedTimeSecond % data.guildWarAlarmDuration === 0) {
					sendNotification(data.guildWarAlarmSound);
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
	
	document.querySelector("#guildWarAlarmSound").addEventListener("click", function() {
		getGuildWarAlarmConfig(function(data) {
			const isAlarmSound = !data.guildWarAlarmSound
			
			setGuildWarAlarmSound(isAlarmSound, function() {
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
	
	updateActiveButton();
	updateAlarmSoundButton();
	updateGuildWarAlarmActivationButton();
	updateBattleDuration();
	updateBattleLog();
	updateGuildWarStatus();
	updateGuildWarAlarmDurationConfig();

	setInterval(updateBattleLog, 1000);
	setInterval(updateAutoBattleLog, 1000);
	setInterval(updateBossStatus, 1000);
})();