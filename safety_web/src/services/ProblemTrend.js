import request from '../utils/request'

//得到数据
export const GetProblemTrend = (params) => {
  return request('/api/problem_trend', {
    params
  })
}