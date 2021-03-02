import request from '../utils/request'

export const Createproblem_factor = (data) => {
  return request('/api/problem_factor', {
    method: 'post', 
    data
  })
}
export const delete_tree = (data) => {
  return request(`/api/problem_factor `, {
    method: 'delete', 
    data
  })
}
