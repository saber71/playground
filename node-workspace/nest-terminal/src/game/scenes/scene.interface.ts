export type SceneName = "login" | "startup" | "user-manager"

export type ForWhile = (
  cb: (breakWhile: () => void, commonCatch: (res: any) => void) => void | Promise<void>,
) => Promise<void>

export interface IRouter {
  replace(name: SceneName, params?: any): void
  next(name: SceneName, params?: any): void
  back(): void
  backTo(name: SceneName): void
  getRoute<T>(): IRoute<T>
}

export interface IScene {
  enter(router: IRouter, forWhile: ForWhile): Promise<void> | void
}

export interface IRoute<T = any> {
  name: SceneName
  params?: T
}
