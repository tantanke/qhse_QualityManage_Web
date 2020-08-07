import request from '../utils/request'

// export const QuerryQHSEChildRules = (params) => {
//     return request('/api/querryQHSEChildRules/', {
//       params
//     })
//   }
  export const QuerryQHSEChildRules = (status) => {
    return request(`/api/querryQHSEChildRules/${status}`)

  }

  export const addQHSERule = (data) => {
    return request('/api/addQHSERule ', {
      method: 'post', 
      data
    })
  }

  export const updateQHSERule = (data) => {
    return request('/api/updateQHSERule ', {
      method: 'put', 
      data
    })
  }

  export const updateQHSERuleStatus = (data) => {
    return request('/api/updateQHSERuleStatus', {
      method: 'put', 
      data
    })
  }

  export const querryQHSEproblemDiscription = (data) => {
    return request(`/api/querryQHSEproblemDiscription/${data.code}`, {
      method: 'get', 
      data
    })
  }
// 增加问题描述
  export const addQHSEproblemDiscription = (data) => {
    return request('/api/addQHSEproblemDiscription', {
      method: 'post', 
      data
    })
  }

// 编辑问题描述
export const deleteQHSEproblemDiscription = (data) => {
  return request(`/api/deleteQHSEproblemDiscription/${data.id}`, {
    method: 'delete', 
    data
  })
}
// 删除问题描述
export const updateQHSEproblemDiscription = (data) => {
  return request(`/api/updateQHSEproblemDiscription/${data.qHSE_ManagerSysElementProblemDescription_ID}`, {
    method: 'put', 
    data
  })
}