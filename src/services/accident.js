import request from '../utils/request'

//得到全部事故
export const GetAccidentList = (params) => {
  return request('/api/accident_record', {
    params
  })
}
//根据id得到单个事故详情
export const GetAccidentDetail = (id) => {
  return request(`/api/accident_record/${id}`)
}
//根据id删除事故
export const DeleteAccident = (id) => { 
  return request(`/api/accident_record/${id}`, {
    method: 'delete'
  })
}
//新增一个事故
export const CreateAccident = (data) => {
  return request('/api/accident_record', {
    method: 'post', 
    data
  })
}
//根据id修改单个事故
export const UpdateAccident  = (id, data) => {
  return request(`/api/accident_record/${id}`, {
    method: 'put',
    data
  })
}
