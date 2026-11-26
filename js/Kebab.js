class Kebab {

    #x;
    #y;
    #speed;
    #container;
    #element;
    #fallInterval;

    static pont = 0;

    constructor(x, y, speed, container) {
        this.setX(x);
        this.setY(y);
        this.setSpeed(speed);
        this.setContainer(container);
        this.createKebab();
    }

    setX(x) {
        this.#x = x;
    }

    setY(y) {
        this.#y = y;
    }

    setSpeed(speed) {
        this.#speed = speed;
    }

    setContainer(container) {
        this.#container = document.querySelector(container);
    }

    createKebab() {
        this.#element = document.createElement("div");
        this.#element.style.left = this.#x + "px";
        this.#element.style.top = this.#y + "px";
        this.#element.classList.add("kebab")
        this.#container.appendChild(this.#element);
    } 

   
    fall(){
        this.#fallInterval = setInterval(() => {
            this.#y += this.#speed;
            this.#element.style.top = this.#y + "px";

            if(this.#y > this.#container.offsetHeight){
                this.remove();
            }
        }, 20);
    }

    remove(){
        clearInterval(this.#fallInterval);
        this.#element.remove();
    }

    
}