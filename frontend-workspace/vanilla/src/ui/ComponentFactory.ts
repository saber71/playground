import type { Class, ComponentName, ComponentNameMapClass } from "../types.ts"
import { Service } from "../utils"
import type { AbstractComponent } from "./core"

@Service()
export class ComponentFactory {
  static readonly nameMapClass: Record<ComponentName, Class<AbstractComponent>> = {} as any

  create<Name extends keyof ComponentNameMapClass>(name: Name): ComponentNameMapClass[Name] {
    const cls = ComponentFactory.nameMapClass[name]
    try {
      return new cls() as any
    } catch (e) {
      console.error("error in", name)
      throw e
    }
  }
}
