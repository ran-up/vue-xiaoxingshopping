// 配置路由
import Vue from 'vue'
import VueRouter from 'vue-router'

// 使用路由
Vue.use(VueRouter)

// 引入文件
import routes from './routes.js'
import store from '@/store'

// console.log(VueRouter)
// console.log(VueRouter.prototype.push())

// 备份VueRouter的原型对象中的push
let originPush = VueRouter.prototype.push
let originReplace = VueRouter.prototype.replace
// console.log(originPush)

// 重写replece|push方法
// 第一个参数：告诉原来push方法，往哪里跳和传递参数
// 第二个参数：成功的函数
// 第二个参数：失败的函数
VueRouter.prototype.push = function (location, resolve, reject) {
    if (resolve && reject) {
        originPush.call(this, location, resolve, reject)
    } else {
        originPush.call(this, location, () => { }, () => { })
    }
}

VueRouter.prototype.replace = function (location, resolve, reject) {
    if (resolve && reject) {
        originReplace.call(this, location, resolve, reject)
    } else {
        originReplace.call(this, location, () => { }, () => { })
    }
}

// 创建路由实例
const router = new VueRouter({
    routes,
    scrollBehavior(to, from, savedPosition) {
        // return 期望滚动到哪个的位置
        // 始终滚动到顶部
        return { y: 0 }
    }
})


export default router

// 全局路由守卫
router.beforeEach(async (to, from, next) => {

    let hasToken = store.state.user.token
    let hasNickName = store.state.user.nickName
    // 已登录
    if (hasToken) {
        // 不让它再去登录页面
        if (to.path.indexOf('login') != -1) {
            next('/home');
        } else {
            // 有用户信息和token
            if (hasNickName) {
                next();
            } else {
                //用户登陆了,但是没有用户信息 
                try {
                    //发请求获取用户信息以后在放行
                    await store.dispatch('getUserInfo');
                    next();
                } catch (error) {
                    //用户没有信息，还携带token发请求获取用户信息【失败】
                    //token【学生证失效了】
                    //token失效:本地清空数据、服务器的token通知服务器清除
                    await store.dispatch('outLogin');
                    //回到登录页，重新获取一个新的学生证
                    next('/login');
                }
            }
        }
    } else {
        let toPath = to.path
        // 未登录不能去【我的订单】、【订单详情页面】、【支付页面】、【支付成功页面】
        if (toPath.includes('center') || toPath.includes('trade') || toPath.includes('pay')) {
            // 去登录页面，登录后从定向到刚刚的页面
            next('/login?redirect=' + toPath);
        } else if (toPath) {
            next()
        }
    }
})
