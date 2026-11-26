var tesztJatek = document.createElement("div");
tesztJatek.id = "teszt-jatek";
document.body.appendChild(tesztJatek);

var kebab = new Kebab(10, 20, 5, "#teszt-jatek");
var elem = tesztJatek.firstElementChild;

console.assert(Kebab.pont == 0, "Hiba a Kebab.pont mezőben, nem 0 a kezdőértéke");

console.assert(tesztJatek.children.length == 1, "Hiba a konstruktorban, nem kerül elem a konténerbe");
console.assert(elem.classList.contains("kebab"), "Hiba a createKebab() függvényben, hiányzik a kebab osztály");
console.assert(elem.style.left == "10px", "Hiba a createKebab() függvényben, rossz a left érték");
console.assert(elem.style.top == "20px", "Hiba a createKebab() függvényben, rossz a top érték");

kebab.fall();
setTimeout(function () {
    console.assert(parseInt(elem.style.top) > 20, "Hiba a fall() függvényben, a kebab nem esik lefelé");

    kebab.remove();
    console.assert(tesztJatek.children.length == 0, "Hiba a remove() függvényben, nem törli az elemet");

    var utolsoTop = elem.style.top;
    setTimeout(function () {
        console.assert(elem.style.top == utolsoTop, "Hiba a remove() függvényben, törlés után is mozog a kebab");
        tesztJatek.remove();
    }, 100);
}, 100);
