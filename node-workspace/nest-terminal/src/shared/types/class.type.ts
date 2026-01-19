export type Class<T> = new (...args: any[]) => T

export type MenuItem =
  | string
  | (() => void | Promise<void>)
  | { name: string; callback: () => void | Promise<void>; isDisabled?: () => boolean }
