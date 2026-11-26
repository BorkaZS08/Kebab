var menu = new Screen("#menu-screen");
var game = new Screen("#game-screen");
var difficulty = new Difficulty("#difficulty-btn", "Közepes");

var collectArea = document.querySelector(".collectArea");

var startBtn = document.querySelector("#start-btn");
var backBtn = document.querySelector("#back-btn");
var gameDifficulty = document.querySelector("#game-difficulty");
var difficultyItems = document.querySelectorAll(".dropdown-item");
var klikkSzam = 0;
var husAdag = 0;
var egyenleg = 200;
var kezdes = 0;
var hibak = 0;
var modal = document.querySelector("#eredmeny-modal");

// ---Ai---

Object.keys(arak).forEach((name, i) =>
    document.querySelector(".tray-area").insertAdjacentHTML("beforeend", `<div class="ingredient-hitbox" data-ingredient="${name}" style="--i:${i}"></div>`));

document.querySelector(".tray-area").addEventListener("click", (e) => {
    var hitbox = e.target.closest(".ingredient-hitbox");
    if (!hitbox) return;
    var name = hitbox.dataset.ingredient;
    var ok = hidden(".plate-empty") && !(name === "Hús" && hidden(".tray-full")) && !tanyerTartalma().includes(name);
    if (ok) {
        contentsList.insertAdjacentHTML("beforeend", `<li>${name}</li>`);
        csere(".plate-full", ".pita-plate");
        if (name === "Hús") {
            husAdag--;
            husFrissites();
            if (husAdag == 0) csere(".tray-empty", ".tray-full");
        }
    }
    hitbox.animate([{ background: ok ? "#ffdc788c" : "#ff282873" }, {}], 300);
});

///
document.querySelector(".pita-area").addEventListener("click", () => {
    if (hidden(".plate-empty")) return;
    csere(".pita-plate", ".plate-empty");
    showContents(true);
})

function tanyerUrites() {
    csere(".plate-empty", ".pita-plate", ".plate-full");
    contentsList.innerHTML = "";
    showContents(false);
}

document.querySelector(".trash-area").addEventListener("click", tanyerUrites);

menu.show();

for (let i = 0; i < difficultyItems.length; i++) {
    difficultyItems[i].addEventListener("click", () => {
        difficulty.setName(difficultyItems[i].innerHTML);
    });
}

startBtn.addEventListener("click", () => {
    gameDifficulty.innerHTML = difficulty.getName();
    ujJatek();
    menu.hide();
    setTimeout(() => {
        game.show();
        ablak("Játékmenet", `Kattints a grillre 5-ször, majd gyűjtsd be a levágott húst.<br>
            Vegyél egy pitát, és tedd bele a rendelésen szereplő hozzávalókat.<br>
            A kész kebabot a cetlin lévő összegre kattintva adhatod le, az elrontottat dobd a kukába.<br>
            Egy kebab 5 adagra elég, utána vegyél újat $50-ért.<br>
            Ha ${nehezseg.hibak} rendelés ideje lejár, vesztettél!`);
        modal.addEventListener("hidden.bs.modal", () => {
            kezdes = Date.now();
            rendelesekInditasa();
        }, { once: true });
    }, 400);
});

backBtn.addEventListener("click", () => jatekVege("Játék vége"));

function ablak(cim, szoveg) {
    modal.querySelector("h2").textContent = cim;
    modal.querySelector("p").innerHTML = szoveg;
    bootstrap.Modal.getOrCreateInstance(modal).show();
}

function jatekVege(cim) {
    var ido = idoSzoveg(Math.floor((Date.now() - kezdes) / 1000));
    rendelesekLeallitasa();
    game.hide();
    setTimeout(() => {
        menu.show();
        ablak(cim, `Játékidő: ${ido}<br>Egyenleg: $${egyenleg}<br>Pont: <span class="pont">${Kebab.pont}</span>`);
    }, 400);
}

function gyujtesGomb() {
    document.querySelector(".collectBtn").disabled = klikkSzam != 6;
}



function hibaFrissites() {
    document.querySelector(".hibak").textContent = hibak + "/" + nehezseg.hibak;
}

function pontFrissites() {
    document.querySelector("#pont-kijelzo").textContent = Kebab.pont;
}

function husFrissites() {
    document.querySelector(".hus-szam").textContent = husAdag + "/5";
}


function collect() {
    if (husAdag > 0) {
        uzenet("Még maradt hús a hozzávalóknál!");
        return;
    }
    csere(".tray-full", ".tray-empty");
    document.querySelector(".buyBtn").disabled = false;
    husAdag = 5;
    klikkSzam = 7;
    husFrissites();
    gyujtesGomb();
}

function ujJatek() {
    egyenleg = 200;
    husAdag = 0;
    klikkSzam = 0;
    hibak = 0;
    Kebab.pont = 0;
    nehezseg = nehezsegek[aktualisSzint()];
    csere(".grill-full", ".grill-empty");
    csere(".tray-empty", ".tray-full");
    document.querySelector(".buyBtn").disabled = true;
    document.querySelectorAll(".penz").forEach((felirat) => felirat.remove());
    tanyerUrites();
    gyujtesGomb();
    egyenlegFrissites();
    hibaFrissites();
    husFrissites();
    pontFrissites();
}

function vetel() {
    if (egyenleg < 50) {
        uzenet("Nincs elég pénzed új kebabra!");
        return;
    }
    penzMozgas(-50);
    klikkSzam = 0;
    document.querySelector(".buyBtn").disabled = true;
    csere(".grill-full", ".grill-empty");
}

function uzenet(szoveg) {
    var doboz = document.querySelector(".uzenet");
    doboz.textContent = szoveg;
    bootstrap.Toast.getOrCreateInstance(doboz).show();
}

function egyenlegFrissites() {
    document.querySelector(".AvailableCurrency").textContent = "$" + egyenleg;
}

function penzMozgas(osszeg) {
    var felirat = document.createElement("span");
    egyenleg += osszeg;
    felirat.className = "penz " + (osszeg < 0 ? "kiadas" : "bevetel");
    felirat.textContent = (osszeg < 0 ? "-$" : "+$") + Math.abs(osszeg);
    document.querySelector(".Currency").appendChild(felirat);
    if (osszeg < 0) egyenlegFrissites();
    felirat.addEventListener("animationend", () => {
        felirat.remove();
        egyenlegFrissites();
    });
}

function hibazas() {
    hibak++;
    hibaFrissites();
    if (hibak == nehezseg.hibak) jatekVege("Vesztettél!");
}

collectArea.addEventListener("click", () => {
    if (klikkSzam <= 5) {
        var x = Math.random() * (collectArea.offsetWidth - 30);
        var speed = 3;
        var kebab = new Kebab(x, 0, speed, ".collectArea");
        klikkSzam++;
        kebab.fall();
        if (klikkSzam == 5) {
            csere(".grill-empty", ".grill-full");
            klikkSzam++
            gyujtesGomb();
        }
    }
}
);

var contentsList = document.querySelector(".contents-list");
var hidden = (sel) => document.querySelector(sel).classList.contains("d-none");
var tanyerTartalma = () => [...contentsList.children].map((li) => li.textContent);

function csere(mutat, ...elrejt) {
    document.querySelector(mutat).classList.remove("d-none");
    elrejt.forEach((sel) => document.querySelector(sel).classList.add("d-none"));
}
var showContents = (show) => document.querySelectorAll(".contents-label, .contents-panel").forEach((el) => el.classList.toggle("d-none", !show));