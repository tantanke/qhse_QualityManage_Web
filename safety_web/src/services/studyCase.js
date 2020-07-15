import request from '../utils/request'

//得到全部学习案例
export const GetStudyCasesList = (params) => {
  return request('/api/study_case', {
    params
  })
}
//根据id得到单个案例详情
export const GetStudyCaseDetail = (id) => {
  return request(`/api/study_case/${id}`)
}

//根据id删除案例
export const DeleteStudyCase = (id) => { 
  return request(`/api/study_case/${id}`, {
    method: 'delete'
  })
}
//新增一个学习案例
export const CreateStudyCase = (data) => {
  return request('/api/study_case', {
    method: 'post', 
    data
  })
}
//根据id修改单个案例
export const UpdateStudyCase = (id, data) => {
  return request(`/api/study_case/${id}`, {
    method: 'put',
    data
  })
}

//获取问题原因编码、问题原因
export const GetProblemSourceNames = (params) => {
    return request('/api/problem_sources', {
      params
  })
}

//获取任务名称、工序名称
export const GetTasks = (params) => {
  return request('/api/tasks/process', {
    params
  })
}
export const GetProcesses = (params) => {
  return request('/api/processes/child_processes', {
    params
  })
}
