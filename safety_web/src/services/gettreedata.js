import request from '../utils/request'

export const GetCheckItem = () => {
    return request('/api/check_item/tree')
  }
export const GetTaskProcedure = () => {
    return request('/api/task_and_process/tree')
  }
export const GetProblemCategory = () => {
    return request('/api/problem_factor/tree ')
  }
// export const GetCompany = () => {
//     return request('/api/company/tree ')
//   }
export const GetCompany =(data)=>{
		return request('/api/qhse_company/tree',{method:'get',data}
		)
	}
export const GetQhseChildElement =(data)=>{
	return request('/api/querryQhseChildElement',{method:'get',data})
}
	export const GetQhseElement=(data)=>{
		  return request('/api/querryQhseElement',{method:'get',data})
	}
export const Getdata_dict = () => {
    return request('/api/dictionary/tree')
  }
//返回的data为新增的记录
export const insertQhseTable =(data)=>{
	return request('/api/companyYearManager',{method:'post',data})
}
//返回的值为要删除的记录的id
export const deleteQhseTable =(param)=>{
	return request('/api/delete_companyYearManager/'+param,{method:'DELETE'})
}
//data数组第一个为操作的记录id，后面为选中的要素节点
export const addQHSEYearElement =(data)=>{
	return request('/api/addQHSEYearElement',{method:'post',data})
}
export const GetQhseTable =(data)=>{
	return request('/api/show_companyYearManager',{method:'get',data})
}
export const publishTableElement =(param)=>{
	return request('/api/approval_companyYearManager/'+param,{method:'PUT'})
}