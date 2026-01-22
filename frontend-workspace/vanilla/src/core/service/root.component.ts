import { Service } from "../../utils"
import { BaseComponent } from "../base.component.ts"

@Service()
export class RootComponent extends BaseComponent<HTMLElement> {
  constructor() {
    super(document.getElementById("app")!)
  }
}
