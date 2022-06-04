function makeChatShortcuts() {
    let titleDiv = document.querySelector("div.title.middlebox");
    var chatDocument = document;
    if (!titleDiv) {
        console.log("chatHelper : u-chat : " + document.querySelector("u-chat"));
        if (document.querySelector("u-chat")) {
            console.log("chatHelper : u-chat iframe : " + document.querySelector("u-chat").querySelector("iframe"));
            if (document.querySelector("u-chat").querySelector("iframe")) {
                chatDocument = document.querySelector("u-chat").querySelector("iframe").contentWindow.document;
                titleDiv = chatDocument.querySelector("div.title.middlebox");
            }
        }
    }
    if (!titleDiv) {
        console.log("chatHelper : no chat title div");
        return;
    }
    if (!titleDiv.querySelectorAll("div")) {
        console.log("chatHelper : no chat title div inner content");
        return;
    }

    if (titleDiv.querySelectorAll("div") && titleDiv.querySelectorAll("div").length > 1) {
        try {
            titleDiv.removeChild(titleDiv.querySelector("div#chatshort1"));
            titleDiv.removeChild(titleDiv.querySelector("div#chatshort2"));
        } catch (e) {
            console.log(e);
        }
    }

    chrome.storage.local.get(["chatshort1", "chatshort2"], function(data) {
        //console.log("chatHelper : " + data.chatshort1 + "/" + data.chatshort2);
        if (data.chatshort1 === undefined || data.chatshort1 === null) data.chatshort1 = "";
        if (data.chatshort2 === undefined || data.chatshort2 === null) data.chatshort2 = "";

        var short1Div = chatDocument.createElement("div");
        short1Div.id = "chatshort1";
        var short1DivText = chatDocument.createElement("span");
        short1DivText.innerHTML = "<b>단축1</b>";
        short1DivText.style.marginLeft = "6px";
        short1DivText.onclick = function () {
            var inputDiv = chatDocument.querySelector("div.chatInput");
            if (inputDiv) inputDiv.innerHTML = data.chatshort1;
        };
        short1Div.append(short1DivText);
        var short1DivSetting = chatDocument.createElement("span");
        short1DivSetting.innerHTML = "설정";
        short1DivSetting.style.marginLeft = "3px";
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

        var short2Div = chatDocument.createElement("div");
        short2Div.id = "chatshort2";
        var short2DivText = chatDocument.createElement("span");
        short2DivText.innerHTML = "<b>단축2<b/>";
        short2DivText.style.marginLeft = "6px";
        short2DivText.onclick = function () {
            var inputDiv = chatDocument.querySelector("div.chatInput");
            if (inputDiv) inputDiv.innerHTML = data.chatshort2;
        };
        short2Div.append(short2DivText);
        var short2DivSetting = chatDocument.createElement("span");
        short2DivSetting.innerHTML = "설정";
        short2DivSetting.style.marginLeft = "3px";
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

    });
}

$(document).ready(function() {
    if (!window.location.pathname.startsWith("/chat/mobile")) {
        return;
    }

    setTimeout(makeChatShortcuts, 3000);

});