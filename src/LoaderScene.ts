import { Assets, Graphics } from "pixi.js";
import { SceneAbstract } from "./SceneAbstract";
import { SceneManager } from "./SceneManager";
import { MenuScene } from "./MenuScene";
import { manifest } from "./assets";

export class LoaderScene extends SceneAbstract {

    public update(): void { }

    public bar: Graphics;

    constructor() {
        super();

        // ------------------------------------
        // Initialization of global variables |
        // ------------------------------------
        this.bar = new Graphics();

        // ---------------------------
        // Setup of global variables |
        // ---------------------------
        this.setBarPercent(0);
        this.bar.x = SceneManager.WIDTH * 0.5;
        this.bar.y = SceneManager.HEIGHT * 0.5;
        this.bar.pivot.x = this.bar.width / 2;
        this.bar.pivot.y = this.bar.height / 2;

        // ---------------------------
        // Addition of children      |
        // ---------------------------
        this.addChild(this.bar);

        this.downloadAssets();
    }

    // --------------------------------------------------
    // Loading functions                                |
    // --------------------------------------------------
    private async downloadAssets() {
        await Assets.init({ manifest: manifest });

        const bundlesToLoad = [
            "backgrounds",
            "characters",
            "objects",
            "ui",
            "fx",
            "fonts",
            "spritesheet"
        ];

        const totalAssets = bundlesToLoad.length;
        let assetsLoaded = 0;

        for (const bundle of bundlesToLoad) {
            await Assets.loadBundle(bundle);

            assetsLoaded++;

            this.setBarPercent((assetsLoaded / totalAssets) * 100);
        }

        this.onComplete();
    }

    private setBarPercent(percent: number) {
        const factor = percent / 100;

        this.bar.clear();

        this.bar.beginFill(0xFF0000, 1);
        this.bar.drawRect(0, 0, SceneManager.WIDTH * 0.8 * factor, SceneManager.HEIGHT * 0.1);
        this.bar.endFill();

        this.bar.lineStyle(5, 0xFFFFFF, 1);
        this.bar.beginFill(0x000000, 0);
        this.bar.drawRect(0, 0, SceneManager.WIDTH * 0.8, SceneManager.HEIGHT * 0.1);
        this.bar.endFill();
    }

    // --------------------------------------------------
    // Scene-manipulation functions                              |
    // --------------------------------------------------
    private onComplete() {
        SceneManager.changeScene(new MenuScene());
    }
}