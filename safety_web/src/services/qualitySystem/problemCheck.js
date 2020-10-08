import request from '@/utils/request'

// 查询表单
export const inquireProblemReviewForm =(data)=>{
	return request(`/api/queryByYearComAndModify?checkedCompanyCode=${data.checkedCompanyCode}&checkDate=${data.checkDate}`,{method:'get',data})
}