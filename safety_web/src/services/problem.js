import request from '../utils/request'

export const GetProblemDetail = (id) => {
  return request(`/api/problems/${id}`)
}

export const GetProblemList = (params) => {
    return request('/api/problems', {
      params
    })
  }
export const GetProblemList1 = (params) => {
    return request('/api/problem_condition', {
      params
    })
  }
export const GetProblemList2 = (params) => {
    return request('/api/problems_my_company', {
      params
    })
  }
export const UpdateProblem = (id, data) => {
    return request(`/api/problems/${id}`, {
        method: 'put',
        data
    })
}
export const DeleteProblem = (problem_id) => {
  return request(`/api/problems/${problem_id}`, {
      method: 'delete',
  })
}

