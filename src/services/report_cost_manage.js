import request from '../utils/request'

// TotalCost
export const CreateTotalCost = (data) => {
  return request('/api/total_cost_add', {
    method: 'post',
    data
  })
}
export const GetTotalCost = (params) => {
    return request('/api/total_cost_select/', {
      params
    })
}
export const UpdateTotalCost = (id, data) => {
    return request(`/api/total_cost_update/${id}`, {
        method: 'put',
        data
    })
}

// 单价
export const CreateUnitPrice = (data) => {
    return request('/api/unit_price_add', {
      method: 'post',
      data
    })
  }
export const GetUnitPriceList = (params) => {
    return request('/api/unit_price_select/', {
      params
    })
}
export const GetUnitPriceDetail = (id) => {
    return request(`/api/unit_price_detail/${id}`)
}
export const UpdateUnitPrice = (id, data) => {
    return request(`/api/unit_price_update/${id}`, {
        method: 'put',
        data
    })
}
export const DeleteUnitPrice = (id) => {
  return request(`/api/unit_price_delete/${id}`, {
      method: 'delete',
  })
}

// 类别总额
export const GetCostDetailList = (params) => {
    return request('/api/cost_detail_analysis/', {
      params
    })
}