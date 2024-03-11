import { Assets, Container, Sprite } from "pixi.js";
import { manifest } from "./assets";
import { sound } from "@pixi/sound";

export class BuckWithAmp extends Container {
    constructor() {
        super();

        Assets.init({ manifest: manifest });
        Assets.loadBundle("characters");
        Assets.loadBundle("objects");

        const buck = Sprite.from("Buck-hd-eo");
        const amp = Sprite.from("Amplifier");

        buck.anchor.set(0);

        // TODO Add onclick events to make Buck close/open eyes and smile.

        // Adds an onClick event to play a random sound when Buck is clicked.
        buck.eventMode = "static";
        buck.cursor = "pointer";
        buck.on("click", onClick)

        let canClick = true;

        // Find a way to make it so the transparent space can't get clicked.

        function onClick() {
            let rndNum = (Math.floor(Math.random() * 5) + 1);

            if (canClick) {
                if (rndNum < 5) {
                    sound.add("sound", "./audio/riff" + rndNum + ".mp3");
                } else {
                    sound.add("sound", "./audio/solo.mp3");
                }

                sound.play("sound");

                canClick = false;
                console.log(canClick);

                let cooldownTime = 0;

                if (rndNum == 1) {
                    cooldownTime = 18000;
                }

                if (rndNum == 2) {
                    cooldownTime = 16000;
                }

                if (rndNum == 3) {
                    cooldownTime = 22000;
                }

                if (rndNum == 4) {
                    cooldownTime = 12000;
                }

                if (rndNum == 5) {
                    cooldownTime = 13000;
                }


                // Sets a cooldown before being able to play another sound.
                setTimeout(() => {
                    canClick = true;
                }, cooldownTime);
            }
        }

        amp.position.set(350, 300);
        amp.scale.set(2.3);

        this.addChild(buck);
        this.addChild(amp);
    }
}