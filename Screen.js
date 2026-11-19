class Screen {
    #element;

    constructor(selector) {
        this.setElement(selector);
    }

    setElement(selector) {
        this.#element = document.querySelector(selector);
    }

    show() {
        this.#element.classList.remove("d-none");
        setTimeout(() => this.#element.classList.add("is-entering"), 10);
    }

    hide() {
        this.#element.classList.add("is-leaving");
        setTimeout(() => {
            this.#element.classList.add("d-none");
            this.#element.classList.remove("is-leaving");
            this.#element.classList.remove("is-entering");
        }, 400);
    }
}