// 对于axios进行二次封装，不过此处的是对mock进行封装

// 引入axios
import axios from "axios"
// 引入进度条
import nprogress from "nprogress"
// 引入进度条样式
import "nprogress/nprogress.css"
// console.log(nprogress)

// 利用axios对象方法中的create去创建一个axios实例
// request就是一个axios
const requests = axios.create({
    // 配置对象
    // 基础路径，发请求时路径会出现api
    baseURL: "/mock",
    // 超时时间
    timeout: 5000
})

// 请求拦截器
requests.interceptors.request.use((config) => {
    // 开启进度条
    nprogress.start()
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