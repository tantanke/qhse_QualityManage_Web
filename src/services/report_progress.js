import request from '../utils/request'

export const GetReportProgress = (params) => {
    return request('/api/countReports', {
      params
    })
  }