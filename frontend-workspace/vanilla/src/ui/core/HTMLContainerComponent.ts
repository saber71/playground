import type { AbstractComponent } from "./AbstractComponent.ts"
import type { ContainerInterface } from "./container.interface.ts"
import { HTMLComponent } from "./HTMLComponent.ts"

export class HTMLContainerComponent<
  El extends HTMLElement,
  C extends AbstractComponent = AbstractComponent,
>
  extends HTMLComponent<El>
  implements ContainerInterface<C>
{
  getChild<E extends AbstractComponent>(index: number): E {
    return super.getChild(index)
  }

  findChild<T>(predicate: (child: C) => boolean): T | undefined {
    return super.findChild<T>(predicate as any)
  }

  setChildren(...children: C[]): this {
    return super.setChildren(...children)
  }

  addChildren(...children: C[]): this {
    return super.addChildren(...children)
  }

  addChildAt(child: C, index: number): this {
    return super.addChildAt(child, index)
  }

  removeAll(destroy: boolean = true): this {
    return super.removeAll(destroy)
  }

  removeChildren(...children: C[]): this {
    return super.removeChildren(...children)
  }

  removeChild(child: C, index?: number): this {
    return super.removeChild(child, index)
  }
}
