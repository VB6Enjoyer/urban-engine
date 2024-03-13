import { Assets, Container, Rectangle, Sprite, Texture, Text } from "pixi.js";
import { sound } from "@pixi/sound";
import { manifest } from "./assets";
import { Keyboard } from "./Keyboard";

export class ElectricSwitch extends Container {

    private switchOn: Texture;
    private switchOff: Texture;

    private electricSwitch: Sprite;
    public isOn = true;

    private hoverText: Text;

    constructor(switchOn: Texture, switchOff: Texture) {
        super();

        this.switchOn = switchOn;
        this.switchOff = switchOff;

        Assets.init({ manifest: manifest });
        Assets.loadBundle("objects");

        this.electricSwitch = Sprite.from(switchOn);

        this.electricSwitch.eventMode = "static";
        this.electricSwitch.cursor = "pointer";
        this.electricSwitch.on("pointerdown", this.onPointerDown, this);
        this.electricSwitch.on("pointerover", this.onPointerOver, this);
        this.electricSwitch.on("pointerout", this.onPointerOut, this);

        this.electricSwitch.hitArea = new Rectangle(this.electricSwitch.x, this.electricSwitch.y, this.electricSwitch.width, this.electricSwitch.height / 2); this.electricSwitch.hitArea = new Rectangle(this.electricSwitch.x, this.electricSwitch.y, this.electricSwitch.width, this.electricSwitch.height / 2);

        this.hoverText = new Text("", { fontSize: 280, fill: 0x000000, fontFamily: "helvetica" });
        this.hoverText.anchor.set(0.5);
        this.hoverText.visible = false;

        document.addEventListener("keydown", this.onKeyDown.bind(this));
        document.addEventListener("keyup", this.onKeyUp.bind(this));

        // This doesn't do anything currently, it's for testing but I should check why
        Keyboard.down.on("keydown", this.onKeyA, this);
        Keyboard.down.on("keyup", this.onKeyB, this);

        sound.add("switch-on", "./audio/switch-on.mp3");
        sound.add("switch-off", "./audio/switch-off.mp3")

        this.addChild(this.electricSwitch);
        this.addChild(this.hoverText);
    }

    private lightsOnOff(lights: boolean) {
        if (lights) {
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

    //TODO Make it so that the mouse pointer disappears upon clicking the switch
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

    private onKeyUp() {
        this.hoverText.visible = false;
    }

    // This doesn't do anything currently, it's for testing but I should check why
    private onKeyA() {
        console.log("Button clicked:", Keyboard.state.get("keydown"));
    }

    private onKeyB() {
        console.log("aprete la B", this);
    }
}