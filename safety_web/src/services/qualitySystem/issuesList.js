import request from '../../utils/request'
export const queryTable=(data)=>{
	return request(`/api/queryTableByYearAndComAndIssued?checkedCompanyCode=${data.checkedCompanyCode}&checkDate=${data.checkDate}`,{method:'get'})
}
export const queryQualityCheckTree=(param)=>{
	return request('/api/Quality_Check_tree/'+param,{method:'get'})
}
export const queryQualityRecordList=(param)=>{
	return request('/api/qulity_check_record_query_by_checkId/'+param,{method:'get'})
}
export const getOriginFileName=(param)=>{
	return request(`/api/getOriginFileName?fileName=${param}`,{method:'get'})
}