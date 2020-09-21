import request from '../utils/request'
//远程监控新的功能的页面爷哭了
//下载管理界面接口
export const downloadMonitorDetailExcelTemplate = () => {
    return request('/api/downloadMonitorDetailExcelTemplate')
  }
//上传图片
  export const uploadScreenShot = (data) => {
    return request(`/api/uploadScreenShot`,{
      method:'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data
    })
  }
  export const getSumDataInTimePeriod = (data) => {
    return request(`/api/getSumDataInTimePeriod?startTime=${data.startTime}&endTime=${data.endTime}`)
  }
  export const updateMesData = (data) => {
    return request(`/api/updateMesData`,data)
  }