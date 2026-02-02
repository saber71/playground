import type { Class } from "shared"

export interface IWriterOption {}

export interface IWriter {
  write(data: any, options?: IWriterOption): Promise<void>
}

export function Writer<Base extends Class<Object>>(base: Base): Base & Class<IWriter> {
  return class extends base implements IWriter {
    async write(data: any, options?: IWriterOption) {}
  }
}
