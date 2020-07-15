import request from '../utils/request'


//提交表单（川庆钻探）
export const CreateProblem = (data) => {
  return request('/api/qhse_problem_add', {
    method: 'post',
    data
  })
}
//获取不标准文件名
export const regulation = (params) => {
  return request('/api/regulation_name_code', {
    params
  })
}

// export const CreateProblem = (data) => {
//   return request('/api/problems_add', {
//     method: 'post',
//     data
//   })
// }

export const GetTasks = (params) => {
  return request('/api/tasks/name', {
    params
  })
}
export const GetDescriptions = (params) => {
  return request('/api/problem_descriptions', {
    params
  })
}

//获取任务名称、工序名称
export const GetTaskProcess = (params) => {
  return request('/api/tasks/process', {
    params
  })
}
export const GetProcesses = (params) => {
  return request('/api/processes/child_processes', {
    params
  })
}
//得到公司
export const GetCompanys = (params) => {
    return request('/api/company', {
    params
  })
}
//得到问题原因
export const GetProblemSources = (params) => {
  return request('/api/problems/reason', {
  params
})
}

//得到问题类别1
export const GetProblemClass1s = (params) => {
  return request('/api/problems_class_level_one', {
  params
})
}

//得到问题类别2
export const GetProblemClass2s = (params) => {
  return request('/api/problems_class1/problems_level_two', {
  params
})
}

//得到问题描述
export const GetDescription = (params) => {
  return request('/api/problem_descriptions', {
  params
})
}

export const GetCheckContentsTree = () => {
  return request('/api/check_item/tree')
}

export const GetCompanysbyplan = (id) => {
  return request(`/api/plan_company/${id} `)
}

//根据问题描述获取问题级别，扣款，扣分
export const Getproblemdescriptions = (id) => {
  return request(`/api/problemdescriptions/${id} `)
}

//获取承包商公司
export const Getcontractor = (params) => {
  return request('/api/contracting/company', {
  params
})
}

//新增承包商公司
export const Createcontractor  = (data) => {
  return request('/api/contracting/company', {
    method: 'post', 
    data
  })
}

//更新承包商公司
export const Updatecontractor = (id, data) => {
  return request(`/api/company_tree/${id}`, {
    method: 'put',
    data
  })
}