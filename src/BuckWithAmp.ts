import { AnimatedSprite, Container, Sprite, Texture } from "pixi.js";
import { sound } from "@pixi/sound";
import { StateAnimation } from "./StateAnimation";

export class BuckWithAmp extends Container {

    public canClick = true;
    private buckAnimated: StateAnimation;
    private notesAnimated: AnimatedSprite; // TODO Turn into StateAnimation.

    constructor() {
        super();

        // ------------------------------------
        // Initialization of global variables |
        // ------------------------------------
        this.buckAnimated = new StateAnimation();
        this.notesAnimated = new AnimatedSprite(
            [
                Texture.from("Notes_1"),
                Texture.from("Notes_2")
            ],
            true
        );

        // --------------------------------
        // Declaration of local variables |
        // --------------------------------
        const buck = Sprite.from("Buck-hd-eo");
        const amp = Sprite.from("Amplifier");

        // ---------------------------
        // Setup of global variables |
        // ---------------------------
        // TODO Use the addState function to add face animations
        this.buckAnimated.addState("play", [
            Texture.from("Buck-hd-eo"),
            Texture.from("Buck-hu-eo"),
        ]);

        this.buckAnimated.addState("idle", [
            Texture.from("Buck-hd-eo")
        ]);

        this.notesAnimated.animationSpeed = 0.025;
        this.notesAnimated.position.set(350, 50);
        this.notesAnimated.scale.set(0.33);
        this.notesAnimated.visible = false;
        // Move the position of the musical notes on screen for better animation.
        this.notesAnimated.onFrameChange = (frame: number) => {
            if (frame == 0) {
                this.notesAnimated.position.set(350, 50);
            }

            if (frame == 1) {
                this.notesAnimated.position.set(440, 40);
            }
        }

        // ---------------------------
        // Setup of local variables  |
        // ---------------------------
        buck.anchor.set(0);
        buck.eventMode = "static";
        buck.cursor = "pointer";
        buck.on("pointerdown", this.playGuitar, this) // Add an onClick event to play a random sound when Buck is clicked.

        amp.position.set(310, 300);
        amp.scale.set(2.3);

        // ---------------------------
        // Addition of children      |
        // ---------------------------
        this.addChild(buck);
        this.addChild(amp);
        this.addChild(this.buckAnimated);
        this.addChild(this.notesAnimated);
    }

    // --------------------------------------------------
    // Interaction functions                            |
    // --------------------------------------------------
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

            // Can't get duration from sound, function returns error, so instead I use these conditionals.
            // Tried multiple solutions, but seemingly can't get it to work.
            if (rndNum == 1) {
                cooldownTime = 18000;
            } else if (rndNum == 2) {
                cooldownTime = 16000;
            } else if (rndNum == 3) {
                cooldownTime = 22000;
            } else if (rndNum == 4) {
                cooldownTime = 12000;
            } else if (rndNum == 5) {
                cooldownTime = 13000;
            } else {
                console.error("Well, uh, somehow you got a number outside of the expected range. Congrats on breaking my code!")
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

    // --------------------------------------------------
    // Update                                           |
    // --------------------------------------------------
    public update(frame: number) {
        this.buckAnimated.update(frame);
    }
}

/* KNOWN BUGS:
- The transparent space spanning Buck's sprite can be clicked. A custom hitbox based on graphs should be used instead.
*/