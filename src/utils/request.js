import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from './auth'
// import { getToken } from '@/utils/auth'
// import qs from 'qs'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // transformRequest: [
  //   function(oldData) {
  //     console.log(oldData)
  //     return oldData
  //   }
  // ],
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  async config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // console.log(store.getters.token, 'token ')
      config.headers['Authorization'] = 'Bearer ' + await getToken()
    }
    return config
  },
  error => {
    // do something with request error
    // console.log('123') // for debug
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response
    // if the custom code is not 20000, it is judged as an error.
    if (res.status !== 200) {
      Message({
        message: res.RstMsg || '请求错误',
        type: 'error',
        duration: 5 * 1000
      })
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.status === '01' || res.RstCode === 500 || res.RstCode === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.RstMsg || 'Error'))
    } else {
      // console.log(res)
      return res
    }
  },
  error => {
    // console.log('err12312' + error) // for debug
    if (error.response.status === 401) {
      MessageBox.confirm('请回到登录页面重新登录', '登录过期', {
        confirmButtonText: '重新登录',
        showCancelButton: false,
        showClose: false,
        lockScroll: false,
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    } else {
      Message({
        message: error.response.data.message,
        type: 'error',
        duration: 5 * 1000
      })
      // console.log(error.request)
      // console.log(error.response, '阿斯达多所')
      // var str = error.response.data.message.split(';')
      // console.log(str)
      // console.log(error)
      return Promise.reject(error)
    }
  }
)

export default service
