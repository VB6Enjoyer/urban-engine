import { Container, Graphics } from "pixi.js";
import { sound } from "@pixi/sound";

export class RoundButton extends Container {
    constructor() {
        super();

        // --------------------------------
        // Declaration of local variables |
        // --------------------------------
        let buttonGraph = new Graphics();

        // ---------------------------
        // Setup of local variables  |
        // ---------------------------
        buttonGraph.lineStyle({ color: 0xFFFFFF, width: 3, alpha: 0 });
        buttonGraph.beginFill(0x000000, Number.EPSILON);
        buttonGraph.drawCircle(0, 0, 25);
        buttonGraph.endFill();

        buttonGraph.eventMode = "dynamic";
        buttonGraph.cursor = "pointer";
        buttonGraph.on("pointerdown", onPointerDown);
        buttonGraph.on("pointerup", onPointerUp);

        sound.add("button", "./audio/button-press.mp3")

        // ---------------------------
        // Functions                 |
        // ---------------------------
        function onPointerDown() {
            sound.play("button");

            buttonGraph.clear();
            buttonGraph.beginFill(0x000000, 0.4);
            buttonGraph.drawCircle(0, 0, 25);
            buttonGraph.endFill();
        }

        function onPointerUp() {
            buttonGraph.clear();
            buttonGraph.beginFill(0x000000, 0.01);
            buttonGraph.drawCircle(0, 0, 25);
            buttonGraph.endFill();
        }

        // ---------------------------
        // Addition of children      |
        // ---------------------------
        this.addChild(buttonGraph);
    }
}