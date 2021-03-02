import request from '../../../utils/request'

//得到数据
export const GetCompanyProblemClassAnalysis = (params) => {
  return request('/api/company_problem_analysis', {
    params
  })
}

//得到公司
export const GetCompany = (params) => {
  return request('/api/company/tree', {
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

