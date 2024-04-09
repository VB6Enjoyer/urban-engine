import { Assets, Texture, Container, Rectangle, Graphics } from "pixi.js";
import { IUpdateable } from "./IUpdateable";
import { IHitbox, checkCollision } from "./IHitbox";
import { HitKey } from "./HitKey";
import { HitZone } from "./HitZone";

export class TickerScene extends Container implements IUpdateable, IHitbox {

    private hitZoneContainer: Container;
    private hitZones: HitZone[] = [];

    private trackGraph: Graphics;

    private notesArray: [string, number][]; // An array of arrays that includes a note, and a delay value.
    private noteKeyMap: { [note: string]: HitKey[] } = {};

    constructor(notesArray: [string, number][]) {
        super();

        Assets.loadBundle("keyboard_inputs");

        this.hitZoneContainer = this.setupHitZones();

        this.notesArray = notesArray;

        // Graph to wrap the area of the screen that holds the gameplay elements
        this.trackGraph = new Graphics();
        this.trackGraph.lineStyle({ color: 0x666666, width: 2, alpha: 1 });
        this.trackGraph.beginFill(0x000000, 0.66);
        this.trackGraph.drawRect(100, 100, this.hitZoneContainer.width + 19, screen.height + 10);
        this.trackGraph.endFill();

        this.trackGraph.position.set(500, -110);

        this.addChild(this.trackGraph);
        this.addChild(this.hitZoneContainer);

        document.addEventListener("keydown", this.onKeyDown.bind(this));

        this.notesMove();
    }

    private setupHitZones() {
        // Create HitZone instances and position them
        const positions = [
            [-360, -100], [-250, -100], [-140, -100], [-30, -100], [80, -100], [190, -100]
        ];

        let hitZoneContainer = new Container();
        positions.forEach((pos) => {
            const hitZone = new HitZone();
            hitZone.position.set(pos[0], pos[1]);
            this.hitZones.push(hitZone);
            hitZoneContainer.addChild(hitZone);
        });

        return hitZoneContainer;
    }

    // Handles the logic that makes notes appear and be playable
    private async notesMove() {
        const keyMap = {
            "0": "S",
            "1": "D",
            "2": "F",
            "3": "J",
            "4": "K",
            "5": "L"
        };

        for (const [note, delay] of this.notesArray) {
            await this.delay(delay);

            const curNote = keyMap[note as keyof typeof keyMap];
            const keyTexture = curNote + "_Key";
            const hitZoneIndex = parseInt(note);

            if (hitZoneIndex >= 0 && hitZoneIndex < this.hitZones.length) {
                let curKey = new HitKey(Texture.from(keyTexture));
                curKey.x = this.hitZones[hitZoneIndex].x;
                this.addChild(curKey);
                curKey.moveNote();

                if (!this.noteKeyMap[curNote]) {
                    this.noteKeyMap[curNote] = [];
                }
                this.noteKeyMap[curNote].push(curKey);
            }
        }
    }

    private delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // TODO Add logic to handle score and disappear notes pressed too early.
    private onKeyDown(event: KeyboardEvent) {
        const keyCodeMap = {
            KeyS: 0,
            KeyD: 1,
            KeyF: 2,
            KeyJ: 3,
            KeyK: 4,
            KeyL: 5
        };

        const keyCode = event.code as keyof typeof keyCodeMap;
        const keyIndex = keyCodeMap[keyCode];

        if (keyIndex !== undefined && this.noteKeyMap[keyCode.charAt(3)]) {

            try {
                const hitKeys = this.noteKeyMap[keyCode.charAt(3)];
                for (const hitKey of hitKeys) {
                    const hitZoneIndex = keyIndex;
                    if (hitZoneIndex >= 0 && hitZoneIndex < this.hitZones.length) {
                        const hitZone = this.hitZones[hitZoneIndex];

                        if (hitKey.visible && checkCollision(hitKey, hitZone)) {
                            hitKey.visible = false;
                            console.log("+100 points");
                            // Break out of the loop after handling the collision
                            break;
                        }
                    }
                }
            } catch (error) {
                console.error("This note is not in the map yet. You may ignore this, it's just an exception handler, gameplay works still. TODO: Fix this crap!");
            }
        }
    }

    public getHitbox(): Rectangle {
        return this.hitZones[0].getBounds(); // Adjust based on your needs
    }

    // Not currently in use
    public slideIntoScreen() {
        let startTime = performance.now(); // Get the current timestamp
        const duration = 1250; // Duration of the animation in milliseconds

        const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1); // Calculate animation progress (0 to 1)

            if (progress < 1) {
                // Update the position based on the progress of the animation
                this.trackGraph.y = -(Math.round(progress * screen.height - 369));

                // Request the next animation frame
                requestAnimationFrame(animate);
            }
        }

        // Start the animation
        requestAnimationFrame(animate);
    }

    public update(_deltaFrame: number, _deltaTime: number) {
        // Not really being used currently, not even sure if this even has a function for my intended purposes.
    }
}