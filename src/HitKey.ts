import { Assets, Texture, Sprite, Container, Rectangle } from "pixi.js";
import { PhysicsContainer } from "./PhysicsContainer";
import { IHitbox } from "./IHitbox";
import { Tween } from "tweedle.js";

export class HitKey extends Container implements IHitbox {

    public key: Sprite;
    public keyTexture: Texture;
    private physKey: PhysicsContainer;

    public missed: boolean;

    constructor(keyTexture: Texture) {
        super();

        // ---------------------------
        // Assets load               |
        // ---------------------------
        Assets.loadBundle("keyboard_inputs");

        // ------------------------------------
        // Initialization of global variables |
        // ------------------------------------
        this.keyTexture = keyTexture;
        this.key = new Sprite(keyTexture);
        this.physKey = new PhysicsContainer();

        this.missed = false;

        // ---------------------------
        // Setup of global variables |
        // ---------------------------
        this.key.position.y = -120;
        this.key.position.x = screen.width / 2 - 2;

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