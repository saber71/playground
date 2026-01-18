import { SceneManagerAbstract } from './scene-manager.abstract';
import { SceneName } from './scene.interface';

export function Scene(name: SceneName) {
  return (...args: any[]) => {
    SceneManagerAbstract.register(name, args[0]);
  };
}
