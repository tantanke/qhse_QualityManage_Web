import request from '../utils/request'

export const GetDictionary = (params) => {
  return request('/api/dictionary', {
    params
  })
}
export const GetRoleDictionary = () => {
  return request('/api/roles')
}