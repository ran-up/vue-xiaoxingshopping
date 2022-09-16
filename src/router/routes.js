// 引入文件
import Home from '@/Pages/Home'
import Login from '@/Pages/Login'
import Register from '@/Pages/Register'
import Search from '@/Pages/Search'
import Detail from '@/Pages/Detail'
import ShopCart from '@/Pages/ShopCart'
import AddCartSuccess from '@/Pages/AddCartSuccess'

export default [
    // 重定向
    {
        path: '*',
        redirect: '/home'
    },
    // 主页/首页
    {
        name: 'Home',
        path: '/home',
        component: Home,
        meta: { isShow: true }
    },
    // 登录页
    {
        name: 'Login',
        path: '/login',
        component: Login,
        meta: { isShow: false }
    },
    // 注册页
    {
        name: 'Register',
        path: '/register',
        component: Register,
        meta: { isShow: false }
    },
    // 搜索页
    {
        name: 'Search',
        path: '/search/:keyword?',
        component: Search,
        meta: { isShow: true }
    },
    // 商品详情页
    {
        name: 'Detail',
        path: '/detail/:skuId?',
        component: Detail,
        meta: { isShow: true }
    },
    // 添加到购物车成功页面
    {
        name: 'AddCartSuccess',
        path: '/addcartsuccess',
        component: AddCartSuccess,
        meta: { isShow: true },
        // 只能从商品详情页跳转到添加商品成功界面
        beforeEnter: (to, from, next) => {
            if (to.query.skuNum && window.localStorage.getItem('UUIDTOKEN')) {
                next()
            } else {
                next('/home')
            }
        }
    },
    // 购物车详情页
    {
        name: 'ShopCart',
        path: '/shopcart',
        component: ShopCart,
        meta: { isShow: true }
    },
    // 结算页面
    {
        name: 'Trade',
        path: '/trade',
        // 路由懒加载
        component: () => import("@/Pages/Trade"),
        meta: { isShow: true },
        /* 只能从购物车详情页界面, 才能跳转到交易界面
        需要有商品数量和用户信息才进入 */
        beforeEnter(to, from, next) {
            if (from.path === '/shopcart') {
                next()
            } else {
                next('/shopcart')
            }
        }

    },
    // 支付页面
    {
        name: 'Pay',
        path: '/pay',
        // 路由懒加载
        component: () => import("@/Pages/Pay"),
        meta: { isShow: true },
        /* 只能从交易界面, 才能跳转到支付界面 */
        beforeEnter(to, from, next) {
            if (from.path === '/trade') {
                next()
            } else {
                next('/trade')
            }
        }
    },
    // 支付成功页面
    {
        name: 'PaySuccess',
        path: '/paysuccess',
        // 路由懒加载
        component: () => import("@/Pages/PaySuccess"),
        meta: { isShow: true },
        /* 只有从支付界面, 才能跳转到支付成功的界面 */
        beforeEnter(to, from, next) {
            if (from.path === '/pay') {
                next()
            } else {
                next('/pay')
            }
        }
    },
    // 个人中心页面
    {
        name: 'Center',
        path: '/center',
        // 路由懒加载
        component: () => import("@/Pages/Center"),
        meta: { isShow: true },
        children: [
            {
                path: '/center',
                redirect: '/center/myorder'
            },
            {
                name: 'myOrder',
                path: 'myorder',
                // 路由懒加载
                component: () => import("@/Pages/Center/myOrder"),
                meta: { isShow: true }
            },
            {
                name: 'teamOrder',
                path: 'teamorder',
                // 路由懒加载
                component: () => import("@/Pages/Center/teamOrder"),
                meta: { isShow: true }
            },
        ]
    },
]