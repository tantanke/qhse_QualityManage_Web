import request from '../utils/request'

export const Createcheck_item = (data) => {
  return request('/api/check_item ', {
    method: 'post', 
    data
  })
}
export const delete_tree = (data) => {
  return request(`/api/check_item `, {
    method: 'delete', 
    data
  })
}
export const getcontent = (params) => {
  return request(`/api/check_item `, {
    params
  })
}
export const Createcontent = (data) => {
  return request('/api/check_item_standard ', {
    method: 'post', 
    data
  })
}