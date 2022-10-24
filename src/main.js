import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入三级联动组件
import TypeNav from '@/components/TypeNav'
// 轮播图
import Carousel from '@/components/Carousel'
// 分页
import Pagination from '@/components/Pagination'

// 引入虚拟数据
import '@/mock/mockServe'
// 引入swiper样式
import 'swiper/css/swiper.css'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { Input, Checkbox, Form } from 'element-ui';
import VueLazyLoad from 'vue-lazyload'
import loadImg from '@/assets/load.png'
Vue.use(ElementUI);
Vue.use(Input);
Vue.use(Checkbox);
Vue.use(Form);
Vue.use(VueLazyLoad, {
  preLoad: 1.3, //预加载的宽高比
  // 懒加载默认图片
  loading: loadImg,
  attempt: 1, // 加载错误后最大尝试次数
})


// 测试统一管理接口
// 需要请求才能出现进度条
/* import { reqCategoryList, reqGetSearchInfo } from '@/api'
reqCategoryList()
console.log(reqGetSearchInfo({})) */

Vue.config.productionTip = false

// 三级联动，在Search、Home、Deail页面都有所以注册为全局组件
Vue.component(TypeNav.name, TypeNav)
// 轮播图，全局组件
Vue.component(Carousel.name, Carousel)
// 分页，全局组件
Vue.component(Pagination.name, Pagination)

import * as api from '@/api'
new Vue({
  // 全局事件总线
  beforeCreate() {
    Vue.prototype.$bus = this
    Vue.prototype.$api = api
  },
  // 注册路由，此时组件上面就会拥有$route、$router属性
  router,
  // 注册仓库，此时组件上面拥有$store属性
  store,
  render: h => h(App),
}).$mount('#app')