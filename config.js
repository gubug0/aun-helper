﻿(function() {
	function clearBattleCount(callback) {
		chrome.storage.local.set({"battleCount": 0}, callback);
	}
	function updateActiveButton() {
		chrome.storage.sync.get(["isAutoBattle"], function(data) {
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
		chrome.storage.sync.get(["isAlarmSound"], function(data) {
			const alarmSoundButton = document.querySelector("#alarmSound");
			if (!data.isAlarmSound) {
				alarmSoundButton.innerHTML = "알람소리O";
				alarmSoundButton.classList.remove("error");
			} else {
				alarmSoundButton.innerHTML = "알람소리X";
				alarmSoundButton.classList.add("error");
			}
		});
	}
	
	function updateBattleDuration() {
		chrome.storage.sync.get(["autoBattleDuration", "autoBattleFiveSecDuration"], function(data) {
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
	
	function getGuildWarTimeAndAlarm(callback) {
		chrome.storage.sync.get(["guildwarTime", "guildwarAlarm"], callback);
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
		getGuildWarTimeAndAlarm(function(data) {
			if (data.guildwarAlarm === undefined || data.guildwarTime === undefined) {
				return;
			}
			updateGuildWarStatus();
			const currentTime = new Date().getTime()
			if (data.guildwarAlarm && currentTime - data.guildwarTime >= 1000 * 60 * 10) {
				chrome.storage.sync.get(["isAlarmSound"], function(data) {
					sendNotification(data.isAlarmSound);
					chrome.storage.sync.set({"guildwarAlarm": false});
				});
			}
		});
	});
	
	function updateGuildWarStatus() {
		getGuildWarTimeAndAlarm(function(data) {
			const guildWarStatusText = document.querySelector("#guildWarStatus");
			if (data.guildwarTime === undefined) {
				guildWarStatusText.innerHTML = "길드전 수행가능";
				guildWarStatusText.classList.add("guild_success");
				guildWarStatusText.classList.remove("guild_fail");
				return;
			} 
			
			const currentTime = new Date().getTime()
			if (currentTime - data.guildwarTime >= 1000 * 60 * 10) {
				guildWarStatusText.innerHTML = "길드전 수행가능";
				guildWarStatusText.classList.add("guild_success");
				guildWarStatusText.classList.remove("guild_fail");
			} else {
				guildWarStatusText.innerHTML = "길드전 수행불가(" + Math.floor(600 - ((currentTime - data.guildwarTime)) / 1000) + "s)";
				guildWarStatusText.classList.remove("guild_success");
				guildWarStatusText.classList.add("guild_fail");
			}
		});
	}
	
	document.querySelector("#activateAuto").addEventListener("click", function() {
		
		chrome.storage.sync.get(["isAutoBattle"], function(data) {
			var isActivate = !data.isAutoBattle
			clearBattleCount(function() {
				chrome.storage.sync.set({"isAutoBattle": isActivate}, function() {
					updateActiveButton();
				});
			});

		});
	});
	
	document.querySelector("#changeDuration").addEventListener("click", function() {
		const duration = document.querySelector("#battleDuration").value
		const fiveSecDuration = document.querySelector("#battleFiveSecDuration").value 
		//TODO 숫자 검증 범위 검증
		chrome.storage.sync.set({"autoBattleDuration": duration, "autoBattleFiveSecDuration": fiveSecDuration}, function() {
			updateBattleDuration();
		});
	});
	
	document.querySelector("#clearBattleLog").addEventListener("click", function() {
		clearBattleLog();
	});
	
	document.querySelector("#alarmSound").addEventListener("click", function() {
		chrome.storage.sync.get(["isAlarmSound"], function(data) {
			const isAlarmSound = !data.isAlarmSound
			
			chrome.storage.sync.set({"isAlarmSound": isAlarmSound}, function() {
				updateAlarmSoundButton();
			});
		});
	});
	
	updateActiveButton();
	updateAlarmSoundButton();
	updateBattleDuration();
	updateBattleLog();
	updateGuildWarStatus();

	setInterval(updateBattleLog, 1000);
	setInterval(updateAutoBattleLog, 1000);
	
})();