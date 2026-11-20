var menu = new Screen("#menu-screen");
var game = new Screen("#game-screen");
var difficulty = new Difficulty("#difficulty-btn", "Közepes");
var gameArea = document.querySelector("collectArea");

var startBtn = document.querySelector("#start-btn");
var backBtn = document.querySelector("#back-btn");
var gameDifficulty = document.querySelector("#game-difficulty");
var difficultyItems = document.querySelectorAll(".dropdown-item");

menu.show();

for (let i = 0; i < difficultyItems.length; i++) {
    difficultyItems[i].addEventListener("click", () => {
        difficulty.setName(difficultyItems[i].innerHTML);
    });
}

startBtn.addEventListener("click", () => {
    gameDifficulty.innerHTML = difficulty.getName();
    menu.hide();
    setTimeout(() => game.show(), 400);
});

backBtn.addEventListener("click", () => {
    game.hide();
    setTimeout(() => menu.show(), 400);
});