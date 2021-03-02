import request from '../utils/request'

// 获取未完成报告信息
// export const GetReportCodeList = (data) => {
//   return request('/api/reportList', {
//     method: 'post',
//     data
//   })
// }
export const GetReportCodeList = () => {
  return request('/api/incompeletReportCodes/', {
  })
}
//未完成报告录入样品信息
// export const CompleteReport = (data) => {
//     return request('/api/completeReport', {
//       method: 'post',
//       data
//     })
//   }
export const CompleteReport = (data) => {
  return request(`/api/completeReport`, {
      method: 'put',
      data
  })
}
