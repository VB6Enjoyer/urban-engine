import { AnimatedSprite, Assets, Container, Sprite, Texture } from "pixi.js";
import { manifest } from "./assets";
import { sound } from "@pixi/sound";
import { StateAnimation } from "./StateAnimation";

export class BuckWithAmp extends Container {

    private canClick = true;
    private buckAnimated: StateAnimation;
    private notesAnimated: AnimatedSprite; // TODO Turn into StateAnimation

    constructor() {
        super();

        Assets.init({ manifest: manifest });
        Assets.loadBundle("characters");
        Assets.loadBundle("objects");
        Assets.loadBundle("fx");

        const buck = Sprite.from("Buck-hd-eo");
        const amp = Sprite.from("Amplifier");

        buck.anchor.set(0);

        // Animated sprite.
        this.buckAnimated = new StateAnimation();

        // TODO Use the addState function to add face animations
        this.buckAnimated.addState("play", [
            Texture.from("Buck-hd-eo"),
            Texture.from("Buck-hu-eo"),
        ]);

        this.buckAnimated.addState("idle", [
            Texture.from("Buck-hd-eo")
        ]);

        this.notesAnimated = new AnimatedSprite(
            [
                Texture.from("Notes_1"),
                Texture.from("Notes_2")
            ],
            true
        );
        this.notesAnimated.animationSpeed = 0.025;
        this.notesAnimated.position.set(350, 50);
        this.notesAnimated.scale.set(0.33);
        this.notesAnimated.visible = false;
        this.notesAnimated.onFrameChange = (frame: number) => {
            if (frame == 0) {
                this.notesAnimated.position.set(350, 50);
            }

            if (frame == 1) {
                this.notesAnimated.position.set(440, 40);
            }
        }

        // TODO Add onclick events to make Buck close/open eyes and smile.

        // Adds an onClick event to play a random sound when Buck is clicked.
        buck.eventMode = "static";
        buck.cursor = "pointer";
        buck.on("pointerdown", this.playGuitar, this)

        amp.position.set(310, 300);
        amp.scale.set(2.3);

        this.addChild(buck);
        this.addChild(amp);
        this.addChild(this.buckAnimated);
        this.addChild(this.notesAnimated);
    }

    // Find a way to make it so the transparent space can't get clicked.

    private playGuitar(): void {
        let rndNum = (Math.floor(Math.random() * 5) + 1);

        if (this.canClick) {
            if (rndNum < 5) {
                sound.add("sound", "./audio/riff" + rndNum + ".mp3");
            } else {
                sound.add("sound", "./audio/solo.mp3");
            }

            sound.play("sound");
            this.buckAnimated.playState("play");
            this.notesAnimated.visible = true;
            this.notesAnimated.play();

            this.canClick = false;

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
                this.canClick = true;
                this.buckAnimated.playState("idle");
                this.notesAnimated.stop();
                this.notesAnimated.visible = false;
            }, cooldownTime);
        }
    }

    public update(frame: number) {
        this.buckAnimated.update(frame);
    }
}