function inventoryPinFavorites() {

}

function inventoryBasicArrange() {

}

$(document).ready(function() {
    if (window.location.pathname !== "/status.cgi") {
        return;
    }

    getInventorySortConfig(function(data) {
        if (!data.inventorySort) return;

        const title = document.querySelector("h1#shadow")
        if (!title) return;
        if (title.textContent !== "인벤토리") return;

        var itemPanelEquip = document.querySelector("")

        inventoryBasicArrange();
        inventoryPinFavorites();
    })


});