// import { removeToken } from '@/utils/auth'

// const state = {
//   token: '',
//   getTokenTime: 0,
//   tokenExpireTime: 0,
//   name: '',
//   avatar: ''
// }

// const mutations = {
//   SET_TOKEN: (state, data) => {
//     state.token = data.access_token
//     state.getTokenTime = Date.now()
//     state.tokenExpireTime = data.expires_in
//   },
//   SET_NAME: (state, name) => {
//     state.name = name
//   },
//   SET_AVATAR: (state, avatar) => {
//     state.avatar = avatar
//   }
// }

// const actions = {

//   // remove token
//   resetToken({ commit }) {
//     return new Promise(resolve => {
//       commit('SET_TOKEN', '')
//       removeToken()
//       resolve()
//     })
//   }
// }

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }
import { login } from '@/api/user'
import { setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import Cookies from 'js-cookie'

const state = {
  token: Cookies.get('token'),
  name: '',
  avatar: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
    sessionStorage.name = JSON.stringify(state.name)
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ account: username, password: password, libCode: 'CN-430000-HBLIB' }).then(response => {
        Cookies.set('USER_NAME', username)
        Cookies.set('PASS_WORD', password)
        Cookies.set('GET_TOKEN_TIME', Date.now())
        Cookies.set('TOKEN_EXPIRED_TIME', response.data.keepTime)
        commit('SET_TOKEN', response.data.accessToken)
        setToken(response.data.accessToken)
        commit('SET_NAME', username)
        resolve()
      }).catch(error => {
        // _this.$message(error.response.data.message)
        reject(error)
      })
    })
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // commit('SET_NAME', 'wahh')
      // commit('SET_AVATAR', 'asd')
      resolve()
    })
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      removeToken()
      resetRouter()
      resolve()
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      sessionStorage.removeItem('name')
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

