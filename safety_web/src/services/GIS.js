import request from '../utils/request'
//得到全部事故
export const GetGIStList = (params) => {
    return request('/api/accident_task_record', {
      params
    })
  }