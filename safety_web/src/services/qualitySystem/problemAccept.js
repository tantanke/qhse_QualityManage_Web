import request from '@/utils/request'

// 查询表单
export const inquireProblemForm =(data)=>{
	return request(`/api/queryTableByYearAndComAndIssued?checkedCompanyCode=${data.checkedCompanyCode}&checkDate=${data.checkDate}`,{method:'get',data})
}