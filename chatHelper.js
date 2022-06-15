function makeChatShortcuts() {
    var titleDiv = document.querySelector("div.title.middlebox");
    var chatDocument = document;
    if (!titleDiv) {
        if (document.querySelector("u-chat")) {
            if (document.querySelector("u-chat").querySelector("iframe")) {
                chatDocument = document.querySelector("u-chat").querySelector("iframe").contentWindow.document;
                titleDiv = chatDocument.querySelector("div.title.middlebox");
            }
        }
    }
    if (!titleDiv) {
        console.error("chatHelper : no chat title div");
        return;
    }
    if (!titleDiv.querySelectorAll("div")) {
        console.error("chatHelper : no chat title div inner content");
        return;
    }

    if (titleDiv.querySelectorAll("div") && titleDiv.querySelectorAll("div").length > 1) {
        try {
            titleDiv.removeChild(titleDiv.querySelector("div#chatshort1"));
            titleDiv.removeChild(titleDiv.querySelector("div#chatshort2"));
            titleDiv.removeChild(titleDiv.querySelector("div#chatkeyword"));
        } catch (e) {
            console.log(e);
        }
    }

    chrome.storage.local.get(["chatshort1", "chatshort2", "chatkeywords"], function(data) {
        if (data.chatshort1 === undefined || data.chatshort1 === null) data.chatshort1 = "";
        if (data.chatshort2 === undefined || data.chatshort2 === null) data.chatshort2 = "";

        const short1Div = chatDocument.createElement("div");
        short1Div.id = "chatshort1";
        const short1DivButton = chatDocument.createElement("button");
        short1DivButton.innerHTML = "<b>단축1</b>";
        short1DivButton.style = "color: rgb(255, 255, 255);border-radius: 4px 0 0 4px;background: rgb(100, 100, 147);padding-right: 3px;border-right-width: 1px;border-right-color: #b7b7db;border-right-style: dashed;";
        short1DivButton.onclick = function () {
            var inputDiv = chatDocument.querySelector("div.chatInput");
            if (inputDiv) {
				inputDiv.innerHTML = data.chatshort1;
				inputDiv.focus();
			}
        };
        short1Div.append(short1DivButton);
        const short1DivSetting = chatDocument.createElement("button");
        short1DivSetting.innerHTML = "설정";
        short1DivSetting.style = "color: rgb(255, 255, 255);border-color: white;border-radius: 0 4px 4px 0;background: rgb(100, 100, 147);margin-left: 0;padding-left: 3px;";
        short1DivSetting.onclick = function () {
            var chatshort1 = prompt("단축1 대화를 입력하세요", data.chatshort1);
            if (chatshort1 !== undefined && chatshort1 !== null && chatshort1.length > 0) {
                chrome.storage.local.set({"chatshort1": chatshort1}, function() {
                    makeChatShortcuts();
                });
            }
        };
        short1Div.append(short1DivSetting);
        titleDiv.append(short1Div);

        const short2Div = chatDocument.createElement("div");
        short2Div.id = "chatshort2";
        const short2DivText = chatDocument.createElement("button");
        short2DivText.innerHTML = "<b>단축2<b/>";
        short2DivText.style = "color: rgb(255, 255, 255);margin-left: 3px;border-radius: 4px 0 0 4px;background: rgb(100, 100, 147);padding-right: 3px;border-right-width: 1px;border-right-color: #b7b7db;border-right-style: dashed;";
        short2DivText.onclick = function () {
            var inputDiv = chatDocument.querySelector("div.chatInput");
            if (inputDiv) {
				inputDiv.innerHTML = data.chatshort2;
				inputDiv.focus();
			}
        };
        short2Div.append(short2DivText);
        const short2DivSetting = chatDocument.createElement("button");
        short2DivSetting.innerHTML = "설정";
        short2DivSetting.style = "color: rgb(255, 255, 255);border-color: white;border-radius: 0 4px 4px 0;background: rgb(100, 100, 147);margin-left: 0;padding-left: 3px;";
        short2DivSetting.onclick = function () {
            var chatshort2 = prompt("단축2 대화를 입력하세요", data.chatshort2);
            if (chatshort2 !== undefined && chatshort2 !== null && chatshort2.length > 0) {
                chrome.storage.local.set({"chatshort2": chatshort2}, function() {
                    makeChatShortcuts();
                });
            }
        };
        short2Div.append(short2DivSetting);
        titleDiv.append(short2Div);

        const keywordDiv = chatDocument.createElement("div");
        keywordDiv.id = "chatkeyword";
        const keywordText =  chatDocument.createElement("button");
        keywordText.innerHTML = "<b>키워드</b>";
        keywordText.style = "color: rgb(255, 255, 255);margin-left: 3px;border-radius: 4px;background: rgb(100, 100, 147);";
        keywordText.onclick = function () {
            var keywords = prompt("알림을 받을 키워드를 입력하세요 (여러개는 , 로 구분)", data.chatkeywords);
            if (keywords !== undefined && keywords !== null && keywords.length > 0) {
                chrome.storage.local.set({"chatkeywords": keywords}, function() {
                    makeChatShortcuts();
                });
            }
        };
        keywordDiv.append(keywordText);
        titleDiv.append(keywordDiv);

    });
}

