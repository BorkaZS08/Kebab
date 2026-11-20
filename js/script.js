var menu = new Screen("#menu-screen");
var game = new Screen("#game-screen");
var difficulty = new Difficulty("#difficulty-btn", "Közepes");

var gameInterval = null;
var collectArea = document.querySelector(".collectArea");

var startBtn = document.querySelector("#start-btn");
var backBtn = document.querySelector("#back-btn");
var gameDifficulty = document.querySelector("#game-difficulty");
var difficultyItems = document.querySelectorAll(".dropdown-item");
var klikkSzam = 0;

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

function collect(){
    document.querySelector(".collectBtn").classList.add("disabled");
    document.querySelector(".tray-empty").classList.add("d-none")
    document.querySelector(".tray-full").classList.remove("d-none")
}

document.querySelector(".collectArea").addEventListener("click", () => {
    if (klikkSzam <= 5 ) {
        var x = Math.random() * (collectArea.offsetWidth - 30);
            var speed = 3;
            var kebab = new Kebab(x, 0, speed, ".collectArea");
            klikkSzam++;
            kebab.fall();
            if(klikkSzam == 5){
                document.querySelector(".collectBtn").classList.remove("disabled")
                document.querySelector(".grill-full").classList.add("d-none")
                document.querySelector(".grill-empty").classList.remove("d-none")
                klikkSzam++
            }   
    }
}
);
