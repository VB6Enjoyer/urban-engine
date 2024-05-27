import { Assets, Texture, Container, Rectangle, Graphics, Ticker, Sprite, Text } from "pixi.js";
import { IUpdateable } from "./IUpdateable";
import { IHitbox, checkCollision } from "./IHitbox";
import { HitKey } from "./HitKey";
import { HitZone } from "./HitZone";
import * as particle from "../src/emitter.json";
import { Emitter, LinkedListContainer, upgradeConfig } from "@pixi/particle-emitter";

export class TickerScene extends Container implements IUpdateable, IHitbox {
    private hitZoneContainer: Container;
    private hitParticleContainer: LinkedListContainer;

    private hitZones: HitZone[] = [];
    private hitParticle: Emitter;

    private notesArray: [string, number][]; // An array of arrays that includes a note, and a delay value.
    private notesToSchedule: { time: number; note: string }[] = [];
    private noteKeyMap: { [note: string]: HitKey[] } = {};
    private keyMap = {
        "0": "S",
        "1": "D",
        "2": "F",
        "3": "J",
        "4": "K",
        "5": "L"
    };

    private trackGraph: Graphics;
    private uiPlayerContainer: Container;
    private scoreValueText: Text;
    private multiplierText: Text;

    private multiplier: number;
    private noteStreak: number;
    private startTime: number;

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

        this.multiplier = 1;
        this.noteStreak = 0;

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

        this.multiplierText = new Text("x" + this.multiplier.toString(), { fontSize: 25, fill: 0x000000, fontFamily: "tahoma" })
        this.multiplierText.position.set(1021, 380);
        this.uiPlayerContainer.addChild(this.multiplierText);

        this.uiPlayerContainer.x = this.trackGraph.x - this.trackGraph.x / 2.66;
        this.uiPlayerContainer.y = screen.height;

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
            curKey.missed = false;
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
                let collisionDetected = false;

                for (const hitKey of hitKeys) {
                    const hitZoneIndex = keyIndex;
                    if (hitZoneIndex >= 0 && hitZoneIndex < this.hitZones.length) { // Ensure within valid hitZone index
                        const hitZone = this.hitZones[hitZoneIndex];

                        if (hitKey.visible && checkCollision(hitKey, hitZone)) {
                            hitKey.visible = false;
                            this.noteStreak += 1;
                            const multiplier = this.setMultiplier(this.noteStreak);
                            this.calculateScore(hitKey, hitZone, multiplier);

                            this.hitParticle.spawnPos.x = hitKey.x + 1025;
                            this.hitParticle.emit = true;

                            collisionDetected = true; // Collision detected, no need to check further
                            break;
                        }
                    }
                }

                // If no collision was detected, reset the noteStreak.
                if (!collisionDetected) {
                    for (const hitKey of hitKeys) {
                        if (hitKey.visible) {
                            this.noteStreak = 0;
                            this.setMultiplier(this.noteStreak);
                            break;
                        }
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    private calculateScore(hitKey: HitKey, hitZone: HitZone, multiplier: number) {
        const keyPositionAtPress = hitKey.getPosition() - (hitKey.height / 2);
        const hitZonePosition = 540;
        const hitZoneCenter = hitZonePosition + (Math.abs(hitZone.height) / 2);

        const distanceFromCenter = Math.abs(keyPositionAtPress - hitZoneCenter);

        const calculatedScore = (200 - distanceFromCenter) * multiplier;

        this.scoreValueText.text = (Number(this.scoreValueText.text) + Math.round(calculatedScore)).toString();
    }

    private setMultiplier(noteStreak: number): number {
        if (noteStreak < 2) {
            this.multiplier = 1;
        } else if (noteStreak >= 4 && noteStreak < 16) {
            this.multiplier = 2;
        } else if (noteStreak >= 16 && noteStreak < 24) {
            this.multiplier = 3;
        } else if (noteStreak >= 24) {
            this.multiplier = 4;
        }

        this.multiplierText.text = "x" + this.multiplier.toString();

        return this.multiplier = 1;
    }

    public getHitbox(): Rectangle {
        return this.hitZones[0].getBounds(); // Adjust based on your needs
    }

    // TODO Slide the trackGraph into the screen.
    public slideIntoScreen() {
        let startTime = performance.now(); // Get the current timestamp
        const duration = 500; // Duration of the animation in milliseconds

        const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1); // Calculate animation progress (0 to 1)

            if (progress < 1) {
                // Update the position based on the progress of the animation
                this.trackGraph.y = -(Math.round(progress * screen.height / 7));
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

        // Check for notes that have gone past the hit zones
        // TODO This might not be an optimal implementation and might be prone to errors. Further testing needed.
        for (const key in this.noteKeyMap) {
            const hitKeys = this.noteKeyMap[key];
            for (let i = hitKeys.length - 1; i >= 0; i--) {
                const hitKey = hitKeys[i];
                if (hitKey.visible && hitKey.getPosition() > 540 + this.hitZones[0].height && !hitKey.missed) {
                    this.noteStreak = 0;
                    hitKey.missed = true;
                    this.setMultiplier(this.noteStreak);
                }
            }
        }

        this.hitParticle.update(deltaMS);
    }
}

/* KNOWN BUGS:
- MIDI notes that don't have a "0" duration value WILL cause desynchronization due to how the note delays are calculated.

- Playing two or more notes too close to each other can cause the note streak to reset, unless seemingly played simultaneously. Can't yet replicate bug properly.
*/