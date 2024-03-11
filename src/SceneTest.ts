// This is a test for different features, its only purpose is for testing.

import { AnimatedSprite, Container, Graphics, Texture, Text, NineSlicePlane } from "pixi.js";
//import { BuckWithAmp } from "./BuckWithAmp";

export class Scene extends Container {
    constructor() {
        super();

        // Class extending from Container.
        //const buckWithAmp = new buckWithAmp();
        //this.addChild(buckWithAmp);

        // Animated sprite.
        const coverAnimated = new AnimatedSprite(
            [
                Texture.from("Epitaph-Hot"),
                Texture.from("Epitaph-Cold"),
                Texture.from("Epitaph-Dark")
            ],
            true
        );

        coverAnimated.play();
        coverAnimated.animationSpeed = 0.05;

        this.addChild(coverAnimated);

        // Graphics
        const myGraph = new Graphics();
        myGraph.lineStyle({ color: 0xFFFFFF, width: 10, alpha: 1 });
        myGraph.moveTo(0, 0);
        myGraph.lineTo(100, 300);
        myGraph.lineTo(100, 200);
        myGraph.lineTo(0, 0);

        myGraph.clear();

        myGraph.lineStyle({ color: 0xFFFFFF, width: 10, alpha: 1 });
        myGraph.beginFill(0x000000, 1);
        myGraph.drawCircle(0, 0, 100);
        myGraph.endFill();
        myGraph.drawCircle(50, 50, 100);

        myGraph.position.set(120, 1300);
        this.addChild(myGraph);

        // Text
        const myText = new Text("New Single", { fontSize: 48, fill: 0xFFFFFF, fontFamily: "times-new-roman" });
        myText.text = "New Single Out!";
        myText.position.x = 500;
        myText.position.y = 160;
        myText.angle = 356;
        myText.scale.set(1.1); // This turns text into a texture, so it becomes blurry when upscaled.   
        this.addChild(myText);

        // Nine-Slice Plane
        const panel = new NineSlicePlane(Texture.from("Panel"), 35, 35, 35, 35);
        panel.width = 1500;
        panel.height = 1500;
        this.addChild(panel);
    }
}