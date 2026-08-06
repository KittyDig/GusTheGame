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

function loadCaseShopGame() {

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

let caseShopGame =
    loadCaseShopGame();

//=========================
// SAVE SHOP DATA
//=========================

function saveCaseShopGame() {

    localStorage.setItem(
        "catTamagotchiSave",
        JSON.stringify(
            caseShopGame
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
        ".case-shop-action"
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

function updateCaseShop() {

    if (coinDisplay) {

        coinDisplay.textContent =
            caseShopGame.coins;
    }

    shopButtons.forEach(
        function(button) {

            const itemName =
                button.dataset.item;

            const isOwned =
                caseShopGame
                    .ownedCases
                    .includes(itemName);

            const isEquipped =
                caseShopGame
                    .currentCase ===
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
// BUY OR EQUIP CASE
//=========================

function handleCaseButton(event) {

    const button =
        event.currentTarget;

    const itemName =
        button.dataset.item;

    const price =
        Number(
            button.dataset.price
        );

    const isOwned =
        caseShopGame
            .ownedCases
            .includes(itemName);

    if (isOwned) {

        caseShopGame.currentCase =
            itemName;

        saveCaseShopGame();
        updateCaseShop();

        showMessage(
            "Case equipped!"
        );

        return;
    }

    if (
        caseShopGame.coins <
        price
    ) {

        showMessage(
            "You do not have enough coins."
        );

        return;
    }

    caseShopGame.coins -=
        price;

    caseShopGame
        .ownedCases
        .push(itemName);

    caseShopGame.currentCase =
        itemName;

    saveCaseShopGame();
    updateCaseShop();

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
            handleCaseButton
        );
    }
);

//=========================
// START SHOP
//=========================

updateCaseShop();