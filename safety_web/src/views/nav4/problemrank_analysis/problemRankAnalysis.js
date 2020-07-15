import request from '../../../utils/request'

//得到数据
export const GetProblemRankAnalysis = (params) => {
  return request('/api/problem_level_analysis', {
    params
  })
}

//得到公司
export const GetCompany = (params) => {
  return request('/api/company/tree ', {
  params
})
}