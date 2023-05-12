import { createApp } from "@vue/compat";
import { createPinia } from "pinia";

import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "./assets/css/main.css";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(router);
app.use(BootstrapVue);
app.use(createPinia());

app.mount("#app");
