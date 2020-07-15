import request from '../utils/request'

export const GetProblemList = (params) => {
    return request('/api/problems', {
      params
    })
  }
export const GetProblemDetail = (id) => {
    return request(`/api/problems/${id}`)
  }

//更新问题
export const UpdateRectifyProblem = (id, data) => {
  return request(`/api/rect_problems/${id}`, {
    method: 'put',
    data
  })
}
//更新问题
export const UpdateVerifyProblem = (id, data) => {
  return request(`/api/verify_problems/${id}`, {
    method: 'put',
    data
  })
}
//根据状态过滤一部分整改问题api/v1/problem_by_status2
export const ProblemStatus = (params) => {
  return request('/api/problem_by_status_my', {
    params
  })
}

export const RectifyProblem = (params) => {
  return request('/api/problem_by_status', {
    params
  })
}