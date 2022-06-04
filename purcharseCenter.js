function purcharseCenterAction() {
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
		sellAllButton.value=(itemCount <= 100 ? "전체매각" : "100개매각");
		sellAllButton.type="button";
		sellAllButton.classList.add("btn");
		sellAllButton.classList.add("btn-danger");
		sellAllButton.classList.add("btn-sm");  
		sellAllButton.addEventListener("click", function() {
			radioButton.checked=true
			inputBox.value=(itemCount <= 100 ? itemCount : 100);
			purchaseForm.submit()
		});
		divDom.appendChild(sellAllButton)
		radioButton.parentElement.appendChild(divDom)
	});
}

$(document).ready(function() {
	purcharseCenterAction();
});
