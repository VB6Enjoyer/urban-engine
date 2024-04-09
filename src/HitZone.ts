import { Assets, Container, Rectangle, Graphics } from "pixi.js";
import { IHitbox } from "./IHitbox";

export class HitZone extends Container implements IHitbox {

    private graph: Graphics;

    constructor() {
        super();

        Assets.loadBundle("keyboard_inputs");

        this.graph = new Graphics()
        this.graph.lineStyle({ color: 0xaaaaaa, width: 4, alpha: 1 });
        this.graph.beginFill(0xffffff, 0.4);
        this.graph.drawRoundedRect(100, 100, 100, 100, 25);
        this.graph.endFill();

        this.graph.position.set(screen.width / 2 - 88, screen.height / 2);

        this.addChild(this.graph);
    }

    public getHitbox(): Rectangle {
        return this.graph.getBounds();
    }
}