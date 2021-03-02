import request from '../../../utils/request'

//得到数据
export const GetResponseEmployee= (params) => {
  return request('/api/response_employee', {
    params
  })
}
//得到公司
export const GetCompany = (params) => {
  return request('/api/company/tree ', {
  params
})
}