//=========================
// FISH CATCHING GAME
//=========================

let score = 0;
let timeRemaining = 20;
let gameFinished = false;
let isDragging = false;

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


//=========================
// FISH TYPES
//=========================

const itemTypes = [
    {
        type: "fish",
        image: "assets/icon/fishNormal.png",
        value: 2,
        chance: 0.65
    },
    {
        type: "golden",
        image: "assets/icon/fishGolden.png",
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

const hissSound =
    new Audio("assets/sound/hiss.mp3");


function playMunchSound() {

    munchSound.currentTime = 0;

    munchSound.play().catch(function(error) {
        console.log("Munch sound could not play:", error);
    });
}


function playHissSound() {

    hissSound.currentTime = 0;

    hissSound.play().catch(function(error) {
        console.log("Hiss sound could not play:", error);
    });
}

//=========================
// DRAG GUS
//=========================

function moveCatToPointer(event) {

    if (!isDragging || gameFinished) {
        return;
    }

    const gameBox =
        gameArea.getBoundingClientRect();

    const catWidth =
        catcherCat.offsetWidth;

    let newLeft =
        event.clientX - gameBox.left;

    const minimumLeft =
        catWidth / 2;

    const maximumLeft =
        gameBox.width - catWidth / 2;

    newLeft =
        Math.max(
            minimumLeft,
            Math.min(
                newLeft,
                maximumLeft
            )
        );

    catcherCat.style.left =
        newLeft + "px";
}


gameArea.addEventListener(
    "pointerdown",
    function(event) {

        if (gameFinished) {
            return;
        }

        isDragging = true;

        gameArea.setPointerCapture(
            event.pointerId
        );

        moveCatToPointer(event);
    }
);


gameArea.addEventListener(
    "pointermove",
    moveCatToPointer
);


gameArea.addEventListener(
    "pointerup",
    function(event) {

        isDragging = false;

        if (
            gameArea.hasPointerCapture(
                event.pointerId
            )
        ) {

            gameArea.releasePointerCapture(
                event.pointerId
            );
        }
    }
);


gameArea.addEventListener(
    "pointercancel",
    function() {

        isDragging = false;
    }
);


//=========================
// CHOOSE RANDOM FISH
//=========================

function chooseItemType() {

    const randomNumber =
        Math.random();

    let runningChance = 0;

    for (const item of itemTypes) {

        runningChance +=
            item.chance;

        if (
            randomNumber <=
            runningChance
        ) {

            return item;
        }
    }

    return itemTypes[0];
}


//=========================
// OPEN GUS'S MOUTH
//=========================

function openMouth() {

    catcherCat.src =
        "assets/icon/pop2.png";

    setTimeout(function() {

        catcherCat.src =
            "assets/icon/pop1.png";

    }, 220);
}


//=========================
// CREATE FALLING FISH
//=========================

function createFallingItem() {

    if (gameFinished) {
        return;
    }

    const itemData =
        chooseItemType();

    const item =
        document.createElement("img");

    item.src =
        itemData.image;

    item.alt = "";

    item.className =
        "falling-item";

    fallingItemsContainer
        .appendChild(item);


    const maximumLeft =
        gameArea.clientWidth -
        item.offsetWidth;

    const randomLeft =
        Math.floor(
            Math.random() *
            Math.max(maximumLeft, 1)
        );

    item.style.left =
        randomLeft + "px";


    let itemTop =
        -item.offsetHeight;

    const fallSpeed =
        3 + Math.random() * 2;


    function fall() {

        if (gameFinished) {

            item.remove();
            return;
        }


        itemTop +=
            fallSpeed;

        item.style.top =
            itemTop + "px";


        const itemBox =
            item.getBoundingClientRect();

        const catBox =
            catcherCat.getBoundingClientRect();


        const caught =
            itemBox.bottom >=
                catBox.top + 20 &&

            itemBox.top <=
                catBox.bottom &&

            itemBox.right >=
                catBox.left + 15 &&

            itemBox.left <=
                catBox.right - 15;


        if (caught) {

            score +=
                itemData.value;

            score =
                Math.max(
                    score,
                    0
                );

            scoreDisplay.textContent =
                score;

            openMouth();


            // Only real fish make
            // the munch noise
if (itemData.type === "bone") {

    // Gus is NOT happy about that!
    playHissSound();

} else {

    // Normal or golden fish
    playMunchSound();
}


            item.remove();

            return;
        }


        if (
            itemTop >
            gameArea.clientHeight
        ) {

            item.remove();

            return;
        }


        requestAnimationFrame(
            fall
        );
    }


    requestAnimationFrame(
        fall
    );
}


//=========================
// SPAWN FISH
//=========================

const spawnTimer =
    setInterval(function() {

        createFallingItem();

    }, 850);


//=========================
// REWARD PLAYER
//=========================

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


    game.coins +=
        score;


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


//=========================
// GAME TIMER
//=========================

timeDisplay.textContent =
    timeRemaining;


const gameTimer =
    setInterval(function() {

        timeRemaining--;

        timeDisplay.textContent =
            timeRemaining;


        if (
            timeRemaining <= 0
        ) {

            clearInterval(
                gameTimer
            );

            clearInterval(
                spawnTimer
            );

            gameFinished =
                true;

            rewardPlayer();
        }

    }, 1000);


//=========================
// START GAME
//=========================

catcherCat.style.left =
    "50%";

createFallingItem();