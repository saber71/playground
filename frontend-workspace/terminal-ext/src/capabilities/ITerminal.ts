import type { IDimension } from "./IDimension.ts"

export type Stop = () => void

export interface ITerminal extends IDimension {
  onData(listener: (str: string, stop: Stop) => void, once?: boolean): void

  write(data: any): Promise<void>
}
