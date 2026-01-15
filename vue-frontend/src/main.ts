import "./style/index.scss";
import "element-plus/dist/index.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import Element from "element-plus";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(Element);
app.use(createPinia());
app.use(router);

app.mount("#app");
