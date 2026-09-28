import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import vClickOutside from "v-click-outside";
import VueDayjs from "vue-dayjs-plugin";

import { VuePicker, VuePickerOption } from "@invisiburu/vue-picker";
import VueCompositionAPI from "@vue/composition-api";
import naver from "vue-naver-maps";
import LoadScript from "vue-plugin-load-script";
import VueSocialSharing from "vue-social-sharing";

import "../public/css/common.css";
import "../public/css/style.css";
import "../public/css/range-input.css";

import AxiosPlugin from "vue-axios-cors";
import VueChatScroll from "vue-chat-scroll";

import seon from "./seon.js";
import { store } from "./store";

// import Slider from '@vueform/slider/dist/slider.vue2.js'

// if (window.Android) {
//   window.Android.showMessage(window.Android.GetDeviceModel());
// } else {
//   console.log("asdsadsadsa");
// }

// window.funSeon = (st) => {
//   alert(st);
// };

Vue.use(seon);

Vue.use(VueChatScroll);
Vue.use(VueCompositionAPI);

Vue.use(VueSocialSharing);

Vue.use(LoadScript);

Vue.use(AxiosPlugin);

axios.defaults.headers.common["Content-Type"] =
  "application/x-www-form-urlencoded";
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
Vue.prototype.$axios = axios;

Vue.use(vClickOutside);
Vue.prototype.$eventBus = new Vue();

Vue.prototype.$apiHost = "https://hmhomes.kr/home";
// Vue.prototype.$apiHost = "https://plushdev.com/home";

// Vue.prototype.$apiHost = "https://192.168.0.12/home";

// console.log(seon.local._login(Vue.prototype.$apiHost));
// Vue.prototype.$axios.defaults.headers.common["jwt"] = re.headers.jwt;

//아이폰
// window.seon = seon.local;

// var message = {
//   title: "아무문자나",
//   content: "아무문자나 위에랑 다르게",
// };
// alert(JSON.stringify(window.webkit));

// try {
//   window.webkit.messageHandlers.IOS.postMessage(message);
// } catch (e) {
//   console.log(e);
// }

// function _test(re) {
//   alert(JSON.stringify(re));
// }

// window.addEventListener("message", _test, false);

// alert(JSON.stringify(window));
// function onMessageReceive(handle, error, data) {
//   alert("시작" + handle + error + data);
// }

// window.addEventListener("message", onMessageReceive, false);

// window.onMessageReceive = (handle, error, data) => {
//   alert("시작" + handle + error + data);
// };

Vue.use(naver, {
  clientID: "salgni0xx3",
  useGovAPI: false, //공공 클라우드 API 사용 (선택)
  subModules: "", // 서브모듈 (선택)
});

Vue.use(VueDayjs);

Vue.component("VuePicker", VuePicker);
Vue.component("VuePickerOption", VuePickerOption);

Vue.config.productionTip = false;

if (!window.Kakao.isInitialized()) {
  window.Kakao.init("67325b27141579eefaa4887d0fb5d0e5");
}

new Vue({
  router,
  store: store,
  render: (h) => h(App),
}).$mount("#app");

// seon.local._login(Vue.prototype.$apiHost).then(() => {});
