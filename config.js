(function() {
	var userData = []; // FOR EVERY CLIENT
	var userAdditionalIds = ["leejung08"]; // JUST FOR PARSING CLIENT

	function getParseUserConfig(callback) {
		chrome.storage.local.get(["parseUser"], function(data) {
			if (data.parseUser === undefined) {
				data.parseUser = false;
			}

			if (callback) {
				callback(data);
			}
		});
	}
	function setParseUser(value, callback) {
		chrome.storage.local.set({"parseUser": value}, callback);
	}

	function isBackgroundFrame(callback) {
		chrome.storage.local.get(["isBackgroundFrame"], function(data) {
			callback(data.isBackgroundFrame);
		});
	}

	function clearBattleCount(callback) {
		chrome.storage.local.set({"battleCount": 0}, callback);
	}
	function getGuildWarAlarmConfig(callback) {
		chrome.storage.local.get(["guildWarAlarmLimit", "guildWarAlarmDuration", "alarmSound", "guildWarAlarmActivation", "guildWarNeedAlarm", "guildWarTime"], function(data) {
			if (data.guildWarAlarmLimit === undefined) {
				data.guildWarAlarmLimit = 300;
			} 
			if (data.guildWarAlarmDuration === undefined) {
				data.guildWarAlarmDuration = 30;
			}
			if (data.alarmSound === undefined) {
				data.alarmSound = false;
			}
			if (data.guildWarAlarmActivation === undefined) {
				data.guildWarAlarmActivation = true;
			}
			if (data.guildWarNeedAlarm === undefined) {
				data.guildWarNeedAlarm = false;
			}
			
			if (callback) {
				callback(data);
			}
		});
	}
	function getRefreshAlarmConfig(callback) {
		chrome.storage.local.get(["alarmSound", "refreshAlarmActivation"], function(data) {
			if (data.alarmSound === undefined) {
				data.alarmSound = false;
			}
			if (data.refreshAlarmActivation === undefined) {
				data.refreshAlarmActivation = true;
			}
			
			if (callback) {
				callback(data);
			}
		});
	}
	function getInventorySortConfig(callback) {
		chrome.storage.local.get(["inventorySort"], function(data) {
			if (data.inventorySort === undefined) {
				data.inventorySort = true;
			}

			if (callback) {
				callback(data);
			}
		});
	}

	function getCityRefreshNeed(callback) {
		chrome.storage.local.get(["cityRefresh"], function(data) {
			if (data.cityRefresh === undefined) {
				data.cityRefresh = false;
			}

			if (callback) {
				callback(data);
			}
		});
	}
   

	function setInventorySortConfig(value, callback) {
		chrome.storage.local.set({"inventorySort": value}, callback);
	}
	
	function getGuildMapConfig(callback) {
		chrome.storage.local.get(["guildMap"], function(data) {
			if (data.guildMap === undefined) {
				data.guildMap = false;
			}

			if (callback) {
				callback(data);
			}
		});
	}
   
	function setGuildMap(value, callback) {
		chrome.storage.local.set({"guildMap": value}, callback);
	}
	function setRefreshAlarmActivation(value, callback) {
		chrome.storage.local.set({"refreshAlarmActivation": value}, callback);
	}
	function setGuildWarAlarmDurationConfig(guildWarAlarmDuration, guildWarAlarmLimit, callback) {
		chrome.storage.local.set({"guildWarAlarmDuration": guildWarAlarmDuration, "guildWarAlarmLimit": guildWarAlarmLimit}, callback);
	}
	function setGuildWarAlarmActivation(value, callback) {
		chrome.storage.local.set({"guildWarAlarmActivation": value}, callback);
	}
	function setGuildWarNeedAlarm(value, callback) {
		chrome.storage.local.set({"guildWarNeedAlarm": value}, callback);
	}
	function setAlarmSound(value, callback) {
		chrome.storage.local.set({"alarmSound": value}, callback);
	}
	function getRefreshedTimeStatus(callback) {
		chrome.storage.local.get(["refreshedTime", "waterStatus"], callback);
	}
	
	function updateActiveButton() {
		chrome.storage.local.get(["isAutoBattle"], function(data) {
			const activateAutoButton = document.querySelector("#activateAuto")
			if (!data.isAutoBattle) {
				activateAutoButton.innerHTML = "자동사냥 시작";
				activateAutoButton.classList.remove("error");
			} else {
				document.querySelector("#activateAuto").innerHTML = "자동사냥 종료";
				activateAutoButton.classList.add("error");
			}
		});
	}
	
	function updateEtcButton() {
		getGuildWarAlarmConfig(function(data) {
			const alarmSoundButton = document.querySelector("#alarmSound");
			if (!data.alarmSound) {
				alarmSoundButton.innerHTML = "알람소리O";
				alarmSoundButton.classList.remove("error");
			} else {
				alarmSoundButton.innerHTML = "알람소리X";
				alarmSoundButton.classList.add("error");
			}
		})
		getGuildMapConfig(function(data) {
			const guildMapButton = document.querySelector("#guildMap");
			if (data.guildMap) {
				guildMapButton.innerHTML = "길드맵O";
				guildMapButton.classList.remove("error");
			} else {
				guildMapButton.innerHTML = "길드맵X";
				guildMapButton.classList.add("error");
			}
		})
		getParseUserConfig(function(data) {
			const parseUserButton = document.querySelector("#parseUsers");
			if (parseUserButton) {
				if (data.parseUser) {
					parseUserButton.innerHTML = "파싱O";
					parseUserButton.classList.remove("error");
				} else {
					parseUserButton.innerHTML = "파싱X";
					parseUserButton.classList.add("error");
				}
			}
		})
	}

	function updateInventorySortButton() {
		getInventorySortConfig(function(data) {
			const inventorySortButton = document.querySelector("#inventorySort");
			if (data.inventorySort) {
				inventorySortButton.innerHTML = "인벤O";
				inventorySortButton.classList.remove("error");
			} else {
				inventorySortButton.innerHTML = "인벤X";
				inventorySortButton.classList.add("error");
			}
		})
	}
	
	function updateGuildWarAlarmActivationButton() {
		getGuildWarAlarmConfig(function(data) {
			const activationButton = document.querySelector("#changeActivationGuildWarAlarm");
			const guildWarStatus = document.querySelector("#guildWarStatus");
			if (data.guildWarAlarmActivation) {
				activationButton.innerHTML = "길드전 알람 종료"
				activationButton.classList.add("error");
				guildWarStatus.classList.remove("config_hide");
			} else {
				activationButton.innerHTML = "길드전 알람 사용"
				activationButton.classList.remove("error");
				guildWarStatus.classList.add("config_hide");
			}
		})
	}
	
	function updateBattleDuration() {
		chrome.storage.local.get(["autoBattleDuration", "autoBattleFiveSecDuration"], function(data) {
			if (data.autoBattleDuration === undefined) {
				document.querySelector("#battleDuration").value = "9000";
			} else {
				document.querySelector("#battleDuration").value = data.autoBattleDuration;
			}
			if (data.autoBattleFiveSecDuration === undefined) {
				document.querySelector("#battleFiveSecDuration").value = "4000";
			} else {
				document.querySelector("#battleFiveSecDuration").value = data.autoBattleFiveSecDuration;
			}
		});
	}
	
	function updateAutoBattleLog() {
		chrome.storage.local.get(["autoBattleLog"], function(data) {
			if (data.autoBattleLog === undefined) {
				data.autoBattleLog = ""
			}
			const logDom = document.querySelector("#autoBattleLog")
			logDom.innerHTML = data.autoBattleLog
		});
	}
	
	function updateBattleLog() {
		chrome.storage.local.get(["battleLog"], function(data) {
			if (data.battleLog === undefined) {
				data.battleLog = ""
			}
			const logDom = document.querySelector("#log")
			logDom.innerHTML = data.battleLog
		});
	};
	
	function clearBattleLog() {
		chrome.storage.local.set({"battleLog": ""}, updateBattleLog);
	}
	
	function getCurrentDateString() { 
		function pad(n) { return n < 10 ? "0" + n : n } 
		const d = new Date() 
		return pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()) 
	}
	
	function getDateString(time) { 
		function pad(n) { return n < 10 ? "0" + n : n } 
		const d = new Date(time)
		return pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()) 
	}
	
	function addLog(str) {
		chrome.storage.local.get(["battleLog"], function(data) {
			const allLog = "[" + getCurrentDateString() + "] " + str + "\n" + data.battleLog
			var splitLogs = allLog.split("\n");
			
			if (splitLogs.length > 2000) {
				splitLogs = splitLogs.slice(0, 2000)
			}
			chrome.storage.local.set({"battleLog": splitLogs.join("\n")}, function() {
				
			})
		})
	}

	function checkChatNotification() {
		chrome.storage.local.get(["keywordNotificationTitle", "keywordNotificationContent", "alarmSound"], function(data) {
			if (data.keywordNotificationTitle && data.keywordNotificationContent) {
				chrome.storage.local.set({"keywordNotificationTitle": "", "keywordNotificationContent" : ""}, function() {

				});
				chrome.notifications.create({
					type: 'basic',
					iconUrl: 'logo.png',
					title: data.keywordNotificationTitle,
					message: data.keywordNotificationContent,
					silent: !!data.alarmSound,
					priority: 2
				});
			}
		});
	}
	
	function sendNotification(isAlarmSound) {
		chrome.notifications.create({
			type: 'basic',
			iconUrl: 'logo.png',
			title: "에타츠 헬퍼",
			message: '길드의 영토를 넓힐 때입니다.',
			silent: !!isAlarmSound,
			priority: 2
		});
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

	function create1000msIntervalWorker(action) {
		const workercode = () => {
		  setInterval(() => {
			self.postMessage({ done: "done" });
		  }, 1000);
		};
		
		return createWebWorker(workercode, action);
	}
	
	create1000msIntervalWorker(function() {
		getGuildWarAlarmConfig(function(data) {
			if (!data.guildWarTime || !data.guildWarAlarmActivation) {
				return;
			}
			
			updateGuildWarStatus(data);
			const currentTime = new Date().getTime()
			if (data.guildWarNeedAlarm && currentTime - data.guildWarTime >= 1000 * 60 * 10) {
				sendNotification(data.alarmSound);
				setGuildWarNeedAlarm(false);
			} else if (!data.guildWarNeedAlarm) {
				const delayedTimeSecond = Math.floor((currentTime - data.guildWarTime) / 1000) - 600
				if (delayedTimeSecond <= data.guildWarAlarmLimit && delayedTimeSecond % data.guildWarAlarmDuration === 0) {
					sendNotification(data.alarmSound);
				}
			}
		});
	});
	
	function updateGuildWarStatus() {
		getGuildWarAlarmConfig(function(data) {
			const guildWarStatusText = document.querySelector("#guildWarStatus");
			if (data.guildWarTime === undefined) {
				guildWarStatusText.innerHTML = "알수없음";
				guildWarStatusText.classList.add("guild_success");
				guildWarStatusText.classList.remove("guild_fail");
				return;
			} 
			
			const currentTime = new Date().getTime()
			if (currentTime - data.guildWarTime >= 1000 * 60 * 10) {
				guildWarStatusText.innerHTML = "길드전 수행가능";
				guildWarStatusText.classList.add("guild_success");
				guildWarStatusText.classList.remove("guild_fail");
			} else {
				guildWarStatusText.innerHTML = "길드전 수행불가(" + Math.floor(600 - ((currentTime - data.guildWarTime)) / 1000) + "s)";
				guildWarStatusText.classList.remove("guild_success");
				guildWarStatusText.classList.add("guild_fail");
			}
		});
	}
	
	function updateGuildWarAlarmDurationConfig() {
		getGuildWarAlarmConfig(function(data) {
			document.querySelector("#guildWarAlarmDuration").value = data.guildWarAlarmDuration
			document.querySelector("#guildWarAlarmLimit").value = data.guildWarAlarmLimit
		});
	}
	
	function updateRefreshedTime() {
		getRefreshedTimeStatus(function(data) {
			const refreshStatusDom = document.querySelector("#refreshStatus");
			if (refreshStatusDom) {
				const refreshedTime = data.refreshedTime
				const waterStatus = data.waterStatus
				
				if (refreshedTime === undefined) {
					refreshStatusDom.innerHTML = "상생 기록 없음";
					refreshStatusDom.classList.add("refresh_success");
					refreshStatusDom.classList.remove("refresh_fail");
				} else {
					var htmlText = `상생 ${getDateString(refreshedTime)}`;
					if (waterStatus !== undefined) {
						if (waterStatus) {
							htmlText += " (수분부족)";
							refreshStatusDom.classList.add("refresh_fail");
							refreshStatusDom.classList.remove("refresh_success");
						} else {
							refreshStatusDom.classList.add("refresh_success");
							refreshStatusDom.classList.remove("refresh_fail");
						}
					} else {
						refreshStatusDom.classList.add("refresh_success");
						refreshStatusDom.classList.remove("refresh_fail");
					}
					refreshStatusDom.innerHTML = htmlText;
					
				}
			}
		});
	}
	
	function updateRefreshAlarmActivationButton() {
		getRefreshAlarmConfig(function(data) {
			const activationButton = document.querySelector("#changeActivationRefreshAlarm");
			
			if (data.refreshAlarmActivation) {
				activationButton.innerHTML = "상생 알람 종료"
				activationButton.classList.add("error");
			} else {
				activationButton.innerHTML = "상생 알람 사용"
				activationButton.classList.remove("error");
			}
		})
	}

	function updateGuildStatus() {
		try {
			fetch('https://aun.kr/guild')
				.then((response) => {
					if (!response.ok) {
						console.error("Request Failed. status = ", response.status)
						return null;
					}
					return response.text()
				})
				.then((html) => {
					if (!html) {
						return;
					}
					if (!html.startsWith("<!DOCTYPE")) html = html.substring(html.indexOf("<TABLE"), html.indexOf("</TABLE>") + 8);
					const parser = new DOMParser();
					const doc = parser.parseFromString(html, "text/html");
					const guildList = doc.querySelectorAll("tr");
					const guildDataArray = [];
					for (var index = 1; index < guildList.length; index ++) {
						const guildDataObject = {};
						const guildItem = guildList[index];
						const columns = guildItem.querySelectorAll("td");
						if (columns.length < 6) {
							continue;
						}
						
						const guildIndex = columns[2].textContent.replace(/.*코드넘버: ([0-9]+).*/, "$1");
						guildDataObject.guildIndex = guildIndex;
						
						const guildRank = columns[0].textContent
						const guildName = columns[2].querySelector("h3 b");
						if (guildName) {
							guildDataObject.title = guildName.textContent;
						} else {
							guildDataObject.title = "";
						}
						
						const guildImage = columns[1].querySelector("img");
						if (guildImage && guildImage.src) {
							guildDataObject.image = guildImage.src;
						} else {
							guildDataObject.image = "";
						}
						
						guildDataArray.push(guildDataObject);
					}
					if (guildDataArray.length > 0) {
						chrome.storage.local.set({"guildData": guildDataArray}, function() {

						});
					} else {
						console.log("guildDataArray is Empty")
					}
				});
		} catch (e) {
			console.log(e);
		}
	}

	function setCityRefreshNeed(value, callback) {
		chrome.storage.local.set({"cityRefresh": value}, callback);
	}

	function updateCityStatus() {
		fetch('https://aun.kr/tprint', Headers)
			.then(response => {
				if (!response.ok) {
					console.error("Request Failed. status = ", response.status)
					return null;
				}
				return response.arrayBuffer()
			})
			.then(arrayBuffer => {
				const decoder = new TextDecoder('euc-kr');
				return decoder.decode(arrayBuffer);
			})
			.then(html => {
				const parser = new DOMParser();
				const doc = parser.parseFromString(html, "text/html");
				const cityList = doc.querySelectorAll("tr");
				const cityDataArray = [];
				for (var index = 1; index < cityList.length; index ++) {
					const cityDataObject = {};
					const cityItem = cityList[index];
					const cityDetails = cityItem.querySelectorAll("td");
					if (!cityDetails || cityDetails.length < 8) continue;
					
					const cityName = cityDetails[0].textContent;
					cityDataObject.title = cityName;
					const cityOwner = cityDetails[1].textContent;
					cityDataObject.owner = cityOwner;
					const cityNation = cityDetails[2].textContent;
					cityDataObject.nation = cityNation;
					const cityGuild = cityDetails[3].textContent;
					cityDataObject.guild = cityGuild;
					const cityTemp = cityDetails[7].textContent;
					cityDataObject.temperature = cityTemp && cityTemp.replace("℃","").trim();
					
					cityDataArray.push(cityDataObject);
				}
				if (cityDataArray.length > 0) {
					chrome.storage.local.set({"cityData": cityDataArray}, function() {

					});
				} else {
					console.log("cityDataArray is Empty")
				}
			});
	}

	function requestUserServerData() {
		chrome.storage.local.get(["userId", "userPass"], function(data) {
			if (!data.userId || !data.userPass) {
				console.log("no user credential");
				return;
			}
			if (data.userId === "firefox" || data.userId === "gubug") {
				if (document.querySelector("#parseUsers")) document.querySelector("#parseUsers").style.display = "";
			}
		});
		try {
			fetch("https://cabininsnow.com:9032/user?serverKey=AUN-HELPER")
				.then((response) => response.json())
				.then((data) => {
					try {
						if (!data || data.length === 0) {
							console.log("NO SERVER USER DATA");
							return;
						}
						console.log(data);
						var testingUserId = data[0].id;
						if (!testingUserId) {
							console.log("INVAILD SERVER USER DATA");
							return;
						}
						chrome.storage.local.set({"userData": data}, function() {

						});
					} catch (e) {
						console.log(e);
					}
				});
		} catch (e) {
			console.log(e);
		}
	}

	function startWithParsingUserList(callback) {
		userData = [];
		const xhr = new XMLHttpRequest();
		xhr.responseType = "arraybuffer";
		xhr.onload = function() {
			const contenttype = xhr.getResponseHeader("content-type");
			const charset = "utf-8";
			const dataView = new DataView(xhr.response);
			const decoder = new TextDecoder(charset);
			const html = decoder.decode(dataView);
			const parser = new DOMParser();
			const doc = parser.parseFromString(html, "text/html");
			const userTable = doc.querySelector("table.table");
			if (!userTable) {
				console.log("NO USER TABLE");
				callback(false);
				return;
			}
			const userItemList = userTable.querySelectorAll("tr[bgcolor='white']");
			if (!userItemList) {
				console.log("NO USER TABLE");
				callback(false);
				return;
			}
			for (var index = 0; index < userItemList.length; index ++) {
				const userItem = userItemList[index];
				const userItemParts = userItem.querySelectorAll("td");
				try {
					const userName = userItemParts[2].querySelector("a").textContent.trim();
					var userId = userItemParts[2].querySelector("a").getAttribute("href");
					userId = userId.substring(userId.lastIndexOf("/") + 1, userId.includes("?") ? userId.lastIndexOf("?") : userId.length);
					var userPointUp = userItemParts[4].querySelector("i").textContent.trim();
					if (userPointUp.length === 0 || userPointUp === "") userPointUp = '+0';
					var userObject = {};
					userObject.id = userId;
					userObject.name = userName;
					userObject.pointUp = userPointUp;
					userData.push(userObject);
				} catch (e) {
					console.log(e);
				}
			}
			for (var index = 0; index < userAdditionalIds.length; index ++) {
				var userObject = {};
				userObject.id = userAdditionalIds[index];
				userObject.name = userAdditionalIds[index];
				userObject.pointUp = '+0';
				userData.push(userObject);
			}
			callback(true);
		}
		xhr.open("GET", "https://aun.kr/rank.php?action=ranking");
		xhr.send(null);
	}

	function startParsingIndividualUser(index, callback) {
		setTimeout(function() {
			getParseUserConfig(function(data) {
				if (!data.parseUser) {
					callback(false);
					return;
				}
				if (userData.length <= index) {
					callback(true);
					return;
				}
				const xhr = new XMLHttpRequest();
				xhr.responseType = "arraybuffer";
				xhr.onload = function() {
					const contenttype = xhr.getResponseHeader("content-type");
					const charset = "euc-kr";
					const dataView = new DataView(xhr.response);
					const decoder = new TextDecoder(charset);
					const html = decoder.decode(dataView);
					const parser = new DOMParser();
					const doc = parser.parseFromString(html, "text/html");
					try {
						const titleArea = doc.querySelector("h2");
						var userTag = "";
						if (titleArea.querySelector("small") && titleArea.querySelector("small").textContent) userTag = titleArea.querySelector("small").textContent.trim();
						const userName = titleArea.querySelector("font.esd2").textContent.trim();
						const guildArea = doc.querySelector("h1.esd2");
						var guildCount = 0;
						var guildName = "";
						if (guildArea) {
							const guildNameText = guildArea.querySelector("b").textContent;
							guildName = guildNameText.trim();
							const guildCountText = guildArea.querySelector("small small").textContent;
							guildCount = guildCountText.substring(guildCountText.indexOf(":") + 1, guildCountText.indexOf(",")).replaceAll("회","").trim();
						}
						const userIcon = doc.querySelector("img").getAttribute("src");
						var userTier = "브론즈 (0)";
						const userKbds = doc.querySelectorAll("kbd");
						var userKbd;
						for (var i = 0; i < userKbds.length; i ++) {
							if (userKbds[i].textContent.includes("Lv")) userKbd = userKbds[i];
						}
						if (userKbd) {
							const userTierArea = userKbd.parentElement.parentElement.parentElement.parentElement.querySelectorAll("tr")[8];
							if (userTierArea.querySelectorAll("td")[0].textContent.trim() === "티어") {
								userTier = userTierArea.querySelectorAll("td")[1].textContent.trim();
							}
						}
						userData[index].name = userName;
						userData[index].tag = userTag;
						userData[index].guildName = guildName ? guildName : "";
						userData[index].guildCount = guildCount;
						userData[index].icon = userIcon;
						userData[index].tier = userTier;
						console.log(JSON.stringify(userData[index]));

						try {
							fetch("https://cabininsnow.com:9032/update", {
								method: "POST",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify({
									serverKey: "AUN-HELPER",
									userData: userData[index]
								}),
							}).then((response) => {
								//	console.log(response);
								//	addLog(JSON.stringify(response));
							});
						} catch (e) {
							console.log(e);
						}
					} catch (e) {
						console.log(e);
					}
					startParsingIndividualUser(index + 1, callback);
				}
				xhr.open("GET", "https://aun.kr/charainfo/" + userData[index].id);
				xhr.send(null);
			})
		}, 2000);
	}

	function readyStartParsing() {
		startWithParsingUserList(function(result) {
			if (result) {
				addLog("USER LIST UPDATED : " + userData.length + " USERS");
				startParsingIndividualUser(0, function(result) {
					if (result) {
						addLog("USER DATA UPDATED : " + userData.length + " ITEMS");
						readyStartParsing();
					} else {
						addLog("startParsingIndividualUser FAILED");
					}
				})
			} else {
				addLog("startWithParsingUserList FAILED");
			}
		});
	}
	
	document.querySelector("#activateAuto").addEventListener("click", function() {
		chrome.storage.local.get(["isAutoBattle"], function(data) {
			const isActivate = !data.isAutoBattle
			clearBattleCount(function() {
				chrome.storage.local.set({"isAutoBattle": isActivate}, function() {
					updateActiveButton();
				});
			});

		});
	});
	
	document.querySelector("#changeDuration").addEventListener("click", function() {
		const duration = document.querySelector("#battleDuration").value
		const fiveSecDuration = document.querySelector("#battleFiveSecDuration").value 
		//TODO 숫자 검증 범위 검증
		chrome.storage.local.set({"autoBattleDuration": duration, "autoBattleFiveSecDuration": fiveSecDuration}, function() {
			updateBattleDuration();
		});
	});
	
	document.querySelector("#changeGuildWarAlarm").addEventListener("click", function() {
		const guildWarAlarmDuration = document.querySelector("#guildWarAlarmDuration").value 
		const guildWarAlarmLimit = document.querySelector("#guildWarAlarmLimit").value
		
		setGuildWarAlarmDurationConfig(guildWarAlarmDuration, guildWarAlarmLimit);
	});
	
	document.querySelector("#clearBattleLog").addEventListener("click", function() {
		clearBattleLog();
	});
	
	document.querySelector("#alarmSound").addEventListener("click", function() {
		getGuildWarAlarmConfig(function(data) {
			const isAlarmSound = !data.alarmSound
			
			setAlarmSound(isAlarmSound, function() {
				updateEtcButton();
			});
		});
	});

	document.querySelector("#guildMap").addEventListener("click", function() {
		getGuildMapConfig(function(data) {
			const isGuildMap = !data.guildMap

			setGuildMap(isGuildMap, function() {
				updateEtcButton();
			});
		});
	});

	document.querySelector("#inventorySort").addEventListener("click", function() {
		getInventorySortConfig(function(data) {
			const isInventorySort = !data.inventorySort

			setInventorySortConfig(isInventorySort, function() {
				updateInventorySortButton();
			});
		});
	});
	
	document.querySelector("#changeActivationGuildWarAlarm").addEventListener("click", function() {
		getGuildWarAlarmConfig(function(data) {
			const guildWarAlarmActivation = !data.guildWarAlarmActivation
			setGuildWarAlarmActivation(guildWarAlarmActivation, function() {
				updateGuildWarAlarmActivationButton();
			})
		});
	});
	
	document.querySelector("#changeActivationRefreshAlarm").addEventListener("click", function() {
		getRefreshAlarmConfig(function(data) {
			const refreshAlarmActivation = !data.refreshAlarmActivation
			setRefreshAlarmActivation(refreshAlarmActivation, function() {
				updateRefreshAlarmActivationButton();
			})
		});
	});

	if (document.querySelector("#parseUsers")) {
		document.querySelector("#parseUsers").addEventListener("click", function() {
			getParseUserConfig(function(data) {
				const parseStatus = !data.parseUser
				setParseUser(parseStatus, function() {
					updateEtcButton();
					if (parseStatus) {
						readyStartParsing();
					}
				})
			});
		});
	}
	
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			if (request.action === "refreshDetected") {
				getRefreshAlarmConfig(function(data) {
					const isAlarmSound = data.alarmSound;
					if (data.refreshAlarmActivation) {
						chrome.notifications.create({
							type: 'basic',
							iconUrl: 'logo.png',
							title: "에타츠 헬퍼",
							message: '채광과 낚시의 시간입니다.',
							silent: !!isAlarmSound,
							priority: 2
						});
					}
				});
				sendResponse({"response": "done"});
			}
		}
	);

	updateAutoBattleLog();
	updateActiveButton();
	updateEtcButton();
	updateGuildWarAlarmActivationButton();
	updateBattleDuration();
	updateBattleLog();
	updateGuildWarStatus();
	updateGuildWarAlarmDurationConfig();
	updateRefreshedTime();
	updateRefreshAlarmActivationButton();
	updateInventorySortButton();
	updateGuildStatus();
	updateCityStatus();
	requestUserServerData();

	setInterval(updateBattleLog, 3000);
	setInterval(updateAutoBattleLog, 1000);
	setInterval(updateRefreshedTime, 5000);
	setInterval(checkChatNotification, 1000);
	setInterval(updateGuildStatus, 600000);
	setInterval(updateCityStatus, 10000);
	setInterval(requestUserServerData, 30000);
})();