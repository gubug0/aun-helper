(function() {
	function clearBattleCount(callback) {
		chrome.storage.sync.set({"battleCount": 0}, callback);
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
	
	function updateBattleDuration() {
		chrome.storage.sync.get(["autoBattleDuration"], function(data) {
			if (data.autoBattleDuration === undefined) {
				document.querySelector("#battleDuration").value = "9000";
			} else {
				document.querySelector("#battleDuration").value = data.autoBattleDuration;
			}
		});
	}
	
	function updateBattleLog() {
		chrome.storage.sync.get(["battleLog"], function(data) {
			const logDom = document.querySelector("#log")
			logDom.innerHTML = data.battleLog
		});
	};
	
	function clearBattleLog() {
		chrome.storage.sync.set({"battleLog": ""}, updateBattleLog);
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
		//TODO 숫자 검증 범위 검증
		chrome.storage.sync.set({"autoBattleDuration": duration}, function() {
			updateBattleDuration();
		});
	});
	
	document.querySelector("#clearBattleLog").addEventListener("click", function() {
		clearBattleLog();
	});
	
	updateActiveButton();
	updateBattleDuration();
	updateBattleLog();
	setInterval(updateBattleLog, 1000);
	
})();