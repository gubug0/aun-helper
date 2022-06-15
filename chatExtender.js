(function() {
    var EXTENSION_ID = "";
    if (document.currentScript) {
        EXTENSION_ID = document.currentScript.getAttribute("data-extension-id");
        console.log("chatExtender EXTENSION_ID : " + EXTENSION_ID);
    }

    var globalRoom = null;
    U=window.U=window.U||{},U.events=U.events||[],U.chat=function(n){return{on:function(e,t){U.events.push([n,e,t])},off:function(e){for(var t=U.events.length;t>0;)U.events[--t][0]===n&&U.events[t][1]===e&&U.events.splice(t,1)}}};

    window.printRoomMessage = function(message) {
        if (!globalRoom) {
            console.error("no room to print message");
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
            console.error("no room to print message");
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
            onClick: function(room, data) {
                try {
                    const targetName = data.target.substring(0, data.target.includes("＠") ? data.target.indexOf("＠") : data.target.length);
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
                            window.open("https://aun.kr/wiki/index.php/" + data.target.substring(0, data.target.includes("＠") ? data.target.indexOf("＠") : data.target.length));
                        });
                } catch (e) {
                    console.error(e);
                    room.print("문제가 발생했습니다 : " + e);
                }
            }
        });
        if (data.my && data.my.nick && data.my.nick.startsWith("王")) return;
        /*
        room.skin.userMenu.add({
            id: 'send',
            text: "송금/전보",
            title: "송금/전보",
            html : '<b>송금 전보</b>',
            onClick: function(room, data) {
                const targetDetail = room.user.get(data.target);
                if (targetDetail.status === "off" || !targetDetail.id) {
                    room.print("유저가 오프라인이에요");
                    return;
                }
                room.skin.popup.prompt(`송금/전보`, `${data.target} | 골드금액 혹은 전보내용 입력`, '', function(dataInput){
                    if (!dataInput || dataInput === "") {
                        return;
                    }
                    if (typeof EXTENSION_ID === 'undefined') {
                        return;
                    }
                    var isNumberInput = Number(dataInput) || -1;
                    if (isNumberInput && isNumberInput > 0) {
                        var sendingValue = parseInt(Number(dataInput));
                        chrome.runtime.sendMessage(EXTENSION_ID,{method: "uchatGold", uchatTargetId: targetDetail.id, uchatTargetNick: data.target, uchatValue: sendingValue}, function(response) {
                            room.print(response.message);
                            console.log("CHROME sendMessage (chatExtender.js) : uchatGold : " + response.message);
                        });
                        console.log("CHROME sendMessage (chatExtender.js) : uchatGold");
                        return;
                    }
                    chrome.runtime.sendMessage(EXTENSION_ID,{method: "uchatMessage", uchatTargetId: targetDetail.id, uchatTargetNick: data.target, uchatValue: dataInput}, function(response) {
                        room.print(response.message);
                        console.log("CHROME sendMessage (chatExtender.js) : uchatMessage : " + response.message);
                    });
                    console.log("CHROME sendMessage (chatExtender.js) : uchatMessage");
                });
            }
        });
         */
        room.skin.userMenu.add({
            id: 'id',
            text: "아이디복사",
            title: "아이디복사",
            html : '아이디복사',
            onClick: function(room, data) {
                const targetDetail = room.user.get(data.target);
                if (targetDetail.status === "off" || !targetDetail.id) {
                    room.print("유저가 오프라인이에요");
                    return;
                }
                navigator.clipboard.writeText(targetDetail.id)
                    .then(() => {
                        room.print(`${data.target}의 아이디 ${targetDetail.id} 복사됨`);
                    })
                    .catch(err => {
                        console.error('Text copy error', err);
                    })
            }
        });
    });

    U.chat('*').on('before.send', function( room, data ) {
        try {
            if (!data || !data.message) {
                return;
            }
            const messageComponents = data.message.split(/\s+/);
            for (var index = 0; index < messageComponents.length; index ++) {
                if (messageComponents[index].startsWith("aun.kr/wiki/index.php/")) {
                    messageComponents[index] = "https://" + messageComponents[index];
                }
                if (messageComponents[index].startsWith("https://aun.kr/wiki/index.php/")) {
                    messageComponents[index] = decodeURI(messageComponents[index]).replaceAll("https://aun.kr/wiki/index.php/", "위키/");
                    console.log("before.send modified " + messageComponents[index]);
                }
            }
            data.message = messageComponents.join(" ");
        } catch (e) {
            console.error(e);
        }
    });

    U.chat('*').on('before.message', function( room, data ) {
        try {
            if (!data || !data.content) {
                return;
            }
            const messageComponents = data.content.split(/\s+/);
            for (var index = 0; index < messageComponents.length; index ++) {
                if (messageComponents[index].startsWith("aun.kr/wiki/index.php/")) {
                    messageComponents[index] = "https://" + messageComponents[index];
                }
                if (messageComponents[index].startsWith("https://aun.kr/wiki/index.php/")) {
                    messageComponents[index] = messageComponents[index].replaceAll("https://aun.kr/wiki/index.php/", "위키/");
                }
                if (messageComponents[index].startsWith("위키/")) {
                    messageComponents[index] = (decodeURI(messageComponents[index]) + '[' + `https://aun.kr/wiki/index.php/${encodeURI(messageComponents[index].replaceAll("위키/", ""))}` + ']');
                    if (data.style) data.style.underline = true;
                    console.log("before.message modified " + messageComponents[index]);
                }
            }
            data.content = messageComponents.join(" ");
        } catch (e) {
            console.error(e);
        }
    });

    console.log("Uchat extender initialized");
})();