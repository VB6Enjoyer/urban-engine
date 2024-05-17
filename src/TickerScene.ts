import { Assets, Texture, Container, Rectangle, Graphics, Ticker, Sprite, Text } from "pixi.js";
import { IUpdateable } from "./IUpdateable";
import { IHitbox, checkCollision } from "./IHitbox";
import { HitKey } from "./HitKey";
import { HitZone } from "./HitZone";
import * as particle from "../src/emitter.json";
import { Emitter, LinkedListContainer, upgradeConfig } from "@pixi/particle-emitter";

export class TickerScene extends Container implements IUpdateable, IHitbox {
    private hitZoneContainer: Container;
    private hitZones: HitZone[] = [];
    private trackGraph: Graphics;
    private notesArray: [string, number][]; // An array of arrays that includes a note, and a delay value.
    private noteKeyMap: { [note: string]: HitKey[] } = {};
    private hitParticle: Emitter;
    private hitParticleContainer: LinkedListContainer;
    private startTime: number;
    private notesToSchedule: { time: number; note: string }[] = [];
    private keyMap = {
        "0": "S",
        "1": "D",
        "2": "F",
        "3": "J",
        "4": "K",
        "5": "L"
    };

    private uiPlayerContainer: Container;
    private scoreValueText: Text;

    public multiplier: String;

    constructor(notesArray: [string, number][]) {
        super();

        Assets.loadBundle("keyboard_inputs");
        Assets.loadBundle("fx");
        Assets.loadBundle("ui");

        this.hitZoneContainer = this.setupHitZones();
        this.hitParticleContainer = new LinkedListContainer();

        this.notesArray = notesArray;
        this.startTime = 0;

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

        this.hitParticle = new Emitter(this.hitParticleContainer, upgradeConfig(particle, "Fire"));
        this.hitParticle.spawnPos.y = 600;
        this.hitParticle.emit = false;
        this.addChild(this.hitParticleContainer);

        this.multiplier = "x1";

        this.uiPlayerContainer = new Container();

        const ui_player = Sprite.from("UI_Player");

        ui_player.scale.set(1.5)
        ui_player.position.set(970, 260);
        this.uiPlayerContainer.addChild(ui_player)

        const scoreText = new Text("Score:", { fontSize: 23, fill: 0x000000, fontFamily: "tahoma" });
        scoreText.position.set(1020, 315);
        scoreText.scale.set(1.1); // This turns text into a texture, so it becomes blurry when upscaled.   
        this.uiPlayerContainer.addChild(scoreText);

        this.scoreValueText = new Text("0", { fontSize: 30, fill: 0x000000, fontFamily: "times-new-roman" })
        this.scoreValueText.position.set(1030, 345);
        this.uiPlayerContainer.addChild(this.scoreValueText);

        const multiplier = new Text("x1", { fontSize: 25, fill: 0x000000, fontFamily: "tahoma" })
        multiplier.position.set(1021, 380);
        this.uiPlayerContainer.addChild(multiplier);

        this.uiPlayerContainer.x = this.trackGraph.x - this.trackGraph.x / 2.66;
        this.uiPlayerContainer.y = screen.height * 2;

        this.addChild(this.uiPlayerContainer);

        // Pre-calculate note times
        this.preCalculateNoteTimes();
        this.slideIntoScreen();
    }

    private setupHitZones() {
        // Create HitZone instances and position them
        const positions = [
            [-360, 0], [-250, 0], [-140, 0], [-30, 0], [80, 0], [190, 0]
        ];

        let hitZoneContainer = new Container();
        positions.forEach((pos) => {
            const hitZone = new HitZone();
            console.log(hitZone.y);
            hitZone.position.set(pos[0], pos[1]);
            this.hitZones.push(hitZone);
            hitZoneContainer.addChild(hitZone);
        });

        return hitZoneContainer;
    }

    private preCalculateNoteTimes(): void {
        let cumulativeTime = 0;

        for (const [note, delay] of this.notesArray) {
            cumulativeTime += delay;
            this.notesToSchedule.push({ time: cumulativeTime, note });
        }
    }

    public startScheduling(): void {
        this.startTime = performance.now();
        Ticker.shared.add(this.update.bind(this));
    }

    private spawnNote(note: string): void {
        const curNote = this.keyMap[note as keyof typeof this.keyMap];
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
                    if (hitZoneIndex >= 0 && hitZoneIndex < this.hitZones.length) { // TODO Seems like there's a bit of a margin for key presses outside of the hitzone
                        const hitZone = this.hitZones[hitZoneIndex];

                        if (hitKey.visible && checkCollision(hitKey, hitZone)) {
                            hitKey.visible = false;
                            this.calculateScore(hitKey, hitZone);

                            this.hitParticle.spawnPos.x = hitKey.x + 1025;
                            this.hitParticle.emit = true;

                            break;
                        }
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    // TODO Implement multiplier
    private calculateScore(hitKey: HitKey, hitZone: HitZone) {
        const keyPositionAtPress = hitKey.getPosition() - (hitKey.height / 2);
        const hitZonePosition = 540;
        const hitZoneCenter = hitZonePosition + (Math.abs(hitZone.height) / 2);

        const distanceFromCenter = Math.abs(keyPositionAtPress - hitZoneCenter);

        const calculatedScore = 200 - distanceFromCenter;

        this.scoreValueText.text = (Number(this.scoreValueText.text) + Math.round(calculatedScore)).toString();
    }

    public getHitbox(): Rectangle {
        return this.hitZones[0].getBounds(); // Adjust based on your needs
    }

    // TODO Slide the trackGraph into the screen.
    public slideIntoScreen() {
        let startTime = performance.now(); // Get the current timestamp
        const duration = 1250; // Duration of the animation in milliseconds

        //const startY = screen.height;
        //const endY = 0; // Final position on the screen

        const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1); // Calculate animation progress (0 to 1)

            if (progress < 1) {
                // Update the position based on the progress of the animation
                //this.trackGraph.y = -(Math.round(progress * screen.height - 369));
                const newY = -(Math.round(progress * screen.height - 1425)); // TODO This REALLY needs a better implementation. It's currently shit.
                this.uiPlayerContainer.y = newY;

                // Request the next animation frame
                requestAnimationFrame(animate);
            }
        }

        // Start the animation
        requestAnimationFrame(animate);
    }

    public update(deltaMS: number): void {
        const currentTime = performance.now() - this.startTime;

        while (this.notesToSchedule.length > 0 && this.notesToSchedule[0].time <= currentTime) {
            const noteInfo = this.notesToSchedule.shift();
            if (noteInfo) {
                this.spawnNote(noteInfo.note);
            }
        }

        this.hitParticle.update(deltaMS);
    }
}