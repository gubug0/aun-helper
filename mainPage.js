function runMainToBattle() {
	const battleButton = findBattleButton();
	
	const worker = create500msIntervalWorker(function () {
		if (!battleButton.querySelector("input[type=submit]")) {
			return;
		}
		worker.terminate();
		increaseBattleCount(function(battleCount) {
			setAutoBattleLog("[" + battleCount + "]전투");
			battleButton.submit();
		})
	});
}
function isBattleEndPage() {
	const battleEndPageDom = document.querySelector(".esd2")
	const purcharseCenterPageDom = document.querySelector("h1[id='shadow']")
	const newDayPageDom = document.querySelector("h1")
	if (battleEndPageDom && battleEndPageDom.textContent.includes("★ 축하합니다! ★")) {
		return true;
	} else if (purcharseCenterPageDom && purcharseCenterPageDom.textContent.match(/.*자동거래소 매입 확인서.*/)) {
		return true;
	} else if (newDayPageDom && newDayPageDom.textContent.match(/.*날이 밝았습니다..*/)) {
		return true;
	}
	
	return false;
}

function findAndAddPurchaseLog(callback) {
    const purcharseCenterPageDom = document.querySelector("h1[id='shadow']")
    if (purcharseCenterPageDom && purcharseCenterPageDom.textContent.match(/.*자동거래소 매입 확인서.*/)) {
        console.log("매입확인");
        const purcharseTableDom = document.querySelector('table.table.table-hover.table-bordered');
        if (purcharseTableDom) {
            const sellers = Array.from(purcharseTableDom.querySelectorAll("tr"))
            const logs = sellers.map((row, index) => {
                if (index <= 0) {
                    return;
                }
                const columns = Array.from(row.querySelectorAll("td"))
                if (columns.length < 5) {
                    return;
                }
                
                const nickname = columns[1].textContent
                const itemName = columns[2].textContent
                const itemCount = columns[4].textContent

                return `[매입] ${nickname}, ${itemName}, ${itemCount}개` ;
            }).filter(item => item !== undefined)
            
            if (logs.length > 0) {
                addMultiLog(logs, callback);
            } else {
                callback();
            }
        } else {
            console.log("Couldn't find dom");
            callback();
        }
    } else {
        callback();
    }
}

function findCurrentCity() {
	const currentLocationHolder = document.querySelector("big[data-step='4']");
	const currentLocation = currentLocationHolder && currentLocationHolder.textContent;
	return currentLocation && currentLocation.replace(/.*현위치≫ .*국 (.*)州.*/, '$1');
}

function updateGuildMap() {
	getGuildCityData(function (data) {
		if (!data.guildMap) {
			return;
		}
		if (!data.guildData || data.guildData === "") {
			console.log("no saved guild data");
			return;
		}
		if (!data.cityData || data.cityData === "") {
			console.log("no saved city data");
			return;
		}

		const currentCityName = findCurrentCity();
		if (!currentCityName) {
			return;
		}
		
		console.log("currentCityName SET " + currentCityName);
		setLastCity(currentCityName, function() {
			var worldMapList = document.querySelectorAll("div[class='cuadro_intro_hover']");
			if (!worldMapList && document.querySelector("frame[name='mainFrame']")) worldMapList = document.querySelector("frame[name='mainFrame']").contentWindow.document.querySelectorAll("div[class='cuadro_intro_hover']");
			if(!worldMapList) {
				//console.log("no worldmap found");
				return;
			}
			for (var index = 0; index < worldMapList.length; index ++) {
				var mapCityItem = worldMapList[index];
				var mapCityName = null;
				var mapCityNameArea = mapCityItem.querySelector("font");
				if (!mapCityNameArea) {
					//console.log("no mapCityNameArea");
					continue;
				}
				var mapCityNameRealArea = mapCityNameArea.querySelector("b");
				if (!mapCityNameRealArea) {
					//console.log("no mapCityNameRealArea");
					continue;
				}
				mapCityName = mapCityNameRealArea.textContent;
				if (mapCityName == null || !mapCityName.includes("州")) {
					//console.log("no mapCityName : " + mapCityName);
					continue;
				}
				var mapCityNameSubArea = mapCityNameArea.querySelector("small");
				var mapCityGuildIndex = 0;
				try {
					mapCityGuildIndex = mapCityNameSubArea.textContent.replace(/[^0-9]/g, "");
				} catch (e) {
					console.log(e);
				}
				if (mapCityNameSubArea) {
					try {
						mapCityNameArea.querySelector("nobr").removeChild(mapCityNameSubArea);
					} catch (e) {
						console.log(e);
					}
				}
				//console.log("checking : " + mapCityName.trim());
				var cityData = getCityData(data.cityData, mapCityName.trim());
				if (cityData == null) {
					//console.log("no cityData");
					continue;
				}
				mapCityNameArea.style.backgroundColor = "white";
				mapCityNameArea.style.color = "black";
				if (!mapCityItem.querySelector("form[action='./etc.cgi?']")) {
					// CURRENT LOCATED CITY
					mapCityNameArea.style.backgroundColor = "black";
					mapCityNameArea.style.color = "white";
				}
				if (cityData.temperature > 200) {
					mapCityNameArea.style.color = "orange";
				}
				if (cityData.temperature > 600) {
					mapCityNameArea.style.color = "darkorange";
				}
				if (cityData.temperature > 1400) {
					mapCityNameArea.style.color = "red";
				}
				var mapCityBackground = mapCityItem.querySelector("img")
				if (!mapCityBackground) {
					//console.log("no mapCityBackground");
					continue;
				}
				if (cityData.guild != null && cityData.guild !== "") {
					//console.log("finding guild index : " + mapCityGuildIndex);
					var guildData = getGuildDataByIndex(data.guildData, mapCityGuildIndex);
					if (!guildData) {
						guildData = getGuildDataByName(data.guildData, cityData.guild);
						console.log("guild index not found, search by name");
					}
					mapCityItem.style.backgroundColor = "transparent";
					mapCityBackground.style.maxWidth = "81px";
					if (guildData != null && guildData.image != null) {
						mapCityBackground.src = guildData.image;
					} else {
						mapCityBackground.src = "https://aun.kr/img/default_guild.png";
					}
				}
			}
		});
	})
}

