const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  tokens: state => state.user.tokens,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  iddata: state => state.facedata.id,
  deviceFaceLibraryCode: state => state.facedata.deviceFaceLibraryCode,
  libCode: state => state.facedata.libCode,
  facenames: state => state.facedata.facenames,
  times: state => state.facedata.time
}
export default getters
