const itemFoodList = ["닭다리튀김", "피시 앤 칩스", "계란 베이컨 샌드위치", "계란 토스트", "참다랑어", "신선한 물고기", "오염된 물고기"];
const itemFoodSubList = ["닭다리", "소금", "닭튀김기계", "튀김기계", "감자", "식빵", "계란", "토스트기계", "베이컨", "케첩", "마요네즈", "치즈"];
const itemDrugList = ["구급상자", "영롱한 흰색 결정체", "오염된 생수", "단맛나는 약초 추출물", "쓴맛나는 약초 추출물"];
const itemCheckList = ["탄광의 좀비", "금괴", "은괴", "금광석", "은광석", "2000만골드권수표", "1000만골드권수표", "500만골드권수표", "100만골드권수표", "10만골드권수표"];
const itemEnchantList = ["무기제련주문서", "방어구제련주문서", "장신구제련주문서", "상급무기강화허가증", "상급방어구강화허가증", "상급장신구강화허가증",
    "중급무기강화허가증", "중급방어구강화허가증", "중급장신구강화허가증", "하급무기강화허가증", "하급방어구강화허가증", "하급장신구강화허가증"];
const itemPremiumList = ["코어패키지허가증", "로켓패키지허가증", "와우패키지허가증", "스타터패키지", "올랜덤 무기어빌리티", "올랜덤 방어구어빌리티", "올랜덤 장신구어빌리티",
    "전설무기발급허가증", "전설방어구발급허가증", "전설장신구발급허가증", "커스텀타이틀", "랜덤 캐릭터속성변경", "랜덤 무기속성변경", "랜덤 방어구속성변경", "랜덤 장신구속성변경",
    "랜덤 무기웨이트조정", "랜덤 방어구웨이트조정", "랜덤 장신구웨이트조정", "무기어빌리티추출허가증", "방어구어빌리티추출허가증", "장신구어빌리티추출허가증", "코어강화허가증",
    "코어강화허가증JGM", "코어강화허가증TRX", "5초사냥허가증", "익스트림모드허가증", "디스커버리모드허가증", "퀘스트발급허가증", "고농축스팀팩"];
var itemFavoriteList = [];

function makeItemGroup(icon, title, itemDivs) {
    const detailDiv = document.createElement("details");
    detailDiv.setAttribute("open", true);
    detailDiv.classList.add("col-md-12");
    detailDiv.style.marginTop = "5px";
    detailDiv.style.marginBottom = "5px";
    const summaryObject = document.createElement("summary");
    summaryObject.style.margin = "4px";
    const fontObject = document.createElement("font");
    fontObject.style.color = "black";
    //fontObject.id = "shadow";
    const spanObject = document.createElement("span");
    spanObject.classList.add("glyphicon");
    spanObject.classList.add("glyphicon-" + icon);
    spanObject.ariaHidden = "true";
    spanObject.style.marginRight = "4px";
    fontObject.innerHTML = `<b>${title}</b> <small>(총 ${itemDivs.length}종류)</small>`;
    fontObject.prepend(spanObject);
    summaryObject.append(fontObject);
    detailDiv.append(summaryObject);
    if (itemDivs && itemDivs.length > 0) {
        for (var index = 0; index < itemDivs.length; index ++) {
            detailDiv.append(itemDivs[index]);
        }
    }
    return detailDiv;
}

function makeItemFavoriteChecker(itemForm) {
    if (!itemForm) return;
    if (!itemForm.querySelector("b") || !itemForm.querySelector("b").textContent) return;
    const itemTitle = itemForm.querySelector("b").textContent.trim();
    var favoriteChecker = document.createElement("input");
    favoriteChecker.type = "checkbox";
    favoriteChecker.name = "favorite";
    favoriteChecker.id = "favorite";
    if (itemFavoriteList !== null && itemFavoriteList.length > 0) {
        if (itemFavoriteList.indexOf(itemTitle) > -1) favoriteChecker.checked = true;
    }
    favoriteChecker.addEventListener("change", function() {
        handleItemFavorite(itemTitle, this);
    });
    favoriteChecker.style.marginRight = "3px";
    if (itemForm.querySelector("input#favorite")) return;
    itemForm.prepend(favoriteChecker);
}

function handleItemFavorite(itemName, checker) {
    if (!itemName || !checker) {
        //console.log("handleItemFavorite NULL params");
        return;
    }
    if (itemFavoriteList === null || itemFavoriteList.length === 0) {
        itemFavoriteList = [];
    }
    if (checker.checked) {
        //console.log("handleItemFavorite ADD " + itemName);
        if (itemFavoriteList.indexOf(itemName) === -1) {
            itemFavoriteList.push(itemName);
        }
    } else {
        //console.log("handleItemFavorite REMOVE " + itemName);
        if (itemFavoriteList.indexOf(itemName) > -1) {
            itemFavoriteList.splice(itemFavoriteList.indexOf(itemName), 1);
        }
    }
    setInventoryFavoriteConfig(itemFavoriteList, function() {
        startInventorySort();
    });
}

