//=========================
// SHOP SOUND EFFECTS
//=========================

const shopOpenSound =
    new Audio("assets/sound/shopOpen.mp3");


//=========================
// OPEN SHOP
//=========================

function enterShop(event, shopPage) {

    // Stop the link from opening immediately
    event.preventDefault();

    // Restart the bell from the beginning
    shopOpenSound.currentTime = 0;

    shopOpenSound.play().catch(function(error) {

        console.log(
            "Shop sound could not play:",
            error
        );
    });


    // Give the bell a moment to play
    // before changing pages
    setTimeout(function() {

        window.location.href =
            shopPage;

    }, 400);
}