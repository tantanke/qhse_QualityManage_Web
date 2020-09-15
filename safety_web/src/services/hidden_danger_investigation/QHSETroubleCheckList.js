import request from '../../utils/request'

export const queryDangerrecord = (url,data) => {
    return request(url, {
        method: 'get',
        data
    })
  }

export const queryRegulationrecord = (url,data) => {
  return request(url, {
      method: 'get',
      data
  })
}

export const queryProblemDescription = (url,data) => {
  return request(url, {
      method: 'get',
      data
  })
}

// 违章图片获取
export const getRegulationImgUrls = (data) =>{
  return request(`/api/downloadRegulationFile?filename=${data}`, {
    method: 'get'
})
}

export const getDangerImgUrls = (data) =>{
  return request(`/api/downloadDangerFile?filename=${data}`, {
    method: 'get'
})
}