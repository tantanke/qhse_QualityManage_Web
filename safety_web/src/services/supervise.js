import request from '../utils/request'

//趋势图
export const useDeviceTrend = () => {
    return request('/api/useDeviceTrend', {
      method:'get'
    })
  }

  export const deviceCompare = (data) => {
    return request('/api/deviceCompare', {
      method:'get',
      data
    })
  }