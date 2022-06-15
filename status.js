function handleAbilityChangePage() {
	if (window.location.pathname !== '/status.cgi') {
		return;
	}

	if (!document.querySelector("h1#shadow")) return;
	if (!document.querySelector("h1#shadow").textContent || !document.querySelector("h1#shadow").textContent.includes("어빌리티 변경")) return;

	console.log("status.js start ability page modification")
	getAbilitySetData(function(data) {
		if (!data) return;
		console.log("abilitySetA : " + JSON.stringify(data.abilitySetA));
		console.log("abilitySetB : " + JSON.stringify(data.abilitySetB));
		console.log("abilitySetC : " + JSON.stringify(data.abilitySetC));
		console.log("abilitySetD : " + JSON.stringify(data.abilitySetD));
		const abilityPageHolder = document.querySelector("table.table tbody");
		if (!abilityPageHolder) console.log("abilityPageHolder NULL");
		var abilityPageContent = abilityPageHolder.querySelectorAll("tr")[2];
		const abilityPageController = abilityPageHolder.querySelector("#abilityControlHolder");
		if (abilityPageContent === abilityPageController) abilityPageContent = abilityPageHolder.querySelectorAll("tr")[3];
		if (!abilityPageContent) console.log("abilityPageContent NULL");
		abilityPageHolder.removeChild(abilityPageContent);
		if (abilityPageController) abilityPageHolder.removeChild(abilityPageController);

		abilityPageHolder.querySelector("td[bgcolor='f1f1f1']").setAttribute("colspan", "2");

		const abilityControlHolder = document.createElement("tr");
		abilityControlHolder.id = "abilityControlHolder";
		abilityControlHolder.style.backgroundColor = "darkgray";

		const abilityControlHolderAB = document.createElement("td");
		abilityControlHolderAB.setAttribute("colspan", "1");
		const abilityControlHolderATitle = document.createElement("h3");
		abilityControlHolderATitle.id = "shadow";
		abilityControlHolderATitle.style.color = "white";
		abilityControlHolderATitle.innerHTML = "사냥어빌프리셋";
		abilityControlHolderAB.append(abilityControlHolderATitle);
		const abilityControlHolderAStatus = document.createElement("h4");
		abilityControlHolderAStatus.id = "shadow";
		abilityControlHolderAStatus.style.color = "white";
		if (data.abilitySetA) {
			abilityControlHolderAStatus.innerHTML = `${data.abilitySetA.mainAbilityName} / ${data.abilitySetA.classAbilityName}`;
		}
		abilityControlHolderAB.append(abilityControlHolderAStatus);
		const abilityControlHolderAButton = document.createElement("button");
		abilityControlHolderAButton.addEventListener("click", function () {
			const currentAbilityData = getCurrentAbilityData();
			if (!currentAbilityData) {
				alert("어빌리티 변경 목록 페이지에서 눌러주세요");
				return;
			}
			chrome.storage.local.set({"abilitySetA": currentAbilityData}, function () {
				handleAbilityChangePage();
			});
		});
		abilityControlHolderAButton.innerHTML = "새로저장";
		abilityControlHolderAB.append(abilityControlHolderAButton);

		const abilityControlHolderBTitle = document.createElement("h3");
		abilityControlHolderBTitle.id = "shadow";
		abilityControlHolderBTitle.style.color = "white";
		abilityControlHolderBTitle.innerHTML = "보스어빌프리셋";
		abilityControlHolderAB.append(abilityControlHolderBTitle);
		const abilityControlHolderBStatus = document.createElement("h4");
		abilityControlHolderBStatus.id = "shadow";
		abilityControlHolderBStatus.style.color = "white";
		if (data.abilitySetB) {
			abilityControlHolderBStatus.innerHTML = `${data.abilitySetB.mainAbilityName} / ${data.abilitySetB.classAbilityName}`;
		}
		abilityControlHolderAB.append(abilityControlHolderBStatus);
		const abilityControlHolderBButton = document.createElement("button");
		abilityControlHolderBButton.addEventListener("click", function () {
			const currentAbilityData = getCurrentAbilityData();
			if (!currentAbilityData) {
				alert("어빌리티 변경 목록 페이지에서 눌러주세요");
				return;
			}
			chrome.storage.local.set({"abilitySetB": currentAbilityData}, function () {
				handleAbilityChangePage();
			});
		});
		abilityControlHolderBButton.innerHTML = "새로저장";
		abilityControlHolderAB.append(abilityControlHolderBButton);

		abilityControlHolder.append(abilityControlHolderAB);

		const abilityControlHolderCD = document.createElement("td");
		abilityControlHolderCD.setAttribute("colspan", "1");
		const abilityControlHolderCTitle = document.createElement("h3");
		abilityControlHolderCTitle.id = "shadow";
		abilityControlHolderCTitle.style.color = "white";
		abilityControlHolderCTitle.innerHTML = "대인어빌프리셋";
		abilityControlHolderCD.append(abilityControlHolderCTitle);
		const abilityControlHolderCStatus = document.createElement("h4");
		abilityControlHolderCStatus.id = "shadow";
		abilityControlHolderCStatus.style.color = "white";
		if (data.abilitySetC) {
			abilityControlHolderCStatus.innerHTML = `${data.abilitySetC.mainAbilityName} / ${data.abilitySetC.classAbilityName}`;
		}
		abilityControlHolderCD.append(abilityControlHolderCStatus);
		const abilityControlHolderCButton = document.createElement("button");
		abilityControlHolderCButton.addEventListener("click", function () {
			const currentAbilityData = getCurrentAbilityData();
			if (!currentAbilityData) {
				alert("어빌리티 변경 목록 페이지에서 눌러주세요");
				return;
			}
			chrome.storage.local.set({"abilitySetC": currentAbilityData}, function () {
				handleAbilityChangePage();
			});
		});
		abilityControlHolderCButton.innerHTML = "새로저장";
		abilityControlHolderCD.append(abilityControlHolderCButton);

		const abilityControlHolderDTitle = document.createElement("h3");
		abilityControlHolderDTitle.id = "shadow";
		abilityControlHolderDTitle.style.color = "white";
		abilityControlHolderDTitle.innerHTML = "연금어빌프리셋";
		abilityControlHolderCD.append(abilityControlHolderDTitle);
		const abilityControlHolderDStatus = document.createElement("h4");
		abilityControlHolderDStatus.id = "shadow";
		abilityControlHolderDStatus.style.color = "white";
		if (data.abilitySetD) {
			abilityControlHolderDStatus.innerHTML = `${data.abilitySetD.mainAbilityName} / ${data.abilitySetD.classAbilityName}`;
		}
		abilityControlHolderCD.append(abilityControlHolderDStatus);
		const abilityControlHolderDButton = document.createElement("button");
		abilityControlHolderDButton.addEventListener("click", function () {
			const currentAbilityData = getCurrentAbilityData();
			if (!currentAbilityData) {
				alert("어빌리티 변경 목록 페이지에서 눌러주세요");
				return;
			}
			chrome.storage.local.set({"abilitySetD": currentAbilityData}, function () {
				handleAbilityChangePage();
			});
		});
		abilityControlHolderDButton.innerHTML = "새로저장";
		abilityControlHolderCD.append(abilityControlHolderDButton);

		abilityControlHolder.append(abilityControlHolderCD);

		if (abilityPageContent) {
			abilityPageHolder.append(abilityControlHolder);
			abilityPageHolder.append(abilityPageContent);
		}
	})
}

