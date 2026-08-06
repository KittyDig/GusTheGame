//=========================
// DEFAULT SAVE DATA
//=========================

const defaultGame = {
    hunger: 70,
    happiness: 70,
    energy: 70,
    coins: 0,

    currentCat: "gusOG",
    currentCase: "greyTG",
    currentBackground: "sunny",

    ownedCats: ["gusOG"],
    ownedCases: ["greyTG"],
    ownedBackgrounds: ["sunny"]
};

//=========================
// LOAD SHOP DATA
//=========================

function loadShopGame() {

    const savedGame =
        localStorage.getItem("catTamagotchiSave");

    if (!savedGame) {
        return { ...defaultGame };
    }

    try {
        const parsedSave =
            JSON.parse(savedGame);

        return {
            ...defaultGame,
            ...parsedSave,

            ownedCats:
                Array.isArray(parsedSave.ownedCats)
                    ? parsedSave.ownedCats
                    : ["gusOG"],

            ownedCases:
                Array.isArray(parsedSave.ownedCases)
                    ? parsedSave.ownedCases
                    : ["greyTG"],

            ownedBackgrounds:
                Array.isArray(parsedSave.ownedBackgrounds)
                    ? parsedSave.ownedBackgrounds
                    : ["sunny"]
        };

    } catch (error) {

        console.error(
            "Could not read saved game:",
            error
        );

        return { ...defaultGame };
    }
}

let shopGame = loadShopGame();

//=========================
// SAVE SHOP DATA
//=========================

function saveShopGame() {

    localStorage.setItem(
        "catTamagotchiSave",
        JSON.stringify(shopGame)
    );
}

//=========================
// SHOP ELEMENTS
//=========================

const coinDisplay =
    document.getElementById("shopCoins");

const messageDisplay =
    document.getElementById("shopMessage");

const shopButtons =
    document.querySelectorAll(".shop-action");

//=========================
// SHOP MESSAGE
//=========================

function showMessage(message) {

    if (!messageDisplay) {
        return;
    }

    messageDisplay.textContent =
        message;

    clearTimeout(showMessage.timeout);

    showMessage.timeout =
        setTimeout(function() {

            messageDisplay.textContent = "";

        }, 2200);
}

//=========================
// UPDATE SHOP DISPLAY
//=========================

function updateShop() {

    if (coinDisplay) {
        coinDisplay.textContent =
            shopGame.coins;
    }

    shopButtons.forEach(function(button) {

        const itemName =
            button.dataset.item;

        const isOwned =
            shopGame.ownedCats.includes(
                itemName
            );

        const isEquipped =
            shopGame.currentCat ===
            itemName;

        if (isEquipped) {

            button.textContent =
                "Equipped";

            button.disabled =
                true;

        } else if (isOwned) {

            button.textContent =
                "Equip";

            button.disabled =
                false;

        } else {

            button.textContent =
                "Buy";

            button.disabled =
                false;
        }
    });
}

//=========================
// BUY OR EQUIP OUTFIT
//=========================

function handleShopButton(event) {

    const button =
        event.currentTarget;

    const itemName =
        button.dataset.item;

    const price =
        Number(button.dataset.price);

    const isOwned =
        shopGame.ownedCats.includes(
            itemName
        );

    if (isOwned) {

        shopGame.currentCat =
            itemName;

        saveShopGame();
        updateShop();

        showMessage(
            "Outfit equipped!"
        );

        return;
    }

    if (shopGame.coins < price) {

        showMessage(
            "You do not have enough coins."
        );

        return;
    }

    shopGame.coins -=
        price;

    shopGame.ownedCats.push(
        itemName
    );

    shopGame.currentCat =
        itemName;

    saveShopGame();
    updateShop();

    showMessage(
        "Purchased and equipped!"
    );
}

//=========================
// SHOP BUTTON EVENTS
//=========================

shopButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        handleShopButton
    );
});

//=========================
// START SHOP
//=========================

updateShop();