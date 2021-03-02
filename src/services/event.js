import request from '../utils/request'

export const GetEventList = (params) => {
  return request('/api/event_record', {
    params
  })
}
export const GetEventDetail = (id) => {
  return request(`/api/event_record/${id}`)
}
export const DeleteEvent = (id) => { 
  return request(`/api/event_record/${id}`, {
    method: 'delete'
  })
}

export const CreateEvent = (data) => {
  return request('/api/event_record', {
    method: 'post', 
    data
  })
}
export const UpdateEvent = (id, data) => {
    return request(`/api/event_record/${id}`, {
      method: 'put',
      data
    })
  }