import { Assets, Container, Sprite } from "pixi.js";
import { manifest } from "./assets";
import { sound } from "@pixi/sound";

export class Background extends Container {
    constructor() {
        super();

        Assets.init({ manifest: manifest });
        Assets.loadBundle("backgrounds");
        Assets.loadBundle("objects");

        const room = Sprite.from("Room");
        const guitar = Sprite.from("Guitar");

        room.anchor.set(0);

        room.scale.set(2);
        guitar.scale.set(0.8);
        guitar.position.set(985, 500);

        // Adds an onClick event to play a random chord when the guitar is clicked.
        guitar.eventMode = "static";
        guitar.cursor = "pointer";
        guitar.on("click", onClick)

        let canClick = true;

        function onClick() {
            if (canClick) {
                sound.add("chord", "./audio/chord" + (Math.floor(Math.random() * 5) + 1) + ".mp3")
                sound.play("chord");

                canClick = false;

                // Sets a cooldown of 5 seconds before being able to play another sound.
                setTimeout(() => {
                    canClick = true;
                }, 5000);
            }

        }

        this.addChild(room);
        this.addChild(guitar);
    }
}