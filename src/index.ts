import { Application, Assets, } from 'pixi.js';
import { manifest } from "./assets";
import { Scene } from './Scene';
import { Background } from './Background';

const app = new Application<HTMLCanvasElement>({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x000000,
	width: 1536,
	height: 1020
});

async function init() {
	// Assets.init must only happen once! 
	// Pack all your bundles into one manifest!
	await Assets.init({ manifest: manifest });

	// Load the bundles you need
	await Assets.loadBundle("backgrounds");
	await Assets.loadBundle("characters");
	await Assets.loadBundle("objects");
	await Assets.loadBundle("ui");
	await Assets.loadBundle("fx");

	const myScene = new Scene();
	const background = new Background();

	myScene.scale.set(0.85);
	myScene.position.set(500, 450);

	app.stage.addChild(background);
	app.stage.addChild(myScene);
}

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

window.dispatchEvent(new Event("resize"));

init();

