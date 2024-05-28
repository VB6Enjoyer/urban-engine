import { LoaderScene } from './LoaderScene';
import { SceneManager } from './SceneManager';

SceneManager.initialize();
SceneManager.changeScene(new LoaderScene());

// TODO The console seems to show bundles are being loaded multiple times. Fix this for optimization.