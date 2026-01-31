import "reflect-metadata"
import "@shoelace-style/shoelace/dist/themes/light.css"
import "@shoelace-style/shoelace/dist/shoelace.js"
import "@xterm/xterm/css/xterm.css"
import { setBasePath } from "@shoelace-style/shoelace"
import Element from "element-plus"
import { createPinia } from "pinia"
import "./style/index.scss"
import "./style/element/index.scss"
import "element-plus/dist/index.css"
import { Instance } from "shared"
import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"

setBasePath("/")

// 可选：设置默认主题（如果需要暗色）
// document.documentElement.classList.add('sl-theme-dark');

Instance.initial()

const app = createApp(App)

app.use(Element)
app.use(createPinia())
app.use(router)

app.mount("#app")
