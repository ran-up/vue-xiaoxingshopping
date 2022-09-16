import { reqShopCartInfo, reqDeleteShopCart, reqIsCheckeds } from '@/api'

const state = {
    shopCartList: []
}
const actions = {
    // 获取数据
    async getShopCartList({ commit }) {
        let result = await reqShopCartInfo()
        // console.log(result)
        if (result.code === 200) {
            commit('GETSHOPCARTLIST', result.data)
        }
    },
    // 请求删除数据 需要在组件中点击提交数据
    async getDeleteShopCart({ commit }, { skuId }) {
        let { code } = await reqDeleteShopCart(skuId)
        if (code == 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    // 切换商品选中状态 需要在组件中点击提交数据
    async isCheckeds({ commit }, { skuID, isChecked }) {
        let { code } = await reqIsCheckeds(skuID, isChecked)
        if (code == 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    // 删除所有选中的商品
    getDeleteAllCheckCart({ dispatch, getters }) {
        // console.log(context)
        // console.log(getters, getters.shopCartList.cartInfoList)
        let promiseAll = []
        getters.shopCartList.cartInfoList.forEach(item => {
            // console.log(item.isChecked)
            let promise = item.isChecked == 1 ? dispatch('getDeleteShopCart', { skuId: item.skuId }) : ''
            // 返回一个Promise对象
            // console.log(result)
            promiseAll.push(promise)
            // console.log(promiseAll)
        });
        return Promise.all(promiseAll)
    },
    // 对【全选】进行操作
    getCheckAllCart({ dispatch, getters }, isChecked) {
        let promiseAll = []
        getters.shopCartList.cartInfoList.forEach(item => {
            // console.log(item.isChecked)
            let promise = dispatch('isCheckeds', { skuID: item.skuId, isChecked })
            // 返回一个Promise对象
            // console.log(result)
            promiseAll.push(promise)
            // console.log(promiseAll)
        });
        return Promise.all(promiseAll)
    }
}
const mutations = {
    GETSHOPCARTLIST(state, value) {
        state.shopCartList = value
    }
}
const getters = {
    shopCartList(state) {
        return state.shopCartList[0] || {}
    }
}

export default {
    state,
    actions,
    mutations,
    getters
}