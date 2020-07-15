import request from '../utils/request'

export const GetRoleDictionary = () => {
    return request('/api/roles')
  }
  
  