function monitorChatKeywords() {
    var titleDiv = document.querySelector("div.title.middlebox");
    var chatDocument = document;
    if (!titleDiv) {
        if (document.querySelector("u-chat")) {
            if (document.querySelector("u-chat").querySelector("iframe")) {
                chatDocument = document.querySelector("u-chat").querySelector("iframe").contentWindow.document;
                titleDiv = chatDocument.querySelector("div.title.middlebox");
            }
        }
    }
    if (!titleDiv) {
        console.error("chatHelper : no chat title div");
        return;
    }
    if (!titleDiv.querySelectorAll("div")) {
        console.error("chatHelper : no chat title div inner content");
        return;
    }

    const chatDiv = chatDocument.querySelector("div.content.nano-content");
    if (!chatDiv) {
        console.error("no chatDiv");
        return;
    }
    const chatLineDivs = chatDiv.querySelectorAll("div.line:not(.myLine)")
    if (!chatLineDivs) {
        console.error("no chatLineDivs");
        return;
    }

    chrome.storage.local.get(["chatkeywords", "alarmSound"], function(data) {
        if (!data.chatkeywords) return;
        var chatKeywordList = data.chatkeywords.split(",");
        if (!chatKeywordList || chatKeywordList.length === 0) return;
        for (var index = chatLineDivs.length - 1; index > 0; index --) {
            if (index < chatLineDivs.length - 5) break;
            var chatLineDiv = chatLineDivs[index];
            if (chatLineDiv.classList.contains("helper-checked")) continue;
            chatLineDiv.classList.add("helper-checked");
            const chatOwner = chatLineDiv.querySelector("span.nick");
            const chatContent = chatLineDiv.querySelector("span.chatContent");
            if (chatContent) {
                console.log("check content : " + chatContent.textContent);
                for (var keyIndex = 0; keyIndex < chatKeywordList.length; keyIndex ++) {
                    if (!chatKeywordList[keyIndex] || chatKeywordList[keyIndex].length === 0) continue;
                    if (chatContent.textContent.includes(chatKeywordList[keyIndex].trim())) {
                        chrome.storage.local.set({"keywordNotificationTitle": ("에타츠/" + chatOwner.textContent.trim()), "keywordNotificationContent" : chatContent.textContent.trim()}, function() {
                            console.log("chat notification made : " + chatContent.textContent.trim());
                        });
                    }
                }
            }
        }
    })
}

$(document).ready(function() {
    if (!window.location.pathname.startsWith("/chat/mobile")) {
        return;
    }
    if (window.name !== "chatFrame") {
        return;
    }

    try {
        _script = document.createElement('script');
        _script.setAttribute('src', chrome.runtime.getURL('chatExtender.js'));
        _script.setAttribute('data-extension-id', chrome.runtime.id);
        (document.head||document.documentElement).appendChild( _script);
        _script.parentNode.removeChild( _script);
    } catch (e) {
        console.log(e);
    }

    setTimeout(makeChatShortcuts, 3000);
    setInterval(monitorChatKeywords, 3500);

});