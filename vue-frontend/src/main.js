import { createApp } from "vue"
import App from "./App.vue"
import Antd from "ant-design-vue"
import "ant-design-vue/dist/reset.css"
import { router } from "@/router/index.js"

createApp(App).use(Antd).use(router).mount("#app")
