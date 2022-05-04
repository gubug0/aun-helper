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
						setAutoBattleLog("[" + battleCount + "]전투");
						findBattleButton().submit();
					});
				}
				callCount += 1;
			});
		});
	});
}

$(document).ready(function() {
	battlePageAction();
});