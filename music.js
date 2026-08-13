// =========================
// GUS BACKGROUND MUSIC
// =========================

const backgroundMusic = new Audio(
    "assets/sound/theme.mp3"
);

backgroundMusic.loop = true;
backgroundMusic.volume = 0.12;


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
// PLAY MUSIC
// =========================

function startBackgroundMusic() {

    backgroundMusic.play().catch(function() {

        // Autoplay was blocked.
        // First user interaction will start it.

    });
}


// =========================
// SAVE POSITION
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
// MOBILE AUTOPLAY FIX
// =========================

function unlockMusic() {

    startBackgroundMusic();

    document.removeEventListener(
        "pointerdown",
        unlockMusic
    );
}


// Try autoplay first
startBackgroundMusic();

// Otherwise wait for first touch
document.addEventListener(
    "pointerdown",
    unlockMusic
);