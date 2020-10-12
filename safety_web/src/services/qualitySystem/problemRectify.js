import request from '@/utils/request'

// 查询表单
export const getProblemRectifyList =(param)=>{
	return request('/api/qulity_check_record_query_by_checkId/' + param,{method:'get'})
}

// 更新质量检查记录
export const updateQualityCheckRecord =(id,data)=>{
	return request(`/api/qulity_check_record_udpate/${id}`,{method:'put',data})
}

// 问题整改总推送
export const modifyPush =(id)=>{
	return request(`/api/modifyPush/`+id,{method:'put'})
}

//根据文件id查询文件名
export const getOriginFileName=(param)=>{
	return request(`/api/getOriginFileName?fileName=${param}`,{method:'get'})
}
// 查询质量监督检查表
export const getQualityCheckList=()=>{
	return request(`/api/Quality_Check_tree/0`,{method:'get'})
}
