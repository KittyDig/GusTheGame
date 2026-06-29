//=========================
// GAME DATA
//=========================

let game = {
    hunger: 70,
    happiness: 70,
    energy: 70,
    coins: 0
};

//=========================
// MENU
//=========================

const menuItems = [
    "Feed",
    "Play",
    "Sleep",
    "Shop"
];

let currentMenuIndex = 0;

//=========================
// UPDATE UI
//=========================

function updateGame() {

    document.getElementById("hungerBar").style.width =
        game.hunger + "%";

    document.getElementById("happyBar").style.width =
        game.happiness + "%";

    document.getElementById("energyBar").style.width =
        game.energy + "%";

    document.getElementById("coins").textContent =
        game.coins;

    document.getElementById("selectedAction").textContent =
        menuItems[currentMenuIndex];

    localStorage.setItem(
        "catTamagotchiSave",
        JSON.stringify(game)
    );
}

//=========================
// BUTTON ACTIONS
//=========================

function feedCat() {

    game.hunger = Math.min(game.hunger + 10, 100);

    game.coins += 2;

    updateGame();
}

function playCat() {

    game.happiness = Math.min(game.happiness + 10, 100);

    game.energy = Math.max(game.energy - 5, 0);

    game.coins += 3;

    updateGame();
}

function sleepCat() {

    game.energy = Math.min(game.energy + 15, 100);

    game.hunger = Math.max(game.hunger - 5, 0);

    updateGame();
}

function openShop() {

    alert("Shop coming soon!");
}

//=========================
// TAMA BUTTONS
//=========================

function previousMenuItem() {

    currentMenuIndex--;

    if (currentMenuIndex < 0)
        currentMenuIndex = menuItems.length - 1;

    updateGame();
}

function nextMenuItem() {

    currentMenuIndex++;

    if (currentMenuIndex >= menuItems.length)
        currentMenuIndex = 0;

    updateGame();
}

function selectMenuItem() {

    switch(menuItems[currentMenuIndex]){

        case "Feed":
            feedCat();
            break;

        case "Play":
            playCat();
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
// SAVE / LOAD
//=========================

function loadGame(){

    const save =
        localStorage.getItem("catTamagotchiSave");

    if(save){

        game = JSON.parse(save);

    }

    updateGame();
}

//=========================
// GAME LOOP
//=========================

setInterval(function(){

    game.hunger = Math.max(game.hunger - 1,0);

    game.happiness = Math.max(game.happiness - 1,0);

    game.energy = Math.max(game.energy - 1,0);

    updateGame();

},10000);

//=========================
// START GAME
//=========================

loadGame();