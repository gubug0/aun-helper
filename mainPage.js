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

function mainPageAction() {
	if (window.location.pathname !== "/MainPage" && window.location.pathname !== "/top.cgi") {
		return;
	}
	addConfirmInnPage();
	makeUserListToggleable();

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
                        document.querySelector("form[action='./top.cgi'").submit();
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
	var connectorRow = null;
	var connectorDiv = null;
	const holderRows = document.querySelectorAll("div[class='row']");
	if (!holderRows) return;
	for (var index = 0; index < holderRows.length; index ++) {
		var holderRow = holderRows[index];
		const holderConnectorDiv = holderRow.querySelector("div[class='col-md-12']");
		if (!holderConnectorDiv || !holderConnectorDiv.textContent) continue;
		if (!holderConnectorDiv.textContent.startsWith("접속중")) continue;
		connectorRow = holderRow;
		connectorDiv = holderConnectorDiv;
		break;
	}
	if (!connectorRow || !connectorDiv) return;
	connectorRow.removeChild(connectorDiv);
	var detailDiv = document.createElement("details");
	var summary = document.createElement("summary");
	summary.innerText = "접속인원을 보시려면 누르세요!";
	summary.style.fontSize = "larger";
	summary.style.marginLeft = "15px";
	detailDiv.append(summary);
	detailDiv.append(connectorDiv);
	connectorRow.prepend(detailDiv);
}

$(document).ready(function() {
	mainPageAction();
});