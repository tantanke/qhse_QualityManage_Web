import request from '../utils/request'

//获取正在服务的版本号
export const GetVersionNumber = (params) => {
  return request('/api/app_version/1', {
    params
  })
}

//发布最新数据配置
export const PublishServerVersion = (data) => {
  return request('/api/app_sql',{
    method: 'put',
    data
  })
}

//获取所有历史版本号
export const GetPreviousVersion = (params) => {
  return request('/api/app_version/0', {
    params
  })
}

//回到历史版本
export const UpdateServerVersion = (id) => {
  return request(`/api/app_enable/${id}`)
}

//上传APK文件
export const UploadApk = (data) => {
  return request('/api/app_apk_time', {
    method: 'post', 
    data
  })
}