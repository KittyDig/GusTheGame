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

function loadBackgroundShopGame() {

    const savedGame =
        localStorage.getItem(
            "catTamagotchiSave"
        );

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
                Array.isArray(
                    parsedSave.ownedCats
                )
                    ? parsedSave.ownedCats
                    : ["gusOG"],

            ownedCases:
                Array.isArray(
                    parsedSave.ownedCases
                )
                    ? parsedSave.ownedCases
                    : ["greyTG"],

            ownedBackgrounds:
                Array.isArray(
                    parsedSave.ownedBackgrounds
                )
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

let backgroundShopGame =
    loadBackgroundShopGame();

//=========================
// SAVE SHOP DATA
//=========================

function saveBackgroundShopGame() {

    localStorage.setItem(
        "catTamagotchiSave",
        JSON.stringify(
            backgroundShopGame
        )
    );
}

//=========================
// SHOP ELEMENTS
//=========================

const coinDisplay =
    document.getElementById(
        "shopCoins"
    );

const messageDisplay =
    document.getElementById(
        "shopMessage"
    );

const shopButtons =
    document.querySelectorAll(
        ".background-shop-action"
    );

//=========================
// SHOP MESSAGE
//=========================

function showMessage(message) {

    if (!messageDisplay) {
        return;
    }

    messageDisplay.textContent =
        message;

    clearTimeout(
        showMessage.timeout
    );

    showMessage.timeout =
        setTimeout(function() {

            messageDisplay.textContent =
                "";

        }, 2200);
}

//=========================
// UPDATE SHOP DISPLAY
//=========================

function updateBackgroundShop() {

    if (coinDisplay) {

        coinDisplay.textContent =
            backgroundShopGame.coins;
    }

    shopButtons.forEach(
        function(button) {

            const itemName =
                button.dataset.item;

            const isOwned =
                backgroundShopGame
                    .ownedBackgrounds
                    .includes(itemName);

            const isEquipped =
                backgroundShopGame
                    .currentBackground ===
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
        }
    );
}

//=========================
// BUY OR EQUIP BACKGROUND
//=========================

function handleBackgroundButton(
    event
) {

    const button =
        event.currentTarget;

    const itemName =
        button.dataset.item;

    const price =
        Number(
            button.dataset.price
        );

    const isOwned =
        backgroundShopGame
            .ownedBackgrounds
            .includes(itemName);

    if (isOwned) {

        backgroundShopGame
            .currentBackground =
            itemName;

        saveBackgroundShopGame();
        updateBackgroundShop();

        showMessage(
            "Background equipped!"
        );

        return;
    }

    if (
        backgroundShopGame.coins <
        price
    ) {

        showMessage(
            "You do not have enough coins."
        );

        return;
    }

    backgroundShopGame.coins -=
        price;

    backgroundShopGame
        .ownedBackgrounds
        .push(itemName);

    backgroundShopGame
        .currentBackground =
        itemName;

    saveBackgroundShopGame();
    updateBackgroundShop();

    showMessage(
        "Purchased and equipped!"
    );
}

//=========================
// SHOP BUTTON EVENTS
//=========================

shopButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            handleBackgroundButton
        );
    }
);

//=========================
// START SHOP
//=========================

updateBackgroundShop();