import request from '../utils/request'

//得到指标体系查询数据
export const GetIndexSystem = (params) => {
    return request('/api/accident_type', {
      params
    })
  }
  
//绘制柱状图，折线图（按时间）
export const GetTime = (params) => {
  return request('/api/accident_month', {
    params
  })
}

//绘制柱状图（按单位）
export const GetCompanyData = (params) => {
  return request('/api/accident_company', {
    params
  })
}