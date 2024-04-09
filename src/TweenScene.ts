/* import { Assets, Container, Texture } from "pixi.js";
import { HitKey } from "./HitKey";
import { Easing, Tween } from "tweedle.js";

export class TweenScene extends Container {

    constructor() {
        super();

        Assets.loadBundle("keyboard_inputs");

        const key = new HitKey(Texture.from("S_Key"));
        key.x = -250;
        key.y = -100;
        this.addChild(key);

        const t = new Tween(key)
            .to({ y: 1020 }, 2000)
            .easing(Easing.Linear.None)
            .start();
    }
} */