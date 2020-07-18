import request from '../../utils/request'

export const GetCheckRecordTree = () => {
    return request('/api/check_record_tree', {
        method: 'get'
    })
  }
export const GetqhseCompanytree = () => {
  return request('/api/qhse_company/tree', {
      method: 'get'
  })
}
export const getChecklistTree = () => {
  return request('/api/check_list_tree', {
      method: 'get'
  })
}
export const addCheckRecord = (data) => {
  return request('/api/check_record', {
      method: 'post',
      data
  })
}
export const editCheckRecord = (data) => {
  return request('/api/check_list_tree/'+ data.id, {
      method: 'put',
      data
  })
}
export const deleteCheckRecord = (data) => {
  return request('/api/check_record/' + data.id, {
      method: 'delete',
      data
  })
}