function getCurrentAbilityData() {
	const abilityHolder = document.querySelectorAll("td[colspan='2']")[1];
	const mainAbilityHolder = abilityHolder.querySelectorAll("table.table")[0];
	const classAbilityHolder = abilityHolder.querySelectorAll("table.table")[1];

	if (!mainAbilityHolder || !classAbilityHolder) return;

	const mainAbilityCurrentHolder = mainAbilityHolder.querySelectorAll("tr")[2];
	var mainAbilityIndex = -1;
	var mainAbilityName = "";
	if (mainAbilityCurrentHolder.textContent && mainAbilityCurrentHolder.textContent.startsWith("현재")) {
		mainAbilityName = mainAbilityCurrentHolder.querySelectorAll("td")[1].textContent.trim();
	}
	console.log("mainAbilityName : " + mainAbilityName);
	if (mainAbilityName.length > 0) {
		const mainAbilityOptions = mainAbilityHolder.querySelectorAll("tr");
		console.log("mainAbilityOptions.length : " + mainAbilityOptions.length);
		if (mainAbilityOptions.length > 2) {
			for (var index = 3; index < (mainAbilityOptions.length - 1); index ++) {
				console.log("mainAbilityOptions loop " + index);
				const mainAbilityOptionItem = mainAbilityOptions[index];
				var mainAbilityOptionItemIndex = -1;
				if (mainAbilityOptionItem.querySelector("input[name='skill']")) mainAbilityOptionItemIndex = mainAbilityOptionItem.querySelector("input[name='skill']").value;
				var mainAbilityOptionItemName = "없음";
				if (mainAbilityOptionItem.querySelectorAll("td") && mainAbilityOptionItem.querySelectorAll("td").length > 1) mainAbilityOptionItemName = mainAbilityOptionItem.querySelectorAll("td")[1].textContent.trim();
				console.log(mainAbilityOptionItemIndex + " : " + mainAbilityOptionItemName);
				if (mainAbilityName === mainAbilityOptionItemName) {
					mainAbilityIndex = mainAbilityOptionItemIndex;
					break;
				}
			}
		}
	}

	const classAbilityCurrentHolder = classAbilityHolder.querySelectorAll("tr")[2];
	var classAbilityIndex = -1;
	var classAbilityName = "";
	if (classAbilityCurrentHolder.textContent && classAbilityCurrentHolder.textContent.startsWith("현재")) {
		classAbilityName = classAbilityCurrentHolder.querySelectorAll("td")[1].textContent.trim();
	}
	console.log("classAbilityName : " + classAbilityName);
	if (classAbilityName.length > 0) {
		const classAbilityOptions = classAbilityHolder.querySelectorAll("tr");
		console.log("classAbilityOptions.length : " + classAbilityOptions.length);
		if (classAbilityOptions.length > 2) {
			for (var index = 3; index < (classAbilityOptions.length - 1); index ++) {
				console.log("classAbilityOptions loop " + index);
				const classAbilityOptionItem = classAbilityOptions[index];
				var classAbilityOptionItemIndex = -1;
				if (classAbilityOptionItem.querySelector("input[name='skill2']")) classAbilityOptionItemIndex = classAbilityOptionItem.querySelector("input[name='skill2']").value;
				var classAbilityOptionItemName = "없음";
				if (classAbilityOptionItem.querySelectorAll("td") && classAbilityOptionItem.querySelectorAll("td").length > 1) classAbilityOptionItemName = classAbilityOptionItem.querySelectorAll("td")[1].textContent.trim();
				console.log(classAbilityOptionItemIndex + " : " + classAbilityOptionItemName);
				if (classAbilityName === classAbilityOptionItemName) {
					classAbilityIndex = classAbilityOptionItemIndex;
					break;
				}
			}
		}
	}

	const returnObject = {};
	returnObject.mainAbilityIndex = mainAbilityIndex;
	returnObject.mainAbilityName = mainAbilityName;
	if (mainAbilityName.length === 0 || mainAbilityName === "") returnObject.mainAbilityName = "없음";
	returnObject.classAbilityIndex = classAbilityIndex;
	returnObject.classAbilityName = classAbilityName;
	if (classAbilityName.length === 0 || classAbilityName === "") returnObject.classAbilityName = "없음";

	return returnObject;
}

$(document).ready(function() {
	handleAbilityChangePage();
});