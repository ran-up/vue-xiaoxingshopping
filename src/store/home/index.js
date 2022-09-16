import { reqCategoryList, reqBannerList, reqFloorList } from "@/api"

// 存储数据的地方
const state = {
    // 一级菜单数据数组
    categoryList: [],
    // 轮播图图片数据数组
    bannerList: [],
    // 家用电器数据数组
    floorList: []
}
// 书写一些业务逻辑
const actions = {
    // 使用api里面的接口函数向服务器发请求，获取数据
    async categoryList({ commit }) {
        let result = await reqCategoryList()
        // console.log(result)
        if (result.code === 200) {
            // 遍历出来的一级菜单过多，舍去最后一个
            // 或者调小列表高度
            /* if ( result.data.length >= 16 ) {
                result.data.length = 16
            } */
            commit('CATEGORYLIST', result.data)
        }
    },
    // 轮播图图片
    async getBannerList({ commit }) {
        let { code, data } = await reqBannerList()
        // console.log(result)
        if (code == 200) {
            commit('GETBANNERLIST', data)
        }
    },
    // 家用电器数据
    async getFloorList({ commit }) {
        let { code, data } = await reqFloorList()
        // console.log({ code, data })
        if (code == 200) {
            commit('GETFLOORLIST', data)
        }
    }
}
// 修改state的唯一手段
const mutations = {
    // 一级菜单
    CATEGORYLIST(state, value) {
        state.categoryList = value
    },
    // 轮播图
    GETBANNERLIST(state, value) {
        state.bannerList = value
    },
    // 家用电器数据
    GETFLOORLIST(state, value) {
        state.floorList = value
    },
}
// 简化数据仓库数据，初浅理解为计算属性
const getters = {}

export default {
    state,
    actions,
    mutations,
    getters
}