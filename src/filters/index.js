// 服务模式
export function servicemode(status) {
  const statusMap = {
    0: 'V1-1',
    1: 'V1-2',
    2: 'V2-1',
    3: 'V2-2',
    4: 'V3'
  }
  return statusMap[status]
}
// 人脸库状态
export function facestate(status) {
  const statusMap = {
    0: '在用',
    1: '暂停'
  }
  return statusMap[status]
}
// 人脸库类型
export function Librarytype(status) {
  const statusMap = {
    0: '持久库',
    1: '临时库'
  }

  return statusMap[status]
}
// 人脸库类型
export function faceResource(status) {
  const statusMap = {
    0: '增量同步资源包',
    1: '全量同步资源包'
  }

  return statusMap[status]
}

// 复选框显示长度
export function ellipsis(value) {
  if (!value) return ''
  if (value.length > 8) {
    return value.slice(0, 8) + '...'
  }
  return value
}
// 时间转换
export function formatDate(value) {
  return (new Date(`${value}Z`)).toLocaleString('zh', { hour12: false })
}
// 特征码类型
export function codeType(status) {
  const statusMap = {
    0: ' 读者证',
    1: '身份证'
  }
  return statusMap[status]
}
