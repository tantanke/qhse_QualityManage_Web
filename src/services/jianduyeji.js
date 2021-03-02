import request from '../utils/request'

export const GetCompanyList = (params) => {
  return request('/api/oversight_company', {
    params
  })
}

export const GetEmployeeList = (params) => {
    return request('/api/oversight_employee', {
      params
    })
  }