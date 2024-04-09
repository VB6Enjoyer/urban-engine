import { Assets, Container, Sprite, Texture, Text, TextStyle } from "pixi.js";
import { manifest } from "./assets";
import { sound } from "@pixi/sound";
import { ElectricSwitch } from "./ElectricSwitch";
import { Clock } from "./Clock";

export class Background extends Container {

    private room: Sprite;
    private stage: Sprite;
    private clock: Clock;
    private canClick: boolean = true;
    public lightsOn: boolean = true;
    private callback: Function;
    private callback2: Function;
    private content: Container;

    constructor(callback: () => void, callback2: () => void) {
        super();

        this.callback = callback;
        this.callback2 = callback2;

        Assets.init({ manifest: manifest });
        Assets.loadBundle("backgrounds");
        Assets.loadBundle("objects");
        Assets.loadBundle("fonts");
        Assets.loadBundle("spritesheet");

        this.content = new Container();

        this.room = Sprite.from("Room");
        this.stage = Sprite.from("Stage");
        this.stage.x = screen.width - 384;
        this.stage.visible = false;

        this.stage.scale.set(0.4799);

        const guitar = Sprite.from("objects/guitar.png");
        const electricSwitch = new ElectricSwitch(Texture.from("Switch-On"), Texture.from("Switch-Off"));
        electricSwitch.on("switchPress", this.onSwitchClick, this)

        this.clock = new Clock(
            Texture.from("Clock_Morning"),
            Texture.from("Clock_Transition1"),
            Texture.from("Clock_Transition2"),
            Texture.from("Clock_Night")
        );
        this.clock.on("clockPress", this.onClockClick, this);

        this.room.anchor.set(0);
        this.room.scale.set(2);

        electricSwitch.scale.set(0.08);
        electricSwitch.position.set(400, 480);

        this.clock.scale.set(0.11);
        this.clock.position.set(900, 350);

        guitar.scale.set(0.8);
        guitar.position.set(985, 500);

        // Adds an onClick event to play a random chord when the guitar is clicked.
        guitar.eventMode = "static";
        guitar.cursor = "pointer";
        guitar.on("pointerdown", this.onGuitarClick, this);

        const menuTextStyle = new TextStyle({
            fontSize: 60,
            fill: 0x000000,
            fontFamily: "PixelifySans"
        });

        const playText = new Text("Play", menuTextStyle);
        playText.anchor.set(0.5);
        playText.position.set(screen.width / 24, screen.height / 24);
        playText.eventMode = "static";
        playText.cursor = "pointer";
        playText.on("pointerdown", this.transitionToGameplay, this);

        this.content.addChild(this.room);
        this.content.addChild(this.stage);
        this.content.addChild(this.clock);
        this.content.addChild(electricSwitch);
        this.content.addChild(guitar);
        this.content.addChild(playText);
        this.addChild(this.content);
    }

    // TODO Gotta refine this one
    private onClockClick() {
        if (this.clock.timeText.text == "18:50" || this.clock.timeText.text == "21:10") {
            this.room.texture = Texture.from("Room-Night");
        } else {
            this.room.texture = Texture.from("Room");
        }
    }

    private onSwitchClick() {
        this.callback();

        if (this.lightsOn) {
            this.lightsOn = false;
        } else {
            this.lightsOn = true;
        }
    }

    private onGuitarClick() {
        if (this.canClick) {
            sound.add("chord", "./audio/chord" + (Math.floor(Math.random() * 5) + 1) + ".mp3")
            sound.play("chord");

            this.canClick = false;

            // Sets a cooldown of 5 seconds before being able to play another sound.
            setTimeout(() => {
                this.canClick = true;
            }, 5000);
        }
    }

    public transitionToGameplay() {
        let startTime = performance.now(); // Get the current timestamp
        const duration = 1250; // Duration of the animation in milliseconds

        this.stage.visible = true;

        const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1); // Calculate animation progress (0 to 1)

            // Lerp (linear interpolation) for a smoother transition
            const contentX = this.lerp(0, (-screen.width + 380), progress); // Calculate content.x using lerp
            this.content.x = contentX;

            if (progress < 1) {
                // Request the next animation frame
                requestAnimationFrame(animate);
            } else {
                // Animation complete
                this.room.visible = false;

                // Enforce exact final position to avoid variations.
                this.content.x = -screen.width + 380;
            }
        };

        // Start the animation
        requestAnimationFrame(animate);
        this.callback2();
    }

    // Helper function for linear interpolation. AI-generated for convenience.
    private lerp(start: number, end: number, amount: number) {
        return (1 - amount) * start + amount * end;
    }
}
