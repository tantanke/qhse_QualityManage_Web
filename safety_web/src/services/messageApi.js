import request from '../utils/request'

//获取消息
export const getReceiveMessageList = (pageNum) => {
    return request(`/api/getReceiveMessageList?pageNum=${pageNum}`, {
      method: 'get',
    })
  }
//阅读消息
  export const readMessage = (id) => {
    return request(`/api/readMessage/${id}`, {
      method: 'get',
    })
  }