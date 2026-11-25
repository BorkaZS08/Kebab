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
var husAdag = 0;
var egyenleg = 200;
var kezdes = 0;
var hibak = 0;
var modal = document.querySelector("#eredmeny-modal");
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
        if (name === "Hús") {
            husAdag--;
            husFrissites();
            if (husAdag == 0) {
                document.querySelector(".tray-full").classList.add("d-none");
                document.querySelector(".tray-empty").classList.remove("d-none");
            }
        }
    }
    hitbox.animate([{ background: ok ? "rgba(255, 220, 120, 0.55)" : "rgba(255, 40, 40, 0.45)" }, {}], 300);
});

document.querySelector(".pita-area").addEventListener("click", () => {
    if (hidden(".plate-empty")) return;
    document.querySelector(".plate-empty").classList.add("d-none")
    document.querySelector(".pita-plate").classList.remove("d-none");
    showContents(true);
})

function tanyerUrites() {
    document.querySelector(".pita-plate").classList.add("d-none");
    document.querySelector(".plate-full").classList.add("d-none");
    document.querySelector(".plate-empty").classList.remove("d-none");
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
        ablak(cim, `Játékidő: ${ido}<br>Egyenleg: $${egyenleg}`);
    }, 400);
}

function hibazas() {
    hibak++;
    hibaFrissites();
    if (hibak == nehezseg.hibak) jatekVege("Vesztettél!");
}

function hibaFrissites() {
    document.querySelector(".hibak").textContent = hibak + "/" + nehezseg.hibak;
}

function husFrissites() {
    document.querySelector(".hus-szam").textContent = husAdag + "/5";
}

function ujJatek() {
    egyenleg = 200;
    husAdag = 0;
    klikkSzam = 0;
    hibak = 0;
    nehezseg = nehezsegek[aktualisSzint()];
    document.querySelector(".grill-full").classList.remove("d-none");
    document.querySelector(".grill-empty").classList.add("d-none");
    document.querySelector(".tray-empty").classList.remove("d-none");
    document.querySelector(".tray-full").classList.add("d-none");
    document.querySelector(".buyBtn").disabled = true;
    document.querySelectorAll(".penz").forEach((felirat) => felirat.remove());
    tanyerUrites();
    gyujtesGomb();
    egyenlegFrissites();
    hibaFrissites();
    husFrissites();
}

function gyujtesGomb() {
    document.querySelector(".collectBtn").disabled = klikkSzam != 6;
}

function collect() {
    if (husAdag > 0) {
        uzenet("Még maradt hús a hozzávalóknál!");
        return;
    }
    document.querySelector(".tray-empty").classList.add("d-none")
    document.querySelector(".tray-full").classList.remove("d-none")
    document.querySelector(".buyBtn").disabled = false;
    husAdag = 5;
    klikkSzam = 7;
    husFrissites();
    gyujtesGomb();
}

function vetel() {
    if (egyenleg < 50) {
        uzenet("Nincs elég pénzed új kebabra!");
        return;
    }
    penzMozgas(-50);
    klikkSzam = 0;
    document.querySelector(".buyBtn").disabled = true;
    document.querySelector(".grill-empty").classList.add("d-none");
    document.querySelector(".grill-full").classList.remove("d-none");
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

document.querySelector(".collectArea").addEventListener("click", () => {
    if (klikkSzam <= 5) {
        var x = Math.random() * (collectArea.offsetWidth - 30);
        var speed = 3;
        var kebab = new Kebab(x, 0, speed, ".collectArea");
        klikkSzam++;
        kebab.fall();
        if (klikkSzam == 5) {
            document.querySelector(".grill-full").classList.add("d-none")
            document.querySelector(".grill-empty").classList.remove("d-none")
            klikkSzam++
            gyujtesGomb();
        }
    }
}
);

var contentsList = document.querySelector(".contents-list");
var hidden = (sel) => document.querySelector(sel).classList.contains("d-none");
var showContents = (show) => document.querySelectorAll(".contents-label, .contents-panel").forEach((el) => el.classList.toggle("d-none", !show));