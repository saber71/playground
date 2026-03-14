import type { IInputSource } from "../capabilities.interface.ts"
import type { IKeyBindingFactory } from "./key-factory.interface.ts"
import type { IKeyHandler } from "./key-handler.interface.ts"
import { KeyHandler } from "./key-handler.ts"
import type { IKeyMatcher } from "./key-matcher.interface.ts"
import { KeyMatcher } from "./key-matcher.ts"

export class KeyBindingFactory implements IKeyBindingFactory {
  constructor(private readonly _inputSource: IInputSource<string>) {}

  createKeyHandler(): IKeyHandler {
    return new KeyHandler(this._inputSource)
  }

  createKeyMatcher(): IKeyMatcher {
    return new KeyMatcher(this._inputSource)
  }
}
