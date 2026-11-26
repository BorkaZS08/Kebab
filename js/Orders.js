const arak = {
    'Hús': 40,
    'Hagyma': 20,
    'Saláta': 24,
    'Paradicsom': 28,
    'Lilakáposzta': 32,
    'Uborka': 36
};

const hozzavalok = ['Hagyma', 'Saláta', 'Paradicsom', 'Lilakáposzta', 'Uborka'];

const nehezsegek = {
    konnyu: { min: 8, max: 15, idoMin: 60, idoMax: 90, hibak: 5 },
    kozepes: { min: 4, max: 10, idoMin: 40, idoMax: 70, hibak: 3 },
    nehez: { min: 2, max: 6, idoMin: 25, idoMax: 50, hibak: 1 }
};

const szintNevek = { 'Könnyű': 'konnyu', 'Közepes': 'kozepes', 'Nehéz': 'nehez' };

let nehezseg = nehezsegek.kozepes;
let valasztottSzint = 'kozepes';

function veletlen(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

function idoSzoveg(masodperc) {
    return Math.floor(masodperc / 60) + ':' + String(masodperc % 60).padStart(2, '0');
}

function sor(nev) {
    return '<li><span class="qty">1</span><span class="item">' + nev + '</span><span class="price">$' + arak[nev] + '</span></li>';
}

function ujRendeles(cetli) {
    let lista = ['Hús'];
    let szoveg = sor('Hús');
    let darab = 2 + Math.floor(Math.random() * 4);

    while (lista.length < darab) {
        let szam = Math.floor(Math.random() * hozzavalok.length);
        let valasztott = hozzavalok[szam];

        if (!lista.includes(valasztott)) {
            lista.push(valasztott);
            szoveg += sor(valasztott);
        }
    }

    cetli.lista = lista;
    cetli.osszeg = lista.reduce((ossz, nev) => ossz + arak[nev], 0);
    cetli.querySelector('.ticket-list').innerHTML = szoveg;
    cetli.querySelector('.ticket-total').textContent = '$' + cetli.osszeg;
}

    // Ai --
function leadas(cetli) {
    let tartalom = [...contentsList.children].map((li) => li.textContent);

    if (tartalom.length != cetli.lista.length || !cetli.lista.every((nev) => tartalom.includes(nev))) {
        uzenet('Ez a kebab nem felel meg az elvárásoknak!');
        return;
    }

    penzMozgas(cetli.osszeg);
    tanyerUrites();
    lejart(cetli);
}
    //--
function varakozas(cetli) {
    let mp = veletlen(nehezseg.min, nehezseg.max);
    cetli.timeout = setTimeout(function () {
        megjelenik(cetli);
    }, mp * 1000);
}

function megjelenik(cetli) {
    let ido = veletlen(nehezseg.idoMin, nehezseg.idoMax);
    let kijelzo = cetli.querySelector('.ticket-timer');

    ujRendeles(cetli);
    cetli.parentElement.appendChild(cetli);
    kijelzo.textContent = idoSzoveg(ido);
    kijelzo.classList.remove('surgos');
    cetli.classList.remove('rejtett');

    cetli.interval = setInterval(function () {
        ido--;
        kijelzo.textContent = idoSzoveg(ido);

        if (ido <= 10) {
            kijelzo.classList.add('surgos');
        }

        if (ido <= 0) {
            lejart(cetli);
            hibazas();
        }
    }, 1000);
}

function lejart(cetli) {
    clearInterval(cetli.interval);
    cetli.classList.add('rejtett');
    varakozas(cetli);
}

function cetlik() {
    return document.querySelectorAll('.rendeles1, .rendeles2, .rendeles3');
}

function rendelesekLeallitasa() {
    cetlik().forEach(function (cetli) {
        clearTimeout(cetli.timeout);
        clearInterval(cetli.interval);
        cetli.classList.add('rejtett');
    });
}

function rendelesekInditasa() {
    rendelesekLeallitasa();

    cetlik().forEach(function (cetli) {
        varakozas(cetli);
    });
}

function aktualisSzint() {
  let szoveg = document.querySelector('#difficulty-btn').textContent.replace('Nehézség:', '').trim();
  return szintNevek[szoveg] || 'kozepes';
}

rendelesekLeallitasa();