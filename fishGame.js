// fish catching game

let score = 0;
let timeRemaining = 20;
let gameFinished = false;

let catPosition = 50;

const gameArea =
    document.getElementById("fishGameArea");

const fallingItemsContainer =
    document.getElementById("fallingItems");

const catcherCat =
    document.getElementById("catcherCat");

const scoreDisplay =
    document.getElementById("fishScore");

const timeDisplay =
    document.getElementById("fishTime");

const moveLeftButton =
    document.getElementById("moveLeft");

const moveRightButton =
    document.getElementById("moveRight");

const itemTypes = [
    {
        type: "fish",
        image: "assets/icon/normalFish.png",
        value: 2,
        chance: 0.65
    },
    {
        type: "golden",
        image: "assets/icon/goldenFish.png",
        value: 5,
        chance: 0.15
    },
    {
        type: "bone",
        image: "assets/icon/fishBone.png",
        value: -2,
        chance: 0.20
    }
];

//=========================
// SOUND EFFECTS
//=========================

const munchSound =
    new Audio("assets/sound/munch.mp3");

function playMunchSound() {

    munchSound.currentTime = 0;

    munchSound.play().catch(function(error) {

        console.log(
            "Munch sound could not play:",
            error
        );

    });
}

// fishy types

const itemTypes = [
    {
        image: "assets/icon/fishNormal.png",
        value: 2,
        chance: 0.65
    },
    {
        image: "assets/icon/fishGolden.png",
        value: 5,
        chance: 0.15
    },
    {
        image: "assets/icon/fishBone.png",
        value: -2,
        chance: 0.20
    }
];

// move Gus

function updateCatPosition() {

    catcherCat.style.left =
        catPosition + "%";
}

function moveCatLeft() {

    if (gameFinished) {
        return;
    }

    catPosition =
        Math.max(catPosition - 10, 12);

    updateCatPosition();
}

function moveCatRight() {

    if (gameFinished) {
        return;
    }

    catPosition =
        Math.min(catPosition + 10, 88);

    updateCatPosition();
}

moveLeftButton.addEventListener(
    "pointerdown",
    moveCatLeft
);

moveRightButton.addEventListener(
    "pointerdown",
    moveCatRight
);

// choose random fish

function chooseItemType() {

    const randomNumber =
        Math.random();

    let runningChance = 0;

    for (const item of itemTypes) {

        runningChance += item.chance;

        if (randomNumber <= runningChance) {
            return item;
        }
    }

    return itemTypes[0];
}

// open Gus's mouth / new image

function openMouth() {

    catcherCat.src =
        "assets/icon/pop2.png";

    setTimeout(function() {

        catcherCat.src =
            "assets/icon/pop1.png";

    }, 220);
}

// create falling fishies

function createFallingItem() {

    if (gameFinished) {
        return;
    }

    const itemData =
        chooseItemType();

    const item =
        document.createElement("img");

    item.src = itemData.image;
    item.alt = "";
    item.className = "falling-item";

    const maximumLeft =
        gameArea.clientWidth - 38;

    const randomLeft =
        Math.floor(Math.random() * maximumLeft);

    item.style.left =
        randomLeft + "px";

    fallingItemsContainer.appendChild(item);

    let itemTop = -45;

    const fallSpeed =
        3 + Math.random() * 2;

    function fall() {

        if (gameFinished) {

            item.remove();
            return;
        }

        itemTop += fallSpeed;

        item.style.top =
            itemTop + "px";

        const itemBox =
            item.getBoundingClientRect();

        const catBox =
            catcherCat.getBoundingClientRect();

        const caught =
            itemBox.bottom >= catBox.top + 20 &&
            itemBox.top <= catBox.bottom &&
            itemBox.right >= catBox.left + 15 &&
            itemBox.left <= catBox.right - 15;

if (caught) {

    score += itemData.value;

    score =
        Math.max(score, 0);

    scoreDisplay.textContent =
        score;

    openMouth();

    if (itemData.type !== "bone") {
        playMunchSound();
    }

    item.remove();
    return;
}

        if (itemTop > gameArea.clientHeight) {

            item.remove();
            return;
        }

        requestAnimationFrame(fall);
    }

    requestAnimationFrame(fall);
}

// spawn fishies

const spawnTimer =
    setInterval(function() {

        createFallingItem();

    }, 850);

//reward player with coins / happiness

function rewardPlayer() {

    const save =
        localStorage.getItem(
            "catTamagotchiSave"
        );

    let game = save
        ? JSON.parse(save)
        : {
            hunger: 70,
            happiness: 70,
            energy: 70,
            coins: 0
        };

    game.coins += score;

    game.happiness =
        Math.min(
            game.happiness + 12,
            100
        );

    game.energy =
        Math.max(
            game.energy - 5,
            0
        );

    localStorage.setItem(
        "catTamagotchiSave",
        JSON.stringify(game)
    );

    alert(
        "Game over!\n" +
        "You earned " +
        score +
        " coins!"
    );

    window.location.href =
        "games.html";
}

// start game

const gameTimer =
    setInterval(function() {

        timeRemaining--;

        timeDisplay.textContent =
            timeRemaining;

        if (timeRemaining <= 0) {

            clearInterval(gameTimer);
            clearInterval(spawnTimer);

            gameFinished = true;

            rewardPlayer();
        }

    }, 1000);

// start game

updateCatPosition();