import request from '../utils/request'

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
  