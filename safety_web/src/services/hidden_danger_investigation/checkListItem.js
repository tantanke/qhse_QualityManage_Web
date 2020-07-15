import request from '@/utils/request'

export const Createcheck_list = (data) => {
  return request('/api/check_list ', {
    method: 'post', 
    data
  })
}
export const delete_tree = (data) => {
  return request(`/api/check_list/ `, {
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