import request from '../utils/request'

export const GetFileList = (params) => {
  return request('/api/rule_regulation', {
    params
  })
}

export const DeleteFile = (id) => { 
  return request(`/api/rule_regulation/${id}`, {
    method: 'delete'
  })
}

export const CreateFile = (data) => {
  return request('/api/rule_regulation', {
    method: 'post', 
    data
  })
}
