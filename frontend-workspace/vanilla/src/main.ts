import "reflect-metadata"
// import "./style.css"
import "@shoelace-style/shoelace/dist/themes/light.css"
import "@shoelace-style/shoelace/dist/shoelace.js"
import { setBasePath, SlAlert } from "@shoelace-style/shoelace"
import { Instance } from "shared"
import "./components"
import { createElExt } from "./components"

setBasePath("/")

// 可选：设置默认主题（如果需要暗色）
// document.documentElement.classList.add('sl-theme-dark');

const flexEl = createElExt("sl-flex")
  .center()
  .styles({ background: "black" })
  .addChildren(
    createElExt("div").styles({ width: "100px", height: "200px", background: "red" }),
    createElExt("div")
      .styles({ width: "100px", height: "200px", background: "blue" })
      .on("click", () => window.alert("2233")),
  )
  .on("click", () => {
    flexEl.justifyContent = "flex-start"
  })
document.body.appendChild(flexEl)
const alert = new SlAlert()
alert.open = true
alert.variant = "warning"
alert.innerHTML = `
<sl-icon slot="icon" name="info-circle"></sl-icon>
You're not stuck, the alert will close after a pretty long duration.
`
document.createElement("sl-alert")
document.body.appendChild(alert)

Instance.initial()
