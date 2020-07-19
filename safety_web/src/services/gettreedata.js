import request from '../utils/request'

export const GetCheckItem = () => {
    return request('/api/check_item/tree')
  }
export const GetTaskProcedure = () => {
    return request('/api/task_and_process/tree')
  }
export const GetProblemCategory = () => {
    return request('/api/problem_factor/tree ')
  }
export const GetCompany = () => {
    return request('/api/qhse_company/tree')
  }
export const Getdata_dict = () => {
    return request('/api/dictionary/tree')
  }
  