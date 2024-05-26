import { Assets, Container, Texture, Text, NineSlicePlane } from "pixi.js";
import { BuckWithAmp } from "./BuckWithAmp";
import { RoundButton } from "./RoundButton";

export class Scene extends Container {

    public recorderOn = false;
    private panel: NineSlicePlane;
    public buckWithAmp: BuckWithAmp;

    private recorderContainer: Container;






    constructor() {
        super();

        // Class extending from Container.
        this.buckWithAmp = new BuckWithAmp();
        this.buckWithAmp.y = 20;
        this.addChild(this.buckWithAmp);



        this.recorderContainer = new Container();


        Assets.loadBundle("ui");
        Assets.loadBundle("fx");



        // Text




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



        this.recorderContainer.addChild(recorderButton);
        this.addChild(this.recorderContainer);

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


        const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1); // Calculate animation progress (0 to 1)

            if (progress < 1) {
                // Update the position based on the progress of the animation

                this.recorderContainer.y = (Math.round(progress * screen.height));


                // Request the next animation frame
                requestAnimationFrame(animate);
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
                this.buckWithAmp.x = -(Math.round(progress * screen.width / 4));

                // Request the next animation frame
                requestAnimationFrame(animate);
            }
        }

        // Start the animation
        requestAnimationFrame(animate);
    }
}
