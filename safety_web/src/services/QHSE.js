import request from '../utils/request'

export const GetProblemDetail = (id) => {
  return request(`/api/qhse_problem_detail/${id}`)
}

export const GetProblemList = (params) => {
    return request('/api/qhse_problem_select/', {
      params
    })
  }
export const UpdateProblem = (id, data) => {
    return request(`/api/qhse_problem_update/${id}`, {
        method: 'put',
        data
    })
}
export const DeleteProblem = (id) => {
  return request(`/api/qhse_problem_delete/${id}`, {
      method: 'delete',
  })
}
