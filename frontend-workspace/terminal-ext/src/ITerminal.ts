export type Stop = () => void

export interface ITerminal {
  onData(listener: (str: string, stop: Stop) => void, once?: boolean): void

  write(data: any): Promise<void>
}
