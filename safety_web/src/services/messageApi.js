import request from '../utils/request'

//获取消息
export const getReceiveMessageList = (pageNum) => {
    return request(`/api/getReceiveMessageList?pageNum=${pageNum}`, {
      method: 'get',
    })
  }
//阅读消息
  export const readMessage = (data) => {
    return request(`/api/readMessage?messageId=${data.messageId}`, {
      method: 'get',
      data
    })
  }

  export const getReceiveMessageCnt = () => {
    return request(`/api/getReceiveMessageCnt`, {
      method: 'get',
    })
  }