import request from '@/utils/request'


// 查询表单
export const getProblemReviewList =(param)=>{
	return request('/api/qulity_check_record_query_by_checkId/' + param,{method:'get'})
}
// 更新质量检查记录
export const updateQualityCheckRecord =(id,data)=>{
	return request(`/api/qulity_check_record_udpate/${id}`,{method:'put',data})
}

// 审核通过
export const acceptProblemReviewData =(data)=>{
	return request(`/api/backTable`,{method:'put',data})
}

// 审核打回
export const refuseProblemReviewData =(data)=>{
	return request(`/api/backTable`,{method:'put',data})
}