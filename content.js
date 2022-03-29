function findBattleButton() {
	if (document.querySelector("form[action=bt]")) {
		return document.querySelector("form[action=bt]");
		
	} else if(document.querySelector("form[action='./bt']")) {
		return document.querySelector("form[action='./bt']");
	}
}
function getCurrentDateString() { 
	function pad(n) { return n<10 ? "0"+n : n } 
	const d=new Date() 
	return pad(d.getMonth()+1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()) 
}


function clearBattleCount(callback) {
	chrome.storage.sync.set({"battleCount": 0}, callback);
}
function increaseBattleCount(callback) {
	chrome.storage.sync.get(["battleCount"], function(data) {
		const result = data.battleCount + 1;
		chrome.storage.sync.set({battleCount: result}, function() {
			callback(result);
		});
	});
}

function setLastBattleTime(value, callback) {
	chrome.storage.sync.set({"lastBattle": value}, function() {
		callback(value);
	});
}

function getLastBattleTime(callback) {
	chrome.storage.sync.get(["lastBattle"], function(data) {
		var lastBattleTime = data.lastBattle
		if (lastBattleTime) {
			lastBattleTime = new Date(parseFloat(lastBattleTime));
			callback(lastBattleTime);
		} else {
			lastBattleTime = new Date();
			setLastBattleTime(lastBattleTime.getTime(), callback);
		}
	});
}

function setBattleDuration(battleDuration, callback) {
	chrome.storage.sync.set({"battleDuration": battleDuration}, callback);
}

function getBattleDuration(callback) {
	chrome.storage.sync.get(["battleDuration"], function(data) {
		var battleDuration = data.battleDuration
		if (battleDuration === undefined) {
			battleDuration = 9500;
			setBattleDuration(battleDuration, function() {
				callback(battleDuration);
			});
		} else {
			callback(battleDuration);
		}
	});
}

function addLog(str) {
	chrome.storage.sync.get(["battleLog"], function(data) {
		const allLog = data.battleLog + "\n[" + getCurrentDateString() + "] " + str
		var splitLogs = allLog.split("\n");
		
		if (splitLogs.length > 100) {
			splitLogs = splitLogs.slice(splitLogs.length - 100, splitLogs.length)
		}
		chrome.storage.sync.set({"battleLog": splitLogs.join("\n")}, function() {
			
		})
	})
}

function submitBattle(callback) {
	const currentTime = new Date()
	setLastBattleTime(currentTime.getTime(), function() {
		increaseBattleCount(callback);
	});
}

function executeBattle() {
	var callCount = 0
	const timerRun = function() {
		if (!document.querySelector("#reload .hanna")) {
			return;
		}
		
		getLastBattleTime(function(lastBattleTime) {
			var currentTime = new Date();
			getBattleDuration(function(battleDuration) {
				if (currentTime.getTime() - lastBattleTime.getTime() >= battleDuration) {
					console.log("화면에서는 " + document.querySelector("#reload .hanna b").textContent + "초가 남았다고 하네요.");
					console.log("" + ((currentTime.getTime() - lastBattleTime.getTime())/1000) + "초만에 사냥을 합니다.");
					console.log("사냥을 시작합니다.");
					submitBattle(function(battleCount) {
						addLog("" + battleCount + "번째 전투(delay=" + ((currentTime.getTime() - lastBattleTime.getTime())/1000) + "s)");
						document.querySelector("form[action=bt]").submit();
					});
				} else {
					if (callCount % 50 == 0) {
						console.log("화면에서는 " + document.querySelector("#reload .hanna b").textContent + "초가 남았다고 하네요.");
						console.log("최근 사냥부터 " + ((currentTime.getTime() - lastBattleTime.getTime())/1000) + "초가 지났습니다.");
					}
				}
				callCount += 1;
			});
		});		
	}

	const formDom = document.querySelector("form[action=bt]");
	if (formDom) {
		formDom.removeAttribute("name")
	}
	
	const workercode = () => {
	  let timerInterval;
	  let time = 0;
	  self.onmessage = function ({ data: { turn } }) {
		if (turn === "off" || timerInterval) {
		  clearInterval(timerInterval);
		  time = 0;
		}
		if (turn === "on") {
		  timerInterval = setInterval(() => {
			time += 1;
			self.postMessage({ time });
		  }, 50);
		}
	  };
	};

	let code = workercode.toString();
	code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

	const blob = new Blob([code], { type: "application/javascript" });
	const worker_script = new Worker(URL.createObjectURL(blob));

	worker_script.onmessage = ({ data: { time } }) => {
		timerRun();
	};
	worker_script.postMessage({ turn: "on" })
}

function injectConfigPage(srcFile) {
	if (!document.querySelector("frame[name=topFrame]")) {
		return;
	}
	const configFrame = document.createElement("frame");
	configFrame.name = "configFrame"
	configFrame.src = srcFile
	configFrame.scrolling = "no"
	
	const frameset = document.createElement('frameset');
	frameset.rows =  "*,300"

	const topFrame = document.querySelector("frame[name=topFrame]")
	const parentFrameset = topFrame.parentElement
	topFrame.remove()
	frameset.appendChild(topFrame);
	frameset.appendChild(configFrame);


	parentFrameset.insertBefore(frameset, parentFrameset.firstChild)
}

$(document).ready(function() {
	var battleButton = findBattleButton();
	if (battleButton) {
		battleButton.addEventListener("submit", function() {
			clearBattleCount(() => {
				submitBattle(() => {
					addLog("전투를 시작합니다.");
				});
			});
		});
	}
	
	chrome.storage.sync.get(["isActive"], function(data) {
		if (data.isActive === undefined) {
			chrome.storage.sync.set({"isActive":true}, function() {
				executeBattle();
			});
		} else if (data.isActive) {
			executeBattle();
		}
	});
				
	injectConfigPage(chrome.runtime.getURL('config.html'));
});

