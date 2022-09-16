import { reqGetGoodsInfo, reqAddOrUpdateShopCart } from '@/api'
import { getUUID } from '@/utils/uuid_token'

const state = {
    goodsInfo: {},
    // 临时身份（游客）
    uuid_token: getUUID()
}
const actions = {
    async getgoodsInfo({ commit }, skuId) {
        let { code, data } = await reqGetGoodsInfo(skuId)
        // console.log(code,data)
        if (code == 200) {
            commit("GETGOODSINFO", data)
        }
    },
    // 这样写是因为需要在组件中进行成功或失败调用相应的数据
    async addOrUpdateShopCart({ commit }, { skuId, skuNum }) {
        let { code } = await reqAddOrUpdateShopCart(skuId, skuNum)
        if (code == 200) {
            console.log('ok')
        } else {
            return Promise.reject(new Error('faile'))
        }
    }
}
const mutations = {
    GETGOODSINFO(state, value) {
        state.goodsInfo = value || {}
    }
}
const getters = {
    categoryView(state) {
        return state.goodsInfo.categoryView || {}
    },
    skuInfo(state) {
        return state.goodsInfo.skuInfo || {}
    },
    spuSaleAttrList(state) {
        return state.goodsInfo.spuSaleAttrList || []
    }
}

export default {
    state,
    actions,
    mutations,
    getters
}