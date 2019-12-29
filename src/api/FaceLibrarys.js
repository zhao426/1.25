import request from '@/utils/request'
// 人脸库列表数据 
export function FaceLibrarysData(libCode, id, deviceLibCode, name, skip, top) {
  return request({
    url: '/v1/ldc/face/FaceLibrarys/query',
    method: 'get',
    params: {
      libCode,
      id,
      deviceLibCode,
      name,
      skip,
      top
    }
  })
}
// 新增
export function addFaceLibrarys(data) {
  return request({
    url: '/v1/ldc/face/FaceLibrarys/api',
    method: 'post',
    data
  })
}
// 删除
export function FaceLdelete(id, pwd) {
  return request({
    url: '/v1/ldc/face/FaceLibrarys',
    method: 'delete',
    params: {
      id,
      pwd
    }
  })
}
// 人脸列表数据
export function FaceLibrarysDatasss(libCode, deviceFaceLibraryCode, cardNo, skip, top) {
  return request({
    url: '/v1/ldc/face/Faces/query',
    method: 'get',
    params: {
      libCode,
      deviceFaceLibraryCode,
      cardNo,
      skip,
      top
    }
  })
}
// 修改
export function updateFace(data) {
  return request({
    url: '/v1/ldc/face/Faces/api',
    method: 'post',
    data
  })
}
// 删除人脸
// export function deleteFaces(data) {
//   return request({
//     url: ' /v1/ldc/face/Faces',
//     method: 'post',
//     data
//   })
// }
// 获取同步资源包列表
export function resource_bundle(data) {
  return request({
    url: '/v1/ldc/face/Synchronization/query',
    method: 'post',
    data
  })
}
// 手动成功全量包
export function resource_create(data) {
  return request({
    url: '/v1/ldc/face/Synchronization/create',
    method: 'post',
    data
  })
}
// 获取关联图书馆
export function Organization(data) {
  return request({
    url: '/v1/ldc/Organization/api',
    method: 'post',
    data
  })
}
// 搜索图书馆
export function Library_enquiry(libCode) {
  return request({
    url: '/v1/ldc/face/FaceLibrarys/query/libcode',
    method: 'get',
    params: {
      libCode
    }
  })
}
