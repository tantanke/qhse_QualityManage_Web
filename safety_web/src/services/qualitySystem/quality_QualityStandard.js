import request from '../../utils/request'

// export const QuerryQHSEChildRules = (params) => {
//     return request('/api/querryQHSEChildRules/', {
//       params
//     })
//   }
//编辑更新节点数据
export const updateQHSEElement =(data)=>{
	return request('/api/updateQHSEElement',{method:'put',data})
}
//添加一个节点
export const addQHSEElement=(data)=>{
	return request('/api/addQHSEElement',{method:'post',data})
}
//更新节点启用状态
export const updateQHSEElementStatus=(param)=>{
	return request('/api/updateQHSEElementStatus/'+param,{method:'put'})
}
//根据启用状态查询要素表
export const querryQhseElements=(param)=>{
	return request('/api/querryQhseElements/'+param,{method:'get'})
}
  export const QuerryQHSEChildRules = (status) => {
    return request(`/api/querryQHSEChildRules/${status}`)

  }

  export const addQHSERule = (data) => {
    return request('/api/addQHSERule ', {
      method: 'post', 
      data
    })
  }


  export const updateQHSERule = (data) => {
    return request('/api/updateQHSERule ', {
      method: 'put', 
      data
    })
  }

  export const updateQHSERuleStatus = (data) => {
    return request('/api/updateQHSERuleStatus', {
      method: 'put', 
      data
    })
  }

  export const querryQHSEproblemDiscription = (data) => {
    return request(`/api/queryQualityProDis/${data.code}`, {
      method: 'get', 
      data
    })
  }
// 增加问题描述
  export const addQHSEproblemDiscription = (data) => {
    return request('/api/addQualityProDis', {
      method: 'post', 
      data
    })
  }

// 编辑问题描述
export const deleteQHSEproblemDiscription = (data) => {
  return request(`/api/updateQualityProDis/${data.id}`, {
    method: 'delete', 
    data
  })
}
// 删除问题描述
export const updateQHSEproblemDiscription = (data) => {
  return request(`/api/deleteQualityProDis`, {
    method: 'put', 
    data
  })
}