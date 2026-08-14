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

    const selectedAction =
        document.getElementById("selectedAction");

    const selectedIcon =
        document.getElementById("selectedIcon");


    if (selectedAction) {
        selectedAction.textContent =
            selectedItem.name;
    }


    if (selectedIcon) {
        selectedIcon.src =
            selectedItem.icon;
    }
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


function getCurrentSleepGif() {

    return "assets/cat/" +
        game.currentCat.replace(
            "gus",
            "gusSleep"
        ) +
        ".gif";
}


function showCurrentCat() {

    const catSprite =
        document.getElementById(
            "catSprite"
        );

    if (!catSprite) {
        return;
    }

    catSprite.src =
        getCurrentCatGif();
}


function playAnimation(
    type,
    duration = 1200
) {

    const catSprite =
        document.getElementById(
            "catSprite"
        );

    if (!catSprite) {
        return;
    }


    let animationGif;


    switch (type) {

        case "eat":

            animationGif =
                getCurrentEatGif();

            break;


        case "sleep":

            animationGif =
                getCurrentSleepGif();

            break;


        default:

            animationGif =
                getCurrentCatGif();

            break;
    }


    // Restart GIF from frame 1
    catSprite.src = "";

    void catSprite.offsetWidth;

    catSprite.src =
        animationGif;


    setTimeout(function() {

        catSprite.src =
            getCurrentCatGif();

    }, duration);
}


//=========================
// ACTION LOCKS
//=========================

let isFeeding = false;
let isSleeping = false;


//=========================
// SOUND EFFECTS
//=========================

const munchSound =
    new Audio(
        "assets/sound/munch.mp3"
    );

const snoreSound =
    new Audio(
        "assets/sound/snore.mp3"
    );


function playMunchSound() {

    munchSound.currentTime = 0;

    munchSound.play().catch(
        function(error) {

            console.log(
                "Munch sound could not play:",
                error
            );
        }
    );
}


function playSnoreSound() {

    snoreSound.currentTime = 0;

    snoreSound.play().catch(
        function(error) {

            console.log(
                "Snore sound could not play:",
                error
            );
        }
    );
}


//=========================
// UPDATE UI
//=========================

function updateGame() {

    const hungerBar =
        document.getElementById(
            "hungerBar"
        );

    const happyBar =
        document.getElementById(
            "happyBar"
        );

    const energyBar =
        document.getElementById(
            "energyBar"
        );

    const coins =
        document.getElementById(
            "coins"
        );


    if (hungerBar) {

        hungerBar.style.width =
            game.hunger + "%";
    }


    if (happyBar) {

        happyBar.style.width =
            game.happiness + "%";
    }


    if (energyBar) {

        energyBar.style.width =
            game.energy + "%";
    }


    if (coins) {

        coins.textContent =
            game.coins;
    }


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

function showGameMessage(
    message
) {

    const messageBox =
        document.getElementById(
            "gameMessage"
        );

    if (!messageBox) {
        return;
    }


    messageBox.textContent =
        message;


    messageBox.classList.add(
        "show"
    );


    clearTimeout(
        showGameMessage.timeout
    );


    showGameMessage.timeout =
        setTimeout(function() {

            messageBox.classList.remove(
                "show"
            );

        }, 2000);
}


//=========================
// BUTTON ACTIONS
//=========================

function feedCat() {

    // Do not feed while Gus
    // is already eating or sleeping
    if (
        isFeeding ||
        isSleeping
    ) {
        return;
    }


    // Gus cannot eat when full
    if (
        game.hunger >= 100
    ) {

        showGameMessage(
            "Gus is already full!"
        );

        return;
    }


    // Lock feeding
    isFeeding = true;


    // Increase hunger
    game.hunger =
        Math.min(
            game.hunger + 10,
            100
        );


    // Small coin reward
    game.coins += 2;


    // Eating animation lasts
    // 5.2 seconds
    playAnimation(
        "eat",
        5200
    );


    // Four munch sounds
    playMunchSound();


    setTimeout(function() {

        playMunchSound();

    }, 1100);


    setTimeout(function() {

        playMunchSound();

    }, 2200);


    setTimeout(function() {

        playMunchSound();

    }, 3300);


    updateGame();


    // Unlock feeding after
    // animation has finished
    setTimeout(function() {

        isFeeding = false;

    }, 5200);
}


function openGames() {

    window.location.href =
        "games.html";
}


function sleepCat() {

    // Do not sleep while Gus
    // is already sleeping or eating
    if (
        isSleeping ||
        isFeeding
    ) {
        return;
    }


    // Gus cannot sleep
    // at full energy
    if (
        game.energy >= 100
    ) {

        showGameMessage(
            "Gus isn't sleepy!"
        );

        return;
    }


    // Lock sleeping
    isSleeping = true;


    // Restore energy
    game.energy =
        Math.min(
            game.energy + 15,
            100
        );


    // Sleeping makes Gus
    // a little hungrier
    game.hunger =
        Math.max(
            game.hunger - 5,
            0
        );


    // Sleep animation lasts
    // 5 seconds
    playAnimation(
        "sleep",
        5000
    );


    // Three snore sounds
    playSnoreSound();


    setTimeout(function() {

        playSnoreSound();

    }, 1500);


    setTimeout(function() {

        playSnoreSound();

    }, 3000);


    updateGame();


    // Unlock sleeping
    setTimeout(function() {

        isSleeping = false;

    }, 5000);
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


    if (
        currentMenuIndex < 0
    ) {

        currentMenuIndex =
            menuItems.length - 1;
    }


    updateMenuText();
}


function nextMenuItem() {

    currentMenuIndex++;


    if (
        currentMenuIndex >=
        menuItems.length
    ) {

        currentMenuIndex = 0;
    }


    updateMenuText();
}


function selectMenuItem() {

    const selectedItem =
        menuItems[
            currentMenuIndex
        ].name;


    switch (selectedItem) {

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

        try {

            const savedGame =
                JSON.parse(save);


            // Merge saved data with
            // defaults so new properties
            // are added to older saves.
            game = {
                ...game,
                ...savedGame,

                ownedCats:
                    Array.isArray(
                        savedGame.ownedCats
                    )
                        ? savedGame.ownedCats
                        : ["gusOG"],

                ownedCases:
                    Array.isArray(
                        savedGame.ownedCases
                    )
                        ? savedGame.ownedCases
                        : ["greyTG"],

                ownedBackgrounds:
                    Array.isArray(
                        savedGame.ownedBackgrounds
                    )
                        ? savedGame.ownedBackgrounds
                        : ["sunny"]
            };

        } catch (error) {

            console.log(
                "Could not load save:",
                error
            );
        }
    }


    showCurrentCat();

    showCurrentBackground();

    showCurrentCase();

    updateGame();
}


//=========================
// GAME LOOPS
//=========================

// Hunger decreases
// every 5 minutes
setInterval(function() {

    game.hunger =
        Math.max(
            game.hunger - 1,
            0
        );

    updateGame();

}, 5 * 60 * 1000);


// Happiness decreases
// every 3 minutes
setInterval(function() {

    game.happiness =
        Math.max(
            game.happiness - 1,
            0
        );

    updateGame();

}, 3 * 60 * 1000);


// Energy decreases
// every 6 minutes
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