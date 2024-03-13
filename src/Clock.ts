import { Assets, Container, Texture, Text, Circle, Sprite } from "pixi.js";
import { sound } from "@pixi/sound";
import { manifest } from "./assets";

export class Clock extends Container {

    twelve: Texture;
    nine: Texture;
    six: Texture;
    three: Texture;

    private clock: Sprite;
    public timeText: Text;
    private canClick: Boolean;

    constructor(twelve: Texture, nine: Texture, six: Texture, three: Texture) {
        super();

        this.twelve = twelve;
        this.nine = nine;
        this.six = six;
        this.three = three;

        Assets.init({ manifest: manifest });
        Assets.loadBundle("objects");

        this.clock = Sprite.from(this.twelve);

        this.clock.eventMode = "static";
        this.clock.cursor = "pointer";
        this.clock.on("pointerdown", this.onPointerDown, this);
        this.clock.on("pointerover", this.onPointerOver, this);
        this.clock.on("pointerout", this.onPointerOut, this);

        this.clock.hitArea = new Circle(this.clock.width / 2, this.clock.height / 2, this.clock.width / 2);

        this.timeText = new Text("12:25", { fontSize: 280, fill: 0x000000, fontFamily: "times-new-roman" });
        this.timeText.anchor.set(0.5);
        this.timeText.position.set(this.clock.x + this.clock.width / 2, this.clock.y - 150);
        this.timeText.visible = false;

        document.addEventListener("keydown", this.onKeyDown.bind(this));
        document.addEventListener("keyup", this.onKeyUp.bind(this));

        this.canClick = true;

        sound.add("clock-ticking", "./audio/clock-ticking.mp3");

        this.addChild(this.clock);
        this.addChild(this.timeText);
    }

    // TODO Might want to optimize this
    private setTime(currentTime: String) {
        if (this.canClick) {
            sound.play("clock-ticking");

            if (currentTime == "12:25") {
                let frameIndex = 0;

                const animationInterval = setInterval(() => {
                    if (frameIndex == 0) {
                        this.clock.texture = this.three;
                        this.timeText.text = "15:25";
                        this.timeText.position.set(this.clock.x + this.clock.width + 350, this.clock.y + 350);
                    } else if (frameIndex == 1) {
                        this.clock.texture = this.six;
                        this.timeText.text = "18:50";
                        this.timeText.position.set(this.clock.x + this.clock.width / 2, this.clock.height + 150);
                    } else {
                        clearInterval(animationInterval);
                    }
                    frameIndex++;
                }, 800);
            } else if (currentTime == "18:50") {
                const animationInterval = setInterval(() => {
                    this.clock.texture = this.nine;
                    this.timeText.text = "21:10";
                    this.timeText.position.set(this.clock.x + this.clock.width - 1100, this.clock.y + 350);
                    clearInterval(animationInterval);
                }, 800)
            } else if (currentTime == "21:10") {
                let frameIndex = 0;

                const animationInterval = setInterval(() => {
                    if (frameIndex == 0) {
                        this.clock.texture = this.twelve;
                        this.timeText.text = "00:25";
                        this.timeText.position.set(this.clock.x + this.clock.width / 2, this.clock.y - 150);
                    } else if (frameIndex == 1) {
                        this.clock.texture = this.three;
                        this.timeText.text = "03:25";
                        this.timeText.position.set(this.clock.x + this.clock.width + 350, this.clock.y + 350);
                    } else if (frameIndex == 2) {
                        this.clock.texture = this.six;
                        this.timeText.text = "06:50";
                        this.timeText.position.set(this.clock.x + this.clock.width / 2, this.clock.height + 150);
                    } else {
                        clearInterval(animationInterval);
                    }
                    frameIndex++;
                }, 800);
            } else {
                let frameIndex = 0;

                const animationInterval = setInterval(() => {
                    if (frameIndex == 0) {
                        this.clock.texture = this.nine;
                        this.timeText.text = "09:10";
                        this.timeText.position.set(this.clock.x + this.clock.width - 1075, this.clock.y + 350);
                    } else if (frameIndex == 1) {
                        this.clock.texture = this.twelve;
                        this.timeText.text = "12:25";
                        this.timeText.position.set(this.clock.x + this.clock.width / 2, this.clock.y - 150);
                    } else {
                        clearInterval(animationInterval);
                    }
                    frameIndex++;
                }, 800);
            }
        }

        this.canClick = false;

        // Sets a cooldown of 5 seconds before being able to play another sound.
        // TODO Bugs out if the keyboard is used and a key is kept pressed.
        setTimeout(() => {
            this.canClick = true;
        }, 3000);
    }

    private showText(currentTime: String) {
        this.timeText.visible = true;
        this.timeText.text = currentTime.toString();
    }

    //TODO Make it so that the mouse pointer disappears upon clicking the switch
    private onPointerDown() {
        this.emit("clockPress");
        this.setTime(this.timeText.text);
    }

    private onPointerOver() {
        this.showText(this.timeText.text);
    }

    private onPointerOut() {
        this.timeText.visible = false;
    }

    private onKeyDown(key: KeyboardEvent) {
        if ((key.code == "ArrowRight")) {
            this.setTime(this.timeText.text);
            this.showText(this.timeText.text);
        }
    }

    private onKeyUp() {
        this.timeText.visible = false;
    }
}