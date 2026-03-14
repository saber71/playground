import type { IDisposable, IEnabled } from "@saber71/shared"
import type { IKey } from "../ansi-code"
import type { IInputSource } from "../capabilities.interface.ts"

export interface IKeyHandler extends IDisposable, IInputSource<IKey>, IEnabled {}
