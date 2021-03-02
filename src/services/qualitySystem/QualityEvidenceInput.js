import request from '../../utils/request'
//根据状态查询检查表树
export const quality_query_elementReviewer = (data) => {
	return request(`/api/quality_query_elementReviewer?companyCode=${data.companyCode}&year=${data.year}`, {
        method: 'get',
        data
	})
}