import request from '../utils/request'
//查询报告编码
export const GetReportCodeRule = (params) => {
    return request('/api/querryRules/', {
      params
    })
  }
//新增报告编码
  export const CreateReportCodeRule = (data) => {
    return request('/api/addRule', {
      method: 'post', 
      data
    })
  }
//删除报告编码
  export const DeleteReportCodeRule = (id) => { 
    return request(`/api/deleteRule/${id}`, {
      method: 'delete'
    })
  }
//修改报告编码
  export const UpdateReportCodeRule = (id, data) => {
    return request(`/api/updateRule/${id}`, {
      method: 'put',
      data
    })
  }
//根据id获取包含编号编码
  export const GetReportCodeRuleDetail = (id) => {
    return request(`/api/querryRuleByID/${id}`)
  }

  //查询报告类型
export const GetReportType = (params) => {
  return request('/api/querryReportType/', {
    params
  })
}