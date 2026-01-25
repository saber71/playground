import type { AbstractComponent } from "./AbstractComponent.ts"

export interface ContainerInterface<El extends AbstractComponent = AbstractComponent> {
  getChild<E extends AbstractComponent>(index: number): E

  findChild<T>(predicate: (child: El) => boolean): T | undefined

  setChildren(...children: El[]): this

  addChildren(...children: El[]): this

  addChildAt(child: El, index: number): this

  removeAll(destroy?: boolean): this

  removeChildren(...children: El[]): this

  removeChild(child: El, index?: number): this
}
