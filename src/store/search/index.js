import { reqGetSearchInfo } from '@/api'

const state = {
    searchList: {}
}
const actions = {
    async getSearchList({ commit }, value = {}) {
        let result = await reqGetSearchInfo(value)
        if (result.code == 200) {
            commit('GETSEARCHLIST', result.data)
        }
    }
}
const mutations = {
    GETSEARCHLIST(state, value) {
        state.searchList = value
    }
}
const getters = {
    attrsList(state) {
        return state.searchList.attrsList
    },
    goodsList(state) {
        // 防止没网时返回undefined，所以给一个[]，以防万一
        return state.searchList.goodsList || []
    },
    trademarkList(state) {
        return state.searchList.trademarkList
    }
}

export default {
    state,
    actions,
    mutations,
    getters
}