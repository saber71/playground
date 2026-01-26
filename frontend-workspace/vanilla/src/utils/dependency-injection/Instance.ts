import { ReflectiveInjector } from "injection-js"
import type { Class } from "../../types.ts"
import { ServiceClasses } from "./service.decorator.ts"

export class Instance {
  private static _injector: ReflectiveInjector

  static initial() {
    this._injector = ReflectiveInjector.resolveAndCreate(ServiceClasses)
  }

  static get<T>(cls: Class<T>): T {
    return this._injector.get(cls)
  }
}
