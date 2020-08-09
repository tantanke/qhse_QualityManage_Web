import request from '../utils/request'
//获取公司列表
export const GetCompany =(data)=>{
	return request('/api/qhse_company/tree',{method:'get',data})
}
//获取全部员工信息
export const GetEmployee=(data)=>{
	return request('/api/employees',{method:'get',data})
}
//查询“文件宣贯计划”表，返回所有记录
export const queryPropagationPlan =(data)=>{
	return request('/api/queryPropagationPlan',{method:'get',data})
}
//根据文件宣贯id查询”文件宣贯计划细节“表，返回对应id的记录集合
export const queryPropagationDetailAll =(data)=>{
	return request(`/api/queryPropagationDetailAll?filePropagationId=${data.filePropagationID}`,{method:'get',data})
}
//根据推送用户id查询”文件宣贯计划细节“表，返回对应id的记录集合
export const getFilePropagationDetailList =(data)=>{
	return request('/api/getFilePropagationDetailList',{method:'get',data})
}
//新增“文件宣贯计划”记录
export const insertPropagationPlan =(data) =>{
	return request('/api/insertPropagationPlan',{method:'post',data})
}
//新增“文件宣贯计划细节”表记录
export const insertPropagationDetail =(data)=>{
	return request('/api/insertPropagationDetail',{method:'post',data})
}
//根据文件宣贯id删除“文件宣贯计划”表中对应记录
export const deletePropagationPlan =(param)=>{
	return request(`/api/deletePropagationPlan?filePropagationId=${param}`,{method:'delete'})
}
//根据文件宣贯计划细节id删除“文件宣贯计划细节”表中对应记录
export const deletePropagationDetail =(param)=>{
	return request(`/api/deletePropagationDetail?filePropagationDetailId=${param}`,{method:'delete'})
}
//更改”文件宣贯计划细节“表中对应记录阅读状态,并更改该记录的阅读时间
export const readPropagation =(param)=>{
	return request(`/api/readPropagation?detailId=${param}`,{method:'get'})
}
export const fileUpload =(data)=>{
	return request('/api/file_upload',{method:'post',data})
}
//下载文件
export const downloadFile =(param)=>{
	return request(`/api/downloadFilePropagationFile?fileName=${param}`,{method:'get'})
}