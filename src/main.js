import '@babel/polyfill'
// import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from "./store";
import firebase from './Firebase';
import VueChatScroll from 'vue-chat-scroll'

Vue.config.productionTip = false
Vue.use(VueChatScroll)

firebase.auth().onAuthStateChanged(user => {
  store.dispatch("fetchUser", user);
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
