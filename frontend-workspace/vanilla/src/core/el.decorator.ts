import type { ComponentName } from "../types.ts"
import { ComponentFactory } from "./service/component.factory.ts"

export function El(name: ComponentName) {
  return (...args: any[]) => {
    ComponentFactory.nameMapClass[name] = args[0]
  }
}
