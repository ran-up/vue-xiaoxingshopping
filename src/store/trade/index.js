import { findUserAddressList, reqShopInfo, reqSubmitOrder } from '@/api'
const state = {
    addressList: [],
    shopInfo: [],
    orderId: ''
}
const actions = {
    // 获取地址信息
    async userAddressList({ commit }) {
        let result = await findUserAddressList()
        if (result.code == 200) {
            commit('USERADDRESSLIST', result.data)
        }
    },
    // 获取用户商品信息
    async getShopInfo({ commit }) {
        let result = await reqShopInfo()
        if (result.code == 200) {
            commit('GETSHOPINFO', result.data)
        }
    },
    // 提交订单信息
    async submitOrder({ commit }, { tradeNo, data }) {
        let result = await reqSubmitOrder(tradeNo, data)
        if (result.code == 200) {
            commit('SUBMITORDER', result.data);
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    }
}
const mutations = {
    USERADDRESSLIST(state, value) {
        state.addressList = value
    },
    GETSHOPINFO(state, value) {
        state.shopInfo = value;
    },
    SUBMITORDER(state, value) {
        state.orderId = value;
    }
}
const getters = {
    detailArrayList(state) {
        return state.shopInfo.detailArrayList || []
    }
}
export default {
    state,
    actions,
    mutations,
    getters
}