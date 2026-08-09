//=========================
// GAME DATA
//=========================

let game = {
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
// MENU
//=========================

const menuItems = [
    {
        name: "Feed",
        icon: "assets/icon/feed.png"
    },
    {
        name: "Play",
        icon: "assets/icon/play.png"
    },
    {
        name: "Sleep",
        icon: "assets/icon/sleep.png"
    },
    {
        name: "Shop",
        icon: "assets/icon/shop.png"
    }
];

let currentMenuIndex = 0;

function updateMenuText() {

    const selectedItem =
        menuItems[currentMenuIndex];

    document.getElementById(
        "selectedAction"
    ).textContent = selectedItem.name;

    document.getElementById(
        "selectedIcon"
    ).src = selectedItem.icon;
}

//=========================
// CAT ANIMATIONS
//=========================

function getCurrentCatGif() {

    return "assets/cat/" +
        game.currentCat +
        ".gif";
}

function getCurrentEatGif() {

    return "assets/cat/" +
        game.currentCat.replace(
            "gus",
            "gusEat"
        ) +
        ".gif";
}

function showCurrentCat() {

    const catSprite =
        document.getElementById(
            "catSprite"
        );

    catSprite.src =
        getCurrentCatGif();
}

function playAnimation(type, duration = 1200) {

    const catSprite =
        document.getElementById("catSprite");

    let animationGif;

    switch(type) {

        case "eat":
            animationGif = getCurrentEatGif();
            break;

        case "sleep":
            animationGif = getCurrentSleepGif();
            break;

        default:
            animationGif = getCurrentCatGif();
    }

    // Restart GIF from frame 1
    catSprite.src = "";
    void catSprite.offsetWidth;
    catSprite.src = animationGif;

    setTimeout(function() {

        catSprite.src = getCurrentCatGif();

    }, duration);
}

//=========================
// UPDATE UI
//=========================

function updateGame() {

    document.getElementById(
        "hungerBar"
    ).style.width =
        game.hunger + "%";

    document.getElementById(
        "happyBar"
    ).style.width =
        game.happiness + "%";

    document.getElementById(
        "energyBar"
    ).style.width =
        game.energy + "%";

    document.getElementById(
        "coins"
    ).textContent =
        game.coins;

    updateMenuText();

    localStorage.setItem(
        "catTamagotchiSave",
        JSON.stringify(game)
    );
}

//=========================
// MOBILE SHOP PRESS EFFECT
//=========================

document.querySelectorAll(
    ".street-shop"
).forEach(function(shop) {

    shop.addEventListener(
        "touchstart",
        function() {

            shop.classList.add(
                "is-pressed"
            );
        }
    );

    shop.addEventListener(
        "touchend",
        function() {

            shop.classList.remove(
                "is-pressed"
            );
        }
    );

    shop.addEventListener(
        "touchcancel",
        function() {

            shop.classList.remove(
                "is-pressed"
            );
        }
    );
});

//=========================
// BUTTON ACTIONS
//=========================

function feedCat() {

    if (game.hunger >= 100) {
        showGameMessage("Gus isn't hungry!");
        return;
    }

    game.hunger =
        Math.min(game.hunger + 10, 100);

    game.coins += 2;

    playAnimation("eat", 5200);

    updateGame();
}


function openGames() {

    // Do not allow playing if happiness is already full
    if (game.happiness >= 100) {
        return;
    }

    window.location.href =
        "games.html";
}


function playCat() {

    // Do not reward anything if happiness is already full
    if (game.happiness >= 100) {
        return;
    }

    game.happiness =
        Math.min(
            game.happiness + 10,
            100
        );

    game.energy =
        Math.max(
            game.energy - 5,
            0
        );

    game.coins += 3;

    updateGame();
}


function sleepCat() {

    // Do not allow sleeping if energy is already full
    if (game.energy >= 100) {
        return;
    }

    game.energy =
        Math.min(
            game.energy + 15,
            100
        );

    game.hunger =
        Math.max(
            game.hunger - 5,
            0
        );

    playAnimation("sleep", 3600);

    updateGame();
}

//=========================
// TAMA BUTTONS
//=========================

function previousMenuItem() {

    currentMenuIndex--;

    if (currentMenuIndex < 0) {

        currentMenuIndex =
            menuItems.length - 1;
    }

    updateGame();
}

function nextMenuItem() {

    currentMenuIndex++;

    if (
        currentMenuIndex >=
        menuItems.length
    ) {

        currentMenuIndex = 0;
    }

    updateGame();
}

function getCurrentSleepGif() {

    return "assets/cat/" +
        game.currentCat.replace(
            "gus",
            "gusSleep"
        ) +
        ".gif";
}

function selectMenuItem() {

    const selectedItem =
        menuItems[
            currentMenuIndex
        ].name;

    switch(selectedItem) {

        case "Feed":
            feedCat();
            break;

        case "Play":
            openGames();
            break;

        case "Sleep":
            sleepCat();
            break;

        case "Shop":
            openShop();
            break;
    }
}

//=========================
// BACKGROUND DISPLAY
//=========================

function getCurrentBackground() {

    return "assets/background/" +
        game.currentBackground +
        ".png";
}

function showCurrentBackground() {

    const backgroundSprite =
        document.getElementById(
            "backgroundSprite"
        );

    if (!backgroundSprite) {
        return;
    }

    backgroundSprite.src =
        getCurrentBackground();
}

//=========================
// CASE DISPLAY
//=========================

function getCurrentCase() {

    return "assets/case/" +
        game.currentCase +
        ".png";
}

function showCurrentCase() {

    const caseSprite =
        document.getElementById(
            "caseSprite"
        );

    if (!caseSprite) {
        return;
    }

    caseSprite.src =
        getCurrentCase();
}

//=========================
// SAVE / LOAD
//=========================

function loadGame() {

    const save =
        localStorage.getItem(
            "catTamagotchiSave"
        );

    if (save) {

        const savedGame =
            JSON.parse(save);

        // Merge the saved data with the default
        // object so older saves still receive
        // the new currentCat property.
        game = {
            ...game,
            ...savedGame
        };
    }

showCurrentCat();
showCurrentBackground();
showCurrentCase();
updateGame();

}

//=========================
// Game loop
//=========================

setInterval(function() {

    game.hunger =
        Math.max(
            game.hunger - 1,
            0
        );

    game.happiness =
        Math.max(
            game.happiness - 1,
            0
        );

    game.energy =
        Math.max(
            game.energy - 1,
            0
        );

    updateGame();

}, 10000);

//=========================
// START GAME
//=========================

loadGame();