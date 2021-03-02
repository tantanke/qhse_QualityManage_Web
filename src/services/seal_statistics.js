import request from '../utils/request'

export const GetSealsAnalysis = (params) => {
    return request('/api/company_seal_statistics/', {
      params
    })
}