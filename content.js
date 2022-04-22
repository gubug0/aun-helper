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
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function isAutoBattleActive(callback) {
	chrome.storage.sync.get(["isAutoBattle"], function(data) {
		callback(data.isAutoBattle);
	});
}


function getBattleCount(callback) {
	chrome.storage.sync.get(["battleCount"], function(data) {
		callback(data.battleCount);
	});
}

function increaseBattleCount(callback) {
	getBattleCount(function(battleCount) {
		const result = battleCount + 1;
		chrome.storage.sync.set({battleCount: result}, function() {
			callback(result);
		});
	});
}

function setBattleDuration(battleDuration, callback) {
	chrome.storage.sync.set({"autoBattleDuration": battleDuration}, callback);
}

function getBattleDuration(callback) {
	chrome.storage.sync.get(["autoBattleDuration"], function(data) {
		var battleDuration = data.autoBattleDuration
		if (battleDuration === undefined) {
			battleDuration = 9000;
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
		const allLog = "[" + getCurrentDateString() + "] " + str + "\n" + data.battleLog
		var splitLogs = allLog.split("\n");
		
		if (splitLogs.length > 100) {
			splitLogs = splitLogs.slice(0, 100)
		}
		chrome.storage.sync.set({"battleLog": splitLogs.join("\n")}, function() {
			
		})
	})
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

function create1000msTimeoutWorker(action) {
	const workercode = () => {
	  setTimeout(() => {
		self.postMessage({ done: "done" });
	  }, 1000);
	};
	return createWebWorker(workercode, action);
}

function create500msIntervalWorker(action) {
	const workercode = () => {
	  setInterval(() => {
		self.postMessage({ done: "done" });
	  }, 500);
	};
	
	return createWebWorker(workercode, action);
}

function create50msIntervalWorker(action) {
	const workercode = () => {
	  setInterval(() => {
		self.postMessage({ done: "done" });
	  }, 50);
	};
	
	return createWebWorker(workercode, action);
}

function create300msIntervalWorker(action) {
	const workercode = () => {
	  setInterval(() => {
		self.postMessage({ done: "done" });
	  }, 50);
	};
	
	return createWebWorker(workercode, action);
}

function addConfirmInnPage() {
	const innForm = document.querySelector("form[action='./town.cgi?'] input[name='mode'][value='inn']");
	if (innForm) {
		innForm.parentElement.addEventListener("submit", function(event){
			if(!confirm("여인숙으로 들어가실껀가요? 많은 골드가 소모될 수 있습니다.")) {
				event.preventDefault();
			}
		});
	}
}

function mainPageAction() {
	if (window.location.pathname !== "/MainPage" && window.location.pathname !== "/top.cgi") {
		return;
	}
	addConfirmInnPage();
	
	isAutoBattleActive(function(isActive) {
		if (!isActive) {
			return;
		}
		
		// 전투중 timeout 문제로 전투 실패발생
		if (document.querySelector(".esd2") && document.querySelector(".esd2").textContent.includes("★ 축하합니다! ★")) {
			addLog("전투 중 오류발생! 전투를 재시작합니다.");
			const worker = create1000msTimeoutWorker(function () {
				worker.terminate();
				document.querySelector("form[action='./top.cgi'").submit();
			});
		} else {
			const battleButton = findBattleButton();
			if (!battleButton) {
				return;
			}
			
			addLog("전투 버튼 활성화까지 대기합니다.");
			const worker = create500msIntervalWorker(function () {
				if (!battleButton.querySelector("input[type=submit]")) {
					return;
				}
				worker.terminate();
				battleButton.submit();
			});
		}
		
		
	})
	
	
}

function battlePageAction() {
	if (window.location.pathname !== "/bt") {
		return;
	}
	
	isAutoBattleActive(function(isActive) {
		if (!isActive) {
			return;
		}
		
		// 자동사냥 기능을 비활성화한다. DOM이 생성되지 않을 것을 대비해서 1초 딜레이 후, 비활성화
		const formRemoveWorker = create1000msTimeoutWorker(function() {
			const formDom = findBattleButton();
			if (formDom) {
				formDom.removeAttribute("name")
			}
			
			formRemoveWorker.terminate();
		});
		
		var callCount = 0;
		const pageLoadTime = new Date();
		getBattleDuration(function(battleDuration) {
			var retry = 0;
			const worker = create50msIntervalWorker(function() {
				if (!document.querySelector("#reload .hanna")) {
					retry += 1;
					console.log("retry...", retry);
					// 2초간은 retry 시도해줌
					if (retry > 40) {
						console.log("Cannot found DOM");
						worker.terminate();
					}
					return;
				}
				const currentTime = new Date();
				if (currentTime.getTime() - pageLoadTime.getTime() >= battleDuration) {
					worker.terminate();
					increaseBattleCount(function(battleCount) {
						addLog("" + battleCount + "번째 전투(delay=" + ((currentTime.getTime() - pageLoadTime.getTime())/1000) + "s)");
						findBattleButton().submit();
					});
				}
				callCount += 1;
			});
		});
		
		
		
	});
}

function stateUpAction() {
	if (window.location.pathname !== "/town.cgi") {
		return;
	}
	const stateUpMode = document.querySelector("form[action='./town.cgi'] input[name='mode'][value='hinn2']")
	if (!stateUpMode) {
		return;
	}
	
	const stateUpForm = stateUpMode.parentElement;
	const stateUpText = stateUpForm.querySelector("input[type='text'][name='abp']")
	
	const skillLevelTextArray = Array.from(document.querySelectorAll(".navbar.navbar-inverse.navbar-fixed-top div table tr td font")).map(item => item.textContent).filter(item => item.match(/숙련도: ([0-9,]+)/)).map(item => item.replace(/.*숙련도: ([0-9,]+) P.*/, "$1"))
	if (skillLevelTextArray.length != 1) {		
		return;
	}
	
	const discountText = document.querySelector(".col-md-10 .table td[bgcolor='f1f1f1'] font[color='red']");
	const discountRatePercent = discountText ? parseInt(discountText.textContent.replace(/.*그림으로 인해 ([0-9]+)％의 할인을 제공합니다.*/, "$1"), 10) : 0;
	const discountRate = (100 - discountRatePercent) / 100;
	const stateUpCost = Math.floor(12000 * discountRate);
	const maxUpCost = Math.floor(120 * discountRate);
	const allMaxUpCost = maxUpCost * 6;
	
	const skillLevel = parseInt(skillLevelTextArray[0].replace(/,/g, ""), 10);
	
	const stateUpCount = Math.floor(skillLevel / (stateUpCost + allMaxUpCost))
	const consumeSkillLevel = stateUpCount * stateUpCost
	
	const tableTbody = stateUpForm.parentElement.parentElement.parentElement
	
	const trDom = document.createElement("tr")
	const tdDom = document.createElement("td")
	tdDom.colspan="2"
	tdDom.align="right"
	tdDom.bgColor="white"
	tdDom.innerHTML = "현재 숙련도: <b>" + numberWithCommas(skillLevel) + "</b> P<br />"
		+ "할인률 : <b>" + discountRatePercent + "%</b><br />"
		+ "1업당 숙련도: <b>" + stateUpCost +" P</b><br />" 
		+ "연글제작 비용(연금술LV5 기준): <b>" + maxUpCost + " * 6 = " + allMaxUpCost + "</b><br />"
		+ "고급여관에서 소모할 총 숙련도: <b>" + numberWithCommas(consumeSkillLevel) + "</b><br />"
		+ "올라가는 스탯: <b>" + numberWithCommas(stateUpCount) + "</b><br />"
	const stateUpButton = document.createElement("input");
	stateUpButton.value="숙련도 자동 사용";
	stateUpButton.type="button";
	stateUpButton.classList.add("btn");
	stateUpButton.classList.add("btn-danger");
	stateUpButton.classList.add("btn3d"); 
	stateUpButton.addEventListener("click", function() {
		stateUpText.value = consumeSkillLevel;
		stateUpForm.submit()
	});
	
	tdDom.appendChild(stateUpButton);
	trDom.appendChild(tdDom);
	tableTbody.appendChild(trDom);
}

function purcharseCentorAction() {
	if (window.location.pathname !== "/town.cgi") {
		return;
	}
	const purcharseMode = document.querySelector("form[action='./town.cgi'] input[name='mode'][value='purch_shop2']")
	if (!purcharseMode) {
		return;
	}
	const purchaseForm = purcharseMode.parentElement;
	
	const inputBox = purchaseForm.querySelector("input[type='text'][name='gaes']");
	const rows = Array.from(purchaseForm.querySelectorAll("table tr td input[type=radio]")).map(item => item.parentElement.parentElement).filter(item => item.querySelectorAll("td")[3].bgColor === 'ffffcc')
	rows.forEach(row => {
		const itemCount = row.querySelector("td[bgcolor='ffffcc'] small").textContent.replace(/.*내보유량: (\d+)개.*/, "$1")
		const radioButton = row.querySelector("td input[type=radio]");
		
		const divDom = document.createElement("div");
		const sellAllButton = document.createElement("input");
		sellAllButton.value="전체매각";
		sellAllButton.type="button";
		sellAllButton.classList.add("btn");
		sellAllButton.classList.add("btn-danger");
		sellAllButton.classList.add("btn-sm");  
		sellAllButton.addEventListener("click", function() {
			radioButton.checked=true
			inputBox.value=itemCount
			purchaseForm.submit()
		});
		divDom.appendChild(sellAllButton)
		radioButton.parentElement.appendChild(divDom)
	});
}
$(document).ready(function() {
	mainPageAction();
	battlePageAction();
	purcharseCentorAction();
	stateUpAction();
	
	injectConfigPage(chrome.runtime.getURL('config.html'));
	
	const mainPageForm = document.querySelector("form[action=MainPage]")
	if (mainPageForm) {
		isAutoBattleActive(function(lastBattleStatus) {
			const worker = create300msIntervalWorker(function() {
				isAutoBattleActive(function(currentBattleStatus) {
					if (lastBattleStatus !== currentBattleStatus) {
						worker.terminate();
						if (currentBattleStatus) {
							addLog("전투를 시작합니다.");
						} else {
							addLog("전투를 종료합니다.");
						}
						mainPageForm.submit();
					}
				});
			});
		})
		
	}
});

function injectHeadScript() {
	isAutoBattleActive(function (isAutoBattle) {
		if (isAutoBattle) {
			_script = document.createElement('script');
			_script.setAttribute('src', chrome.runtime.getURL('head.js'));
			(document.head||document.documentElement).appendChild( _script  );
			_script.parentNode.removeChild( _script);
		}
	});
}
injectHeadScript();