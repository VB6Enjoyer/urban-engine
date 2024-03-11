import { AnimatedSprite, Assets, Container, Texture, Sprite, Text, NineSlicePlane } from "pixi.js";
import { BuckWithAmp } from "./BuckWithAmp";

export class Scene extends Container {
    constructor() {
        super();

        // Class extending from Container.
        const buckWithAmp = new BuckWithAmp();
        this.addChild(buckWithAmp);

        Assets.loadBundle("ui");

        const ui_player = Sprite.from("UI_Player");

        ui_player.scale.set(1.5)
        ui_player.position.set(970, 260);
        this.addChild(ui_player);

        // Animated sprite.
        const buckAnimated = new AnimatedSprite(
            [
                Texture.from("Buck-hd-eo"),
                Texture.from("Buck-hu-eo"),
                /*                 
                Texture.from("Buck-hd-ec-s"),
                Texture.from("Buck-hd-eh"),
                Texture.from("Buck-hd-eh-s"),
                Texture.from("Buck-hd-eo"),
                Texture.from("Buck-hd-ey-s"),
                Texture.from("Buck-hu-ec"),
                Texture.from("Buck-hu-ec-s"),
                Texture.from("Buck-hu-eh"),
                Texture.from("Buck-hu-eh-s"), 
                Texture.from("Buck-hu-eo-s")
                */
            ],
            true
        );

        buckAnimated.play();
        buckAnimated.animationSpeed = 0.1;

        Assets.loadBundle("fx");
        const notesAnimated = new AnimatedSprite(
            [
                Texture.from("Notes_1"),
                Texture.from("Notes_2")
            ],
            true
        );

        notesAnimated.play();
        notesAnimated.animationSpeed = 0.025;
        notesAnimated.position.set(380, 50);
        notesAnimated.onFrameChange = (frame: number) => {
            if (frame == 0) {
                notesAnimated.position.set(380, 50);
            }

            if (frame == 1) {
                notesAnimated.position.set(480, 40);
            }
        }
        notesAnimated.scale.set(0.33);

        this.addChild(buckAnimated);
        this.addChild(notesAnimated);

        /*
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
        this.addChild(myGraph);*/


        // Text
        const nowPlaying = new Text("Now Playing:", { fontSize: 23, fill: 0x000000, fontFamily: "tahoma" });
        nowPlaying.position.set(1020, 315);
        nowPlaying.scale.set(1.1); // This turns text into a texture, so it becomes blurry when upscaled.   
        this.addChild(nowPlaying);

        const track = new Text("Hangar 18", { fontSize: 30, fill: 0x000000, fontFamily: "times-new-roman" })
        track.position.set(1030, 345);
        this.addChild(track);

        const artist = new Text("by Megadeth", { fontSize: 25, fill: 0x000000, fontFamily: "tahoma" })
        artist.position.set(1021, 380);
        this.addChild(artist);

        // Nine-Slice Plane
        const panel = new NineSlicePlane(Texture.from("Radio"), 50, 50, 50, 50);
        panel.width = 480;
        panel.height = 380;
        panel.position.set(-580, 285);
        this.addChild(panel);

        const onOff = new Text("On/Off", { fontSize: 20, fill: 0x000000, fontFamily: "verdana" })
        onOff.position.set(-257, 593);
        this.addChild(onOff);

        const rec = new Text("Rec.", { fontSize: 23, fill: 0x000000, fontFamily: "verdana" })
        rec.position.set(-350, 590);
        this.addChild(rec);
    }
}