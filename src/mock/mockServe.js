// 模拟假数据
// 引入mock.js
import Mock from 'mockjs'
// 引入JSON数据文件
// webpack默认暴露：图片资源、JSON数据 (里面不能书写export关键字)
import banner from './banner.json'
import floor from './floor.json'

// mock数据
// 第一个参数：请求的地址
// 第二个参数：请求的数据
Mock.mock("/mock/banner", {code: 200, data: banner})
Mock.mock("/mock/floor", {code: 200, data: floor})