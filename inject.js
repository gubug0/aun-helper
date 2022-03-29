function getLastBattleTime() {
	var lastBattleTime = localStorage.getItem("lastBattle")
	if (lastBattleTime) {
		lastBattleTime = new Date(parseFloat(lastBattleTime));
	} else {
		lastBattleTime = new Date();
		localStorage.setItem("lastBattle", new Date().getTime());
	}
	
	return lastBattleTime;
}


function findBattleButton() {
	if (document.querySelector("form[action=bt]")) {
		return document.querySelector("form[action=bt]");
		
	} else if(document.querySelector("form[action='./bt']")) {
		return document.querySelector("form[action='./bt']");
	}
}


function submitBattle() {
	const lastBattleTime = getLastBattleTime();
	const currentTime = new Date()
	console.log("submit. duration = " + (currentTime.getTime() - lastBattleTime.getTime()));
	console.log("save to " + currentTime.getTime());
	localStorage.setItem("lastBattle", currentTime.getTime());
}


var callCount = 0
const timerRun = function() {
	if (!document.querySelector("#reload b font")) {
		return;
	}
	
	var lastBattleTime = getLastBattleTime();
	var currentTime = new Date();
	
	if (currentTime.getTime() - lastBattleTime.getTime() >= 10000) {
		console.log(lastBattleTime.getTime(), document.querySelector("#reload b font").innerHTML, currentTime.getTime() - lastBattleTime.getTime(), document.hidden); 
		submitBattle();
		document.querySelector("form[action=bt]").submit()
	} else {
		if (callCount % 50 == 0) {
			console.log(lastBattleTime.getTime(), document.querySelector("#reload b font").innerHTML, currentTime.getTime() - lastBattleTime.getTime(), document.hidden); 
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
	console.log("add listener.");
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
      }, 100);
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

