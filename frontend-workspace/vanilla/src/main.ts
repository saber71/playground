import "reflect-metadata"
import "./style.css"
import "@shoelace-style/shoelace/dist/themes/light.css"
import "@shoelace-style/shoelace/dist/shoelace.js"
import type { SlButton } from "@shoelace-style/shoelace"
import { ReflectiveInjector } from "injection-js"
import { MessageBox } from "./components/MessageBox.ts"
import { ComponentFactory, RootComponent } from "./core"
import { ServiceClasses, StyledString, Value } from "./utils"

// 可选：设置默认主题（如果需要暗色）
// document.documentElement.classList.add('sl-theme-dark');

const app = document.getElementById("app")!
app.innerHTML = `
  <h1>Hello Vite + Shoelace!</h1>
  <sl-button variant="primary" size="large">Click me</sl-button>
  <sl-input placeholder="Type something..."></sl-input>
  <sl-alert open>
    <sl-icon slot="icon" name="info-circle"></sl-icon>
    This is an info alert.
  </sl-alert>
`

const injector = ReflectiveInjector.resolveAndCreate(ServiceClasses)
const variant = new Value<SlButton["variant"]>("default")
const componentFactory: ComponentFactory = injector.get(ComponentFactory)
const root = injector.get(RootComponent) as RootComponent
const button = componentFactory.create("button")
button
  .addChild(componentFactory.create("text").setValue("button"))
  .set("variant", variant)
  .set("circle", true)
  .on("click", () => variant.set("primary"))
root.addChild(button)

const messageBox = new MessageBox().style("height", "100px")
root.addChild(messageBox)
messageBox.typing([
  `时区逻辑是否合理？
你假设输入字符串是`,
  new StyledString("UTC\n 时间（带 Z），并想将其\n“当", { color: "red", fontWeight: "bold" }),
  `作 UTC 本地时间”存入 LocalDateTime。
异常处理`,
])
