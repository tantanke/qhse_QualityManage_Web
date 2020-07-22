import request from '../utils/request'

export const addFileaduit = (data) => {
    return request('/api/add_fileaduit', {
        method: 'post',
        data
      })
  }

export const queryFileaduit = (data) => {
  return request('/api/query_fileaduit?year='+data.year/* +'&companyName='+data.companyName */, {
      method: 'get',
      data
    })
}
export const queryFileaduit2 = (data) => {
  return request('/api/query_fileaduit?year='+data.year+'&companyName='+data.companyName, {
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

export const getScore = (data) => {
  return request('/api/get_score',{
      method: 'get',
      data
    })
}

export const addFileaduitrecord = (data) => {
  return request('/api/add_fileaduitrecord',{
      method: 'post',
      data
    })
}

export const getStatus = (data) => {
  return request('/api/get_status',{
      method: 'get',
      data
    })
}