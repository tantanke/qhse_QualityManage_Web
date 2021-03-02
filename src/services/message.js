import request from '../utils/request'

//更新消息为已读
export const updateMessage = (id) => {
    return request(`/api/message/${id}`, {
      method: 'put',
    })
  }
  //获取当前登陆人的所有信息
  export const allMessage = (params) => {
    return request('/api/message', {
      params
    })
  }
  //获取当前登陆人的所有未读消息数量
  export const notReadMessage = (params) => {
    return request('/api/message_count', {
      params
    })
  }
  //删除消息
  export const DeleteMessage = (id) => { 
    return request(`/api/message/${id}`, {
      method: 'delete'
    })
  }
// 当前 登录人一键已读信息
export const readMessage = () => {
  return request('/api/message/all', {
    method: 'put',
  })
}
//按状态查询消息
export const newMessage = (params) => {
  return request('/api/message/status', {
    params
  })
}