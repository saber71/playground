import type { Class, ComponentName, ComponentNameMapClass } from "../../types.ts"
import { Service } from "../../utils"
import type { BaseComponent } from "../base.component.ts"

@Service()
export class ComponentFactory {
  static readonly nameMapClass: Record<ComponentName, Class<BaseComponent>> = {} as any

  create<Name extends keyof ComponentNameMapClass>(name: Name): ComponentNameMapClass[Name] {
    const cls = ComponentFactory.nameMapClass[name]
    return new cls() as any
  }
}
