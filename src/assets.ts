import { AssetsManifest } from 'pixi.js';

export const manifest: AssetsManifest = {
    bundles: [
        {
            name: "backgrounds",
            assets:
            {
                "Room": "./background/room.jpeg",
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
                "Guitar": "./objects/guitar.png"
            }
        },

        {
            name: "ui",
            assets:
            {
                Radio: "./ui/radio.png",
                UI_Player: "./ui/ui-player.png"
            }
        },

        {
            name: "fx",
            assets:
            {
                Notes_1: "./fx/notes1.png",
                Notes_2: "./fx/notes2.png"
            }
        }
    ]
}