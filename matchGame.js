//=========================
// GUS MATCH
//=========================

const gusCards = [
    "gusOG",
    "gusAngel",
    "gusBoy",
    "gusMush",
    "gusVamp",
    "gusJudy"
];


//=========================
// CREATE CARD DECK
//=========================

// Make two of every Gus
let cards = [
    ...gusCards,
    ...gusCards
];


// Shuffle the cards
cards.sort(function() {
    return Math.random() - 0.5;
});


//=========================
// GAME DATA
//=========================

let firstCard = null;
let secondCard = null;

let boardLocked = false;

let matches = 0;

// Player starts with a potential
// reward of 50 coins
let coinsEarned = 50;

// Reward can never fall below this
const minimumReward = 20;

// Stops the reward being given twice
let gameFinished = false;


//=========================
// CREATE BOARD
//=========================

const matchGrid =
    document.getElementById("matchGrid");


cards.forEach(function(gusName) {

    const card =
        document.createElement("button");

    card.classList.add("match-card");

    card.dataset.gus =
        gusName;


    const image =
        document.createElement("img");

    image.src =
        "assets/cat/" +
        gusName +
        ".gif";

    image.alt =
        "Gus matching card";


    card.appendChild(image);

    matchGrid.appendChild(card);


    card.addEventListener(
        "click",
        function() {

            flipCard(card);

        }
    );
});


//=========================
// FLIP CARD
//=========================

function flipCard(card) {

    // Don't allow another card while
    // two cards are being checked
    if (boardLocked) {
        return;
    }

    // Don't click the same card twice
    if (card === firstCard) {
        return;
    }

    // Don't click cards already matched
    if (
        card.classList.contains("matched")
    ) {
        return;
    }


    card.classList.add("flipped");


    // First card
    if (!firstCard) {

        firstCard = card;

        return;
    }


    // Second card
    secondCard = card;

    checkMatch();
}


//=========================
// CHECK MATCH
//=========================

function checkMatch() {

    const isMatch =
        firstCard.dataset.gus ===
        secondCard.dataset.gus;

    if (isMatch) {

        firstCard.classList.add(
            "matched"
        );

        secondCard.classList.add(
            "matched"
        );

        matches++;

        updateMatchDisplay();

        resetCards();

        // Check whether every pair
        // has now been found
        if (
            matches ===
            gusCards.length
        ) {

            finishMatchGame();
        }

    } else {

        // Wrong match!
        // Remove 5 from the potential reward
        coinsEarned =
            Math.max(
                minimumReward,
                coinsEarned - 5
            );

        updateMatchDisplay();

        boardLocked = true;

        setTimeout(function() {

            firstCard.classList.remove(
                "flipped"
            );

            secondCard.classList.remove(
                "flipped"
            );

            resetCards();

        }, 800);
    }
}


//=========================
// RESET SELECTED CARDS
//=========================

function resetCards() {

    firstCard = null;
    secondCard = null;

    boardLocked = false;
}

//=========================
// UPDATE DISPLAY
//=========================

function updateMatchDisplay() {

    document.getElementById(
        "matchCount"
    ).textContent =
        matches;

    document.getElementById(
        "matchCoins"
    ).textContent =
        coinsEarned;
}

//=========================
// FINISH GAME
//=========================

function finishMatchGame() {

    // Prevent duplicate rewards
    if (gameFinished) {
        return;
    }

    gameFinished = true;

    const save =
        localStorage.getItem(
            "catTamagotchiSave"
        );

    if (save) {

        const game =
            JSON.parse(save);

        // Only NOW are the coins
        // added to the real balance
        game.coins =
            (game.coins || 0) +
            coinsEarned;

        // Completing the game also
        // increases happiness
        game.happiness =
            Math.min(
                (game.happiness || 0) + 10,
                100
            );

        localStorage.setItem(
            "catTamagotchiSave",
            JSON.stringify(game)
        );
    }

    document.getElementById(
        "matchMessage"
    ).textContent =
        "You cleared the board! +" +
        coinsEarned +
        " coins!";
}