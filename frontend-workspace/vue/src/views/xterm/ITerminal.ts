type Stop = () => void

export interface ITerminal {
  onData(listener: (str: string) => void, once: boolean): Stop

  write(data: any): Promise<void>
}
