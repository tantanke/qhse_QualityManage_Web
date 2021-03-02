import request from '../utils/request'

export const GetTasksObjectList = (params) => {
  return request('/api/task_object', {
    params
  })
}

export const GetTaskObjectDetail = (id) => {
  return request(`/api/task_object/${id}`)
}

export const DeleteObjectTask = (id) => { 
  return request(`/api/task_object/${id}`, {
    method: 'delete'
  })
}

export const CreateObjectTask = (data) => {
  return request('/api/task_object', {
    method: 'post', 
    data
  })
}
// 此id非彼id
export const UpdateObjectTask = (data) => {
  return request(`/api/task_object/id`, {
    method: 'put',
    data
  })
}
export const GetTaskObject = (params) => {
    return request('/api/task_object/taskObjectName', {
      params
    })
  }