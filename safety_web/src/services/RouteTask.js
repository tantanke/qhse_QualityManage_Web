import request from '../utils/request'

export const GetRouteTasks = (params) => {
  return request('/api/route_task', {
    params
  })
}

export const UpdateRouteTask = (id, data) => {
  return request(`/api/route_task/${id}`, {
    method: 'put',
    data
  })
}

export const DeleteRouteTask = (id) => { 
  return request(`/api/route_task/${id}`, {
    method: 'delete'
  })
}

export const CreateRouteTask = (data) => {
  return request('/api/route_task', {
    method: 'post', 
    data
  })
}

export const GetRouteTaskDetail = (id) => {
  return request(`/api/route_task/${id}`)
}