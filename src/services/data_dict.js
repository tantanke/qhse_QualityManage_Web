import request from '../utils/request'

export const Createdata_dict = (data) => {
  return request('/api/dictionary ', {
    method: 'post', 
    data
  })
}
export const delete_tree = (data) => {
  return request(`/api/dictionary`, {
    method: 'delete', 
    data
  })
  

}
