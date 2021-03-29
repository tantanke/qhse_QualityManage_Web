import request from '@/utils/request'

// 查询表单
export const inquireProblemForm =(data)=>{
	return request(`/api/queryTableByYearAndComAndIssued?checkedCompanyCode=${data.checkedCompanyCode}&checkDate=${data.checkDate}&checkEndDate=${data.checkEndDate}`,{method:'get',data})
}
// 获取所有的基本信息登记表
export const getBasicInfomation =()=>{
	return request('/api/queryAllTable',{method:'get'})
}
