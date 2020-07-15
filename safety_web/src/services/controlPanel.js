import request from '../utils/request'

//得到所有数据（事故数、事件数、问题数）
export const GetTotalNum = (params) => {
  return request('/api/counts', {
    params
  })
}

//得到每月的数据（事故数、事件数、问题数）
export const GetMonthData = (params) => {
  return request('/api/count_month', {
    params
  })
}

//得到总数据（检查数、整改数、验证数、重大隐患数）
export const GetTotalData = (params) => {
  return request('/api/home_problem', {
    params
  })
}

//得到上周和本周的数据（检查数、整改数、验证数、重大隐患数）
export const GetWeekData = (params) => {
  return request('/api/day_echart', {
    params
  })
}

//得到每个季度和全年的数据（违章作业，违章指挥，违反劳动纪律，管理缺陷，设备缺陷，环境不良）
export const GetProblemClassData = (params) => {
  return request('/api/home_season', {
    params
  })
}

//得到全年每个月的普遍性数据（普遍性、重复性、新出现）
export const GetProblemRepeatData = (params) => {
  return request('/api/problem_repeat', {
    params
  })
}

//获取最新重大问题10条
export const GetProblemList = (params) => {
  return request('/api/problems', {
    params
  })
}

//获取最新任务10条
export const GetTasksList = (params) => {
  return request('/api/tasks', {
    params
  })
}

//获取最新巡检任务10条
export const GetRouteTasks = (params) => {
  return request('/api/accident_task_record', {
    params
  })
}