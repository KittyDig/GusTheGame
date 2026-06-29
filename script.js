    let game = {
      hunger: 70,
      happiness: 70,
      energy: 70,
      coins: 0
    };

    function updateGame() {
      document.getElementById("hungerBar").style.width = game.hunger + "%";
      document.getElementById("happyBar").style.width = game.happiness + "%";
      document.getElementById("energyBar").style.width = game.energy + "%";
      document.getElementById("coins").textContent = game.coins;

      localStorage.setItem("catTamagotchiSave", JSON.stringify(game));
    }

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
      alert("Shop coming soon! You will be able to buy cases, cats and backgrounds here.");
    }

    const menuItems = ["Feed", "Play", "Sleep", "Shop"];
let currentMenuIndex = 0;

function updateMenuText() {
  document.getElementById("selectedAction").textContent = menuItems[currentMenuIndex];
}

function previousMenuItem() {
  currentMenuIndex--;

  if (currentMenuIndex < 0) {
    currentMenuIndex = menuItems.length - 1;
  }

  updateMenuText();
}

function nextMenuItem() {
  currentMenuIndex++;

  if (currentMenuIndex >= menuItems.length) {
    currentMenuIndex = 0;
  }

  updateMenuText();
}

function selectMenuItem() {
  const selectedItem = menuItems[currentMenuIndex];

  if (selectedItem === "Feed") {
    feedCat();
  } else if (selectedItem === "Play") {
    playCat();
  } else if (selectedItem === "Sleep") {
    sleepCat();
  } else if (selectedItem === "Shop") {
    openShop();
  }
}

updateMenuText();

    function loadGame() {
      const savedGame = localStorage.getItem("catTamagotchiSave");

      if (savedGame) {
        game = JSON.parse(savedGame);
      }

      updateGame();
    }

    setInterval(() => {
      game.hunger = Math.max(game.hunger - 1, 0);
      game.happiness = Math.max(game.happiness - 1, 0);
      game.energy = Math.max(game.energy - 1, 0);
      updateGame();
    }, 10000);

    loadGame();