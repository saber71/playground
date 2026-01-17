import type { AxiosError } from "axios";

export type SceneName = "login" | "startup";

export interface IRouter {
  next(name: SceneName, params?: any): void;
  forward(name: SceneName, params?: any): void;
  back(): void;
  backTo(name: SceneName): void;
  getParams<T>(): T;
  forWhile(
    cb: (
      breakWhile: () => void,
      commonCatch: (res: AxiosError) => void,
    ) => void | Promise<void>,
  ): Promise<void>;
}

export interface IScene {
  enter(router: IRouter): Promise<void> | void;
}

export interface IRoute<T = any> {
  name: SceneName;
  params?: T;
}
