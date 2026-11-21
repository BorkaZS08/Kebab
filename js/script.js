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

var contentsList = document.querySelector(".contents-list");
var hidden = (sel) => document.querySelector(sel).classList.contains("d-none");
var showContents = (show) => document.querySelectorAll(".contents-label, .contents-panel").forEach((el) => el.classList.toggle("d-none", !show));

["Hagyma", "Saláta", "Paradicsom", "Lilakáposzta", "Uborka", "Hús"].forEach((name, i) =>
    document.querySelector(".tray-area").insertAdjacentHTML("beforeend", `<div class="ingredient-hitbox" data-ingredient="${name}" style="--i:${i}"></div>`));

document.querySelector(".tray-area").addEventListener("click", (e) => {
    var hitbox = e.target.closest(".ingredient-hitbox");
    if (!hitbox) return;
    var name = hitbox.dataset.ingredient;
    var ok = hidden(".plate-empty") && !(name === "Hús" && hidden(".tray-full")) && ![...contentsList.children].some((li) => li.textContent === name);
    if (ok) {
        contentsList.insertAdjacentHTML("beforeend", `<li>${name}</li>`);
        document.querySelector(".pita-plate").classList.add("d-none");
        document.querySelector(".plate-full").classList.remove("d-none");
    }
    hitbox.animate([{ background: ok ? "rgba(255, 220, 120, 0.55)" : "rgba(255, 40, 40, 0.45)" }, {}], 300);
});

document.querySelector(".pita-area").addEventListener("click", () => {
    if (hidden(".plate-empty")) return;
    document.querySelector(".plate-empty").classList.add("d-none")
    document.querySelector(".pita-plate").classList.remove("d-none");
    showContents(true);
})

document.querySelector(".trash-area").addEventListener("click", () => {

    document.querySelector(".pita-plate").classList.add("d-none");
    document.querySelector(".plate-full").classList.add("d-none");
    document.querySelector(".plate-empty").classList.remove("d-none");
    contentsList.innerHTML = "";
    showContents(false);
})
