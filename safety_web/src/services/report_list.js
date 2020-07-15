import request from '../utils/request'
// export const GetReportList = (data) => {
//     return request('/api/reportList', {
//       method: 'post', 
//       data
//     })
//   }
  export const GetReportList = (params) => {
    return request('/api/reportList/', {
      params
    })
  }

  export const GetReportDetail = (id) => {
    return request(`/api/querryCompleteReport/${id}`)
  }