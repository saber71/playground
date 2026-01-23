import "reflect-metadata"
import "./style.css"
import "@shoelace-style/shoelace/dist/themes/light.css"
import "@shoelace-style/shoelace/dist/shoelace.js"
import type { SlButton } from "@shoelace-style/shoelace"
import { ReflectiveInjector } from "injection-js"
import { MessageBox } from "./components/MessageBox.ts"
import { ComponentFactory, RootComponent } from "./core"
import { ServiceClasses, Value } from "./utils"

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

const messageBox = new MessageBox()
root.addChild(messageBox)
messageBox.typing(`时区逻辑是否合理？
你假设输入字符串是 UTC 时间（带 Z），并想将其“当作 UTC 本地时间”存入 LocalDateTime。
这在很多系统中是合理的（比如数<span style="color:red">据库存的</span>是 UTC 时间戳，VO 用 LocalDateTime 表示 UTC 时刻）。
但要确保调用方传入的字符串确实是 ISO 8601 UTC 格式（如 "2026-01-21T15:02:28.941Z"）。
异常处理`)
