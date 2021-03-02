import request from '../../utils/request'
export const queryAllTable=()=>{
	return request('/api/queryAllTable',{method:'get'})
}
export const queryCheckTreeByID=(param)=>{
	return request('/api/queryCheckTreeByID/'+param,{method:'get'})
}
export const queryQualityRecordList=(param)=>{
	return request('/api/qulity_check_record_query_by_checkId/'+param,{method:'get'})
}
export const queryAllPassTable=()=>{
	return request('/api/queryAllPassTable',{method:'get'})
}
//获取公司列表
export const GetCompany =(data)=>{
		return request('/api/qhse_company/tree',{method:'get',data}
		)
	}