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
// ACTION LOCKS
//=========================

let isFeeding = false;

// Load sound once so it is ready to play
const munchSound =
    new Audio("assets/sound/munch.mp3");

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
// GAME MESSAGE
//=========================

function showGameMessage(message) {

    const messageBox =
        document.getElementById("gameMessage");

    if (!messageBox) {
        return;
    }

    messageBox.textContent =
        message;

    messageBox.classList.add("show");

    clearTimeout(showGameMessage.timeout);

    showGameMessage.timeout =
        setTimeout(function() {

            messageBox.classList.remove("show");

        }, 2000);
}


//=========================
// BUTTON ACTIONS
//=========================

function feedCat() {

    // Ignore taps while eating
    if (isFeeding) {
        return;
    }

    // Don't feed if already full
    if (game.hunger >= 100) {

        showGameMessage(
            "Gus is already full!"
        );

        return;
    }

    // Lock feeding immediately
    isFeeding = true;

    // Increase stats/reward
    game.hunger =
        Math.min(
            game.hunger + 10,
            100
        );

    game.coins += 2;

    // Start eating animation
    playAnimation(
        "eat",
        5200
    );

    // First munch
    playMunchSound();

    // Second munch slightly later
    setTimeout(function() {

        playMunchSound();

    }, 1100);

        setTimeout(function() {

        playMunchSound();

    }, 1100);

    updateGame();

    // Eating animation lasts 5.2 seconds.
    // Feed becomes available again afterwards.
    setTimeout(function() {

        isFeeding = false;

    }, 5200);
}

function playMunchSound() {

    // Restart the sound from the beginning
    munchSound.currentTime = 0;

    munchSound.play().catch(function(error) {

        console.log(
            "Munch sound could not play:",
            error
        );

    });
}

function openGames() {

    // Games are always available
    window.location.href =
        "games.html";
}


function sleepCat() {

    // Gus cannot sleep if energy is already full
    if (game.energy >= 100) {

        showGameMessage(
            "Gus isn't sleepy!"
        );

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

    playAnimation(
        "sleep",
        3600
    );

    updateGame();
}


function openShop() {

    window.location.href =
        "shop.html";
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

    // Gus is currently eating.
    // Ignore another Feed press.
    if (
        selectedItem === "Feed" &&
        isFeeding
    ) {
        return;
    }

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
// GAME LOOPS
//=========================

// Hunger decreases every 5 minutes
setInterval(function() {

    game.hunger =
        Math.max(
            game.hunger - 1,
            0
        );

    updateGame();

}, 5 * 60 * 1000);


// Happiness decreases every 3 minutes
setInterval(function() {

    game.happiness =
        Math.max(
            game.happiness - 1,
            0
        );

    updateGame();

}, 3 * 60 * 1000);


// Energy decreases every 6 minutes
setInterval(function() {

    game.energy =
        Math.max(
            game.energy - 1,
            0
        );

    updateGame();

}, 6 * 60 * 1000);

//=========================
// START GAME
//=========================

loadGame();