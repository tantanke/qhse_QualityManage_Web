import request from '../../utils/request'

export const queryDangerrecord = (url,data) => {
    return request(url, {
        method: 'get',
        data
    })
  }

export const queryRegulationrecord = (url,data) => {
  return request(url, {
      method: 'get',
      data
  })
}

export const queryProblemDescription = (url,data) => {
  return request(url, {
      method: 'get',
      data
  })
}