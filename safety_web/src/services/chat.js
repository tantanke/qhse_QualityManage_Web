import request from '../utils/request'



  export const SendMessage = (params) => {
    return request('/api/produce', {
      params
    })
  }


  export const newSendMessage = (params) => {
    return request('/notice_api', {
      params
    })
  }




