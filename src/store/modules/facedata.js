
const state = {
  // 源库
  id: '',
  deviceFaceLibraryCode: '',
  libCode: '',
  facenames: '',
  faceLibraryName: '',
  time: ''
}
const mutations = {
  newImg(state, msg) {
    state.id = msg.id
    state.deviceFaceLibraryCode = msg.deviceFaceLibraryCode
    state.libCode = msg.libCode
    state.facenames = msg.faceLibraryName
    state.time = msg.time
  }
}
const actions = {
  getNewNum(context, num) {
    context.commit('newImg', num)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