function mainPageAction() {
	if (window.location.pathname !== "/MainPage" && window.location.pathname !== "/top.cgi") {
		return;
	}
	addConfirmInnPage();
	makeUserListToggleable();
	updateGuildMap();
	showAdditionalRank();

	isAutoBattleActive(function(isActive) {
		if (!isActive) {
			return;
		}
		
		// 전투중 timeout 문제로 전투 실패발생
		if (isBattleEndPage()) {
			findAndAddPurchaseLog(() => {
                addLog("전장복귀 대기", () => {
                    const worker = create1000msTimeoutWorker(function () {
                        worker.terminate();
                        document.querySelector("form[action='./top.cgi']").submit();
                    });
                });
            })
		} else {
			const battleButton = findBattleButton();
			if (!battleButton) {
				return;
			}
			
			runMainToBattle();
		}
	})	
}

function addConfirmInnPage() {
	const innForm = document.querySelector("form[action='./town.cgi?'] input[name='mode'][value='inn']");
	if (innForm) {
		innForm.parentElement.addEventListener("submit", function(event){
			if(!confirm("여인숙으로 들어가실껀가요? 많은 골드가 소모될 수 있습니다.\n들어가지 않는다면 취소를 누르세요.")) {
				event.preventDefault();
			}
		});
	}
}

function makeUserListToggleable() {
	var connectorDiv = null;
	const holderRows = document.querySelectorAll("div.col-md-12");
	if (!holderRows) return;
	for (var index = 0; index < holderRows.length; index ++) {
		var holderConnectorDiv = holderRows[index];
		if (!holderConnectorDiv || !holderConnectorDiv.textContent) continue;
		if (!holderConnectorDiv.textContent.startsWith("접속중")) continue;
		connectorDiv = holderConnectorDiv;
		break;
	}
	if (!connectorDiv) return;
	var connectorCount = 0;
	try {
		connectorCount = (connectorDiv.textContent.match(/,/g) || []).length;
	} catch (e) {
		console.log(e);
	}
	var connectorChild = connectorDiv.innerHTML;
	connectorDiv.innerHTML = "";
	var detailDiv = document.createElement("details");
	var summary = document.createElement("summary");
	var summaryBold = document.createElement("b");
	var summaryTextObject = document.createElement("font")
	summaryTextObject.innerText = `▼ 접속인원을 보시려면 누르세요! (총 ${connectorCount}명) ▼`;
	summaryTextObject.style.fontSize = "larger";
	//summary.style.marginLeft = "15px";
	//summary.style.marginRight = "15px";
	summary.style.lineHeight = "40px";
	summary.style.textAlign = "center";
	summary.style.backgroundColor = "#fcf8e3";
	summary.style.cursor = "pointer";
	summaryBold.append(summaryTextObject);
	summary.append(summaryBold);
	detailDiv.innerHTML = connectorChild;
	detailDiv.prepend(summary);
	connectorDiv.prepend(detailDiv);
}

