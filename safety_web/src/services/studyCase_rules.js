import request from '../utils/request'

export const GetFileList = (params) => {
  return request('/api/regulation', {
    params
  })
}

export const DeleteFile = (id) => { 
  return request(`/api/regulation/${id}`, {
    method: 'delete'
  })
}

export const CreateFile = (data) => {
  return request('/api/regulation', {
    method: 'post', 
    data
  })
}

export const GetFileDetail = (id) => {
  return request(`/api/regulation/${id}`)
}

export const UpdateFile = (data) => {
  return request(`/api/regulation`, {
    method: 'put',
    data
  })
}
