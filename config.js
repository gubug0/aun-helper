(function() {
	function updateActiveButton() {
		chrome.storage.sync.get(["isActive"], function(data) {
			if (data.isActive === undefined || data.isActive) {
				document.querySelector("#activateAuto").innerHTML = "자동사냥 활성";
			} else {
				document.querySelector("#activateAuto").innerHTML = "자동사냥 정지";
			}
		});
	}
	
	function updateBattleDuration() {
		chrome.storage.sync.get(["battleDuration"], function(data) {
			if (data.battleDuration === undefined) {
				document.querySelector("#battleDuration").value = "9500";
			} else {
				document.querySelector("#battleDuration").value = data.battleDuration;
			}
		});
	}
	
	document.querySelector("#activateAuto").addEventListener("click", function() {
		chrome.storage.sync.get(["isActive"], function(data) {
			var isActivate = true
			if (data.isActive === undefined || data.isActive) {
				isActivate = false
			}
			chrome.storage.sync.set({"isActive": isActivate}, function() {
				updateActiveButton();
			});
		});
	});
	
	document.querySelector("#changeDuration").addEventListener("click", function() {
		const duration = document.querySelector("#battleDuration").value
		//TODO 숫자 검증 범위 검증
		chrome.storage.sync.set({"battleDuration": duration}, function() {
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