import request from '../utils/request'

export const GetWorkloadAnalysis = (params) => {
    return request('/api/workload_statistics/', {
      params
    })
}