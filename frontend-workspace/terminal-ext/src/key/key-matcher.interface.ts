import type { ActionChain, IClearable, IDisposable, IEnabled } from "@saber71/shared"
import type { IKey } from "../ansi-code"

export interface IKeyMatcher extends IEnabled, IDisposable, IClearable {
  pattern(pattern: string | IKey): ActionChain<IKey>

  match(key: IKey): this
}
