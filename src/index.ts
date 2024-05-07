// TODO Implement spritesheet into textures?
// TODO Implement custom fonts, last time I tried I couldn't make them work.
// TODO The console seems to show bundles are being loaded multiple times. Check this for optimization.

import { LoaderScene } from './LoaderScene';
import { SceneManager } from './SceneManager';

SceneManager.initialize();
SceneManager.changeScene(new LoaderScene()); // This is just a fake loading bar, because it doesn't really load anything.