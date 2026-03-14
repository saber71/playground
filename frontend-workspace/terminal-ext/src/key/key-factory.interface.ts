import type { IKeyHandler } from "./key-handler.interface.ts"
import type { IKeyMatcher } from "./key-matcher.interface.ts"

export interface IKeyBindingFactory {
  createKeyHandler(): IKeyHandler

  createKeyMatcher(): IKeyMatcher
}
