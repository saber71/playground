import { Service } from "../../utils"
import { HTMLContainerComponent } from "./HTMLContainerComponent.ts"

@Service()
export class RootComponent extends HTMLContainerComponent<HTMLDivElement> {
  constructor() {
    super(document.getElementById("app") as any)
  }
}
