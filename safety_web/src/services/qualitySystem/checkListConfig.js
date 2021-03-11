import request from '../../utils/request'
//根据状态查询检查表树
export const queryCheckList = (param) => {
	return request('/api/Quality_Check_tree/' + param, {
		method: 'get'
	})
}
//根据nodeid更改对应node的状态
export const updateNodeStatus = (param) => {
	return request('/api/deleteQuality_Check/' + param, {
		method: 'put'
	})
}
//更新节点内容
export const updateNodeContent = (data) => {
	return request('/api/updateQuality_Check', {
		method: 'put',
		data
	})
}
//新增一个一个检查表项，根据data的当前节点编号来确定新增的是表？项目？内容？
export const addCheckListItem = (data) => {
	return request('/api/addQuality_Check', {
		method: 'post',
		data
	})
}
//上传文件
export const uploadFile = (data) => {
	return request('/api/QualityCheck_excel_upload', {
		method: 'post',
		data
	})
}
//2021-3-11 15:20，zhb,递归删除节点
export const deleteNode=(data)=>{
	return request('/api/deleteQuality_CheckNode/'+data,{method:'delete'})
}
