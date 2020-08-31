import request from '../utils/request'
//获取任务列表
export const getTaskList=(data)=>{
	return request('/api/getTaskList',{method:'get',data})
}
//接收任务
export const receiveTask=(param)=>{
	return request(`/api/receiveTask?taskId=${param}`,{method:'put'})
}

