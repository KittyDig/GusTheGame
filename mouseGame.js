// mouse chasing game

let score = 0;
let timeRemaining = 15;
let gameFinished = false;

const gameArea = document.getElementById("mouseGameArea");
const mouseTarget = document.getElementById("mouseTarget");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");

// move the mouse to a random location

function moveMouse() {

    const maximumLeft =
        gameArea.clientWidth - mouseTarget.offsetWidth;

    const maximumTop =
        gameArea.clientHeight - mouseTarget.offsetHeight;

    const randomLeft =
        Math.floor(Math.random() * maximumLeft);

    const randomTop =
        Math.floor(Math.random() * maximumTop);

    mouseTarget.style.left = randomLeft + "px";
    mouseTarget.style.top = randomTop + "px";
}

// catch the mouse

mouseTarget.addEventListener("click", function() {

    if (gameFinished) {
        return;
    }

    score++;

    scoreDisplay.textContent = score;

    moveMouse();
});

//rewards player

function rewardPlayer() {

    const save =
        localStorage.getItem("catTamagotchiSave");

    let game = save
        ? JSON.parse(save)
        : {
            hunger: 70,
            happiness: 70,
            energy: 70,
            coins: 0
        };

    const coinsEarned = score * 2;

    game.coins += coinsEarned;

    game.happiness =
        Math.min(game.happiness + 10, 100);

    game.energy =
        Math.max(game.energy - 5, 0);

    localStorage.setItem(
        "catTamagotchiSave",
        JSON.stringify(game)
    );

    alert(
        "Game over!\n" +
        "You caught " + score + " mice.\n" +
        "You earned " + coinsEarned + " coins!"
    );

    window.location.href = "games.html";
}

// game timer

const timer = setInterval(function() {

    timeRemaining--;

    timeDisplay.textContent = timeRemaining;

    if (timeRemaining <= 0) {

        clearInterval(timer);

        gameFinished = true;

        mouseTarget.disabled = true;

        rewardPlayer();
    }

}, 1000);

//start game

moveMouse();