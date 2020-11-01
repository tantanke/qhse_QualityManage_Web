// 查询相关接口
import request from '@/utils/request'

// 查询质量管理
export const queryDashboardQualityManagement = (params) => {
    return request('/api/queryDashboardQualityManagement', {
      params
    })
  }


// 查询记录仪数据
export const queryDashboardRecorderManagement = (params) => {
    return request('/api/queryDashboardRecorderManagement', {
      params
    })
  }


// 查询标准进度管理
export const queryDashboardScheduleManagement = (params) => {
    return request('/api/queryDashboardScheduleManagement', {
      params
    })
  }
//查询公司信息
  export const GetqhseCompanytree = () => {
    return request('/api/qhse_company/tree', {
        method: 'get'
    })
  }
// 下载相关接口

// 下载质量管理
// 下载记录仪数据
// 下载标准进度管理

// 上传相关接口

// 上传质量管理
// 上传记录仪数据
// 上传标准进度管理
