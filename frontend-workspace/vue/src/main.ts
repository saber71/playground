import "./style/index.scss";
import "./style/element/index.scss";
import Element from "element-plus";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(Element);
app.use(createPinia());
app.use(router);

app.mount("#app");
