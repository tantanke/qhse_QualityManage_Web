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
export const queryFileaduit3 = () => {
  return request('/api/query_fileaduit', {
      method: 'get'
    })
}
export const queryFileaduit2 = (data) => {
  return request(`/api/query_fileaduit?companyName=${data.companyName}&year=${data.year}`, {
      method: 'get',
      data
    })
}

export const querryQhseElement = (data) => {
  return request(`/api/querryYearElement?companyCode=${data.companyCode}&year=${data.year}`, {
      method: 'GET',
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
  return request(`/api/get_status?fileAuditId=${data.fileAuditId}&code=${data.code}`,{
      method: 'GET',
      data
    })
}

export const updateCheckstatus = (data) => {
  return request('/api/update_checkstatus',{
      method: 'put',
      data
    })
}
export const noPassReasonFileAudit = (data) => {
  return request('/api/noPassReasonFileAudit',{
      method: 'put',
      data
    })
}

export const addProblemDescription = (data) => {
  return request('/api/add_problemDescription',{
      method: 'post',
      data
    })
}

export const queryRecordId = (data) => {
  return request(`/api/queryRecordId?fileAuditId=${data.fileAuditId}&code=${data.code}`,{
      method: 'get',
      data
    })
}