import request from '../utils/request'

export const CreateCompany_tree = (data) => {
  return request('/api/company_tree', {
    method: 'post', 
    data
  })
}
export const delete_tree = (companyCode) => {
  return request(`/api/company_tree/${companyCode}`, {
    method: 'delete', 
  })
}
