import request from '../utils/request'

//得到指标体系查询数据
export const GetIndexSystem = (params) => {
    return request('/api/index_system', {
      params
    })
  }