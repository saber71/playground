import "reflect-metadata"
import "./style.css"
import "@shoelace-style/shoelace/dist/themes/light.css"
import "@shoelace-style/shoelace/dist/shoelace.js"
import type { SlButton } from "@shoelace-style/shoelace"
import { ReflectiveInjector } from "injection-js"
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
