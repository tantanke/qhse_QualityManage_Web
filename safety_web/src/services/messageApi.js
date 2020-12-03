import request from '../utils/request'

//获取消息
export const getReceiveMessageList = (pageNum) => {
    return request(`/api/getReceiveMessageList?pageNum=${pageNum}`, {
      method: 'get',
    })
  }
//阅读消息
  export const readMessage = (data) => {
    return request(`/api/readMessage/${data.messageId}`, {
      method: 'put',
      data
    })
  }

  export const getReceiveMessageCnt = () => {
    return request(`/api/getReceiveMessageCnt`, {
      method: 'get',
    })
  }