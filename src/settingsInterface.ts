// Currently unused.

export interface ControlsConfig {
    key1: string;
    key2: string;
    key3: string;
    key4: string;
    key5: string;
    key6: string;
}

export interface AudioConfig {
    volume: number;
}

export interface GameConfig {
    controls: ControlsConfig;
    audio: AudioConfig;
}