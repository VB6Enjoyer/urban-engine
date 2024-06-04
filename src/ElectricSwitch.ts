import { Container, Rectangle, Sprite, Texture, Text } from "pixi.js";
import { sound } from "@pixi/sound";

export class ElectricSwitch extends Container {

    private electricSwitch: Sprite;
    private switchOn: Texture;
    private switchOff: Texture;

    public isOn = true;

    private hoverText: Text;

    constructor(switchOn: Texture, switchOff: Texture) {
        super();

        // ------------------------------------
        // Initialization of global variables |
        // ------------------------------------
        this.switchOn = switchOn;
        this.switchOff = switchOff;

        this.electricSwitch = Sprite.from(switchOn);

        this.electricSwitch.hitArea = new Rectangle(this.electricSwitch.x, this.electricSwitch.y, this.electricSwitch.width, this.electricSwitch.height / 2);

        this.hoverText = new Text("", { fontSize: 280, fill: 0x000000, fontFamily: "helvetica" });

        // ---------------------------
        // Setup of global variables |
        // ---------------------------
        this.electricSwitch.eventMode = "static";
        this.electricSwitch.cursor = "pointer";
        this.electricSwitch.on("pointerdown", this.onPointerDown, this);
        this.electricSwitch.on("pointerover", this.onPointerOver, this);
        this.electricSwitch.on("pointerout", this.onPointerOut, this);

        this.hoverText.anchor.set(0.5);
        this.hoverText.visible = false;

        // ---------------------------
        // Setup of events           |
        // ---------------------------
        document.addEventListener("keydown", this.onKeyDown.bind(this));
        document.addEventListener("keyup", this.onKeyUp.bind(this));

        sound.add("switch-on", "./audio/switch-on.mp3");
        sound.add("switch-off", "./audio/switch-off.mp3")

        // ---------------------------
        // Addition of children      |
        // ---------------------------
        this.addChild(this.electricSwitch);
        this.addChild(this.hoverText);
    }

    // --------------------------------------------------
    // Interaction functions                            |
    // --------------------------------------------------
    private lightsOnOff(lightsState: boolean) {
        if (lightsState) {
            sound.play("switch-off");
            this.electricSwitch.texture = this.switchOff;
            this.electricSwitch.hitArea = new Rectangle(this.electricSwitch.x, this.electricSwitch.height / 2, this.electricSwitch.width, this.electricSwitch.height / 2);
            this.isOn = false;
        } else {
            sound.play("switch-on");
            this.electricSwitch.texture = this.switchOn;
            this.electricSwitch.hitArea = new Rectangle(this.electricSwitch.x, this.electricSwitch.y, this.electricSwitch.width, this.electricSwitch.height / 2);
            this.isOn = true;
        }
    }

    //TODO Make it so that the mouse pointer disappears upon clicking the switch.
    private onPointerDown() {
        this.emit("switchPress");
        this.lightsOnOff(this.isOn);
    }

    private onPointerOver() {
        this.showText(this.isOn);
    }

    private onPointerOut() {
        this.hoverText.visible = false;
    }

    private onKeyDown(key: KeyboardEvent) {
        if ((key.code == "ArrowUp" && this.isOn) || (key.code == "ArrowDown" && !this.isOn)) {
            this.lightsOnOff(this.isOn);
            this.showText(this.isOn);
        }
    }

    // Unfinished.
    private onKeyUp() {
        this.hoverText.visible = false;
    }

    // --------------------------------------------------
    // Auxiliary functions                              |
    // --------------------------------------------------
    private showText(lights: boolean) {
        this.hoverText.visible = true;

        if (lights) {
            this.hoverText.text = "Turn lights off";
            this.hoverText.position.set(this.electricSwitch.x + 150, this.electricSwitch.y - 165);
        } else {
            this.hoverText.text = "Turn lights on";
            this.hoverText.position.set(this.electricSwitch.x + 150, this.electricSwitch.height + 150);
        }
    }
}

/* KNOWN BUGS:
- Trying to turn the lights on/off with the keyboard doesn't work, even though the values being passed to the functions are correct.
*/