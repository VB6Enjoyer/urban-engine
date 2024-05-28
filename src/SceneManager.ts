import { Application, Ticker } from "pixi.js";
import { Keyboard } from "./Keyboard";
import { SceneAbstract } from "./SceneAbstract";
import { Group } from "tweedle.js";

export namespace SceneManager {

    let currentScene: SceneAbstract;
    let app: Application;

    export const WIDTH = 1536;
    export const HEIGHT = 1020;

    export function initialize() {
        if (app != undefined) { // Does app already exist?
            console.error("App can't be initialized twice.");
            return;
        }

        app = new Application<HTMLCanvasElement>({
            view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            backgroundColor: 0x000000,
            width: WIDTH,
            height: HEIGHT
        });

        Keyboard.initialize();

        window.addEventListener("resize", () => {
            const scaleX = window.innerWidth / app.screen.width
            const scaleY = window.innerHeight / app.screen.height;
            const scale = Math.min(scaleX, scaleY);

            const gameWidth = Math.round(app.screen.width * scale);
            const gameHeight = Math.round(app.screen.height * scale);

            const marginHorizontal = Math.floor((window.innerWidth - gameWidth) / 2);
            const marginVertical = Math.floor((window.innerHeight - gameHeight) / 2);

            if (app.view instanceof HTMLCanvasElement) {
                app.view.style.width = gameWidth + "px";
                app.view.style.height = gameHeight + "px";

                app.view.style.marginLeft = marginHorizontal + "px";
                app.view.style.marginRight = marginHorizontal + "px";

                app.view.style.marginTop = marginVertical + "px";
                app.view.style.marginBottom = marginVertical + "px";
            }
        });
        window.dispatchEvent(new Event("resize"));

        Ticker.shared.add(update);
    }

    export function changeScene(newScene: SceneAbstract) {
        if (currentScene) {
            currentScene.destroy();
        }

        currentScene = newScene;

        app.stage.addChild(currentScene);
    }

    function update(framePassed: number) {
        Group.shared.update();
        currentScene?.update(framePassed, Ticker.shared.elapsedMS);
    }
}