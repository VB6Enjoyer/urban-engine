import { Assets, Texture, Sprite, Container, Rectangle } from "pixi.js";
import { PhysicsContainer } from "./PhysicsContainer";
import { IHitbox } from "./IHitbox";

export class HitKey extends Container implements IHitbox {

    keyTexture: Texture;

    public key: Sprite;
    private physKey: PhysicsContainer;

    constructor(keyTexture: Texture) {
        super();

        Assets.loadBundle("keyboard_inputs");

        this.keyTexture = keyTexture;

        // Class extending from Container.
        this.key = new Sprite(keyTexture);
        this.key.position.y = -120;
        this.key.position.x = screen.width / 2;

        this.physKey = new PhysicsContainer();
        this.physKey.speed.x = 50;
        this.physKey.speed.y = 50;
        this.physKey.acceleration.y = 50;

        this.addChild(this.physKey);
        this.physKey.addChild(this.key);
    }

    public getHitbox(): Rectangle {
        return this.physKey.getBounds();
    }
}