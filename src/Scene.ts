import { Container, Texture, Text, NineSlicePlane } from "pixi.js";
import { BuckWithAmp } from "./BuckWithAmp";
import { RoundButton } from "./RoundButton";

export class Scene extends Container {

    public recorderOn = false;

    public buckWithAmp: BuckWithAmp;
    private panel: NineSlicePlane;
    private recorderContainer: Container;

    constructor() {
        super();

        // ------------------------------------
        // Initialization of global variables |
        // ------------------------------------
        this.buckWithAmp = new BuckWithAmp();
        this.recorderContainer = new Container();
        this.panel = new NineSlicePlane(Texture.from("Radio_off"), 50, 50, 50, 50);

        // --------------------------------
        // Declaration of local variables |
        // --------------------------------
        const onOff = new Text("On/Off", { fontSize: 20, fill: 0x000000, fontFamily: "verdana" });
        const rec = new Text("Rec.", { fontSize: 23, fill: 0x000000, fontFamily: "verdana" })

        const recorderButton = new RoundButton();

        // ---------------------------
        // Setup of global variables |
        // ---------------------------
        this.buckWithAmp.y = 20;

        this.panel.width = 480;
        this.panel.height = 380;
        this.panel.position.set(-580, 285);

        // ---------------------------
        // Setup of local variables  |
        // ---------------------------
        onOff.position.set(-257, 593);

        recorderButton.pivot.set(this.panel.x);
        recorderButton.position.set(-740, 26);

        recorderButton.eventMode = "static";
        recorderButton.on("pointerdown", this.recorderOnOff, this);

        rec.position.set(-350, 590);

        // ---------------------------
        // Addition of children      |
        // ---------------------------
        this.addChild(this.buckWithAmp);

        this.recorderContainer.addChild(this.panel);
        this.recorderContainer.addChild(onOff);
        this.recorderContainer.addChild(rec);
        this.recorderContainer.addChild(recorderButton);

        this.addChild(this.recorderContainer);
    }

    // --------------------------------------------------
    // Interaction functions                            |
    // --------------------------------------------------
    private recorderOnOff() {
        if (this.recorderOn) {
            this.panel.texture = Texture.from("Radio_off");
            this.recorderOn = false;
        } else {
            this.panel.texture = Texture.from("Radio");
            this.recorderOn = true;
        }
    }

    // --------------------------------------------------
    // Scene-manipulation functions                     |
    // --------------------------------------------------
    public moveUI() {
        let startTime = performance.now(); // Get the current timestamp.
        const duration = 2000; // Duration of the animation in milliseconds.

        const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1); // Calculate animation progress (0 to 1).

            if (progress < 1) {
                this.recorderContainer.y = (Math.round(progress * screen.height)); // Update the position based on the progress of the animation

                requestAnimationFrame(animate); // Request the next animation frame
            }
        }

        requestAnimationFrame(animate); // Start the animation

        this.moveBuck();
    }

    private moveBuck() {
        let startTime = performance.now(); // Get the current timestamp.
        const duration = 2000; // Duration of the animation in milliseconds.

        const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1); // Calculate animation progress (0 to 1).

            if (progress < 1) {
                this.buckWithAmp.x = -(Math.round(progress * screen.width / 4)); // Update the position based on the progress of the animation-

                requestAnimationFrame(animate); // Request the next animation frame-
            }
        }

        requestAnimationFrame(animate); // Start the animation.
    }
}
