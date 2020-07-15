import request from '../utils/request'


export const AddQHSEReport = (data) => {
  return request(`/api/addQHSEReport`, {
      method: 'post',
      data
  })
}

export const QuerryQHSEReportElements = (params) => {
  return request('/api/querryQHSEReportElements/', {
    params
  })
}

export const UpdateQHSEReportElements = (data) => {
    return request(`/api/updateQHSEReportElements`, {
        method: 'put',
        data
    })
}

