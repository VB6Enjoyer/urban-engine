import { Container, Rectangle, Graphics } from "pixi.js";
import { PhysicsContainer } from "./PhysicsContainer";
import { IHitbox } from "./IHitbox";
import { Tween } from "tweedle.js";

export class HitKey extends Container implements IHitbox {

    //public key: Sprite;
    public key: Graphics;
    private physKey: PhysicsContainer;

    public missed: boolean;

    constructor() {
        super();

        // ------------------------------------
        // Initialization of global variables |
        // ------------------------------------
        this.key = new Graphics()
        this.physKey = new PhysicsContainer();

        this.missed = false;

        // ---------------------------
        // Setup of global variables |
        // ---------------------------
        this.key.lineStyle({ color: 0x000000, width: 2, alpha: 1 });
        this.key.beginFill(0xFFFFFF, 1);
        this.key.drawRoundedRect(15, 20, 95, 45, 33);
        this.key.endFill();
        this.key.position.y = -120;
        this.key.position.x = screen.width / 2;

        this.physKey.speed.x = 50;
        this.physKey.speed.y = 50;
        this.physKey.acceleration.y = 50;

        // ---------------------------
        // Addition of children      |
        // ---------------------------
        this.addChild(this.physKey);
        this.physKey.addChild(this.key);
    }

    // --------------------------------------------------
    // Note-manipulation functions                      |
    // --------------------------------------------------
    public moveNote() {
        new Tween(this.key)
            .to({ y: 1020 }, 2000)
            .start();
        this.key.position.y = -120;
    }

    // --------------------------------------------------
    // Getters                                          |
    // --------------------------------------------------
    public getHitbox(): Rectangle {
        return this.physKey.getBounds();
    }

    public getPosition(): number {
        return this.key.y;
    }
}