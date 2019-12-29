import Cookies from 'js-cookie'
import store from '@/store'
import axios from 'axios'
import QS from 'qs'
const TokenKey = 'token'
// export async function getTokens() {
//   var token = ''
//   axios.post(process.env.VUE_APP_BASE_APIS + 'tunano/passport/connect/token', QS.stringify({
//     client_id: 'tulink',
//     client_secret: 'TuLink',
//     grant_type: 'client_credentials',
//     scope: 'ldc.lib'
//   }),
//   ).then(request => {
//     token = request.data.access_token
//     sessionStorage.tokens = JSON.stringify(request.data.access_token)
//     // return token
//   })
//   return token
// }
export async function getToken() {
  const token = Cookies.get(TokenKey)
  if (
    token &&
    Cookies.get('TOKEN_EXPIRED_TIME') - 300 === 3600
  ) {
    await store.dispatch('user/login', {
      username: Cookies.get('USER_NAME'),
      password: Cookies.get('PASS_WORD')
    })
    alert('123')
  }

  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  Cookies.remove('USER_NAME')
  Cookies.remove('PASS_WORD')
  Cookies.remove('GET_TOKEN_TIME')
  Cookies.remove('TOKEN_EXPIRED_TIME')
  return Cookies.remove(TokenKey)
}
