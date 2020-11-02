// 查询相关接口
import request from '@/utils/request'
import doloadFile from '@/utils/doloadFile'

// 查询质量管理
export const queryDashboardQualityManagement = (data) => {
  return request('/api/queryDashboardQualityManagement?', {
    method:'post',
    data
  })
  }


// 查询记录仪数据
export const queryDashboardRecorderManagement = (data) => {
    return request('/api/queryDashboardRecorderManagement', {
      method:'post',
      data
    })
  }


// 查询标准进度管理
export const queryDashboardScheduleManagement = (data) => {
  return request('/api/queryDashboardScheduleManagement', {
    method:'post',
    data
  })
  }
//查询公司信息
  export const GetqhseCompanytree = () => {
    return request('/api/qhse_company/tree', {
        method: 'get'
    })
  }
// 下载相关接口
// 下载标准进度管理
export const downloadDashboardScheduleManagementTemplate = () => {
  return doloadFile('/api/downloadDashboardScheduleManagementTemplate', {
      method: 'get'
  })
}
// 下载质量管理
export const downloadDashboardQualityManagementTemplate = () => {
  return doloadFile('/api/downloadDashboardQualityManagementTemplate', {
      method: 'get'
  })
}
// 下载记录仪数据
export const downloadDashboardRecorderManagementTemplate = () => {
  return doloadFile('/api/downloadDashboardRecorderManagementTemplate', {
      method: 'get'
  })
}
// 下载相关函数 
export const downloadfile = (filename,blob) => {
                const fileName = filename + ".xls";
                const elink = document.createElement("a"); // 创建的标签
                elink.download = fileName;
                elink.style.display = "none";
                elink.href = URL.createObjectURL(blob); // 创建url
                document.body.appendChild(elink); // 把 创建的标签追加到body里
                elink.click();
                URL.revokeObjectURL(elink.href); // 释放URL 对象
                document.body.removeChild(elink); // 移除标签
}

// 上传相关接口

// 上传质量管理
// 上传记录仪数据
// 上传标准进度管理
