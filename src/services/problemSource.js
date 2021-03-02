import request from '../utils/request'

export const GetProblemSourceList = (params) => {
  return request('/api/problem_sources', {
    params
  })
}

export const GetProblemSourceListDetail = (id) => {
  return request(`/api/problem_sources/${id}`)
}

export const DeleteProblemSource = (id) => { 
  return request(`/api/problem_sources/${id}`, {
    method: 'delete'
  })
}

export const CreateProblemSource = (data) => {
  return request('/api/problem_sources', {
    method: 'post', 
    data
  })
}
export const UpdateProblemSource = (id, data) => {
    return request(`/api/problem_sources/${id}`, {
      method: 'put',
      data
    })
  }
  export const SelectProblemSourceListDetail = (params) => {
    return request('/api/problem_sources/sourceName',{
    params  
    })
  }

