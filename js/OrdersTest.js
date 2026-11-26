console.assert(veletlen(5, 5) == 5, "Hiba a veletlen() függvényben, nem a megadott számot adja vissza");

console.assert(idoSzoveg(0) == "0:00", "Hiba az idoSzoveg() függvényben, a 0 másodpercet rosszul írja ki");
console.assert(idoSzoveg(65) == "1:05", "Hiba az idoSzoveg() függvényben, nem teszi ki a nullát a másodpercek elé");

console.assert(sor("Hús") == '<li><span class="qty">1</span><span class="item">Hús</span><span class="price">$40</span></li>', "Hiba a sor() függvényben, rossz sort ad vissza");

var tesztCetli = document.createElement("div");
tesztCetli.innerHTML = '<div class="ticket-list"></div><button class="ticket-total"></button>';

ujRendeles(tesztCetli);
console.assert(tesztCetli.lista[0] == "Hús", "Hiba az ujRendeles() függvényben, a rendelés nem hússal kezdődik");
console.assert(tesztCetli.lista.length >= 2 && tesztCetli.lista.length <= 5, "Hiba az ujRendeles() függvényben, rossz a hozzávalók száma");
console.assert(tesztCetli.querySelector(".ticket-total").textContent == "$" + tesztCetli.osszeg, "Hiba az ujRendeles() függvényben, rosszul írja ki az összeget");

lejart(tesztCetli);
console.assert(tesztCetli.classList.contains("rejtett"), "Hiba a lejart() függvényben, nem rejti el a cetlit");
clearTimeout(tesztCetli.timeout);
