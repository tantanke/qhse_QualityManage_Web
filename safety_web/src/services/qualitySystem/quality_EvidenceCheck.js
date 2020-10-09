import request from '../../utils/request'

export const qhse_company_tree =() =>{
    return request('/api/qhse_company/tree')
  }

  //获取审核要素
export const query_elementReviewer =(data)=>{
    return request(`/api/quality_show_check/0`,{
      data
    })
}
//获取批准要素
  export const query_elementReviewers =(data)=>{
    return request(`/api/quality_show_check/1`,{
      data
    })
}
//审核人通过?
export const pass_elementReviewer =(data)=>{
  return request(`/api/passOrNoquality/0`,{
    method:'post',
    data
  })
}
export const approval_elementReviewer =(data)=>{
  return request('/api/passOrNoquality/1',{
    method:'post',
    data
  })
}
//显示信息
export const show_elementReviewer =(data)=>{
  return request(`/api/quality_query_Attach?id=${data.quality_CompanyYearManagerSysElement_ID}`,{
    data
  })
}
//////未写
//下载文件
export  const downloadElementFile = (data)=>{
  return request(`/api/downloadElementFile?fileName=${data}`,{data})
}
//查看已审核或者批准
export  const show_approve_check = (data)=>{
  return request(`/api/quality_show_approve_check?companyCode=${data.companyCode}&year=${data.year}&status=${data.status}`,{data})
}
//获取全要素
export  const showAllElement = (data)=>{
  return request(`/api/showQualityAllElement?companyCode=${data.companyCode}&year=${data.year}`,{data})
}
