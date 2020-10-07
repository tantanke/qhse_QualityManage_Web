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

// 图片显示
export const showPicture =(param)=>{
	return request(`/api/pictureDownload?fileName=${param}`,{method:'get'})
}

// 文件下载
export const downloadFile =(param)=>{
	return request(`/api/downloadQualityAttach?fileName=${param}`,{method:'get'})
}