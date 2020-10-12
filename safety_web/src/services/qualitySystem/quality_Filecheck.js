import request from '../../utils/request'

export const addFileaduit = (data) => {
    return request('/api/add_qualityfileaduit', {
        method: 'post',
        data
      })
  }

export const queryFileaduit = (data) => {
  return request('/api/query_qualityfileaduit?year='+data.year/* +'&companyName='+data.companyName */, {
      method: 'get',
      data
    })
}
export const queryFileaduit2 = (data) => {
  return request(`/api/query_qualityfileaduit?companyName=${data.companyName}&year=${data.year}`, {
      method: 'get',
      data
    })
}

export const querryQhseElement = (data) => {
  return request(`/api/quality_queryYearElement?companyCode=${data.companyCode}&year=${data.year}`, {
      method: 'GET',
      data
    })
}

// 待修改
export const addFileaduitrecord = (data) => {
  return request('/api/add_qualityfileaduitrecord',{
      method: 'post',
      data
    })
}

export const getStatus = (data) => {
  return request(`/api/quality_get_status?fileAuditId=${data.fileAuditId}&code=${data.code}`,{
      method: 'GET',
      data
    })
}

export const updateCheckstatus = (data) => {
  return request('/api/quality_update_status',{
      method: 'put',
      data
    })
}

export const addProblemDescription = (data) => {
  return request('/api/add_quality_problemDescription',{
      method: 'post',
      data
    })
}

export const queryRecordId = (data) => {
  return request(`/api/queryqualityrecordId?fileAuditId=${data.fileAuditId}&code=${data.code}`,{
      method: 'get',
      data
    })
}