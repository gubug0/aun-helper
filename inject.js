(function() {
	const getLastBattleTime = function() {
		var lastBattleTime = localStorage.getItem("lastBattle")
		if (lastBattleTime) {
			lastBattleTime = new Date(parseFloat(lastBattleTime));
		} else {
			lastBattleTime = new Date();
			localStorage.setItem("lastBattle", new Date().getTime());
		}
		
		return lastBattleTime;
	}

	const findBattleButton = function() {
		if (document.querySelector("form[action=bt]")) {
			return document.querySelector("form[action=bt]");
			
		} else if(document.querySelector("form[action='./bt']")) {
			return document.querySelector("form[action='./bt']");
		}
	}

	const submitBattle = function() {
		const lastBattleTime = getLastBattleTime();
		const currentTime = new Date()
		localStorage.setItem("lastBattle", currentTime.getTime());
	}
	
	const is5SecondsBattleUser = function() {
		return Array.from(document.querySelectorAll(".offer.offer-radius.table font")).filter(item => item.textContent.includes("5초사냥 사용자, 보너스 ON")).length > 0
	}

	var callCount = 0
	const timerRun = function() {
		if (!document.querySelector("#reload .hanna")) {
			return;
		}
		
		var lastBattleTime = getLastBattleTime();
		var currentTime = new Date();
		
		const fiveSecondsBattle = is5SecondsBattleUser();
		
		const battleDuration = fiveSecondsBattle ? 4500 : 9500;		
		if (currentTime.getTime() - lastBattleTime.getTime() >= battleDuration) {
			if (fiveSecondsBattle) {
				console.log("5초사냥 유저입니다.");
			}
			console.log("화면에서는 " + document.querySelector("#reload .hanna b").textContent + "초가 남았다고 하네요.");
			console.log("" + ((currentTime.getTime() - lastBattleTime.getTime())/1000) + "초만에 사냥을 합니다.");
			console.log("사냥을 시작합니다.");
			submitBattle();
			document.querySelector("form[action=bt]").submit()
		} else {
			if (callCount % 50 == 0) {
				console.log("화면에서는 " + document.querySelector("#reload .hanna b").textContent + "초가 남았다고 하네요.");
				console.log("최근 사냥부터 " + ((currentTime.getTime() - lastBattleTime.getTime())/1000) + "초가 지났습니다.");
			}
		}
		
		callCount += 1;
	}


	const formDom = document.querySelector("form[action=bt]");
	if (formDom) {
		formDom.removeAttribute("name")
	}
		
	var battleButton = findBattleButton();
	if (battleButton) {
		battleButton.addEventListener("submit", function() {
			submitBattle();
		});
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
})();