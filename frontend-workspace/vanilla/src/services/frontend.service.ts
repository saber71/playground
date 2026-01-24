import { MessageBox } from "../components/MessageBox.ts"
import { BaseComponent } from "../core"
import { Service } from "../utils"

@Service()
export class FrontendService extends BaseComponent {
  private readonly _messageBox = new MessageBox()

  constructor() {
    super(document.getElementById("app")!)
    this.addChild(this._messageBox)
  }
}
