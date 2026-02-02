export interface IWriterOption {}

export interface IWriter {
  write(data: any, options?: IWriterOption): this

  flush(): Promise<void>
}
