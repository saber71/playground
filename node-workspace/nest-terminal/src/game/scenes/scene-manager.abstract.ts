import { ModuleRef } from "@nestjs/core"
import { SharedService } from "../../shared/shared.service"
import { Class } from "../../shared/types/class.type"
import { UIService } from "../../ui/ui.service"
import { IRoute, IRouter, IScene, SceneName } from "./scene.interface"

export abstract class SceneManagerAbstract {
  private static readonly _sceneMap = new Map<string, Class<IScene>>()

  static register(name: string, sceneClass: Class<IScene>) {
    this._sceneMap.set(name, sceneClass)
  }

  constructor(
    readonly module: ModuleRef,
    readonly ui: UIService,
    readonly shared: SharedService,
  ) {}

  async run(...initRoutes: IRoute[]) {
    const shared = this.shared
    const ui = this.ui
    let history: Array<IRoute> = initRoutes
    const router: IRouter = {
      replace(name: SceneName, params?: any) {
        history[history.length - 1] = { name, params }
      },
      next(name: SceneName, params?: any) {
        history.push({ name, params })
      },
      back() {
        history.pop()
      },
      backTo(name: SceneName) {
        const index = history.findLastIndex((i) => i.name === name)
        if (index >= 0) history = history.slice(0, index + 1)
      },
      getRoute<T>(): IRoute<T> {
        return history.at(-1)!
      },
    }
    const forWile = async (
      cb: (breakWhile: () => void, commonCatch: (res: any) => void) => void | Promise<void>,
    ) => {
      let isBreak = false
      while (!isBreak) {
        try {
          await cb(() => (isBreak = true), shared.common.commonCatch(ui, router))
        } catch (_) {
          isBreak = true
        }
      }
    }
    while (history.length) {
      const cur = history.at(-1)!
      const clazz = SceneManagerAbstract._sceneMap.get(cur.name)
      if (!clazz) {
        await this.ui.message.errorAndWait("找不到scene " + cur.name)
        break
      }
      const scene = this.module.get<IScene>(clazz)
      await scene.enter(router, forWile)
    }
  }
}
