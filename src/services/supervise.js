import request from '../utils/request'

//趋势图
export const useDeviceTrend = (data) => {
    return request(`/api/useDeviceTrend/${data.companyName}`, {
      method:'get',
      data
    })
  }

  export const deviceCompare = (data) => {
    return request('/api/deviceCompare', {
      method:'get',
      data
    })
  }