// TODO Implement spritesheet into textures

import { Application, Assets, Graphics, Ticker } from 'pixi.js';
import { manifest } from "./assets";
import { Scene } from './Scene';
import { Background } from './Background';
import { Keyboard } from './Keyboard';
import { TickerScene } from './TickerScene';
import { Group } from 'tweedle.js';

const app = new Application<HTMLCanvasElement>({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x000000,
	width: 1536,
	height: 1020
});

let background: Background;
let scene: Scene;

async function init() {
	// Assets.init must only happen once! 
	// Pack all your bundles into one manifest!
	await Assets.init({ manifest: manifest });

	// Load the bundles you need

	await Assets.loadBundle("backgrounds");
	await Assets.loadBundle("characters");
	await Assets.loadBundle("objects");
	await Assets.loadBundle("spritesheet");
	await Assets.loadBundle("ui");
	await Assets.loadBundle("fx");
	await Assets.loadBundle("keyboard_inputs");

	background = new Background(turnLightsOnOff, play);
	scene = new Scene();

	scene.scale.set(0.85);
	scene.position.set(500, 450);

	app.stage.addChild(background);
	app.stage.addChild(scene);
}

Keyboard.initialize();

window.addEventListener("resize", () => {
	const scaleX = window.innerWidth / app.screen.width
	const scaleY = window.innerHeight / app.screen.height;
	const scale = Math.min(scaleX, scaleY);

	const gameWidth = Math.round(app.screen.width * scale);
	const gameHeight = Math.round(app.screen.height * scale);

	const marginHorizontal = Math.floor((window.innerWidth - gameWidth) / 2);
	const marginVertical = Math.floor((window.innerHeight - gameHeight) / 2);

	app.view.style.width = gameWidth + "px";
	app.view.style.height = gameHeight + "px";

	app.view.style.marginLeft = marginHorizontal + "px";
	app.view.style.marginRight = marginHorizontal + "px";

	app.view.style.marginTop = marginVertical + "px";
	app.view.style.marginBottom = marginVertical + "px";
});

// Need to make it so that parts of the UI don't get shadowed.
function turnLightsOnOff(): void {
	if (background.lightsOn) {
		const darkness = new Graphics();
		darkness.clear();
		darkness.lineStyle({ color: 0xFFFFFF, width: 0, alpha: 1 });
		darkness.beginFill(0x000000, 0.95);
		darkness.drawRect(0, 0, 1536, 1020);
		darkness.endFill();
		app.stage.addChild(darkness);
	} else {
		const darkness = app.stage.children.find(child => child instanceof Graphics)
		if (darkness) {
			app.stage.removeChild(darkness);
		}
	}
}

// TODO Clean up stuff outside of the screen.
function play(): void {
	scene.moveUI();

	setTimeout(() => {
		const tickerScene = new TickerScene([
			['0', 700],
			['5', 700],
			['1', 700],
			['1', 700],
			['2', 700],
			['3', 700],
			['4', 700],
			['5', 700],
			['4', 700],
			['3', 700],
			['2', 700],
			['1', 700],
			['0', 700],
			['2', 700],
			['4', 700],
			['3', 700],
			['5', 700],
		]);

		Ticker.shared.add(function (_deltaFrame) {
			Group.shared.update();
			//tickerScene.update(Ticker.shared.deltaMS, deltaFrame)
		})

		app.stage.addChild(tickerScene);
	}, 2000);

	/* const tickerScene = app.stage.children.find(child => child instanceof TickerScene)
	if (tickerScene) {
		app.stage.removeChild(tickerScene);
	} */

}

window.dispatchEvent(new Event("resize"));

init();

