function fishingAction() {
    if (window.location.pathname !== "/fishing") {
        return;
    }
    
    const message = document.querySelector("table tr td").textContent
    
    if (message.match(/수분량이 부족합니다. 다시 채워질 때 까지 기다리세요./)) {
		chrome.storage.local.set({"waterStatus": true});
    }
}

function miningAction() {
    if (window.location.pathname !== "/mining") {
        return;
    }
    
    const message = document.querySelector("table tr td").textContent
    
    if (message.match(/수분량이 부족합니다. 다시 채워질 때 까지 기다리세요./)) {
		chrome.storage.local.set({"waterStatus": true});
    }
}

$(document).ready(function() {
    fishingAction();
	miningAction();
});