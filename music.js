// =========================
// GUS BACKGROUND MUSIC
// =========================

const backgroundMusic =
    new Audio("assets/sound/theme.mp3");

backgroundMusic.loop = true;
backgroundMusic.volume = 0.12;


// =========================
// MUSIC SETTINGS
// =========================

let musicEnabled =
    localStorage.getItem("gusMusicEnabled") !== "false";


// =========================
// RESTORE MUSIC POSITION
// =========================

const savedMusicTime =
    sessionStorage.getItem("gusMusicTime");

if (savedMusicTime) {
    backgroundMusic.currentTime =
        parseFloat(savedMusicTime);
}


// =========================
// START MUSIC
// =========================

function startBackgroundMusic() {

    if (!musicEnabled) {
        return;
    }

    backgroundMusic.play().catch(function() {
        // Browser is waiting for user interaction
    });
}


// =========================
// SAVE MUSIC POSITION
// =========================

setInterval(function() {

    if (!backgroundMusic.paused) {

        sessionStorage.setItem(
            "gusMusicTime",
            backgroundMusic.currentTime
        );
    }

}, 500);


// =========================
// MUSIC BUTTON
// =========================

const musicToggle =
    document.getElementById("musicToggle");


function updateMusicButton() {

    if (!musicToggle) {
        return;
    }

    if (musicEnabled) {

        musicToggle.textContent = "♪";

        musicToggle.setAttribute(
            "aria-label",
            "Turn music off"
        );

    } else {

        musicToggle.textContent = "♪̸";

        musicToggle.setAttribute(
            "aria-label",
            "Turn music on"
        );
    }
}


if (musicToggle) {

    musicToggle.addEventListener(
        "click",
        function() {

            musicEnabled = !musicEnabled;

            localStorage.setItem(
                "gusMusicEnabled",
                musicEnabled
            );

            if (musicEnabled) {

                startBackgroundMusic();

            } else {

                backgroundMusic.pause();
            }

            updateMusicButton();
        }
    );
}


// =========================
// MOBILE AUTOPLAY
// =========================

function unlockMusic() {

    startBackgroundMusic();

    document.removeEventListener(
        "pointerdown",
        unlockMusic
    );
}

document.addEventListener(
    "pointerdown",
    unlockMusic
);


// =========================
// START
// =========================

updateMusicButton();
startBackgroundMusic();