(function() {
	function clearBattleCount(callback) {
		chrome.storage.sync.set({"battleCount": 0}, callback);
	}
	function updateActiveButton() {
		chrome.storage.sync.get(["isAutoBattle"], function(data) {
			if (!data.isAutoBattle) {
				document.querySelector("#activateAuto").innerHTML = "자동사냥 시작";
			} else {
				document.querySelector("#activateAuto").innerHTML = "자동사냥 종료";
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
	
	updateActiveButton();
	updateBattleDuration();
	
	setInterval(function() {
		chrome.storage.sync.get(["battleLog"], function(data) {
			const logDom = document.querySelector("#log")
			logDom.innerHTML = data.battleLog
			logDom.scrollTo(0, logDom.scrollHeight);
		});
	}, 1000);
	
})();