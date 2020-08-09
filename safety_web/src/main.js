import Vue from 'vue'
import App from './App.vue'
import router from './router'

// import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import './assets/font_icon/iconfont.css'  //引入控制面板四个图标央视
import Treeselect from '@riophae/vue-treeselect'

import 'element-ui/lib/theme-chalk/index.css'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'



import './styles/index.scss'
// import AMap from 'vue-amap'
import axios from 'axios';
import VueAxios from 'vue-axios'
import plugins from './plugins';
// Vue.use(AMap)
Vue.config.productionTip = false
Vue.use(ElementUI, {size: 'medium'})
Vue.component('treeselect', Treeselect)
Vue.use(VueAxios, axios)
Vue.use(plugins);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

// 初始化地图
// AMap.initAMapApiLoader({
// // 高德的key
// key: '5dc6159f1085fd4c66dcb2672a61706e',
//   // 插件集合
// plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor']

// })
import htmlToPdf from './vendor/htmlToPdf'
Vue.use(htmlToPdf)
