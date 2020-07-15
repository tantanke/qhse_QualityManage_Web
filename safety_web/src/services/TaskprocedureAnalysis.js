import request from '../utils/request'

//得到数据
export const GetTaskprocedureAnalysis = (params) => {
  return request('/api/task_process', {
    params
  })
}