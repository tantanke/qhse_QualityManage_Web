import request from '../utils/request'

export const GetTasksList = (params) => {
  return request('/api/tasks', {
    params
  })
}
export const GetTasksList1 = (params) => {
  return request('/api/receive_tasks', {
    params
  })
}
//获取单个任务的所有计划
export const GetTasksPlan = (params) => {
  return request('/api/plan_detail', {
    params
  })
}
// export const GetTasksPlan = (id) => {
//   return request(`/api/plan_detail/${id}`)
// }
export const GetTaskDetail = (id) => {
  return request(`/api/tasks/${id}`)
}

export const DeleteTask = (id) => { 
  return request(`/api/tasks/${id}`, {
    method: 'delete'
  })
}

export const CreateTask = (data) => {
  return request('/api/tasks', {
    method: 'post', 
    data
  })
}

export const UpdateTask = (id, data) => {
  return request(`/api/tasks/${id}`, {
    method: 'put',
    data
  })
}

export const SubmitTaskPlan = (id) => {
  return request(`/api/plan/task_id/${id}`, {
    method: 'post'
  })
}

export const GetTaskPlan = (id) => {
  return request(`/api/plan/task_id/${id}`, {
    method: 'get'
  })
}

export const GetPlanByTaskId = (id) => {
  return request(`/api/plan/${id}`)
}

export const GetPlanContent = (id) => {
  return request(`/api/plan/tree/${id}`)
}
