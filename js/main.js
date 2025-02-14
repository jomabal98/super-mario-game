class Game {
    constructor() {
        this.container = document.getElementById("game-container");
        this.select = document.getElementById("arcade-select");
        this.character = null;
        this.coins = [];
        this.score = 0;
        this.firstMove = false;
        this.timer = 0;
        this.bgSound = undefined;
        this.createScenery();
        this.addEvents();
    }

    createScenery() {
        for (let i = 0; i < 5; i++) {
            this.createCoin();
        }

        this.character = new Character();
        setTimeout(() => {
            this.character.width = (50 * 100) / juego.container.offsetWidth;
        }, 200);

        this.container.appendChild(this.character.element);
        this.updateScore();
        this.select.addEventListener("change", () => {
            if (this.container.classList.contains("active")) {
                this.container.classList.toggle("active");
            }
        })
    }

    createCoin() {
        const coin = new Coin();
        this.coins.push(coin);
        this.container.appendChild(coin.element);
    }

    updateScore() {
        document.getElementById("score").innerHTML = `Score: ${this.score}`;
    }

    addEvents() {
        window.addEventListener("keydown", (e) => {
            this.checkMove(e);
        })

        document.getElementById("arrowLeft").addEventListener("click", (e) => {
            e.key = "ArrowLeft";
            this.checkMove(e);
        })

        document.getElementById("arrowLeft").addEventListener("click", (e) => {
            e.key = "ArrowLeft";
            this.checkMove(e);
        })

        document.getElementById("arrowRight").addEventListener("click", (e) => {
            e.key = "ArrowRight";
            this.checkMove(e);
        })

        document.getElementById("arrowUp").addEventListener("click", (e) => {
            e.key = "ArrowUp";
            this.checkMove(e);
        })

        this.checkCollision();
    }

    checkMove(e) {
        if (this.container.classList.contains("active") && this.select.value == 0) {
            return;
        }

        if (!this.firstMove && (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "ArrowUp")) {
            if (this.container.classList.contains("active")) {
                this.container.classList.toggle("active");
            }

            this.timer = this.select.value;
            if (this.timer < 10 || this.timer > 120) {
                return;
            }

            this.select.disabled = true;
            this.firstMove = true;
            if (this.bgSound === undefined) {
                this.bgSound = new Audio("./sound/mario theme.mp3");
                this.bgSound.loop = true;
                this.bgSound.play();
            }

            this.setTimer();
        }


        if (!this.character.move(e)) {
            this.container.classList.toggle("collapsing");
            setTimeout(() => {
                this.container.classList.toggle("collapsing");
            }, 200);
        }
    }
    setTimer() {
        let timerElement = document.getElementById("timer");
        timerElement.innerHTML = `Timer: ${this.timer}`;
        let interval = setInterval(() => {
            this.timer--;
            timerElement.innerHTML = `Timer: ${this.timer}`;
            if (this.timer == 0) {
                clearInterval(interval);
                timerElement.innerHTML = `Game Over:` + this.score;
                this.resetGame();
            }
        }, 1000);
    }

    resetGame() {
        this.select.disabled = false;
        this.select.value = 0;
        this.bgSound.pause();
        this.bgSound = undefined;
        this.container.classList.toggle("active");
        this.firstMove = false;
        this.score = 0;
        this.updateScore();
    }

    checkCollision() {
        setInterval(() => {
            this.coins.forEach((coin, index) => {
                if (this.character.collidedWith(coin)) {
                    let audio = new Audio("./sound/coin.mp3");
                    audio.play();
                    this.container.removeChild(coin.element);
                    this.coins.splice(index, 1);
                    this.createCoin();
                    this.score++;
                    this.updateScore();
                }
            })
        }, 100)
    }
}

class GameObject {
    constructor(x, y, width, height, objectClass) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.element = document.createElement("div");
        this.element.classList.add(objectClass);
    }

    updatePosition() {
        this.element.style.left = `${this.x}%`
        this.element.style.top = `${this.y}%`
    }
}

class Character extends GameObject {
    constructor() {
        super(50, 80, 10, 12.4, "personaje");
        super.updatePosition();
        this.speed = 2;
        this.jumping = false;
        super.updatePosition();
    }

    move(e) {
        if (e.key === "ArrowRight") {
            if (this.x >= 96) {
                return false;
            } else {
                this.x += this.speed;
            }
        } else if (e.key === "ArrowLeft") {
            if (this.x < 2) {
                return false;
            } else {
                this.x -= this.speed;
            }
        } else if (e.key === "ArrowUp") {
            this.jump();
            if (this.y <= 0) {
                this.updatePosition();
                return false;
            }
        }

        this.updatePosition();
        return true;
    }

    jump() {
        this.jumping = true;
        let maxHeight = this.y - 20;
        const jump = setInterval(() => {
            if (this.y > maxHeight && this.jumping && this.y > 0) {
                this.y -= 3;
            } else {
                clearInterval(jump);
                this.fall();
            }

            super.updatePosition();
        }, 20);
    }

    fall() {
        this.jumping = false;
        const gravity = setInterval(() => {
            if (!this.jumping && this.y < 80) {
                this.y += 3;
            } else {
                clearInterval(gravity);
            }

            super.updatePosition();
        }, 20);
    }

    collidedWith(obj) {
        return (
            this.x < obj.x + obj.width &&
            this.x + this.width > obj.x &&
            this.y < obj.y + obj.height &&
            this.y + this.height > obj.y
        )
    }
}

class Coin extends GameObject {
    constructor() {
        let x = (Math.random() * (80 - 20 + 1) + 20);
        let y = (Math.random() * (75 - 10 + 1) + 10);
        super(x, y, 2, 2, "moneda");
        super.updatePosition();
    }
}

let juego = new Game();
window.addEventListener('resize', function () {
    juego.character.width = (50 * 100) / juego.container.offsetWidth;
});