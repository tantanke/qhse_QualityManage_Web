import request from '@/utils/request'

export const Createcheck_list = (data) => {
  return request('/api/check_list ', {
    method: 'post', 
    data
  })
}
export const delete_tree = (data) => {
  return request(`/api/check_list/ `, {
    method: 'delete', 
    data
  })
}
export const getcontent = (params) => {
  return request(`/api/check_item `, {
    params
  })
}
export const Createcontent = (data) => {
  return request('/api/check_item_standard ', {
    method: 'post', 
    data
  })
}
//根据是否启用查询所有节点
export const GetCheckListTree = (param) => {
    return request('/api/check_list_tree/'+param,{method:'get'})
}
//更新节点状态
export const updateNodeStatus =(param)=>{
	return request('/api/deleteCheckList/'+param,{method:'put'})
}
//编辑节点内容
export const updateCheckList=(data)=>{
	return request('/api/updateCheckList',{method:'put',data})
}
//添加节点内容
export const addCheckListNode=(data)=>{
	return request('/api/addCheckListNode',{method:'post',data})
}
