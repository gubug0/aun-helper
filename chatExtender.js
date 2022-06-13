(function() {
    var EXTENSION_ID = "";
    if (document.currentScript) {
        EXTENSION_ID = document.currentScript.getAttribute("data-extension-id");
    } else {
		return;
	}

    var globalRoom = null;
    U=window.U=window.U||{},U.events=U.events||[],U.chat=function(n){return{on:function(e,t){U.events.push([n,e,t])},off:function(e){for(var t=U.events.length;t>0;)U.events[--t][0]===n&&U.events[t][1]===e&&U.events.splice(t,1)}}};

    window.printRoomMessage = function(message) {
        if (!globalRoom) {
            return;
        }
        try {
            globalRoom.print(message);
        } catch (e) {
            console.error(e);
        }
    }

    function printRoomMessage(message) {
        if (!globalRoom) {
            return;
        }
        try {
            globalRoom.print(message);
        } catch (e) {
            console.error(e);
        }
    }

    U.chat('*').on('after.join', function( room, data ) {
        try {
            room.skin.userMenu.remove('report');
        } catch (e) {
            console.error(e);
        }
        globalRoom = room;
        room.skin.userMenu.add({
            id: 'wiki',
            text: "위키",
            title: "위키",
            html : '<span>위키</span>',
            onClick: function(room, target) {
                try {
                    const targetName = target.target.substring(0, target.target.includes("＠") ? target.target.indexOf("＠") : target.target.length);
                    const url = "https://aun.kr/wiki/api.php?" +
                        new URLSearchParams({
                            origin: "*",
                            action: "parse",
                            page: targetName,
                            format: "json",
                            section: 1,
                            prop: "wikitext"
                        });
				
					fetch(url)
						.then((response) => {
							if (!response.ok) {
								room.print(targetName + " 위키 가져오기 실패");
								return;
							}
							return response.json();
						})
						.then((dataParsed) => {
							if (!dataParsed || !dataParsed.parse || !dataParsed.parse.wikitext) {
								room.print(targetName + " 위키 없음 ;ㅅ;");
								return;
							}

							window.open("https://aun.kr/wiki/index.php/" + target.target.substring(0, target.target.includes("＠") ? target.target.indexOf("＠") : target.target.length));
						});
                } catch (e) {
                    room.print("문제가 발생했습니다 : " + e);
                }
            }
        });

		if (data.my && data.my.nick && data.my.nick.startsWith("王")) {
			return;
		}
		
		
        room.skin.userMenu.group({
            id: 'send',
            text: "송금",
            title: "송금",
            html : '<b>송금</b>',
            onClick: function(room, target) {
                const targetDetail = room.user.get(target.target);
                if (targetDetail.status === "off" || !targetDetail.id) {
                    room.print("유저가 오프라인이에요");
                    return;
                }
                room.skin.popup.prompt(`송금`, `${target.target} | 송금금액 입력`, '', function(dataInput){
                    if (!dataInput || dataInput === "") {
                        return;
                    }
                    
					if (!dataInput.trim().match(/^[0-9,]+$/)) {
						room.print("[송금] 숫자만 입력가능합니다.");
						return;
					}

					const sendingValue = parseInt(dataInput.trim().replaceAll(',', ''));
					chrome.runtime.sendMessage(EXTENSION_ID, {
						method: "uchatGold", 
						uchatTargetId: targetDetail.id, 
						uchatTargetNick: target.target, 
						uchatValue: sendingValue}, 
						function(response) {
							room.print(response.message);
						});
                });
            }
        }, {
            id: 'send',
            text: "전보",
            title: "전보",
            html : '<b>전보</b>',
            onClick: function(room, target) {
                const targetDetail = room.user.get(target.target);
                if (targetDetail.status === "off" || !targetDetail.id) {
                    room.print("유저가 오프라인이에요");
                    return;
                }
                room.skin.popup.prompt(`전보`, `${target.target} | 전보내용 입력`, '', function(dataInput){
                    if (!dataInput || dataInput === "") {
                        return;
                    }
					chrome.runtime.sendMessage(EXTENSION_ID, {
						method: "uchatMessage", 
						uchatTargetId: targetDetail.id, 
						uchatTargetNick: target.target, 
						uchatValue: dataInput}, 
						function(response) {
							room.print(response.message);
						});
                });
            }
        });
        room.skin.userMenu.add({
            id: 'id',
            text: "아이디복사",
            title: "아이디복사",
            html : '아이디복사',
            onClick: function(room, target) {
                const targetDetail = room.user.get(target.target);
                if (targetDetail.status === "off" || !targetDetail.id) {
                    room.print("유저가 오프라인이에요");
                    return;
                }
                navigator.clipboard.writeText(targetDetail.id)
                    .then(() => {
                        room.print(targetDetail.id + " [" + target.target + "] 복사됨");
                    })
                    .catch(err => {
                        console.error('Text copy error', err);
                    })
            }
        });
    });

    U.chat('*').on('before.send', function( room, target ) {
        try {
            if (!target || !target.message) {
                return;
            }
            const messageComponents = target.message.split(/\s+/);
            for (var index = 0; index < messageComponents.length; index ++) {
                if (messageComponents[index].startsWith("aun.kr/wiki/index.php/")) {
                    messageComponents[index] = "https://" + messageComponents[index];
                }
                if (messageComponents[index].startsWith("https://aun.kr/wiki/index.php/")) {
                    messageComponents[index] = decodeURI(messageComponents[index]).replaceAll("https://aun.kr/wiki/index.php/", "위키/");
                }
            }
            target.message = messageComponents.join(" ");
        } catch (e) {
            console.error(e);
        }
    });

    U.chat('*').on('before.message', function( room, target ) {
        try {
            if (!target || !target.content) {
                return;
            }
            const messageComponents = target.content.split(/\s+/);
            for (var index = 0; index < messageComponents.length; index ++) {
                if (messageComponents[index].startsWith("aun.kr/wiki/index.php/")) {
                    messageComponents[index] = "https://" + messageComponents[index];
                }
                if (messageComponents[index].startsWith("https://aun.kr/wiki/index.php/")) {
                    messageComponents[index] = messageComponents[index].replaceAll("https://aun.kr/wiki/index.php/", "위키/");
                }
                if (messageComponents[index].startsWith("위키/")) {
                    messageComponents[index] = (decodeURI(messageComponents[index]) + '[' + `https://aun.kr/wiki/index.php/${encodeURI(messageComponents[index].replaceAll("위키/", ""))}` + ']');
                    if (target.style) target.style.underline = true;
                }
            }
            target.content = messageComponents.join(" ");
        } catch (e) {
            console.error(e);
        }
    });

    console.log("Uchat extender initialized")
})();