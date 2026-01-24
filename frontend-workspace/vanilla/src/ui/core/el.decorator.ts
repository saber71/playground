import type { ComponentName } from "../../types.ts"
import { ComponentFactory } from "../ComponentFactory.ts"

export function El(name: ComponentName) {
  return (...args: any[]) => {
    ComponentFactory.nameMapClass[name] = args[0]
  }
}
