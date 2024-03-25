import { Assets, Texture, Container, Rectangle } from "pixi.js";
import { IUpdateable } from "./IUpdateable";
import { IHitbox, checkCollision } from "./IHitbox";
import { HitKey } from "./HitKey";
import { HitZone } from "./HitZone";

export class TickerScene extends Container implements IUpdateable, IHitbox {

    public hitKey: HitKey;
    private hitZone: HitZone;

    constructor() {
        super();

        Assets.loadBundle("keyboard_inputs");

        // Class extending from Container.
        this.hitKey = new HitKey(Texture.from("W_Key"));
        this.hitZone = new HitZone();

        this.addChild(this.hitZone);
        this.addChild(this.hitKey);

        this.onKeyDown = this.onKeyDown.bind(this);
        document.addEventListener("keydown", this.onKeyDown);
    }

    public update(deltaFrame: number, _deltaTime: number) { //The _ is temporary so that I don't have to use the var
        setInterval(() => {
            this.hitKey.y++;
        }, deltaFrame * 20); // Temporary
    }

    private onKeyDown(key: KeyboardEvent) {
        if ((key.code == "KeyW") && checkCollision(this.hitKey, this.hitZone)) {
            this.removeChild(this.hitKey);
            console.log("+100 points");
        }
    }

    public getHitbox(): Rectangle {
        return this.hitZone.getBounds();
    }
}