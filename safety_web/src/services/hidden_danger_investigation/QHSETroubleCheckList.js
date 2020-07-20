import request from '../../utils/request'

export const queryDangerrecord = (data) => {
    return request('/api/query_dangerrecord', {
        method: 'get',
        data
    })
  }
export const queryRegulationrecord = (data) => {
  return request('/api/query_regulationrecord', {
      method: 'get',
      data
  })
}