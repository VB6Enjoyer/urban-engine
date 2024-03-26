import { Assets, Container, Texture, Sprite, Text, NineSlicePlane } from "pixi.js";
import { BuckWithAmp } from "./BuckWithAmp";
import { RoundButton } from "./RoundButton";

export class Scene extends Container {

    public recorderOn = false;
    private panel: NineSlicePlane;
    private buckWithAmp: BuckWithAmp;

    private recorderContainer: Container;
    private uiPlayerContainer: Container;

    constructor() {
        super();

        // Class extending from Container.
        this.buckWithAmp = new BuckWithAmp();
        this.addChild(this.buckWithAmp);

        this.recorderContainer = new Container();
        this.uiPlayerContainer = new Container();

        Assets.loadBundle("ui");

        const ui_player = Sprite.from("UI_Player");

        ui_player.scale.set(1.5)
        ui_player.position.set(970, 260);
        this.uiPlayerContainer.addChild(ui_player);

        Assets.loadBundle("fx");

        // Text
        const nowPlaying = new Text("Now Playing:", { fontSize: 23, fill: 0x000000, fontFamily: "tahoma" });
        nowPlaying.position.set(1020, 315);
        nowPlaying.scale.set(1.1); // This turns text into a texture, so it becomes blurry when upscaled.   
        this.uiPlayerContainer.addChild(nowPlaying);

        const track = new Text("Hangar 18", { fontSize: 30, fill: 0x000000, fontFamily: "times-new-roman" })
        track.position.set(1030, 345);
        this.uiPlayerContainer.addChild(track);

        const artist = new Text("by Megadeth", { fontSize: 25, fill: 0x000000, fontFamily: "tahoma" })
        artist.position.set(1021, 380);
        this.uiPlayerContainer.addChild(artist);

        // Nine-Slice Plane
        this.panel = new NineSlicePlane(Texture.from("Radio_off"), 50, 50, 50, 50);
        this.panel.width = 480;
        this.panel.height = 380;
        this.panel.position.set(-580, 285);

        this.recorderContainer.addChild(this.panel);

        const onOff = new Text("On/Off", { fontSize: 20, fill: 0x000000, fontFamily: "verdana" })
        onOff.position.set(-257, 593);
        this.recorderContainer.addChild(onOff);

        const rec = new Text("Rec.", { fontSize: 23, fill: 0x000000, fontFamily: "verdana" })
        rec.position.set(-350, 590);
        this.recorderContainer.addChild(rec);

        const recorderButton = new RoundButton();
        recorderButton.pivot.set(this.panel.x);
        recorderButton.position.set(-740, 26);

        recorderButton.eventMode = "static";
        recorderButton.on("pointerdown", this.recorderOnOff, this);

        this.uiPlayerContainer.y = screen.height * 2;

        this.recorderContainer.addChild(recorderButton);
        this.addChild(this.recorderContainer);
        this.addChild(this.uiPlayerContainer);
    }

    // Would it be better to load both textures and make the other invisible on click?
    private recorderOnOff() {
        if (this.recorderOn) {
            this.panel.texture = Texture.from("Radio_off");
            this.recorderOn = false;
        } else {
            this.panel.texture = Texture.from("Radio");
            this.recorderOn = true;
        }
    }

    public moveUI() {
        let startTime = performance.now(); // Get the current timestamp
        const duration = 2000; // Duration of the animation in milliseconds
        const startY = screen.height;
        const endY = 0; // Final position on the screen

        const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1); // Calculate animation progress (0 to 1)

            if (progress < 1) {
                // Update the position based on the progress of the animation
                const newY = startY - (progress * (startY - endY));
                this.recorderContainer.y = (Math.round(progress * screen.height));
                this.uiPlayerContainer.y = newY;

                // Request the next animation frame
                requestAnimationFrame(animate);
            } else {
                // Animation complete
                console.log("Animation complete!");
            }
        }

        // Start the animation
        requestAnimationFrame(animate);
        this.moveBuck();
    }

    private moveBuck() {
        let startTime = performance.now(); // Get the current timestamp
        const duration = 2000; // Duration of the animation in milliseconds

        const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1); // Calculate animation progress (0 to 1)

            if (progress < 1) {
                // Update the position based on the progress of the animation
                this.buckWithAmp.x = -(Math.round(progress * screen.width / 6));

                // Request the next animation frame
                requestAnimationFrame(animate);
            } else {
                // Animation complete
                console.log("Animation complete!");
            }
        }

        // Start the animation
        requestAnimationFrame(animate);
    }
}
