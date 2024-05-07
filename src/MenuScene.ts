import { Assets, Graphics, Ticker } from "pixi.js";
import { Background } from "./Background";
import { manifest } from "./assets";
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
        Assets.init({ manifest: manifest });

        // Load the bundles you need

        Assets.loadBundle("backgrounds");
        Assets.loadBundle("characters");
        Assets.loadBundle("objects");
        Assets.loadBundle("spritesheet");
        Assets.loadBundle("ui");
        Assets.loadBundle("fx");
        Assets.loadBundle("keyboard_inputs");

        this.background = new Background(this.turnLightsOnOff.bind(this), this.play.bind(this));
        this.scene = new Scene();

        this.scene.scale.set(0.85);
        this.scene.position.set(500, 450);

        this.addChild(this.background);
        this.addChild(this.scene);
    }

    // TODO Need to make it so that parts of the UI don't get shadowed.
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

    // TODO Clean up stuff outside of the screen.
    private async play(): Promise<void> {
        if (this.background.files) {
            this.scene.moveUI();

            const midiFile = this.background.files[0];
            const oggFile = this.background.files[1];
            try {
                const parsedMidiFile = await parseMidiFile(midiFile);

                // Create a new FileReader to read the .ogg file
                const reader = new FileReader();

                // Define the onload function for the FileReader
                reader.onload = async () => {
                    // Once the file is loaded, decode the audio data to AudioBuffer
                    const audioContext = new AudioContext();
                    const audioData = reader.result as ArrayBuffer;

                    try {
                        const audioBuffer = await audioContext.decodeAudioData(audioData);

                        sound.add("song", audioBuffer);

                        setTimeout(() => {
                            const tickerScene = new TickerScene(parsedMidiFile);
                            // This works, but it makes particles not appear and doesn't seem to have any practical use.
                            //SceneManager.changeScene(tickerScene)

                            setTimeout(() => {
                                sound.play("song");
                            }, 1200)

                            this.addChild(tickerScene);

                            Ticker.shared.add(function (_deltaFrame) {
                                Group.shared.update();
                                tickerScene.update(Ticker.shared.deltaMS, _deltaFrame);
                            });
                        }, 2000);
                    } catch (error) {
                        console.error('Error decoding audio data:', error);
                    }
                };

                // Read the .ogg file as ArrayBuffer
                reader.readAsArrayBuffer(oggFile);
            } catch (error) {
                console.error('Error parsing MIDI file:', error);
            }
        }
    }
}
