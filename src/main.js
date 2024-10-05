import "./assets/style.css";

import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

//ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

//Toast
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';

const app = createApp(App);
const pinia = createPinia();

app.use(router);

app.use(pinia);
app.use(ElementPlus)
app.use(ToastPlugin);
app.mount("#app");
