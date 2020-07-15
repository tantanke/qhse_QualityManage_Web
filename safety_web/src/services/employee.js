import request from '../utils/request'

export const GetEmployees = (params) => {
  return request('/api/employees', {
    params
  })
}