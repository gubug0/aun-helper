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
	
	const maxUpBufferMax = Math.floor(skillLevel / allMaxUpCost)
	const maxUpBufferStep = Math.floor(maxUpBufferMax / 10000) == 0 ? 1 : Math.floor(maxUpBufferMax / 10000)
	
	const tableTbody = stateUpForm.parentElement.parentElement.parentElement
	const trDom = document.createElement("tr")
	const tdDom = document.createElement("td")
	
	tdDom.colspan="2"
	tdDom.align="right"
	tdDom.bgColor="white"
	tdDom.innerHTML = "현재 숙련도: <input type='text' size='14' id='skillLevel' value='" + numberWithCommas(skillLevel) + "' style='text-align:right;background-color: #DDDDDD;border: 0px;' readonly> P<br />"
		+ "할인률: <input type='text' size='14' id='discountRatePercent' value='" + discountRatePercent + "' style='text-align:right;background-color: #DDDDDD;border: 0px;' readonly>%<br />"
		+ "1업당 숙련도: <input type='text' size='14' id='stateUpCost' value='" + numberWithCommas(stateUpCost) + "' style='text-align:right;background-color: #DDDDDD;border: 0px;' readonly> P<br />"
		+ "연금제작 비용(연금술LV5 기준): <input type='text' size='14' id='maxUpCost' value='" + maxUpCost + "' style='text-align:right;background-color: #DDDDDD;border: 0px;' readonly> P<br />"
		+ "올라가는 스탯: <input type='text' size='14' id='stateUpCount' value='" + numberWithCommas(stateUpCount) + "' style='text-align:right;background-color: #DDDDDD;border: 0px;' readonly> P<br />"
		+ "고급여관에서 소모할 총 숙련도: <input type='text' size='14' id='consumeSkillLevel' value='" + numberWithCommas(consumeSkillLevel) + "' style='text-align:right;background-color: #DDDDDD;border: 0px;' readonly> P<br />"
		+ "추가로 올릴 최대치(아래 바를 이동해서 결정하세요.): <input type='text' size='14' id='maxUpBufferText' value='0' style='text-align:right;background-color: #DDDDDD;border: 0px;' readonly> P<br />"
		+ "<input type='range' id='maxUpBuffer' min='0' max='" + maxUpBufferMax + "' step='" + maxUpBufferStep + "' value='0'>"
		+ "<b style='font-size:large'>올려야할 최대치(숙련도 자동 사용 전에 복사하세요.)</b>: <input type='text' size='14' id='maxUpTotalCount' value='" + stateUpCount + "' style='text-align:right;background-color: #DDDDDD;border: 0px;    font-size: large;' readonly> P<br />";
		
		
	const stateUpButton = document.createElement("input");
	stateUpButton.value="숙련도 자동 사용";
	stateUpButton.type="button";
	stateUpButton.classList.add("btn");
	stateUpButton.classList.add("btn-danger");
	stateUpButton.classList.add("btn3d"); 
	stateUpButton.addEventListener("click", function() {
		const value = document.querySelector("#consumeSkillLevel").value
		stateUpText.value = value.replace(/,/g, "");
		stateUpForm.submit()
	});
	
	tdDom.appendChild(stateUpButton);
	trDom.appendChild(tdDom);
	tableTbody.appendChild(trDom);
	
	document.querySelector("#maxUpBuffer").addEventListener("input", function() {
		const currentValue = parseInt(document.querySelector("#maxUpBuffer").value, 10)
		document.querySelector("#maxUpBufferText").value = numberWithCommas(currentValue)
		
		const bufferedSkillLevel = skillLevel - (currentValue * allMaxUpCost)
		const bufferedStateUpCount = Math.floor(bufferedSkillLevel / (stateUpCost + allMaxUpCost))
		const bufferedConsumeSkillLevel = bufferedStateUpCount * stateUpCost
		
		document.querySelector("#stateUpCount").value = numberWithCommas(bufferedStateUpCount)
		document.querySelector("#consumeSkillLevel").value = numberWithCommas(bufferedConsumeSkillLevel)
		document.querySelector("#maxUpTotalCount").value = (currentValue + bufferedStateUpCount)
	});
	console.log(document.querySelector("#skillLevel"));
}

$(document).ready(function() {
	stateUpAction();
});