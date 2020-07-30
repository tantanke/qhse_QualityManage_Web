import request from '../../utils/request'

export const queryDangerrecord = (data) => {
    return request('/api/query_dangerrecord', {
        method: 'get',
        data
    })
  }
  export const queryDangerrecordDate = (data) => {
    return request(`/api/query_dangerrecord?startDate=${data.startDate}?endDate=${data.endDate}`, {
        method: 'get',
        data
    })
  }

  export const queryDangerrecordCompany = (data) => {
    return request(`/api/query_dangerrecord?companyId=${data.companyId}`, {
        method: 'get',
        data
    })
  }
  
  export const queryDangerrecordTwo = (data) => {
    return request(`/api/query_dangerrecord?companyId=${data.companyId}?startDate=${data.startDate}?endDate=${data.endDate}`, {
        method: 'get',
        data
    })
  }
export const queryRegulationrecordDate = (data) => {
  return request(`/api/query_regulationrecord?startDate=${data.startDate}?endDate=${data.endDate}`, {
      method: 'get',
      data
  })
}

export const queryRegulationrecord = (data) => {
  return request(`/api/query_regulationrecord`, {
      method: 'get',
      data
  })
}

export const queryRegulationrecordCompany = (data) => {
  return request(`/api/query_regulationrecord?companyId=${data.companyId}`, {
      method: 'get',
      data
  })
}

export const queryRegulationrecordTwo = (data) => {
  return request(`/api/query_regulationrecord?companyId=${data.companyId}?startDate=${data.startDate}?endDate=${data.endDate}`, {
      method: 'get',
      data
  })
}
