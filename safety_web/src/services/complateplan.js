import request from '../utils/request'

export const GetCompanys = (params) => {
  return request('/api/company', {
    params
  })

}


export const GetCheckContentsTree = () => {
  return request('/api/check_item/tree')
}

export const SubmitNewPlan = (data) => {
  return request('/api/plan', {
    method: 'post',
    data
  })
}
// export const updateNewPlan = (data) => {
//   return request('/api/plan', {
//     method: 'put',
//     data
//   })
// }
export const updateNewPlan = (id,data) => {
  return request(`/api/plan/${id}`, {
    method: 'put',
    data
  })
}




// export const SubmitNewPlan = (id) => {
//   return request(`/api/plan/task_id/${id}`, {
//     method: 'post',
//   })
// }

export const GetTreeNodeId = (id) => {
  return request(`/api/plan/node/${id}`, {
    method: 'get',
  })
}

