import request from '../utils/request'

export const GetTaskProcedure = () => {
    return request('/api/leader/check_item/tree')
  }
  export const Createtaskprocedure = (data) => {
    return request('/api/leader/check_item/tree ', {
      method: 'post', 
      data
    })
  }
  export const delete_tree = (data) => {
    return request(`/api/leader/check_item/tree  `, {
      method: 'put', 
      data
    })
  }