function showAdditionalRank() {
	getUserServerData(function(data) {
		if (!data || !data.userData || data.userData.length < 10) {
			console.log("no user server data");
			return;
		}

		const rankTables = document.querySelectorAll("table.offer.offer-radius.table.table-bordered.table-condensed");
		if (!rankTables || rankTables.length !== 5) {
			console.log("no rankTables found");
			return;
		}
		const rankTableHolder = rankTables[2].parentElement.parentElement;

		var worldTierTableHolder = document.createElement("div");
		worldTierTableHolder.classList.add("col-md-4");
		worldTierTableHolder.style.marginTop = "12px";
		worldTierTableHolder.innerHTML = rankTables[2].outerHTML;
		rankTableHolder.append(worldTierTableHolder);
		worldTierTableHolder = rankTables[2].parentElement;
		worldTierTableHolder.querySelector("font.esd2 big").innerHTML = "세계최고티어 10인방";

		data.userData.sort(function(a, b) {
			var aTier = 0;
			var bTier = 0;
			try {
				aTier = a.tier.substring(a.tier.indexOf("(") + 1, a.tier.indexOf(")"));
				bTier = b.tier.substring(b.tier.indexOf("(") + 1, b.tier.indexOf(")"));
			} catch (e) {

			}
			return parseInt(bTier) - parseInt(aTier);
		});

		const worldTierTableItems = worldTierTableHolder.querySelectorAll("tr");
		worldTierTableItems[1].querySelectorAll("td")[3].querySelector("font").innerHTML = "티어";
		for (var index = 0; index < worldTierTableItems.length; index ++) {
			if (index < 2) continue;
			var realIndex = index - 2;
			const worldTierTableItem = worldTierTableItems[index];
			const worldTierTableItemComponents = worldTierTableItem.querySelectorAll("td");
			worldTierTableItemComponents[1].querySelector("img").src = data.userData[realIndex].icon;
			if (worldTierTableItemComponents[2].querySelector("small")) worldTierTableItemComponents[2].querySelector("small").innerHTML = data.userData[realIndex].tag;
			worldTierTableItemComponents[2].querySelector("font a").setAttribute("href", `https://aun.kr/charainfo/${data.userData[realIndex].id}`);
			worldTierTableItemComponents[2].querySelector("font font").innerHTML = data.userData[realIndex].name;
			worldTierTableItemComponents[3].querySelector("font").innerHTML = "<small>" + data.userData[realIndex].tier.replace("다이아몬드", "다이아") + "</small>";		}

		var todayHuntTableHolder = document.createElement("div");
		todayHuntTableHolder.classList.add("col-md-4");
		todayHuntTableHolder.style.marginTop = "12px";
		todayHuntTableHolder.innerHTML = rankTables[3].outerHTML;
		rankTableHolder.append(todayHuntTableHolder);
		todayHuntTableHolder = rankTables[3].parentElement;
		todayHuntTableHolder.querySelector("font.esd2 big").innerHTML = "금일 경험치 순위";

		data.userData.sort(function(a, b) {
			return parseInt(b.pointUp.replaceAll("+","")) - parseInt(a.pointUp.replaceAll("+",""));
		});

		const todayHuntTableItems = todayHuntTableHolder.querySelectorAll("tr");
		todayHuntTableItems[1].querySelectorAll("td")[3].querySelector("font").innerHTML = "경험치";
		for (var index = 0; index < todayHuntTableItems.length; index ++) {
			if (index < 2) continue;
			var realIndex = index - 2;
			const todayHuntTableItem = todayHuntTableItems[index];
			const todayHuntTableItemComponents = todayHuntTableItem.querySelectorAll("td");
			todayHuntTableItemComponents[1].querySelector("img").src = data.userData[realIndex].icon;
			if (todayHuntTableItemComponents[2].querySelector("small")) todayHuntTableItemComponents[2].querySelector("small").innerHTML = data.userData[realIndex].tag;
			todayHuntTableItemComponents[2].querySelector("font a").setAttribute("href", `https://aun.kr/charainfo/${data.userData[realIndex].id}`);
			todayHuntTableItemComponents[2].querySelector("font font").innerHTML = data.userData[realIndex].name;
			todayHuntTableItemComponents[3].querySelector("font").innerHTML = data.userData[realIndex].pointUp.replaceAll("+","");
		}

		var todayGuildTableHolder = document.createElement("div");
		todayGuildTableHolder.classList.add("col-md-4");
		todayGuildTableHolder.style.marginTop = "12px";
		todayGuildTableHolder.innerHTML = rankTables[4].outerHTML;
		rankTableHolder.append(todayGuildTableHolder);
		todayGuildTableHolder = rankTables[4].parentElement;
		todayGuildTableHolder.querySelector("font.esd2 big").innerHTML = "금일 길드전 순위";

		data.userData.sort(function(a, b) {
			return parseInt(b.guildCount) - parseInt(a.guildCount);
		});

		const todayGuildTableItems = todayGuildTableHolder.querySelectorAll("tr");
		todayGuildTableItems[1].querySelectorAll("td")[3].querySelector("font").innerHTML = "길드전";
		for (var index = 0; index < todayGuildTableItems.length; index ++) {
			if (index < 2) continue;
			var realIndex = index - 2;
			const todayGuildTableItem = todayGuildTableItems[index];
			const todayGuildTableItemComponents = todayGuildTableItem.querySelectorAll("td");
			todayGuildTableItemComponents[1].querySelector("img").src = data.userData[realIndex].icon;
			if (todayGuildTableItemComponents[2].querySelector("small")) todayGuildTableItemComponents[2].querySelector("small").innerHTML = data.userData[realIndex].guildName;
			todayGuildTableItemComponents[2].querySelector("font a").setAttribute("href", `https://aun.kr/charainfo/${data.userData[realIndex].id}`);
			todayGuildTableItemComponents[2].querySelector("font font").innerHTML = data.userData[realIndex].name;
			todayGuildTableItemComponents[3].querySelector("font").innerHTML = data.userData[realIndex].guildCount;
		}

	})
}

$(document).ready(function() {
	mainPageAction();
});