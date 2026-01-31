import "reflect-metadata"
import "@shoelace-style/shoelace/dist/themes/light.css"
import "@shoelace-style/shoelace/dist/shoelace.js"
import { setBasePath } from "@shoelace-style/shoelace"
import { Instance } from "shared"
import "./src/components"

setBasePath("/")

// 可选：设置默认主题（如果需要暗色）
// document.documentElement.classList.add('sl-theme-dark');

Instance.initial()
