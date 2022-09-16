import { reqGetCode, userRegisterInfo, reqUserLogin, reqUserInfo, reqOutLogin } from '@/api'
const state = {
    code: '',
    token: localStorage.getItem('TOKEN'),
    //用户名
    nickName: ''
}
const actions = {
    // 获取验证码
    async getCode({ commit }, phone) {
        let result = await reqGetCode(phone)
        if (result.code == 200) {
            commit('GETCODE', result.data)
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    // 注册信息
    async registerInfo({ commit }, obj) {
        let result = await userRegisterInfo(obj)
        if (result.code == 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    // 用户登录
    async userLogin({ commit }, data) {
        let result = await reqUserLogin(data)
        if (result.code == 200) {
            commit('USERLOGIN', result.data.token)
            // console.log(result.data.token)
            //以后开发的时候:经常的登录的成功获取token【持久化存储】
            localStorage.setItem('TOKEN', result.data.token);
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    //获取用户信息
    async getUserInfo({ commit }) {
        let result = await reqUserInfo();
        // console.log(result)
        if (result.code == 200) {
            commit('GETUSERINFO', result);
        }
    },
    // 退出登陆
    async outLogin({ commit }) {
        let result = await reqOutLogin()
        if (result.code == 200) {
            commit('OUTLOGIN')
        } else {
            return Promise.reject(new Error('faile'))
        }
    }
}
const mutations = {
    GETCODE(state, value) {
        state.code = value
    },
    USERLOGIN(state, value) {
        state.token = value
    },
    GETUSERINFO(state, value) {
        state.code = value.code
        state.nickName = value.data.nickName
    },
    OUTLOGIN(state) {
        state.token = ''
        state.nickName = ''
        localStorage.removeItem('TOKEN')
    }
}
const getters = {}

export default {
    state,
    actions,
    mutations,
    getters
}