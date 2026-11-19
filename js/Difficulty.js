class Difficulty {
    #name;
    #button;

    constructor(button, name) {
        this.setButton(button);
        this.setName(name);
    }

    setButton(button) {
        this.#button = document.querySelector(button);
    }

    setName(name) {
        this.#name = name;
        this.#button.innerHTML = "Nehézség: " + name;
    }

    getName() {
        return this.#name;
    }
}