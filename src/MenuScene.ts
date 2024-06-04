import { Graphics, Ticker } from "pixi.js";
import { Background } from "./Background";
import { Scene } from "./Scene";
import { TickerScene } from "./TickerScene";
import { Group } from "tweedle.js";
import { SceneAbstract } from "./SceneAbstract";
import { parseMidiFile } from "./midiParser";
import { sound } from "@pixi/sound";

export class MenuScene extends SceneAbstract {

    public update(): void { }

    public background: Background;
    public scene: Scene;

    constructor() {
        super();

        // ------------------------------------
        // Initialization of global variables |
        // ------------------------------------
        this.background = new Background(this.turnLightsOnOff.bind(this), this.play.bind(this));
        this.scene = new Scene();

        // ---------------------------
        // Setup of global variables |
        // ---------------------------
        this.scene.scale.set(0.85);
        this.scene.position.set(500, 450);

        // ---------------------------
        // Addition of children      |
        // ---------------------------
        this.addChild(this.background);
        this.addChild(this.scene);
    }

    // --------------------------------------------------
    // Interaction functions                            |
    // --------------------------------------------------
    private turnLightsOnOff(): void {
        if (this.background.lightsOn) {
            const darkness = new Graphics();
            darkness.clear();
            darkness.lineStyle({ color: 0xFFFFFF, width: 0, alpha: 1 });
            darkness.beginFill(0x000000, 0.95);
            darkness.drawRect(0, 0, 1536, 1020);
            darkness.endFill();
            this.addChild(darkness);
        } else {
            const darkness = this.children.find(child => child instanceof Graphics)
            if (darkness) {
                this.removeChild(darkness);
            }
        }
    }

    // --------------------------------------------------
    // Gameplay functions                               |
    // --------------------------------------------------
    // TODO Clean up stuff outside of the screen for optimization.
    private async play(): Promise<void> {
        if (this.background.files) { // Have the necessary files been loaded?
            this.scene.buckWithAmp.canClick = false; // Avoid having the player click Buck and play a sound on top of the gameplay.

            if (!this.background.lightsOn) {
                this.turnLightsOnOff(); // Turn the lights on in case the player had turned them off.
            }

            this.scene.moveUI();

            const midiFile = this.background.files[0];
            const oggFile = this.background.files[1];

            try {
                const parsedMidiFile = await parseMidiFile(midiFile);
                const audioBuffer = await this.decodeAudioFile(oggFile);

                setTimeout(() => {
                    const tickerScene = new TickerScene(parsedMidiFile);
                    tickerScene.startScheduling();

                    sound.add("song", audioBuffer);

                    // TODO Find a better implementation that doesn't require using a specific timeout for the song to play.
                    // This current one also probably difficults implementing functions such as pausing the song. Fuck.
                    setTimeout(() => {
                        sound.play("song");
                    }, 1300);

                    this.addChild(tickerScene);

                    Ticker.shared.add((_deltaFrame) => {
                        Group.shared.update();
                    });
                }, 2000);
            } catch (error) {
                console.error('Error parsing MIDI file or decoding audio:', error);
            }
        }
    }

    // --------------------------------------------------
    // Auxiliary functions                              |
    // --------------------------------------------------
    private async decodeAudioFile(oggFile: Blob): Promise<AudioBuffer> {
        return new Promise<AudioBuffer>((resolve, reject) => {
            const reader = new FileReader();

            // Define the onload function for the FileReader.
            reader.onload = async () => {
                try {
                    const audioContext = new AudioContext();
                    const audioData = reader.result as ArrayBuffer;
                    const audioBuffer = await audioContext.decodeAudioData(audioData);
                    resolve(audioBuffer);
                } catch (error) {
                    reject(error);
                }
            };

            // Define the onerror function for the FileReader.
            reader.onerror = (_event) => {
                reject(reader.error);
            };

            reader.readAsArrayBuffer(oggFile);
        });
    }
}

/* KNOWN BUGS:
- While not necessarily a bug, turning the lights off shadows the entire screen, including text. This should be fixed.

- While not necessarily a bug, the transition to gameplay can take a few seconds to load if the note array is too large. This has to be optimized.
*/