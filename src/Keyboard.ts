import { utils } from "pixi.js";

export class Keyboard {
    public static readonly state: Map<string, boolean> = new Map();

    public static readonly down: utils.EventEmitter = new utils.EventEmitter();

    private constructor() { }

    private static initialized: boolean = false;

    public static initialize() {
        if (Keyboard.initialized) {
            return;
        }

        Keyboard.initialized = true;
        document.addEventListener("keydown", Keyboard.onKeyDown);
        document.addEventListener("keyup", Keyboard.onKeyUp);
    }

    // Checks current state of a key
    private static onKeyDown(key: KeyboardEvent) {
        Keyboard.down.emit(key.code);
        Keyboard.state.set(key.code, true);
    }

    private static onKeyUp(key: KeyboardEvent) {
        Keyboard.state.set(key.code, false);
    }
}