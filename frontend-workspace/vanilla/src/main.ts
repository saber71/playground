import "reflect-metadata"
import "./style.css"
import "@shoelace-style/shoelace/dist/themes/light.css"
import "@shoelace-style/shoelace/dist/shoelace.js"
import { setBasePath, SlAlert } from "@shoelace-style/shoelace"
import { Instance } from "./utils"

setBasePath("/")

// 可选：设置默认主题（如果需要暗色）
// document.documentElement.classList.add('sl-theme-dark');

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
