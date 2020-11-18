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
//获取核查细节
export const getNeedToCheckedDetails = (data) => {
  return request(`/api/getNeedToCheckedDetails?planId=${data.monitorPlanID}&date=${data.date}`, {
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
//获取详情t
export const getInputtedDetailInfo = (data) => {
  return request(`/api/getInputtedDetailInfo/${data.monitorPlanDetailID}`, {
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
//核查细节
export const getInputtedRecordDetailByDate = (data) => {
  return request(`/api/getInputtedRecordDetailByDate?detailId=${data.monitorPlanDetailID}&date=${data.date}`, {
    data
  })
}
//获取日期
export const getInputDates = (data) => {
  return request(`/api/getInputDates/${data.monitorPlanID}`, {
    data
  })
}
//统计界面接口如下
//获取核查详情
export const getCheckDetail = (data) => {
  return request(`/api/getCheckDetail?planId=${data.planId}&date=${data.date}`, {
    data
  })
}
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
export const getStatisticsInfoByDate = (data) => {
  return request(`/api/getStatisticsInfoByDate?date=${data.date}`,{data})
}
//删除
export const deleteSumData = (data) => {
  return request(`/api/deleteSumData?sumDataId=${data.sumDataId}`,{
    method:"delete",
    data
  })
}
//批量删除
export const deleteSumDataByDate = (data) => {
  return request(`/api/deleteSumDataByDate?date=${data.date}`,{
    method:"delete",
    data
  })
}
//日报
export const getDayReport = (data) => {
  return request(`/api/getDayReport?planId=${data.monitorPlanID}&date=${data.date}`,{
    data
  })
}
//结束按钮
export const endMonitorPlan  = (data) => {
  return request(`/api/endMonitorPlan?planId=${data.monitorPlanID}`, {
    method:'get',
    data
  })
}

// 手动录入远程计划细节
export const createNewDetail = (data) => {
    return request(`/api/createNewDetail`, {
        method:'post',
        data
    })
}

// 获取录入总数
export const getTotalInputTime = (planId) => {
    return request(`/api/getTotalInputTime?planId=${planId}`, {
        method:'get',
    })
}

// 远程计划监控数据 使用，用于获取录入和审核的全部细节
export const getInputAndCheckDetail = (planDetailId) => {
    return request(`/api/getInputAndCheckDetail?planDetailId=${planDetailId}`, {
        method:'get',
    })
}

// 删除录入细节
export const deleteInputInfo = (checkRecordId) => {
    return request(`/api/deleteInputInfo?checkRecordId=${checkRecordId}`, {
        method:'delete',
    })
}

// 获取监控项目数
export const getItemNum = (planId ) => {
    return request(`/api/getItemNum?planId=${planId }`, {
        method:'get',
    })
}

// 结束某一项监控细节
export const endPlanDetail = (detailId ) => {
    return request(`/api/endPlanDetail?detailId=${detailId }`, {
        method:'get',
    })
}
// 导出填写数据
export const downloadMonitorData = (data ) => {
    return request(`/api/downloadMonitorData?date=${data.date}&planID=${data.monitorPlanID}`, {
        method:'get',
    })
}