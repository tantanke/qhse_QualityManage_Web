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