import request from '../../utils/request'

export const getCompany = (data) => {
	return request('/api/qhse_company/tree', {method: 'get',data})
}

export const queryTableByYearAndComAndPush = (data) => {
	return request(`/api/queryTableByYearAndComAndPush?checkedCompanyCode=${data.checkedCompanyCode}&checkDate=${data.checkDate}`, {method: 'GET'})
}
export const queryCheckTreeByID =(param)=>{
	return request('/api/queryCheckTreeByID/'+param,{method:'GET'})
}
//添加质量检查记录
export const addCheckRecord=(data)=>{
	return request('/api/qulity_check_record_add',{method:'post',data})
}
//修改审核计划
export const updateQualityCheck=(data)=>{
	return request('/api/updateQualityCheck',{method:'put',data})
}
//根据id查询质量检查记录
export const queryCheckRecord=(param)=>{
	return request('/api/qulity_check_record_query_by_id/'+param,{method:'get'})
}
//根据id删除质量检查记录
export const deleteCheckRecord=(param)=>{
	return request('/api/qulity_check_record_delete/'+param,{method:'delete'})
}
//根据id更新对应的质量检查记录
export const updateCheckRecord=(param,data)=>{
	return request('/api/qulity_check_record_udpate/'+param,{method:'put',data})
}
//新增质量检查记录符合记录
export const addQualityInformAndAttach=(data)=>{
	return request('/api/addQualityInform',{method:'post',data})
}
//根据checkID查询质量检查记录表
export const queryCheckRecordByCheckID=(param)=>{
	return request('/api/qulity_check_record_query_by_checkId/'+param,{method:'get'})
}
//增加证据附件
export const addQualityAttach=(data)=>{
	return request('/api/addQualityAttach',{method:'post',data})
}
export const downloadQualityAttach=(param)=>{
	return request(`/api/downloadQualityAttach?fileName=${param}`,{method:'get'})
}
//下达任务或者通过任务
export const issuedTable=(data)=>{
	return request('/api/issuedTable',{method:'put',data})
}
export const pictureDownload=(param)=>{
	return request(`/api/screenShotDownload?fileName=${param}`,{method:'get'})
}
//获取附件原文件名
export const getOriginFileName=(param)=>{
	return request(`/api/getOriginFileName?fileName=${param}`,{method:'get'})
}
//查询处于所有状态的表
export const queryAllTable=()=>{
	return request('/api/queryAllTable',{method:'get'})
}
//零星录入
export const addOddQualityCheck=(data)=>{
	return request('/api/addOddQualityCheck',{method:'post',data})
}
