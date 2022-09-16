// 对于axios进行二次封装

// 引入axios
import axios from "axios"
// 引入进度条
import nprogress from "nprogress"
// 引入进度条样式
import "nprogress/nprogress.css"
// console.log(nprogress)

import store from "@/store"

// 利用axios对象方法中的create去创建一个axios实例
// request就是一个axios
const requests = axios.create({
    // 配置对象
    // 基础路径，发请求时路径会出现api
    baseURL: "/api",
    // 超时时间
    timeout: 5000
})

// 请求拦截器
requests.interceptors.request.use((config) => {
    // 开启进度条
    nprogress.start()
    // console.log(store.state.detail.uuid_token)
    //添加请求头
    if (store.state.detail.uuid_token) {
        // userTempId 和后台的商量
        config.headers.userTempId = store.state.detail.uuid_token
    }
    if (store.state.user.token) {
        // userTempId 和后台的商量
        config.headers.token = store.state.user.token
    }
    // config:配置对象，里面有一个属性headers请求头
    return config
})

// 响应拦截器
requests.interceptors.response.use((res) => {
    // 结束进度条
    nprogress.done()
    return res.data
}, (error) => {
    return Promise.reject(new Error('faile'))
})

// 暴露
export default requests