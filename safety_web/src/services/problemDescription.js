import request from '../utils/request'

export const GetProblemDescriptionsList = (params) => {
  return request('/api/problemdescriptions', {
    params
  })
}

export const GetProblemDescriptionDetail = (id) => {
  return request(`/api/problemdescriptions/${id}`)
}

export const DeleteProblemDescription = (id) => { 
  return request(`/api/problemdescriptions/${id}`, {
    method: 'delete'
  })
}

export const CreateProblemDescription = (data) => {
  return request('/api/problemdescriptions', {
    method: 'post', 
    data
  })
}

export const UpdateProblemDescription = (id, data) => {
  return request(`/api/problemdescriptions/${id}`, {
    method: 'put',
    data
  })
}
export const SelectProblemDescriptions = (params) => {
  return request('/api/problemdescriptions/description', {
    params
  })
}