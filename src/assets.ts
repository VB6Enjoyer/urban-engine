import { AssetsManifest } from 'pixi.js';

export const manifest: AssetsManifest = {
    bundles: [
        {
            name: "backgrounds",
            assets:
            {
                "Room": "./background/room.jpeg",
                "Room-Night": "./background/room-night.jpg",
                "Stage": "./background/stage.png"
            }
        },

        {
            name: "characters",
            assets:
            {
                "Buck-hd-ec": "./character/buck-hd-ec.png",
                "Buck-hd-ec-s": "./character/buck-hd-ec-s.png",
                "Buck-hd-eh": "./character/buck-hd-eh.png",
                "Buck-hd-eh-s": "./character/buck-hd-eh-s.png",
                "Buck-hd-eo": "./character/buck-hd-eo.png",
                "Buck-hd-ey-s": "./character/buck-hd-ey-s.png",
                "Buck-hu-ec": "./character/buck-hu-ec.png",
                "Buck-hu-ec-s": "./character/buck-hu-ec-s.png",
                "Buck-hu-eh": "./character/buck-hu-eh.png",
                "Buck-hu-eh-s": "./character/buck-hu-eh-s.png",
                "Buck-hu-eo": "./character/buck-hu-eo.png",
                "Buck-hu-eo-s": "./character/buck-hu-eo-s.png"
            }
        },

        {
            name: "objects",
            assets:
            {
                "Amplifier": "./objects/amplifier.png",
                "Guitar": "./objects/guitar.png",
                "Clock_Morning": "./objects/clock-morning.png",
                "Clock_Transition1": "./objects/clock-transition1.png",
                "Clock_Transition2": "./objects/clock-transition2.png",
                "Clock_Night": "./objects/clock-night.png",
                "Switch-On": "./objects/switch-on.png",
                "Switch-Off": "./objects/switch-off.png"
            }
        },

        {
            name: "ui",
            assets:
            {
                Radio: "./ui/radio.png",
                Radio_off: "./ui/radio-off.png",
                UI_Player: "./ui/ui-player.png"
            }
        },

        {
            name: "keyboard_inputs",
            assets:
            {
                W_Key: "./ui/keyboard_mouse/white/T_W_Key_White.png",
                E_Key: "./ui/keyboard_mouse/white/T_E_Key_White.png",
                S_Key: "./ui/keyboard_mouse/white/T_S_Key_White.png",
                D_Key: "./ui/keyboard_mouse/white/T_D_Key_White.png",
                F_Key: "./ui/keyboard_mouse/white/T_F_Key_White.png",
                J_Key: "./ui/keyboard_mouse/white/T_J_Key_White.png",
                K_Key: "./ui/keyboard_mouse/white/T_K_Key_White.png",
                L_Key: "./ui/keyboard_mouse/white/T_L_Key_White.png",
            }
        },

        {
            name: "fx",
            assets:
            {
                Notes_1: "./fx/notes1.png",
                Notes_2: "./fx/notes2.png"
            }
        },

        {
            name: "fonts",
            assets:
            {
                Chaos_Engine: "./fonts/chaos-engine-upgrade-store.ttf",
                PixelifySans: "https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap"
            }
        },

        {
            name: "spritesheet",
            assets:
            {
                Spritesheet: "./spritesheet/textures.json"
            }
        }
    ]
}