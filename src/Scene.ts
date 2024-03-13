import { Assets, Container, Texture, Sprite, Text, NineSlicePlane } from "pixi.js";
import { BuckWithAmp } from "./BuckWithAmp";
import { RoundButton } from "./RoundButton";

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

        Assets.loadBundle("fx");

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
        let panel = new NineSlicePlane(Texture.from("Radio"), 50, 50, 50, 50);
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

        // Graphics
        const recorderButton = new RoundButton();
        recorderButton.pivot.set(panel.x);
        recorderButton.position.set(-740, 26);

        recorderButton.eventMode = "static";
        recorderButton.on("pointerdown", recorderOnOff);
        let recorderOn = true;

        // Would it be better to load both textures and make the other invisible on click?
        function recorderOnOff() {
            if (recorderOn) {
                panel.texture = Texture.from("Radio_off");
                recorderOn = false;
            } else {
                panel.texture = Texture.from("Radio");
                recorderOn = true;
            }
        }

        this.addChild(recorderButton);
    }

}