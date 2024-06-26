import { Container, Rectangle, Graphics, Ticker, Sprite, Text } from "pixi.js";
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

    private notesArray: [string, number][]; // An array of arrays that includes a note string, and a delay value.
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
    private artistAndTitleText: Text;

    private multiplier: number;
    private noteStreak: number;
    private startTime: number;

    constructor(notesArray: [string, number][], songMetadata: string) {
        super();

        // ------------------------------------
        // Initialization of global variables |
        // ------------------------------------
        this.hitZoneContainer = this.setupHitZones();
        this.hitParticleContainer = new LinkedListContainer();

        this.trackGraph = new Graphics();

        this.hitParticle = new Emitter(this.hitParticleContainer, upgradeConfig(particle, "Fire"));

        this.uiPlayerContainer = new Container();

        this.multiplier = 1;
        this.noteStreak = 0;
        this.startTime = 0;

        this.notesArray = notesArray;

        this.scoreValueText = new Text("0", { fontSize: 30, fill: 0x000000, fontFamily: "Chaos_Engine" });
        this.multiplierText = new Text("x" + this.multiplier.toString(), { fontSize: 25, fill: 0x000000, fontFamily: "Chaos_Engine" });

        // TODO A better implementation for this is necessary; Would be better for the text to constantly slide on the screen.
        if (songMetadata.length > 33) {
            songMetadata = songMetadata.substring(0, 33) + '...';
        }
        this.artistAndTitleText = new Text(songMetadata, { fontSize: 33, fill: 0x000000, fontFamily: "Chaos_Engine" });

        // --------------------------------
        // Declaration of local variables |
        // --------------------------------
        const ui_player = Sprite.from("UI_Player");

        const nowPlayingBar = Sprite.from("Now_Playing_Bar");

        const scoreText = new Text("Score:", { fontSize: 23, fill: 0x000000, fontFamily: "tahoma" });

        const hitzoneSText = new Text("S", { fontSize: 100, fill: 0x000000, fontFamily: "Chaos_Engine" });
        const hitzoneDText = new Text("D", { fontSize: 100, fill: 0x000000, fontFamily: "Chaos_Engine" });
        const hitzoneFText = new Text("F", { fontSize: 100, fill: 0x000000, fontFamily: "Chaos_Engine" });
        const hitzoneJText = new Text("J", { fontSize: 100, fill: 0x000000, fontFamily: "Chaos_Engine" });
        const hitzoneKText = new Text("K", { fontSize: 100, fill: 0x000000, fontFamily: "Chaos_Engine" });
        const hitzoneLText = new Text("L", { fontSize: 100, fill: 0x000000, fontFamily: "Chaos_Engine" });

        const hitZoneTextContainer = new Container();
        const nowPlayingContainer = new Container();

        // ---------------------------
        // Setup of global variables |
        // ---------------------------
        // Graph to wrap the area of the screen that holds the gameplay elements
        this.trackGraph.lineStyle({ color: 0x666666, width: 2, alpha: 1 });
        this.trackGraph.beginFill(0x000000, 0.66);
        this.trackGraph.drawRect(100, 100, this.hitZoneContainer.width + 19, screen.height + 10);
        this.trackGraph.endFill();
        this.trackGraph.position.set(500, -110);

        this.hitParticle.spawnPos.y = 600;
        this.hitParticle.emit = false;

        this.scoreValueText.position.set(1030, 345);

        this.multiplierText.position.set(1021, 380);

        this.uiPlayerContainer.x = this.trackGraph.x - this.trackGraph.x / 2.66;
        this.uiPlayerContainer.y = screen.height;
        this.artistAndTitleText.position.set(66, (nowPlayingBar.height / 2) * 0.59);

        // ---------------------------
        // Setup of local variables  |
        // ---------------------------
        ui_player.scale.set(1.5)
        ui_player.position.set(970, 260);

        nowPlayingBar.scale.set(0.59, 1);
        nowPlayingBar.position.set(3, 5);

        scoreText.position.set(1020, 315);
        scoreText.scale.set(1.1); // This turns text into a texture, so it becomes blurry when upscaled.

        // TODO These positions should be more relative.
        hitzoneSText.position.set(screen.width / 2 - 325, screen.height / 2 + 93);
        hitzoneDText.position.set(screen.width / 2 - 220, screen.height / 2 + 93);
        hitzoneFText.position.set(screen.width / 2 - 105, screen.height / 2 + 93);
        hitzoneJText.position.set(screen.width / 2 + 10, screen.height / 2 + 93);
        hitzoneKText.position.set(screen.width / 2 + 105, screen.height / 2 + 93);
        hitzoneLText.position.set(screen.width / 2 + 230, screen.height / 2 + 93);

        hitZoneTextContainer.position.set(0, 0);

        // ---------------------------
        // Setup of events           |
        // ---------------------------
        document.addEventListener("keydown", this.onKeyDown.bind(this));

        // ---------------------------
        // Addition of children      |
        // ---------------------------
        this.uiPlayerContainer.addChild(ui_player);
        this.uiPlayerContainer.addChild(scoreText);
        this.uiPlayerContainer.addChild(this.scoreValueText);
        this.uiPlayerContainer.addChild(this.multiplierText);

        nowPlayingContainer.addChild(nowPlayingBar);
        nowPlayingContainer.addChild(this.artistAndTitleText);

        hitZoneTextContainer.addChild(hitzoneSText);
        hitZoneTextContainer.addChild(hitzoneDText);
        hitZoneTextContainer.addChild(hitzoneFText);
        hitZoneTextContainer.addChild(hitzoneJText);
        hitZoneTextContainer.addChild(hitzoneKText);
        hitZoneTextContainer.addChild(hitzoneLText);

        this.addChild(this.trackGraph);
        this.addChild(this.hitZoneContainer);
        this.addChild(this.hitParticleContainer);
        this.addChild(this.uiPlayerContainer);
        this.addChild(hitZoneTextContainer);
        this.addChild(nowPlayingContainer);

        // ---------------------------
        // Continuation functions    |
        // ---------------------------
        this.preCalculateNoteTimes();
        this.slideIntoScreen();
    }

    // --------------------------------------------------
    // Gameplay setup functions                         |
    // --------------------------------------------------
    // Create HitZone instances and position them.
    private setupHitZones() {
        const positions = [
            [-360, 0], [-250, 0], [-140, 0], [-30, 0], [80, 0], [190, 0]
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

    // Pre-calculate the times at which notes should be played by accumulating the delays.
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

    // --------------------------------------------------
    // Gameplay functions                               |
    // --------------------------------------------------
    private spawnNote(note: string): void {
        const curNote = this.keyMap[note as keyof typeof this.keyMap];
        const hitZoneIndex = parseInt(note);

        if (hitZoneIndex >= 0 && hitZoneIndex < this.hitZones.length) {
            let curKey = new HitKey();
            curKey.x = this.hitZones[hitZoneIndex].x;
            curKey.missed = false;

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

                let collisionDetected = false;

                for (const hitKey of hitKeys) {
                    const hitZoneIndex = keyIndex;

                    if (hitZoneIndex >= 0 && hitZoneIndex < this.hitZones.length) { // Ensure within valid hitZone index.
                        const hitZone = this.hitZones[hitZoneIndex];

                        if (hitKey.visible && checkCollision(hitKey, hitZone)) {
                            hitKey.visible = false;

                            this.noteStreak += 1;

                            const multiplier = this.setMultiplier(this.noteStreak);

                            this.calculateScore(hitKey, hitZone, multiplier);

                            this.hitParticle.spawnPos.x = hitKey.x + 1025;
                            this.hitParticle.emit = true;

                            collisionDetected = true;

                            hitKey.destroy; // This might possibly, perhaps, maybe cause a bug. Can't tell for sure.

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

                            hitKey.destroy;

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
        if (noteStreak < 8) {
            this.multiplier = 1;
        } else if (noteStreak >= 8 && noteStreak < 16) {
            this.multiplier = 2;
        } else if (noteStreak >= 16 && noteStreak < 24) {
            this.multiplier = 3;
        } else if (noteStreak >= 24) {
            this.multiplier = 4;
        }

        this.multiplierText.text = "x" + this.multiplier.toString();

        return this.multiplier = 1;
    }

    // --------------------------------------------------
    // UI-manipulation functions                        |
    // --------------------------------------------------
    // TODO The "Now Playing" Bar should also slide into the screen.
    public slideIntoScreen() {
        let startTime = performance.now(); // Get the current timestamp.
        const duration = 500; // Duration of the animation in milliseconds.

        const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1); // Calculate animation progress (0 to 1).

            if (progress < 1) {
                this.trackGraph.y = -(Math.round(progress * screen.height / 7)); // Update the position based on the progress of the animation.

                const newY = -(Math.round(progress * screen.height - 1425)); // TODO This REALLY needs a better implementation. It's currently shit.

                this.uiPlayerContainer.y = newY;

                requestAnimationFrame(animate); // Request the next animation frame
            }
        }

        requestAnimationFrame(animate); // Start the animation.
    }

    // --------------------------------------------------
    // Auxiliary functions                              |
    // --------------------------------------------------
    public getHitbox(): Rectangle {
        return this.hitZones[0].getBounds(); // Adjust based on your needs
    }

    public update(deltaMS: number): void {
        const currentTime = performance.now() - this.startTime;

        while (this.notesToSchedule.length > 0 && this.notesToSchedule[0].time <= currentTime) {
            const noteInfo = this.notesToSchedule.shift();
            if (noteInfo) {
                this.spawnNote(noteInfo.note);
            }
        }


        // TODO This might not be an optimal implementation and might be prone to errors. Further testing needed.
        // Check for notes that have gone past the hit zones.
        for (const key in this.noteKeyMap) {
            const hitKeys = this.noteKeyMap[key];
            for (let i = hitKeys.length - 1; i >= 0; i--) {
                const hitKey = hitKeys[i];

                if (hitKey.visible && hitKey.getPosition() > this.hitZones[0].height * 7.1 && !hitKey.missed) {
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
- Playing two or more notes too close to each other can cause the note streak to reset, unless seemingly played simultaneously. Can't yet replicate bug properly.
  UPDATE 3/6/2024: This might have been fixed already by modifying the hit zone margin. Needs further testing.
*/