function makeItemDiv(itemForm) {
    const tdObject = document.createElement("td");
    tdObject.style.textAlign = "center";
    tdObject.style.backgroundColor = "#f1f1f1";
    tdObject.append(itemForm);
    const trObject = document.createElement("tr");
    trObject.append(tdObject);
    const tbodyObject = document.createElement("tbody");
    tbodyObject.append(trObject);
    const tableObject = document.createElement("table");
    tableObject.classList.add("table");
    tableObject.classList.add("table-bordered");
    tableObject.append(tbodyObject);
    const divObject = document.createElement("div");
    divObject.classList.add("col-md-6");
    divObject.append(tableObject);
    return divObject;
}

function inventoryArrangeGroup(typeIcon, typeTitle, typeList, itemPanel, itemList) {
    //console.log("inventoryArrange" + typeTitle);
    if (!itemPanel || !itemList) {
        //console.log("inventoryArrange" + typeTitle + " : " + itemPanel + " / " + itemList);
        return;
    }

    var itemDivArray = [];
    if (itemList.length === 0) {
        //console.log("inventoryArrange" + typeTitle + " itemList ZERO");
        return;
    }
    if (typeList === null) {
        for (var itemIndex = 0; itemIndex < itemList.length; itemIndex ++) {
            var itemObject = itemList[itemIndex];
            if (!itemObject.querySelector("b") || !itemObject.querySelector("b").textContent) continue;
            const itemTitle = itemObject.querySelector("b").textContent.trim();
            if (itemFavoriteList.indexOf(itemTitle) > -1) continue;
            if (itemFoodList.indexOf(itemTitle) > -1) continue;
            if (itemFoodSubList.indexOf(itemTitle) > -1) continue;
            if (itemDrugList.indexOf(itemTitle) > -1) continue;
            if (itemCheckList.indexOf(itemTitle) > -1) continue;
            if (itemEnchantList.indexOf(itemTitle) > -1) continue;
            if (itemPremiumList.indexOf(itemTitle) > -1) continue;
            makeItemFavoriteChecker(itemObject);
            itemDivArray.push(makeItemDiv(itemObject));
            //itemList.remove(itemObject);
        }
    } else {
        for (var index = 0; index < typeList.length; index ++) {
            for (var itemIndex = 0; itemIndex < itemList.length; itemIndex ++) {
                var itemObject = itemList[itemIndex];
                if (!itemObject.querySelector("b") || !itemObject.querySelector("b").textContent) continue;
                const itemTitle = itemObject.querySelector("b").textContent.trim();
                if (typeList !== itemFavoriteList && itemFavoriteList.indexOf(itemTitle) > -1) continue;
                if (typeList[index] === itemTitle) {
                    makeItemFavoriteChecker(itemObject);
                    itemDivArray.push(makeItemDiv(itemObject));
                    //itemList.remove(itemObject);
                }
            }
        }
    }
    const itemGroupHolder = makeItemGroup(typeIcon, typeTitle, itemDivArray);
    itemPanel.append(itemGroupHolder);
    return itemList;
}

function startInventorySort() {
    getInventorySortConfig(function(data) {
        //console.log("inventorySort : " + data.inventorySort);
        if (!data.inventorySort) return;

        var title = document.querySelector("h1#shadow");
        if (!title) title = document.querySelector("frame[name='mainFrame']").contentWindow.document.querySelector("h1#shadow");
        if (!title) return;
        //console.log("inventorySort title : " + title.textContent);
        if (title.textContent !== "인벤토리") return;

        var itemPanelEquip = document.querySelector("div#profile");
        if (!itemPanelEquip) itemPanelEquip = document.querySelector("frame[name='mainFrame']").contentWindow.document.querySelector("div#profile");
        if (itemPanelEquip) itemPanelEquip = itemPanelEquip.querySelector("div.row.equal");
        var itemPanelMisc = document.querySelector("div#home");
        if (!itemPanelMisc) itemPanelMisc = document.querySelector("frame[name='mainFrame']").contentWindow.document.querySelector("div#home");
        if (itemPanelMisc) itemPanelMisc = itemPanelMisc.querySelector("div.row.equal");
        if (!itemPanelEquip || !itemPanelMisc) return;
        var itemFormList = itemPanelMisc.querySelectorAll("form[name='frmTest']");
        if (itemFormList == null || itemFormList.length === 0) return;
        itemPanelMisc.innerHTML = "";

        itemFavoriteList = data.inventoryFavorite;
        itemFormList = inventoryArrangeGroup("star", "즐겨찾기", itemFavoriteList, itemPanelMisc, itemFormList);
        itemFormList = inventoryArrangeGroup("cutlery", "음식", itemFoodList, itemPanelMisc, itemFormList);
        itemFormList = inventoryArrangeGroup("grain", "재료", itemFoodSubList, itemPanelMisc, itemFormList);
        itemFormList = inventoryArrangeGroup("flash", "회복 & 약물", itemDrugList, itemPanelMisc, itemFormList);
        itemFormList = inventoryArrangeGroup("usd", "수표 & 금은", itemCheckList, itemPanelMisc, itemFormList);
        itemFormList = inventoryArrangeGroup("stats", "강화", itemEnchantList, itemPanelMisc, itemFormList);
        itemFormList = inventoryArrangeGroup("certificate", "프리미엄", itemPremiumList, itemPanelMisc, itemFormList);
        inventoryArrangeGroup("option-horizontal", "기타", null, itemPanelMisc, itemFormList);
    })
}

$(document).ready(function() {
    if (window.location.pathname !== "/status.cgi") {
        return;
    }

    startInventorySort();
});