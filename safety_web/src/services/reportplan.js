import request from '../utils/request'

export const CreateReport = (data) => {
    return request('/api/addReport', {
      method: 'post', 
      data
    })
  }
  export const UpdateReport = (data) => {
    return request('/api/updateReport', {
      method: 'put', 
      data
    })
  }
  export const GetReport = (params) => {
    return request('/api/reportList', {
      params
    })
  }
  export const DeleteReport = (id) => { 
    return request(`/api/deleteReport/${id}`, {
      method: 'delete'
    })
  }
  export const GetReportDetail = (id) => { 
    return request(`/api/querryCompleteReport/${id}`, {
      method: 'get'
    })
  }
