import request from '@/utils/request'

// 提交登记表单
export const submitBasicInfo =(data)=>{
	return request('/api/addQualityCheck',{method:'post',data})
}

// 获取所有的基本信息登记表
export const getBasicInfomation =()=>{
	return request('/api/queryAllTable',{method:'get'})
}
// 获取检查表
export const getCheckList =()=>{
	return request('/api/Quality_Check_List',{method:'get'})
}

// 编辑基本信息登记表节点
export const editBasicInfomation =(id,data)=>{
	return request(`/api/updateQualityCheck/${id}`,{method:'put',data})
}
// 删除基本信息登记表节点
export const deleteBasicInfomation =(param)=>{
	return request('/api/deleteQualityCheck/'+param,{method:'DELETE'})
}

// 推送基本信息登记表节点
export const pushBasicInfomation =(param)=>{
	return request('/api/pushTable/'+param,{method:'PUT'})
}
// 时间范围内查询部分基本信息登记表
export const inquireBasicInfomation =(data)=>{
	return request(`/api/queryTableByYearAndCom?checkedCompanyCode=${data.checkedCompanyCode}&checkDate=${data.checkDate}`,{method:'get',data})
}
