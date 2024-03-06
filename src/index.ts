import { Application, Assets, AssetsManifest, Sprite } from 'pixi.js';

const app = new Application<HTMLCanvasElement>({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: 600,
	height: 600
});

export const manifest: AssetsManifest = {
	bundles: [
		{
			name: "bundleName",
			assets:
			{
				"Clampy the clamp": "./clampy.png",
				"Epitaph": "./epitaph.jpg",
			}
		},
	]
}

async function init() {
	// Assets.init must only happen once! 
	// Pack all your bundles into one manifest!
	await Assets.init({ manifest: manifest });

	// Load the bundles you need
	await Assets.loadBundle("bundleName");
	const clampy = Sprite.from("Epitaph");
	console.log(clampy.width, clampy.height);

	clampy.anchor.set(0);

	clampy.x = -400;
	clampy.y = -460;

	app.stage.addChild(clampy);
}

init();

