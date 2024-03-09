import { Application, Assets, AssetsManifest, Container, Point, Sprite } from 'pixi.js';

const app = new Application<HTMLCanvasElement>({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x000000,
	width: 1500,
	height: 1500
});

export const manifest: AssetsManifest = {
	bundles: [
		{
			name: "bundleName",
			assets:
			{
				"Clampy the clamp": "./clampy.png",
				"Epitaph": "./epitaph.jpg",
				"DUFN": "./dufn.png",
				"Apple": "./apple.png",
				"Bandcamp": "./bandcamp.png",
				"Deezer": "./deezer.png",
				"Spotify": "./spotify.png",
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
	const epitaph = Sprite.from("Epitaph");
	const dufn = Sprite.from("DUFN");
	const apple = Sprite.from("Apple");
	const bandcamp = Sprite.from("Bandcamp");
	const deezer = Sprite.from("Deezer");
	const spotify = Sprite.from("Spotify");
	//console.log(clampy.width, clampy.height);

	// Sets the origin point of the sprite, since it's set to 0 it's the top left.
	epitaph.anchor.set(0);

	dufn.position.set(100, 1325);
	dufn.scale.set(1.33);

	apple.scale.set(0.5);
	bandcamp.scale.set(0.5);
	deezer.scale.set(0.5);
	spotify.scale.set(0.5);

	apple.x = 0;
	bandcamp.x = 166;
	deezer.x = bandcamp.x * 2;
	spotify.x = bandcamp.x * 3;

	const epitaphWithDufn = new Container();
	const streamingServices = new Container();

	streamingServices.pivot.set(-(screen.width) / 2, 0);

	epitaphWithDufn.addChild(epitaph);
	epitaphWithDufn.addChild(dufn);
	streamingServices.addChild(apple, bandcamp, deezer, spotify);

	console.log(dufn.toGlobal(new Point()));
	console.log(dufn.parent.toGlobal(dufn.position));

	epitaphWithDufn.scale.set(1);
	//epitaphWithDufn.position.set(0, 0);

	streamingServices.scale.set(0.75);
	//streamingServices.position.set(0, 0);

	// Relocates the DUFN logo regardless of the position of parent elements.
	//const aux = dufn.parent.toLocal(new Point(700, 700));
	//dufn.position.x = aux.x;
	//dufn.position.y = aux.y;

	app.stage.addChild(epitaphWithDufn);
	app.stage.addChild(streamingServices);
}

window.addEventListener("resize", () => {
	//console.log("Resized.");
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

