import { Service } from "../utils"
import { AbstractComponent } from "./core"
import { MessageBox } from "./MessageBox.ts"

@Service()
export class FrontendService extends AbstractComponent {
  private readonly _messageBox = new MessageBox()

  constructor() {
    super(document.getElementById("app")!)
    this.addChild(this._messageBox)
  }
}
