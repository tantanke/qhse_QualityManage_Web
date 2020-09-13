import request from '../utils/request'

//添加
export const createNewMonitorPlan = (data) => {
    return request('/api/createNewMonitorPlan', {
      method:'post',
      data
    })
  }
  //查询
export const getMonitorPlanList = () => {
    return request('/api/getMonitorPlanList')
  }
//删除计划
export const deletePlan = (data) => {
    return request(`/api/deletePlan/${data.monitorPlanID}`, {
      method:'delete',
      data
    })
}
//获取细节
export const getDetails = (data) => {
  return request(`/api/getDetails/${data.monitorPlanID}`, {
    method:'get',
    data
  })
}
//批量上传
export const uploadMonitorPlanExcel= (data) => {
  return request(`/api/uploadMonitorPlanExcel`, {
    method:'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data:data
  })
}
//修改细节
export const updateMonitorPlanDetail = (data) => {
  return request(`/api/updateMonitorPlanDetail`, {
    method:'put',
    data
  })
}
//删除细节
export const deletePlanDetail = (data) => {
  return request(`/api/deletePlanDetail/${data.monitorPlanDetailID}`, {
    method:'delete',
    data
  })
}
//获取当天详情
//获取详情
export const getInputDetailInfo = (data) => {
  return request(`/api/getInputDetailInfo/${data.monitorPlanID}`, {
    data
  })
}
//更新当天细节
export const inputDetail = (data) => {
  return request(`/api/inputDetail`, {
    method:'post',
    data
  })
}
//编辑细节与输入核查
export const updateInputtedDetailInfo = (data) => {
  return request(`/api/updateInputtedDetailInfo`, {
    method:'put',
    data
  })
}
//获取核查详情
export const getCheckDetail = (data) => {
  return request(`/api/getCheckDetail/${data.monitorPlanID}`, {
    data
  })
}
//统计页面
//获取所有统计日期信息
export const getAllSumDate = () => {
  return request(`/api/getAllSumDate`)
}
//统计批量上传
export const uploadMesSumDataExcel= (data) => {
  return request(`/api/uploadMesSumDataExcel`, {
    method:'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data:data
  })
}
//获取当天信息
export const getStaticsInfoByDate = (data) => {
  return request(`/api/getStaticsInfoByDate`,{data})
}
//删除
export const deleteSumData = (data) => {
  return request(`/api/deleteSumData`,{
    method:"delete",
    data
  })
}