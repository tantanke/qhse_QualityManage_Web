import request from '../utils/request'

export const addFileaduit = (data) => {
    return request('/api/add_fileaduit', {
        method: 'post',
        data
      })
  }

export const queryFileaduit = (data) => {
  return request('/api/query_fileaduit?year='+data.year+'&companyCode='+data.companyCode, {
      method: 'get',
      data
    })
}

export const updateStatus = (data) => {
  return request('/api/v3/update_status', {
      method: 'put',
      data
    })
}
export const querryQhseElement = () => {
  return request('/api/querryQhseElement', {
      method: 'get'
    })
}

export const updateScore = (data) => {
  return request('/api/update_score',{
      method: 'PUT',
      data
    })
}