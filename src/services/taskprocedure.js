import request from '../utils/request'

export const Createtaskprocedure = (data) => {
  return request('/api/task_and_process', {
    method: 'post', 
    data
  })
}
export const delete_tree = (data) => {
  return request(`/api/task_and_process `, {
    method: 'delete', 
    data
  })
}
